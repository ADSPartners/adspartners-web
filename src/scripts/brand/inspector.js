// El inspector, con la mesa quieta (como en la home, pero en DOM): cada 2,8 s una caja se abre como una persiana sobre
// algo concreto (una letra del título, un color, el logo, una letra de la muestra, el post o el botón de la web) y una
// etiqueta dice lo que es, con valores medidos del DOM. Una caja se abre mientras la anterior se cierra; en cuanto haces
// algo, se cierran todas.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';
import { LOGO } from '../../data/brand.js';
import { deltaE00, cssAHex, coma } from './color.js';

const QUIETO = 2500, RITMO = 2800;
const azar = (lista) => lista[Math.floor(Math.random() * lista.length)];

export function montarInspector(mesa, ctx) {
  const capa = mesa.querySelector('[data-mesa-insp]');
  const cajas = [0, 1].map(() => {
    const caja = document.createElement('div');
    caja.className = 'mi__caja';
    const etq = document.createElement('span');
    etq.className = 'insp mi__etq';
    capa.append(caja, etq);
    return { caja, etq, t: null, abierta: false };
  });

  const estilo = (el) => getComputedStyle(el);
  const familia = (el) => estilo(el).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const px = (v) => Math.round(parseFloat(v));
  const relativa = (r) => { const o = mesa.getBoundingClientRect(); return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }; };
  const margen = (r, m) => ({ x: r.x - m, y: r.y - m, w: r.w + m * 2, h: r.h + m * 2 });
  const enPantalla = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 60 && r.top < innerHeight - 40 && r.width > 0; };

  const OBJETIVOS = {
    titulo() {
      const h = mesa.querySelector('.mesa__t');
      const nodo = h?.firstChild;
      if (!nodo?.textContent.trim()) return null;
      const txt = nodo.textContent;
      let i;
      do { i = Math.floor(Math.random() * txt.length); } while (!txt[i].trim());
      const rango = document.createRange(); rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);
      const r = relativa(rango.getBoundingClientRect());
      return { el: h, r: { x: r.x - 5, y: r.y + r.h * 0.1, w: r.w + 10, h: r.h * 0.84 }, txt: `«${txt[i]}» · ${familia(h)} ${estilo(h).fontWeight} · ${px(estilo(h).fontSize)} px` };
    },
    color() {
      const m = azar([...mesa.querySelectorAll('[data-color]')]);
      const hex = cssAHex(estilo(m).backgroundColor);
      return { el: m, r: margen(relativa(m.getBoundingClientRect()), 4), txt: `--${m.dataset.color} · ${hex} · ΔE00 ${coma(deltaE00(hex, m.dataset.hexBueno))}` };
    },
    logo() {
      const bl = mesa.querySelector('[data-bl]');
      return { el: bl, r: margen(relativa(bl.getBoundingClientRect()), 10), txt: `svg#logotipo · ${bl.dataset.trazados} trazados · ${bl.dataset.nodos} nodos · ${LOGO.proporcion.toFixed(2).replace('.', ',')}:1` };
    },
    letra() {
      const aa = azar([...mesa.querySelectorAll('.letra__aa')]);
      return { el: aa, r: margen(relativa(aa.getBoundingClientRect()), 4), txt: `«Aa» · ${familia(aa)} ${estilo(aa).fontWeight} · ${px(estilo(aa).fontSize)} px` };
    },
    post() {
      const p = mesa.querySelector('.post__claim');
      return { el: p, r: margen(relativa(p.getBoundingClientRect()), 6), txt: `p.titular · ${familia(p)} · ${px(estilo(p).fontSize)}/${px(estilo(p).lineHeight)} px · ${p.textContent.trim().split(/\s+/).length} palabras` };
    },
    boton() {
      const b = mesa.querySelector('.miniweb__boton');
      return { el: b, r: margen(relativa(b.getBoundingClientRect()), 5), txt: `a.boton · ${cssAHex(estilo(b).backgroundColor)} · ${familia(b)} ${px(estilo(b).fontSize)} px` };
    },
  };
  let tipos = [];
  function elegir() {
    for (let k = 0; k < 8; k++) {
      if (!tipos.length) tipos = Object.keys(OBJETIVOS).sort(() => Math.random() - 0.5);
      const o = OBJETIVOS[tipos.pop()]();
      if (o && o.r.w > 4 && o.r.h > 4 && enPantalla(o.el)) return o;
    }
    return null;
  }

  function abrir(c, o) {
    c.abierta = true;
    gsap.set(c.caja, { x: o.r.x, y: o.r.y, width: o.r.w, height: o.r.h });
    gsap.to(c.caja, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.out', overwrite: true });
    c.etq.textContent = '';
    c.etq.classList.add('on');
    const W = mesa.offsetWidth;
    const y = o.r.y > 90 ? o.r.y - 24 : o.r.y + o.r.h + 6;
    clearTimeout(c.t);
    let n = 0;
    const escribir = () => {
      c.etq.textContent = o.txt.slice(0, ++n);
      c.etq.style.transform = `translate(${Math.max(8, Math.min(o.r.x, W - 8 - c.etq.offsetWidth)).toFixed(0)}px, ${y.toFixed(0)}px)`;
      if (n < o.txt.length) c.t = setTimeout(escribir, 14);
    };
    escribir();
    sonido.tic(0.45);
  }
  function cerrar(c, rapido) {
    if (!c.abierta) return;
    c.abierta = false;
    clearTimeout(c.t);
    c.etq.classList.remove('on');
    gsap.to(c.caja, { clipPath: 'inset(50% 0% 50% 0%)', duration: rapido ? 0.18 : 0.45, ease: 'power3.in', overwrite: true });
  }

  let n = 0, siguiente = 0;
  setInterval(() => {
    const ahora = performance.now();
    if (ctx.ocupado() || ctx.quieto() < QUIETO || document.hidden) {
      cajas.forEach((c) => cerrar(c, true));
      siguiente = 0;
      return;
    }
    if (ahora < siguiente) return;
    const c = cajas[n++ % cajas.length];
    cajas.forEach((otra) => { if (otra !== c) cerrar(otra); });
    const o = elegir();
    if (o) abrir(c, o);
    siguiente = ahora + RITMO;
  }, 150);
}
