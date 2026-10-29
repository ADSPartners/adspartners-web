// El túnel de partners: el scroll mueve la cámara hacia delante y los logos pasan a los lados.
// Cada logo mezcla sus dos caras con --marca (0 = máquina, de lejos; 1 = marca, de cerca) y suena al cruzar.
// Con ratón, la cámara mira un poco hacia él (perspective-origin).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as sonido from '../sonido.js';

gsap.registerPlugin(ScrollTrigger);

const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function montar(sec, { reducido, conRaton }) {
  if (reducido) return;
  const pegado = sec.querySelector('[data-pt-pegado]');
  const intro = sec.querySelector('[data-pt-intro]');
  const fin = sec.querySelector('[data-pt-fin]');
  const logos = [...sec.querySelectorAll('[data-pt-logo]')];

  // Posiciones fijas (con un poco de azar estable): pared izquierda y derecha, arriba y abajo
  let sitio = [];
  let D = 720, D0 = 0, total = 0;
  const azar = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
  function colocar() {
    const movil = innerWidth <= 760;
    D = movil ? 560 : 720;
    // Al entrar, el primero aún está lejos (pequeño y en máquina), detrás del título
    D0 = D * 2.4;
    total = (logos.length + 1.8) * D + D0;
    sitio = logos.map((_, i) => {
      const lado = i % 2 ? 1 : -1;
      const alto = (i % 4) < 2 ? -1 : 1;
      return {
        x: lado * innerWidth * (movil ? 0.26 : 0.29) * (0.9 + azar(i, 1) * 0.25),
        y: alto * innerHeight * (movil ? 0.17 : 0.13) * (0.55 + azar(i, 2) * 0.7),
        z: -(i + 1) * D - D0,
        giro: -lado * (movil ? 8 : 16),
        paso: false,
      };
    });
  }
  colocar();
  addEventListener('resize', colocar);

  let p = 0;
  ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (st) => { p = st.progress; } });

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(sec);

  const raton = { x: 0, y: 0, sx: 0, sy: 0 };
  if (conRaton) addEventListener('pointermove', (e) => { raton.x = e.clientX / innerWidth - 0.5; raton.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (!visible) return;
    const cam = p * total;
    logos.forEach((el, i) => {
      const s = sitio[i];
      const z = s.z + cam;
      const op = suave(-7600, -4600, z) * (1 - suave(380, 760, z));
      const marca = suave(-1900, -650, z);
      if (op <= 0.001) { if (el.style.opacity !== '0') el.style.opacity = '0'; s.paso = z > 0; return; }
      el.style.opacity = op.toFixed(3);
      el.style.setProperty('--marca', marca.toFixed(3));
      el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(s.giro * suave(-3000, 400, z)).toFixed(2)}deg)`;
      // Al cruzar por delante de la cámara, suena (y al volver hacia atrás, no)
      const paso = z > 180;
      if (paso && !s.paso) sonido.pasa(s.x > 0 ? 0.8 : 0.2);
      s.paso = paso;
    });
    intro.style.opacity = String(1 - suave(0.015, 0.09, p));
    intro.style.transform = `translate3d(0, 0, ${(p * 900).toFixed(1)}px)`;
    fin.style.opacity = String(suave(0.88, 0.97, p));
    if (conRaton) {
      const k = 1 - Math.exp(-3 * dt);
      raton.sx += (raton.x - raton.sx) * k; raton.sy += (raton.y - raton.sy) * k;
      pegado.style.perspectiveOrigin = `${(50 + raton.sx * 16).toFixed(2)}% ${(50 + raton.sy * 12).toFixed(2)}%`;
    }
  });
}
