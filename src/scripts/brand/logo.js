// logotipo.svg. Lo agarras por una esquina (o por donde sea) y lo estiras, lo aplastas o lo giras. Se resiste cuanto
// más tiras, como una goma, y enseña cómo está hecho: contornos y nodos, como Illustrator en modo contorno. La etiqueta
// del inspector mide lo que haces de verdad. Al soltar no vuelve solo: se abre por debajo el código que lo pinta, con tu
// transform, y el código lo reescribe (brand/dentro.js). Si lo vuelves a agarrar a mitad, sigues desde donde está.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';
import { LOGO, CODIGO, COMENTARIOS } from '../../data/brand.js';

const goma = (v, k) => k * Math.tanh(v / k);   // cuanto más tiras, menos cede
const RAD = Math.PI / 180;
const UMBRAL = 0.06;   // lo que tiene que desviarse para que cuente como intento (6 %, o 3° de giro)
const f2 = (n) => (Math.round(n * 100) / 100).toString();

export function montarLogo(bl, ctx) {
  const { reducido, conRaton, cursor, intento, romper, comentario } = ctx;
  const pz = bl.closest('[data-pz]');
  const dentro = ctx.dentro('logo');
  const svg = bl.querySelector('[data-bl-svg]');
  const g = bl.querySelector('[data-bl-g]');
  const asas = Object.fromEntries([...bl.querySelectorAll('[data-bl-asa]')].map((a) => [a.dataset.blAsa, a]));
  const brazo = bl.querySelector('[data-bl-brazo]');
  const etq = bl.querySelector('[data-bl-etq]');
  const cota = bl.querySelector('[data-bl-cota]');
  const VW = svg.viewBox.baseVal.width, VH = svg.viewBox.baseVal.height;
  const trazo = svg.querySelector('.bl__relleno path')?.getAttribute('d').slice(0, 20).trim();
  const trazados = Number(bl.dataset.trazados), nodos = Number(bl.dataset.nodos);

  const e = { sx: 1, sy: 1, giro: 0 };
  let tam = { w: 1, h: 1, x: 0, y: 0 };
  let arrastre = null;
  let nivel = 0;
  let tEscribe = null, tCierra = null;
  let visible = false, demoHecha = false;

  const desvio = () => Math.max(Math.abs(e.sx / e.sy - 1), Math.abs(e.sx - 1), Math.abs(e.sy - 1));
  const roto = () => desvio() >= UMBRAL || Math.abs(e.giro) >= 3;

  function medir() {
    const r = bl.getBoundingClientRect();
    tam = { w: r.width, h: r.height, x: r.left, y: r.top };
    cota.textContent = `${Math.round(r.width)} px`;
  }

  // De la caja sin tocar (px desde su centro) a la deformada, en px de la caja
  function punto(px, py) {
    const x = px * e.sx, y = py * e.sy;
    const c = Math.cos(e.giro * RAD), s = Math.sin(e.giro * RAD);
    return [tam.w / 2 + x * c - y * s, tam.h / 2 + x * s + y * c];
  }

  function aplicar() {
    const cx = VW / 2, cy = VH / 2;
    g.setAttribute('transform', `translate(${cx} ${cy}) rotate(${e.giro}) scale(${e.sx} ${e.sy}) translate(${-cx} ${-cy})`);
    const { w, h } = tam;
    const ne = punto(w / 2, -h / 2), so = punto(-w / 2, h / 2), no = punto(-w / 2, -h / 2);
    asas.ne.style.transform = `translate(${ne[0]}px, ${ne[1]}px)`;
    asas.so.style.transform = `translate(${so[0]}px, ${so[1]}px)`;
    // El giro: por encima de la esquina de arriba a la derecha, unido por su brazo
    const L = 30, a = e.giro * RAD;
    asas.giro.style.transform = `translate(${ne[0] + Math.sin(a) * L}px, ${ne[1] - Math.cos(a) * L}px)`;
    brazo.style.height = `${L}px`;
    brazo.style.transform = `translate(${ne[0]}px, ${ne[1]}px) rotate(${e.giro + 180}deg)`;
    // La etiqueta, encima de lo que se ve y siempre dentro de la pantalla
    const esq = [no, ne, punto(w / 2, h / 2), so];
    const x0 = Math.min(...esq.map((p) => p[0])) - 8, y0 = Math.min(...esq.map((p) => p[1])) - 8;
    const ex = Math.min(Math.max(x0 - 1, 12 - tam.x), innerWidth - 12 - tam.x - etq.offsetWidth);
    etq.style.transform = `translate(${ex.toFixed(1)}px, ${(y0 - 6).toFixed(1)}px) translateY(-100%)`;
    if (etq.dataset.vivo) etq.textContent = texto();
  }

  // Lo que dice la etiqueta: la transformación que pinta el logo y su proporción frente a la buena
  function texto() {
    const prop = LOGO.proporcion * e.sx / e.sy;
    const grados = Math.round(e.giro);
    const igual = Math.abs(prop / LOGO.proporcion - 1) < 0.005;
    return `g.logotipo · scale(${f2(e.sx)}, ${f2(e.sy)})${grados ? ` rotate(${grados}deg)` : ''} · ${f2(prop)}:1 ${igual ? '=' : '≠'} ${f2(LOGO.proporcion)}:1${grados ? ` · ${grados}° ≠ 0°` : ''}`;
  }
  const transformCodigo = () => `scale(${f2(e.sx)} ${f2(e.sy)})${Math.round(e.giro) ? ` rotate(${Math.round(e.giro)})` : ''}`;

  function escribir(txt, luego) {
    clearTimeout(tEscribe);
    clearTimeout(tCierra);
    delete etq.dataset.vivo;
    etq.classList.add('on');
    let n = 0;
    const paso = () => {
      etq.textContent = txt.slice(0, ++n);
      if (n < txt.length) tEscribe = setTimeout(paso, 14);
      else luego?.();
    };
    paso();
  }
  function cerrarEtq(espera = 0) {
    clearTimeout(tCierra);
    tCierra = setTimeout(() => { clearTimeout(tEscribe); delete etq.dataset.vivo; etq.classList.remove('on'); }, espera);
  }

  // Las reglas que se rompen, en vivo
  function contarReglas() {
    romper('logo-proporcion', desvio() >= UMBRAL);
    romper('logo-giro', Math.abs(e.giro) >= 3);
  }

  // --- Por dentro: el código con tu transform, la regla como comentario y el arreglo ----------------------------
  async function defender({ demo = false } = {}) {
    const porGiro = Math.abs(e.giro) / 45 > desvio();
    if (!demo) intento();
    const lineas = CODIGO.logo({ transform: transformCodigo(), trazo, trazados, nodos });
    const s = lineas[1];
    cerrarEtq(240);
    const hecho = await dentro.porDentro({
      lineas,
      comentario: { en: 1, texto: `<!-- ${demo ? COMENTARIOS.demo : comentario(porGiro ? 'giro' : 'logo')} -->` },
      cambios: [{ l: 1, i: s.indexOf('"') + 1, j: s.lastIndexOf('"'), por: 'scale(1)' }],
      alVolver: () => volver(1.3),
    });
    if (hecho) contarReglas();
  }

  function volver(duracion = 0.9) {
    gsap.to(e, {
      sx: 1, sy: 1, giro: 0, duration: reducido ? 0.01 : duracion, ease: reducido ? 'none' : 'elastic.out(1, 0.4)',
      onUpdate: aplicar, onComplete: contarReglas, overwrite: true,
    });
  }

  // --- Tirar ---------------------------------------------------------------------------------------------------
  function empezar(ev, tipo) {
    if (ev.button > 0 || arrastre) return;
    ev.preventDefault();
    dentro.cancelar();
    gsap.killTweensOf(e);
    medir();
    const cx = tam.x + tam.w / 2, cy = tam.y + tam.h / 2;
    // De qué lado se agarra, en el marco del logo (si ya va girado)
    const c = Math.cos(-e.giro * RAD), s = Math.sin(-e.giro * RAD);
    const lx = (ev.clientX - cx) * c - (ev.clientY - cy) * s, ly = (ev.clientX - cx) * s + (ev.clientY - cy) * c;
    arrastre = {
      tipo, id: ev.pointerId, cx, cy, x0: ev.clientX, y0: ev.clientY,
      lx: Math.sign(lx) || 1, ly: Math.sign(ly) || 1,
      sx0: e.sx, sy0: e.sy, giro0: e.giro, a0: Math.atan2(ev.clientY - cy, ev.clientX - cx),
    };
    try { ev.target.setPointerCapture(ev.pointerId); } catch (err) { /* sin captura */ }
    bl.classList.add('tirando', 'cerca');
    pz.classList.add('tirando');
    ctx.tirando(true);
    nivel = 0;
    escribir(texto(), () => { etq.dataset.vivo = '1'; etq.textContent = texto(); });
    sonido.tic(0.5);
    cursor.pulsando(true);
    cursor.decir(tipo === 'giro' ? 'Gíralo' : 'Tira');
  }

  function mover(ev) {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    const a = arrastre;
    if (a.tipo === 'giro') {
      let d = (Math.atan2(ev.clientY - a.cy, ev.clientX - a.cx) - a.a0) / RAD;
      d = ((d + 540) % 360) - 180;
      e.giro = goma(a.giro0 + d, 55);
    } else {
      // Lo que has tirado, en el marco del logo, frente a media caja: hacia fuera agranda, hacia dentro aplasta
      // (en alto, frente a la caja entera: el logo es tan bajo que media caja cede demasiado)
      const dx = ev.clientX - a.x0, dy = ev.clientY - a.y0;
      const c = Math.cos(-e.giro * RAD), s = Math.sin(-e.giro * RAD);
      const ex = (dx * c - dy * s) * a.lx / (tam.w / 2), ey = (dx * s + dy * c) * a.ly / tam.h;
      e.sx = Math.max(0.3, a.sx0 + goma(ex, 1.1));
      e.sy = Math.max(0.3, a.sy0 + goma(ey, 1.2));
    }
    aplicar();
    contarReglas();
    // La tensión suena cada vez que sube un escalón
    const t = Math.min(1, (Math.abs(Math.log(e.sx)) + Math.abs(Math.log(e.sy)) + Math.abs(e.giro) / 45) / 1.1);
    const escalon = Math.floor(t * 5);
    if (escalon > nivel) sonido.empuje(t);
    nivel = escalon;
  }

  function soltar(ev) {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    arrastre = null;
    ctx.tirando(false);
    cursor.pulsando(false);
    cursor.decir('Otra vez');
    bl.classList.remove('tirando');
    pz.classList.remove('tirando');
    if (!conRaton || !pz.matches(':hover')) bl.classList.remove('cerca');
    if (roto()) defender();
    else { volver(); cerrarEtq(600); }
  }

  svg.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.ne.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.so.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.giro.addEventListener('pointerdown', (ev) => empezar(ev, 'giro'));
  addEventListener('pointermove', mover, { passive: true });
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);

  // El plano y las asas salen al acercarse; el cursor dice qué hacer
  if (conRaton) {
    pz.addEventListener('pointerenter', () => bl.classList.add('cerca'));
    pz.addEventListener('pointerleave', () => { if (!arrastre) bl.classList.remove('cerca'); });
    asas.giro.addEventListener('pointerenter', () => { if (!arrastre) cursor.decir('Gíralo'); });
    asas.giro.addEventListener('pointerleave', () => { if (!arrastre) cursor.decir('Estíralo'); });
  }

  new ResizeObserver(() => { medir(); aplicar(); }).observe(bl);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.7 }).observe(bl);
  medir();
  aplicar();

  return {
    // La mano fantasma: tira del logo ella sola y se ven los tres tiempos (no cuenta como intento). Devuelve false si
    // ahora no se puede (no se ve el logo, o ya estás tú)
    demo() {
      if (demoHecha) return true;
      if (!visible || arrastre || dentro.ocupado()) return false;
      demoHecha = true;
      medir();
      ctx.tirando(true);
      bl.classList.add('cerca', 'tirando');
      escribir(texto(), () => { etq.dataset.vivo = '1'; etq.textContent = texto(); });
      gsap.timeline({ onUpdate() { aplicar(); contarReglas(); } })
        .to(e, { sx: 1.38, sy: 0.78, giro: -4, duration: 1.1, ease: 'power2.inOut', onStart: () => sonido.empuje(0.4) })
        .to({}, { duration: 0.35 })
        .call(() => {
          if (arrastre) return;
          ctx.tirando(false);
          bl.classList.remove('tirando');
          if (!conRaton || !pz.matches(':hover')) bl.classList.remove('cerca');
          defender({ demo: true });
        });
      return true;
    },
  };
}
