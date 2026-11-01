// El About: los dos montones de fotos. Con ratón, la escena se queda fija (sticky) y el scroll la recorre: cada tramo es
// un capítulo, con una foto de cada uno. Las de Sebas (brand) caen como copias en papel desde abajo a la izquierda; las
// de Álvaro (tech) se montan a píxeles: primero las celdas gruesas en el orden de la matriz de Bayer y después los
// píxeles se encogen hasta la foto. El inspector mide la de arriba de verdad (fichero, tamaño, peso, paleta y lo que
// ocupa en pantalla). Los dos montones se acercan capítulo a capítulo y al final se juntan en el marco de los dos.
// Sin ratón o con «movimiento reducido», los capítulos se leen uno detrás de otro y las fotos de Álvaro se montan a
// píxeles al llegar (solo si hay movimiento).
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { BAYER, medirPaleta, pesoKB } from './cinta.js';

// Cómo queda cada foto en su montón: el giro (grados) y lo que se aparta del centro (px)
const GIROS = { sebas: [-5, 3.5, -2.5, 6, -3.5], alvaro: [2.5, -3, 4, -1.5, 3] };
const DESVIOS = { sebas: [[-8, 6], [10, -8], [-12, -2], [6, 10], [0, -6]], alvaro: [[8, -6], [-10, 8], [6, 4], [-6, -10], [2, 4]] };
// Dónde está el centro de cada montón (en anchos de pantalla): al empezar, al acabar los capítulos y al juntarse
const CENTROS = { sebas: [0.36, 0.445, 0.5], alvaro: [0.64, 0.555, 0.5] };
const UNIDAD = 90;          // vh de scroll por capítulo
const GLIFOS = '01<>/{}[]#=+*_-~';

const limitar = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (t) => t * t * (3 - 2 * t);
const salida = (t) => 1 - Math.pow(1 - t, 3);
const mezclar = (a, b, t) => a + (b - a) * t;
const dos = (n) => String(n).padStart(2, '0');

export function montarAbout({ reducido, conRaton }) {
  const raiz = document.querySelector('[data-about]');
  if (!raiz) return;
  const html = document.documentElement;

  // La hora de aquí, como en Tech y en la cinta
  const hora = raiz.querySelector('[data-ab-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const darHora = () => { if (hora) hora.textContent = reloj.format(new Date()); };
  darHora();
  setInterval(darHora, 15000);

  // Las fotos de Álvaro llevan lo que el inspector mide en cada una: fichero, tamaño real, peso y sus tres colores
  raiz.querySelectorAll('[data-ab-foto="alvaro"]').forEach((fig) => {
    const img = fig.querySelector('[data-ab-img]');
    const vestir = async () => {
      const kb = await pesoKB(img.currentSrc || img.src);
      fig.querySelector('[data-ab-insp]').textContent = [
        img.getAttribute('src').split('/').pop(), `${img.naturalWidth} × ${img.naturalHeight}`, kb && `${kb} KB`,
      ].filter(Boolean).join(' · ');
      try {
        fig.querySelector('[data-ab-paleta]').replaceChildren(...medirPaleta(img).map((c) => {
          const i = document.createElement('i');
          i.style.background = c;
          i.title = c;
          return i;
        }));
      } catch (e) { /* sin canvas, sin paleta */ }
    };
    if (img.complete && img.naturalWidth) vestir();
    else img.addEventListener('load', vestir, { once: true });
  });

  if (html.classList.contains('ab-escena') && (reducido || !conRaton)) html.classList.remove('ab-escena');
  if (html.classList.contains('ab-escena')) montarEscena(raiz);
  else montarFlujo(raiz, reducido);

  // Las cotas: lo que ocupa de verdad en pantalla cada marco y la foto de arriba de Álvaro
  const cotas = [...raiz.querySelectorAll('[data-ab-cota]')];
  const medirCotas = () => cotas.forEach((c) => {
    const el = c.parentElement;
    c.textContent = el.offsetWidth ? `${el.offsetWidth} × ${el.offsetHeight} px` : '';
  });
  medirCotas();
  addEventListener('resize', medirCotas);
}

// --- Con ratón: la escena fija ------------------------------------------------------------------------------------------
function montarEscena(raiz) {
  const sec = raiz.querySelector('[data-ab-montones]');
  const esc = raiz.querySelector('[data-ab-escena]');
  const caps = [...raiz.querySelectorAll('[data-ab-cap]')];
  const N = caps.length;
  const marco = esc.querySelector('[data-ab-final]');
  const actualEl = esc.querySelector('[data-ab-actual]');
  const cifrados = caps.map((c) => c.querySelector('[data-ab-cifrado]'));
  sec.style.setProperty('--alto-montones', `calc(100vh + ${(N + 1) * UNIDAD}vh)`);

  // Cada foto se va a su montón (en el HTML va con su capítulo, para leerlo sin la escena)
  const pilas = { sebas: esc.querySelector('[data-ab-pila="sebas"]'), alvaro: esc.querySelector('[data-ab-pila="alvaro"]') };
  const fotos = { sebas: [], alvaro: [] };
  caps.forEach((cap) => cap.querySelectorAll('[data-ab-foto]').forEach((fig) => {
    const q = fig.dataset.abFoto;
    pilas[q].appendChild(fig);
    fotos[q].push(fig);
  }));
  // La escena necesita las diez fotos ya bajadas para montarlas
  esc.querySelectorAll('[data-ab-img]').forEach((img) => { img.loading = 'eager'; });
  const pix = fotos.alvaro.map(crearPixelador);
  const papeles = { sebas: fotos.sebas.map((f) => f.querySelector('.ab__papel')), alvaro: fotos.alvaro.map((f) => f.querySelector('.ab__papel')) };
  // Las de Álvaro no se mueven: se montan en su sitio
  papeles.alvaro.forEach((p, j) => {
    const [dx, dy] = DESVIOS.alvaro[j];
    p.style.transform = `translate(${dx}px, ${dy}px) rotate(${GIROS.alvaro[j]}deg)`;
  });

  let fw = 0, fh = 0;
  const medir = () => { fw = pilas.sebas.offsetWidth; fh = pilas.sebas.offsetHeight; };
  medir();
  addEventListener('resize', medir);

  let actual = -2, final = false, sonoFinal = false;
  const arriba = { sebas: -2, alvaro: -2 };
  const conPie = { sebas: -2, alvaro: -2 };
  const dentro = { sebas: [], alvaro: [] };

  function cambiar(j) {
    caps.forEach((c, k) => c.classList.toggle('es-actual', k === j));
    if (j < 0) return;
    actualEl.textContent = dos(j + 1);
    descifrar(cifrados[j]);
    sonido.pasa(0.3);
    setTimeout(() => sonido.tecla(0.5), 160);
  }

  gsap.ticker.add(() => {
    const r = sec.getBoundingClientRect();
    if (r.bottom < -100 || r.top > innerHeight * 1.5) return;
    const vw = innerWidth, vh = innerHeight;
    // P: por qué capítulo va el scroll (0 = el primero entra cuando la escena llega arriba; N, se juntan)
    const P = (-r.top / Math.max(1, r.height - vh)) * (N + 1);
    const junta = suave(limitar(P / (N - 1)));
    const m = suave(limitar((P - (N - 0.35)) / 0.9));

    for (const q of ['sebas', 'alvaro']) {
      // El montón, en su sitio: se acerca al otro capítulo a capítulo y al final se encoge hasta el marco
      const [c0, c1, c2] = CENTROS[q];
      const cx = mezclar(mezclar(c0, c1, junta), c2, m) * vw;
      pilas[q].style.transform = `translate(${(cx - fw / 2).toFixed(1)}px, 0) scale(${(1 - 0.38 * m).toFixed(3)})`;
      pilas[q].style.opacity = (1 - limitar((m - 0.45) / 0.4)).toFixed(3);

      let top = -1, posada = -1;
      fotos[q].forEach((fig, j) => {
        const e = limitar((P - (j - 0.35)) / 0.55);
        const esta = e > 0;
        if (esta !== dentro[q][j]) { fig.classList.toggle('es-dentro', esta); dentro[q][j] = esta; }
        if (esta) top = j;
        if (e >= 0.9) posada = j;
        if (q === 'sebas') {
          // La copia cae desde abajo a la izquierda, girando, hasta su sitio en el montón
          const k = salida(e), [dx, dy] = DESVIOS.sebas[j];
          const x = mezclar(-0.55 * vw, dx, k), y = mezclar(0.8 * vh, dy, k), g = mezclar(GIROS.sebas[j] - 32, GIROS.sebas[j], k);
          papeles.sebas[j].style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${g.toFixed(2)}deg)`;
        } else {
          pix[j].pintar(e);
        }
      });
      // Las de debajo se apagan un poco; la de arriba, cuando ya se ha posado, lleva su pie (y la de Álvaro, el inspector)
      if (top !== arriba[q]) {
        arriba[q] = top;
        papeles[q].forEach((p, j) => p.style.setProperty('--luz', j <= top ? Math.max(0.42, 1 - 0.14 * (top - j)).toFixed(2) : 1));
      }
      if (posada !== conPie[q]) {
        conPie[q] = posada;
        fotos[q].forEach((fig, j) => fig.classList.toggle('es-arriba', j === posada));
      }
    }

    // El capítulo de ahora (ninguno cuando se juntan)
    const j = m > 0.02 ? -1 : limitar(Math.floor(P + 0.35), 0, N - 1);
    if (j !== actual) { actual = j; cambiar(j); }

    // El final: se van los textos y aparece el marco de los dos
    const esFinal = m > 0.02;
    if (esFinal !== final) { final = esFinal; esc.classList.toggle('es-final', esFinal); }
    const a = limitar((m - 0.35) / 0.5);
    marco.style.setProperty('--marco-o', a.toFixed(3));
    marco.style.setProperty('--marco-s', mezclar(0.9, 1, suave(limitar((m - 0.35) / 0.65))).toFixed(3));
    if (m > 0.98 && !sonoFinal) { sonoFinal = true; sonido.ok(); }
    if (m < 0.5) sonoFinal = false;
  });
}

// --- Sin ratón o con movimiento reducido: de arriba abajo ---------------------------------------------------------------
function montarFlujo(raiz, reducido) {
  const figs = [...raiz.querySelectorAll('[data-ab-foto="alvaro"]')];
  if (reducido || !('IntersectionObserver' in window)) return;
  // Las de Álvaro se montan a píxeles cuando llegan a la pantalla
  figs.forEach((fig) => {
    const px = crearPixelador(fig);
    const img = fig.querySelector('[data-ab-img]');
    fig.classList.add('pix-espera');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const ir = () => {
        const o = { e: 0 };
        gsap.to(o, { e: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: () => px.pintar(o.e), onComplete: () => px.pintar(1) });
      };
      if (img.complete && img.naturalWidth) ir();
      else img.addEventListener('load', ir, { once: true });
    }, { threshold: 0.35 });
    io.observe(fig);
  });
}

// La foto de Álvaro, a píxeles. e va de 0 a 1: hasta la mitad entran las celdas gruesas en el orden de la matriz de
// Bayer, de abajo arriba; después los píxeles se encogen (de 22 px de pantalla a 1) hasta que queda la foto
function crearPixelador(fig) {
  const img = fig.querySelector('[data-ab-img]');
  const cv = fig.querySelector('[data-ab-pix]');
  const ctx = cv.getContext('2d');
  const chico = document.createElement('canvas');
  const cc = chico.getContext('2d', { willReadFrequently: true });
  const GRUESO = 22;
  let w = 0, h = 0, grueso = null, ultimo = -1;

  const medir = () => {
    w = cv.offsetWidth; h = cv.offsetHeight;
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    grueso = null; ultimo = -1;
  };
  addEventListener('resize', medir);
  // El trozo de la foto que se ve: como object-fit: cover, con el centro al 40 % de alto (como el CSS)
  const recorte = () => {
    const iw = img.naturalWidth, ih = img.naturalHeight, ar = w / h;
    let sw = iw, sh = iw / ar;
    if (sh > ih) { sh = ih; sw = ih * ar; }
    return [(iw - sw) / 2, (ih - sh) * 0.4, sw, sh];
  };

  function pintar(e) {
    if (!img.naturalWidth) return;
    if (!w) medir();
    if (!w || Math.abs(e - ultimo) < 0.003) return;
    ultimo = e;
    fig.classList.toggle('pix-hecho', e >= 1);
    fig.classList.toggle('pix-espera', e < 1);
    if (e >= 1) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (e <= 0) return;
    ctx.imageSmoothingEnabled = false;
    const rec = recorte();
    if (e < 0.5) {
      const cols = Math.ceil(w / GRUESO), filas = Math.ceil(h / GRUESO);
      chico.width = cols; chico.height = filas;
      if (!grueso) { cc.drawImage(img, ...rec, 0, 0, cols, filas); grueso = cc.getImageData(0, 0, cols, filas); }
      const t = e / 0.5;
      const d = new ImageData(new Uint8ClampedArray(grueso.data), cols, filas);
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const orden = ((BAYER[(f % 8) * 8 + (c % 8)] + 0.5) / 64) * 0.6 + (1 - f / filas) * 0.4;
          if (orden >= t) d.data[(f * cols + c) * 4 + 3] = 0;
        }
      }
      cc.putImageData(d, 0, 0);
      ctx.drawImage(chico, 0, 0, cols, filas, 0, 0, cv.width, cv.height);
    } else {
      const celda = Math.max(1, GRUESO * Math.pow(1 / GRUESO, suave((e - 0.5) / 0.5)));
      const cols = Math.ceil(w / celda), filas = Math.ceil(h / celda);
      chico.width = cols; chico.height = filas;
      cc.drawImage(img, ...rec, 0, 0, cols, filas);
      ctx.drawImage(chico, 0, 0, cols, filas, 0, 0, cv.width, cv.height);
    }
  }
  return { pintar };
}

// El texto de Álvaro se escribe a máquina descifrándose: lo ya escrito, una franja de signos y el resto, invisible
// (así la caja no cambia de tamaño mientras tanto)
function descifrar(p) {
  if (!p) return;
  const final = p.dataset.texto ?? (p.dataset.texto = p.textContent);
  cancelAnimationFrame(p._raf);
  const t0 = performance.now(), dura = Math.min(1400, 500 + final.length * 3);
  const hecho = document.createElement('span');
  const ruido = document.createElement('span');
  const resto = document.createElement('span');
  ruido.className = 'ab__ruido';
  resto.style.opacity = '0';
  p.replaceChildren(hecho, ruido, resto);
  const paso = () => {
    const k = Math.min(1, (performance.now() - t0) / dura);
    const n = Math.floor(final.length * k), banda = Math.min(14, final.length - n);
    hecho.textContent = final.slice(0, n);
    let s = '';
    for (let i = n; i < n + banda; i++) s += final[i] === ' ' ? ' ' : GLIFOS[(Math.random() * GLIFOS.length) | 0];
    ruido.textContent = s;
    resto.textContent = final.slice(n + banda);
    if (k < 1) p._raf = requestAnimationFrame(paso);
    else p.textContent = final;
  };
  paso();
}
