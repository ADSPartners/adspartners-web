// Tech, «La sala de máquinas» (el slider de innovaciones de orano.group, con lo nuestro). Tres vistas:
// - slider: una innovación por pantalla; las flechas, la rueda, el dedo o el teclado pasan a la siguiente, volando
//   por el valle hasta su estación (tech/escena.js). Es circular: de la cuarta se pasa a la primera, y al revés.
//   Cada una espera a un lado (las pares a la izquierda, las impares a la derecha) y el texto se pone en el otro
//   (data-lado). El título entra con las letras desdobladas que se van limpiando y «Entrar» nace de su barrita rosa.
// - dentro: el modelo se va al lado contrario, el título baja al suyo y debajo está el artículo, que baja en su
//   capa. Los círculos sobre el modelo enseñan su etiqueta del inspector.
// - mision: la sala en alambre; el módulo de la misión (scripts/tech/<modulo>.js) pone lo suyo en la zona del centro.
// La dirección lleva el #slug de la innovación, para poder enlazarla.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { TECH } from '../data/tech.js';
import { crearEscena, ladoDe } from './tech/escena.js';
import { montarGlitch } from './tech/glitch.js';

const MISIONES = {
  factura: () => import('./tech/factura.js'),
  tejido: () => import('./tech/tejido.js'),
};
const dos = (n) => String(n).padStart(2, '0');

// El título entra (o sale) con letras desdobladas que se van limpiando: «AAUTTOMATIIZA» → «AUTOMATIZA»
function desdoblar(el, texto, { salir = false, reducido = false } = {}) {
  if (reducido) { el.textContent = texto; return Promise.resolve(); }
  const pasos = 11;
  return new Promise((fin) => {
    let k = 0;
    const id = setInterval(() => {
      k++;
      const p = salir ? k / pasos : 1 - k / pasos;          // probabilidad de que una letra salga doble
      el.replaceChildren(...[...texto].map((c) => {
        if (c === ' ' || Math.random() > p * 0.5) return document.createTextNode(c);
        const d = document.createElement('span');
        d.className = 'd';
        d.textContent = c;
        const f = document.createDocumentFragment();
        f.append(c, d);
        return f;
      }));
      el.style.opacity = salir ? String(1 - (k / pasos) * 0.9) : '1';
      if (k >= pasos) { clearInterval(id); if (!salir) el.textContent = texto; fin(); }
    }, 42);
  });
}

export function montarTech({ reducido, conRaton, lenis }) {
  const raiz = document.querySelector('[data-tech]');
  if (!raiz) return;
  lenis?.stop();
  document.documentElement.classList.add('tech-fija');
  const $ = (s) => raiz.querySelector(s);
  const $$ = (s) => [...raiz.querySelectorAll(s)];

  const escena = crearEscena($('[data-tec-lienzo]'), { conRaton, reducido, slugs: TECH.map((t) => t.slug) });
  const D = reducido ? 0 : 1;
  const VIAJE = 2.3;   // s de una estación a la siguiente

  const ui = {
    servicio: $('[data-tec-servicio]'), titulo: $('[data-tec-titulo]'), texto: $('[data-tec-texto]'), entrar: $('[data-tec-entrar]'),
    a: $('[data-tec-a]'), b: $('[data-tec-b]'), atras: $('[data-tec-atras]'), sig: $('[data-tec-sig]'),
    dentro: $('[data-tec-dentro]'), puntos: $('[data-tec-puntos]'), botones: $('[data-tec-botones]'), abrirMision: $('[data-tec-abrir-mision]'),
    mision: $('[data-tec-mision]'), orden: $('[data-tec-orden]'), zona: $('[data-tec-zona]'), leyenda: $('[data-tec-leyenda]'),
    explica: $('[data-tec-explica-t]'), gesto: $('[data-tec-gesto]'),
  };

  // estacion: por cuál va del recorrido (cualquier entero); i: qué innovación es (estacion mod 4)
  const N = TECH.length;
  const desdeHash = () => Math.max(0, TECH.findIndex((t) => `#${t.slug}` === location.hash));
  let estacion = desdeHash();
  let i = estacion;
  let vista = 'slider';
  let ocupado = false;
  let misionViva = null;

  const ponerVista = (v) => { vista = v; raiz.dataset.vista = v; };
  const marcarHash = () => { try { history.replaceState(null, '', `#${TECH[i].slug}`); } catch (e) { /* nada */ } };

  // --- Slider -----------------------------------------------------------------------------------------------------
  function pintarFicha() {
    const it = TECH[i];
    ui.servicio.textContent = it.servicio;
    ui.texto.textContent = it.texto;
    ui.a.textContent = dos(i + 1);
    ui.b.textContent = dos(((i + 1) % N) + 1);
    raiz.dataset.lado = ladoDe(estacion) < 0 ? 'izq' : 'der';
    $$('[data-tec-art]').forEach((art) => art.classList.toggle('es-actual', art.dataset.tecArt === it.slug));
    ui.abrirMision.hidden = !it.mision;
  }

  function entrarFicha() {
    const tl = gsap.timeline();
    tl.fromTo([ui.servicio, ui.texto], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 * D, stagger: 0.12, ease: 'power3.out' }, 0.15 * D);
    // «Entrar» nace de su barrita rosa
    tl.fromTo(ui.entrar, { scaleX: 0.04, opacity: 1 }, { scaleX: 1, duration: 0.7 * D, ease: 'power3.inOut' }, 0.35 * D);
    tl.fromTo(ui.entrar.firstElementChild, { opacity: 0 }, { opacity: 1, duration: 0.3 * D }, 0.9 * D);
    tl.fromTo([ui.a, ui.b], { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 * D, stagger: 0.06, ease: 'power3.out' }, 0);
    desdoblar(ui.titulo, TECH[i].titulo, { reducido });
    return tl;
  }

  // Pasar a la siguiente (dir 1) o a la anterior (-1): el texto se va, la cámara vuela y el texto nuevo entra al llegar
  async function ir(dir) {
    if (ocupado || vista !== 'slider') return;
    ocupado = true;
    sonido.viaje(VIAJE * D || 0.5, dir);
    gsap.to([ui.servicio, ui.texto, ui.a, ui.b], { opacity: 0, duration: 0.35 * D });
    gsap.to(ui.entrar.firstElementChild, { opacity: 0, duration: 0.12 * D });
    gsap.to(ui.entrar, { scaleX: 0.04, duration: 0.45 * D, ease: 'power3.in' });
    desdoblar(ui.titulo, TECH[i].titulo, { salir: true, reducido });
    estacion += dir;
    i = ((estacion % N) + N) % N;
    marcarHash();
    const tl = escena ? escena.viajar(estacion, VIAJE) : null;
    await new Promise((r) => setTimeout(r, VIAJE * 0.66 * 1000 * D));
    pintarFicha();
    entrarFicha();
    if (tl) await tl.then();
    ocupado = false;
  }

  ui.sig.addEventListener('click', () => ir(1));
  ui.atras.addEventListener('click', () => ir(-1));
  // La rueda y el touchpad: una innovación por gesto (la inercia del touchpad no cuenta como gesto nuevo)
  let ultimaRueda = 0;
  raiz.addEventListener('wheel', (e) => {
    if (vista !== 'slider') return;
    const ahora = performance.now();
    const quieto = ahora - ultimaRueda > 260;
    ultimaRueda = ahora;
    if (!quieto || Math.abs(e.deltaY) + Math.abs(e.deltaX) < 8) return;
    ir((e.deltaY || e.deltaX) > 0 ? 1 : -1);
  }, { passive: true });
  // El dedo
  let x0 = null;
  raiz.addEventListener('pointerdown', (e) => { if (vista === 'slider' && e.pointerType !== 'mouse') x0 = e.clientX; });
  raiz.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && vista === 'slider') ir(1);
    else if (e.key === 'ArrowLeft' && vista === 'slider') ir(-1);
    else if (e.key === 'Escape') { if (vista === 'mision') cerrarMision(); else if (vista === 'dentro') salir(); }
  });

  // --- Dentro -----------------------------------------------------------------------------------------------------
  const art = () => $(`[data-tec-art="${TECH[i].slug}"]`);
  function entrar() {
    if (ocupado || vista !== 'slider') return;
    sonido.abrir();
    ponerVista('dentro');
    ui.dentro.scrollTop = 0;
    escena?.vista('dentro');
    const a = art();
    gsap.fromTo(ui.dentro, { opacity: 0 }, { opacity: 1, duration: 0.6 * D, delay: 0.35 * D });
    gsap.fromTo(ui.botones, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.7 * D, delay: 0.6 * D, ease: 'power3.out' });
    gsap.fromTo(a.querySelector('.tec__baja i'), { scaleY: 0 }, { scaleY: 1, duration: 1 * D, delay: 0.8 * D, ease: 'power2.inOut' });
    desdoblar(a.querySelector('.tec__titulo'), TECH[i].titulo, { reducido });
    montarPuntos();
  }
  function salir() {
    if (vista !== 'dentro') return;
    sonido.cerrar();
    gsap.to([ui.dentro, ui.botones], {
      opacity: 0, duration: 0.4 * D, onComplete: () => {
        ponerVista('slider');
        gsap.set([ui.dentro, ui.botones], { clearProps: 'opacity,transform' });
      },
    });
    escena?.vista('slider');
    desmontarPuntos();
    setTimeout(() => entrarFicha(), 300 * D);
  }
  ui.entrar.addEventListener('click', entrar);
  $('[data-tec-cerrar]').addEventListener('click', salir);
  // «Siguiente» al final del artículo: vuelve al slider y pasa a la siguiente
  $$('[data-tec-siguiente]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    salir();
    setTimeout(() => ir(1), 900 * D);
  }));

  // Los círculos sobre el modelo: siguen a su punto y se apagan al bajar por el artículo
  let rafPuntos = 0;
  function montarPuntos() {
    desmontarPuntos();
    if (!escena) return;
    const els = TECH[i].puntos.map((pt) => {
      const el = document.createElement('span');
      el.className = 'tec__punto';
      el.innerHTML = '<span class="insp"></span>';
      el.querySelector('.insp').textContent = pt.t;
      el.addEventListener('pointerenter', () => sonido.tic(0.8));
      ui.puntos.append(el);
      return { el, pt };
    });
    gsap.fromTo(els.map((e) => e.el), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 * D, delay: 1.1 * D, stagger: 0.12, ease: 'back.out(2)' });
    const seguir = () => {
      rafPuntos = requestAnimationFrame(seguir);
      const bajado = Math.min(1, ui.dentro.scrollTop / (innerHeight * 0.4));
      ui.puntos.style.opacity = String(1 - bajado);
      ui.puntos.style.visibility = bajado >= 1 ? 'hidden' : '';
      for (const { el, pt } of els) {
        const s = escena.proyectar(pt.p);
        el.style.translate = `${s.x}px ${s.y - ui.dentro.scrollTop * 0.3}px`;
      }
    };
    seguir();
  }
  function desmontarPuntos() { cancelAnimationFrame(rafPuntos); ui.puntos.replaceChildren(); ui.puntos.style.opacity = ''; }

  // --- La misión -----------------------------------------------------------------------------------------------
  const panel = {
    orden(texto, estado = false) {
      ui.orden.classList.toggle('es-estado', estado);
      gsap.fromTo(ui.orden, { opacity: 0 }, { opacity: 1, duration: 0.4 * D });
      ui.orden.textContent = texto;
    },
    gesto(texto) { ui.gesto.textContent = texto || ''; },
    leyenda(nodo) { ui.leyenda.replaceChildren(...(nodo ? [nodo] : [])); },
    hecha(texto) {
      ui.explica.textContent = texto;
      ui.mision.classList.add('es-hecha');
      gsap.fromTo(ui.mision.querySelector('.tec__explica i'), { scaleX: 0 }, { scaleX: 1, duration: 0.8 * D, delay: 0.2 * D, ease: 'power3.out' });
    },
  };
  // La zona de la misión cae justo en el rectángulo rosa de la pared de la sala
  function colocarZona() {
    if (!escena) return;
    const a = escena.proyectarMundo([-1.9, 1.45, -3.19]);
    const b = escena.proyectarMundo([1.9, -1.2, -3.19]);
    Object.assign(ui.zona.style, { left: `${a.x}px`, top: `${a.y}px`, width: `${b.x - a.x}px`, height: `${b.y - a.y}px`, transform: 'none' });
    ui.mision.style.setProperty('--zona-abajo', `${b.y}px`);
  }
  addEventListener('resize', () => { if (vista === 'mision') colocarZona(); });

  async function abrirMision() {
    const m = TECH[i].mision;
    if (!m || vista !== 'dentro') return;
    sonido.abrir();
    desmontarPuntos();
    gsap.to([ui.dentro, ui.botones], { opacity: 0, duration: 0.4 * D });
    escena?.vista('mision');
    await new Promise((r) => setTimeout(r, 500 * D));
    ponerVista('mision');
    gsap.set([ui.dentro, ui.botones], { clearProps: 'opacity,transform' });
    ui.mision.classList.remove('es-hecha');
    panel.leyenda(null);
    panel.gesto('');
    panel.orden(m.orden);
    ui.zona.replaceChildren();
    await new Promise((r) => setTimeout(r, 700 * D));
    colocarZona();
    const { montar } = await MISIONES[m.modulo]();
    misionViva = await montar(ui.zona, { mision: m, panel, sonido, reducido, conRaton });
  }
  function cerrarMision() {
    if (vista !== 'mision') return;
    sonido.cerrar();
    misionViva?.destruir?.();
    misionViva = null;
    ui.zona.replaceChildren();
    ponerVista('dentro');
    escena?.vista('dentro');
    gsap.fromTo([ui.dentro, ui.botones], { opacity: 0 }, { opacity: 1, duration: 0.6 * D, delay: 0.5 * D });
    ui.dentro.scrollTop = 0;
    montarPuntos();
  }
  ui.abrirMision.addEventListener('click', abrirMision);
  $('[data-tec-cerrar-m]').addEventListener('click', cerrarMision);

  // Las letras notan el ratón (solo las de la vista que se ve, y solo con ratón)
  if (conRaton && !reducido) {
    montarGlitch(raiz, {
      vale: (el) => {
        const capa = el.closest('[data-glitch-capa]')?.dataset.glitchCapa;
        return capa === vista && (capa !== 'dentro' || el.closest('.tec__art')?.classList.contains('es-actual'));
      },
    });
  }

  // --- Arranque: la cámara llega volando a su estación ---------------------------------------------------------------
  pintarFicha();
  ui.titulo.textContent = '';
  escena?.entrar(estacion);
  setTimeout(() => entrarFicha(), 1100 * D);
}
