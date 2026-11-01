// El archivo, «La cinta»: los proyectos pasan en fila y en diagonal, uno cada vez, sobre papel. La rueda, el dedo o
// las flechas mueven la fila (sin bajar la página) y al soltar se queda en uno. Llegan desde abajo a la izquierda, se
// paran en el centro y se apilan arriba a la derecha hasta salirse de la pantalla; el ratón mueve toda la fila. El
// índice y el contador se mueven con ella; la esquina de la izquierda cambia a píxeles. La etiqueta del inspector y la
// paleta dicen lo que se mide de verdad en la foto del centro.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { PROYECTOS } from '../data/proyectos.js';

const CORREO = 'adsgroup@ads-partners.com';

// Dónde va cada carta según lo lejos que esté del centro (d, en cartas): x e y en anchos y altos de pantalla desde el
// centro, giros en grados y escala. En el centro, de frente pero girada 2° hacia la derecha (como en Huyml: sigue el
// camino de abajo a la izquierda hacia arriba a la derecha); las que vienen, abajo a la izquierda, mirando hacia abajo
// y a la izquierda (se alejan por la derecha); las que se van, arriba a la derecha y también mirando hacia abajo (siguen
// el mismo camino). Cada carta de más se aparta un
// «paso», hasta salirse de la pantalla
const POSES = {
  escritorio: {
    centro: [0, 0.01, 0, 0, 2, 1],
    entra: [-0.19, 0.47, -30, -14, 4, 1.04], entraPaso: [-0.03, 0.11, -2, -1, 0.8, 0.02],
    sale: [0.1, -0.39, -36, -16, 3, 0.92], salePaso: [0.024, -0.07, -2.5, -1, 0.6, -0.01],
  },
  movil: {
    centro: [0, -0.1, 0, 0, 2, 1],
    entra: [-0.06, 0.42, -40, -12, 8, 0.92], entraPaso: [-0.02, 0.12, -2, -1, 0.8, 0],
    sale: [0.06, -0.5, -40, -14, 6, 0.86], salePaso: [0.02, -0.08, -2, -1, 0.6, -0.02],
  },
};

// La matriz de Bayer de 8 × 8: el orden en que se encienden los píxeles (la misma idea que «se enciende la luz»)
export const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

const modulo = (x, m) => ((x % m) + m) % m;
const envolver = (x, m) => modulo(x + m / 2, m) - m / 2;   // de −m/2 a m/2
const suave = (t) => t * t * (3 - 2 * t);
const dos = (n) => String(n).padStart(2, '0');
// Lo suyo que se puede ver en público; si no hay, se ofrece contarlo por correo
const enlaceDe = (j) => PROYECTOS[j].enlace
  || { url: `mailto:${CORREO}?subject=${encodeURIComponent(`El proyecto de ${PROYECTOS[j].nombre}`)}`, t: 'Te lo contamos' };
const fuera = (url) => /^https?:/.test(url);
const indiceDe = (slug) => PROYECTOS.findIndex((x) => x.slug === slug);

export function montarCinta({ reducido, conRaton, lenis, cursor }) {
  const raiz = document.querySelector('[data-cinta]');
  if (!raiz) return;
  lenis?.stop();
  document.documentElement.classList.add('cinta-fija');

  const escena = raiz.querySelector('[data-cin-escena]');
  const lista = raiz.querySelector('[data-cin-lista]');
  const tira = raiz.querySelector('[data-cin-tira]');
  const totalEl = raiz.querySelector('[data-cin-total]');
  const ver = raiz.querySelector('[data-cin-ver]');
  const verT = ver.querySelector('[data-cin-ver-t]');
  const marcas = raiz.querySelector('[data-cin-marcas]');
  const marca = raiz.querySelector('[data-cin-marca="foto"]');
  const paleta = raiz.querySelector('[data-cin-paleta]');
  paleta.replaceChildren(...[0, 1, 2].map(() => document.createElement('i')));

  // La hora de aquí, como la de una redacción
  const hora = raiz.querySelector('[data-cin-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const darHora = () => { if (hora) hora.textContent = reloj.format(new Date()); };
  darHora();
  setInterval(darHora, 15000);

  // La esquina de la izquierda: lo del que está en el centro, que pasa de uno a otro a píxeles
  const info = crearPixelado(raiz.querySelector('[data-cin-info]'), (capa, pr) => {
    const v = { equipo: pr.equipo, rol: pr.rol, anio: pr.anio || '—', datos: pr.datos };
    capa.querySelectorAll('[data-v]').forEach((dd) => {
      const x = v[dd.dataset.v];
      if (Array.isArray(x)) dd.replaceChildren(...x.map((t) => Object.assign(document.createElement('span'), { textContent: t })));
      else dd.textContent = x || '';
    });
  }, reducido);

  // Lo que pinta el servidor sirve de plantilla: una carta y una entrada del índice por proyecto
  const plantillaCarta = [...escena.querySelectorAll('[data-cin-carta]')].map((el) => el.cloneNode(true));
  const plantillaItem = [...lista.querySelectorAll('[data-cin-item]')].map((el) => el.cloneNode(true));

  let activos = [], n = 0, M = 0;   // los proyectos de la fila, cuántos y cuántas cartas hay (con copias)
  let cartas = [], items = [];
  let p = 0, objetivo = 0, inicio = 0, dir = 1, ultimoGesto = 0, asentado = true, tocando = false;
  let actual = -1, escritoPara = -1, pintadoEn = NaN, encima = null, movido = false;
  const inclina = { x: 0, y: 0, tx: 0, ty: 0 };

  // --- El tamaño de cada carta: todas con la misma superficie, cada una con su forma ---------------------------
  const movil = () => innerWidth <= 760;
  function tam(j) {
    const f = PROYECTOS[j].cinta;
    const ar = f.ancho / f.alto;
    const b = movil() ? Math.min(innerWidth * 0.62, innerHeight * 0.3) : Math.min(innerWidth * 0.2, innerHeight * 0.36);
    let w = b * Math.sqrt(ar), h = b / Math.sqrt(ar);
    const maxW = innerWidth * (movil() ? 0.86 : 0.3);
    if (w > maxW) { h *= maxW / w; w = maxW; }
    return { w: Math.round(w), h: Math.round(h) };
  }

  // --- Medir cada foto (una vez por proyecto y tamaño): su paleta y lo que pesa ----------------------------------
  const lecturas = new Map();
  async function leer(j) {
    const { w, h } = tam(j);
    const clave = `${w}x${h}`;
    const previa = lecturas.get(j);
    if (previa && previa.clave === clave) return previa;
    const img = plantillaCarta[j].querySelector('img');
    // La plantilla no está en la página: se carga la misma foto que ya pidió la carta (sale de la caché)
    if (!img.complete || !img.naturalWidth) await new Promise((ok) => { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', ok, { once: true }); });
    if (!img.naturalWidth) return null;
    const url = img.currentSrc || img.src;
    const ext = url.split('?')[0].split('.').pop();
    const kb = await pesoKB(url);
    const lectura = {
      clave,
      // En el móvil, sin el tamaño en pantalla, para que quepa
      foto: [`img · ${img.naturalWidth}×${img.naturalHeight}${movil() ? '' : ` → ${w}×${h} px`}`, ext, kb && `${kb} KB`].filter(Boolean).join(' · '),
      paleta: medirPaleta(img),
    };
    lecturas.set(j, lectura);
    return lectura;
  }

  async function vestir(c) {
    const { w, h } = tam(c.j);
    c.el.style.setProperty('--w', `${w}px`);
    c.el.style.setProperty('--h', `${h}px`);
    const l = await leer(c.j);
    if (!l || !c.el.isConnected) return;
    if (activos[actual] === c.j) { colocarMarca(); pintarPaleta(c.j); }
  }

  // --- Montar la fila (con copias, para que nunca se acabe y las de los extremos queden fuera de la pantalla) ----
  function construir(lista_) {
    activos = lista_;
    n = activos.length;
    M = n * Math.ceil(16 / n);
    escena.replaceChildren();
    cartas = [];
    for (let k = 0; k < M; k++) {
      const j = activos[k % n];
      const el = plantillaCarta[j].cloneNode(true);
      const e = enlaceDe(j);
      el.href = e.url;
      if (fuera(e.url)) { el.target = '_blank'; el.rel = 'noopener'; }
      const c = { el, j, k };
      el.addEventListener('click', (ev) => {
        if (Math.abs(envolver(k - p, M)) < 0.5) { sonido.abrir(); return; }   // la del centro: abre lo suyo
        ev.preventDefault();
        ir(Math.round(p) + envolver(k - Math.round(p), M));
      });
      el.addEventListener('pointerenter', () => { encima = c; frase(); });
      el.addEventListener('pointerleave', () => { if (encima === c) { encima = null; frase(); } });
      escena.appendChild(el);
      cartas.push(c);
      vestir(c);
    }

    // El índice, tres veces seguidas: el de en medio es el de verdad; los otros dos, para que la columna no se corte
    lista.replaceChildren();
    items = [];
    for (let copia = 0; copia < 3; copia++) {
      activos.forEach((j, a) => {
        const li = plantillaItem[j].cloneNode(true);
        const enlace = li.querySelector('a');
        if (copia !== 1) { li.setAttribute('aria-hidden', 'true'); enlace.tabIndex = -1; }
        else enlace.addEventListener('focus', () => { if (enlace.matches(':focus-visible')) irA(a); });
        enlace.addEventListener('pointerenter', () => cursor?.decir?.('Traer'));
        enlace.addEventListener('pointerleave', () => cursor?.decir?.(''));
        lista.appendChild(li);
        items.push(li);
      });
    }
    // El contador: las cifras en un rodillo (y la primera otra vez al final, para dar la vuelta)
    tira.replaceChildren(...[...activos, activos[0]].map((_, a) => Object.assign(document.createElement('span'), { textContent: dos((a % n) + 1) })));
    totalEl.textContent = `/${dos(n)}`;
    actual = -1; escritoPara = -1; pintadoEn = NaN;
  }

  function irA(a) {
    const r = Math.round(p);
    ir(r + envolver(a - modulo(r, n), n));
  }
  function ir(destino) {
    objetivo = destino;
    dir = Math.sign(destino - p) || dir;
    asentado = true;
    movido = true;
  }

  // --- Lo que dice el cursor ---------------------------------------------------------------------------------------
  function frase() {
    if (!encima) { cursor?.decir?.(''); return; }
    const centro = Math.abs(envolver(encima.k - p, M)) < 0.5;
    cursor?.decir?.(centro ? enlaceDe(encima.j).t : 'Traer');
  }

  // --- Cambia el del centro: la esquina, el enlace, la etiqueta, la paleta y el sonido ---------------------------
  function cambiar(j, primera) {
    if (!primera) sonido.pasa(dir > 0 ? 0.35 : 0.65);
    info(PROYECTOS[j], primera);
    const e = enlaceDe(j);
    verT.textContent = e.t;
    ver.href = e.url;
    if (fuera(e.url)) { ver.target = '_blank'; ver.rel = 'noopener'; } else { ver.removeAttribute('target'); ver.removeAttribute('rel'); }
    clearTimeout(marca._t);
    marca.textContent = '';
    pintarPaleta(j);
    colocarMarca();
    frase();
  }

  // Los tres colores que más ocupan en su foto (medidos al leerla)
  function pintarPaleta(j) {
    const colores = lecturas.get(j)?.paleta || [];
    [...paleta.children].forEach((i, k) => {
      i.style.background = colores[k] || 'transparent';
      i.title = colores[k] || '';
    });
  }

  function colocarMarca() {
    const j = activos[actual];
    if (j === undefined) return;
    const { w, h } = tam(j);
    marcas.style.setProperty('--w', `${w}px`);
    marcas.style.setProperty('--h', `${h}px`);
    marcas.style.setProperty('--cy', `${(movil() ? POSES.movil : POSES.escritorio).centro[1] * innerHeight}px`);
  }

  // La etiqueta se escribe a máquina cuando la carta se para, como las del inspector de la portada
  function escribirMarca(j) {
    const l = lecturas.get(j);
    if (!l) return false;
    pintarPaleta(j);
    const txt = l.foto;
    clearTimeout(marca._t);
    if (reducido) { marca.textContent = txt; return true; }
    let k = 0;
    const paso = () => {
      if (k >= txt.length) return;
      marca.textContent = txt.slice(0, ++k);
      marca._t = setTimeout(paso, 14);
    };
    marca._t = setTimeout(() => { sonido.tic(0.45); paso(); }, 120);
    return true;
  }

  // --- Pintar la fila en su sitio -------------------------------------------------------------------------------
  function pose(d, P) {
    const a = Math.abs(d);
    const lado = d > 0 ? P.entra : P.sale, paso = d > 0 ? P.entraPaso : P.salePaso;
    const t = suave(Math.min(1, a)), mas = Math.max(0, a - 1);
    return P.centro.map((c, i) => c + (lado[i] - c) * t + paso[i] * mas);
  }

  function pintar() {
    const W = innerWidth, H = innerHeight;
    const P = movil() ? POSES.movil : POSES.escritorio;
    for (const c of cartas) {
      const d = envolver(c.k - p, M);
      const a = Math.abs(d);
      // Las de los extremos ya están fuera de la pantalla: ni se pintan
      if (a > 6) { c.el.style.visibility = 'hidden'; continue; }
      let [x, y, rx, ry, rz, s] = pose(d, P);
      // El ratón mueve toda la fila: la gira hacia él y la desplaza un poco, más a la del centro
      const peso = a < 1 ? 1 - a * 0.45 : 0.55;
      rx -= inclina.y * 13 * peso;
      ry += inclina.x * 16 * peso;
      x += inclina.x * 0.016 * (1 + Math.min(a, 3) * 0.35);
      y += inclina.y * 0.014 * (1 + Math.min(a, 3) * 0.35);
      c.el.style.visibility = '';
      // Encima, la del centro. En la pila de abajo, como en Huyml, las que vienen después van por delante de la siguiente
      // (que asoma más arriba, más cerca del centro); en la de arriba, la que acaba de salir tapa a las de antes
      c.el.style.zIndex = String(a <= 0.5 ? 1000 : d > 0 ? 100 + Math.round(d * 10) : 900 - Math.round(a * 10));
      c.el.style.transform = `translate(-50%, -50%) translate3d(${(x * W).toFixed(1)}px, ${(y * H).toFixed(1)}px, 0) perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(3)})`;
    }

    // El índice sube con la fila; el del centro, encendido
    const pm = modulo(p, n);
    const alto = items[0]?.offsetHeight || 150;
    lista.style.transform = `translate3d(0, ${(-(n + pm) * alto).toFixed(1)}px, 0)`;
    const apaga = movil() ? 1.6 : 0.78;
    items.forEach((li, s) => { li.style.opacity = Math.max(movil() ? 0 : 0.2, 1 - Math.abs(s - (n + pm)) * apaga).toFixed(3); });

    // El rodillo del contador (0,1 más arriba: la tinta de la cifra empieza ahí dentro de su hueco)
    const alturaCifra = tira.firstElementChild?.offsetHeight || 0;
    tira.style.transform = `translate3d(0, ${(-(pm + 0.1) * alturaCifra).toFixed(1)}px, 0)`;
  }

  // --- El bucle ------------------------------------------------------------------------------------------------------
  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now();
    const dt = Math.min(0.05, (t - t0) / 1000);
    t0 = t;
    // Al soltar la rueda, se queda en una carta: cada gesto pasa al menos una (una muesca, o un deslizamiento entero
    // del touchpad con su inercia, que llega como un chorro de golpes pequeños); uno largo, las que haya recorrido
    if (!asentado && !tocando && t - ultimoGesto > 140) asentar(0.02);
    p = reducido ? objetivo : p + (objetivo - p) * (1 - Math.exp(-5.5 * dt));
    if (Math.abs(objetivo - p) < 0.0005) p = objetivo;
    inclina.x += (inclina.tx - inclina.x) * (1 - Math.exp(-4.5 * dt));
    inclina.y += (inclina.ty - inclina.y) * (1 - Math.exp(-4.5 * dt));

    const ahora = modulo(Math.round(p), n);
    if (ahora !== actual) {
      const primera = actual === -1;
      actual = ahora;
      cambiar(activos[actual], primera);
    }
    if (asentado && Math.abs(objetivo - p) < 0.02 && escritoPara !== actual && escribirMarca(activos[actual])) {
      escritoPara = actual;
      // La dirección dice dónde está, para poder pasarla (sin llenar el historial)
      if (movido) history.replaceState(null, '', `#${PROYECTOS[activos[actual]].slug}`);
    }

    const huella = p + inclina.x * 7 + inclina.y * 13;
    if (huella !== pintadoEn) { pintar(); pintadoEn = huella; }
  });

  // --- Lo que mueve la fila ------------------------------------------------------------------------------------------
  function empujar(v) {
    if (asentado) inicio = Math.round(objetivo);   // empieza un gesto
    objetivo = Math.max(p - 1.6, Math.min(p + 1.6, objetivo + v));
    dir = Math.sign(v) || dir;
    ultimoGesto = performance.now();
    asentado = false;
    movido = true;
  }

  // Se queda en la carta a la que iba el gesto: si se movió menos que «minimo», vuelve a la de antes
  function asentar(minimo) {
    const viaje = objetivo - inicio;
    objetivo = Math.abs(viaje) < minimo ? inicio : inicio + Math.sign(viaje) * Math.max(1, Math.round(Math.abs(viaje)));
    asentado = true;
    colaHasta = performance.now() + 220;
  }
  // Lo que sigue llegando de la inercia del touchpad justo después de pararse (golpes pequeños y cada vez menores) es
  // la cola de ese mismo gesto, no uno nuevo. Un deslizamiento nuevo encima de la cola acelera, y ese sí cuenta
  let colaHasta = 0, deltaCola = 0;
  function esCola(mag) {
    const ahora = performance.now();
    const cola = asentado && ahora < colaHasta && mag < 40 && mag <= deltaCola * 1.3 + 2;
    deltaCola = mag;
    if (cola) colaHasta = ahora + 220;
    return cola;
  }

  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;   // el zoom del navegador
    e.preventDefault();
    let v = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) v *= 33;
    else if (e.deltaMode === 2) v *= innerHeight;
    if (esCola(Math.abs(v))) return;
    empujar(v / 360);
  }, { passive: false });

  let toque = null;
  raiz.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    toque = { x: t.clientX, y: t.clientY, t: performance.now(), v: 0 };
    tocando = true;
  }, { passive: true });
  raiz.addEventListener('touchmove', (e) => {
    if (!toque) return;
    e.preventDefault();
    const t = e.touches[0], ahora = performance.now();
    const dx = toque.x - t.clientX, dy = toque.y - t.clientY;
    const dd = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    toque.v = dd / Math.max(1, ahora - toque.t);
    Object.assign(toque, { x: t.clientX, y: t.clientY, t: ahora });
    empujar(dd / (innerHeight * 0.32));
  }, { passive: false });
  const soltar = () => {
    if (!toque) return;
    tocando = false;
    // Un golpe rápido pasa a la siguiente aunque el dedo apenas se haya movido; uno lento y corto, se arrepiente
    const rapido = Math.abs(toque.v) > 0.35;
    if (rapido && Math.abs(objetivo - inicio) < 0.25) objetivo = inicio + Math.sign(toque.v) * 0.3;
    asentar(0.25);
    toque = null;
  };
  raiz.addEventListener('touchend', soltar, { passive: true });
  raiz.addEventListener('touchcancel', soltar, { passive: true });

  addEventListener('keydown', (e) => {
    const sobreControl = e.target.closest?.('a, button, input, textarea');
    const k = e.key;
    let s = 0;
    if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !sobreControl && !e.shiftKey)) s = 1;
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && !sobreControl && e.shiftKey)) s = -1;
    if (!s) return;
    e.preventDefault();
    ir(Math.round(objetivo) + s);
  });

  if (conRaton) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      inclina.tx = e.clientX / innerWidth - 0.5;
      inclina.ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  // --- Arranque: si llega con #slug (de la home o de un enlace pasado), empieza en ese proyecto ---------------------
  construir([...PROYECTOS.keys()]);
  const desde = indiceDe(location.hash.slice(1));
  if (desde >= 0) p = objetivo = activos.indexOf(desde);
  // Las entradas del índice son #slug: al pulsarlas, la fila va a ese proyecto
  addEventListener('hashchange', () => {
    const a = activos.indexOf(indiceDe(location.hash.slice(1)));
    if (a >= 0 && a !== modulo(Math.round(objetivo), n)) irA(a);
  });

  let espera = null;
  addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => { cartas.forEach(vestir); colocarMarca(); info.preparar(); escritoPara = -1; pintadoEn = NaN; }, 200);
  });
}

// El cambio a píxeles: dos capas iguales, una encima de otra. La nueva se rellena y entra celda a celda mientras la
// de antes se va con las celdas contrarias, en el orden de la matriz de Bayer y con un barrido de izquierda a derecha.
// Las máscaras de cada paso se dibujan al cargar (y otra vez si cambia el tamaño), una por fotograma y codificadas
// fuera del hilo principal (toBlob), para que no se pare nada: dibujarlas de golpe al primer cambio frenaba la fila
// y partía en dos el deslizamiento del touchpad. Mientras no están, el cambio es directo
function crearPixelado(caja, rellenar, reducido) {
  const PASOS = 10, CELDA = 4;
  const capas = [caja.querySelector('[data-cin-capa]')];
  capas.push(capas[0].cloneNode(true));
  capas[1].setAttribute('aria-hidden', 'true');
  capas[1].style.visibility = 'hidden';
  caja.appendChild(capas[1]);
  let frente = 0, medida = '', mascaras = null, anim = null, tanda = 0;

  const poner = (capa, m) => { capa.style.webkitMaskImage = m; capa.style.maskImage = m; };
  const fotograma = () => new Promise((ok) => requestAnimationFrame(ok));
  async function preparar() {
    const W = Math.ceil(caja.offsetWidth), H = Math.ceil(caja.offsetHeight);
    if (!W || !H || `${W}x${H}` === medida) return;
    medida = `${W}x${H}`;
    const esta = ++tanda;
    const cols = Math.ceil(W / CELDA), filas = Math.ceil(H / CELDA);
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const nuevas = { entra: [], sale: [] };
    for (let k = 0; k <= PASOS; k++) {
      const t = k / PASOS;
      for (const lado of ['entra', 'sale']) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#000';
        for (let f = 0; f < filas; f++) {
          for (let c = 0; c < cols; c++) {
            const orden = ((BAYER[(f % 8) * 8 + (c % 8)] + 0.5) / 64) * 0.5 + (c / cols) * 0.5;
            if ((orden < t) === (lado === 'entra')) ctx.fillRect(c * CELDA, f * CELDA, CELDA, CELDA);
          }
        }
        const blob = await new Promise((ok) => cv.toBlob(ok));
        nuevas[lado].push(`url(${URL.createObjectURL(blob)})`);
        await fotograma();
        if (esta !== tanda) return;   // cambió el tamaño a mitad: vale la tanda nueva
      }
    }
    const viejas = mascaras;
    mascaras = nuevas;
    viejas && [...viejas.entra, ...viejas.sale].forEach((m) => URL.revokeObjectURL(m.slice(4, -1)));
  }
  // Si llega otro cambio a mitad, el de antes se acaba de golpe
  function terminar() {
    if (!anim) return;
    anim.kill();
    anim = null;
    poner(capas[frente], 'none');
    poner(capas[1 - frente], 'none');
    capas[1 - frente].style.visibility = 'hidden';
  }
  const cambiar = (datos, primera) => {
    terminar();
    const sale = capas[frente], entra = capas[1 - frente];
    rellenar(entra, datos);
    entra.style.visibility = '';
    frente = 1 - frente;
    if (primera || reducido || !mascaras) { sale.style.visibility = 'hidden'; return; }
    poner(entra, mascaras.entra[0]);
    poner(sale, mascaras.sale[0]);
    const o = { k: 0 };
    anim = gsap.to(o, {
      k: PASOS, duration: 0.5, ease: 'none',
      onUpdate: () => { const k = Math.floor(o.k); poner(entra, mascaras.entra[k]); poner(sale, mascaras.sale[k]); },
      onComplete: () => { anim = null; poner(entra, 'none'); poner(sale, 'none'); sale.style.visibility = 'hidden'; },
    });
  };
  cambiar.preparar = preparar;
  if (!reducido) setTimeout(preparar, 400);
  return cambiar;
}

// Los tres colores que más ocupan en la foto, agrupados de 32 en 32 por canal y sin dos casi iguales
export function medirPaleta(img) {
  const m = document.createElement('canvas');
  m.width = 64; m.height = 48;
  const mc = m.getContext('2d', { willReadFrequently: true });
  mc.drawImage(img, 0, 0, m.width, m.height);
  const d = mc.getImageData(0, 0, m.width, m.height).data;
  const cubos = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const clave = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const c = cubos.get(clave) || { n: 0, r: 0, g: 0, b: 0 };
    c.n++; c.r += r; c.g += g; c.b += b;
    cubos.set(clave, c);
  }
  const paleta = [];
  for (const c of [...cubos.values()].sort((a, b) => b.n - a.n)) {
    const col = [c.r / c.n, c.g / c.n, c.b / c.n];
    if (paleta.every((q) => Math.hypot(q[0] - col[0], q[1] - col[1], q[2] - col[2]) > 70)) paleta.push(col);
    if (paleta.length === 3) break;
  }
  return paleta.map(hex);
}

// Lo que pesa la foto: lo dice el navegador si la bajó ahora; si salió de la memoria, se lee de la caché (sin red).
// Si no se sabe, no se dice
export async function pesoKB(url) {
  try {
    const e = performance.getEntriesByName(new URL(url, location.href).href)[0];
    const b = e && (e.encodedBodySize || e.decodedBodySize);
    if (b) return Math.round(b / 1024);
    const r = await fetch(url, { cache: 'force-cache' });
    return r.ok ? Math.round((await r.blob()).size / 1024) : null;
  } catch (e) { return null; }
}

const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
