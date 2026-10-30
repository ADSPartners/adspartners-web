// Misión «Automatiza»: pasa el lector por la factura para sacar sus datos (el tirador de la misión «Validate» de
// Orano). El lector se arrastra de izquierda a derecha; cada dato se enciende con la etiqueta del inspector cuando el
// lector pasa por encima. Al llegar al final se rehacen las cuentas (base + IVA = total, de verdad, aquí) y la línea
// se escribe en «tu Excel».
// La lectura es LECTURA de src/data/tech.js: mientras no esté grabada la llamada real, son los datos de la propia
// factura y no se enseña ningún tiempo.
import { gsap } from 'gsap';
import { FACTURA, LECTURA } from '../../data/tech.js';

const CSS = `
.mfac { position: absolute; inset: 0; display: grid; place-items: center; touch-action: none; user-select: none; -webkit-user-select: none; }
.mfac__hoja { position: relative; aspect-ratio: .78; padding: 7% 8%; display: flex; flex-direction: column; gap: 4.2%;
  border: 1px solid rgba(231,226,218,.55); background: rgba(231,226,218,.035); color: var(--crema-2);
  font-family: var(--mono); line-height: 1.45; letter-spacing: .03em; }
.mfac__ejemplo { position: absolute; right: 8%; top: 7%; padding: .2em .6em; border: 1px solid var(--crema-3); font-size: .78em; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.mfac__logo { width: 2.6em; height: 2.6em; border: 1px solid var(--crema-3); border-radius: 50%; margin-bottom: .6em; }
.mfac__prov { font-size: 1.25em; color: var(--crema); letter-spacing: .02em; }
.mfac__fila { display: flex; justify-content: space-between; gap: 1em; }
.mfac__k { color: var(--crema-3); text-transform: uppercase; letter-spacing: .12em; font-size: .82em; }
.mfac__tabla { width: 100%; border-collapse: collapse; font-size: .92em; }
.mfac__tabla th { text-align: left; font-weight: 400; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: .82em; padding: .4em 0; border-bottom: 1px solid rgba(231,226,218,.3); }
.mfac__tabla td { padding: .45em 0; border-bottom: 1px solid rgba(231,226,218,.08); }
.mfac__tabla th:not(:first-child), .mfac__tabla td:not(:first-child) { text-align: right; }
.mfac__totales { margin-top: auto; margin-left: auto; width: 62%; display: grid; gap: .35em; }
.mfac__total { padding-top: .5em; border-top: 1px solid rgba(231,226,218,.4); font-size: 1.2em; color: var(--crema); }
.mfac__campo { position: relative; outline: 1px solid transparent; outline-offset: .3em; transition: outline-color .3s, color .3s; }
.mfac__campo.es-visto { outline-color: var(--rosa); color: var(--crema); }
.mfac__campo .insp { position: absolute; left: calc(100% + 1.1em); top: 50%; font-size: 9px; opacity: 0; transform: translate(-6px, -50%); transition: opacity .3s, transform .4s var(--curva); pointer-events: none; z-index: 2; }
.mfac__campo.es-visto .insp { opacity: 1; transform: translate(0, -50%); }
.mfac__lector { position: absolute; top: -4%; bottom: -4%; left: 0; width: 0; pointer-events: none; }
.mfac__linea { position: absolute; top: 0; bottom: 0; left: -1px; width: 2px; background: var(--rosa); box-shadow: 0 0 18px rgba(245,203,215,.7); }
.mfac__velo { position: absolute; top: 4%; bottom: 4%; right: 0; width: 100vw; max-width: var(--hecho, 0px); background: linear-gradient(90deg, transparent, rgba(245,203,215,.08)); }
.mfac__tirador { position: absolute; left: -29px; top: 50%; width: 58px; height: 58px; margin-top: -29px; border: 1.5px solid var(--crema); border-radius: 50%;
  background: rgba(18,13,10,.75); pointer-events: auto; cursor: grab; display: grid; place-items: center; }
.mfac__tirador::before { content: ''; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--rosa); }
.mfac__tirador:active { cursor: grabbing; }
.mfac__flechas { position: absolute; left: 40px; top: 50%; transform: translateY(-50%); display: flex; gap: 5px; color: var(--crema); font-size: 10px; pointer-events: none; transition: opacity .3s; }
.mfac__flechas span { animation: mfac-pasa 1.4s ease-in-out infinite; }
.mfac__flechas span:nth-child(2) { animation-delay: .12s; } .mfac__flechas span:nth-child(3) { animation-delay: .24s; } .mfac__flechas span:nth-child(4) { animation-delay: .36s; }
@keyframes mfac-pasa { 0%, 100% { opacity: .25; } 40% { opacity: 1; } }
.mfac.es-arrastrando .mfac__flechas { opacity: 0; }
.mfac-excel { font-family: var(--mono); }
.mfac-excel__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mfac-excel__t::before { content: ''; width: 12px; height: 12px; border: 1px solid var(--rosa); background: linear-gradient(var(--rosa), var(--rosa)) 50% 0 / 1px 100% no-repeat, linear-gradient(var(--rosa), var(--rosa)) 0 50% / 100% 1px no-repeat; }
.mfac-excel dl { margin: 0; display: grid; grid-template-columns: auto 1fr; border-top: 1px solid rgba(231,226,218,.25); }
.mfac-excel dt, .mfac-excel dd { margin: 0; padding: 7px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 11px; }
.mfac-excel dt { padding-right: 14px; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: 9.5px; }
.mfac-excel dd { color: var(--crema); text-align: right; white-space: nowrap; }
.mfac-excel__ok { margin: 14px 0 0; font-size: 10px; line-height: 1.6; letter-spacing: .08em; color: var(--crema-2); }
.mfac-excel__ok b { font-weight: 400; color: var(--rosa); }
`;

let estilos = false;
const eur = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export async function montar(zona, { mision, panel, sonido, reducido }) {
  if (!estilos) { const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); estilos = true; }
  const F = FACTURA;
  const raiz = document.createElement('div');
  raiz.className = 'mfac';
  const campo = (clave, nombre, html) => `<span class="mfac__campo" data-campo="${clave}"><span class="insp">${nombre}</span>${html}</span>`;
  raiz.innerHTML = `
    <div class="mfac__hoja" data-hoja>
      <span class="mfac__ejemplo">Ejemplo</span>
      <div>
        <div class="mfac__logo"></div>
        <div>${campo('proveedor', 'Proveedor', `<span class="mfac__prov">${F.proveedor}</span>`)}</div>
        <div class="mfac__k">NIF ${F.nif}</div>
      </div>
      <div>
        <div class="mfac__fila"><span class="mfac__k">Factura</span><span>${F.numero}</span></div>
        <div class="mfac__fila"><span class="mfac__k">Fecha</span>${campo('fecha', 'Fecha', F.fecha)}</div>
      </div>
      <table class="mfac__tabla">
        <thead><tr><th>Concepto</th><th>Cant.</th><th>Importe</th></tr></thead>
        <tbody>${F.lineas.map(([con, cant, , imp]) => `<tr><td>${con}</td><td>${cant}</td><td>${imp}</td></tr>`).join('')}</tbody>
      </table>
      <div class="mfac__totales">
        <div class="mfac__fila"><span class="mfac__k">Base</span>${campo('base', 'Base', `${F.base} €`)}</div>
        <div class="mfac__fila"><span class="mfac__k">IVA ${F.ivaTipo}</span>${campo('iva', 'IVA', `${F.iva} €`)}</div>
        <div class="mfac__fila mfac__total"><span class="mfac__k">Total</span>${campo('total', 'Total', `${F.total} €`)}</div>
      </div>
      <div class="mfac__lector" data-lector>
        <span class="mfac__velo"></span><span class="mfac__linea"></span>
        <span class="mfac__tirador" data-tirador role="slider" tabindex="0" aria-label="Lector de la factura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></span>
        <span class="mfac__flechas" aria-hidden="true"><span>▸</span><span>▸</span><span>▸</span><span>▸</span></span>
      </div>
    </div>`;
  zona.append(raiz);

  const hoja = raiz.querySelector('[data-hoja]');
  const lector = raiz.querySelector('[data-lector]');
  const tirador = raiz.querySelector('[data-tirador]');
  const campos = [...raiz.querySelectorAll('[data-campo]')];

  // El tamaño: la hoja llena el alto de la zona (en el móvil, un poco más, para que se lea)
  const medir = () => {
    const h = Math.max(zona.clientHeight * 0.94, Math.min(innerHeight * 0.5, 430));
    hoja.style.height = `${h}px`;
    hoja.style.fontSize = `${Math.max(7, h / 44)}px`;
  };
  medir();
  addEventListener('resize', medir);

  panel.gesto(mision.gesto);
  let p = 0, hecho = false, arrastre = null, mando = null;
  const vistos = new Set();

  const poner = (np) => {
    p = Math.max(0, Math.min(1, np));
    const w = hoja.clientWidth;
    lector.style.transform = `translateX(${p * w}px)`;
    lector.style.setProperty('--hecho', `${p * w}px`);
    tirador.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    mando?.avance(p);
    // Cada dato se enciende cuando el lector pasa por su centro
    const hr = hoja.getBoundingClientRect();
    campos.forEach((c, k) => {
      const r = c.getBoundingClientRect();
      const centro = (r.left + r.width / 2 - hr.left) / hr.width;
      const visto = p >= centro;
      if (visto && !vistos.has(c)) { vistos.add(c); c.classList.add('es-visto'); sonido.nota(2 + k); }
      else if (!visto && vistos.has(c) && !hecho) { vistos.delete(c); c.classList.remove('es-visto'); }
    });
  };

  const empezar = (e) => {
    if (hecho) return;
    e.preventDefault();
    tirador.setPointerCapture?.(e.pointerId);
    arrastre = { x: e.clientX, p };
    raiz.classList.add('es-arrastrando');
    mando = sonido.subida();
  };
  const mover = (e) => {
    if (!arrastre) return;
    poner(arrastre.p + (e.clientX - arrastre.x) / hoja.clientWidth);
    if (p >= 0.985) terminar();
  };
  const soltar = () => {
    if (!arrastre || hecho) return;
    arrastre = null;
    raiz.classList.remove('es-arrastrando');
    mando?.soltar(false);
    mando = null;
    // A medias no vale: el lector vuelve al principio
    const o = { p };
    gsap.to(o, { p: 0, duration: 0.6 * (reducido ? 0 : 1), ease: 'power3.out', onUpdate: () => poner(o.p) });
  };
  tirador.addEventListener('pointerdown', empezar);
  addEventListener('pointermove', mover);
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);
  // Con el teclado: las flechas mueven el lector
  tirador.addEventListener('keydown', (e) => {
    if (hecho || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    poner(p + (e.key === 'ArrowRight' ? 0.1 : -0.1));
    if (p >= 0.985) terminar();
  });

  async function terminar() {
    if (hecho) return;
    hecho = true;
    arrastre = null;
    raiz.classList.remove('es-arrastrando');
    poner(1);
    mando?.soltar(true);
    mando = null;
    campos.forEach((c) => c.classList.add('es-visto'));
    gsap.to(lector, { opacity: 0, duration: 0.6, delay: 0.3 });
    panel.gesto('');
    panel.orden(mision.curso, true);
    await new Promise((r) => setTimeout(r, reducido ? 0 : 900));

    // Las cuentas, rehechas aquí: base + IVA tiene que dar el total (al céntimo)
    const L = LECTURA.campos;
    const cuadra = Math.round((L.base + L.iva) * 100) === Math.round(L.total * 100);
    panel.orden(cuadra ? mision.veredicto : 'Factura leída · no cuadra: se marca para revisar', true);
    sonido.ok();

    // La línea, escrita en tu Excel
    const excel = document.createElement('div');
    excel.className = 'mfac-excel';
    const filas = [['Proveedor', L.proveedor], ['Fecha', L.fecha.split('-').reverse().join('/')], ['Base', `${eur(L.base)} €`], ['IVA', `${eur(L.iva)} €`], ['Total', `${eur(L.total)} €`]];
    excel.innerHTML = `<p class="mfac-excel__t">Tu Excel · fila nueva</p><dl>${filas.map(([k]) => `<dt>${k}</dt><dd></dd>`).join('')}</dl>
      <p class="mfac-excel__ok">${eur(L.base)} + ${eur(L.iva)} = <b>${eur(L.total)} €</b> ${cuadra ? '· cuadra' : '· no cuadra'}${LECTURA.grabada && LECTURA.ms ? `<br>Leída con IA en ${(LECTURA.ms / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 })} s` : ''}</p>`;
    panel.leyenda(excel);
    panel.hecha(mision.explica);
    const dds = [...excel.querySelectorAll('dd')];
    for (let k = 0; k < filas.length; k++) {
      const txt = filas[k][1];
      for (let c = 1; c <= txt.length; c++) {
        dds[k].textContent = txt.slice(0, c);
        sonido.tecla(0.6);
        if (!reducido) await new Promise((r) => setTimeout(r, 22));
      }
    }
  }

  return {
    destruir() {
      removeEventListener('resize', medir);
      removeEventListener('pointermove', mover);
      removeEventListener('pointerup', soltar);
      removeEventListener('pointercancel', soltar);
      mando?.soltar(false);
      raiz.remove();
    },
  };
}
