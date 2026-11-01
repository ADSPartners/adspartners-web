// El menú (components/Menu.astro): el botón de la cabecera lo abre y pasa a «Cerrar»; Esc también lo cierra. Al abrir,
// la página se cambia de golpe por su propio código y empieza la bajada hasta la placa (menu/placa.js): entera la
// primera vez de cada visita y, las siguientes, más deprisa. Al cerrar, el viaje de vuelta acaba en la página tal cual
// estaba; mientras está abierto, la página no se mueve. La placa se prepara antes (al acercar el ratón al botón o, en
// el móvil, cuando la página está quieta), para que al abrir no haya espera. Sin WebGL, solo la lista.
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
  let modulo = null, placa = null, abierto = false, cerrando = false;

  const cargar = () => (modulo ||= import('./menu/placa.js'));
  const precargar = () => cargar().then((m) => m.preparar(datos)).catch((e) => console.warn('Menú sin placa:', e));
  boton.addEventListener('pointerenter', precargar, { once: true });
  boton.addEventListener('focus', precargar, { once: true });
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setTimeout(() => (window.requestIdleCallback || setTimeout)(precargar), 4000);
  }

  // Ir a una página desde el menú: lo que empieza por # baja a esa sección de la home y lo demás navega
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
    if (abierto || cerrando) return;
    abierto = true;
    lenis?.stop();
    html.classList.add('menu-abierto');
    boton.setAttribute('aria-expanded', 'true');
    if (textoBoton) textoBoton.textContent = 'Cerrar';
    if (placa === null) {
      try { placa = (await cargar()).crear(raiz, { datos, reducido, sonido, ir }); } catch (e) { console.warn('Menú sin placa:', e); }
      if (!placa) { placa = false; raiz.classList.add('sin-gl'); }
    }
    if (!abierto) return;   // se cerró mientras cargaba
    let primera = true;
    try { primera = !sessionStorage.getItem('ads-placa'); sessionStorage.setItem('ads-placa', '1'); } catch (e) { /* nada */ }
    raiz.hidden = false;
    if (placa) {
      // El código de la página y su primer fotograma se pintan aquí mismo: la página se esconde en el mismo instante
      placa.abrir(primera);
      pagina.style.visibility = 'hidden';
    } else {
      sonido.abrir();
      if (!reducido) gsap.fromTo(raiz, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut' });
    }
    raiz.querySelector('[data-pl-ir]:not([aria-disabled])')?.focus({ preventScroll: true });
  }

  // Devuelve una promesa que se cumple cuando el menú ya se ha ido y la página vuelve a moverse
  function cerrar() {
    if (!abierto) return Promise.resolve();
    abierto = false;
    cerrando = true;
    html.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    if (textoBoton) textoBoton.textContent = 'Menú';
    boton.focus({ preventScroll: true });
    const fin = () => {
      placa?.parar();
      raiz.hidden = true;
      pagina.style.visibility = '';
      gsap.set(raiz, { clearProps: 'opacity' });
      lenis?.start();
      cerrando = false;
    };
    if (placa) return placa.salir().then(fin);
    sonido.cerrar();
    return new Promise((listo) => {
      if (reducido) { fin(); listo(); return; }
      gsap.to(raiz, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => { fin(); listo(); } });
    });
  }

  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
}
