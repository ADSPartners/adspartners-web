// El menú (components/Menu.astro): el botón de la cabecera lo abre y pasa a «Cerrar»; Esc también lo cierra. Mientras
// está abierto, la página no se mueve. Prototipo con dos versiones (inspector y workflow), cada una en su módulo, que
// se carga la primera vez que hace falta; el selector de arriba cambia de una a otra y se recuerda en la sesión.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';

const VERSIONES = {
  inspector: () => import('./menu/inspector.js'),
  workflow: () => import('./menu/workflow.js'),
};

export function montarMenu({ lenis, reducido }) {
  const raiz = document.querySelector('[data-menu]');
  const boton = document.querySelector('[data-menu-btn]');
  if (!raiz || !boton) return;
  const html = document.documentElement;
  const datos = JSON.parse(raiz.querySelector('[data-menu-datos]').textContent);
  const textoBoton = boton.querySelector('[data-menu-txt]');
  const cargadas = {};
  let abierto = false;
  let version = 'inspector';
  try { version = new URLSearchParams(location.search).get('menu') || sessionStorage.getItem('ads-menu') || version; } catch (e) { /* nada */ }
  if (!VERSIONES[version]) version = 'inspector';

  // Ir a una página desde el menú: Hablemos baja al contacto (en la home) y lo demás navega; Brand, aún no
  const ir = (p) => {
    if (!p.ruta) return false;
    if (p.ruta.startsWith('#')) {
      const destino = document.querySelector(p.ruta);
      // Se baja cuando el menú ya se ha cerrado (hasta entonces el scroll está parado)
      if (destino) { cerrar().then(() => (lenis ? lenis.scrollTo(destino, { duration: 1.6 }) : destino.scrollIntoView({ behavior: 'smooth' }))); return true; }
    }
    location.href = `${window.ADS_BASE || '/'}${p.ruta}`;
    return true;
  };

  const ctx = { raiz, datos, reducido, sonido, ir };
  const cargar = async (v) => {
    if (!cargadas[v]) cargadas[v] = (await VERSIONES[v]()).crear(raiz.querySelector(`[data-menu-v="${v}"]`), ctx);
    return cargadas[v];
  };

  const marcarVersion = () => {
    raiz.dataset.version = version;
    raiz.querySelectorAll('[data-menu-ver]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.menuVer === version)));
  };
  marcarVersion();

  async function abrir() {
    if (abierto) return;
    abierto = true;
    lenis?.stop();
    html.classList.add('menu-abierto');
    boton.setAttribute('aria-expanded', 'true');
    if (textoBoton) textoBoton.textContent = 'Cerrar';
    raiz.hidden = false;
    sonido.abrir();
    if (!reducido) gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    const v = await cargar(version);
    if (abierto) v.abrir();
    raiz.querySelector(`[data-menu-v="${version}"] a:not([aria-disabled])`)?.focus({ preventScroll: true });
  }

  // Devuelve una promesa que se cumple cuando el menú ya se ha ido y la página vuelve a moverse
  function cerrar() {
    if (!abierto) return Promise.resolve();
    abierto = false;
    html.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    if (textoBoton) textoBoton.textContent = 'Menú';
    sonido.cerrar();
    cargadas[version]?.cerrar?.();
    boton.focus({ preventScroll: true });
    return new Promise((listo) => {
      const fin = () => { raiz.hidden = true; lenis?.start(); listo(); };
      if (reducido) fin();
      else gsap.to(raiz, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: fin });
    });
  }

  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });

  raiz.querySelectorAll('[data-menu-ver]').forEach((b) => b.addEventListener('click', async () => {
    if (b.dataset.menuVer === version) return;
    cargadas[version]?.cerrar?.();
    version = b.dataset.menuVer;
    try { sessionStorage.setItem('ads-menu', version); } catch (e) { /* nada */ }
    marcarVersion();
    (await cargar(version)).abrir();
  }));
}
