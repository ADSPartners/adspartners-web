// El logo-cubo de la barra (Huyml): la rueda lo hace girar y, al parar, encaja en la cara más cercana (90°).
import { gsap } from 'gsap';
import * as sonido from './sonido.js';

export function crearCubo({ lenis, reducido }) {
  const el = document.querySelector('[data-cubo]');
  if (!el) return;
  const st = { objetivo: 0, actual: 0, encajando: false };
  let parada = null;
  let ultimoScroll = window.scrollY;

  const caras = [...el.children];
  // Cada cara lleva su propia perspectiva (no depende del 3D anidado, que algunos WebKit aplastan)
  // y se oculta cuando mira hacia atrás (Safari no siempre respeta backface-visibility)
  el.style.transform = 'none';
  const pintar = () => {
    caras.forEach((c, i) => {
      const a = st.actual - 90 * i;
      c.style.transform = `perspective(600px) translateZ(-17px) rotateX(${a.toFixed(2)}deg) translateZ(17px)`;
      c.style.visibility = Math.cos((a * Math.PI) / 180) > 0.02 ? 'visible' : 'hidden';
    });
  };

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

  pintar();
  if (lenis) lenis.on('scroll', (l) => alDesplazar(l.scroll));
  else window.addEventListener('scroll', () => alDesplazar(window.scrollY), { passive: true });

  gsap.ticker.add(() => {
    if (st.encajando || Math.abs(st.objetivo - st.actual) < 0.05) return;
    st.actual += (st.objetivo - st.actual) * (reducido ? 1 : 0.12);
    pintar();
  });
}
