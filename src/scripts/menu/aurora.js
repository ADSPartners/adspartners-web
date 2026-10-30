// El menú es un viaje. Al abrirlo, las letras de la página se difuminan y queda la puesta de sol de la portada; la
// cámara va hacia el sol hasta que todo es luz, y de esa luz sale el cielo de verdad: sube por la atmósfera (el
// inspector dice la altitud y la capa), se ve la curva de la Tierra y las estrellas, gira del atardecer a la noche y se
// mete en una aurora. Vuela por ella entre cortinas de luz y al final esperan cuatro puntos, uno por página: apuntar a
// uno acerca la cámara y tiñe la aurora de su color (el de una emisión real); pinchar te lleva volando hasta él.
// Todo es un shader (la foto, el cielo, la Tierra, la aurora volumétrica y los puntos), con la cámara llevada desde
// aquí. El viento solar sale de la visita (rastro.js) y mueve la aurora; suena su «coro del amanecer».
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { gsap } from 'gsap';
import { rastro } from '../rastro.js';

// Dónde espera cada punto, respecto al sitio donde se para la cámara (km; la cámara mira hacia -z)
const PUNTOS = {
  tech: [-25, 30, -82],
  proyectos: [28, 40, -98],
  brand: [-27, -8, -86],
  about: [26, -2, -82],
};
const REPOSO = [0, 112, -260];   // donde se para la cámara: dentro de la aurora, justo por encima de su borde de abajo
const SOL_UV = [0.506, 0.369];   // dónde está el sol en la foto de la portada (medido en la imagen)
const CAPAS = [[0, 'troposfera'], [12, 'estratosfera'], [50, 'mesosfera'], [85, 'termosfera · aquí empiezan las auroras']];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
// Para la luz del shader, en lineal: un color de pantalla mezclado tal cual se ensucia (el rojo salía marrón)
const luz = (hex) => rgb(hex).map((v) => v ** 2.2);
const mezcla = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const suave = (x) => x * x * (3 - 2 * x);

const VERT = /* glsl */ `#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; out vec4 salida;
uniform vec2 uRes;
uniform float uT, uTA;
uniform sampler2D tFoto; uniform vec2 uFotoTam; uniform vec2 uSolUv; uniform float uZoom, uMezcla;
uniform vec3 uCam, uDer, uArr, uFre; uniform float uFoco;
uniform vec3 uSol; uniform float uEstrellas, uAurora, uPasos, uVel;
uniform vec3 uTinte; uniform float uTinteK;
uniform vec3 uP0, uP1, uP2, uP3, uC0, uC1, uC2, uC3; uniform vec4 uLuzP;

const float R = 6371.0;
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p), s = f * f * (3.0 - 2.0 * f);
  return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), s.x), mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), s.x), s.y);
}

// --- 1 · La puesta de sol de la portada, y la cámara que va hacia el sol -------------------------------------------
vec2 escalaFoto() {
  float ar = uRes.x / uRes.y, ai = uFotoTam.x / uFotoTam.y;
  return ar > ai ? vec2(1.0, ai / ar) : vec2(ar / ai, 1.0);
}
vec3 puesta(vec2 uv) {
  vec2 s = escalaFoto();
  float z = 1.0 + pow(uZoom, 2.3) * 26.0;
  vec2 solPant = (uSolUv - 0.5) / s + 0.5;
  vec2 ancla = mix(solPant, vec2(0.5), smoothstep(0.0, 0.8, uZoom));   // el sol se va al centro mientras te acercas
  vec2 f = uSolUv + (uv - ancla) * s / z;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 12; i++) {                    // desenfoque de velocidad hacia el sol
    float k = 1.0 - float(i) * 0.016 * uZoom;
    acc += texture(tFoto, uSolUv + (f - uSolUv) * k).rgb;
  }
  acc /= 12.0;
  vec3 col = pow(acc, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);   // la foto en clave de noche, como en la portada
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  col *= mix(mix(0.5, 1.0, vig), 1.0, uZoom);
  float d = length((uv - ancla) * vec2(uRes.x / uRes.y, 1.0));
  col *= 1.0 + uZoom * 2.4;
  col += vec3(1.0, 0.8, 0.55) * exp(-d * mix(10.0, 1.4, uZoom)) * (0.15 + 2.6 * uZoom * uZoom);
  return mix(col, vec3(1.0, 0.94, 0.84), smoothstep(0.84, 1.0, uZoom));   // el fogonazo
}

// --- 2 · El cielo: la atmósfera según la altura, la curva de la Tierra, las estrellas y el sol --------------------------
vec3 estrellas(vec3 rd) {
  vec3 p = rd * 140.0;
  vec3 i = floor(p), f = fract(p);
  float h = azar(i.xy + i.z * 17.13);
  if (h < 0.972) return vec3(0.0);
  vec3 c = vec3(azar(i.yz + 1.7), azar(i.zx + 4.3), azar(i.xy + 9.1)) * 0.6 + 0.2;
  float b = smoothstep(0.16, 0.0, length(f - c)) * (h - 0.972) * 36.0;
  float tw = 0.7 + 0.3 * sin(uTA * (1.0 + h * 6.0) + h * 40.0);
  return mix(vec3(1.0, 0.86, 0.72), vec3(0.75, 0.86, 1.0), azar(i.xz)) * b * tw * 4.0;
}
vec3 cielo(vec3 ro, vec3 rd) {
  float alt = max(ro.y, 0.01);
  float dip = -acos(R / (R + alt));                 // a qué ángulo queda el horizonte desde esta altura
  float sobre = asin(clamp(rd.y, -1.0, 1.0)) - dip;
  float aire = exp(-alt / 9.0);                     // cuánta atmósfera queda encima
  float s = max(dot(rd, uSol), 0.0);
  vec3 col;
  if (sobre >= 0.0) {
    vec3 tarde = mix(vec3(1.0, 0.6, 0.3), vec3(0.14, 0.2, 0.42), smoothstep(0.0, 0.55, sobre));
    tarde = mix(tarde, vec3(1.0, 0.78, 0.5), pow(s, 5.0) * 0.7);
    col = tarde * aire + estrellas(rd) * uEstrellas * (1.0 - aire);
  } else {
    float bajo = -sobre;
    vec3 noche = vec3(0.006, 0.009, 0.02) + vec3(0.03, 0.06, 0.14) * exp(-bajo / 0.035) * (1.0 - aire);
    noche += vec3(0.5, 0.26, 0.1) * pow(s, 6.0) * exp(-bajo / 0.025) * (1.0 - aire);
    col = mix(noche, vec3(0.07, 0.04, 0.025) * (0.4 + 0.6 * pow(s, 3.0)), aire);
  }
  // La curva de la Tierra: una banda azul fina justo encima del horizonte, cálida del lado del sol
  float banda = exp(-pow(sobre / 0.014, 2.0)) * (1.0 - aire);
  col += banda * mix(vec3(0.2, 0.45, 1.0), vec3(1.0, 0.55, 0.28), pow(s, 2.5)) * 1.3;
  col += vec3(1.0, 0.9, 0.75) * (pow(s, 2200.0) * 40.0 + pow(s, 90.0) * 0.5 + pow(s, 9.0) * 0.18 * (0.4 + aire));
  return col;
}

// --- 3 · La aurora: cortinas de luz en volumen, entre 100 y 330 km --------------------------------------------------
vec3 colorAurora(float h) {
  vec3 c = mix(vec3(1.0, 0.3, 0.62), vec3(0.36, 1.0, 0.44), smoothstep(0.004, 0.03, h));    // borde rosa, cuerpo verde
  c = mix(c, vec3(1.0, 0.22, 0.24), smoothstep(0.4, 0.8, h));                                 // rojo arriba
  return mix(c, uTinte * (0.85 + 0.3 * h), uTinteK * smoothstep(0.01, 0.06, h));             // el punto al que apuntas
}
float densidad(vec3 p, out float h) {
  float base = 100.0 + 7.0 * ruido(p.xz * 0.008 + uT * 0.03);
  h = (p.y - base) / 220.0;
  if (h < -0.02 || h > 1.15) return 0.0;
  // El borde de abajo, nítido y más brillante; los rayos se apagan hacia arriba
  float perfil = smoothstep(-0.012, 0.004, h) * (exp(-h * 3.2) * 0.85 + 0.1 * exp(-h) + exp(-h * 45.0) * 0.9);
  float d = 0.0;
  // Cortinas a lo largo del viaje: un pasillo de luz que se pliega, con rayos finos a lo largo (las estrías de una
  // aurora de verdad) y zonas más y menos encendidas. Empiezan un poco por delante, para verlas venir. Lejos de una
  // cortina no se calcula su ruido
  float empieza = smoothstep(-30.0, -110.0, p.z);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float xc = (fi - 1.5) * 56.0 + 26.0 * sin(p.z * 0.019 + uT * 0.22 + fi * 1.7) + 8.0 * sin(p.z * 0.051 - uT * 0.37 + fi * 2.3);
    float g = (p.x - xc) * (p.x - xc) * 0.065;
    if (g > 7.0) continue;
    float zona = smoothstep(0.15, 0.75, ruido(vec2(p.z * 0.018 + fi * 9.0, uT * 0.12)));
    float rayos = pow(ruido(vec2(p.z * 0.75 + fi * 31.0, uT * 0.5 + fi)), 2.0) * 0.85 + ruido(vec2(p.z * 0.23 + fi * 7.0, uT * 0.3)) * 0.35;
    d += exp(-g) * rayos * (0.25 + 0.75 * zona) * 1.5;
  }
  d *= empieza;
  // Dos arcos que cruzan: uno se atraviesa en el viaje; el otro queda al fondo, detrás de los puntos
  for (int j = 0; j < 2; j++) {
    float fj = float(j);
    float zc = mix(-140.0, -440.0, fj) + mix(15.0, 30.0, fj) * sin(p.x * 0.013 + uT * 0.2 + fj * 2.0);
    float g = (p.z - zc) * (p.z - zc) * mix(0.06, 0.012, fj);   // el del fondo, más ancho: se ve de lejos
    if (g > 7.0) continue;
    float rayos = pow(ruido(vec2(p.x * 0.75 + fj * 13.0, uT * 0.5)), 2.0) * 0.85 + ruido(vec2(p.x * 0.23 + fj * 5.0, uT * 0.3)) * 0.35;
    d += exp(-g) * rayos * mix(1.2, 2.2, fj);
  }
  return d * perfil;
}
vec3 aurora(vec3 ro, vec3 rd) {
  float t0, t1;
  if (abs(rd.y) < 1e-4) {
    if (ro.y < 95.0 || ro.y > 340.0) return vec3(0.0);
    t0 = 0.0; t1 = 900.0;
  } else {
    float ta = (95.0 - ro.y) / rd.y, tb = (340.0 - ro.y) / rd.y;
    t0 = max(min(ta, tb), 0.0); t1 = min(max(ta, tb), 900.0);
  }
  if (t1 <= t0) return vec3(0.0);
  vec3 acc = vec3(0.0);
  float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float t = t0 + ign * 0.9;
  for (int i = 0; i < 72; i++) {
    if (float(i) >= uPasos || t > t1) break;
    float dt = max(0.8, t * 0.058);
    float h;
    float d = densidad(ro + rd * t, h);
    acc += colorAurora(h) * d * dt;
    t += dt;
  }
  return acc * 0.055;
}

// --- 4 · Los puntos: una luz con su halo, en su color ---------------------------------------------------------------
vec3 punto(vec3 ro, vec3 rd, vec3 P, vec3 c, float luz) {
  vec3 v = P - ro;
  float t = dot(v, rd);
  if (t <= 0.0) return vec3(0.0);
  float a = length(v - rd * t) / t;                  // separación angular
  float latido = 0.85 + 0.15 * sin(uTA * 2.2 + P.x);
  return (c * exp(-a * 34.0) * 0.55 + mix(c, vec3(1.0), 0.6) * exp(-a * a * 9000.0) * 1.6) * luz * latido;
}

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);
  if (uMezcla < 1.0) col = puesta(uv);
  if (uMezcla > 0.0) {
    vec2 q = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
    vec3 rd = normalize(q.x * uDer + q.y * uArr + uFoco * uFre);
    vec3 e = cielo(uCam, rd);
    if (uAurora > 0.0) e += aurora(uCam, rd) * uAurora;
    e += punto(uCam, rd, uP0, uC0, uLuzP.x) + punto(uCam, rd, uP1, uC1, uLuzP.y) + punto(uCam, rd, uP2, uC2, uLuzP.z) + punto(uCam, rd, uP3, uC3, uLuzP.w);
    // Estelas al volar hacia un punto
    float r = length(q), ang = atan(q.y, q.x);
    e += mix(vec3(1.0), uTinte, 0.5) * pow(ruido(vec2(ang * 70.0, 0.0)), 7.0) * smoothstep(0.2, 1.3, r) * uVel * 1.6;
    e = 1.0 - exp(-e * 1.25);                        // revelado suave, sin quemar los blancos
    col = mix(col, e, uMezcla);
  }
  float vig = smoothstep(1.45, 0.45, length((uv - 0.5) * vec2(1.2, 1.0)));
  col *= mix(0.72, 1.0, vig);
  col += (azar(gl_FragCoord.xy + fract(uTA) * 37.0) - 0.5) * 0.018;   // grano
  salida = vec4(col, 1.0);
}`;

export function crear(raiz, { datos, reducido, sonido, ir }) {
  const lienzo = raiz.querySelector('[data-au-lienzo]');
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  let renderer;
  try {
    renderer = new Renderer({ canvas: lienzo, webgl: 2, dpr: Math.min(devicePixelRatio || 1, movil ? 0.6 : 1), alpha: false, antialias: false });
  } catch (e) { return null; }
  const gl = renderer.gl;
  if (!gl || !renderer.isWebgl2) return null;

  const foto = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE });
  const img = new Image();
  img.onload = () => { foto.image = img; uni.uFotoTam.value = [img.naturalWidth, img.naturalHeight]; };
  img.src = `${window.ADS_BASE || '/'}assets/hero/Fondo-Hero_adsPartners.webp`;

  // En vertical (el móvil), los puntos se juntan hacia el centro para que quepan
  const junta = () => (innerWidth < innerHeight ? 0.55 : 1);
  const enMundo = (rel) => REPOSO.map((v, i) => v + rel[i] * (i === 0 ? junta() : 1));
  const puntos = datos.map((d) => ({ d, rel: PUNTOS[d.slug], color: luz(d.color), etq: raiz.querySelector(`[data-au-dest="${d.slug}"]`), pant: [0, 0, false] }));
  const uni = {
    uRes: { value: [1, 1] }, uT: { value: 0 }, uTA: { value: 0 },
    tFoto: { value: foto }, uFotoTam: { value: [1600, 900] }, uSolUv: { value: SOL_UV }, uZoom: { value: 0 }, uMezcla: { value: 0 },
    uCam: { value: [0, 2, 0] }, uDer: { value: [1, 0, 0] }, uArr: { value: [0, 1, 0] }, uFre: { value: [0, 0, -1] }, uFoco: { value: 1.7 },
    uSol: { value: [0.9998, 0.02, 0] }, uEstrellas: { value: 0 }, uAurora: { value: 0 }, uPasos: { value: movil ? 40 : 64 }, uVel: { value: 0 },
    uTinte: { value: [0.3, 1, 0.55] }, uTinteK: { value: 0 }, uLuzP: { value: [0, 0, 0, 0] },
  };
  puntos.forEach((p, i) => { uni[`uP${i}`] = { value: enMundo(p.rel) }; uni[`uC${i}`] = { value: p.color }; });
  const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: uni, depthTest: false, depthWrite: false });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const medir = () => {
    renderer.setSize(innerWidth, innerHeight);
    uni.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    puntos.forEach((p, i) => { uni[`uP${i}`].value = enMundo(p.rel); });
  };
  addEventListener('resize', medir);
  medir();

  // --- El estado del viaje (lo mueve la línea de tiempo) y la cámara ------------------------------------------------
  // zoom: hacia el sol (2D); mezcla: de la foto al cielo; alt: altura en km; yaw: hacia dónde mira (90 = el sol,
  // 0 = la aurora); z: lo que ha avanzado; puntos: cuánto se ven los cuatro puntos; dive: el vuelo hacia uno
  const st = { zoom: 0, mezcla: 0, alt: 2, yaw: 90, pitch: 1, z: 0, fov: 56, aurora: 0, estrellas: 0, puntos: 0, vel: 0, dive: 0, T: 0 };
  const raton = { x: 0, y: 0, nx: 0, ny: 0, px: null, py: 0, t: 0, dentro: false };
  const mira = { yaw: 0, pitch: 0 };
  let apuntado = null, peso = 0, racha = 0, viento = 0.5, vientoKm = 500, destino = null;
  let deriva = [0, 0, 0];

  const camara = () => {
    const yaw = ((st.yaw + mira.yaw) * Math.PI) / 180, pitch = ((st.pitch + mira.pitch) * Math.PI) / 180;
    const fre = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
    const der = [Math.cos(yaw), 0, Math.sin(yaw)];
    const arr = [der[1] * fre[2] - der[2] * fre[1], der[2] * fre[0] - der[0] * fre[2], der[0] * fre[1] - der[1] * fre[0]];
    let pos = [deriva[0], st.alt + deriva[1], st.z + deriva[2]];
    if (destino && st.dive > 0) pos = mezcla(pos, enMundo(destino.rel), suave(st.dive) * 0.86);
    // En vertical (el móvil), más ángulo: si no, los puntos de los lados se salen de la pantalla
    const fov = (st.fov + suave(st.dive) * 26) * (innerWidth < innerHeight ? 1.38 : 1);
    return { pos, fre, der, arr, foco: 1 / Math.tan((fov * Math.PI) / 360) };
  };
  // Dónde cae en pantalla un punto del mundo (la misma cuenta que el shader)
  const proyectar = (c, P) => {
    const v = P.map((x, i) => x - c.pos[i]);
    const z = v[0] * c.fre[0] + v[1] * c.fre[1] + v[2] * c.fre[2];
    if (z <= 0.1) return [0, 0, false];
    const x = ((v[0] * c.der[0] + v[1] * c.der[1] + v[2] * c.der[2]) / z) * c.foco;
    const y = ((v[0] * c.arr[0] + v[1] * c.arr[1] + v[2] * c.arr[2]) / z) * c.foco;
    return [(x * innerHeight + innerWidth) / 2, (innerHeight - y * innerHeight) / 2, true];
  };

  // --- Apuntar y pinchar ------------------------------------------------------------------------------------------
  raiz.addEventListener('pointermove', (e) => {
    raton.x = e.clientX; raton.y = e.clientY; raton.dentro = true;
    raton.nx = (e.clientX / innerWidth) * 2 - 1; raton.ny = (e.clientY / innerHeight) * 2 - 1;
    const t = performance.now();
    if (raton.px !== null && t - raton.t < 100) racha = Math.min(1, racha + Math.hypot(e.clientX - raton.px, e.clientY - raton.py) / 900);
    raton.px = e.clientX; raton.py = e.clientY; raton.t = t;
  });
  raiz.addEventListener('pointerleave', () => { raton.dentro = false; });
  const masCerca = (x, y, max) => {
    let mejor = null, dist = max;
    for (const p of puntos) {
      if (!p.pant[2]) continue;
      const d = Math.hypot(p.pant[0] - x, p.pant[1] - y);
      if (d < dist) { dist = d; mejor = p; }
    }
    return [mejor, dist];
  };

  // --- La línea de tiempo del viaje (un clic durante el viaje lo acelera) ----------------------------------------------
  let viaje = null;
  const enViaje = () => !!viaje && viaje.isActive();
  const acelerar = () => { if (viaje) gsap.to(viaje, { timeScale: 5, duration: 0.4 }); };

  lienzo.addEventListener('click', (e) => {
    if (enViaje()) { acelerar(); return; }
    const [p] = masCerca(e.clientX, e.clientY, movil ? 140 : 200);
    if (p) lanzar(p.d.slug);
  });

  const inundar = raiz.querySelector('[data-au-inundar]');
  function lanzar(slug) {
    const p = puntos.find((q) => q.d.slug === slug);
    if (!p || destino) return;
    if (!p.d.ruta) {
      const luz = p.etq.querySelector('.au__luz');
      clearTimeout(luz._t);
      luz.textContent = 'en obras · llega pronto';
      if (!reducido) gsap.fromTo(p.etq.querySelector('.au__nombre'), { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
      setTimeout(() => { luz.textContent = luz.dataset.texto; }, 1800);
      return;
    }
    if (enViaje()) viaje.progress(1);
    destino = p;
    apuntado = p;
    raiz.classList.add('zambullendo');
    sonido.viaje(1.4, 1);
    if (reducido) { ir(p.d); return; }
    inundar.style.setProperty('--c', p.d.color);
    gsap.timeline({ onComplete: () => ir(p.d) })
      .to(st, { dive: 1, duration: 1.4, ease: 'power2.in' }, 0)
      .to(st, { vel: 1, duration: 1.1, ease: 'power1.in' }, 0.1)
      .fromTo(inundar, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.in' }, 0.95);
  }
  raiz.querySelectorAll('[data-au-ir]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); lanzar(a.dataset.auIr); });
  });

  // --- El inspector: la altitud al subir; después, el viento solar de la visita ---------------------------------------
  const hudAltitud = raiz.querySelector('[data-au-altitud]');
  const hudViento = raiz.querySelector('[data-au-viento]');
  const escribir = (el, texto, demora = 0) => {
    clearTimeout(el._t);
    if (reducido) { el.textContent = texto; return; }
    let n = 0;
    el.textContent = '';
    const paso = () => { el.textContent = texto.slice(0, ++n); if (n < texto.length) el._t = setTimeout(paso, 16); };
    el._t = setTimeout(paso, demora);
  };
  const tiempo = (s) => (s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`);

  function llegar() {
    puntos.forEach((p, i) => { p.etq.classList.add('visto'); escribir(p.etq.querySelector('.au__luz'), p.etq.querySelector('.au__luz').dataset.texto, i * 150); });
    escribir(hudAltitud, 'dentro de la aurora · de unos 100 a más de 300 km de altura');
    const r = rastro();
    escribir(hudViento, `viento solar · ${vientoKm} km/s · sale de tu visita: ${tiempo(r.segundos)} y ${r.metros.toFixed(1).replace('.', ',')} m de ratón`, 400);
    sonido.coro(viento);
  }

  function montarViaje(primera) {
    viaje?.kill();
    const tl = gsap.timeline({ onComplete: llegar });
    if (primera) {
      const alt = { km: 2 };
      const capa = () => [...CAPAS].reverse().find(([km]) => alt.km >= km)[1];
      Object.assign(st, { zoom: 0, mezcla: 0, alt: 2, yaw: 90, pitch: 1.5, z: 0, fov: 56, aurora: 0, estrellas: 0, puntos: 0 });
      tl.to(st, { zoom: 1, duration: 2.3, ease: 'power2.in' }, 0.35)
        .call(() => sonido.viaje(2.4, 1), null, 0.4)
        .to(st, { mezcla: 1, duration: 0.55, ease: 'power1.inOut' }, 2.45)
        .to(alt, {
          km: REPOSO[1], duration: 3.6, ease: 'power2.inOut',
          onUpdate: () => { st.alt = alt.km; hudAltitud.textContent = `altitud · ${Math.round(alt.km)} km · ${capa()}`; },
        }, 2.6)
        .to(st, { pitch: -3, duration: 3.6, ease: 'power1.inOut' }, 2.6)
        .to(st, { estrellas: 1, duration: 2.2, ease: 'power1.out' }, 3.4)
        .to(st, { yaw: 0, duration: 2.8, ease: 'power2.inOut' }, 3.8)
        .to(st, { aurora: 1, duration: 2.0, ease: 'power1.out' }, 4.4)
        .call(() => sonido.viaje(3, -1), null, 5.8)
        .to(st, { z: REPOSO[2], duration: 3.2, ease: 'power2.inOut' }, 5.8)
        .to(st, { fov: 68, duration: 1.6, ease: 'power2.in', yoyo: true, repeat: 1 }, 5.8)
        .to(st, { pitch: 6, duration: 2.2, ease: 'power1.inOut' }, 7)
        .to(st, { puntos: 1, duration: 1.2, ease: 'power1.out' }, 8.2);
    } else {
      // Las siguientes veces se llega ya dentro: un tramo corto del vuelo
      Object.assign(st, { zoom: 1, mezcla: 1, alt: REPOSO[1], yaw: 0, pitch: 6, z: REPOSO[2] + 110, fov: 56, aurora: 1, estrellas: 1, puntos: 0 });
      tl.to(st, { z: REPOSO[2], duration: 1.6, ease: 'power2.out' }, 0)
        .to(st, { puntos: 1, duration: 0.8, ease: 'power1.out' }, 0.9);
    }
    viaje = tl;
  }

  // --- El bucle, solo con el menú abierto ----------------------------------------------------------------------------
  let raf = 0, antes = 0, vivo = false, cuadros = 0, sumaDt = 0;
  function pintar(ahora) {
    raf = requestAnimationFrame(pintar);
    const dt = Math.min(0.05, (ahora - (antes || ahora)) / 1000);
    antes = ahora;
    // Si va sobrado, más resolución (una sola vez, al principio)
    if (cuadros < 90) {
      cuadros++; sumaDt += dt;
      if (cuadros === 90 && !movil && sumaDt / 90 < 0.011 && devicePixelRatio > 1) { renderer.dpr = Math.min(devicePixelRatio, 1.5); medir(); }
    }
    racha *= Math.exp(-dt * 1.2);
    const fuerza = Math.min(1, viento + racha * 0.6);
    if (!reducido) { st.T += dt * (0.3 + fuerza * 0.8); uni.uTA.value = ahora / 1000; }

    // Dentro, la cámara mira un poco hacia el ratón, y apunta al punto que tiene más cerca
    const dentro = st.puntos > 0.5 && !destino;
    const conRaton = dentro && raton.dentro && !movil;
    mira.yaw += ((conRaton ? raton.nx * 9 : 0) - mira.yaw) * Math.min(1, dt * 2.5);
    mira.pitch += ((conRaton ? -raton.ny * 6 : 0) - mira.pitch) * Math.min(1, dt * 2.5);
    let c = camara();
    puntos.forEach((p) => { p.pant = proyectar(c, enMundo(p.rel)); });
    if (!destino) {
      const [p, d] = conRaton ? masCerca(raton.x, raton.y, 260) : [null, 260];
      peso += ((p ? 1 - d / 260 : 0) - peso) * Math.min(1, dt * 4);
      if (p !== apuntado) {
        if (p) sonido.tic(0.6);
        apuntado = p;
        puntos.forEach((q) => q.etq.classList.toggle('on', q === apuntado));
        lienzo.style.cursor = apuntado ? 'pointer' : '';
      }
    }
    // La cámara se acerca al punto al que apuntas, y la aurora se tiñe de su color
    const objetivo = apuntado && !destino ? enMundo(apuntado.rel).map((v, i) => (v - REPOSO[i]) * 0.16 * suave(Math.min(1, peso * 1.4))) : [0, 0, 0];
    deriva = mezcla(deriva, objetivo, Math.min(1, dt * 1.6));
    // (el color cambia deprisa y con decisión: a medio camino entre dos colores la aurora se ensucia)
    if (apuntado) uni.uTinte.value = mezcla(uni.uTinte.value, apuntado.color, Math.min(1, dt * 6));
    const k = destino ? 1 : apuntado ? Math.min(1, peso * 2.2) * 0.9 : 0;
    uni.uTinteK.value += (k - uni.uTinteK.value) * Math.min(1, dt * 4);

    c = camara();
    uni.uCam.value = c.pos; uni.uDer.value = c.der; uni.uArr.value = c.arr; uni.uFre.value = c.fre; uni.uFoco.value = c.foco;
    uni.uT.value = st.T; uni.uZoom.value = st.zoom; uni.uMezcla.value = st.mezcla;
    uni.uEstrellas.value = st.estrellas; uni.uAurora.value = st.aurora; uni.uVel.value = st.vel;
    uni.uLuzP.value = puntos.map((p) => st.puntos * (p === apuntado ? 1.7 : 0.9) * (p.d.ruta ? 1 : 0.6));

    // Los nombres, debajo de su punto (sin salirse de la pantalla, con su ancho de verdad)
    puntos.forEach((p) => {
      p.pant = proyectar(c, enMundo(p.rel));
      const medio = (p.etq.offsetWidth || 120) / 2 + 10;
      const x = Math.min(innerWidth - medio, Math.max(medio, p.pant[0]));
      p.etq.style.transform = `translate(${x.toFixed(1)}px, ${p.pant[1].toFixed(1)}px)`;
      p.etq.style.visibility = p.pant[2] && st.puntos > 0.2 ? '' : 'hidden';
    });
    renderer.render({ scene: mesh });
  }

  return {
    // primera: si es la primera vez en esta visita (el viaje entero, desde la puesta de sol)
    abrir(primera) {
      const r = rastro();
      vientoKm = r.viento;
      viento = (r.viento - 300) / 500;
      destino = null; apuntado = null; peso = 0; racha = 0; deriva = [0, 0, 0];
      Object.assign(st, { dive: 0, vel: 0 });
      uni.uTinteK.value = 0;
      raiz.classList.remove('zambullendo');
      inundar.style.opacity = 0;
      puntos.forEach((p) => { p.etq.classList.remove('visto', 'on'); p.etq.querySelector('.au__luz').textContent = ''; });
      hudAltitud.textContent = ''; hudViento.textContent = '';
      if (!vivo) { vivo = true; antes = 0; raf = requestAnimationFrame(pintar); }
      if (reducido) {
        Object.assign(st, { zoom: 1, mezcla: 1, alt: REPOSO[1], yaw: 0, pitch: 6, z: REPOSO[2], fov: 56, aurora: 1, estrellas: 1, puntos: 1 });
        llegar();
        return;
      }
      montarViaje(primera);
    },
    cerrar() {
      sonido.pararCoro();
      viaje?.kill();
      gsap.killTweensOf(st);
      cancelAnimationFrame(raf);
      vivo = false;
    },
  };
}
