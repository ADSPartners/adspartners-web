// Proyectos: las piezas suben con el scroll a velocidades distintas; al señalar una se escribe encima a máquina
// (con su sonido) y se acerca un poco; al abrirla viaja al centro, las demás salen de la pantalla y se cuenta el
// proyecto. En el móvil: primer toque = señalar, segundo toque = abrir, toque fuera = quitar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as sonido from '../sonido.js';

gsap.registerPlugin(ScrollTrigger);

const azar = (i, k) => { const s = Math.sin(i * 91.7 + k * 47.3) * 43758.5453; return s - Math.floor(s); };

export function montar(sec, { reducido, conRaton, lenis, cursor }) {
  const html = document.documentElement;
  const datos = Object.fromEntries(JSON.parse(sec.querySelector('[data-pro-datos]').textContent).map((p) => [p.slug, p]));
  const piezas = [...sec.querySelectorAll('[data-pro-pieza]')];
  const abierto = sec.querySelector('[data-pro-abierto]');
  const foco = sec.querySelector('[data-pro-foco]');
  const ficha = sec.querySelector('[data-pro-ficha]');
  const tactil = !matchMedia('(hover: hover) and (pointer: fine)').matches;

  // --- El scroll: cada pieza sube a su velocidad ---------------------------------
  let L = 1, p = 0, estado = 'lienzo';
  const vel = piezas.map((_, i) => 0.86 + azar(i, 1) * 0.36);
  let base = [];
  function medir() {
    L = Math.max(1, sec.offsetHeight - innerHeight);
    const n = piezas.length;
    // La última pieza llega a media pantalla justo al final; la primera asoma ya al empezar
    const hueco = (L * 0.98 - innerHeight * 0.55) / Math.max(1, n - 1);
    base = piezas.map((_, i) => innerHeight * 0.78 + i * hueco * (0.92 + azar(i, 2) * 0.16));
  }
  medir();
  addEventListener('resize', () => { medir(); colocar(); });

  function colocar() {
    if (reducido || estado !== 'lienzo') return;
    const s = p * L;
    piezas.forEach((el, i) => { el.style.transform = `translate3d(0, ${(base[i] - s * vel[i]).toFixed(1)}px, 0)`; });
  }
  if (!reducido) {
    ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (st) => { p = st.progress; colocar(); } });
    colocar();
  }

  // --- Escribir a máquina sobre la pieza -----------------------------------------
  // Un estado por pieza: n letras escritas; avanza con sonido al señalar y retrocede deprisa al soltar
  const escritos = new Map();
  function estadoDe(el) {
    if (escritos.has(el)) return escritos.get(el);
    const pr = datos[el.dataset.proyecto];
    const destino = el.querySelector('[data-pro-escrito]');
    const total = [pr.nombre, pr.linea, tactil ? '→ Toca otra vez para verlo' : '→ Clic para verlo'].join('\n');
    const e = {
      n: 0, t: null, total,
      pintar() {
        if (!e.n) { destino.innerHTML = ''; return; }
        const txt = total.slice(0, e.n);
        const corte = txt.indexOf('\n');
        const cab = corte < 0 ? txt : txt.slice(0, corte);
        const resto = corte < 0 ? '' : txt.slice(corte + 1);
        destino.innerHTML = `<b>${esc(cab)}</b>${esc(resto)}<span class="caret"></span>`;
      },
    };
    escritos.set(el, e);
    return e;
  }
  function escribir(el) {
    const e = estadoDe(el);
    clearTimeout(e.t);
    if (reducido) { e.n = e.total.length; e.pintar(); return; }
    const paso = () => {
      if (e.n >= e.total.length) return;
      const ch = e.total[e.n++];
      if (ch.trim()) sonido.tecla(0.8);
      e.pintar();
      e.t = setTimeout(paso, ch === '\n' ? 140 : 16 + Math.random() * 22);
    };
    paso();
  }
  function borrar(el) {
    const e = estadoDe(el);
    clearTimeout(e.t);
    if (reducido) { e.n = 0; e.pintar(); return; }
    const atras = () => {
      e.n = Math.max(0, e.n - 3);
      e.pintar();
      if (e.n > 0) e.t = setTimeout(atras, 8);
    };
    atras();
  }
  function pararEscrito(el) { const e = escritos.get(el); if (e) clearTimeout(e.t); }

  let activa = null;
  function señalar(el) {
    if (activa === el) return;
    if (activa) soltar(activa);
    activa = el;
    el.classList.add('activa');
    escribir(el);
    cursor?.decir?.('Ver');
  }
  function soltar(el) {
    el.classList.remove('activa');
    borrar(el);
    if (activa === el) activa = null;
    cursor?.decir?.('');
  }

  piezas.forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && estado === 'lienzo') señalar(el); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && estado === 'lienzo') soltar(el); });
    el.addEventListener('click', () => {
      if (estado !== 'lienzo') return;
      if (tactil && activa !== el) { señalar(el); return; }
      abrir(el);
    });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(el); } });
    el.addEventListener('focus', () => { if (estado === 'lienzo') señalar(el); });
    el.addEventListener('blur', () => { if (estado === 'lienzo' && activa === el) soltar(el); });
  });
  // En el móvil, un toque fuera de las piezas quita el texto
  document.addEventListener('click', (e) => { if (tactil && activa && estado === 'lienzo' && !e.target.closest('[data-pro-pieza]')) soltar(activa); });
  // Al entrar en el lienzo, el cursor se calla (traía el mensaje de la portada) hasta señalar una pieza
  sec.addEventListener('pointerenter', () => { if (!activa) cursor?.decir?.(''); });

  // --- Abrir y cerrar ---------------------------------------------------------------
  let origen = null, marcoOrigen = null;

  function destinoFoco(ar) {
    const movil = innerWidth <= 760;
    if (movil) {
      const w = innerWidth * 0.86, h = Math.min(w / ar, innerHeight * 0.4);
      return { left: (innerWidth - h * ar) / 2, top: innerHeight * 0.1, width: h * ar, height: h };
    }
    const maxW = innerWidth * 0.5, maxH = innerHeight * 0.72;
    let w = maxW, h = w / ar;
    if (h > maxH) { h = maxH; w = h * ar; }
    return { left: innerWidth * 0.36 - w / 2, top: (innerHeight - h) / 2, width: w, height: h };
  }

  function abrir(el) {
    if (estado !== 'lienzo') return;
    estado = 'abriendo';
    const pr = datos[el.dataset.proyecto];
    origen = el;
    marcoOrigen = el.querySelector('[data-pro-marco]');
    pararEscrito(el);
    lenis?.stop();
    html.classList.add('pro-abierto');
    cursor?.decir?.('');
    sonido.abrir();

    // El foco: una copia de lo que se ve en la pieza, en su sitio exacto, que viaja al centro
    const r = marcoOrigen.getBoundingClientRect();
    const ar = r.width / r.height;
    foco.innerHTML = '';
    const copia = (marcoOrigen.querySelector(':scope > img') || marcoOrigen.querySelector('.pro__tarjeta')).cloneNode(true);
    foco.appendChild(copia);
    abierto.hidden = false;
    rellenarFicha(pr);
    el.style.visibility = 'hidden';
    const d = destinoFoco(ar);
    const dur = reducido ? 0 : 1;
    gsap.set(foco, { left: r.left, top: r.top, width: r.width, height: r.height, scale: 1 });
    gsap.timeline({ onComplete: () => { estado = 'abierto'; ficha.querySelector('[data-f="enlace"]').focus({ preventScroll: true }); } })
      .to(foco, { left: d.left, top: d.top, width: d.width, height: d.height, duration: dur, ease: 'expo.inOut' }, 0)
      .fromTo(foco, { scale: 1 }, { scale: 1.04, duration: dur * 0.6, ease: 'power2.out', yoyo: true, repeat: 1 }, 0.1)
      .fromTo(sec.querySelector('.pro__fondo-abierto'), { opacity: 0 }, { opacity: 1, duration: dur * 0.6 }, 0)
      .fromTo(sec.querySelector('.pro__cerrar'), { opacity: 0 }, { opacity: 1, duration: dur * 0.5 }, dur * 0.6)
      .fromTo(ficha.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: dur * 0.7, stagger: 0.06, ease: 'power3.out' }, dur * 0.55);

    // Las demás salen de la pantalla, cada una por el lado que tiene más cerca
    const cx = innerWidth / 2, cy = innerHeight / 2;
    piezas.forEach((otra) => {
      if (otra === el) return;
      const m = otra.querySelector('[data-pro-marco]');
      const ro = m.getBoundingClientRect();
      const dx = ro.left + ro.width / 2 - cx, dy = ro.top + ro.height / 2 - cy;
      const len = Math.hypot(dx, dy) || 1;
      gsap.to(m, {
        x: (dx / len) * innerWidth * 0.75, y: (dy / len) * innerHeight * 0.75, scale: 0.8, opacity: 0, filter: 'blur(8px)',
        duration: reducido ? 0 : 0.8, ease: 'power3.in', delay: reducido ? 0 : Math.min(0.25, len / 4000),
      });
    });
    gsap.to(sec.querySelector('.pro__cabeza'), { opacity: 0, duration: dur * 0.4 });
    escribirNombre(pr.nombre);
  }

  function cerrar() {
    if (estado !== 'abierto' && estado !== 'abriendo') return;
    estado = 'cerrando';
    sonido.cerrar();
    const r = marcoOrigen.getBoundingClientRect();
    const dur = reducido ? 0 : 0.8;
    gsap.timeline({
      onComplete: () => {
        abierto.hidden = true;
        foco.innerHTML = '';
        origen.style.visibility = '';
        html.classList.remove('pro-abierto');
        lenis?.start();
        estado = 'lienzo';
        origen.focus({ preventScroll: true });
        soltar(origen);
      },
    })
      .to(ficha.children, { opacity: 0, y: 10, duration: dur * 0.3, stagger: 0.02 }, 0)
      .to([sec.querySelector('.pro__cerrar'), sec.querySelector('.pro__fondo-abierto')], { opacity: 0, duration: dur * 0.5 }, 0.1)
      .to(foco, { left: r.left, top: r.top, width: r.width, height: r.height, duration: dur, ease: 'expo.inOut' }, 0.05);
    piezas.forEach((otra) => {
      if (otra === origen) return;
      gsap.to(otra.querySelector('[data-pro-marco]'), { x: 0, y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: dur, ease: 'power3.out', delay: dur * 0.3, clearProps: 'filter,transform,opacity' });
    });
    gsap.to(sec.querySelector('.pro__cabeza'), { opacity: 1, duration: dur, delay: dur * 0.4 });
  }

  function rellenarFicha(pr) {
    const f = (k) => ficha.querySelector(`[data-f="${k}"]`);
    f('etq').textContent = [pr.rama, pr.anio, pr.sector].filter(Boolean).join(' · ');
    f('nombre').textContent = '';
    f('con').textContent = pr.con || '';
    f('con').hidden = !pr.con;
    f('texto').textContent = pr.texto;
    f('datos').innerHTML = pr.datos.map((d) => `<li>${esc(d)}</li>`).join('');
    f('enlace').href = pr.enlace;
  }

  // El nombre del proyecto se escribe a máquina en la ficha
  function escribirNombre(nombre) {
    const el = ficha.querySelector('[data-f="nombre"]');
    if (reducido) { el.textContent = nombre; return; }
    let n = 0;
    const paso = () => {
      if (estado === 'cerrando' || estado === 'lienzo') return;
      el.textContent = nombre.slice(0, ++n);
      if (nombre[n - 1]?.trim()) sonido.tecla(1);
      if (n < nombre.length) setTimeout(paso, 38 + Math.random() * 30);
    };
    setTimeout(paso, 520);
  }

  sec.querySelector('[data-pro-cerrar]').addEventListener('click', cerrar);
  sec.querySelector('[data-pro-cerrar-fondo]').addEventListener('click', cerrar);
  foco.addEventListener('click', cerrar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && estado === 'abierto') cerrar(); });
  // Si cambia el tamaño con un proyecto abierto, el foco se recoloca
  addEventListener('resize', () => {
    if (estado !== 'abierto') return;
    const r = marcoOrigen.getBoundingClientRect();
    gsap.set(foco, destinoFoco(r.width / r.height));
  });
}

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
