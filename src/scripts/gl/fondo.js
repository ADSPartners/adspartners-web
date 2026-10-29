// El fondo vivo (Emotion): un canvas fijo detrás de todo lo que no es la portada, solo en escritorio.
// - Base máquina: noche, rejilla de 64 px y un campo de glifos mono, muy tenue y quieto.
// - El ratón no pinta: mueve. Un fluido pequeño empuja los glifos y, por donde pasa, los excita (más densos, un
//   poco más claros y rosados) con una niebla rosa casi invisible. Se nota que algo se ha movido, no tapa nada.
//   Los textos grandes reaccionan aparte (vivo.js).
// - Nada se mueve solo: si nadie mueve el ratón, no se pinta (el canvas se queda con el último fotograma).
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { gsap } from 'gsap';
import { Fluido } from './fluido.js';
import { pintarGlifos } from './capas.js';

const GLIFOS = ' .·:-=+10#@';
const NIVEL = { sim: 64, tinte: 256, iteraciones: 10, curl: 4, disipVel: 1.2, disipTinte: 2.4 };
const FUERZA = 2000;
const VIDA = 2.6;   // segundos que se sigue pintando después del último movimiento (lo que tarda en calmarse)

const VERT = /* glsl */ `#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;
uniform vec2 uRes; uniform float uDpr; uniform float uCelda; uniform float uGlifosN; uniform float uIntro;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main () {
  vec2 uv = vUv;
  vec2 vel = texture(tVel, uv).xy;
  float tinte = texture(tTinte, uv).r;
  if (isnan(vel.x) || isnan(vel.y) || isinf(vel.x) || isinf(vel.y)) vel = vec2(0.0);
  if (isnan(tinte) || isinf(tinte)) tinte = 0.0;
  vel = clamp(vel, vec2(-2000.0), vec2(2000.0));
  float luz = smoothstep(0.02, 0.45, tinte);

  // Rejilla quieta; los glifos, empujados por el fluido
  vec2 q = uv * uRes;
  float paso = 64.0 * uDpr;
  float rej = max(1.0 - step(uDpr, mod(q.x, paso)), 1.0 - step(uDpr, mod(q.y, paso)));
  vec2 px = q - vel * 0.02 * uDpr;
  vec2 cel = floor(px / uCelda);
  vec2 den = fract(px / uCelda);
  float v = ruido(cel * 0.09) * 0.7 + ruido(cel * 0.021 + 7.0) * 0.3;
  // Por donde pasa el ratón, los glifos se excitan: suben a los más densos
  float idx = floor(clamp(v + luz * 0.55, 0.0, 0.999) * uGlifosN);
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;

  vec3 col = cNoche;
  col = mix(col, cCrema, rej * 0.045);
  col = mix(col, mix(cCrema, cRosa, luz * 0.7), glifo * (0.03 + v * 0.07 + luz * 0.26));
  col = mix(col, cRosa, luz * 0.045);

  color = vec4(mix(cNoche, col, uIntro), 1.0);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export async function crearFondo() {
  const html = document.documentElement;
  const canvas = document.querySelector('[data-fondo]');
  if (!canvas) return null;

  try { await document.fonts.load('400 12px "Geist Mono"'); } catch (e) { /* con la letra que haya */ }

  let renderer;
  try {
    renderer = new Renderer({ canvas, webgl: 2, dpr: 1, alpha: false, antialias: false, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  if (!renderer.isWebgl2) return null;
  const gl = renderer.gl;

  let W = innerWidth, H = innerHeight;
  renderer.setSize(W, H);
  const tex = (image) => new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });

  let fluido = null;
  try { fluido = new Fluido(renderer, NIVEL); } catch (e) { return null; }

  const u = {
    tTinte: { value: fluido.tinte }, tVel: { value: fluido.velocidad },
    tGlifos: { value: tex(pintarGlifos(GLIFOS)) },
    uRes: { value: [gl.canvas.width, gl.canvas.height] }, uDpr: { value: renderer.dpr },
    uCelda: { value: 12 * renderer.dpr }, uGlifosN: { value: GLIFOS.length }, uIntro: { value: 0 },
    cNoche: { value: hex('#120D0A') }, cCrema: { value: hex('#E7E2DA') }, cRosa: { value: hex('#F5CBD7') },
  };
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: u, depthTest: false, depthWrite: false }) });

  // El ratón mueve el fondo; la portada tiene lo suyo, así que encima de ella no se pinta
  const p = { x: -1, y: -1, px: -1, py: -1, movido: false, ultimo: -99 };
  let ahora = 0;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    if (p.x < 0) { p.px = e.clientX; p.py = e.clientY; }
    p.x = e.clientX; p.y = e.clientY; p.movido = true; p.ultimo = ahora;
  }, { passive: true });

  let portadaTapa = true;
  const portada = document.getElementById('portada');
  if (portada) new IntersectionObserver(([en]) => { portadaTapa = en.intersectionRatio > 0.97; }, { threshold: [0, 0.5, 0.97, 1] }).observe(portada);
  else portadaTapa = false;

  const pintar = () => {
    u.tTinte.value = fluido.tinte; u.tVel.value = fluido.velocidad;
    renderer.render({ scene: malla, sort: false, frustumCull: false });
  };

  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now();
    const dt = Math.min(1 / 30, (t - t0) / 1000);
    t0 = t;
    ahora += dt;
    if (document.hidden || portadaTapa || html.classList.contains('en-umbral')) { p.movido = false; return; }
    if (ahora - p.ultimo > VIDA) return;
    if (p.movido) {
      const dx = p.x - p.px, dy = p.y - p.py;
      p.px = p.x; p.py = p.y; p.movido = false;
      const d = Math.hypot(dx / W, dy / H);
      if (d > 0) fluido.splat(p.x / W, 1 - p.y / H, (dx / W) * FUERZA * (W / H), (-dy / H) * FUERZA, Math.min(0.45, 0.12 + d * 6), 0.0014);
    }
    fluido.paso(dt);
    pintar();
  });

  // Primer fotograma: la máquina en reposo, que aparece con un fundido
  gsap.to(u.uIntro, { value: 1, duration: 1.2, ease: 'power2.out', onUpdate: pintar });
  html.classList.add('fondo-gl');

  let espera = null;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      W = innerWidth; H = innerHeight;
      renderer.setSize(W, H);
      u.uRes.value = [gl.canvas.width, gl.canvas.height];
      fluido.redimensionar(gl.canvas.width / gl.canvas.height);
      pintar();
    }, 160);
  });

  return { pintar };
}
