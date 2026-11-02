// PROTOTIPO de Brand: la pastilla que cambia de variante (?v=a, b, c; también con ← →), la hora de Madrid y el
// montaje de cada variante, que carga solo su script. De usar y tirar.
import { montarVivo } from '../vivo.js';

const VARIANTES = {
  a: { etq: 'A · El inspector', carga: () => import('./a.js') },
  b: { etq: 'B · Desmontada', carga: () => import('./b.js') },
  c: { etq: 'C · Una regla, en todas partes', carga: () => import('./c.js') },
};
const CLAVES = Object.keys(VARIANTES);

export function montarPrototipo({ reducido, conRaton }) {
  const raiz = document.querySelector('[data-proto]');
  const etq = document.querySelector('[data-pr-etq]');
  const iso = document.querySelector('[data-pr-iso]').innerHTML;
  const logo = document.querySelector('[data-pr-logo]').innerHTML;
  const html = document.documentElement;

  const hora = document.querySelector('[data-pr-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const ponerHora = () => { hora.textContent = reloj.format(new Date()); };
  ponerHora();
  setInterval(ponerHora, 20000);

  let actual = null, desmontar = null, turno = 0;
  async function ir(clave) {
    if (!VARIANTES[clave] || clave === actual) return;
    actual = clave;
    const mio = ++turno;
    etq.textContent = VARIANTES[clave].etq;
    history.replaceState(null, '', `?v=${clave}`);
    desmontar?.();
    desmontar = null;
    raiz.innerHTML = '';
    raiz.className = 'pr';
    html.style.removeProperty('--pr-barra-color');
    window.scrollTo(0, 0);
    const { montar } = await VARIANTES[clave].carga();
    if (mio !== turno) return;
    desmontar = montar(raiz, { iso, logo, reducido, conRaton, barra: (c) => html.style.setProperty('--pr-barra-color', c) });
    if (conRaton && !reducido) montarVivo();
  }
  const mover = (d) => ir(CLAVES[(CLAVES.indexOf(actual) + d + CLAVES.length) % CLAVES.length]);
  document.querySelector('[data-pr-ant]').addEventListener('click', () => mover(-1));
  document.querySelector('[data-pr-sig]').addEventListener('click', () => mover(1));
  addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) return;
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });
  ir(new URLSearchParams(location.search).get('v') in VARIANTES ? new URLSearchParams(location.search).get('v') : 'a');
}
