// Los textos grandes notan el ratón (como en Emotion): si pasa deprisa cerca, se descomponen en rojo y azul y se
// inclinan un poco hacia donde va, y vuelven a su sitio con un muelle. Quieto, no hay nada. Solo con ratón.
// Se marcan con data-vivo; el aspecto está en global.css (html.con-raton [data-vivo].vivo-on).
import { gsap } from 'gsap';

const ALCANCE = 240;     // px alrededor del texto en los que aún se nota
const VEL_MAX = 2200;    // px/s a los que el efecto llega al máximo

export function montarVivo() {
  const els = [...document.querySelectorAll('[data-vivo]')];
  if (!els.length) return;
  const visibles = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target))));
  const estado = new Map(els.map((el) => [el, { k: 0, v: 0, on: false }]));
  els.forEach((el) => io.observe(el));

  const m = { x: -1e4, y: -1e4, vx: 0, px: null, t: 0 };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (m.px !== null) m.vx = m.vx * 0.6 + ((e.clientX - m.px) / (Math.max(8, t - m.t) / 1000)) * 0.4;
    m.px = e.clientX; m.x = e.clientX; m.y = e.clientY; m.t = t;
  }, { passive: true });

  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (t - m.t > 50) m.vx *= Math.exp(-dt * 10);
    for (const el of visibles) {
      const s = estado.get(el);
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - m.x, 0, m.x - r.right), dy = Math.max(r.top - m.y, 0, m.y - r.bottom);
      const cerca = Math.max(0, 1 - Math.hypot(dx, dy) / ALCANCE);
      const objetivo = Math.max(-1, Math.min(1, m.vx / VEL_MAX)) * cerca;
      // Muelle algo flojo: se pasa un poco y vuelve
      s.v += (objetivo - s.k) * 180 * dt;
      s.v *= Math.exp(-12 * dt);
      s.k += s.v * dt;
      if (Math.abs(s.k) < 0.004 && Math.abs(s.v) < 0.01 && Math.abs(objetivo) < 0.004) {
        if (s.on) { s.on = false; s.k = 0; s.v = 0; el.classList.remove('vivo-on'); el.style.removeProperty('--vivo'); }
        continue;
      }
      if (!s.on) { s.on = true; el.classList.add('vivo-on'); }
      el.style.setProperty('--vivo', s.k.toFixed(3));
    }
  });
}
