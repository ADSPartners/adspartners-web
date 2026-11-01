// La web, en código. Al abrir el menú, lo que tenías en pantalla pasa a ser el código que lo construye, y debajo hay
// otras dos capas antes de llegar a la placa (menu/placa.js). Todo sale de la página de verdad:
// - capa 1 · lo que ves: cada texto, su etiqueta HTML con su texto, en su misma caja (en los titulares, también la
//   fuente y el tamaño medidos); cada imagen, su <img> o su fondo CSS con sus medidas y lo que pesó al cargar, y su luz
//   pasada a caracteres. De fondo, el HTML de la sección que estabas viendo.
// - capa 2 · el código que lo pinta: dos ficheros reales de la web, el shader de la portada y este mismo menú.
// - capa 3 · lo que entiende la máquina: los bytes del shader de la capa 2 en volcado hexadecimal y, aparte, las
//   mismas filas en pistas (un tramo por byte, más largo cuanto mayor es), para que al acercarte se estiren hasta ser
//   el cableado de la placa.
import { lienzo } from '../gl/capas.js';
import portadaFuente from '../gl/portada.js?raw';
import placaFuente from './placa.js?raw';

const MONO = '"Geist Mono", ui-monospace, monospace';
const crema = (a) => `rgba(231,226,218,${a})`;
const rosa = (a) => `rgba(245,203,215,${a})`;
const RAMPA = ' .·:-=+*#%@';
const BLOQUE = 'h1,h2,h3,h4,h5,h6,p,li,a,button,label,figcaption,blockquote,dt,dd,td,th,legend,summary';
const EN_LINEA = new Set(['SPAN', 'EM', 'I', 'B', 'STRONG', 'SMALL', 'SUP', 'SUB', 'BR', 'MARK', 'ABBR', 'TIME']);
const corta = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const limpio = (s) => s.replace(/\s+/g, ' ').trim();

// Si se ve de verdad: ni oculto ni casi transparente (la opacidad de sus padres también cuenta, como en el túnel de logos)
function crearSeVe(main) {
  const opacidades = new Map();
  const de = (p) => { let v = opacidades.get(p); if (v === undefined) { v = parseFloat(getComputedStyle(p).opacity); opacidades.set(p, v); } return v; };
  return (el) => {
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    let o = 1;
    for (let p = el; p && p !== main.parentElement && o >= 0.2; p = p.parentElement) o *= de(p);
    return o >= 0.2;
  };
}
const enPantalla = (r, W, H) => r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;

// Parte un texto en líneas de n caracteres como mucho, por palabras (las que no caben, a trozos)
function partir(texto, n) {
  const lineas = [];
  let ln = '';
  for (let p of texto.split(' ')) {
    while (p.length > n) { if (ln) { lineas.push(ln); ln = ''; } lineas.push(p.slice(0, n)); p = p.slice(n); }
    if (!ln) ln = p;
    else if (ln.length + 1 + p.length <= n) ln += ` ${p}`;
    else { lineas.push(ln); ln = p; }
  }
  if (ln) lineas.push(ln);
  return lineas;
}

// Una línea de código con el resaltado de la casa: etiquetas y palabras clave en rosa, comentarios apagados
// (los trozos seguidos del mismo color van en una sola llamada)
const TROZOS = /(\/\/.*$|\/\*.*?\*\/)|(<\/?[\w-]+|\/?>|\b(?:const|let|function|return|import|export|float|vec2|vec3|vec4|uniform|if|else|for|new)\b)|([^</\s]+\s*|\s+|[</])/g;
function escribir(ctx, ln, x, y, { tag = 0.9, txt = 0.86, com = 0.42 } = {}) {
  let cx = x, color = null, run = '';
  const soltar = () => { if (!run) return; ctx.fillStyle = color; ctx.fillText(run, cx, y); cx += ctx.measureText(run).width; run = ''; };
  for (const [, comentario, etiqueta, resto] of ln.matchAll(TROZOS)) {
    const c = comentario ? crema(com) : etiqueta ? rosa(tag) : crema(txt);
    if (c !== color) { soltar(); color = c; }
    run += comentario || etiqueta || resto;
  }
  soltar();
}

// --- Capa 1 · lo que ves ----------------------------------------------------------------------------------------------
// El HTML de un trozo de la página, una etiqueta por línea y sangrado; lo que solo lleva texto (aunque esté partido en
// letras, como los textos vivos), en una línea
function htmlEnLineas(raiz, max) {
  const lineas = [];
  const abre = (el) => `<${el.tagName.toLowerCase()}${[...el.attributes].slice(0, 3).map((a) => (a.value ? ` ${a.name}="${corta(a.value, 34)}"` : ` ${a.name}`)).join('')}>`;
  const plano = (el) => [...el.querySelectorAll('*')].every((h) => EN_LINEA.has(h.tagName) || h.classList.contains('letra'));
  const rec = (n, d) => {
    if (lineas.length >= max) return;
    if (n.nodeType === 3) { const t = limpio(n.textContent); if (t) lineas.push([d, corta(t, 90)]); return; }
    if (n.nodeType !== 1) return;
    const tag = n.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'template') return;
    if (tag === 'svg' || tag === 'canvas' || tag === 'video') { lineas.push([d, corta(`${abre(n)}…</${tag}>`, 110)]); return; }
    if (tag === 'img' || tag === 'input' || tag === 'br' || tag === 'source') { lineas.push([d, corta(abre(n), 110)]); return; }
    if (plano(n)) { lineas.push([d, corta(`${abre(n)}${limpio(n.textContent)}</${tag}>`, 110)]); return; }
    lineas.push([d, abre(n)]);
    for (const h of n.childNodes) rec(h, d + 1);
    lineas.push([d, `</${tag}>`]);
  };
  rec(raiz, 0);
  return lineas;
}

// El muro de fondo: el HTML de la sección en columnas, muy apagado
function pintarMuro(ctx, lineas, W, H) {
  if (!lineas.length) return;
  const tam = 10, lh = 14;
  ctx.font = `400 ${tam}px ${MONO}`;
  const cw = ctx.measureText('0').width;
  const anchoCol = Math.round(cw * 58), hueco = 26;
  const cols = Math.ceil(W / (anchoCol + hueco)), filas = Math.ceil(H / lh) + 1;
  let k = 0;
  for (let c = 0; c < cols; c++) {
    for (let f = 0; f < filas; f++) {
      const [d, ln] = lineas[k++ % lineas.length];
      const sangria = Math.min(d, 12) * 2;
      escribir(ctx, corta(' '.repeat(sangria) + ln, 58), c * (anchoCol + hueco) + 14, f * lh + 4, { tag: 0.3, txt: 0.17, com: 0.14 });
    }
  }
}

// Los bloques de texto que se ven: el bloque al que pertenece cada texto (un párrafo, un titular, un enlace...) y, si
// no está en ninguno, su contenedor más cercano que no sea de línea. Sin repetir los que ya van dentro de otro
function bloquesDeTexto(main, W, H, seVe) {
  const bloques = new Set();
  const tw = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    if (!n.textContent.trim() || !n.parentElement) continue;
    let el = n.parentElement.closest(BLOQUE);
    if (!el || !main.contains(el)) {
      el = n.parentElement;
      while (el.parentElement && el.parentElement !== main && (EN_LINEA.has(el.tagName) || el.classList.contains('letra'))) el = el.parentElement;
    }
    bloques.add(el);
    if (bloques.size > 500) break;
  }
  const lista = [...bloques].filter((el) => {
    for (let p = el.parentElement; p && p !== main; p = p.parentElement) if (bloques.has(p)) return false;
    return true;
  });
  return lista.map((el) => [el, el.getBoundingClientRect()]).filter(([el, r]) => enPantalla(r, W, H) && seVe(el)).slice(0, 300);
}

// Un texto, en código: su etiqueta, su texto partido al ancho de su caja y el cierre, del tamaño que llena la caja
function pintarTexto(ctx, el, r) {
  const cs = getComputedStyle(el);
  const tag = el.tagName.toLowerCase();
  const clase = el.classList[0];
  const abre = `<${tag}${clase ? ` class="${clase}"` : ''}>`, cierra = `</${tag}>`;
  const texto = limpio(el.innerText || el.textContent);
  if (!texto) return;
  const tamDom = parseFloat(cs.fontSize) || 16;
  const comentario = tamDom >= 28 ? `/* ${cs.fontWeight} ${Math.round(tamDom)}px ${cs.fontFamily.split(',')[0].replace(/['"]/g, '')} */` : null;
  const ancho = Math.max(r.width, 60), alto = Math.max(r.height, 12);
  const n = abre.length + texto.length + cierra.length + (comentario ? comentario.length : 0);
  const tam = Math.max(8.5, Math.min(Math.sqrt((ancho * alto) / (0.6 * 1.45 * n)), 34, tamDom * 0.9));
  ctx.font = `400 ${tam}px ${MONO}`;
  const cw = ctx.measureText('0').width, lh = tam * 1.45;
  const porLinea = Math.max(8, Math.floor(ancho / cw));
  const lineas = [corta(abre, porLinea)];
  if (comentario) lineas.push(corta(comentario, porLinea));
  lineas.push(...partir(texto, porLinea), cierra);
  const alinear = cs.textAlign === 'center' ? 0.5 : cs.textAlign === 'right' || cs.textAlign === 'end' ? 1 : 0;
  lineas.forEach((ln, i) => {
    const x = r.left + (ancho - ctx.measureText(ln).width) * alinear;
    escribir(ctx, ln, x, r.top + i * lh);
  });
}

// Las imágenes que se están usando (por su URL), para el fondo CSS, que no tiene elemento: se cargan una vez
const imagenes = new Map();
function imagenDe(url, pendientes) {
  let img = imagenes.get(url);
  if (!img) {
    img = new Image();
    img.decoding = 'async';
    img.src = url;
    imagenes.set(url, img);
  }
  if (img.complete && img.naturalWidth) return img;
  pendientes.push(new Promise((ok) => { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', ok, { once: true }); }));
  return null;
}

// La luz de la imagen, en caracteres (más densos donde hay más luz), encajada en su caja como la encaja la página
function pintarLuz(ctx, fuente, r, ajuste) {
  const iw = fuente.naturalWidth || fuente.videoWidth, ih = fuente.naturalHeight || fuente.videoHeight;
  if (!iw || !ih) return;
  const tam = r.width * r.height > 300000 ? 10 : 8;
  ctx.font = `400 ${tam}px ${MONO}`;
  const cw = ctx.measureText('0').width, lh = tam * 1.12;
  const vis = { x0: Math.max(0, r.left), y0: Math.max(0, r.top), x1: Math.min(innerWidth, r.right), y1: Math.min(innerHeight, r.bottom) };
  const cols = Math.floor((vis.x1 - vis.x0) / cw), filas = Math.floor((vis.y1 - vis.y0) / lh);
  if (cols < 2 || filas < 2) return;
  const s = ajuste === 'contain' ? Math.min(r.width / iw, r.height / ih) : Math.max(r.width / iw, r.height / ih);
  const dw = iw * s, dh = ih * s, dx = r.left + (r.width - dw) / 2, dy = r.top + (r.height - dh) / 2;
  const m = lienzo(cols, filas);
  const mc = m.getContext('2d', { willReadFrequently: true });
  try {
    mc.drawImage(fuente, ((dx - vis.x0) / (vis.x1 - vis.x0)) * cols, ((dy - vis.y0) / (vis.y1 - vis.y0)) * filas, (dw / (vis.x1 - vis.x0)) * cols, (dh / (vis.y1 - vis.y0)) * filas);
    const d = mc.getImageData(0, 0, cols, filas).data;
    ctx.fillStyle = crema(0.62);
    for (let j = 0; j < filas; j++) {
      let fila = '';
      for (let i = 0; i < cols; i++) {
        const k = (j * cols + i) * 4;
        const luz = ((0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2]) / 255) * (d[k + 3] / 255);
        fila += RAMPA[Math.min(RAMPA.length - 1, Math.floor(luz * RAMPA.length))];
      }
      ctx.fillText(fila, vis.x0, vis.y0 + j * lh);
    }
  } catch (e) { /* imagen de otro origen: solo su ficha */ }
}

// La ficha de una imagen o un lienzo, como las del inspector de la portada: en rosa, con lo medido
function ficha(ctx, texto, x, y) {
  ctx.font = `400 10px ${MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0.4px';
  const t = texto.toUpperCase(), w = ctx.measureText(t).width + 25;
  ctx.fillStyle = rosa(1); ctx.fillRect(x, y, w, 18);
  ctx.fillStyle = '#190900'; ctx.fillRect(x + 7, y + 6.5, 5, 5);
  ctx.fillText(t, x + 18, y + 3.5);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}

function pintarMedio(ctx, el, r, url, fuente, pendientes) {
  const tag = el.tagName.toLowerCase();
  const kb = (() => {
    if (!url) return null;
    const e = performance.getEntriesByName(new URL(url, location.href).href)[0];
    const b = e && (e.encodedBodySize || e.transferSize);
    return b ? `${Math.round(b / 1024)} KB` : null;
  })();
  if (fuente) pintarLuz(ctx, fuente, r, getComputedStyle(el)[tag === 'img' || tag === 'video' ? 'objectFit' : 'backgroundSize'] === 'contain' ? 'contain' : 'cover');
  ctx.strokeStyle = crema(0.3); ctx.lineWidth = 1;
  ctx.strokeRect(Math.max(0.5, r.left + 0.5), Math.max(0.5, r.top + 0.5), Math.min(r.width, innerWidth) - 1, Math.min(r.height, innerHeight) - 1);
  // (la ficha, debajo de la cabecera si la imagen empieza arriba del todo)
  const x = Math.max(8, r.left + 8), y = Math.max(92, r.top + 8);
  const ruta = url ? decodeURI(new URL(url, location.href).pathname).replace(/^.*\/assets\//, 'assets/') : '';
  if (tag === 'canvas') {
    ficha(ctx, `canvas · ${el.width} × ${el.height} px`, x, y);
    ctx.font = `400 11px ${MONO}`;
    if (ruta) escribir(ctx, `texture(tFoto, uv); // ${corta(ruta, 48)}`, x, y + 26);
    return;
  }
  const iw = fuente?.naturalWidth || fuente?.videoWidth, ih = fuente?.naturalHeight || fuente?.videoHeight;
  const formato = ruta.split('.').pop();
  ficha(ctx, [tag === 'img' || tag === 'video' ? tag : 'fondo', iw ? `${iw} × ${ih}` : null, formato, kb].filter(Boolean).join(' · '), x, y);
  ctx.font = `400 11px ${MONO}`;
  escribir(ctx, tag === 'img' ? `<img src="${corta(ruta, 52)}">` : tag === 'video' ? `<video src="${corta(ruta, 50)}">` : `background-image: url("${corta(ruta, 40)}");`, x, y + 26);
}

// La URL de un fondo CSS, si lo tiene
const urlDeFondo = (el) => {
  const f = getComputedStyle(el).backgroundImage;
  const m = f && f !== 'none' && f.match(/url\(["']?([^"')]+)["']?\)/);
  return m ? m[1] : null;
};

// Las imágenes, los vídeos, los lienzos, los SVG y los fondos CSS que se ven. Un lienzo grande pinta la imagen de fondo
// que tiene al lado (la portada: el WebGL repinta la foto y esconde el fondo CSS), así que su luz sale de esa imagen
function pintarMedios(ctx, main, W, H, pendientes, seVe) {
  for (const el of main.querySelectorAll('*')) {
    if (el.classList.contains('letra')) continue;
    const tag = el.tagName;
    const r = el.getBoundingClientRect();
    if (!enPantalla(r, W, H)) continue;
    if (tag === 'IMG' || tag === 'VIDEO') {
      if (!seVe(el)) continue;
      const url = el.currentSrc || el.src;
      const lista = tag === 'IMG' ? el.complete && el.naturalWidth : el.readyState >= 2;
      pintarMedio(ctx, el, r, url, lista ? el : null, pendientes);
    } else if (tag === 'CANVAS') {
      if (!seVe(el) || r.width * r.height < 20000) continue;
      const url = [...(el.parentElement?.children || [])].map((h) => (h === el ? null : urlDeFondo(h))).find(Boolean) || null;
      pintarMedio(ctx, el, r, url, url ? imagenDe(url, pendientes) : null, pendientes);
    } else if (tag === 'svg') {
      if (!seVe(el)) continue;
      ctx.strokeStyle = crema(0.22); ctx.strokeRect(r.left + 0.5, r.top + 0.5, r.width - 1, r.height - 1);
      ctx.font = `400 9px ${MONO}`;
      escribir(ctx, corta(`<svg viewBox="${el.getAttribute('viewBox') || ''}">`, Math.max(6, Math.floor(r.width / 5.4))), r.left + 3, r.top + 3, { tag: 0.75, txt: 0.6 });
    } else if (r.width * r.height > 6400) {
      const url = urlDeFondo(el);
      if (!url || !seVe(el)) continue;
      pintarMedio(ctx, el, r, url, imagenDe(url, pendientes), pendientes);
    }
  }
}

// La capa 1 entera, a la resolución de la pantalla. pendientes: imágenes que aún cargaban (al llegar, se repinta)
export function capaVisible(dpr) {
  const W = innerWidth, H = innerHeight;
  const c = lienzo(W * dpr, H * dpr);
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.textBaseline = 'top';
  const main = document.querySelector('main');
  const pendientes = [];
  if (main) {
    const medio = H / 2;
    const seccion = [...main.children].find((s) => { const r = s.getBoundingClientRect(); return r.top <= medio && r.bottom >= medio; }) || main;
    const seVe = crearSeVe(main);
    pintarMuro(ctx, htmlEnLineas(seccion, 600), W, H);
    pintarMedios(ctx, main, W, H, pendientes, seVe);
    for (const [el, r] of bloquesDeTexto(main, W, H, seVe)) pintarTexto(ctx, el, r);
  }
  return { lienzo: c, pendientes };
}

// --- Capa 2 · el código que lo pinta -----------------------------------------------------------------------------------
// Columnas de código con su número de línea: el shader de la portada (desde donde empieza el GLSL) y este menú
const FICHEROS = [
  ['src/scripts/gl/portada.js', portadaFuente, Math.max(0, portadaFuente.split('\n').findIndex((l) => l.includes('precision highp float')) - 2)],
  ['src/scripts/menu/placa.js', placaFuente, 0],
];

export function capaCodigo(ancho, alto) {
  const c = lienzo(ancho, alto);
  const ctx = c.getContext('2d');
  ctx.textBaseline = 'top';
  const tam = Math.max(9, Math.round(ancho / 165)), lh = Math.round(tam * 1.55);
  ctx.font = `400 ${tam}px ${MONO}`;
  const cw = ctx.measureText('0').width;
  const anchoCol = cw * 84, cols = Math.max(1, Math.floor(ancho / anchoCol)), margen = (ancho - cols * anchoCol) / 2;
  const filas = Math.floor((alto - lh * 2) / lh);
  for (let k = 0; k < cols; k++) {
    const [ruta, fuente, desde] = FICHEROS[k % FICHEROS.length];
    const lineas = fuente.split('\n');
    const inicio = desde + Math.floor(k / FICHEROS.length) * filas;
    const x = margen + k * anchoCol;
    escribir(ctx, `// ${ruta}`, x, lh * 0.6, { com: 0.75 });
    for (let f = 0; f < filas; f++) {
      const i = (inicio + f) % lineas.length;
      ctx.fillStyle = crema(0.26);
      ctx.fillText(String(i + 1).padStart(4, ' '), x, lh * 2 + f * lh);
      escribir(ctx, corta(lineas[i].replace(/\t/g, '  '), 78), x + cw * 6, lh * 2 + f * lh, { tag: 0.85, txt: 0.7, com: 0.38 });
    }
  }
  return c;
}

// --- Capa 3 · lo que entiende la máquina -------------------------------------------------------------------------------
// El volcado de los bytes (UTF-8) del shader, en filas de 16 como xxd: dirección, los bytes en hexadecimal y su texto.
// pistas: las mismas filas, cada byte un tramo de cobre en el sitio de su par hexadecimal
export function capaBytes(ancho, alto) {
  const bytes = new TextEncoder().encode(portadaFuente.slice(portadaFuente.indexOf('precision highp float')));
  const texto = lienzo(ancho, alto), pistas = lienzo(ancho, alto);
  const ctx = texto.getContext('2d'), pc = pistas.getContext('2d');
  ctx.textBaseline = 'top';
  const tam = Math.max(9, Math.round(ancho / 150)), lh = Math.round(tam * 1.7);
  ctx.font = `400 ${tam}px ${MONO}`;
  const cw = ctx.measureText('0').width;
  const anchoCol = cw * 76, cols = Math.max(1, Math.floor(ancho / anchoCol)), margen = (ancho - cols * anchoCol) / 2;
  const filas = Math.floor(alto / lh);
  const hex = (v, n) => v.toString(16).padStart(n, '0');
  pc.lineCap = 'butt';
  let fila = 0;
  for (let k = 0; k < cols; k++) {
    for (let f = 0; f < filas; f++, fila++) {
      const off = (fila * 16) % bytes.length;
      const x = margen + k * anchoCol, y = f * lh;
      ctx.fillStyle = crema(0.3);
      ctx.fillText(hex(off, 8), x, y);
      let hx = x + cw * 10;
      let asc = '';
      for (let b = 0; b < 16; b++) {
        const v = bytes[(off + b) % bytes.length];
        ctx.fillStyle = v > 127 ? rosa(0.9) : crema(0.74);
        ctx.fillText(hex(v, 2), hx, y);
        // La pista: un tramo centrado en el par, más largo cuanto mayor es el byte; los tramos casi se tocan
        const largo = cw * (0.6 + (v / 255) * 2.4);
        pc.strokeStyle = rosa(0.55 + (v / 255) * 0.45);
        pc.lineWidth = Math.max(1, tam * 0.12);
        pc.beginPath(); pc.moveTo(hx + cw - largo / 2, y + tam * 0.55); pc.lineTo(hx + cw + largo / 2, y + tam * 0.55); pc.stroke();
        asc += v >= 32 && v < 127 ? String.fromCharCode(v) : '.';
        hx += cw * (b === 7 ? 4 : 3);
      }
      // Al final de cada fila, una vía: por ahí baja a la placa
      pc.fillStyle = rosa(0.9);
      pc.beginPath(); pc.arc(hx + cw * 0.6, y + tam * 0.55, tam * 0.2, 0, Math.PI * 2); pc.fill();
      ctx.fillStyle = crema(0.4);
      ctx.fillText(`|${asc}|`, hx + cw, y);
    }
  }
  return { texto, pistas };
}
