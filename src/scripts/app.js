// Arranque de la home: scroll suave, sonido (las barras de la cabecera), cursor, umbral, la portada en WebGL,
// el fondo vivo (solo con ratón) y cada sección, que carga su JS cuando se acerca a la pantalla.
// La portada se carga aparte (import dinámico) para que el texto y el umbral no esperen al WebGL.
import '@fontsource/geist-mono/400.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ajustes, alCambiar, montarBotonSonido } from './ajustes.js';
import * as sonido from './sonido.js';
import { crearCursor } from './cursor.js';
import { montarUmbral } from './umbral.js';
import { montarGlobo } from './secciones/fresa.js';

gsap.registerPlugin(ScrollTrigger);

// Cada sección y su módulo (se cargan solos cuando faltan ~1,5 pantallas para llegar)
const SECCIONES = {
  quesomos: () => import('./secciones/quesomos.js'),
  partners: () => import('./secciones/partners.js'),
  proyectos: () => import('./secciones/proyectos.js'),
  transicion: () => import('./secciones/transicion.js'),
  contacto: () => import('./secciones/contacto.js'),
  fresa: () => import('./secciones/fresa.js'),
};

export async function arrancar() {
  const html = document.documentElement;
  const reducido = ajustes.movimiento === 'reducido';
  const conRaton = html.classList.contains('con-raton');
  const enUmbral = html.classList.contains('en-umbral');

  // Scroll suave; con movimiento reducido, el del navegador
  let lenis = null;
  if (!reducido) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if (enUmbral) lenis.stop();
  }

  let portada = { entrar() {}, activarCursor() {} };
  montarBotonSonido();
  alCambiar((clave, valor) => {
    if (clave === 'sonido') (valor === 'si' ? sonido.encender() : sonido.apagar());
  });

  const cursor = crearCursor({ reducido });
  montarCabecera();
  montarGlobo({ lenis, reducido });
  const entran = [...document.querySelectorAll('[data-entra]')];
  if (enUmbral && !reducido) gsap.set(entran, { opacity: 0, y: 24 });

  let resolverListo;
  const listo = new Promise((ok) => { resolverListo = ok; });
  let entrado = false;

  montarUmbral({
    listo,
    reducido,
    alEntrar(modo, info = {}) {
      entrado = true;
      if (modo === 'con') { ajustes.sonido = 'si'; sonido.encender().then(() => sonido.entrar()); }
      else if (modo === 'sin') { ajustes.sonido = 'no'; }
      lenis?.start();
      cursor.activar();
      if (info.rectIso) cursor.volarDesde(info.rectIso);
      portada.activarCursor?.();
      if (modo) portada.entrar(info.x, info.y);
      if (!reducido && enUmbral) gsap.to(entran, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 2.1 });
    },
  });

  // Sin umbral (ya entró en esta sesión): si había elegido sonido, se enciende al primer gesto
  if (!enUmbral) {
    let modo = null;
    try { modo = sessionStorage.getItem('ads-umbral'); } catch (e) { /* nada */ }
    if (modo === 'con' && ajustes.sonido !== 'no') {
      const primerGesto = () => { sonido.encender(); window.removeEventListener('pointerdown', primerGesto); window.removeEventListener('keydown', primerGesto); };
      window.addEventListener('pointerdown', primerGesto);
      window.addEventListener('keydown', primerGesto);
    }
  }

  // Gota de agua al pasar por botones y enlaces
  document.querySelectorAll('[data-sonido-hover]').forEach((a) => a.addEventListener('pointerenter', () => sonido.tic(0.7)));
  montarImanes(reducido);
  montarSecciones({ reducido, conRaton, lenis, cursor });

  try {
    const { crearPortada } = await import('./gl/portada.js');
    portada = await crearPortada({ cursor, reducido });
  } catch (e) {
    console.warn('Portada sin efectos:', e);
  }
  resolverListo(portada);
  if (!enUmbral || entrado) portada.activarCursor?.();

  // El fondo vivo, solo con ratón y con movimiento: después de la portada, para no competir con su carga
  if (conRaton && !reducido) {
    try {
      const { crearFondo } = await import('./gl/fondo.js');
      await crearFondo();
    } catch (e) {
      console.warn('Fondo sin efectos:', e);
    }
  }
}

function montarSecciones(ctx) {
  const pendientes = [...document.querySelectorAll('[data-seccion]')].filter((el) => SECCIONES[el.dataset.seccion]);
  const montar = async (el) => {
    const mod = await SECCIONES[el.dataset.seccion]();
    try { mod.montar(el, ctx); } catch (e) { console.warn(`Sección ${el.dataset.seccion} sin efectos:`, e); }
    ScrollTrigger.refresh();
  };
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      montar(e.target);
    }
  }, { rootMargin: '150% 0px 150% 0px' });
  pendientes.forEach((el) => io.observe(el));
}

// Imanes: el botón se acerca un poco al ratón cuando está cerca, y vuelve con un pequeño rebote
function montarImanes(reducido) {
  if (reducido || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-iman]').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
  });
}

// La barra se esconde al bajar (pasada la portada) y vuelve al subir. Sobre el capítulo claro, cambia a tinta
function montarCabecera() {
  const cab = document.querySelector('[data-cab]');
  if (!cab) return;
  let ultimo = window.scrollY;
  const claro = document.getElementById('contacto');
  const mirar = (y) => {
    const bajando = y > ultimo + 2, subiendo = y < ultimo - 2;
    cab.classList.toggle('cab--fondo', y > innerHeight * 0.8);
    if (bajando && y > innerHeight * 0.6) cab.classList.add('cab--fuera');
    else if (subiendo || y < innerHeight * 0.6) cab.classList.remove('cab--fuera');
    if (claro) {
      const r = claro.getBoundingClientRect();
      cab.classList.toggle('cab--clara', r.top < 60 && r.bottom > 60);
    }
    ultimo = y;
  };
  // El scroll nativo (Lenis lo mueve también): así cuenta igual el scroll de rueda que el de foco o el de un enlace
  window.addEventListener('scroll', () => mirar(window.scrollY), { passive: true });
}
