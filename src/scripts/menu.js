// El menú (components/Menu.astro): el botón de la cabecera lo abre y pasa a «Cerrar»; Esc también lo cierra. Al abrir,
// las letras de la página se difuminan y se pierden; mientras está abierto, la página no se mueve. Dentro, el viaje a la
// aurora (menu/aurora.js), que se carga la primera vez que se abre: entero la primera vez de cada visita (desde la
// puesta de sol) y, las siguientes, se llega ya dentro. Sin WebGL, solo la lista.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';

export function montarMenu({ lenis, reducido }) {
  const raiz = document.querySelector('[data-menu]');
  const boton = document.querySelector('[data-menu-btn]');
  if (!raiz || !boton) return;
  const html = document.documentElement;
  const datos = JSON.parse(raiz.querySelector('[data-menu-datos]').textContent);
  const textoBoton = boton.querySelector('[data-menu-txt]');
  const pagina = document.querySelector('main');
  let aurora = null, abierto = false;

  // Ir a una página desde el menú: Hablemos baja al contacto (en la home) y lo demás navega; Brand, aún no
  const ir = (d) => {
    if (!d.ruta) return;
    if (d.ruta.startsWith('#')) {
      const destino = document.querySelector(d.ruta);
      // Se baja cuando el menú ya se ha cerrado (hasta entonces el scroll está parado)
      if (destino) { cerrar().then(() => (lenis ? lenis.scrollTo(destino, { duration: 1.6 }) : destino.scrollIntoView({ behavior: 'smooth' }))); return; }
    }
    location.href = `${window.ADS_BASE || '/'}${d.ruta}`;
  };

  async function abrir() {
    if (abierto) return;
    abierto = true;
    lenis?.stop();
    html.classList.add('menu-abierto');
    boton.setAttribute('aria-expanded', 'true');
    if (textoBoton) textoBoton.textContent = 'Cerrar';
    raiz.hidden = false;
    sonido.abrir();
    if (!reducido) {
      gsap.to(pagina, { filter: 'blur(18px)', opacity: 0, duration: 0.9, ease: 'power2.in', overwrite: true });
      gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.15, ease: 'power1.inOut' });
    }
    if (aurora === null) {
      try { aurora = (await import('./menu/aurora.js')).crear(raiz, { datos, reducido, sonido, ir }); } catch (e) { console.warn('Menú sin aurora:', e); }
      if (!aurora) { aurora = false; raiz.classList.add('sin-gl'); }
    }
    let primera = true;
    try { primera = !sessionStorage.getItem('ads-aurora'); sessionStorage.setItem('ads-aurora', '1'); } catch (e) { /* nada */ }
    if (abierto && aurora) aurora.abrir(primera);
    raiz.querySelector('[data-au-ir]:not([aria-disabled])')?.focus({ preventScroll: true });
  }

  // Devuelve una promesa que se cumple cuando el menú ya se ha ido y la página vuelve a moverse
  function cerrar() {
    if (!abierto) return Promise.resolve();
    abierto = false;
    html.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    if (textoBoton) textoBoton.textContent = 'Menú';
    sonido.cerrar();
    boton.focus({ preventScroll: true });
    return new Promise((listo) => {
      const fin = () => { aurora?.cerrar(); raiz.hidden = true; lenis?.start(); listo(); };
      if (reducido) { fin(); return; }
      gsap.to(raiz, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: fin });
      gsap.to(pagina, { filter: 'blur(0px)', opacity: 1, duration: 0.7, delay: 0.15, ease: 'power2.out', overwrite: true, clearProps: 'filter,opacity,scale,transform' });
    });
  }

  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
}
