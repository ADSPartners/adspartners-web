// paleta.css. Agarras un color y lo arrastras: hacia los lados cambia el tono y hacia arriba o abajo, la luz (en OKLCH,
// como en las herramientas de diseño). Es la variable de verdad, así que toda la página cambia contigo: el fondo, el
// post, la web. La etiqueta mide cuánto te has ido del color bueno (ΔE CIEDE2000, calculado aquí). Al soltar se abre el
// código de la paleta, el valor roto se reescribe y una línea cruza la mesa entera dejándolo todo en su sitio.
import * as sonido from '../sonido.js';
import { PALETA, CODIGO } from '../../data/brand.js';

const UMBRAL = 2.3;   // ΔE00 a partir del cual el ojo ya ve otro color: cuenta como roto

// --- Color: sRGB, OKLCH y CIE Lab ------------------------------------------------------------------------------
const aLineal = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const aSrgb = (c) => { c = Math.min(1, Math.max(0, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const hexARgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const rgbAHex = (rgb) => `#${rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
export const cssAHex = (css) => { const m = css.match(/[\d.]+/g); return m ? rgbAHex(m.slice(0, 3).map((n) => Number(n) / 255)) : css; };

function rgbAOklch(rgb) {
  const [R, G, B] = rgb.map(aLineal);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return [L, Math.hypot(a, b), Math.atan2(b, a)];
}
// A sRGB lineal (puede salirse de 0..1: fuera de gama)
function oklchALineal([L, C, h]) {
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
function rgbALab(rgb) {
  const [R, G, B] = rgb.map(aLineal);
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f((0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047);
  const fy = f(0.2126729 * R + 0.7151522 * G + 0.0721750 * B);
  const fz = f((0.0193339 * R + 0.1191920 * G + 0.9503041 * B) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
// CIEDE2000 (Sharma, Wu y Dalal, 2005)
export function deltaE00(hex1, hex2) {
  const [L1, a1, b1] = rgbALab(hexARgb(hex1)), [L2, a2, b2] = rgbALab(hexARgb(hex2));
  const R = Math.PI / 180;
  const C7 = (c) => c ** 7 / (c ** 7 + 25 ** 7);
  const G = 0.5 * (1 - Math.sqrt(C7((Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
  const C1 = Math.hypot(a1p, b1), C2 = Math.hypot(a2p, b2);
  const ang = (b, a) => (b === 0 && a === 0 ? 0 : (Math.atan2(b, a) / R + 360) % 360);
  const h1 = ang(b1, a1p), h2 = ang(b2, a2p);
  let dh = 0;
  if (C1 * C2) { dh = h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(C1 * C2) * Math.sin((dh / 2) * R);
  const Lm = (L1 + L2) / 2, Cm = (C1 + C2) / 2;
  let hm = h1 + h2;
  if (C1 * C2) { if (Math.abs(h1 - h2) > 180) hm += hm < 360 ? 360 : -360; hm /= 2; }
  const T = 1 - 0.17 * Math.cos((hm - 30) * R) + 0.24 * Math.cos(2 * hm * R) + 0.32 * Math.cos((3 * hm + 6) * R) - 0.2 * Math.cos((4 * hm - 63) * R);
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2), Sc = 1 + 0.045 * Cm, Sh = 1 + 0.015 * Cm * T;
  const Rt = -Math.sin(2 * 30 * Math.exp(-(((hm - 275) / 25) ** 2)) * R) * 2 * Math.sqrt(C7(Cm));
  const x = (L2 - L1) / Sl, y = (C2 - C1) / Sc, z = dH / Sh;
  return Math.sqrt(x * x + y * y + z * z + Rt * y * z);
}
export const coma = (n) => n.toFixed(1).replace('.', ',');

// --- La paleta --------------------------------------------------------------------------------------------------
export function montarColor(pz, ctx) {
  const { reducido, cursor, intento, romper, comentario, restaurar, raiz, mesa } = ctx;
  const dentro = ctx.dentro('paleta');
  const etq = pz.querySelector('[data-paleta-etq]');
  const muestras = [...pz.querySelectorAll('[data-color]')];
  let arrastre = null, nivel = 0;
  const pendientes = new Set();   // colores que se quedaron rotos (otra rotura cortó su arreglo)

  const hexDe = (m) => m.dataset.hexAhora || m.dataset.hexBueno;
  function devolver(m) {
    raiz.style.removeProperty(`--${m.dataset.color}`);
    delete m.dataset.hexAhora;
    m.querySelector('[data-hex]').textContent = m.dataset.hexBueno;
    m.classList.remove('claro', 'oscuro');
    romper(m.dataset.color, false);
    pendientes.delete(m);
  }

  function ponerEtq(m, hex, de) {
    etq.textContent = `--${m.dataset.color}: ${hex} · ΔE00 ${coma(de)} ${de < UMBRAL ? '=' : '≠'} ${m.dataset.hexBueno}`;
    const r = m.getBoundingClientRect(), caja = pz.querySelector('.pz__marco').getBoundingClientRect();
    const x = Math.min(r.left - caja.left, innerWidth - 12 - caja.left - etq.offsetWidth);
    etq.style.transform = `translateX(${Math.max(12 - caja.left, x).toFixed(1)}px)`;
  }

  function empezar(ev, m) {
    if (ev.button > 0 || arrastre || mesa.classList.contains('barriendo')) return;
    ev.preventDefault();
    dentro.cancelar();
    pendientes.forEach((otra) => { if (otra !== m) devolver(otra); });
    const hex = hexDe(m);
    arrastre = { m, id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, lch: rgbAOklch(hexARgb(hex)), hex, de: deltaE00(hex, m.dataset.hexBueno) };
    try { m.setPointerCapture(ev.pointerId); } catch (err) { /* sin captura */ }
    m.classList.add('tirando');
    pz.classList.add('tirando');
    ctx.tirando(true);
    cursor.pulsando(true);
    cursor.decir('Arrástralo');
    nivel = 0;
    etq.classList.add('on');
    ponerEtq(m, hex, arrastre.de);
    sonido.tic(0.5);
  }

  function mover(ev) {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    const a = arrastre, m = a.m;
    const dx = ev.clientX - a.x0, dy = ev.clientY - a.y0;
    const [L0, C0, h0] = a.lch;
    const L = Math.min(0.97, Math.max(0.1, L0 - dy * 0.0017));
    let C = Math.min(0.3, C0 + Math.min(0.19, Math.hypot(dx, dy) * 0.0008));
    const h = h0 + dx * 0.012;
    // Si se sale de la gama del sRGB, se le baja el croma hasta que entra
    let lin = oklchALineal([L, C, h]);
    for (let k = 0; k < 14 && lin.some((c) => c < -0.0005 || c > 1.0005); k++) { C *= 0.86; lin = oklchALineal([L, C, h]); }
    a.hex = rgbAHex(lin.map(aSrgb));
    a.de = deltaE00(a.hex, m.dataset.hexBueno);
    raiz.style.setProperty(`--${m.dataset.color}`, a.hex);
    m.dataset.hexAhora = a.hex;
    m.querySelector('[data-hex]').textContent = a.hex;
    m.classList.toggle('claro', L > 0.64);
    m.classList.toggle('oscuro', L <= 0.64);
    romper(m.dataset.color, a.de >= UMBRAL);
    ponerEtq(m, a.hex, a.de);
    const escalon = Math.floor(Math.min(1, a.de / 50) * 5);
    if (escalon > nivel) sonido.empuje(escalon / 5);
    nivel = escalon;
  }

  async function soltar(ev) {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    const { m, hex, de } = arrastre;
    arrastre = null;
    m.classList.remove('tirando');
    pz.classList.remove('tirando');
    ctx.tirando(false);
    cursor.pulsando(false);
    cursor.decir('Otra vez');
    setTimeout(() => etq.classList.remove('on'), 300);
    if (de < UMBRAL) { devolver(m); return; }

    // Por dentro: la paleta en código, con tu color y lo que se aleja del bueno; la regla, encima
    intento();
    pendientes.add(m);
    const id = m.dataset.color;
    const n = PALETA.findIndex((c) => c.id === id) + 1;
    const lineas = CODIGO.paleta({ [id]: hex });
    lineas[n] += ` /* ΔE00 ${coma(de)} */`;
    const hecho = await dentro.porDentro({
      lineas,
      comentario: { en: n, texto: `/* ${comentario('color')} */` },
      cambios: [{ l: n, i: lineas[n].indexOf('#'), j: lineas[n].length, por: `${m.dataset.hexBueno};` }],
      volver: false,
    });
    if (!hecho) return;
    // Y la línea cruza la mesa: el color bueno, en todas partes
    await restaurar([`--${id}`]);
    devolver(m);
  }

  muestras.forEach((m) => m.addEventListener('pointerdown', (ev) => empezar(ev, m)));
  addEventListener('pointermove', mover, { passive: true });
  addEventListener('pointerup', soltar);
  addEventListener('pointercancel', soltar);
}
