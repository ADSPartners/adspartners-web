// Las capas de la portada, pintadas en canvas 2D y subidas como texturas:
// - foto:    la imagen de marca a sangre (cover). De su luz salen las curvas de nivel y el tramado de la máquina.
// - titulo:  «adsPartners» en Garamond, en el sitio exacto del h1 del DOM (lo mide del propio DOM).
// - maquina: la anatomía del título (contorno, cajas, líneas guía), código con datos reales y la medida de luz.
// - glifos:  atlas de caracteres mono para el tramado.
// Todo lo que se escribe en la máquina es verdad: sale de los proyectos (proyectos-data.jsx).

export const CREMA = '#E7E2DA';
const ROSA = '#F5CBD7';
const MONO = '"Geist Mono", ui-monospace, monospace';

export function lienzo(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  return c;
}

export function pintarFoto(c, img) {
  const ctx = c.getContext('2d');
  const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  // Un poco de desenfoque: la foto ya es suave y así las curvas de nivel salen sin escalones
  ctx.filter = 'blur(6px)';
  ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
}

// Lee del DOM cada trozo del título: texto, fuente, caja y línea base (el <i> de alto 0 marca la base)
export function medirTitulo(h1, origen) {
  const cs = getComputedStyle(h1);
  return [...h1.querySelectorAll('[data-trozo]')].map((t) => {
    // Caja del texto en sí (en móvil cada trozo es un bloque a todo el ancho)
    const rango = document.createRange(); rango.selectNodeContents(t.firstChild);
    const r = rango.getBoundingClientRect();
    const b = t.querySelector('i').getBoundingClientRect();
    return {
      texto: t.firstChild.textContent.trim(),
      x: r.left - origen.left, base: b.top - origen.top, ancho: r.width,
      fuente: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
      tam: parseFloat(cs.fontSize),
      tracking: cs.letterSpacing,
      familia: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
    };
  });
}

function prepararTexto(ctx, t, dpr) {
  ctx.font = t.fuente.replace(/[\d.]+px/, `${t.tam * dpr}px`);
  if ('letterSpacing' in ctx && t.tracking !== 'normal') ctx.letterSpacing = `${parseFloat(t.tracking) * dpr}px`;
  ctx.textBaseline = 'alphabetic';
}

export function pintarTitulo(c, trozos, dpr) {
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = CREMA;
  for (const t of trozos) { prepararTexto(ctx, t, dpr); ctx.fillText(t.texto, t.x * dpr, t.base * dpr); }
}

export function pintarMaquina(c, trozos, dpr, { foto, movil }) {
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);
  const px = (v) => v * dpr;
  const linea = (x1, y1, x2, y2, color, ancho = 1) => {
    ctx.strokeStyle = color; ctx.lineWidth = px(ancho);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };
  const etiqueta = (txt, x, y, color = 'rgba(231,226,218,.62)', tam = 10.5, alinear = 'left') => {
    ctx.font = `400 ${px(tam)}px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${px(0.4)}px`;
    ctx.fillStyle = color; ctx.textAlign = alinear; ctx.textBaseline = 'alphabetic';
    ctx.fillText(txt, x, y);
    ctx.textAlign = 'left';
  };

  // Anatomía del título: líneas guía a todo el ancho, cajas de cada letra y contorno
  for (const [i, t] of trozos.entries()) {
    prepararTexto(ctx, t, dpr);
    const m = ctx.measureText('x'), mH = ctx.measureText('H'), mp = ctx.measureText('p'), md = ctx.measureText('d');
    const base = px(t.base), x0 = px(t.x);
    const guias = [
      [base, 'línea base', 'rgba(245,203,215,.75)'],
      [base - m.actualBoundingBoxAscent, 'altura x', 'rgba(231,226,218,.28)'],
      [base - mH.actualBoundingBoxAscent, 'mayúsculas', 'rgba(231,226,218,.28)'],
      [base - md.actualBoundingBoxAscent, 'ascendente', 'rgba(231,226,218,.18)'],
      [base + mp.actualBoundingBoxDescent, 'descendente', 'rgba(231,226,218,.18)'],
    ];
    for (const [y, nombre, color] of guias) {
      linea(0, y, W, y, color, 1);
      if (i === 0 || movil) etiqueta(nombre, W - px(movil ? 14 : 24), y - px(5), 'rgba(231,226,218,.5)', 9.5, 'right');
    }
    // Cajas por letra (avance real de cada glifo)
    let x = x0;
    const asc = mH.actualBoundingBoxAscent, desc = mp.actualBoundingBoxDescent;
    for (const ch of t.texto) {
      prepararTexto(ctx, t, dpr);
      const a = ctx.measureText(ch).width;
      ctx.strokeStyle = 'rgba(231,226,218,.14)'; ctx.lineWidth = px(1);
      ctx.strokeRect(x, base - asc, a, asc + desc);
      x += a + (parseFloat(t.tracking) || 0) * dpr;
    }
    // Contorno del propio texto: el «alambre» de la marca
    prepararTexto(ctx, t, dpr);
    ctx.strokeStyle = 'rgba(231,226,218,.9)'; ctx.lineWidth = px(1.1);
    ctx.strokeText(t.texto, x0, base);
    if (i === 0) {
      const tracking = parseFloat(t.tracking) / t.tam * 100;
      etiqueta(`${t.familia} Light · ${Math.round(t.tam)} px · tracking ${tracking.toFixed(1).replace('.', ',')} %`, x0, base - mH.actualBoundingBoxAscent - px(14), 'rgba(231,226,218,.7)');
    }
  }

  // Código con datos reales de los proyectos
  const cx = movil ? px(18) : px(32);
  const cy = movil ? H * 0.43 : H * 0.53;
  const filas = [
    ['// por dentro', '', ''],
    ['factura.pdf', 'leer()', '115 facturas'],
    ['plato', 'margen()', '157 platos'],
    ['tejido.png', 'medir()', 'píxel a píxel'],
    ['scroll', 'hornear()', 'una tarta'],
  ];
  const col = movil ? [0, px(96), px(186)] : [0, px(118), px(224)];
  filas.forEach(([a, b, d], i) => {
    const y = cy + i * px(19);
    if (i === 0) { etiqueta(a, cx, y, 'rgba(231,226,218,.42)', 11); return; }
    etiqueta(a, cx + col[0], y, 'rgba(231,226,218,.8)', 11);
    etiqueta('→ ' + b, cx + col[1], y, ROSA, 11);
    etiqueta(d, cx + col[2], y, 'rgba(231,226,218,.55)', 11);
  });

  // Medida de luz sobre la foto: una cruz donde más brilla, con su valor real
  if (foto) {
    const fctx = foto.getContext('2d', { willReadFrequently: true });
    const fx = Math.round(foto.width * 0.5), fy = Math.round(foto.height * (movil ? 0.5 : 0.58));
    const d = fctx.getImageData(fx, fy, 1, 1).data;
    const luz = (0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]) / 255;
    const X = (fx / foto.width) * W, Y = (fy / foto.height) * H;
    linea(X - px(9), Y, X + px(9), Y, 'rgba(231,226,218,.8)');
    linea(X, Y - px(9), X, Y + px(9), 'rgba(231,226,218,.8)');
    etiqueta(`luz ${luz.toFixed(2).replace('.', ',')} · x 0,50 y ${(fy / foto.height).toFixed(2).replace('.', ',')}`, X + px(14), Y - px(6), 'rgba(231,226,218,.7)');
  }
}

export function pintarGlifos(caracteres, celda = 48) {
  const c = lienzo(celda * caracteres.length, celda);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `400 ${celda * 0.78}px ${MONO}`;
  [...caracteres].forEach((ch, i) => ctx.fillText(ch, i * celda + celda / 2, celda * 0.54));
  return c;
}
