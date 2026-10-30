// La p. 29, el logotipo. Lo agarras por una esquina (o por donde sea) y lo estiras, lo aplastas o lo giras. Se resiste
// cuanto más tiras, como una goma, y enseña cómo está hecho: contornos y nodos, como Illustrator en modo contorno. El
// inspector mide lo que has hecho de verdad (la transformación que lo pinta y su proporción frente a la buena). Al
// soltar vuelve a su sitio con un muelle y el manual se queja al margen, a boli.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';
import { LOGO } from '../../data/brand.js';

const goma = (v, k) => k * Math.tanh(v / k);   // cuanto más tiras, menos cede
const RAD = Math.PI / 180;
const UMBRAL = 0.06;   // lo que tiene que desviarse para que cuente como intento (6 %, o 3° de giro)
const f2 = (n) => (Math.round(n * 100) / 100).toString();

export function montarLogo(bl, { reducido, conRaton, cursor, intento }) {
  const svg = bl.querySelector('[data-bl-svg]');
  const g = bl.querySelector('[data-bl-g]');
  const asas = Object.fromEntries([...bl.querySelectorAll('[data-bl-asa]')].map((a) => [a.dataset.blAsa, a]));
  const brazo = bl.querySelector('[data-bl-brazo]');
  const caja = bl.querySelector('[data-bl-caja]');
  const etq = bl.querySelector('[data-bl-etq]');
  const queja = bl.querySelector('[data-bl-queja]');
  const quejaT = queja.querySelector('[data-bl-queja-t]');
  const flecha = bl.querySelector('.bl__flecha path');
  const cotaX = bl.querySelector('[data-bl-cota="x"]');
  const cotaY = bl.querySelector('[data-bl-cota="y"]');
  const VW = svg.viewBox.baseVal.width, VH = svg.viewBox.baseVal.height;

  const e = { sx: 1, sy: 1, giro: 0 };
  let tam = { w: 1, h: 1 };
  let arrastre = null;
  let nivel = 0;
  let quejas = 0;
  let quejaEnEsta = false;
  let tEscribe = null, tCierra = null, tQueja = null;

  const desvio = () => Math.max(Math.abs(e.sx / e.sy - 1), Math.abs(e.sx - 1), Math.abs(e.sy - 1));
  const roto = () => desvio() >= UMBRAL || Math.abs(e.giro) >= 3;

  function medir() {
    const r = bl.getBoundingClientRect();
    tam = { w: r.width, h: r.height, x: r.left, y: r.top };
    cotaX.textContent = `${Math.round(r.width)} px`;
    cotaY.textContent = `${Math.round(r.height)} px`;
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
    // El giro: por encima de la esquina de arriba a la derecha, unido por su brazo (a la izquierda va la etiqueta)
    const L = 34, a = e.giro * RAD;
    asas.giro.style.transform = `translate(${ne[0] + Math.sin(a) * L}px, ${ne[1] - Math.cos(a) * L}px)`;
    brazo.style.height = `${L}px`;
    brazo.style.transform = `translate(${ne[0]}px, ${ne[1]}px) rotate(${e.giro + 180}deg)`;
    // La caja del inspector, alrededor de lo que se ve
    const esq = [no, ne, punto(w / 2, h / 2), so];
    const xs = esq.map((p) => p[0]), ys = esq.map((p) => p[1]);
    const x0 = Math.min(...xs) - 8, y0 = Math.min(...ys) - 8, x1 = Math.max(...xs) + 8, y1 = Math.max(...ys) + 8;
    caja.style.transform = `translate(${x0}px, ${y0}px)`;
    caja.style.width = `${x1 - x0}px`;
    caja.style.height = `${y1 - y0}px`;
    // La etiqueta, encima de la caja y siempre dentro de la pantalla (en el móvil puede ocupar dos líneas)
    const ex = Math.min(Math.max(x0 - 1, 12 - tam.x), innerWidth - 12 - tam.x - etq.offsetWidth);
    etq.style.transform = `translate(${ex.toFixed(1)}px, ${y0 - 6}px) translateY(-100%)`;
    // La queja va encima, en el margen: si el logo crece hacia arriba, se aparta
    queja.style.transform = `translateY(${Math.min(0, y0 + 8).toFixed(1)}px) rotate(-4deg)`;
    if (etq.dataset.vivo) etq.textContent = texto();
  }

  // Lo que dice el inspector: la transformación que pinta el logo y su proporción frente a la buena
  function texto() {
    const prop = LOGO.proporcion * e.sx / e.sy;
    const grados = Math.round(e.giro);
    const igual = Math.abs(prop / LOGO.proporcion - 1) < 0.005;
    const giro = grados ? ` rotate(${grados}deg)` : '';
    return `g.logotipo · scale(${f2(e.sx)}, ${f2(e.sy)})${giro} · ${f2(prop)}:1 ${igual ? '=' : '≠'} ${f2(LOGO.proporcion)}:1${grados ? ` · ${grados}° ≠ 0°` : ''}`;
  }

  function escribir(txt, luego) {
    clearTimeout(tEscribe);
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

  function abrirCaja() {
    clearTimeout(tCierra);
    gsap.to(caja, { clipPath: 'inset(0% 0% 0% 0%)', duration: reducido ? 0.01 : 0.6, ease: 'expo.out', overwrite: true });
    escribir(texto(), () => { etq.dataset.vivo = '1'; });
    sonido.tic(0.5);
  }
  function cerrarCaja(espera) {
    clearTimeout(tCierra);
    tCierra = setTimeout(() => {
      clearTimeout(tEscribe);
      delete etq.dataset.vivo;
      etq.classList.remove('on');
      gsap.to(caja, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.45, ease: 'power3.in', overwrite: true });
    }, espera);
  }

  // La queja, a boli: se escribe de izquierda a derecha y después la flecha
  function quejarse() {
    clearTimeout(tQueja);
    const porGiro = Math.abs(e.giro) / 45 > desvio();
    const lista = LOGO.quejas;
    const txt = porGiro ? LOGO.giro : lista[quejas < lista.length ? quejas : 2 + ((quejas - 2) % (lista.length - 2))];
    if (!porGiro) quejas++;
    quejaT.textContent = txt;
    gsap.killTweensOf([quejaT, flecha]);
    gsap.set([quejaT, flecha], { opacity: 1 });
    gsap.set(flecha, { strokeDashoffset: 1 });
    if (reducido) {
      gsap.set(quejaT, { clipPath: 'inset(-30% 0% -40% 0%)' });
      gsap.set(flecha, { strokeDashoffset: 0 });
    } else {
      gsap.fromTo(quejaT, { clipPath: 'inset(-30% 100% -40% 0%)' }, { clipPath: 'inset(-30% 0% -40% 0%)', duration: 0.06 * txt.length, ease: 'none' });
      gsap.to(flecha, { strokeDashoffset: 0, duration: 0.45, ease: 'power1.inOut', delay: 0.06 * txt.length });
    }
    sonido.nota(2, 0.7);
  }
  function borrarQueja(espera) {
    clearTimeout(tQueja);
    tQueja = setTimeout(() => gsap.to([quejaT, flecha], { opacity: 0, duration: 0.8, ease: 'power2.out' }), espera);
  }

  // --- Tirar ---------------------------------------------------------------------------------------------------
  function empezar(ev, tipo) {
    if (ev.button > 0 || arrastre) return;
    ev.preventDefault();
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
    bl.classList.add('tirando');
    nivel = 0;
    quejaEnEsta = false;
    abrirCaja();
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
      const dx = ev.clientX - a.x0, dy = ev.clientY - a.y0;
      const c = Math.cos(-e.giro * RAD), s = Math.sin(-e.giro * RAD);
      // (en alto, frente a la caja entera: el logo es tan bajo que media caja cede demasiado)
      const ex = (dx * c - dy * s) * a.lx / (tam.w / 2), ey = (dx * s + dy * c) * a.ly / tam.h;
      e.sx = Math.max(0.3, a.sx0 + goma(ex, 1.1));
      e.sy = Math.max(0.3, a.sy0 + goma(ey, 1.2));
    }
    aplicar();
    // La tensión suena cada vez que sube un escalón; y en cuanto lo rompes, el manual se queja
    const t = Math.min(1, (Math.abs(Math.log(e.sx)) + Math.abs(Math.log(e.sy)) + Math.abs(e.giro) / 45) / 1.1);
    const escalon = Math.floor(t * 5);
    if (escalon > nivel) sonido.empuje(t);
    nivel = escalon;
    if (!quejaEnEsta && roto()) { quejaEnEsta = true; quejarse(); }
  }

  function soltar(ev) {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    arrastre = null;
    cursor.pulsando(false);
    cursor.decir('Otra vez');
    const contaba = roto();
    if (contaba) intento();
    sonido.cerrar();
    setTimeout(() => bl.classList.remove('tirando'), reducido ? 0 : 420);
    gsap.to(e, {
      sx: 1, sy: 1, giro: 0,
      duration: reducido ? 0.25 : 1.4, ease: reducido ? 'power2.out' : 'elastic.out(1, 0.36)',
      onUpdate: aplicar,
      onComplete() {
        escribir(`${texto()} · restaurado`);
        cerrarCaja(2600);
        if (contaba) borrarQueja(3200);
      },
    });
  }

  svg.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.ne.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.so.addEventListener('pointerdown', (ev) => empezar(ev, 'estirar'));
  asas.giro.addEventListener('pointerdown', (ev) => empezar(ev, 'giro'));
  addEventListener('pointermove', mover, { passive: true });
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);

  // El plano y las asas salen al acercarse; el cursor dice qué hacer
  const pag = bl.closest('.bm-pag');
  if (conRaton) {
    pag.addEventListener('pointerenter', () => bl.classList.add('cerca'));
    pag.addEventListener('pointerleave', () => { if (!arrastre) bl.classList.remove('cerca'); });
    svg.addEventListener('pointerenter', () => { if (!arrastre) cursor.decir('Estíralo'); });
    asas.giro.addEventListener('pointerenter', () => { if (!arrastre) cursor.decir('Gíralo'); });
    [svg, asas.giro].forEach((el) => el.addEventListener('pointerleave', () => { if (!arrastre) cursor.decir(''); }));
  }

  new ResizeObserver(() => { medir(); aplicar(); }).observe(bl);
  medir();
  aplicar();

  // La primera vez que se ve, un tirón pequeño de muestra: se estira un poco y vuelve, para que se vea que se puede
  if (!reducido) {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || arrastre) return;
      io.disconnect();
      bl.classList.add('cerca');
      gsap.timeline({ delay: 0.7, onUpdate: aplicar, onComplete() { if (!conRaton) return; if (!bl.matches(':hover')) bl.classList.remove('cerca'); } })
        .to(e, { sx: 1.06, sy: 0.97, duration: 0.35, ease: 'power2.out' })
        .to(e, { sx: 1, sy: 1, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
    }, { threshold: 0.6 });
    io.observe(bl);
  }
}
