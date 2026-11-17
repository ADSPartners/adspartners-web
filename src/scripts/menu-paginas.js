// El menú de las subpáginas (components/MenuPaginas.astro): el botón «Menú» abre la lista que cuelga de él (la opción
// que eligió Álvaro el 16-nov). Esc la cierra, y también un clic fuera.
import * as sonido from './sonido.js';

export function montarMenuPaginas() {
  const raiz = document.querySelector('[data-mp]');
  const boton = raiz?.querySelector('[data-mp-btn]');
  const lista = raiz?.querySelector('[data-mp-lista]');
  if (!boton || !lista) return;
  const txt = boton.querySelector('[data-mp-txt]');

  let abierto = false;
  const poner = (si) => {
    abierto = si;
    boton.setAttribute('aria-expanded', String(si));
    if (txt) txt.textContent = si ? 'Cerrar' : 'Menú';
    (si ? sonido.abrir : sonido.cerrar)?.();
  };
  const abrir = () => { lista.hidden = false; requestAnimationFrame(() => lista.classList.add('on')); poner(true); };
  const cerrar = () => { lista.classList.remove('on'); poner(false); setTimeout(() => { if (!abierto) lista.hidden = true; }, 260); };
  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  addEventListener('pointerdown', (e) => { if (abierto && !raiz.contains(e.target)) cerrar(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) { cerrar(); boton.focus(); } });
}
