// «Se enciende la luz»: con el scroll, cada celda pasa de máquina a crema siguiendo una matriz de Bayer 8×8 con un
// sesgo de abajo arriba. Las celdas que están a punto de encenderse enseñan un glifo mono. Solo se pinta al hacer scroll.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const BAYER = (() => {
  // Matriz de Bayer 8×8 normalizada a [0, 1)
  const b2 = [[0, 2], [3, 1]];
  let m = b2;
  for (let n = 2; n < 8; n *= 2) {
    m = Array.from({ length: n * 2 }, (_, y) => Array.from({ length: n * 2 }, (_, x) => 4 * m[y % n][x % n] + b2[Math.floor(y / n)][Math.floor(x / n)]));
  }
  return m.map((fila) => fila.map((v) => v / 64));
})();
const GLIFOS = '.:-=+10#@';

export function montar(sec, { reducido }) {
  if (reducido) return;
  const canvas = sec.querySelector('[data-tr-canvas]');
  const texto = sec.querySelector('[data-tr-texto]');
  const ctx = canvas.getContext('2d');
  const CELDA = 22;
  let W = 0, H = 0, dpr = 1, cols = 0, filas = 0, p = 0;

  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    cols = Math.ceil(W / CELDA); filas = Math.ceil(H / CELDA);
    pintar();
  }

  function pintar() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // Umbral: de -0.1 a 1.1 para que al principio no haya nada y al final no quede nada
    const u = p * 1.25 - 0.12;
    ctx.font = `400 ${CELDA * 0.7}px "Geist Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let y = 0; y < filas; y++) {
      const sesgo = 1 - y / filas;          // abajo se enciende antes
      for (let x = 0; x < cols; x++) {
        const v = BAYER[y % 8][x % 8] * 0.55 + sesgo * 0.45;
        const cx = x * CELDA, cy = y * CELDA;
        if (v < u) {
          ctx.fillStyle = '#E7E2DA';
          ctx.fillRect(cx, cy, CELDA + 0.5, CELDA + 0.5);
        } else if (v < u + 0.06) {
          ctx.fillStyle = `rgba(231, 226, 218, ${(0.9 - (v - u) * 12).toFixed(2)})`;
          ctx.fillText(GLIFOS[Math.floor(Math.random() * GLIFOS.length)], cx + CELDA / 2, cy + CELDA / 2 + 1);
        }
      }
    }
    texto.style.opacity = String(Math.max(0, 1 - Math.abs(p - 0.5) * 3));
  }

  medir();
  addEventListener('resize', medir);
  document.fonts.load('400 12px "Geist Mono"').then(pintar);
  ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (st) => { p = st.progress; pintar(); } });
}
