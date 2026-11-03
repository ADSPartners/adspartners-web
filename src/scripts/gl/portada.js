// La portada en WebGL: capa de marca (foto en clave de noche + «adsPartners» en Garamond) y, bajo el pincel,
// la capa máquina (curvas de nivel y tramado mono sacados de la luz de la foto, rejilla, anatomía del título y código).
// El mismo canvas pinta antes el final de la carga (modo umbral), al revés: todo es máquina, con «ads» enorme en el
// centro, y la marca solo aparece donde hay luz (el ratón es una linterna). Al entrar, la marca inunda desde el clic,
// «ads» se funde en «adsPartners» y la máscara vuelve a la de la portada.
// - Ratón: escribe velocidad en el fluido; el tinte es la máscara.
// - Quieto 2,5 s (o en el móvil sin tocar), el inspector: cajas que se abren sobre una letra, un texto o un trozo de
//   foto, enseñan la máquina dentro y dicen lo que es (medido del DOM y de la foto).
// - Mantener pulsado: un anillo se abre desde el puntero y enseña la máquina entera.
// - Al bajar, la máquina sube desde abajo celda a celda y se funde con el fondo de la página (sin corte).
// - Movimiento reducido o sin fluido: la máscara es un círculo pegado al puntero, sin estela.
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import { gsap } from 'gsap';
import { Fluido } from './fluido.js';
import { lienzo, pintarFoto, medirTitulo, pintarTitulo, pintarMaquina, pintarGlifos } from './capas.js';
import * as sonido from '../sonido.js';
import { ajustarTitulo } from '../titulo.js';

const NIVELES = {
  alta: { sim: 128, tinte: 640, iteraciones: 18, dpr: 1.5, curl: 6, disipVel: 0.8, disipTinte: 1.1 },
  baja: { sim: 64, tinte: 320, iteraciones: 8, dpr: 1, curl: 6, disipVel: 0.8, disipTinte: 1.1 },
};
const GLIFOS = ' .·:-=+10#@';
const FUERZA = 2600;

const VERT = /* glsl */ `#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tFoto; uniform sampler2D tTitulo; uniform sampler2D tMaquina; uniform sampler2D tTituloU; uniform sampler2D tMaquinaU;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uCelda; uniform float uGlifosN;
uniform float uRevelado; uniform vec2 uHold; uniform vec2 uPuntero; uniform float uCirculo;
uniform float uUsaFluido; uniform float uIntro; uniform float uLuz;
uniform vec4 uCaja0; uniform vec4 uCaja1; uniform vec2 uCajaA; uniform float uSalida;
uniform float uUmbral; uniform float uLinterna; uniform float uHalo; uniform float uInunda; uniform vec2 uFoco;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float luma (vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
// Una caja del inspector (en píxeles del canvas): se abre desde su línea del medio, como una persiana
float caja (vec2 px, vec4 c, float a, out float filo) {
  vec2 d = abs(px - (c.xy + c.zw) * 0.5) - (c.zw - c.xy) * 0.5 * vec2(1.0, a);
  float fuera = max(d.x, d.y);
  float dentro = (1.0 - step(0.0, fuera)) * step(0.02, a);
  filo = dentro * (1.0 - step(1.5 * uDpr, -fuera));
  return dentro;
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
  vec2 px = uv * uRes;
  float portada = 1.0 - uUmbral;

  // Máscara de la portada: tinte del fluido, círculo (sin fluido), anillo de «mantener» y las cajas del inspector
  float circ = uCirculo * (1.0 - smoothstep(0.1, 0.125, length((uv - uPuntero) * asp)));
  float n = ruido(uv * 7.0 + uTime * 0.25) * 0.06;
  float r = uRevelado * 1.9;
  float anillo = step(0.001, uRevelado) * (1.0 - smoothstep(r - 0.015, r, length((uv - uHold) * asp) + n * uRevelado));
  float filo0, filo1;
  float cajas = max(caja(px, uCaja0, uCajaA.x, filo0), caja(px, uCaja1, uCajaA.y, filo1));
  float m = max(max(tinte, circ), anillo);
  float mascaraP = max(smoothstep(0.24, 0.3, m), cajas);
  float borde = (smoothstep(0.17, 0.23, m) - smoothstep(0.28, 0.34, m)) * portada;
  // Al bajar, la máquina sube desde abajo celda a celda (con el grano del tramado), con un frente rosa
  vec2 celS = floor(px / (uCelda * 2.0));
  float yS = uv.y + hash(celS) * 0.09;
  float frenteS = uSalida * 1.4 - 0.1;   // en reposo (uSalida = 0) no hay ninguna celda
  float salida = portada * step(yS, frenteS);
  float filoS = portada * step(yS, frenteS + 0.014) * (1.0 - salida) * step(0.001, uSalida);
  mascaraP = max(mascaraP, salida);

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

  // MARCA: la foto en clave de noche, viñeta y el título; el fluido la desplaza un poco
  vec2 uvM = uv - vel * 0.00008;
  vec3 foto = texture(tFoto, uvM).rgb;
  vec3 marca = pow(foto, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  marca *= mix(0.5, 1.0, vig);
  vec4 tit = mix(texture(tTitulo, uvM), texture(tTituloU, uvM), uUmbral);
  marca = mix(marca, cCrema, tit.a);
  // En el umbral, la luz calienta lo que toca
  marca *= 1.0 + luz * 0.22 * uUmbral;

  // MÁQUINA: curvas de nivel y tramado mono de la luz de la foto, rejilla y la capa dibujada.
  // Abajo se apaga hasta parecerse al fondo de la página, que sigue debajo
  vec2 uvQ = uv;
  float abajo = smoothstep(0.24, 0.0, uv.y) * portada;
  vec3 f = texture(tFoto, uvQ).rgb; float l = luma(f);
  float b = l * 16.0; float fw = fwidth(b);
  float iso = (1.0 - smoothstep(0.0, fw * 1.4, abs(fract(b + 0.5) - 0.5))) * (1.0 - abajo * 0.85);
  vec2 cel = floor(px / uCelda);
  float lc = luma(texture(tFoto, (cel + 0.5) * uCelda / uRes).rgb) * (1.0 - abajo * 0.7);
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
  col = mix(col, cRosa, max(filo0, filo1) * portada * 0.95);
  col = mix(col, cRosa, filoS * 0.55);
  col = mix(col, cRosa, frente * 0.9);
  // El último borde, en noche, solo al bajar (es donde empieza el fondo de la página); quieta, la portada no se toca
  col = mix(col, cNoche, smoothstep(0.035, 0.0, uv.y) * portada * min(1.0, uSalida * 10.0));
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

  let fluido = null;
  const crearFluido = () => {
    if (fluido) fluido._liberar();
    fluido = null;
    if (reducido) return;
    try { fluido = new Fluido(renderer, NIVELES[nivel]); } catch (e) { fluido = null; }
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
    uCaja0: { value: [0, 0, 0, 0] }, uCaja1: { value: [0, 0, 0, 0] }, uCajaA: { value: [0, 0] }, uSalida: { value: 0 },
    uLuz: { value: construyendo ? 0 : 1 },
    cNoche: { value: hex('#120D0A') }, cCrema: { value: hex('#E7E2DA') }, cRosa: { value: hex('#F5CBD7') },
  };
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: u, depthTest: false, depthWrite: false }) });

  // --- Puntero -------------------------------------------------------------
  const p = { x: -1, y: -1, px: -1, py: -1, dentro: false, movido: false, quieto: 0, recorrido: 0, sx: 0.5, sy: 0.5, toque: -10 };
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

  const inspector = crearInspector({ sec, h1, u, renderer, capas, nivel: () => NIVELES[nivel], tam: () => [W, H] });

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
    } else {
      velocidadSonido *= Math.exp(-dt * 8);
    }

    // Al bajar: la máquina sube y los textos se van (sin corte con la sección de abajo)
    const salida = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / H));
    u.uSalida.value = salida;
    sec.style.setProperty('--salida', salida.toFixed(3));

    // Quieto 2,5 s (o en el móvil sin tocar): el inspector
    inspector.paso(dt, !umbral && !hold.activo && p.quieto > 2.5 && salida < 0.15);

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

// --- El inspector ----------------------------------------------------------------------
// Con la portada quieta, unas cajas se abren sobre algo concreto (una letra del título, el lema, el texto, un trozo de
// foto o la etiqueta de arriba), enseñan la máquina dentro y dicen lo que es con valores medidos. Una caja se abre
// mientras la anterior se cierra; al mover el ratón, se cierran todas.
function crearInspector({ sec, h1, u, renderer, capas, nivel, tam }) {
  const capa = sec.querySelector('[data-inspector]');
  const etqs = capa ? [...capa.querySelectorAll('[data-inspector-etq]')] : [];
  const cajas = etqs.map((el) => ({ a: 0, r: [0, 0, 0, 0], el, t: null }));
  const estado = { espera: 0.2, n: 0, activo: false, tipos: [] };
  if (cajas.length < 2) return { paso() {} };

  const relativa = (r) => { const o = sec.getBoundingClientRect(); return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }; };
  const fs = (el) => Math.round(parseFloat(getComputedStyle(el).fontSize));
  const margen = (r, mx, my) => ({ x: r.x - mx, y: r.y - my, w: r.w + mx * 2, h: r.h + my * 2 });
  const OBJETIVOS = {
    letra() {
      const nodos = [];
      const w = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      // solo las letras que se ven (el h1 lleva además un texto para lectores de pantalla y buscadores)
      while (w.nextNode()) if (w.currentNode.textContent.trim() && w.currentNode.parentElement.closest('[data-trozo]')) nodos.push(w.currentNode);
      if (!nodos.length) return null;
      const nodo = nodos[Math.floor(Math.random() * nodos.length)];
      const i = Math.floor(Math.random() * nodo.textContent.length);
      const rango = document.createRange(); rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
      const r = relativa(rango.getBoundingClientRect());
      return { r: { x: r.x - 6, y: r.y + r.h * 0.12, w: r.w + 12, h: r.h * 0.8 }, txt: `«${nodo.textContent[i]}» · Apple Garamond 300 · ${fs(h1)} px` };
    },
    lema() {
      const el = sec.querySelector('.portada__lema');
      return el && { r: margen(relativa(el.getBoundingClientRect()), 10, 8), txt: `p.lema · Garamond 300 + 400 itálica · ${fs(el)} px` };
    },
    texto() {
      const el = sec.querySelector('.portada__texto');
      if (!el) return null;
      const lh = Math.round(parseFloat(getComputedStyle(el).lineHeight));
      return { r: margen(relativa(el.getBoundingClientRect()), 10, 8), txt: `p · Open Sauce 400 · ${fs(el)}/${lh} px · ${el.textContent.trim().split(/\s+/).length} palabras` };
    },
    foto() {
      const [W, H] = tam();
      const lado = Math.round(Math.min(W, H) * (0.18 + Math.random() * 0.08));
      const x = W * (0.32 + Math.random() * 0.3), y = H * (0.06 + Math.random() * 0.22);
      // La luz media de ese trozo, leída de la foto que pinta la portada
      let luz = '';
      try {
        const k = capas.foto.width / W, l = Math.max(1, Math.round(lado * k));
        const d = capas.foto.getContext('2d', { willReadFrequently: true }).getImageData(Math.round(x * k), Math.round(y * k), l, l).data;
        let s = 0;
        for (let i = 0; i < d.length; i += 4) s += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        luz = ` · luz media ${Math.round(s / (d.length / 4) / 2.55)} %`;
      } catch (e) { /* sin lectura */ }
      return { r: { x, y, w: lado, h: lado }, txt: `foto · ${lado}×${lado} px${luz} · fluido ${nivel().sim}²` };
    },
    etiqueta() {
      const el = sec.querySelector('.portada__etq');
      return el && { r: margen(relativa(el.getBoundingClientRect()), 8, 6), txt: `p.mono · Geist Mono · ${fs(el)} px · ${el.textContent.length} caracteres` };
    },
  };

  function elegir() {
    for (let i = 0; i < 6; i++) {
      if (!estado.tipos.length) estado.tipos = Object.keys(OBJETIVOS).sort(() => Math.random() - 0.5);
      const o = OBJETIVOS[estado.tipos.pop()]();
      if (o && o.r.w > 4 && o.r.h > 4) return o;
    }
    return null;
  }

  function abrir(c, o) {
    c.r = [o.r.x, o.r.y, o.r.x + o.r.w, o.r.y + o.r.h];
    const [W] = tam();
    const y = o.r.y > 34 ? o.r.y - 24 : o.r.y + o.r.h + 6;
    c.el.style.transform = `translate3d(${Math.max(0, Math.min(o.r.x, W - 340)).toFixed(0)}px, ${y.toFixed(0)}px, 0)`;
    c.el.classList.add('on');
    clearTimeout(c.t);
    let n = 0;
    const escribir = () => { c.el.textContent = o.txt.slice(0, ++n); if (n < o.txt.length) c.t = setTimeout(escribir, 14); };
    escribir();
    gsap.to(c, { a: 1, duration: 0.6, ease: 'expo.out', overwrite: true });
    sonido.tic(0.45);
  }
  function cerrar(c, rapido) {
    clearTimeout(c.t);
    c.el.classList.remove('on');
    gsap.to(c, { a: 0, duration: rapido ? 0.18 : 0.45, ease: 'power3.in', overwrite: true });
  }

  return {
    paso(dt, quieto) {
      if (quieto) {
        estado.activo = true;
        estado.espera -= dt;
        if (estado.espera <= 0) {
          const c = cajas[estado.n % cajas.length];
          cajas.forEach((otra) => { if (otra !== c && otra.a > 0) cerrar(otra); });
          const o = elegir();
          if (o) abrir(c, o);
          estado.n++;
          estado.espera = 2.8;
        }
      } else if (estado.activo) {
        estado.activo = false; estado.espera = 0.2;
        cajas.forEach((c) => cerrar(c, true));
      }
      // A píxeles del canvas (con la y hacia arriba, como el shader)
      const [, H] = tam(); const k = renderer.dpr;
      const vec = (c) => [c.r[0] * k, (H - c.r[3]) * k, c.r[2] * k, (H - c.r[1]) * k];
      u.uCaja0.value = vec(cajas[0]); u.uCaja1.value = vec(cajas[1]);
      u.uCajaA.value = [cajas[0].a, cajas[1].a];
    },
  };
}
