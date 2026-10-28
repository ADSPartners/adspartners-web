// El logo-cubo de la barra (Huyml): la rueda lo hace girar y, al parar, encaja en la cara más cercana (90°).
import { gsap } from 'gsap';
import * as sonido from './sonido.js';

export function crearCubo({ lenis, reducido }) {
  const el = document.querySelector('[data-cubo]');
  if (!el) return;
  const st = { objetivo: 0, actual: 0, encajando: false };
  let parada = null;
  let ultimoScroll = window.scrollY;

  const pintar = () => { el.style.transform = `translateZ(-17px) rotateX(${st.actual.toFixed(2)}deg)`; };

  function encajar() {
    const destino = Math.round(st.objetivo / 90) * 90;
    st.objetivo = destino; st.encajando = true;
    gsap.to(st, {
      actual: destino, duration: reducido ? 0 : 1, ease: 'power3.out', onUpdate: pintar,
      onStart() { if (Math.abs(destino - st.actual) > 4) sonido.encaje(); },
      onComplete() { st.encajando = false; },
    });
  }

  function alDesplazar(y) {
    const delta = y - ultimoScroll;
    ultimoScroll = y;
    if (!delta) return;
    gsap.killTweensOf(st);
    st.encajando = false;
    st.objetivo += delta * 0.25;
    clearTimeout(parada);
    parada = setTimeout(encajar, 140);
  }

  if (lenis) lenis.on('scroll', (l) => alDesplazar(l.scroll));
  else window.addEventListener('scroll', () => alDesplazar(window.scrollY), { passive: true });

  gsap.ticker.add(() => {
    if (st.encajando || Math.abs(st.objetivo - st.actual) < 0.05) return;
    st.actual += (st.objetivo - st.actual) * (reducido ? 1 : 0.12);
    pintar();
  });
}
