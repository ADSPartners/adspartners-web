// Arranque de las subpáginas: lo mismo que la home menos el umbral y la portada. Scroll suave, sonido (las barras),
// cursor, la barra que se esconde, imanes, textos vivos y el fondo vivo (solo con ratón). Cada página pasa su
// montaje propio, que recibe lo mismo que las secciones de la home.
import '@fontsource/geist-mono/400.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ajustes, alCambiar, montarBotonSonido } from './ajustes.js';
import * as sonido from './sonido.js';
import { crearCursor } from './cursor.js';
import { montarVivo } from './vivo.js';
import { montarCabecera, montarImanes } from './comun.js';

gsap.registerPlugin(ScrollTrigger);

export async function arrancarPagina(montar) {
  const html = document.documentElement;
  const reducido = ajustes.movimiento === 'reducido';
  const conRaton = html.classList.contains('con-raton');

  let lenis = null;
  if (!reducido) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  montarBotonSonido();
  alCambiar((clave, valor) => {
    if (clave === 'sonido') (valor === 'si' ? sonido.encender() : sonido.apagar());
  });
  // Si en la home entró con sonido, vuelve a sonar al primer gesto (el navegador no deja antes)
  let modo = null;
  try { modo = sessionStorage.getItem('ads-umbral'); } catch (e) { /* nada */ }
  if (modo === 'con' && ajustes.sonido !== 'no') {
    const primerGesto = () => { sonido.encender(); removeEventListener('pointerdown', primerGesto); removeEventListener('keydown', primerGesto); };
    addEventListener('pointerdown', primerGesto);
    addEventListener('keydown', primerGesto);
  }

  const cursor = crearCursor({ reducido });
  cursor.activar();
  montarCabecera();
  montarImanes(reducido);
  document.querySelectorAll('[data-sonido-hover]').forEach((a) => a.addEventListener('pointerenter', () => sonido.tic(0.7)));
  if (conRaton && !reducido) montarVivo();

  try { montar?.({ reducido, conRaton, lenis, cursor }); } catch (e) { console.warn('Página sin efectos:', e); }
  ScrollTrigger.refresh();

  if (conRaton && !reducido) {
    try {
      const { crearFondo } = await import('./gl/fondo.js');
      await crearFondo();
    } catch (e) {
      console.warn('Fondo sin efectos:', e);
    }
  }
}
