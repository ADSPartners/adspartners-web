// Arranque de las subpáginas: lo mismo que la home menos el umbral y la portada. Scroll suave, sonido (las barras),
// cursor, la barra que se esconde, imanes, textos vivos y el fondo vivo (solo con ratón). Cada página pasa su
// montaje propio, que recibe lo mismo que las secciones de la home.
// Si la página se construye al llegar (html.construye, Base.astro), lo que pesa espera a que acabe: las letras que
// notan el ratón (parten el texto en letras) y el fondo vivo (abre un contexto WebGL), y este, además, a que el
// navegador esté libre. El montaje de cada página recibe construida y enReposo para hacer lo mismo con lo suyo.
import '@fontsource/geist-mono/400.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ajustes, alCambiar, montarBotonSonido, seguirSonido } from './ajustes.js';
import * as sonido from './sonido.js';
import { crearCursor } from './cursor.js';
import { montarVivo } from './vivo.js';
import { montarCabecera, montarImanes } from './comun.js';

gsap.registerPlugin(ScrollTrigger);

// Se cumple cuando la página ha acabado de construirse (o ya, si no se construye o ya acabó)
export const construida = () => new Promise((ok) => {
  if (!document.documentElement.classList.contains('construye')) { ok(); return; }
  addEventListener('ads:construida', () => ok(), { once: true });
});
// La animación «construida» del <html> es el reloj de la llegada (empieza con el primer pintado). compas(ms) se cumple
// cuando la llegada va por ms (ya, si no se construye); su startTime sirve para poner en hora las animaciones de JS
export const relojConstruccion = () => document.documentElement.getAnimations?.().find((a) => a.animationName === 'construida') || null;
export const compas = (ms) => new Promise((ok) => {
  const a = relojConstruccion();
  if (!a) { ok(); return; }
  a.ready.then(() => setTimeout(ok, Math.max(0, ms - (a.currentTime || 0))), () => ok());
});
// Cuando el navegador esté libre (como mucho, tope ms después)
export const enReposo = (tope = 1500) => new Promise((ok) => {
  if (window.requestIdleCallback) requestIdleCallback(() => ok(), { timeout: tope });
  else setTimeout(ok, 200);
});

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
  // Si el sonido estaba encendido, sigue encendido (si el navegador pide un gesto, suena con el primero)
  seguirSonido(sonido.encender);

  const cursor = crearCursor({ reducido });
  cursor.activar();
  montarCabecera();
  montarImanes(reducido);
  document.querySelectorAll('[data-sonido-hover]').forEach((a) => a.addEventListener('pointerenter', () => sonido.tic(0.7)));
  if (conRaton && !reducido) construida().then(montarVivo);

  try { montar?.({ reducido, conRaton, lenis, cursor, construida, enReposo, compas, relojConstruccion }); } catch (e) { console.warn('Página sin efectos:', e); }
  ScrollTrigger.refresh();

  if (conRaton && !reducido) {
    try {
      await construida();
      await enReposo();
      const { crearFondo } = await import('./gl/fondo.js');
      await crearFondo();
    } catch (e) {
      console.warn('Fondo sin efectos:', e);
    }
  }
}
