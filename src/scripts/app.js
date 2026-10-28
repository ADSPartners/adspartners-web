// Arranque de la home: scroll suave, ajustes, sonido, cursor, umbral, secciones y la portada en WebGL.
// La portada se carga aparte (import dinámico) para que el texto y el umbral no esperen al WebGL.
import '@fontsource/geist-mono/400.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ajustes, alCambiar, montarPanel } from './ajustes.js';
import * as sonido from './sonido.js';
import { crearCursor } from './cursor.js';
import { montarUmbral } from './umbral.js';
import { montarSecciones } from './secciones.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export async function arrancar() {
  const html = document.documentElement;
  const reducido = ajustes.movimiento === 'reducido';
  const enUmbral = html.classList.contains('en-umbral');

  // Scroll suave solo con ratón; con movimiento reducido, el del navegador
  let lenis = null;
  if (!reducido) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if (enUmbral) lenis.stop();
  }

  let portada = { entrar() {}, calidad() {}, activarCursor() {} };
  montarPanel();
  alCambiar((clave, valor) => {
    if (clave === 'sonido') (valor === 'si' ? sonido.encender() : sonido.apagar());
    if (clave === 'movimiento') location.reload();
    if (clave === 'calidad') portada.calidad(valor);
  });

  const cursor = crearCursor({ reducido });
  montarCabecera(lenis);
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
      if (modo) portada.entrar();
      if (!reducido && enUmbral) gsap.to(entran, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5 });
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

  // Gota de agua al pasar por botones, enlaces y servicios
  document.querySelectorAll('[data-sonido-hover]').forEach((a) => a.addEventListener('pointerenter', () => sonido.tic(0.7)));

  montarSecciones({ reducido });

  try {
    const { crearPortada } = await import('./gl/portada.js');
    portada = await crearPortada({ cursor, reducido, calidad: ajustes.calidad });
  } catch (e) {
    console.warn('Portada sin efectos:', e);
  }
  resolverListo(true);
  if (!enUmbral || entrado) portada.activarCursor?.();
}

// La barra se esconde al bajar (pasada la portada) y vuelve al subir
function montarCabecera(lenis) {
  const cab = document.querySelector('[data-cab]');
  if (!cab) return;
  let ultimo = window.scrollY;
  const mirar = (y) => {
    const bajando = y > ultimo + 2, subiendo = y < ultimo - 2;
    cab.classList.toggle('cab--fondo', y > innerHeight * 0.8);
    if (bajando && y > innerHeight * 0.6) cab.classList.add('cab--fuera');
    else if (subiendo || y < innerHeight * 0.6) cab.classList.remove('cab--fuera');
    ultimo = y;
  };
  if (lenis) lenis.on('scroll', (l) => mirar(l.scroll));
  else window.addEventListener('scroll', () => mirar(window.scrollY), { passive: true });
}
