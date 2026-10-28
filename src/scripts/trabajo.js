// «Trabajo»: la vista del proyecto sigue al cursor (con inercia y se inclina con la velocidad) y, al mantener
// pulsado, se abre por dentro desde el centro: la imagen en versión máquina (curvas de luz, bordes y tramado)
// con un trozo de su código real encima. En el móvil, el botón «Por dentro» de cada fila hace lo mismo.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';

const CREMA = '231,226,218';
const MONO = '"Geist Mono", ui-monospace, monospace';

export function montarTrabajo({ cursor, reducido }) {
  const datos = JSON.parse(document.getElementById('datos-trabajos')?.textContent || '[]');
  const filas = [...document.querySelectorAll('[data-obra]')];
  if (!filas.length) return;
  const imagenes = new Map();
  const cargar = (src) => {
    if (!imagenes.has(src)) imagenes.set(src, new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }));
    return imagenes.get(src);
  };

  // Móvil (o sin ratón): miniatura en cada fila y botón para voltearla
  filas.forEach((fila) => {
    const t = datos[+fila.dataset.obra];
    fila.querySelector('[data-voltear]')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      const canvas = fila.querySelector('[data-mini-dentro]');
      if (!canvas.dataset.hecho) { const img = await cargar(t.imagen); if (img) pintarDentro(canvas, img, t, 640, 400); canvas.dataset.hecho = '1'; }
      const volteada = fila.classList.toggle('volteada');
      fila.querySelector('[data-voltear]').textContent = volteada ? 'Por fuera' : 'Por dentro';
      sonido.nota(volteada ? 6 : 3, 0.7);
    });
  });

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const vista = document.querySelector('[data-vista]');
  const img = vista.querySelector('[data-vista-img]');
  const video = vista.querySelector('[data-vista-video]');
  const dentro = vista.querySelector('[data-vista-dentro]');
  const pie = vista.querySelector('[data-vista-pie]');
  let actual = -1;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, giro = 0, previo = performance.now();
  let encima = false;

  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    const ahora = performance.now(); const dt = Math.min(0.05, (ahora - previo) / 1000); previo = ahora;
    if (!encima && !vista.classList.contains('visible')) return;
    const a = 1 - Math.exp(-(reducido ? 60 : 8) * dt);
    const vx = (tx - x);
    x += (tx - x) * a; y += (ty - y) * a;
    giro += ((reducido ? 0 : Math.max(-9, Math.min(9, vx * 0.08))) - giro) * a;
    vista.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${giro.toFixed(2)}deg) scale(${encima ? 1 : 0.86})`;
  });

  async function mostrar(i) {
    if (i === actual) return;
    actual = i;
    const t = datos[i];
    filas.forEach((f) => f.classList.toggle('activa', +f.dataset.obra === i));
    img.src = t.imagen;
    video.pause();
    if (t.video) { video.src = t.video; video.style.display = ''; video.play().catch(() => {}); } else { video.removeAttribute('src'); video.style.display = 'none'; }
    pie.textContent = `${t.cliente} · mantén pulsado para verlo por dentro`;
    dentro.dataset.de = '';
    const im = await cargar(t.imagen);
    if (im && actual === i) { pintarDentro(dentro, im, t, 800, 500); dentro.dataset.de = String(i); }
  }

  filas.forEach((fila) => {
    fila.addEventListener('pointerenter', () => {
      encima = true;
      mostrar(+fila.dataset.obra);
      vista.classList.add('visible');
      cursor.decir('');
    });
    fila.addEventListener('pointerleave', () => {
      encima = false; soltar();
      vista.classList.remove('visible');
      filas.forEach((f) => f.classList.remove('activa'));
      video.pause();
    });
  });

  // Mantener pulsado: se abre por dentro desde el centro
  const hold = { p: 0, mando: null, activo: false, completo: false, tween: null };
  const pintarHold = () => {
    const r = gsap.parseEase('power2.inOut')(hold.p) * 78;
    vista.style.setProperty('--r', `${r}%`);
    vista.style.setProperty('--aro', hold.p > 0 && hold.p < 1 ? '1' : '0');
    cursor.progreso(hold.p);
  };
  function empezar() {
    if (actual < 0) return;
    hold.activo = true; hold.completo = false; hold.mando = sonido.subida();
    cursor.pulsando(true);
    hold.tween = gsap.to(hold, {
      p: 1, duration: reducido ? 0.01 : 1.1, ease: 'none',
      onUpdate() { pintarHold(); hold.mando.avance(hold.p); },
      onComplete() {
        hold.completo = true; hold.mando.soltar(true);
        const t = datos[actual];
        pie.textContent = t.fichero ? `Por dentro · ${t.fichero}` : `Por dentro · su imagen, en curvas de luz y bordes`;
      },
    });
  }
  function soltar() {
    if (!hold.activo) return;
    hold.activo = false; cursor.pulsando(false);
    hold.tween?.kill();
    if (!hold.completo) hold.mando?.soltar(false);
    gsap.to(hold, { p: 0, duration: reducido ? 0 : 0.6, ease: 'power2.inOut', onUpdate: pintarHold });
    if (actual >= 0) pie.textContent = `${datos[actual].cliente} · mantén pulsado para verlo por dentro`;
  }
  filas.forEach((fila) => fila.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('a, button')) return;
    e.preventDefault();
    empezar();
  }));
  window.addEventListener('pointerup', soltar);
  window.addEventListener('blur', soltar);
}

// El «dentro» de un proyecto: su imagen en versión máquina y, encima, su código real
export function pintarDentro(c, img, t, W, H) {
  const dpr = Math.min(devicePixelRatio, 2);
  c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);

  // Luz de la imagen a baja resolución (y algo desenfocada, para que las curvas salgan limpias)
  const w = 200, h = 125;
  const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  tctx.filter = 'blur(1.2px)';
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  tctx.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  const d = tctx.getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) lum[i] = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;

  ctx.fillStyle = '#120D0A'; ctx.fillRect(0, 0, W, H);
  // Rejilla
  ctx.strokeStyle = `rgba(${CREMA},.06)`; ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
  for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }

  const sx = W / w, sy = H / h;
  const L = (i, j) => lum[Math.min(h - 1, Math.max(0, j)) * w + Math.min(w - 1, Math.max(0, i))];
  // Tramado mono: un carácter por celda según su luz
  const glifos = ' .·:-=+10#@';
  ctx.font = `400 ${Math.round(sx * 2.6)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let j = 1; j < h; j += 3) for (let i = 1; i < w; i += 3) {
    const l = L(i, j);
    const g = glifos[Math.min(glifos.length - 1, Math.floor(l * glifos.length))];
    if (g === ' ') continue;
    ctx.fillStyle = `rgba(${CREMA},${(0.06 + l * 0.22).toFixed(3)})`;
    ctx.fillText(g, i * sx, j * sy);
  }
  // Curvas de nivel (cambio de banda de luz) y bordes (Sobel) como puntos de línea
  for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
    const b = Math.floor(L(i, j) * 12);
    const curva = b !== Math.floor(L(i + 1, j) * 12) || b !== Math.floor(L(i, j + 1) * 12);
    const gx = L(i + 1, j - 1) + 2 * L(i + 1, j) + L(i + 1, j + 1) - L(i - 1, j - 1) - 2 * L(i - 1, j) - L(i - 1, j + 1);
    const gy = L(i - 1, j + 1) + 2 * L(i, j + 1) + L(i + 1, j + 1) - L(i - 1, j - 1) - 2 * L(i, j - 1) - L(i + 1, j - 1);
    const borde = Math.hypot(gx, gy);
    if (borde > 0.55) { ctx.fillStyle = `rgba(${CREMA},${Math.min(0.9, borde * 0.6).toFixed(2)})`; ctx.fillRect(i * sx, j * sy, sx, sy); }
    else if (curva) { ctx.fillStyle = `rgba(${CREMA},${(0.18 + L(i, j) * 0.3).toFixed(2)})`; ctx.fillRect(i * sx, j * sy, sx * 0.9, sy * 0.9); }
  }

  // El código, abajo a la izquierda, sobre un velo
  const lineas = t.codigo ? [`// ${t.fichero}`, ...t.codigo] : ['// sin código que enseñar:', '// su imagen, en curvas de luz y bordes'];
  const tam = 11.5, alto = tam * 1.6;
  const bloqueH = lineas.length * alto + 28;
  const velo = ctx.createLinearGradient(0, H - bloqueH - 40, 0, H);
  velo.addColorStop(0, 'rgba(18,13,10,0)'); velo.addColorStop(0.35, 'rgba(18,13,10,.86)'); velo.addColorStop(1, 'rgba(18,13,10,.94)');
  ctx.fillStyle = velo; ctx.fillRect(0, H - bloqueH - 40, W, bloqueH + 40);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = `400 ${tam}px ${MONO}`;
  lineas.forEach((ln, k) => {
    const yy = H - bloqueH + 14 + (k + 1) * alto - 4;
    ctx.fillStyle = ln.trim().startsWith('//') ? `rgba(${CREMA},.45)` : `rgba(${CREMA},.88)`;
    if (k === 0) ctx.fillStyle = 'rgba(245,203,215,.9)';
    let texto = ln;
    while (ctx.measureText(texto).width > W - 36 && texto.length > 4) texto = texto.slice(0, -2);
    ctx.fillText(texto === ln ? ln : texto + '…', 18, yy);
  });
}
