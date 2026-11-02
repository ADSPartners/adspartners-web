// El 404 roto de la página de erratas (pages/404.astro): el número en Garamond, pintado en un canvas y siempre a punto
// de fallar. Por dentro, detrás, la petición que ha fallado escrita en código (la capa tech), que asoma por las
// grietas. El fallo tiene tres fuentes que se suman:
//   - en reposo, casi nada: el rojo y el azul apenas separados y, de vez en cuando, una franja que salta;
//   - a ratos, un apagón: franjas rasgadas, bloques corruptos copiados de otro sitio, trozos pixelados y rayas de
//     señal (y suena: sonido.glitch);
//   - el ratón, solo en la zona por la que pasa: cuanto más deprisa, más se rasga esa franja.
// Todo cambia a saltos (cada 50-110 ms), no en cada fotograma: así se lee como un fallo de señal y no como un vaivén.
// Para no gastar memoria, el 404 se pinta una vez en tres lienzos del tamaño de su caja (rojo, azul y crema) y cada
// fotograma solo se copian, movidos.
import * as sonido from './sonido.js';

const ROJO = 'rgb(255, 64, 120)', AZUL = 'rgb(64, 196, 255)', CREMA = '#E7E2DA';
const azar = (a, b) => a + Math.random() * (b - a);
const entero = (a, b) => Math.floor(azar(a, b + 1));

export function crearRoto({ lienzo, hueco, zona, reducido, movil }) {
  const ctx = lienzo.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let caja = { x: 0, y: 0, w: 0, h: 0 };   // dónde va el 404 (en px de la zona)
  const capas = { rojo: document.createElement('canvas'), azul: document.createElement('canvas'), crema: document.createElement('canvas') };
  let codigo = [];                          // líneas de la capa tech: { t, x, y, a }
  const pixel = document.createElement('canvas');
  const pctx = pixel.getContext('2d');

  // --- Medir y pintar el 404 en sus tres lienzos ------------------------------------------------------------------
  const margen = () => Math.round(caja.h * 0.18);
  function medir() {
    const z = zona.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, movil ? 1.5 : 2);
    W = Math.round(z.width); H = Math.round(z.height);
    lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
    lienzo.style.width = `${W}px`; lienzo.style.height = `${H}px`;
    const r = hueco.getBoundingClientRect();
    caja = { x: r.left - z.left, y: r.top - z.top, w: r.width, h: r.height };
    const cs = getComputedStyle(hueco);
    const fuente = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const pad = margen();
    Object.entries(capas).forEach(([nombre, c]) => {
      c.width = Math.round((caja.w + pad * 2) * dpr);
      c.height = Math.round((caja.h + pad * 2) * dpr);
      const x = c.getContext('2d');
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.clearRect(0, 0, c.width, c.height);
      x.font = fuente;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillStyle = nombre === 'rojo' ? ROJO : nombre === 'azul' ? AZUL : CREMA;
      if ('letterSpacing' in x) x.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      // El centro óptico de las cifras de Garamond cae un poco por debajo del centro de la caja de línea
      x.fillText(hueco.textContent.trim(), pad + caja.w / 2, pad + caja.h * 0.54);
    });
  }

  // --- El estado del fallo -------------------------------------------------------------------------------------------
  let reposo = reducido ? 0 : 0.05;
  let apagon = 0, raton = 0, ratonY = 0, ratonX = 0;
  let franjas = [], bloques = [], rayas = [], pixelados = [];
  let cambio = 0, proximoApagon = performance.now() + azar(2200, 4200);

  function sortear(I) {
    const { x, y, w, h } = caja;
    const total = I * 1.2;
    franjas = [];
    // Las del apagón, por todo el 404 (y alguna por la capa de código)
    const n = Math.round(total * 7 + (Math.random() < reposo * 3 ? 1 : 0));
    for (let i = 0; i < n; i++) {
      const alto = azar(0.012, 0.11) * h;
      franjas.push({ y: azar(y - h * 0.05, y + h) - alto / 2, h: alto, dx: azar(-1, 1) * (8 + total * 70), todo: Math.random() < 0.3 });
    }
    // La del ratón, en su zona
    if (raton > 0.05) {
      const alto = azar(0.04, 0.16) * h;
      franjas.push({ y: ratonY - alto / 2 + azar(-0.06, 0.06) * h, h: alto, dx: (Math.random() < 0.5 ? -1 : 1) * raton * azar(18, 60) });
      if (raton > 0.4) franjas.push({ y: ratonY + azar(-0.15, 0.15) * h, h: azar(0.01, 0.03) * h, dx: azar(-1, 1) * raton * 40 });
    }
    // Bloques corruptos: un trozo copiado de otro sitio, en una rejilla de 8 px (el macrobloque de un vídeo roto)
    bloques = [];
    const nb = Math.round(I * 9);
    for (let i = 0; i < nb; i++) {
      const s = 8 * entero(2, 7);
      const bx = Math.round(azar(x, x + w - s) / 8) * 8, by = Math.round(azar(y, y + h - s) / 8) * 8;
      bloques.push({ sx: bx + entero(-6, 6) * 8, sy: by + entero(-3, 3) * 8, x: bx, y: by, w: s * entero(1, 3), h: s, tinte: Math.random() < 0.35 ? (Math.random() < 0.5 ? ROJO : AZUL) : null });
    }
    if (raton > 0.3) {
      for (let i = 0; i < 3; i++) {
        const s = 8 * entero(2, 4);
        const bx = Math.round((ratonX + azar(-80, 80)) / 8) * 8, by = Math.round((ratonY + azar(-40, 40)) / 8) * 8;
        bloques.push({ sx: bx + entero(-4, 4) * 8, sy: by, x: bx, y: by, w: s * 2, h: s, tinte: null });
      }
    }
    // Trozos pixelados y rayas de señal, solo en los apagones fuertes
    pixelados = [];
    const np = I > 0.35 ? entero(1, 3) : 0;
    for (let i = 0; i < np; i++) pixelados.push({ x: azar(x, x + w * 0.8), y: azar(y, y + h * 0.8), w: azar(60, 220), h: azar(20, 90), b: entero(6, 14) });
    rayas = [];
    const nr = I > 0.25 ? entero(1, 4) : 0;
    for (let i = 0; i < nr; i++) rayas.push({ y: azar(0, H), h: azar(1, 3), c: Math.random() < 0.5 ? ROJO : AZUL, a: azar(0.25, 0.7), x: azar(-0.2, 0.6) * W, w: azar(0.2, 0.9) * W });
  }

  // --- Pintar ---------------------------------------------------------------------------------------------------------
  function pintarCodigo(dx = 0, a = 1, tinte = null) {
    ctx.font = `400 ${movil ? 10 : 11}px "Geist Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    codigo.forEach((l) => {
      ctx.globalAlpha = l.a * a;
      ctx.fillStyle = tinte || (l.rosa ? '#F5CBD7' : CREMA);
      ctx.fillText(l.t, l.x + dx, l.y);
    });
    ctx.globalAlpha = 1;
  }
  function pintar404(dx, separa, a = 1) {
    const pad = margen(), ox = caja.x - pad + dx, oy = caja.y - pad, cw = capas.crema.width / dpr, ch = capas.crema.height / dpr;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, 0.35 + separa / 10) * a;
    ctx.drawImage(capas.rojo, ox - separa, oy, cw, ch);
    ctx.drawImage(capas.azul, ox + separa, oy, cw, ch);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    ctx.drawImage(capas.crema, ox, oy, cw, ch);
    ctx.globalAlpha = 1;
  }

  let ultimo = performance.now();
  function fotograma(t) {
    const dt = Math.min(0.05, (t - ultimo) / 1000);
    ultimo = t;
    apagon *= Math.exp(-dt * 5.5);
    raton *= Math.exp(-dt * 7);
    if (!reducido && t > proximoApagon) {
      golpe(azar(0.45, 0.9));
      proximoApagon = t + azar(2600, 5600);
    }
    const I = Math.min(1.6, reposo + apagon + raton * 0.6);
    if (t - cambio > azar(50, 110)) {
      cambio = t;
      sortear(I);
      if (I > 0.22) sonido.glitch(Math.min(1, I), (caja.x + caja.w / 2) / Math.max(1, W));
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    pintarCodigo(0, 1);
    const separa = reducido ? 2 : 1.4 + I * 13;
    pintar404(0, separa);

    // Las franjas: se borra la franja y se vuelve a pintar movida (el código de debajo también, tintado)
    franjas.forEach((f) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, f.y, W, f.h);
      ctx.clip();
      ctx.clearRect(0, f.y, W, f.h);
      pintarCodigo(f.dx * 0.6, 1.6, f.todo ? AZUL : null);
      pintar404(f.dx, separa * 1.8);
      ctx.restore();
    });
    // Los bloques: un trozo del propio lienzo, copiado de otro sitio
    bloques.forEach((b) => {
      ctx.drawImage(lienzo, b.sx * dpr, b.sy * dpr, b.w * dpr, b.h * dpr, b.x, b.y, b.w, b.h);
      // El tinte, solo sobre lo pintado (en lo vacío saldría un rectángulo de color macizo)
      if (b.tinte) {
        ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = 0.6; ctx.fillStyle = b.tinte; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      }
    });
    // Los pixelados: se encoge el trozo y se vuelve a estirar sin suavizar
    pixelados.forEach((p) => {
      const pw = Math.max(1, Math.round(p.w / p.b)), ph = Math.max(1, Math.round(p.h / p.b));
      pixel.width = pw; pixel.height = ph;
      pctx.imageSmoothingEnabled = true;
      pctx.drawImage(lienzo, p.x * dpr, p.y * dpr, p.w * dpr, p.h * dpr, 0, 0, pw, ph);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pixel, 0, 0, pw, ph, p.x, p.y, p.w, p.h);
      ctx.imageSmoothingEnabled = true;
    });
    rayas.forEach((r) => { ctx.globalAlpha = r.a; ctx.fillStyle = r.c; ctx.fillRect(r.x, r.y, r.w, r.h); });
    ctx.globalAlpha = 1;
    if (!reducido) requestAnimationFrame(fotograma);
  }

  // Un apagón (de fuera: al llegar, al hacer clic, al reparar cada letra)
  function golpe(fuerza = 1) {
    apagon = Math.max(apagon, fuerza);
    cambio = 0;
  }

  // El ratón: solo cuenta cerca del 404, y cuanto más deprisa, más rasga su franja
  let ant = null;
  if (!reducido) {
    zona.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const z = zona.getBoundingClientRect();
      const x = e.clientX - z.left, y = e.clientY - z.top, t = performance.now();
      const dentro = x > caja.x - 60 && x < caja.x + caja.w + 60 && y > caja.y - 40 && y < caja.y + caja.h + 40;
      if (ant && dentro) {
        const v = Math.hypot(x - ant.x, y - ant.y) / Math.max(8, t - ant.t);   // px/ms
        raton = Math.max(raton, Math.min(1, v / 2.2));
        ratonX = x; ratonY = y;
      }
      ant = { x, y, t };
    });
  }

  medir();
  if (reducido) { sortear(0); fotograma(performance.now()); }
  else requestAnimationFrame(fotograma);

  return {
    golpe,
    medir: () => { medir(); if (reducido) fotograma(performance.now()); },
    codigo: (lineas) => { codigo = lineas; if (reducido) fotograma(performance.now()); },
    caja: () => caja,
    tamano: () => ({ W, H }),
  };
}
