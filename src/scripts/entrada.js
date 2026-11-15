// «Ir con entrada»: un enlace a otra página de la web que lleve data-entrada hace lo mismo que el menú al elegir una
// pieza, sin el viaje a la placa: la página se apaga a la noche, se abre en el centro una ventana con el fondo de la que
// viene (con sus guías en el color de su LED) hasta llenar la pantalla, y se navega. La página nueva empieza con ese
// mismo fondo encima, que se desvanece (components/Entrada.astro), y, si se construye al llegar, se construye
// (html.construye, Base.astro). Lo carga Base.astro en todas las páginas: no hay que importarlo.
//
// Uso:
//   <a href={`${import.meta.env.BASE_URL}proyectos/`} data-entrada>Ver más</a>
// - El color sale solo del destino: el LED y el fondo de su pieza en el menú (data/menu.js, DESTINOS). A una página que
//   no está ahí (la home, los legales), con el fondo de noche. data-entrada="#RRGGBB" fuerza el fondo.
// - El href, con la base (import.meta.env.BASE_URL): así va bien sin JS y en la copia de prueba (ADS_BASE). Si se
//   escribe «/proyectos/» a secas, aquí se le pone la base igual.
// - Va como un enlace normal (sin ventana) con Ctrl, Cmd, Mayús o Alt, con la rueda, con target o download, a otra web,
//   a la misma página o a un #ancla suyo, y si otro script ya paró el clic (preventDefault). Con «movimiento reducido»,
//   navega sin ventana ni entrada.
// - Desde JS: import { irConEntrada } from '../scripts/entrada.js'; irConEntrada('proyectos/') (una ruta de la web,
//   sin la base, o un href). Devuelve true si se encarga de ir.
// - Al volver con «atrás», la página está como se dejó, sin la ventana encima.
const html = document.documentElement;
const COLOR = /^#[0-9a-fA-F]{6}$/;
const NOCHE = '#120D0A', CREMA = '#E7E2DA';
// La salida dura lo que el final del viaje del menú (la ventana, que se abre cada vez más deprisa); la noche llega antes
const DURA = 650, CURVA = 'cubic-bezier(.55, .085, .68, .53)';

// Lo que pone Base.astro: la base y, por ruta, el LED (c), el fondo (f) y si es «partido» (p) de cada página del menú
let datos = null;
const leerDatos = () => {
  if (datos) return datos;
  try { datos = JSON.parse(document.getElementById('ads-entradas')?.textContent || '{}'); } catch (e) { datos = {}; }
  datos.destinos ||= {};
  return datos;
};
const base = () => {
  const b = window.ADS_BASE || leerDatos().base || '/';
  return b.endsWith('/') ? b : `${b}/`;
};
const reducido = () => html.classList.contains('mov-reducido') || matchMedia('(prefers-reduced-motion: reduce)').matches;

// Un href (o una ruta de la web, como 'proyectos/') → su URL, con la base, y su ruta dentro de la web ('proyectos/')
function resolver(destino) {
  const b = base();
  let url;
  try {
    url = /^([a-z][a-z0-9+.-]*:|\/|\.)/i.test(destino) ? new URL(destino, location.href) : new URL(b + destino, location.origin);
  } catch (e) { return null; }
  if (url.origin !== location.origin) return null;
  if (url.pathname === b.slice(0, -1)) url.pathname = b;   // (la home de la copia de prueba, sin la barra del final)
  const enBase = url.pathname.startsWith(b);
  let ruta = enBase ? url.pathname.slice(b.length) : url.pathname.replace(/^\/+/, '');
  if (!enBase) url.pathname = b + ruta;
  if (ruta && !ruta.endsWith('/') && !ruta.includes('.')) ruta += '/';
  return { url, ruta };
}

// Los colores de la llegada: los de su pieza del menú (el «partido», solo en pantallas anchas; si no, noche)
function colores(ruta, forzado) {
  const d = leerDatos().destinos[ruta];
  if (COLOR.test(forzado || '')) return { c: d?.c || CREMA, f: forzado, p: 0 };
  const partido = !!d?.p && innerWidth > 760;
  return { c: d?.c || CREMA, f: d && (partido || !d.p) ? d.f : NOCHE, p: partido ? 1 : 0 };
}

// La marca de llegada que lee Base.astro antes de pintar la página nueva (vale unos segundos)
export function recordarEntrada(entrada) {
  try { sessionStorage.setItem('ads-entrada', JSON.stringify({ ...entrada, t: Date.now() })); } catch (e) { /* sin almacenamiento: llega sin más */ }
}

// La página de destino se descarga mientras dura la salida, como en el menú: con Speculation Rules en Chrome y Edge y
// con <link rel="prefetch"> en Firefox (Safari navega como siempre)
const adelantados = new Set();
export function adelantar(href) {
  if (adelantados.has(href)) return;
  adelantados.add(href);
  let el;
  if (window.HTMLScriptElement?.supports?.('speculationrules')) {
    el = document.createElement('script');
    el.type = 'speculationrules';
    el.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [href], eagerness: 'immediate' }] });
  } else {
    el = document.createElement('link');
    el.rel = 'prefetch';
    el.href = href;
  }
  document.head.appendChild(el);
}

// --- La salida: la ventana del final del viaje del menú (menu/placa.js), en el DOM. Todo transform y opacity: corre en
// el compositor. La ventana es la pantalla entera (y un 4 % más) que crece desde el centro; las guías verticales van de
// arriba abajo por sus lados y las horizontales, solo sobre ella, por arriba y por abajo
let capa = null, saliendo = false, reloj = 0;
const div = (css) => { const el = document.createElement('div'); el.style.cssText = css; return el; };
function salida({ c, f, p }) {
  capa?.remove();
  capa = div('position:fixed;inset:0;z-index:2147483000;overflow:hidden;pointer-events:auto;contain:strict;');
  capa.setAttribute('aria-hidden', 'true');
  const velo = div(`position:absolute;inset:0;background:${NOCHE};opacity:0;`);
  const fondo = p ? `linear-gradient(90deg, ${f} 43%, ${NOCHE} 57%)` : f;
  const ventana = div(`position:absolute;inset:-2%;background:${fondo};transform:scale(0);box-shadow:0 0 90px 30px color-mix(in srgb, ${c} 22%, ${NOCHE});`);
  const guia = (css) => div(`position:absolute;background:${c};opacity:0;${css}`);
  const izq = guia('top:0;bottom:0;left:50%;width:1px;'), dcha = guia('top:0;bottom:0;left:50%;width:1px;');
  const arriba = guia('top:50%;left:-2%;right:-2%;height:1px;transform:scaleX(0);'), abajo = guia('top:50%;left:-2%;right:-2%;height:1px;transform:scaleX(0);');
  capa.append(velo, ventana, izq, dcha, arriba, abajo);
  document.body.appendChild(capa);
  if (!capa.animate) return Promise.resolve();
  const ritmo = { duration: DURA, easing: CURVA, fill: 'forwards' };
  velo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURA * 0.8, easing: 'ease-in-out', fill: 'forwards' });
  // (las guías se encienden a la vez que la ventana crece, como en el menú)
  izq.animate([{ transform: 'translateX(0)', opacity: 0 }, { transform: 'translateX(-52vw)', opacity: 0.6 }], ritmo);
  dcha.animate([{ transform: 'translateX(0)', opacity: 0 }, { transform: 'translateX(52vw)', opacity: 0.6 }], ritmo);
  arriba.animate([{ transform: 'translateY(0) scaleX(0)', opacity: 0 }, { transform: 'translateY(-52vh) scaleX(1)', opacity: 0.6 }], ritmo);
  abajo.animate([{ transform: 'translateY(0) scaleX(0)', opacity: 0 }, { transform: 'translateY(52vh) scaleX(1)', opacity: 0.6 }], ritmo);
  return ventana.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], ritmo).finished.catch(() => {});
}
const limpiar = () => { clearTimeout(reloj); capa?.remove(); capa = null; saliendo = false; };

// Ir a una página de la web con la entrada. destino: una ruta de la web ('proyectos/') o un href; fondo: un #RRGGBB
// que manda sobre el de la página
export function irConEntrada(destino, fondo) {
  if (saliendo) return true;
  const r = resolver(String(destino ?? ''));
  if (!r) return false;
  const { url, ruta } = r;
  if (url.pathname === location.pathname && url.search === location.search) return false;
  if (reducido()) { location.href = url.href; return true; }
  saliendo = true;
  const entrada = { slug: ruta.replace(/\/$/, ''), ...colores(ruta, fondo) };
  recordarEntrada(entrada);
  adelantar(url.href);
  salida(entrada).then(() => {
    location.href = url.href;
    // (si la navegación no llega, que la página no se quede tapada)
    reloj = setTimeout(limpiar, 10000);
  });
  return true;
}

// Los enlaces con data-entrada, estén donde estén (también los que se ponen después)
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[data-entrada]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  if (irConEntrada(a.href, a.dataset.entrada)) e.preventDefault();
});

// Al volver con «atrás», el navegador puede devolver la página tal cual se fue (con la ventana encima)
addEventListener('pageshow', (e) => { if (e.persisted) limpiar(); });
