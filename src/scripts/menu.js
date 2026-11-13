// El menú (components/Menu.astro): el botón de la cabecera lo abre y pasa a «Cerrar»; Esc también lo cierra. Al abrir,
// del botón sale una ola que convierte la página en su propio código y después empieza la bajada hasta la placa
// (menu/placa.js, que también esconde la página cuando la ola la cubre): entera la primera vez de cada visita y, las
// siguientes, más deprisa. Al cerrar, el viaje de vuelta acaba con la ola metiéndose en el botón y la página tal cual
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
  const crearPlaca = (m) => {
    if (placa === null) placa = m.crear(raiz, { datos, reducido, sonido, ir, adelantar, pagina }) || false;
    if (!placa) raiz.classList.add('sin-gl');
    return placa;
  };
  // (lo que pesa, cuando el navegador esté libre)
  const precargar = () => cargar()
    .then((m) => { m.preparar(datos); if (crearPlaca(m)) (window.requestIdleCallback || setTimeout)(() => placa.precalentar()); })
    .catch((e) => console.warn('Menú sin placa:', e));
  boton.addEventListener('pointerenter', precargar, { once: true });
  boton.addEventListener('focus', precargar, { once: true });
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setTimeout(() => (window.requestIdleCallback || setTimeout)(precargar), 4000);
  }

  // Ir a una página desde el menú: lo que empieza por # baja a esa sección de la home y lo demás navega. entrada: si se
  // llega entrando en la pieza, la página nueva lo sabe (ads-entrada, unos segundos) y empieza en la misma ventana en la
  // que acaba el viaje (components/Entrada.astro)
  const url = (d) => `${window.ADS_BASE || '/'}${d.ruta}`;
  const recordarEntrada = (entrada) => {
    try { sessionStorage.setItem('ads-entrada', JSON.stringify({ ...entrada, t: Date.now() })); } catch (e) { /* sin almacenamiento: entra sin más */ }
  };
  // Al elegir una pieza, la página de destino se descarga mientras dura el viaje (casi 2 s), para que al llegar no haya
  // que esperar a la red: con Speculation Rules en Chrome y Edge, y con <link rel="prefetch"> en Firefox (Safari no lo
  // hace y navega como siempre). Prerenderizarla no adelanta nada: Chrome no la pinta hasta enseñarla, y lo que tarda
  // una página grande es pintar su primer fotograma. La marca de llegada se guarda ya
  const adelantar = (d, entrada) => {
    if (!d.ruta || d.ruta.startsWith('#')) return;
    if (entrada) recordarEntrada(entrada);
    const u = url(d);
    if (document.querySelector(`[data-adelanto="${u}"]`)) return;
    let el;
    if (window.HTMLScriptElement?.supports?.('speculationrules')) {
      el = document.createElement('script');
      el.type = 'speculationrules';
      el.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [u], eagerness: 'immediate' }] });
    } else {
      el = document.createElement('link');
      el.rel = 'prefetch';
      el.href = u;
    }
    el.dataset.adelanto = u;
    document.head.appendChild(el);
  };
  const ir = (d, entrada) => {
    if (!d.ruta) return;
    if (d.ruta.startsWith('#')) {
      const destino = document.querySelector(d.ruta);
      // Se baja cuando el menú ya se ha cerrado (hasta entonces el scroll está parado)
      if (destino) { cerrar().then(() => (lenis ? lenis.scrollTo(destino, { duration: 1.6 }) : destino.scrollIntoView({ behavior: 'smooth' }))); return; }
    }
    if (entrada) recordarEntrada(entrada);
    location.href = url(d);
  };

  async function abrir() {
    if (abierto || cerrando) return;
    abierto = true;
    lenis?.stop();
    html.classList.add('menu-abierto');
    boton.setAttribute('aria-expanded', 'true');
    if (textoBoton) textoBoton.textContent = 'Cerrar';
    if (placa === null) {
      try { crearPlaca(await cargar()); } catch (e) { console.warn('Menú sin placa:', e); placa = false; raiz.classList.add('sin-gl'); }
    }
    if (!abierto) return;   // se cerró mientras cargaba
    let primera = true;
    try { primera = !sessionStorage.getItem('ads-placa'); sessionStorage.setItem('ads-placa', '1'); } catch (e) { /* nada */ }
    raiz.hidden = false;
    if (placa) placa.abrir(primera);
    else {
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

  // Al volver con «atrás» después de entrar en una pieza, el navegador puede devolver la página tal cual se fue (con el
  // menú dentro de la pieza): se deja cerrado y la página, como estaba
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !abierto) return;
    placa?.reiniciar?.();
    abierto = false; cerrando = false;
    html.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    if (textoBoton) textoBoton.textContent = 'Menú';
    raiz.hidden = true;
    pagina.style.visibility = '';
    lenis?.start();
  });

  boton.addEventListener('click', () => (abierto ? cerrar() : abrir()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
}
