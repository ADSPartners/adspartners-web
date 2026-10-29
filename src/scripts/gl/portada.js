// La portada en WebGL: capa de marca (foto en clave de noche + «adsPartners» en Garamond) y, bajo el pincel,
// la capa máquina (curvas de nivel y tramado mono sacados de la luz de la foto, rejilla, anatomía del título y código).
// El mismo canvas pinta antes el final de la carga (modo umbral), al revés: todo es máquina, con «ads» enorme en el
// centro, y la marca solo aparece donde hay luz (el ratón es una linterna). Al entrar, la marca inunda desde el clic,
// «ads» se funde en «adsPartners» y la máscara vuelve a la de la portada.
// - Ratón: escribe velocidad en el fluido; el tinte es la máscara.
// - Quieto 2,5 s (o en el móvil sin tocar), caen gotas: sus anillos de agua refractan la foto y abren la máquina en las crestas.
// - Mantener pulsado: un anillo se abre desde el puntero y enseña la máquina entera.
// - Movimiento reducido o sin fluido: la máscara es un círculo pegado al puntero, sin estela ni gotas.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { gsap } from 'gsap';
import { Fluido } from './fluido.js';
import { Ondas } from './ondas.js';
import { lienzo, pintarFoto, medirTitulo, pintarTitulo, pintarMaquina, pintarGlifos } from './capas.js';
import * as sonido from '../sonido.js';
import { ajustarTitulo } from '../titulo.js';

const NIVELES = {
  alta: { sim: 128, tinte: 640, iteraciones: 18, dpr: 1.5, curl: 6, disipVel: 0.8, disipTinte: 1.1, ondas: 200 },
  baja: { sim: 64, tinte: 320, iteraciones: 8, dpr: 1, curl: 6, disipVel: 0.8, disipTinte: 1.1, ondas: 128 },
};
const GLIFOS = ' .·:-=+10#@';
const FUERZA = 2600;
const GOTA = { fuerza: 0.6, radio: 0.05 };

const VERT = /* glsl */ `#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tFoto; uniform sampler2D tTitulo; uniform sampler2D tMaquina; uniform sampler2D tTituloU; uniform sampler2D tMaquinaU;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos; uniform sampler2D tOndas;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uCelda; uniform float uGlifosN;
uniform float uRevelado; uniform vec2 uHold; uniform vec2 uPuntero; uniform float uCirculo;
uniform float uUsaFluido; uniform float uIntro; uniform float uLuz; uniform float uUsaOndas; uniform vec2 uOndasTexel;
uniform float uUmbral; uniform float uLinterna; uniform float uHalo; uniform float uInunda; uniform vec2 uFoco;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float luma (vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main () {
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 vel = uUsaFluido > 0.5 ? texture(tVel, uv).xy : vec2(0.0);
  float tinte = uUsaFluido > 0.5 ? texture(tTinte, uv).r : 0.0;
  // Si el fluido trae valores no numéricos (algún navegador), mejor sin pincel que la pantalla en negro
  if (isnan(vel.x) || isnan(vel.y) || isinf(vel.x) || isinf(vel.y)) vel = vec2(0.0);
  if (isnan(tinte) || isinf(tinte)) tinte = 0.0;
  vel = clamp(vel, vec2(-2000.0), vec2(2000.0));
  // Ondas: la altura del agua y su pendiente
  float h = 0.0; vec2 pend = vec2(0.0);
  if (uUsaOndas > 0.5) {
    vec2 e = uOndasTexel;
    h = texture(tOndas, uv).r;
    pend = vec2(texture(tOndas, uv + vec2(e.x, 0.0)).r - texture(tOndas, uv - vec2(e.x, 0.0)).r,
                texture(tOndas, uv + vec2(0.0, e.y)).r - texture(tOndas, uv - vec2(0.0, e.y)).r);
    if (isnan(h) || isinf(h) || isnan(pend.x) || isnan(pend.y) || isinf(pend.x) || isinf(pend.y)) { h = 0.0; pend = vec2(0.0); }
    pend = clamp(pend, vec2(-1.0), vec2(1.0));
  }

  // Máscara de la portada: tinte del fluido, crestas de las ondas, círculo (sin fluido) y anillo de «mantener»
  float circ = uCirculo * (1.0 - smoothstep(0.1, 0.125, length((uv - uPuntero) * asp)));
  float n = ruido(uv * 7.0 + uTime * 0.25) * 0.06;
  float r = uRevelado * 1.9;
  float anillo = step(0.001, uRevelado) * (1.0 - smoothstep(r - 0.015, r, length((uv - uHold) * asp) + n * uRevelado));
  float cresta = smoothstep(0.035, 0.07, h);
  float m = max(max(max(tinte, cresta), circ), anillo);
  float mascaraP = smoothstep(0.24, 0.3, m);
  float borde = (smoothstep(0.17, 0.23, m) - smoothstep(0.28, 0.34, m)) * (1.0 - uUmbral);

  // Máscara del umbral, al revés: la marca solo donde hay luz (la estela del fluido y un halo en el puntero).
  // Al entrar, la marca inunda en círculo desde el clic, con un frente rosa
  float halo = uHalo * (1.0 - smoothstep(0.0, 0.21, length((uv - uPuntero) * asp) + n * 0.5));
  float luz = max(tinte * 1.3, halo) * uLinterna;
  float dF = length((uv - uFoco) * asp) + n * 0.6;
  float rF = uInunda * 2.3;
  float inunda = step(0.001, uInunda) * (1.0 - smoothstep(rF - 0.03, rF, dF));
  float mascaraU = 1.0 - max(smoothstep(0.08, 0.62, luz), inunda);
  float frente = step(0.001, uInunda) * step(uInunda, 0.999) * (1.0 - smoothstep(0.0, 0.005, abs(dF - rF + 0.015)));

  float mascara = mix(mascaraP, mascaraU, uUmbral);

  // MARCA: la foto en clave de noche, viñeta y el título; el fluido la desplaza un poco y el agua la refracta
  vec2 uvM = uv - vel * 0.00008 - pend * 0.1;
  vec3 foto = texture(tFoto, uvM).rgb;
  vec3 marca = pow(foto, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  marca *= mix(0.5, 1.0, vig);
  vec4 tit = mix(texture(tTitulo, uvM), texture(tTituloU, uvM), uUmbral);
  marca = mix(marca, cCrema, tit.a);
  // En el umbral, la luz calienta lo que toca
  marca *= 1.0 + luz * 0.22 * uUmbral;

  // MÁQUINA: curvas de nivel y tramado mono de la luz de la foto, rejilla y la capa dibujada
  vec2 uvQ = uv - pend * 0.05;
  vec3 f = texture(tFoto, uvQ).rgb; float l = luma(f);
  float b = l * 16.0; float fw = fwidth(b);
  float iso = 1.0 - smoothstep(0.0, fw * 1.4, abs(fract(b + 0.5) - 0.5));
  vec2 px = uv * uRes;
  vec2 cel = floor(px / uCelda);
  float lc = luma(texture(tFoto, (cel + 0.5) * uCelda / uRes - pend * 0.05).rgb);
  float idx = floor(clamp(lc, 0.0, 0.999) * uGlifosN);
  vec2 den = fract(px / uCelda);
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;
  float paso = 64.0 * uDpr;
  float rej = max(1.0 - step(uDpr, mod(px.x, paso)), 1.0 - step(uDpr, mod(px.y, paso)));
  vec3 maq = cNoche;
  maq = mix(maq, cCrema, rej * 0.06);
  maq = mix(maq, cCrema, glifo * (0.08 + lc * 0.34) * uLuz * (1.0 + uUmbral * 0.4));
  maq = mix(maq, cCrema, iso * (0.2 + l * 0.38) * uLuz);
  vec4 cap = mix(texture(tMaquina, uvQ), texture(tMaquinaU, uvQ), uUmbral);
  maq = mix(maq, cap.rgb, cap.a);

  vec3 col = mix(marca, maq, mascara);
  col = mix(col, cRosa, clamp(borde, 0.0, 1.0) * 0.4);
  // Brillo del agua: la luz entra desde arriba a la izquierda
  col += cCrema * clamp(dot(pend, vec2(-0.6, 0.8)) * 14.0, 0.0, 1.0) * 0.22;
  col = mix(col, cRosa, frente * 0.9);
  col += (hash(px + fract(uTime * 7.0) * 91.0) - 0.5) * 0.04;
  color = vec4(col * uIntro, 1.0);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const cargarImagen = (src) => new Promise((ok, mal) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = mal; i.src = src; });

export async function crearPortada({ cursor, reducido }) {
  const html = document.documentElement;
  const sec = document.getElementById('portada');
  const canvas = sec.querySelector('[data-gl]');
  const h1 = sec.querySelector('[data-titulo]');
  const adsU = document.querySelector('[data-umbral-ads]');
  const tactil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  const nada = { entrar() {}, listo: Promise.resolve(false) };
  const esMovil = () => innerWidth <= 760;

  ajustarTitulo(h1, esMovil());

  let img;
  try {
    [img] = await Promise.all([
      cargarImagen(`${window.ADS_BASE || '/'}assets/hero/Fondo-Hero_adsPartners.webp`),
      document.fonts.load('300 100px "Apple Garamond"'),
      document.fonts.load('400 12px "Geist Mono"'),
    ]);
  } catch (e) { return nada; }
  ajustarTitulo(h1, esMovil());

  let nivel = 'alta';
  let renderer;
  try {
    renderer = new Renderer({ canvas, webgl: 2, dpr: Math.min(devicePixelRatio, NIVELES[nivel].dpr), alpha: false, antialias: false, powerPreference: 'high-performance' });
  } catch (e) { return nada; }
  if (!renderer.isWebgl2) return nada;
  const gl = renderer.gl;

  let W = sec.clientWidth, H = sec.clientHeight;
  renderer.setSize(W, H);
  const tex = (image) => new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });

  const capas = { foto: null, titulo: null, maquina: null, tituloU: null, maquinaU: null };
  const vacio = () => tex(lienzo(1, 1));
  const texturas = { foto: vacio(), titulo: vacio(), maquina: vacio(), tituloU: vacio(), maquinaU: vacio(), glifos: tex(pintarGlifos(GLIFOS)) };
  // umbral: el final de la carga se pinta aquí mismo. construyendo: las pasadas de carga (sin movimiento reducido)
  let umbral = html.classList.contains('en-umbral') && !!adsU;
  const construyendo = umbral && !reducido;

  function pintarCapas() {
    const dpr = renderer.dpr;
    const cw = gl.canvas.width, ch = gl.canvas.height;
    const origen = sec.getBoundingClientRect();
    capas.foto = lienzo(cw / 2, ch / 2); pintarFoto(capas.foto, img);
    capas.titulo = lienzo(cw, ch);
    capas.maquina = lienzo(cw, ch);
    const trozos = medirTitulo(h1, origen);
    pintarTitulo(capas.titulo, trozos, dpr);
    pintarMaquina(capas.maquina, trozos, dpr, { foto: capas.foto, movil: esMovil() });
    const claves = ['foto', 'titulo', 'maquina'];
    if (umbral) {
      const ficha = { canvas: [cw, ch], dpr: renderer.dpr, nivel: NIVELES[nivel], glifos: GLIFOS };
      capas.tituloU = lienzo(cw, ch);
      capas.maquinaU = lienzo(cw, ch);
      const trozosU = medirTitulo(adsU, origen);
      pintarTitulo(capas.tituloU, trozosU, dpr);
      pintarMaquina(capas.maquinaU, trozosU, dpr, { foto: capas.foto, movil: esMovil(), variante: 'umbral', ficha });
      claves.push('tituloU', 'maquinaU');
    }
    for (const k of claves) { texturas[k].image = capas[k]; texturas[k].needsUpdate = true; }
  }
  pintarCapas();
  if (umbral) html.classList.add('umbral-gl');

  let fluido = null, ondas = null;
  const crearFluido = () => {
    if (fluido) fluido._liberar();
    if (ondas) ondas._liberar();
    fluido = null; ondas = null;
    if (reducido) return;
    try { fluido = new Fluido(renderer, NIVELES[nivel]); } catch (e) { fluido = null; }
    try { ondas = new Ondas(renderer, { lado: NIVELES[nivel].ondas }); } catch (e) { ondas = null; }
  };
  crearFluido();

  const u = {
    tFoto: { value: texturas.foto }, tTitulo: { value: texturas.titulo }, tMaquina: { value: texturas.maquina },
    tTituloU: { value: texturas.tituloU }, tMaquinaU: { value: texturas.maquinaU },
    uUmbral: { value: umbral ? 1 : 0 }, uLinterna: { value: construyendo ? 0 : 1 }, uHalo: { value: 0 },
    uInunda: { value: 0 }, uFoco: { value: [0.5, 0.5] },
    tGlifos: { value: texturas.glifos }, tTinte: { value: texturas.foto }, tVel: { value: texturas.foto },
    uRes: { value: [gl.canvas.width, gl.canvas.height] }, uDpr: { value: renderer.dpr }, uTime: { value: 0 },
    uCelda: { value: (esMovil() ? 8 : 9) * renderer.dpr }, uGlifosN: { value: GLIFOS.length },
    uRevelado: { value: 0 }, uHold: { value: [0.5, 0.5] }, uPuntero: { value: [-2, -2] }, uCirculo: { value: 0 },
    uUsaFluido: { value: 0 }, uIntro: { value: 0 },
    tOndas: { value: texturas.foto }, uUsaOndas: { value: 0 }, uOndasTexel: { value: [0, 0] },
    uLuz: { value: construyendo ? 0 : 1 },
    cNoche: { value: hex('#120D0A') }, cCrema: { value: hex('#E7E2DA') }, cRosa: { value: hex('#F5CBD7') },
  };
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: u, depthTest: false, depthWrite: false }) });

  // --- Puntero -------------------------------------------------------------
  const p = { x: -1, y: -1, px: -1, py: -1, dentro: false, movido: false, quieto: 0, recorrido: 0, sx: 0.5, sy: 0.5, toque: -10 };
  const lluvia = { espera: 0, n: 0 };
  let velocidadSonido = 0;

  function mover(cx, cy) {
    const r = sec.getBoundingClientRect();
    const x = cx - r.left, y = cy - r.top;
    p.dentro = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    if (!p.dentro) return;
    if (p.x < 0) { p.px = x; p.py = y; }
    p.x = x; p.y = y; p.movido = true; p.quieto = 0;
  }
  window.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') mover(e.clientX, e.clientY); }, { passive: true });

  // --- Mantener pulsado ------------------------------------------------------
  const hold = { p: 0, tween: null, mando: null, completo: false, activo: false };
  let fase = 'mueve';
  let temporizadorFase = null;

  function empezarHold(cx, cy) {
    const r = sec.getBoundingClientRect();
    u.uHold.value = [(cx - r.left) / r.width, 1 - (cy - r.top) / r.height];
    hold.activo = true; hold.completo = false;
    hold.mando = sonido.subida();
    cursor.pulsando(true);
    gsap.killTweensOf(hold);
    hold.tween = gsap.to(hold, {
      p: 1, duration: 1.25, ease: 'none',
      onUpdate() {
        cursor.progreso(hold.p);
        hold.mando.avance(hold.p);
        if (!reducido) u.uRevelado.value = gsap.parseEase('power2.in')(hold.p) * 0.45;
      },
      onComplete() {
        hold.completo = true;
        hold.mando.soltar(true);
        gsap.to(u.uRevelado, { value: 1, duration: reducido ? 0 : 1.1, ease: 'power3.out' });
        cursor.decir('Así es por dentro');
        fase = 'visto';
      },
    });
  }
  function soltarHold() {
    if (!hold.activo) return;
    hold.activo = false;
    cursor.pulsando(false);
    if (hold.tween) hold.tween.kill();
    if (!hold.completo && hold.mando) hold.mando.soltar(false);
    else sonido.tic(0.8);
    gsap.to(hold, { p: 0, duration: 0.35, ease: 'power2.out', onUpdate() { cursor.progreso(hold.p); } });
    gsap.to(u.uRevelado, { value: 0, duration: reducido ? 0 : 0.85, ease: 'power2.inOut' });
    if (fase === 'visto') { clearTimeout(temporizadorFase); temporizadorFase = setTimeout(() => cursor.decir(''), 500); }
  }
  const sobreControl = (t) => t.closest && t.closest('a, button, input, label, [data-umbral-entradas]');
  sec.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.button !== 0 || sobreControl(e.target) || html.classList.contains('en-umbral')) return;
    empezarHold(e.clientX, e.clientY);
  });
  window.addEventListener('pointerup', (e) => { if (e.pointerType !== 'touch') soltarHold(); });
  window.addEventListener('blur', soltarHold);

  // Táctil: el dedo pinta (sin bloquear el scroll) y la pulsación larga abre la máquina
  let pendiente = null, inicioToque = null;
  sec.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; inicioToque = [t.clientX, t.clientY];
    mover(t.clientX, t.clientY); p.px = p.x; p.py = p.y;
    clearTimeout(pendiente);
    pendiente = setTimeout(() => empezarHold(t.clientX, t.clientY), 380);
  }, { passive: true });
  sec.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mover(t.clientX, t.clientY);
    if (inicioToque && Math.hypot(t.clientX - inicioToque[0], t.clientY - inicioToque[1]) > 10) clearTimeout(pendiente);
  }, { passive: true });
  // En el umbral el velo está encima de la sección: el dedo se escucha en la ventana
  const dedoUmbral = (e) => {
    if (!umbral) return;
    const t = e.touches[0];
    mover(t.clientX, t.clientY);
    p.toque = u.uTime.value;
    if (e.type === 'touchstart') { p.px = p.x; p.py = p.y; }
  };
  window.addEventListener('touchstart', dedoUmbral, { passive: true });
  window.addEventListener('touchmove', dedoUmbral, { passive: true });
  const finToque = () => { clearTimeout(pendiente); inicioToque = null; soltarHold(); };
  sec.addEventListener('touchend', finToque);
  sec.addEventListener('touchcancel', finToque);
  sec.addEventListener('contextmenu', (e) => { if (hold.activo) e.preventDefault(); });

  // --- Bucle ------------------------------------------------------------------
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(sec);
  let tAnterior = performance.now();
  const medida = { n: 0, suma: 0, hecha: false };

  gsap.ticker.add(() => {
    const ahora = performance.now();
    const dt = Math.min(1 / 30, (ahora - tAnterior) / 1000);
    tAnterior = ahora;
    if (!visible || document.hidden) return;

    u.uTime.value += dt;
    p.quieto += dt;

    let dx = 0, dy = 0;
    if (p.movido) {
      dx = p.x - p.px; dy = p.y - p.py;
      p.px = p.x; p.py = p.y; p.movido = false;
      const dist = Math.hypot(dx, dy);
      p.recorrido += dist;
      velocidadSonido = Math.min(1, dist / dt / 2600);
      if (!umbral && fase === 'mueve' && p.recorrido > 900) {
        fase = 'manten';
        clearTimeout(temporizadorFase);
        temporizadorFase = setTimeout(() => cursor.decir('Mantén pulsado'), 350);
      }
      if (fluido) {
        const dist01 = Math.hypot(dx / W, dy / H);
        // En el umbral la estela es más ancha y más suave: es luz, no pincel
        const fuerza = umbral ? FUERZA * 0.55 : FUERZA;
        fluido.splat(p.x / W, 1 - p.y / H, (dx / W) * fuerza * (W / H), (-dy / H) * fuerza, Math.min(0.9, 0.35 + dist01 * 12), umbral ? 0.007 : 0.0032);
      }
      lluvia.n = 0; lluvia.espera = 0;
    } else {
      velocidadSonido *= Math.exp(-dt * 8);
    }

    // Quieto 2,5 s (o en móvil sin tocar), caen gotas: la primera donde se paró el ratón y después al azar.
    // Con el tiempo caen más espaciadas, como una lluvia que se acaba
    if (ondas && !hold.activo && p.quieto > 2.5 && !umbral) {
      lluvia.espera -= dt;
      if (lluvia.espera <= 0) {
        const primera = lluvia.n === 0 && p.dentro && p.x >= 0;
        const gx = primera ? p.x / W : 0.1 + Math.random() * 0.8;
        const gy = primera ? 1 - p.y / H : 0.15 + Math.random() * 0.7;
        const fuerza = 0.75 + Math.random() * 0.25;
        ondas.gota(gx, gy, fuerza * GOTA.fuerza, GOTA.radio * (0.8 + Math.random() * 0.4));
        sonido.gota(gx, fuerza);
        lluvia.n++;
        lluvia.espera = p.quieto < 22 ? 1.2 + Math.random() * 1.4 : 2.8 + Math.random() * 2.6;
      }
    }

    // El umbral en un móvil sin tocar: un haz lento que barre el «ads» (lo único que se mueve solo)
    if (umbral && tactil && u.uLinterna.value > 0 && u.uTime.value - p.toque > 1.4) {
      const t = u.uTime.value * 0.42;
      const ax = W * (0.5 + 0.34 * Math.sin(t)), ay = H * (0.5 + 0.16 * Math.sin(t * 1.7));
      // Solo velocidad y un hilo de tinte: si no, la luz se acumula y quema la foto
      if (fluido && p.x >= 0) fluido.splat(ax / W, 1 - ay / H, (ax - p.x) * 6, -(ay - p.y) * 6, 0.035, 0.004);
      p.x = ax; p.y = ay; p.dentro = true;
    }

    // Puntero suavizado (halo de la linterna y círculo sin fluido)
    const k = 1 - Math.exp(-14 * dt);
    if (p.x >= 0) { p.sx += (p.x / W - p.sx) * k; p.sy += (1 - p.y / H - p.sy) * k; }
    u.uPuntero.value = [p.sx, p.sy];
    if (!fluido) u.uCirculo.value = !umbral && p.dentro && p.quieto < 1.2 ? 1 : 0;
    // El halo se queda aunque el ratón pare; si lleva mucho quieto, baja un poco
    const haloObj = umbral && p.dentro && p.x >= 0 ? (tactil ? 0.75 : p.quieto > 5 ? 0.6 : 1) : 0;
    u.uHalo.value += (haloObj - u.uHalo.value) * (1 - Math.exp(-(haloObj > u.uHalo.value ? 6 : 1.2) * dt));

    if (fluido) {
      fluido.paso(dt);
      u.tTinte.value = fluido.tinte; u.tVel.value = fluido.velocidad; u.uUsaFluido.value = 1;
    } else {
      u.uUsaFluido.value = 0;
    }
    if (ondas) {
      ondas.paso(dt);
      u.tOndas.value = ondas.altura; u.uOndasTexel.value = ondas.texel; u.uUsaOndas.value = 1;
    } else {
      u.uUsaOndas.value = 0;
    }
    renderer.render({ scene: malla, sort: false, frustumCull: false });
    sonido.pincel(velocidadSonido, p.x / W, dt, umbral ? 0 : u.uRevelado.value);

    // Calidad automática: si va lento, se baja; si sigue lento, fuera el fluido
    if (!medida.hecha && fluido) {
      medida.n++;
      if (medida.n > 20) medida.suma += dt;
      if (medida.n === 140) {
        const media = medida.suma / 120;
        medida.hecha = true;
        if (media > 0.024 && nivel === 'alta') { nivel = 'baja'; aplicarNivel(); medida.hecha = false; medida.n = 0; medida.suma = 0; }
        else if (media > 0.04) { fluido._liberar(); fluido = null; }
      }
    }
  });

  if (!html.classList.contains('gl-activo')) {
    html.classList.add('gl-activo', 'titulo-gl');
    gsap.to(u.uIntro, { value: 1, duration: reducido ? 0 : 1.4, ease: 'power2.out' });
  }

  function aplicarNivel() {
    renderer.dpr = Math.min(devicePixelRatio, NIVELES[nivel].dpr);
    redimensionar();
    crearFluido();
  }

  function redimensionar() {
    W = sec.clientWidth; H = sec.clientHeight;
    ajustarTitulo(h1, esMovil());
    renderer.setSize(W, H);
    u.uRes.value = [gl.canvas.width, gl.canvas.height];
    u.uDpr.value = renderer.dpr;
    u.uCelda.value = (esMovil() ? 8 : 9) * renderer.dpr;
    pintarCapas();
    if (fluido) fluido.redimensionar(gl.canvas.width / gl.canvas.height);
    if (ondas) ondas.redimensionar(gl.canvas.width / gl.canvas.height);
  }
  let espera = null;
  let anchoPrevio = innerWidth;
  window.addEventListener('resize', () => {
    // En móvil la barra del navegador cambia el alto al hacer scroll: solo se redimensiona si cambia el ancho
    if (esMovil() && innerWidth === anchoPrevio) return;
    anchoPrevio = innerWidth;
    clearTimeout(espera); espera = setTimeout(redimensionar, 160);
  });

  // Después de entrar ya no hacen falta las texturas del umbral
  function soltarUmbral() {
    umbral = false;
    u.uUmbral.value = 0; u.uInunda.value = 0; u.uHalo.value = 0;
    for (const k of ['tituloU', 'maquinaU']) { capas[k] = null; texturas[k].image = lienzo(1, 1); texturas[k].needsUpdate = true; }
    html.classList.remove('umbral-gl');
  }

  return {
    listo: Promise.resolve(true),
    // La carga se construye en tres pases: alambre, luz y, al final, la linterna (la marca donde pasa el ratón)
    construir(alPase) {
      if (!construyendo) { u.uLuz.value = 1; u.uLinterna.value = 1; return Promise.resolve(); }
      return new Promise((ok) => {
        gsap.timeline({ onComplete: ok })
          .add(() => alPase(1, 'alambre'))
          .to(u.uLuz, { value: 1, duration: 1.1, ease: 'power2.inOut', onStart: () => alPase(2, 'luz') }, 1.1)
          .to(u.uLinterna, { value: 1, duration: 1.0, ease: 'power2.out', onStart: () => alPase(3, 'linterna') }, 2.3);
      });
    },
    activarCursor() { cursor.decir('Mueve el ratón'); },
    // Al entrar: la marca inunda desde el punto del clic, «ads» se funde en «adsPartners» y vuelve la portada.
    // Al final de la inundación, un golpe de fluido desde el centro que destapa la máquina y se disuelve
    entrar(cx = innerWidth / 2, cy = innerHeight / 2) {
      const golpe = () => {
        if (!fluido) return;
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2 + Math.random() * 0.3;
          fluido.splat(0.5, 0.52, Math.cos(a) * 900 * (W / H), Math.sin(a) * 900, 0.5, 0.004);
        }
      };
      if (!umbral) { golpe(); return; }
      const r = sec.getBoundingClientRect();
      u.uFoco.value = [(cx - r.left) / W, 1 - (cy - r.top) / H];
      if (reducido) { soltarUmbral(); return; }
      gsap.timeline({ onComplete: soltarUmbral })
        .to(u.uInunda, { value: 1, duration: 1.25, ease: 'power2.inOut' })
        .to(u.uUmbral, { value: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.35')
        .add(golpe, '-=0.5');
    },
  };
}
