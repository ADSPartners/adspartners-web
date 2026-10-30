// Misión «A medida» (Tysiu): analiza la muestra para separar el tejido del aire (el visor de la misión «Protect» de
// Orano). El cursor es un visor; al hacer clic, el análisis se abre en círculo desde ahí. Todo se calcula de verdad
// en el navegador, con la imagen del proyecto:
// 1. Umbral de Otsu sobre los grises: lo claro es tejido y lo oscuro, aire.
// 2. Se etiqueta cada región de aire (píxeles conectados) y se mide su área.
// 3. Cada región se pinta por su tamaño: frías las pequeñas, cálidas las grandes (el mapa de calor de Orano).
// La leyenda enseña lo medido: el área de la mayor y la menor, el % de tejido, cuántas regiones y lo que ha tardado.
import { gsap } from 'gsap';

const CSS = `
.mtej { position: absolute; inset: 0; display: grid; place-items: center; touch-action: none; }
.mtej__lienzo { display: block; max-width: 100%; max-height: 100%; image-rendering: pixelated; outline: 1px solid rgba(231,226,218,.35); cursor: none; }
.mtej__visor { position: fixed; left: 0; top: 0; width: 64px; height: 64px; margin: -32px 0 0 -32px; pointer-events: none; opacity: 0; transition: opacity .25s; z-index: 9; }
.mtej__visor i { position: absolute; width: 12px; height: 12px; border: 0 solid var(--rosa); }
.mtej__visor i:nth-child(1) { left: 0; top: 0; border-width: 1.5px 0 0 1.5px; } .mtej__visor i:nth-child(2) { right: 0; top: 0; border-width: 1.5px 1.5px 0 0; }
.mtej__visor i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 1.5px 1.5px; } .mtej__visor i:nth-child(4) { right: 0; bottom: 0; border-width: 0 1.5px 1.5px 0; }
.mtej__visor b { position: absolute; left: 88px; top: 50%; transform: translateY(-50%); padding: 9px 16px; background: var(--rosa); color: var(--tinta); white-space: nowrap;
  font-family: var(--mono); font-weight: 400; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; }
.mtej.es-encima .mtej__visor { opacity: 1; }
.mtej.es-hecha .mtej__visor, .mtej.es-curso .mtej__visor b { opacity: 0; }
.mtej-ley { font-family: var(--mono); display: grid; grid-template-columns: auto 1fr; gap: 0 14px; }
.mtej-ley__escala { grid-row: 1 / 3; width: 3px; height: 110px; }
.mtej-ley__v { font-size: 10px; letter-spacing: .08em; color: var(--crema); }
.mtej-ley__v small { display: block; font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.mtej-ley__v--abajo { align-self: end; }
.mtej-ley dl { grid-column: 1 / 3; margin: 26px 0 0; display: grid; gap: 10px; }
.mtej-ley dt { font-size: 8.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--rosa); }
.mtej-ley dd { margin: 2px 0 0; font-size: 13px; color: var(--crema); }
@media (max-width: 760px) {
  .mtej-ley { grid-template-columns: auto 1fr auto; align-items: center; gap: 8px 12px; }
  .mtej-ley__v--abajo { grid-column: 1; grid-row: 1; align-self: center; }
  .mtej-ley__escala { grid-column: 2; grid-row: 1; width: 100%; height: 3px; background-image: var(--grad-h) !important; }
  .mtej-ley__v:not(.mtej-ley__v--abajo) { grid-column: 3; grid-row: 1; text-align: right; }
  .mtej-ley dl { grid-column: 1 / 4; grid-row: 2; margin-top: 4px; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .mtej-ley dd { font-size: 12px; }
  .mtej__visor b { left: auto; right: 0; top: auto; bottom: -46px; transform: none; }
}
`;

// Colores del mapa, de frío a cálido (pequeña → grande)
const PALETA = [[48, 70, 210], [64, 170, 255], [245, 203, 215], [255, 150, 90], [255, 70, 70]];
const color = (t) => {
  const x = Math.max(0, Math.min(0.9999, t)) * (PALETA.length - 1), i = Math.floor(x), f = x - i;
  return PALETA[i].map((c, k) => Math.round(c + (PALETA[i + 1][k] - c) * f));
};

function otsu(grises) {
  const h = new Array(256).fill(0);
  for (const g of grises) h[g]++;
  const n = grises.length;
  let suma = 0;
  for (let i = 0; i < 256; i++) suma += i * h[i];
  let sumB = 0, wB = 0, mejor = 0, umbral = 128;
  for (let t = 0; t < 256; t++) {
    wB += h[t];
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * h[t];
    const mB = sumB / wB, mF = (suma - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > mejor) { mejor = v; umbral = t; }
  }
  return umbral;
}

// Etiqueta las regiones de aire (4 vecinos) y devuelve la etiqueta de cada píxel y el área de cada región
function regiones(aire, w, h) {
  const etq = new Int32Array(w * h).fill(-1);
  const areas = [];
  const pila = new Int32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (!aire[i] || etq[i] !== -1) continue;
    const id = areas.length;
    let arriba = 0, area = 0;
    pila[arriba++] = i;
    etq[i] = id;
    while (arriba) {
      const j = pila[--arriba];
      area++;
      const x = j % w;
      const vecinos = [x > 0 ? j - 1 : -1, x < w - 1 ? j + 1 : -1, j - w, j + w];
      for (const v of vecinos) {
        if (v < 0 || v >= w * h || !aire[v] || etq[v] !== -1) continue;
        etq[v] = id;
        pila[arriba++] = v;
      }
    }
    areas.push(area);
  }
  return { etq, areas };
}

let estilos = false;
const miles = (n) => n.toLocaleString('es-ES');

export async function montar(zona, { mision, panel, sonido, reducido }) {
  if (!estilos) { const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); estilos = true; }
  const raiz = document.createElement('div');
  raiz.className = 'mtej';
  const dedo = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  raiz.innerHTML = `<canvas class="mtej__lienzo" data-lienzo aria-label="Muestra de tejido pulmonar de Tysiu"></canvas>
    <div class="mtej__visor" data-visor aria-hidden="true"><i></i><i></i><i></i><i></i><b>${dedo ? mision.gestoDedo : mision.gesto}</b></div>`;
  zona.append(raiz);
  const lienzo = raiz.querySelector('[data-lienzo]');
  const visor = raiz.querySelector('[data-visor]');

  // La imagen del proyecto
  const img = new Image();
  img.src = `${import.meta.env.BASE_URL}assets/proyectos/fundacion-jimenez-diaz/lienzo-tysiu.webp`;
  await img.decode();

  // El análisis, a 440 px de ancho (cada píxel del análisis se ve como un cuadrado: es píxel a píxel)
  const t0 = performance.now();
  const W = 440, H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const ana = document.createElement('canvas');
  ana.width = W; ana.height = H;
  const actx = ana.getContext('2d', { willReadFrequently: true });
  actx.drawImage(img, 0, 0, W, H);
  const datos = actx.getImageData(0, 0, W, H);
  const grises = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) grises[i] = Math.round(datos.data[i * 4] * 0.299 + datos.data[i * 4 + 1] * 0.587 + datos.data[i * 4 + 2] * 0.114);
  const umbral = otsu(grises);
  const aire = new Uint8Array(W * H);
  let tejido = 0;
  for (let i = 0; i < W * H; i++) { if (grises[i] > umbral) tejido++; else aire[i] = 1; }
  const { etq, areas } = regiones(aire, W, H);
  // Las regiones de 1 a 3 píxeles son ruido: se cuentan como tejido, no como región
  const MIN = 4;
  const validas = areas.filter((a) => a >= MIN);
  const maxA = Math.max(...validas), minA = Math.min(...validas);
  const lmin = Math.log(minA), lmax = Math.log(maxA);
  const seg = actx.createImageData(W, H);
  for (let i = 0; i < W * H; i++) {
    const o = i * 4, e = etq[i];
    if (e >= 0 && areas[e] >= MIN) {
      const [r, g, b] = color((Math.log(areas[e]) - lmin) / (lmax - lmin));
      seg.data[o] = r; seg.data[o + 1] = g; seg.data[o + 2] = b; seg.data[o + 3] = 235;
    } else {
      seg.data[o] = 231; seg.data[o + 1] = 226; seg.data[o + 2] = 218; seg.data[o + 3] = 255;
    }
  }
  const segC = document.createElement('canvas');
  segC.width = W; segC.height = H;
  segC.getContext('2d').putImageData(seg, 0, 0);
  const ms = performance.now() - t0;
  // Las áreas, en píxeles de la imagen original (cada píxel del análisis vale (ancho original / 440)²)
  const k2 = (img.naturalWidth / W) ** 2;

  // El lienzo que se ve: la muestra apagada, del tamaño de la zona
  const ctx = lienzo.getContext('2d');
  const pintarBase = () => {
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#120D0A';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.42;
    ctx.drawImage(ana, 0, 0);
    ctx.globalAlpha = 1;
  };
  lienzo.width = W; lienzo.height = H;
  const medir = () => {
    const esc = Math.min(zona.clientWidth / W, zona.clientHeight / H) * 0.98;
    lienzo.style.width = `${W * esc}px`;
    lienzo.style.height = `${H * esc}px`;
  };
  medir();
  addEventListener('resize', medir);
  pintarBase();
  panel.gesto(mision.gesto && dedo ? mision.gestoDedo : mision.gesto);

  // El visor sigue al ratón (con el dedo, se queda en el centro)
  let estado = 'listo';
  const ponerVisor = (x, y) => { visor.style.transform = `translate(${x}px, ${y}px)`; };
  const moverVisor = (e) => { ponerVisor(e.clientX, e.clientY); };
  lienzo.addEventListener('pointerenter', () => raiz.classList.add('es-encima'));
  lienzo.addEventListener('pointerleave', () => { if (!dedo) raiz.classList.remove('es-encima'); });
  addEventListener('pointermove', moverVisor);
  if (dedo) {
    const r = lienzo.getBoundingClientRect();
    ponerVisor(r.left + r.width / 2, r.top + r.height / 2);
    raiz.classList.add('es-encima');
  }

  lienzo.addEventListener('click', (e) => {
    if (estado !== 'listo') return;
    estado = 'curso';
    raiz.classList.add('es-curso');
    const r = lienzo.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width) * W, cy = ((e.clientY - r.top) / r.height) * H;
    ponerVisor(e.clientX, e.clientY);
    panel.gesto('');
    panel.orden(mision.curso, true);
    const mando = sonido.subida();
    const radioMax = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
    const o = { r: 0 };
    gsap.to(o, {
      r: radioMax, duration: reducido ? 0 : 2.2, ease: 'power1.inOut',
      onUpdate() {
        pintarBase();
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(segC, 0, 0);
        ctx.restore();
        // El frente del análisis: un aro rosa
        ctx.strokeStyle = 'rgba(245,203,215,.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
        ctx.stroke();
        mando.avance(o.r / radioMax);
      },
      onComplete() {
        pintarBase();
        ctx.drawImage(segC, 0, 0);
        mando.soltar(true);
        terminar();
      },
    });
  });

  function terminar() {
    estado = 'hecha';
    raiz.classList.add('es-hecha');
    panel.orden(mision.veredicto, true);
    sonido.ok();
    const ley = document.createElement('div');
    ley.className = 'mtej-ley';
    const grad = `linear-gradient(${PALETA.map((c) => `rgb(${c.join(',')})`).reverse().join(',')})`;
    ley.innerHTML = `
      <span class="mtej-ley__escala" style="background:${grad};--grad-h:linear-gradient(90deg,${PALETA.map((c) => `rgb(${c.join(',')})`).join(',')})"></span>
      <span class="mtej-ley__v"><small>Mayor región</small>${miles(Math.round(maxA * k2))} px</span>
      <span class="mtej-ley__v mtej-ley__v--abajo"><small>Menor</small>${miles(Math.round(minA * k2))} px</span>
      <dl>
        <div><dt>Tejido</dt><dd>${Math.round((tejido / (W * H)) * 100)} %</dd></div>
        <div><dt>Regiones medidas</dt><dd>${miles(validas.length)}</dd></div>
        <div><dt>Calculado en</dt><dd>${Math.max(1, Math.round(ms))} ms</dd></div>
      </dl>`;
    panel.leyenda(ley);
    panel.hecha(mision.explica);
  }

  return {
    destruir() {
      removeEventListener('resize', medir);
      removeEventListener('pointermove', moverVisor);
      raiz.remove();
    },
  };
}
