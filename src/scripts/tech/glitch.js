// Las letras de Tech notan el ratón, en versión máquina de los textos vivos de la home (vivo.js), y como allí solo en
// la zona por la que pasa: si el ratón pasa deprisa cerca, esas letras saltan de sitio, se separan en rojo y azul y,
// si pasa muy deprisa, se pixelan; y en esa zona el texto se rasga en franjas que saltan. El resto no se mueve.
// Quieto, no hay nada: vuelve con un muelle. Cada salto de las franjas suena (sonido.glitch). Solo con ratón; el
// motor, letra a letra, está en letras.js.
// Se marcan con data-glitch; las franjas son el ::before y el ::after (tech/index.astro), que copian el texto de
// data-texto (aquí se mantiene al día). Los filtros de píxeles son SVG, también de aquí.
import { letrasQueNotan } from '../letras.js';
import * as sonido from '../sonido.js';

// Pixelar con un filtro SVG: una rejilla de puntos que coge el color del texto y cada punto se engorda a un bloque
const filtro = (id, b) => `<filter id="${id}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
  <feFlood x="${b / 2 - 1}" y="${b / 2 - 1}" width="2" height="2"/><feComposite width="${b}" height="${b}"/><feTile result="r"/>
  <feComposite in="SourceGraphic" in2="r" operator="in"/><feMorphology operator="dilate" radius="${b / 2}"/></filter>`;

const azar = (a, b) => a + Math.random() * (b - a);
const limitar = (x, a, b) => Math.min(b, Math.max(a, x));

export function montarGlitch(raiz, { vale = () => true } = {}) {
  const els = [...raiz.querySelectorAll('[data-glitch]')];
  if (!els.length) return;
  const defs = document.createElement('div');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML = `<svg width="0" height="0">${filtro('tec-pixel', 4)}</svg>`;
  document.body.append(defs);

  letrasQueNotan(els, {
    velMax: 2400,
    radio: (fs) => Math.min(150, Math.max(44, fs * 1.6)),   // px alrededor del ratón en los que aún se nota
    vale,
    pintar(l, k, i, s) {
      if (!l.classList.contains('glitch-on')) l.classList.add('glitch-on');
      const a = Math.abs(k);
      // Hacia donde va el ratón, más un salto propio de cada letra que cambia a ratos (no en cada fotograma). El rojo
      // y el azul aparecen poco a poco: si no, con la letra casi quieta se suman encima y la letra brilla de más
      l.style.setProperty('--gk', k.toFixed(3));
      l.style.setProperty('--ga', Math.min(1, a * 3).toFixed(2));
      l.style.setProperty('--gx', `${(k * 7 + a * (s.salto?.[i] || 0) * 9).toFixed(1)}px`);
      l.classList.toggle('glitch-pixel', a > 0.5);
    },
    apagar(l) {
      l.classList.remove('glitch-on', 'glitch-pixel');
      for (const p of ['--gk', '--ga', '--gx']) l.style.removeProperty(p);
    },
    // Las franjas, solo alrededor de la letra más movida
    despues(el, s, { r, max, imax, t }) {
      const rasga = max > 0.12;
      if (!rasga) {
        if (el.classList.contains('glitch-rasgo')) {
          el.classList.remove('glitch-rasgo');
          for (const p of ['--g1', '--g1x', '--g2', '--g2x']) el.style.removeProperty(p);
        }
        return;
      }
      if (el.dataset.texto !== s.txt) el.dataset.texto = s.txt;
      el.classList.add('glitch-rasgo');
      // Las franjas y los saltos de las letras cambian a saltos (así se lee como un fallo de señal)
      if (s.salto?.length === s.letras.length && t - s.cuando < azar(50, 110)) return;
      s.cuando = t;
      s.salto = Float32Array.from(s.letras, () => azar(-1, 1));
      const x = s.pos[imax * 2], y = s.pos[imax * 2 + 1], f = s.fs;
      // Cada salto suena: un chisporroteo del lado del ratón, más fuerte cuanto más se rasga
      sonido.glitch(max, (r.left + x) / innerWidth);
      const izq = limitar(x - s.R, 0, r.width), der = limitar(r.width - x - s.R, 0, r.width);
      const franja = (alto) => {
        const arriba = limitar(y + azar(-0.7, 0.7) * f - alto / 2, 0, Math.max(0, r.height - alto));
        return `inset(${arriba.toFixed(1)}px ${der.toFixed(1)}px ${Math.max(0, r.height - arriba - alto).toFixed(1)}px ${izq.toFixed(1)}px)`;
      };
      const signo = Math.sign(s.k[imax]) || 1;
      el.style.setProperty('--g1', franja(azar(0.25, 0.8) * f));
      el.style.setProperty('--g2', franja(azar(0.08, 0.22) * f));
      el.style.setProperty('--g1x', `${(signo * max * azar(8, 26)).toFixed(1)}px`);
      el.style.setProperty('--g2x', `${(-signo * max * azar(6, 18)).toFixed(1)}px`);
    },
  });
}
