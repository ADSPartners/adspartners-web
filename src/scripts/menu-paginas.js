// El menú de las subpáginas (components/MenuPaginas.astro): el botón «Menú» abre lo de la opción elegida
// (html[data-op-menu], prototipo del 16-nov): a, la lista que cuelga del botón; b, el índice a pantalla completa; c, el
// menú de la home (scripts/menu.js, la placa). Esc cierra; en la a, también un clic fuera.
import * as sonido from './sonido.js';

export function montarMenuPaginas() {
  const html = document.documentElement;
  const raiz = document.querySelector('[data-mp]');
  const boton = raiz?.querySelector('[data-mp-btn]');
  if (!boton) return;
  const op = html.dataset.opMenu || 'a';
  const txt = boton.querySelector('[data-mp-txt]');
  const lista = raiz.querySelector('[data-mp-lista]');
  const indice = document.querySelector('[data-mp-indice]');
  const placa = document.querySelector('[data-menu]');

  // c · La placa: el menú de la home, con este botón. Su «Cerrar», dentro del menú (el botón puede quedar debajo)
  if (op === 'c' && placa) {
    // (fuera del <main>: la placa lo esconde al bajar)
    document.body.append(placa);
    indice?.remove();
    lista?.remove();
    boton.setAttribute('data-menu-btn', '');
    boton.setAttribute('aria-controls', 'menu');
    const cerrar = indice?.querySelector('[data-mpi-cerrar]')?.cloneNode(true);
    if (cerrar) {
      placa.append(cerrar);
      cerrar.addEventListener('click', () => boton.click());
      // solo si el menú tapa el botón (en Brand, Tech y el About la barra queda encima y ya dice «Cerrar»)
      boton.addEventListener('click', () => setTimeout(() => {
        const r = boton.getBoundingClientRect(), el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        cerrar.hidden = !!el && boton.contains(el);
      }, 400));
    }
    import('./menu.js').then((m) => m.montarMenu({ lenis: null, reducido: html.classList.contains('mov-reducido') }));
    return;
  }
  placa?.remove();

  let abierto = false;
  const poner = (si) => {
    abierto = si;
    boton.setAttribute('aria-expanded', String(si));
    if (txt) txt.textContent = si ? 'Cerrar' : 'Menú';
    (si ? sonido.abrir : sonido.cerrar)?.();
  };

  // a · Desplegable
  if (op === 'a') {
    indice?.remove();
    boton.setAttribute('aria-controls', 'mp-lista');
    lista.id = 'mp-lista';
    const abrir = () => { lista.hidden = false; requestAnimationFrame(() => lista.classList.add('on')); poner(true); };
    const cerrar = () => { lista.classList.remove('on'); poner(false); setTimeout(() => { if (!abierto) lista.hidden = true; }, 260); };
    boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
    addEventListener('pointerdown', (e) => { if (abierto && !raiz.contains(e.target)) cerrar(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) { cerrar(); boton.focus(); } });
    return;
  }

  // b · Índice a pantalla completa (fuera de las barras, para que nada lo recorte)
  lista?.remove();
  document.body.append(indice);
  boton.setAttribute('aria-controls', 'mp-indice');
  indice.id = 'mp-indice';
  const abrir = () => {
    indice.hidden = false;
    html.classList.add('mp-indice-abierto');
    requestAnimationFrame(() => requestAnimationFrame(() => indice.classList.add('on')));
    poner(true);
    indice.querySelector('.mpi__a')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    indice.classList.remove('on');
    html.classList.remove('mp-indice-abierto');
    poner(false);
    boton.focus({ preventScroll: true });
    setTimeout(() => { if (!abierto) indice.hidden = true; }, 700);
  };
  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  indice.querySelector('[data-mpi-cerrar]').addEventListener('click', cerrar);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
}
