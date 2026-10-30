// Misión «Conecta»: la tienda online y el Excel de pedidos no se hablan. Los pedidos de la tienda (de ejemplo) van
// llegando y se quedan «sin pasar»; arrastras el cable del enchufe de la tienda al del Excel y, al conectarlo, cada
// pedido viaja por el cable y se apunta solo en una fila nueva. Los que lleguen después pasan en el momento.
// Lo que se cuenta al final es lo que ha pasado aquí: cuántos pedidos han pasado y cuántos se han copiado a mano.
import { gsap } from 'gsap';

const PEDIDOS = [
  ['1041', 'Taza', 2, 24],
  ['1042', 'Camiseta', 1, 22],
  ['1043', 'Libreta', 3, 27],
  ['1044', 'Bolsa de tela', 1, 14.5],
  ['1045', 'Lámina A3', 2, 36],
  ['1046', 'Taza', 1, 12],
  ['1047', 'Camiseta', 2, 44],
];
const YA = 3;            // los que ya están esperando al empezar
const CADA = 1.5;        // s entre un pedido nuevo y el siguiente

const CSS = `
.mcon { position: absolute; inset: 0; display: grid; place-items: center; user-select: none; -webkit-user-select: none; }
.mcon__mesa { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 18%; font-family: var(--mono); color: var(--crema-2); letter-spacing: .03em; }
.mcon--vertical .mcon__mesa { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; gap: 14%; }
.mcon__caja { position: relative; min-height: 0; display: flex; flex-direction: column; border: 1px solid rgba(231,226,218,.55); background: rgba(18,13,10,.82); }
.mcon__cab { display: flex; align-items: center; gap: .7em; padding: .8em 1em; border-bottom: 1px solid rgba(231,226,218,.18); font-size: .74em; letter-spacing: .16em; text-transform: uppercase; color: var(--crema-2); }
.mcon__ejemplo { margin-left: auto; padding: .1em .5em; border: 1px solid var(--crema-3); font-size: .85em; color: var(--crema-3); }
.mcon__ico { width: 1em; height: .8em; border: 1px solid var(--crema-3); }
.mcon__excel .mcon__ico { background: linear-gradient(var(--crema-3), var(--crema-3)) 50% 0 / 1px 100% no-repeat, linear-gradient(var(--crema-3), var(--crema-3)) 0 50% / 100% 1px no-repeat; }
.mcon__lista { flex: 1; min-height: 0; overflow: hidden; margin: 0; padding: .5em 1em; list-style: none; display: flex; flex-direction: column; gap: .4em; }
.mcon__pedido { display: grid; grid-template-columns: auto 1fr auto; gap: .2em .7em; align-items: baseline; padding: .45em .6em; border: 1px solid rgba(231,226,218,.14); font-size: .74em; line-height: 1.4; }
.mcon__pedido b { font-weight: 400; color: var(--crema); }
.mcon__pedido em { grid-column: 1 / -1; font-style: normal; font-size: .9em; letter-spacing: .1em; text-transform: uppercase; color: var(--rosa); }
.mcon__pedido.es-pasado { border-color: rgba(245,203,215,.35); }
.mcon__pedido.es-pasado em { color: var(--crema-3); }
.mcon__pie { padding: .7em 1em; border-top: 1px solid rgba(231,226,218,.18); font-size: .72em; letter-spacing: .12em; text-transform: uppercase; color: var(--crema-3); }
.mcon__pie b { font-weight: 400; color: var(--rosa); }
.mcon__tabla { width: 100%; border-collapse: collapse; font-size: .72em; }
.mcon__tabla th { text-align: left; font-weight: 400; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: .9em; padding: .55em .6em; border-bottom: 1px solid rgba(231,226,218,.3); }
.mcon__tabla td { padding: .5em .6em; border-bottom: 1px solid rgba(231,226,218,.1); color: var(--crema); white-space: nowrap; }
.mcon__tabla td + td, .mcon__tabla th + th { border-left: 1px solid rgba(231,226,218,.1); }
.mcon__tabla tr.es-nueva td { background: rgba(245,203,215,.1); }
.mcon__hueco { flex: 1; min-height: 0; overflow: hidden; }
.mcon__enchufe { position: absolute; z-index: 2; width: 2.6em; height: 2.6em; margin: -1.3em 0 0 -1.3em; border-radius: 50%; border: 1.5px solid var(--crema); background: var(--noche); display: grid; place-items: center; }
.mcon__enchufe::before { content: ''; width: .8em; height: .8em; border-radius: 50%; border: 1.5px solid var(--rosa); }
.mcon__enchufe--a { left: 100%; top: 50%; cursor: grab; touch-action: none; }
.mcon__enchufe--b { left: 0; top: 50%; border-color: rgba(231,226,218,.45); }
.mcon__enchufe--b::before { border-color: rgba(231,226,218,.45); border-style: dashed; }
.mcon--vertical .mcon__enchufe--a { left: 50%; top: 100%; }
.mcon--vertical .mcon__enchufe--b { left: 50%; top: 0; }
.mcon.es-conectada .mcon__enchufe--b { border-color: var(--rosa); box-shadow: 0 0 18px rgba(245,203,215,.6); }
.mcon.es-conectada .mcon__enchufe--b::before { border-style: solid; border-color: var(--rosa); background: var(--rosa); }
.mcon__enchufe--a:focus-visible { outline: 1px solid var(--rosa); outline-offset: 4px; }
.mcon__cable { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 1; }
.mcon__cable path { fill: none; stroke: var(--crema); stroke-width: 1.5; }
.mcon.es-conectada .mcon__cable path { stroke: var(--rosa); }
.mcon__cable circle { fill: var(--rosa); }
.mcon__flechas { position: absolute; z-index: 2; display: flex; gap: 4px; color: var(--crema); font-size: 10px; transform: translate(1.9em, -50%); pointer-events: none; transition: opacity .3s; }
.mcon--vertical .mcon__flechas { transform: translate(-50%, 1.7em) rotate(90deg); }
.mcon__flechas span { animation: mcon-pasa 1.4s ease-in-out infinite; }
.mcon__flechas span:nth-child(2) { animation-delay: .12s; } .mcon__flechas span:nth-child(3) { animation-delay: .24s; }
@keyframes mcon-pasa { 0%, 100% { opacity: .25; } 40% { opacity: 1; } }
.mcon.es-arrastrando .mcon__flechas, .mcon.es-conectada .mcon__flechas { opacity: 0; }
.mcon-ley { font-family: var(--mono); }
.mcon-ley__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mcon-ley dl { margin: 0; display: grid; grid-template-columns: 1fr auto; border-top: 1px solid rgba(231,226,218,.25); }
.mcon-ley dt, .mcon-ley dd { margin: 0; padding: 7px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 10.5px; }
.mcon-ley dt { color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: 9.5px; }
.mcon-ley dd { color: var(--crema); text-align: right; }
`;

let estilos = false;
const eur = (n) => `${n.toFixed(2).replace('.', ',')} €`;
const hora = () => new Date().toTimeString().slice(0, 8);

export async function montar(zona, { mision, panel, sonido, reducido }) {
  if (!estilos) { const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); estilos = true; }
  const D = reducido ? 0 : 1;
  const raiz = document.createElement('div');
  raiz.className = 'mcon';
  raiz.innerHTML = `
    <div class="mcon__mesa" data-mesa>
      <div class="mcon__caja mcon__tienda">
        <div class="mcon__cab"><span class="mcon__ico"></span>Tu tienda online<span class="mcon__ejemplo">Ejemplo</span></div>
        <ul class="mcon__lista" data-lista></ul>
        <div class="mcon__pie">Sin pasar al Excel: <b data-sin>0</b></div>
        <button type="button" class="mcon__enchufe mcon__enchufe--a" data-a aria-label="Conectar la tienda con el Excel"></button>
        <span class="mcon__flechas" data-flechas aria-hidden="true"><span>▸</span><span>▸</span><span>▸</span></span>
      </div>
      <div class="mcon__caja mcon__excel">
        <div class="mcon__cab"><span class="mcon__ico"></span>Excel de pedidos</div>
        <div class="mcon__hueco"><table class="mcon__tabla"><thead><tr><th>Nº</th><th>Producto</th><th>Importe</th><th>Hora</th></tr></thead><tbody data-filas></tbody></table></div>
        <span class="mcon__enchufe mcon__enchufe--b" data-b aria-hidden="true"></span>
      </div>
      <svg class="mcon__cable" data-cable aria-hidden="true"><path data-path d=""/></svg>
    </div>`;
  zona.append(raiz);
  const mesa = raiz.querySelector('[data-mesa]');
  const lista = raiz.querySelector('[data-lista]');
  const filas = raiz.querySelector('[data-filas]');
  const sin = raiz.querySelector('[data-sin]');
  const A = raiz.querySelector('[data-a]');
  const B = raiz.querySelector('[data-b]');
  const cable = raiz.querySelector('[data-cable]');
  const path = raiz.querySelector('[data-path]');
  const flechas = raiz.querySelector('[data-flechas]');

  let vertical = false;
  const medir = () => {
    // El tamaño: el de la zona; en el móvil, el hueco entre la orden de arriba y la explicación de abajo
    const movil = innerWidth <= 760;
    const w = movil ? innerWidth - 24 : zona.clientWidth;
    const h = movil ? Math.max(300, innerHeight - 372) : zona.clientHeight;
    vertical = w / h < 1.1;
    raiz.classList.toggle('mcon--vertical', vertical);
    Object.assign(mesa.style, movil ? { position: 'fixed', left: '12px', top: '200px' } : { position: '', left: '', top: '' });
    Object.assign(mesa.style, { width: `${w}px`, height: `${h}px`, fontSize: `${Math.max(10, Math.min(13.5, (vertical ? w : h) / 30))}px` });
    const a = centro(A);
    Object.assign(flechas.style, { left: `${a.x}px`, top: `${a.y}px` });
    tender(fin || a);
  };

  // Dónde está cada enchufe, en las coordenadas de la mesa
  const centro = (el) => {
    const m = mesa.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - m.left, y: r.top + r.height / 2 - m.top };
  };
  // El cable: cuelga entre los dos extremos
  let fin = null;
  const tender = (b) => {
    const a = centro(A);
    if (!b) { path.setAttribute('d', ''); return; }
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const caida = Math.min(90, 14 + dist * 0.28);
    const s = vertical ? { x: caida, y: 0 } : { x: 0, y: caida };
    const dx = (b.x - a.x) * 0.35, dy = (b.y - a.y) * 0.35;
    path.setAttribute('d', `M ${a.x} ${a.y} C ${a.x + dx + s.x} ${a.y + dy + s.y}, ${b.x - dx + s.x} ${b.y - dy + s.y}, ${b.x} ${b.y}`);
  };
  medir();
  addEventListener('resize', medir);

  // Los pedidos van llegando a la tienda
  const pedidos = [];
  let conectada = false, hecho = false, vivo = true, esperaban = 0;
  const aMano = 0;   // nadie copia nada: es lo que se cuenta
  const timers = [];
  const contar = () => { sin.textContent = String(pedidos.filter((p) => !p.pasado).length); };
  const llega = (k) => {
    if (!vivo) return;
    const [num, prod, uds, imp] = PEDIDOS[k];
    const li = document.createElement('li');
    li.className = 'mcon__pedido';
    li.innerHTML = `<b>#${num}</b><span>${uds} × ${prod}</span><span>${eur(imp)}</span><em>Sin pasar</em>`;
    lista.prepend(li);
    gsap.fromTo(li, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4 * D, ease: 'power3.out' });
    const p = { num, prod, imp, li, pasado: false, hora: hora() };
    pedidos.push(p);
    contar();
    sonido.gota(0.25, 0.5);
    if (conectada) pasar(p);
  };
  for (let k = 0; k < YA; k++) llega(k);
  for (let k = YA; k < PEDIDOS.length; k++) timers.push(setTimeout(() => llega(k), (k - YA + 1) * CADA * 1000));
  panel.gesto(mision.gesto);

  // Un pedido viaja por el cable y se apunta en una fila nueva
  let cola = Promise.resolve();
  const pasar = (p) => {
    cola = cola.then(async () => {
      if (!vivo) return;
      const punto = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      punto.setAttribute('r', '4');
      cable.append(punto);
      const largo = path.getTotalLength();
      const o = { t: 0 };
      sonido.nota(1 + (pedidos.indexOf(p) % 5), 0.7);
      await gsap.to(o, {
        t: 1, duration: 0.55 * D, ease: 'power1.inOut',
        onUpdate: () => { const q = path.getPointAtLength(o.t * largo); punto.setAttribute('cx', q.x); punto.setAttribute('cy', q.y); },
      }).then();
      punto.remove();
      const tr = document.createElement('tr');
      tr.className = 'es-nueva';
      tr.innerHTML = `<td>${p.num}</td><td>${p.prod}</td><td>${eur(p.imp)}</td><td>${p.hora}</td>`;
      filas.append(tr);
      setTimeout(() => tr.classList.remove('es-nueva'), 900);
      sonido.tecla(0.6);
      p.pasado = true;
      p.li.classList.add('es-pasado');
      p.li.querySelector('em').textContent = 'En el Excel ✓';
      contar();
      if (pedidos.length === PEDIDOS.length && pedidos.every((x) => x.pasado)) terminar();
    });
  };

  // Arrastrar el cable desde la tienda; si se suelta cerca del Excel, conecta; si no, vuelve
  let arrastre = false, mando = null;
  const empezar = (e) => {
    if (conectada) return;
    e.preventDefault();
    A.setPointerCapture?.(e.pointerId);
    arrastre = true;
    raiz.classList.add('es-arrastrando');
    mando = sonido.subida();
    mover(e);
  };
  const mover = (e) => {
    if (!arrastre) return;
    const m = mesa.getBoundingClientRect();
    fin = { x: e.clientX - m.left, y: e.clientY - m.top };
    const b = centro(B), a = centro(A);
    const cerca = Math.max(0, 1 - Math.hypot(fin.x - b.x, fin.y - b.y) / Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)));
    mando?.avance(cerca);
    tender(fin);
  };
  const soltar = (e) => {
    if (!arrastre) return;
    arrastre = false;
    raiz.classList.remove('es-arrastrando');
    const b = centro(B);
    if (fin && Math.hypot(fin.x - b.x, fin.y - b.y) < Math.max(44, mesa.clientWidth * 0.08)) { conectar(); return; }
    mando?.soltar(false);
    mando = null;
    // Vuelve a su enchufe
    const a = centro(A), o = { ...fin };
    gsap.to(o, { x: a.x, y: a.y, duration: 0.5 * D, ease: 'power3.out', onUpdate: () => tender(o), onComplete: () => { fin = null; tender(null); } });
  };
  A.addEventListener('pointerdown', empezar);
  addEventListener('pointermove', mover);
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);
  A.addEventListener('keydown', (e) => { if (!conectada && ['Enter', ' '].includes(e.key)) { e.preventDefault(); conectar(); } });

  function conectar() {
    if (conectada) return;
    conectada = true;
    fin = centro(B);
    tender(fin);
    mando?.soltar(true);
    mando = null;
    raiz.classList.add('es-conectada');
    esperaban = pedidos.filter((p) => !p.pasado).length;
    panel.gesto('');
    panel.orden(mision.curso, true);
    // Los que esperaban, uno detrás de otro
    pedidos.filter((p) => !p.pasado).forEach(pasar);
  }

  function terminar() {
    if (hecho) return;
    hecho = true;
    panel.orden(mision.veredicto, true);
    sonido.ok();
    const ley = document.createElement('div');
    ley.className = 'mcon-ley';
    ley.innerHTML = `<p class="mcon-ley__t">Lo que ha pasado</p><dl>
      <dt>Pedidos en la tienda</dt><dd>${pedidos.length}</dd>
      <dt>Pasados al Excel</dt><dd>${pedidos.filter((p) => p.pasado).length}</dd>
      <dt>Copiados a mano</dt><dd>${aMano}</dd>
      <dt>Esperaban al conectar</dt><dd>${esperaban}</dd></dl>`;
    panel.leyenda(ley);
    panel.hecha(mision.explica);
  }

  return {
    destruir() {
      vivo = false;
      timers.forEach(clearTimeout);
      mando?.soltar(false);
      removeEventListener('resize', medir);
      removeEventListener('pointermove', mover);
      removeEventListener('pointerup', soltar);
      removeEventListener('pointercancel', soltar);
      raiz.remove();
    },
  };
}
