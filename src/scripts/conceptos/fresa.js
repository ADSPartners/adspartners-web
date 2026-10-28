// Idea «FRESA»: la IA de ads te acompaña. Un orbe de luz en la portada (WebGL) y, junto al ratón, un globo
// con lo que FRESA te cuenta de lo que tienes debajo (atributos data-fresa del HTML).
// Mantener pulsado: FRESA lee en voz alta el resumen de esa sección (data-fresa-voz) con la voz del navegador,
// con subtítulos en el globo, y el orbe late mientras habla. Sin sonido, lo escribe. Al soltar, se calla.
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';

const VERT = /* glsl */ `
attribute vec2 position; attribute vec2 uv; varying vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

// El orbe: una esfera de luz con el borde vivo (ruido), un remolino dentro y un halo; se hincha al hablar
const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform float uTime; uniform float uHabla; uniform vec2 uRaton; uniform vec2 uCentro; uniform float uRadio; uniform float uIntro;
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm (vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * ruido(p); p *= 2.03; a *= 0.5; } return v; }
void main () {
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (vUv - uCentro) * asp;
  vec2 haciaRaton = (uRaton - uCentro) * asp;
  p -= haciaRaton * 0.035 * smoothstep(0.6, 0.0, length(haciaRaton));
  float ang = atan(p.y, p.x);
  float r = length(p);
  float borde = uRadio * (1.0 + 0.06 * (fbm(vec2(ang * 1.6, uTime * 0.35)) - 0.5) + uHabla * 0.09 * (0.6 + 0.4 * sin(uTime * 18.0)));
  float dentro = smoothstep(borde, borde - 0.006, r);
  vec2 q = p / uRadio;
  float giro = fbm(q * 2.2 + vec2(uTime * 0.12, -uTime * 0.08) + fbm(q * 3.0 - uTime * 0.1));
  vec3 crema = vec3(0.906, 0.886, 0.855);
  vec3 rosa = vec3(0.961, 0.796, 0.843);
  vec3 cacao = vec3(0.204, 0.098, 0.039);
  float luz = clamp(1.0 - length(q - vec2(-0.35, 0.4)) * 0.75, 0.0, 1.0);
  vec3 cuerpo = mix(cacao, rosa, smoothstep(0.25, 0.85, giro));
  cuerpo = mix(cuerpo, crema, pow(luz, 2.2) * 0.85);
  cuerpo *= 0.75 + 0.35 * smoothstep(1.0, 0.2, r / uRadio);
  float halo = exp(-max(r - borde, 0.0) * 9.0) * (0.22 + uHabla * 0.25);
  vec3 col = vec3(0.071, 0.051, 0.039);
  col += rosa * halo * (1.0 - dentro);
  col = mix(col, cuerpo, dentro);
  col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(col * uIntro, 1.0);
}`;

export async function crearFresa({ reducido }) {
  const html = document.documentElement;
  const el = document.querySelector('[data-fresa-el]');
  const texto = el?.querySelector('[data-fresa-texto]');
  const pista = el?.querySelector('[data-fresa-pista]');
  const barra = el?.querySelector('[data-fresa-barra]');
  const conRaton = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const orbe = montarOrbe(reducido);
  html.classList.add('gl-activo');

  // --- El globo -------------------------------------------------------------
  let actual = '';
  let escribiendo = null;
  let ocultar = null;
  let introHecha = false;
  let contexto = false;
  let seccionActual = null;
  function decir(frase, { pistaVisible = true } = {}) {
    if (!el || frase === actual) return;
    actual = frase;
    clearInterval(escribiendo);
    el.classList.toggle('fresa--vacio', !frase);
    pista.style.display = pistaVisible ? '' : 'none';
    if (!frase) return;
    // En el móvil el globo tapa contenido: se esconde solo a los 5 s (vuelve con la sección siguiente)
    if (!conRaton) { clearTimeout(ocultar); ocultar = setTimeout(() => { if (!hablando) { el.classList.add('fresa--vacio'); actual = ''; } }, 5000); }
    if (reducido) { texto.textContent = frase; return; }
    let i = 0;
    texto.textContent = '';
    escribiendo = setInterval(() => {
      i += 2;
      texto.textContent = frase.slice(0, i);
      if (i >= frase.length) clearInterval(escribiendo);
    }, 26);
    sonido.tic(0.45);
  }

  // Sigue al ratón con inercia y se da la vuelta cerca del borde derecho
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, prev = performance.now();
  if (conRaton) {
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; mirarDebajo(e.target); orbe.raton(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('scroll', () => mirarDebajo(document.elementFromPoint(tx, ty)), { passive: true });
    gsap.ticker.add(() => {
      const ahora = performance.now(); const dt = Math.min(0.05, (ahora - prev) / 1000); prev = ahora;
      const a = 1 - Math.exp(-(reducido ? 60 : 7) * dt);
      x += (tx - x) * a; y += (ty - y) * a;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.classList.toggle('fresa--izq', x > innerWidth - 360);
    });
  } else {
    // Móvil: el mensaje de la sección que se está viendo
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        seccionActual = en.target;
        if (introHecha && !hablando) decir(en.target.dataset.fresa);
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });   // la sección que cruza la mitad de la pantalla
    document.querySelectorAll('section[data-fresa]').forEach((s) => io.observe(s));
  }

  // Qué hay debajo: el elemento con data-fresa más cercano (un servicio, una mitad, la sección…)
  let candidato = null, espera = null;
  function mirarDebajo(destino) {
    if (hablando || html.classList.contains('en-umbral')) return;
    const nodo = destino?.closest?.('[data-fresa]');
    if (nodo === candidato) return;
    candidato = nodo;
    clearTimeout(espera);
    espera = setTimeout(() => { if (nodo) { contexto = true; decir(nodo.dataset.fresa); } }, 220);
  }

  // --- Hablar: mantener pulsado ----------------------------------------------
  let hablando = false;
  let voz = null;
  const elegirVoz = () => {
    const voces = window.speechSynthesis?.getVoices() || [];
    const es = voces.filter((v) => /^es(-|_)ES/i.test(v.lang));
    voz = es.find((v) => /google|elvira|helena|laura|m[oó]nica|paulina|dalia/i.test(v.name)) || es[0] || voces.find((v) => /^es/i.test(v.lang)) || null;
  };
  if (window.speechSynthesis) { elegirVoz(); speechSynthesis.onvoiceschanged = elegirVoz; }

  let temporizador = null, subtitulos = null;
  function hablar(seccion) {
    const discurso = seccion?.dataset.fresaVoz;
    if (!discurso) return;
    hablando = true;
    actual = '';
    el.classList.remove('fresa--vacio');
    pista.style.display = 'none';
    texto.textContent = '';
    const total = discurso.length;
    const avance = (n) => { barra.style.transform = `scaleX(${Math.min(1, n / total)})`; };
    const conVoz = sonido.sonidoActivo() && window.speechSynthesis && voz;
    // Subtítulos: avanzan al ritmo aproximado de la voz (unas 14 letras por segundo) y se corrigen con las
    // palabras que va avisando el navegador. Sin voz, solo se escriben.
    let pos = 0;
    const pintar = () => { texto.textContent = discurso.slice(0, pos); avance(pos); };
    subtitulos = setInterval(() => { pos = Math.min(total, pos + 1); pintar(); if (!conVoz && pos >= total) clearInterval(subtitulos); }, conVoz ? 70 : 32);
    if (conVoz) {
      sonido.atenuarMusica(true);
      const u = new SpeechSynthesisUtterance(discurso);
      u.voice = voz; u.lang = voz.lang; u.rate = 1.03; u.pitch = 1.04;
      u.onboundary = (ev) => { pos = Math.max(pos, ev.charIndex + (ev.charLength || 0)); pintar(); };
      u.onend = () => { pos = total; pintar(); callar(false); };
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    }
  }
  function callar(cancelar = true) {
    if (!hablando) return;
    hablando = false;
    clearInterval(subtitulos);
    if (cancelar && window.speechSynthesis) speechSynthesis.cancel();
    sonido.atenuarMusica(false);
    setTimeout(() => { barra.style.transform = 'scaleX(0)'; }, 400);
  }

  const esControl = (t) => t.closest && t.closest('a, button, input, label, [data-ajustes]');
  const empezarPulsacion = (e, cx, cy) => {
    if (esControl(e.target) || html.classList.contains('en-umbral')) return;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      const seccion = document.elementFromPoint(cx, cy)?.closest('section[data-fresa-voz]');
      hablar(seccion);
    }, 450);
  };
  const terminarPulsacion = () => { clearTimeout(temporizador); callar(); };
  if (conRaton) {
    window.addEventListener('pointerdown', (e) => { if (e.button === 0) empezarPulsacion(e, e.clientX, e.clientY); });
    window.addEventListener('pointerup', terminarPulsacion);
  } else {
    window.addEventListener('touchstart', (e) => { const t = e.touches[0]; empezarPulsacion(e, t.clientX, t.clientY); }, { passive: true });
    window.addEventListener('touchmove', () => clearTimeout(temporizador), { passive: true });
    window.addEventListener('touchend', terminarPulsacion);
  }
  window.addEventListener('blur', terminarPulsacion);
  gsap.ticker.add(() => {
    const amp = hablando ? 0.55 + Math.random() * 0.45 : 0;
    orbe.habla(amp);
    if (el) el.style.setProperty('--habla', String(1 + amp * 0.5));
  });

  return {
    activarCursor() {
      html.classList.add('fresa-visible');
      decir('Hola, soy FRESA, la IA de adsPartners.', { pistaVisible: false });
      // Después del saludo: si ya estás en otra sección, lo de esa sección; si no, cómo funciona
      setTimeout(() => {
        introHecha = true;
        if (hablando || contexto) return;
        if (seccionActual && seccionActual.id !== 'portada') decir(seccionActual.dataset.fresa);
        else decir(conRaton ? 'Mueve el ratón y te voy contando. Si mantienes pulsado, te lo leo.' : 'Baja y te voy contando. Mantén el dedo y te lo leo.');
      }, 3200);
    },
    entrar() { orbe.entrar(); },
    calidad() {},
  };
}

function montarOrbe(reducido) {
  const canvas = document.querySelector('#portada [data-gl]');
  const nada = { raton() {}, habla() {}, entrar() {} };
  if (!canvas) return nada;
  let renderer;
  try { renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio, 1.5), alpha: false, antialias: false }); } catch (e) { return nada; }
  const gl = renderer.gl;
  const sec = canvas.parentElement;
  const movil = () => innerWidth <= 760;
  const u = {
    uRes: { value: [1, 1] }, uTime: { value: 0 }, uHabla: { value: 0 }, uRaton: { value: [0.5, 0.5] },
    uCentro: { value: [0.5, 0.58] }, uRadio: { value: 0.19 }, uIntro: { value: 0 },
  };
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: u }) });
  const ajustar = () => {
    renderer.setSize(sec.clientWidth, sec.clientHeight);
    u.uRes.value = [gl.canvas.width, gl.canvas.height];
    u.uCentro.value = movil() ? [0.5, 0.61] : [0.53, 0.6];
    u.uRadio.value = movil() ? 0.1 : 0.2;
  };
  ajustar();
  window.addEventListener('resize', ajustar);
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(sec);
  let habla = 0;
  gsap.ticker.add((tiempo, delta) => {
    if (!visible || document.hidden) return;
    u.uTime.value += reducido ? 0 : Math.min(0.033, delta / 1000);
    u.uHabla.value += (habla - u.uHabla.value) * 0.25;
    renderer.render({ scene: malla });
  });
  gsap.to(u.uIntro, { value: 1, duration: reducido ? 0 : 1.6, ease: 'power2.out' });
  return {
    raton(cx, cy) { const r = sec.getBoundingClientRect(); u.uRaton.value = [(cx - r.left) / r.width, 1 - (cy - r.top) / r.height]; },
    habla(v) { habla = v; },
    entrar() { if (!reducido) gsap.fromTo(u.uRadio, { value: u.uRadio.value * 0.4 }, { value: u.uRadio.value, duration: 2, ease: 'elastic.out(1, 0.6)' }); },
  };
}
