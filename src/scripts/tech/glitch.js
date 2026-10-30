// Las letras de Tech notan el ratón, en versión máquina de los textos vivos de la home (vivo.js): si el ratón pasa
// deprisa cerca, el texto se desplaza, se separa en rojo y azul y se rasga en franjas que saltan de sitio; las
// franjas van pixeladas y, si pasa muy deprisa, se pixela todo el texto. Quieto, no hay nada: vuelve con un muelle.
// Solo con ratón. Se marcan con data-glitch; las franjas son el ::before y el ::after (tech/index.astro), que copian
// el texto de data-texto (aquí se mantiene al día). Los filtros de píxeles son SVG, también de aquí.
import { gsap } from 'gsap';

const ALCANCE = 200;     // px alrededor del texto en los que aún se nota
const VEL_MAX = 2400;    // px/s a los que el efecto llega al máximo

// Pixelar con un filtro SVG: una rejilla de puntos que coge el color del texto y cada punto se engorda a un bloque
const filtro = (id, b) => `<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
  <feFlood x="${b / 2 - 1}" y="${b / 2 - 1}" width="2" height="2"/><feComposite width="${b}" height="${b}"/><feTile result="r"/>
  <feComposite in="SourceGraphic" in2="r" operator="in"/><feMorphology operator="dilate" radius="${b / 2}"/></filter>`;

export function montarGlitch(raiz, { vale = () => true } = {}) {
  const els = [...raiz.querySelectorAll('[data-glitch]')];
  if (!els.length) return;
  const defs = document.createElement('div');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML = `<svg width="0" height="0">${filtro('tec-pixel', 4)}${filtro('tec-pixel-g', 6)}</svg>`;
  document.body.append(defs);

  const estado = new Map(els.map((el) => [el, { k: 0, v: 0, on: false, txt: null, salto: 0 }]));
  const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, px: null, py: 0, t: 0 };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (m.px !== null) {
      const dt = Math.max(8, t - m.t) / 1000;
      m.vx = m.vx * 0.6 + ((e.clientX - m.px) / dt) * 0.4;
      m.vy = m.vy * 0.6 + ((e.clientY - m.py) / dt) * 0.4;
    }
    m.px = m.x = e.clientX; m.py = m.y = e.clientY; m.t = t;
  }, { passive: true });

  const azar = (a, b) => a + Math.random() * (b - a);
  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (t - m.t > 50) { m.vx *= Math.exp(-dt * 10); m.vy *= Math.exp(-dt * 10); }
    const rapidez = Math.min(1, Math.hypot(m.vx, m.vy) / VEL_MAX);
    for (const el of els) {
      const s = estado.get(el);
      const vivo = vale(el);
      if (!vivo && !s.on) continue;
      let objetivo = 0;
      if (vivo) {
        const r = el.getBoundingClientRect();
        const dx = Math.max(r.left - m.x, 0, m.x - r.right), dy = Math.max(r.top - m.y, 0, m.y - r.bottom);
        objetivo = rapidez * Math.max(0, 1 - Math.hypot(dx, dy) / ALCANCE) * (m.vx < 0 ? -1 : 1);
      }
      // Muelle algo flojo: se pasa un poco y vuelve
      s.v += (objetivo - s.k) * 200 * dt;
      s.v *= Math.exp(-13 * dt);
      s.k += s.v * dt;
      const a = Math.abs(s.k);
      if (a < 0.006 && Math.abs(s.v) < 0.02 && Math.abs(objetivo) < 0.006) {
        if (s.on) {
          s.on = false; s.k = 0; s.v = 0;
          el.classList.remove('glitch-on', 'glitch-rasgo', 'glitch-pixel');
          for (const p of ['--gk', '--g1', '--g1x', '--g2', '--g2x']) el.style.removeProperty(p);
        }
        continue;
      }
      if (!s.on) { s.on = true; el.classList.add('glitch-on'); }
      if (el.textContent !== s.txt) { s.txt = el.textContent; el.dataset.texto = s.txt; }
      el.style.setProperty('--gk', s.k.toFixed(3));
      el.classList.toggle('glitch-rasgo', a > 0.12);
      el.classList.toggle('glitch-pixel', a > 0.55);
      // Las franjas cambian de sitio a saltos, no en cada fotograma (así se lee como un fallo de señal)
      if (t - s.salto > azar(50, 110)) {
        s.salto = t;
        const arriba1 = azar(0, 78), alto1 = azar(10, 34);
        const arriba2 = azar(0, 90), alto2 = azar(4, 12);
        el.style.setProperty('--g1', `inset(${arriba1.toFixed(1)}% 0 ${Math.max(0, 100 - arriba1 - alto1).toFixed(1)}% 0)`);
        el.style.setProperty('--g2', `inset(${arriba2.toFixed(1)}% 0 ${Math.max(0, 100 - arriba2 - alto2).toFixed(1)}% 0)`);
        el.style.setProperty('--g1x', `${(Math.sign(s.k) * a * azar(8, 26)).toFixed(1)}px`);
        el.style.setProperty('--g2x', `${(-Math.sign(s.k) * a * azar(6, 18)).toFixed(1)}px`);
      }
    }
  });
}
