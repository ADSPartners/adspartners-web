// El túnel de partners. Primero el título: con el scroll, cada letra viene hacia la cámara a su velocidad, crece y te
// pasa por los lados hasta desaparecer detrás de ti (no se desvanece: te come). Después la cámara avanza y los logos
// pasan a los lados; cada uno mezcla sus dos caras con --marca (0 = máquina, de lejos; 1 = marca, de cerca) y suena
// al cruzar. Con ratón, la cámara mira un poco hacia él (perspective-origin).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import * as sonido from '../sonido.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const azar = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
const FIN_TITULO = 0.17;   // parte del scroll que dura el vuelo del título
const PERSPECTIVA = 900;   // la del CSS (.pt__pegado)

export function montar(sec, { reducido, conRaton }) {
  // Los logos (la máscara --src) se piden ahora, cuando la sección está cerca, y no al entrar en la home
  sec.querySelectorAll('[data-pt-logo]').forEach((li) => li.style.setProperty('--src', 'var(--srcd)'));
  if (reducido) return;
  const pegado = sec.querySelector('[data-pt-pegado]');
  const menores = [...sec.querySelectorAll('[data-pt-menor]')];
  const logos = [...sec.querySelectorAll('[data-pt-logo]')];

  // El título, letra a letra; cada una con su velocidad y un pequeño giro
  const partido = SplitText.create(sec.querySelector('[data-pt-titulo]'), { type: 'words,chars', charsClass: 'pt-letra' });
  const letras = partido.chars.map((el, i) => ({ el, f: azar(i, 3) * 2 - 1, giro: (azar(i, 4) - 0.5) * 60 }));

  // Posiciones fijas (con un poco de azar estable): pared izquierda y derecha, arriba y abajo
  let sitio = [];
  let D = 720, total = 0;
  function colocar() {
    const movil = innerWidth <= 760;
    D = movil ? 560 : 720;
    // Al entrar, el primero aún está lejos; además no aparecen hasta que el título ya casi ha pasado
    const D0 = 1400;
    total = (logos.length + 1.8) * D + D0;
    sitio = logos.map((_, i) => {
      const lado = i % 2 ? 1 : -1;
      const alto = (i % 4) < 2 ? -1 : 1;
      return {
        x: lado * innerWidth * (movil ? 0.24 : 0.28) * (0.9 + azar(i, 1) * 0.25),
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
  let pAnterior = -1;
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (!visible) return;

    if (p !== pAnterior) {
      pAnterior = p;
      // El título: primero crece entero (todas las letras a la vez); al acercarse, cada una se adelanta o se retrasa
      // un poco, se tuerce y te pasa por los lados hasta irse por detrás. Al final del vuelo, hasta la más rezagada
      // ha pasado la cámara (ninguna se queda gigante en medio de la pantalla)
      const pt = Math.min(1, p / FIN_TITULO);
      const SUELTA = 220;
      const comun = Math.pow(pt, 1.5) * (PERSPECTIVA * 1.02 + SUELTA);
      const suelta = Math.pow(pt, 4);
      for (const l of letras) {
        const z = comun + l.f * suelta * SUELTA;
        const op = pt >= 1 ? 0 : 1 - suave(PERSPECTIVA * 0.84, PERSPECTIVA * 0.97, z);
        l.el.style.opacity = op.toFixed(3);
        l.el.style.transform = op > 0 && pt > 0 ? `translate3d(0, 0, ${z.toFixed(1)}px) rotateX(${(l.giro * suelta).toFixed(1)}deg)` : 'none';
      }
      const menor = String(1 - suave(0.005, 0.04, p));
      menores.forEach((el) => { el.style.opacity = menor; });

      // Los logos: la cámara empieza a avanzar cuando el título ya casi ha pasado
      const cam = Math.max(0, (p - FIN_TITULO * 0.7) / (1 - FIN_TITULO * 0.7)) * total;
      const tras = suave(FIN_TITULO * 0.92, FIN_TITULO * 1.15, p);
      logos.forEach((el, i) => {
        const s = sitio[i];
        const z = s.z + cam;
        const op = tras * suave(-5200, -3800, z) * (1 - suave(380, 760, z));
        if (op <= 0.001) { if (el.style.opacity !== '0') el.style.opacity = '0'; s.paso = z > 0; return; }
        el.style.opacity = op.toFixed(3);
        el.style.setProperty('--marca', suave(-1900, -650, z).toFixed(3));
        el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(s.giro * suave(-3000, 400, z)).toFixed(2)}deg)`;
        // Al cruzar por delante de la cámara, suena (y al volver hacia atrás, no)
        const paso = z > 180;
        if (paso && !s.paso) sonido.pasa(s.x > 0 ? 0.8 : 0.2);
        s.paso = paso;
      });
    }
    if (conRaton) {
      const k = 1 - Math.exp(-3 * dt);
      raton.sx += (raton.x - raton.sx) * k; raton.sy += (raton.y - raton.sy) * k;
      pegado.style.perspectiveOrigin = `${(50 + raton.sx * 16).toFixed(2)}% ${(50 + raton.sy * 12).toFixed(2)}%`;
    }
  });
}
