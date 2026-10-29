// Las capas de la portada, pintadas en canvas 2D y subidas como texturas:
// - foto:    la imagen de marca a sangre (cover). De su luz salen las curvas de nivel y el tramado de la máquina.
// - titulo:  «adsPartners» en Garamond, en el sitio exacto del h1 del DOM (lo mide del propio DOM).
// - maquina: la anatomía del título (contorno, cajas, líneas guía), el código que lo pinta y el degradado medido.
//            En el umbral («ads» en el centro), además el código de la linterna y una ficha con los valores del canvas.
// - glifos:  atlas de caracteres mono para el tramado.
// Todo lo que se escribe en la máquina construye lo que se ve: valores medidos del DOM y de la foto, y el shader real.

export const CREMA = '#E7E2DA';
const ROSA = '#F5CBD7';
const MONO = '"Geist Mono", ui-monospace, monospace';

export function lienzo(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  return c;
}

export function pintarFoto(c, img) {
  const ctx = c.getContext('2d', { willReadFrequently: true });
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

export function pintarMaquina(c, trozos, dpr, { foto, movil, variante = 'portada', ficha = null }) {
  const enUmbral = variante === 'umbral';
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

  // El código que pinta lo que se ve. Primero, el CSS real del título, con los valores medidos del DOM
  const bloque = (lineas, x, y, tam = 11) => {
    lineas.forEach((ln, i) => {
      let cx = x;
      const yy = y + i * px(tam * 1.62);
      // Resaltado mínimo: comentarios apagados, funciones y propiedades en rosa, el resto en crema
      for (const [, com, pal, resto] of ln.matchAll(/(\/\/.*$)|([a-zA-Z_][\w-]*(?=\s*[(:]))|([^a-zA-Z_/]+|[a-zA-Z_][\w-]*|\/)/g)) {
        const trozo = com || pal || resto;
        const color = com ? 'rgba(231,226,218,.38)' : pal ? 'rgba(245,203,215,.92)' : 'rgba(231,226,218,.78)';
        ctx.font = `400 ${px(tam)}px ${MONO}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
        ctx.fillStyle = color; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillText(trozo, cx, yy);
        cx += ctx.measureText(trozo).width;
      }
    });
  };
  const t0 = trozos[0];
  if (t0) {
    const tracking = (parseFloat(t0.tracking) / t0.tam).toFixed(3).replace(/0+$/, '');
    const css = [
      enUmbral ? '// así se escribe el «ads» del centro' : '// así se escribe el título',
      enUmbral ? '.umbral__ads {' : 'h1.portada__titulo {',
      `  font-family: "${t0.familia}";`,
      '  font-weight: 300;',
      `  font-size: ${Math.round(t0.tam)}px;`,
      `  letter-spacing: ${tracking}em;`,
      '  color: #E7E2DA;',
      '}',
    ];
    if (enUmbral) bloque(css, movil ? px(18) : px(32), movil ? H * 0.66 : H * 0.74);
    else bloque(css, movil ? px(18) : px(32), movil ? H * 0.35 : H * 0.49);
  }
  if (enUmbral) {
    // La linterna: las líneas del shader que deciden dónde se ve la marca
    if (!movil) {
      bloque([
        '// la linterna: la marca solo donde hay luz',
        'float halo = uHalo * (1.0 - smoothstep(0.0, 0.21, d));',
        'float luz = max(tinte * 1.3, halo) * uLinterna;',
        'float mascara = 1.0 - smoothstep(0.08, 0.62, luz);',
        'vec3 col = mix(marca, maquina, mascara);',
      ], W * 0.6, H * 0.15);
    }
    // Ficha: con qué se está pintando esto, medido en este navegador
    if (ficha) {
      const n = ficha.nivel;
      const coma = (v) => String(v).replace('.', ',');
      bloque([
        '// la máquina que pinta esto',
        `canvas  ${ficha.canvas[0]} × ${ficha.canvas[1]} px · dpr ${coma(ficha.dpr)}`,
        `fluido  ${n.sim}² · ${n.iteraciones} iteraciones · curl ${n.curl}`,
        `tinte   ${n.tinte}² · disipa ${coma(n.disipTinte)}`,
        `glifos  "${ficha.glifos}"`,
      ], movil ? px(18) : px(32), movil ? H * 0.14 : H * 0.15, movil ? 9.5 : 11);
    }
  } else if (!movil) {
    // Las líneas del shader que dibujan estas curvas de nivel a partir de la luz de la foto
    bloque([
      '// curvas de nivel: cada línea, un mismo valor de luz',
      'float l = luma(texture(tFoto, uv).rgb);',
      'float b = l * 16.0;',
      'float iso = 1.0 - smoothstep(0.0, fwidth(b) * 1.4,',
      '                  abs(fract(b + 0.5) - 0.5));',
    ], W * 0.34, H * 0.15);
  }

  // Regla del degradado: el color real de la portada en seis puntos, de arriba abajo
  if (foto) {
    const fctx = foto.getContext('2d', { willReadFrequently: true });
    const rx = enUmbral ? (movil ? W * 0.82 : W * 0.9) : (movil ? W * 0.86 : W * 0.64);
    const y0 = enUmbral ? (movil ? H * 0.68 : H * 0.6) : (movil ? H * 0.34 : H * 0.12);
    const y1 = enUmbral ? (movil ? H * 0.86 : H * 0.88) : (movil ? H * 0.6 : H * 0.62);
    linea(rx, y0, rx, y1, 'rgba(231,226,218,.35)');
    etiqueta('degradado', rx + px(10), y0 - px(10), 'rgba(231,226,218,.45)');
    for (let i = 0; i < 6; i++) {
      const y = y0 + (y1 - y0) * (i / 5);
      const d = fctx.getImageData(Math.round((rx / W) * foto.width), Math.round((y / H) * foto.height), 1, 1).data;
      // El mismo tratamiento que le da el shader a la foto (clave de noche)
      const c = [0, 1, 2].map((k) => Math.round(Math.min(1, Math.pow(d[k] / 255, 1.3) * 0.68 * [1.03, 0.99, 0.94][k]) * 255));
      const hexa = '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      linea(rx - px(5), y, rx + px(5), y, 'rgba(231,226,218,.6)');
      ctx.fillStyle = hexa; ctx.fillRect(rx + px(10), y - px(5), px(10), px(10));
      ctx.strokeStyle = 'rgba(231,226,218,.4)'; ctx.lineWidth = px(1); ctx.strokeRect(rx + px(10), y - px(5), px(10), px(10));
      etiqueta(hexa, rx + px(26), y + px(4), 'rgba(231,226,218,.72)');
    }

    // Medida de luz: una cruz en el punto más luminoso del horizonte, con su valor real
    const fx = Math.round(foto.width * 0.5), fy = Math.round(foto.height * (movil ? 0.5 : 0.58));
    const d = fctx.getImageData(fx, fy, 1, 1).data;
    const luz = (0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]) / 255;
    const X = (fx / foto.width) * W, Y = (fy / foto.height) * H;
    linea(X - px(9), Y, X + px(9), Y, 'rgba(231,226,218,.8)');
    linea(X, Y - px(9), X, Y + px(9), 'rgba(231,226,218,.8)');
    etiqueta(`luz ${luz.toFixed(2).replace('.', ',')}`, X + px(14), Y - px(6), 'rgba(231,226,218,.7)');
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
