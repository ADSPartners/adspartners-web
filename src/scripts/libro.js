// Las legales, «el libro» (components/legal/Libro.astro). El navegador pagina el texto: cada capítulo es una columna
// CSS de alto fijo y lo que no cabe pasa a la columna siguiente, que es la página siguiente. Aquí se mide todo eso
// (cuántas páginas sale cada capítulo y en cuál cae cada apartado), se colocan las páginas en una tira y se pasa de
// una a otra girando una hoja de verdad: una copia de la tira por cara, cada una enseñando su página.
// También el inspector de cada párrafo (su nota en cristiano y lo medido), la guarda con el CSS de la paginación, el
// colofón y la tabla de lo que tu navegador tiene guardado de esta web, leída en vivo.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { borrarCookie } from './rastreo.js';

const MADRID = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
const FECHA = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric' });
const dos = (n) => String(n).padStart(2, '0');
const limitar = (v, a, b) => Math.min(b, Math.max(a, v));
// La caja del inspector, al lado del libro: su ancho y el hueco hasta la página (el libro les deja sitio)
const INSP = { ancho: 176, hueco: 24 };

export function montarLibro({ reducido, conRaton, cursor }) {
  const raiz = document.querySelector('[data-libro]');
  if (!raiz) return;
  const $ = (s, r = raiz) => r.querySelector(s);
  const $$ = (s, r = raiz) => [...r.querySelectorAll(s)];

  const libro = $('[data-lib-libro]');
  const ventana = $('[data-lib-ventana]');
  const tira = $('[data-lib-tira]');
  const hoja = $('[data-lib-hoja]');
  const debajo = $('[data-lib-debajo]');
  const frente = $('.lib__cara--frente', hoja);
  const dorso = $('.lib__cara--dorso', hoja);
  const base = raiz.dataset.base || '/';
  const caps = $$('.lib__cap', tira);
  const capPorSlug = Object.fromEntries(caps.map((c) => [c.dataset.cap, c]));
  const portadillas = $$('.lib__portadilla', tira);

  // --- La hora de aquí, como en Tech ----------------------------------------------------------------------------
  const hora = $('[data-lib-hora]');
  const darHora = () => { if (hora) hora.textContent = MADRID.format(new Date()); };
  darHora();
  setInterval(darHora, 20000);

  // --- Maquetar: medidas del libro, páginas de cada capítulo y dónde cae cada cosa ---------------------------------
  let doble = false, P = 0, H = 0, m = 0, total = 0, actual = 0;
  let paginas = [];             // { tipo, cap, num, titulo } por página
  const mapa = {};              // id (capítulo o apartado) → página
  let msPaginar = 0;

  function maquetar() {
    const t0 = performance.now();
    const vw = innerWidth, vh = innerHeight;
    const movil = vw <= 760;
    doble = vw >= 900 && vw / vh > 1.1;
    const arriba = movil ? 64 : 76, abajo = movil ? 62 : 76;
    let alto = Math.min(vh - arriba - abajo, 880);
    if (doble) {
      // A los lados, sitio para las cajas del inspector (si hay ratón)
      P = Math.max(330, Math.min(Math.round(alto * 0.7), Math.floor((vw - (conRaton ? 2 * (INSP.ancho + INSP.hueco + 12) : 80)) / 2)));
      H = Math.min(alto, Math.round(P / 0.6));
    } else {
      P = Math.min(vw - 24, 560);
      H = Math.min(alto, Math.round(P * 1.95));
    }
    m = Math.round(limitar(P * 0.095, 20, 52));
    const mt = Math.round(limitar(H * 0.082, 34, 64));
    const mb = Math.round(limitar(H * 0.088, 36, 68));
    const fs = +limitar(P / 31.5, 14, 17.4).toFixed(2);
    const W = P - 2 * m, Hc = H - mt - mb;

    raiz.dataset.modo = doble ? 'doble' : 'simple';
    const v = { '--P': `${P}px`, '--H': `${H}px`, '--m': `${m}px`, '--mt': `${mt}px`, '--mb': `${mb}px`, '--W': `${W}px`, '--Hc': `${Hc}px`, '--fs': `${fs}px`, '--hojas': doble ? 2 : 1 };
    Object.entries(v).forEach(([k, val]) => raiz.style.setProperty(k, val));
    raiz.style.setProperty('--mesa-arriba', `${arriba - abajo}px`);

    // Las páginas, en orden. A doble página, cada portadilla va a la izquierda y el texto empieza a la derecha
    paginas = [];
    let k = 0;
    const poner = (el, n = 1) => { el.style.left = `${k * P}px`; el.style.width = `${n * P}px`; };
    const guardas = $$('.lib__guarda', tira);
    poner(guardas[0]); paginas[k++] = { tipo: 'guarda' };
    const sumario = $('.lib__sumario', tira);
    poner(sumario); paginas[k++] = { tipo: 'sumario' };
    portadillas.forEach((port) => {
      const slug = port.dataset.cap, cap = capPorSlug[slug];
      const datos = { cap: slug, num: cap.dataset.num, titulo: cap.dataset.titulo };
      if (doble && k % 2) paginas[k++] = { tipo: 'blanca' };
      poner(port); mapa[slug] = k; paginas[k++] = { tipo: 'portadilla', ...datos };
      // El capítulo: una columna por página. Se mide dónde acaba (el marcador del final) y dónde cae cada apartado
      poner(cap);
      const cols = $('.lib__cols', cap);
      const x0 = cols.getBoundingClientRect().left;
      const col = (el) => Math.max(0, Math.floor((el.getBoundingClientRect().left - x0 + 1) / P));
      const n = col($('.lib__fin', cap)) + 1;
      cap.style.width = `${n * P}px`;
      $$('.lib__ap', cap).forEach((ap) => { mapa[ap.id] = k + col($('h3', ap)); });
      for (let i = 0; i < n; i++) paginas[k++] = { tipo: 'texto', ...datos };
    });
    poner($('.lib__colofon', tira)); paginas[k++] = { tipo: 'colofon' };
    if (doble) {
      if (k % 2) paginas[k++] = { tipo: 'blanca' };
      poner(guardas[1]); guardas[1].hidden = false; paginas[k++] = { tipo: 'guarda' };
      paginas[k++] = { tipo: 'blanca' };
    } else guardas[1].hidden = true;
    total = k;
    tira.style.width = `${total * P}px`;
    msPaginar = performance.now() - t0;

    rellenarSumario();
    medirPortadillas(fs);
    escribirGuarda({ W, m, Hc, fs });
    escribirColofon();
    copiarTira();
  }

  function rellenarSumario() {
    $$('[data-folio-de]', tira).forEach((b) => { const p = mapa[b.dataset.folioDe]; b.textContent = p == null ? '' : p + 1; });
    // Que quepa: se achica la letra hasta que el sumario entra en su página
    const sum = $('[data-lib-sumario]', tira), pag = sum.parentElement;
    const disponible = pag.clientHeight - parseFloat(getComputedStyle(pag).paddingTop) - parseFloat(getComputedStyle(pag).paddingBottom);
    let t = limitar(P / 33, 12, 16);
    sum.style.setProperty('--fs-sum', `${t}px`);
    while (sum.scrollHeight > disponible && t > 9) { t -= 0.5; sum.style.setProperty('--fs-sum', `${t}px`); }
  }

  function medirPortadillas(fs) {
    portadillas.forEach((port) => {
      const num = $('.lib__port-num', port), cap = capPorSlug[port.dataset.cap];
      const tam = Math.round(parseFloat(getComputedStyle(num).fontSize));
      const aps = $$('.lib__ap', cap).length;
      $('[data-lib-port-medida]', port).textContent = `Garamond 300 · ${tam} px\n${aps} apartados · cuerpo ${String(+fs.toFixed(1)).replace('.', ',')} px`;
      $('[data-lib-port-medida]', port).style.whiteSpace = 'pre-line';
    });
  }

  // La guarda: el CSS que pagina este libro, con los valores medidos ahora en tu pantalla
  function escribirGuarda({ W, m, Hc, fs }) {
    const css = $('[data-lib-css]', tira);
    const c = (t) => `<span class="c">${t}</span>`, val = (t) => `<span class="v">${t}</span>`;
    css.innerHTML = [
      c('/* Así se pagina este libro, medido ahora en tu pantalla */'),
      '.lib__cols {',
      `  width: ${val(`${W}px`)};`,
      `  height: ${val(`${Math.round(Hc)}px`)};`,
      '  column-count: 1;',
      `  column-gap: ${val(`${2 * m}px`)};`,
      '  column-fill: auto;',
      `  font: ${val(`${+fs.toFixed(1)}px`)}/1.45 'Apple Garamond';`,
      '}',
      c(`/* ${total} páginas · paginado en ${msPaginar.toFixed(1).replace('.', ',')} ms */`),
    ].join('\n');
  }

  function escribirColofon() {
    const ahora = new Date();
    $('[data-lib-colofon]', tira).textContent = `Este libro se compuso en Apple Garamond y Geist Mono y se paginó en tu navegador el ${FECHA.format(ahora)}, a las ${MADRID.format(ahora)} de Madrid. Tiene ${total} páginas y ninguna se ha impreso.`;
  }

  // Las copias de la tira que van en las caras de la hoja y en la página de debajo: sin ids ni nada que se pueda pulsar
  function copiarTira() {
    [frente, dorso, debajo].forEach((cara) => {
      const copia = tira.cloneNode(true);
      copia.removeAttribute('data-lib-tira');
      copia.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      copia.querySelectorAll('[data-nota]').forEach((el) => el.removeAttribute('data-nota'));
      $('.lib__vista', cara).replaceChildren(copia);
    });
  }

  // --- Qué se ve: las páginas, su titulillo y su folio, la cuenta, el capítulo y la dirección ----------------------
  const cabDe = (k, izquierda) => {
    const p = paginas[k];
    if (!p || p.tipo !== 'texto') return '';
    return izquierda ? 'adsPartners® · Legales' : `${p.num} · ${p.titulo}`;
  };
  const folioDe = (k) => (paginas[k] && ['texto', 'sumario', 'colofon'].includes(paginas[k].tipo) ? String(k + 1) : '');
  const inicio = (k) => (doble ? k - (k % 2) : k);
  const paso = () => (doble ? 2 : 1);

  let capActual = raiz.dataset.abrir;
  const titulos = Object.fromEntries(caps.map((c) => [c.dataset.cap, c.dataset.titulo]));

  function mostrar(k) {
    actual = inicio(limitar(k, 0, total - 1));
    tira.style.transform = `translate3d(${-actual * P}px, 0, 0)`;
    const slots = doble ? [actual, actual + 1] : [actual];
    slots.forEach((p, i) => {
      $(`[data-lib-cab="${i}"]`).textContent = cabDe(p, doble && i === 0);
      $(`[data-lib-folio="${i}"]`).textContent = folioDe(p);
    });
    const ultimo = total - paso();
    $('.lib__borde--atras').hidden = actual <= 0;
    $('.lib__borde--sig').hidden = actual >= ultimo;
    $$('[data-lib-paso]').forEach((b) => { b.disabled = b.dataset.libPaso === '-1' ? actual <= 0 : actual >= ultimo; });
    $('[data-lib-cuenta]').textContent = doble ? `${dos(actual + 1)}–${dos(actual + 2)} / ${dos(total)}` : `${dos(actual + 1)} / ${dos(total)}`;
    // El canto: más grueso del lado donde quedan más páginas
    const leido = total > 1 ? actual / (total - 1) : 0;
    raiz.style.setProperty('--canto-izq', `${(2 + leido * 9).toFixed(1)}px`);
    raiz.style.setProperty('--canto-der', `${(2 + (1 - leido) * 9).toFixed(1)}px`);
    // El capítulo a la vista: se marca abajo, y la dirección y el título lo dicen (sin llenar el historial)
    const p = paginas[slots[slots.length - 1]]?.cap ? paginas[slots[slots.length - 1]] : paginas[actual];
    if (p?.cap && p.cap !== capActual && !hojeando) {
      capActual = p.cap;
      history.replaceState(null, '', `${base}${p.cap}/`);
      document.title = `${titulos[p.cap]} · adsPartners®`;
    }
    $$('[data-lib-cap-nav]').forEach((a) => { if (a.dataset.libCapNav === capActual) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }

  // --- Pasar página ------------------------------------------------------------------------------------------------
  let girando = false, pendiente = 0;
  let hojeando = false;   // mientras se hojea hasta una página lejana, la dirección no cambia con cada capítulo que pasa

  function preparar(cara, k, lado) {
    const vacia = k < 0 || k >= total || paginas[k]?.tipo === 'blanca';
    cara.toggleAttribute('data-vacia', vacia);
    cara.dataset.lado = lado;
    const copia = $('.lib__vista > .lib__tira', cara);
    if (copia) copia.style.transform = `translate3d(${-k * P}px, 0, 0)`;
    $('.lib__cab', cara).textContent = vacia ? '' : cabDe(k, lado === 'izq' && doble);
    $('.lib__folio', cara).textContent = vacia ? '' : folioDe(k);
    cara.classList.toggle('lib__guarda-cara', paginas[k]?.tipo === 'guarda');
    cara.style.background = paginas[k]?.tipo === 'guarda' ? 'var(--rosa)' : '';
  }

  function girar(dir, duracion) {
    const k = actual;
    let desde = 0, hasta = 0;
    hoja.style.transform = '';
    if (doble) {
      if (dir > 0) {
        preparar(frente, k + 1, 'der'); preparar(dorso, k + 2, 'izq'); preparar(debajo, k + 3, 'der');
        hoja.style.left = debajo.style.left = `${P}px`; hoja.style.transformOrigin = '0 50%'; hasta = -180;
      } else {
        preparar(frente, k, 'izq'); preparar(dorso, k - 1, 'der'); preparar(debajo, k - 2, 'izq');
        hoja.style.left = debajo.style.left = '0px'; hoja.style.transformOrigin = '100% 50%'; hasta = 180;
      }
    } else {
      hoja.style.left = debajo.style.left = '0px'; hoja.style.transformOrigin = '0 50%';
      if (dir > 0) { preparar(frente, k, 'der'); preparar(dorso, -1, 'izq'); preparar(debajo, k + 1, 'der'); hasta = -180; }
      else { preparar(frente, k - 1, 'der'); preparar(dorso, -1, 'izq'); preparar(debajo, k, 'der'); desde = -180; }
    }
    gsap.set(hoja, { rotationY: desde, visibility: 'visible' });
    gsap.set(debajo, { visibility: 'visible' });
    const luz = () => {
      const a = Math.abs(gsap.getProperty(hoja, 'rotationY')) / 180;   // 0 tumbada a un lado, 1 al otro
      const alzada = Math.sin(a * Math.PI);                              // 1 de pie
      frente.style.setProperty('--sombra', (a * 0.9).toFixed(3));
      dorso.style.setProperty('--sombra', ((1 - a) * 0.9).toFixed(3));
      debajo.style.setProperty('--sombra', (doble || dir > 0 ? (1 - a) * 0.55 * (0.4 + alzada) : a * 0.4).toFixed(3));
    };
    luz();
    return new Promise((listo) => {
      gsap.to(hoja, {
        rotationY: hasta, duration: duracion, ease: duracion < 0.5 ? 'power1.inOut' : 'power2.inOut', onUpdate: luz,
        onComplete: () => {
          mostrar(k + dir * paso());
          gsap.set([hoja, debajo], { visibility: 'hidden' });
          listo();
        },
      });
    });
  }

  async function pasar(dir, { duracion = 0.95, conSonido = true } = {}) {
    const destino = actual + dir * paso();
    if (destino < 0 || destino > total - 1) { empujon(dir); return; }
    if (girando) { pendiente = dir; return; }
    cerrarNota();
    if (reducido) { mostrar(destino); return; }
    girando = true;
    if (conSonido) sonido.pasa(dir > 0 ? 0.72 : 0.28);
    await girar(dir, duracion);
    girando = false;
    if (pendiente) { const d = pendiente; pendiente = 0; pasar(d); }
  }

  // Ir lejos: el libro se hojea (hasta seis hojas, cada vez más deprisa) y el resto se salta
  async function irA(k) {
    const destino = inicio(limitar(k, 0, total - 1));
    if (destino === actual || girando) return;
    cerrarNota();
    if (reducido) { mostrar(destino); return; }
    const dir = Math.sign(destino - actual);
    let hojas = Math.abs(destino - actual) / paso();
    if (hojas > 6) { mostrar(destino - dir * 6 * paso()); hojas = 6; }
    if (hojas === 1) { pasar(dir); return; }
    girando = true;
    hojeando = true;
    for (let i = 0; i < hojas; i++) {
      sonido.tic(0.6);
      await girar(dir, i === 0 ? 0.5 : 0.3);
    }
    girando = false;
    hojeando = false;
    mostrar(actual);
  }

  // Al final del libro (o al principio) no hay más hojas: el libro se mueve un poco y vuelve
  function empujon(dir) {
    if (reducido) return;
    gsap.fromTo(libro, { x: 0 }, { x: -dir * 10, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1 });
  }

  // --- Lo que mueve el libro ---------------------------------------------------------------------------------------
  // La rueda: un gesto, una hoja. La inercia del touchpad llega como un chorro de golpes cada vez menores y es el mismo
  // gesto; un deslizamiento nuevo encima de la cola crece de golpe, y ese sí cuenta (como en la cinta)
  let ultimaRueda = 0, gastado = false, acumulado = 0, magAnterior = 0;
  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();
    let v = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (e.deltaMode === 1) v *= 33;
    else if (e.deltaMode === 2) v *= innerHeight;
    const ahora = performance.now(), mag = Math.abs(v);
    const nuevo = ahora - ultimaRueda > 200 || (gastado && mag > 24 && mag > magAnterior * 1.6 + 4);
    ultimaRueda = ahora; magAnterior = mag;
    if (nuevo) { gastado = false; acumulado = 0; }
    if (gastado) return;
    acumulado += v;
    if (Math.abs(acumulado) > 28) { gastado = true; pasar(Math.sign(acumulado)); }
  }, { passive: false });

  addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const enControl = e.target.closest?.('a, button, input, textarea, select');
    const tecla = e.key;
    if (['ArrowRight', 'PageDown'].includes(tecla) || (tecla === ' ' && !enControl && !e.shiftKey)) { e.preventDefault(); pasar(1); }
    else if (['ArrowLeft', 'PageUp'].includes(tecla) || (tecla === ' ' && !enControl && e.shiftKey)) { e.preventDefault(); pasar(-1); }
    else if (tecla === 'Home') { e.preventDefault(); irA(0); }
    else if (tecla === 'End') { e.preventDefault(); irA(total - 1); }
  });

  // Deslizar con el dedo: hacia la izquierda, la siguiente
  let toque = null;
  libro.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') toque = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  libro.addEventListener('pointerup', (e) => {
    if (!toque) return;
    const dx = e.clientX - toque.x, dy = e.clientY - toque.y;
    const rapido = performance.now() - toque.t < 700;
    if (rapido && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) pasar(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) tocarNota(e);
    toque = null;
  });

  $$('[data-lib-borde]').forEach((b) => {
    b.addEventListener('click', () => pasar(Number(b.dataset.libBorde)));
    b.addEventListener('pointerenter', () => cursor.decir(b.dataset.libBorde === '1' ? 'Pasa la página' : 'Vuelve atrás'));
  });
  $$('[data-lib-paso]').forEach((b) => b.addEventListener('click', () => pasar(Number(b.dataset.libPaso))));

  // El sumario, los capítulos de abajo y las referencias: se hojea hasta la página (y la dirección lo dice)
  raiz.addEventListener('click', (e) => {
    const a = e.target.closest('[data-ir]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const k = mapa[a.dataset.ir];
    if (k == null) return;
    e.preventDefault();
    irA(k);
  });

  // Con el teclado, el foco puede ir a un enlace de otra página: el libro se abre por ella
  tira.addEventListener('focusin', (e) => {
    ventana.scrollLeft = 0;
    const x = e.target.getBoundingClientRect().left - tira.getBoundingClientRect().left;
    const k = Math.floor(x / P);
    if (k < actual || k >= actual + paso()) mostrar(k);
  });
  ventana.addEventListener('scroll', () => { ventana.scrollLeft = 0; });

  // --- El inspector: la nota en cristiano del párrafo y lo medido -------------------------------------------------
  const insp = $('[data-lib-insp]'), marco = $('[data-lib-marco]'), guia = $('[data-lib-guia]');
  const notaTxt = $('[data-lib-insp-nota]'), medida = $('[data-lib-insp-medida]');
  let notaAbierta = null, temporizadorNota = 0;

  function trozosVisibles(el) {
    const v = ventana.getBoundingClientRect();
    return [...el.getClientRects()].filter((r) => r.width > 2 && r.right > v.left + 2 && r.left < v.right - 2);
  }

  function abrirNota(el, { abajo = false } = {}) {
    const trozos = trozosVisibles(el);
    if (!trozos.length) return;
    notaAbierta = el;
    const r = trozos.reduce((u, t) => ({ left: Math.min(u.left, t.left), top: Math.min(u.top, t.top), right: Math.max(u.right, t.right), bottom: Math.max(u.bottom, t.bottom) }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
    const lb = libro.getBoundingClientRect();
    const izquierda = (r.left + r.right) / 2 < lb.left + lb.width / 2;
    const cols = el.closest('.lib__cols');
    const lh = cols ? parseFloat(getComputedStyle(cols).lineHeight) : 24;
    const fs = cols ? parseFloat(getComputedStyle(cols).fontSize) : 16;
    const lineas = Math.max(1, Math.round(trozos.reduce((s, t) => s + t.height, 0) / lh));
    const ap = el.closest('.lib__ap');
    const num = ap ? $('.lib__ap-num', ap).textContent : '';
    const xTira = r.left - tira.getBoundingClientRect().left;
    const folio = Math.floor(xTira / P) + 1;
    notaTxt.textContent = el.dataset.nota;
    medida.textContent = `¶ ${num} · ${lineas} ${lineas === 1 ? 'línea' : 'líneas'} · pág. ${folio}\nGaramond ${fs.toFixed(1).replace('.', ',')} / ${lh.toFixed(1).replace('.', ',')} px`;

    marco.style.transform = `translate(${r.left - 6}px, ${r.top - 5}px)`;
    marco.style.width = `${r.right - r.left + 12}px`;
    marco.style.height = `${r.bottom - r.top + 10}px`;
    marco.classList.add('es-visible');

    const { ancho, hueco } = INSP;
    const alto = insp.offsetHeight || 120;
    let x = izquierda ? lb.left - ancho - hueco : lb.right + hueco;
    const cabe = izquierda ? x >= 12 : x + ancho <= innerWidth - 12;
    insp.classList.toggle('es-abajo', abajo || !cabe);
    if (abajo || !cabe) {
      // Sin sitio a los lados (o con el dedo): la caja va abajo, sin guía
      insp.style.transform = '';
      insp.style.left = `${Math.max(12, (innerWidth - Math.min(420, innerWidth - 24)) / 2)}px`;
      insp.style.top = 'auto';
      insp.style.bottom = `${(innerWidth <= 760 ? 70 : 84)}px`;
      guia.classList.remove('es-visible');
    } else {
      const y = limitar(r.top - 4, 70, innerHeight - alto - 70);
      insp.style.left = `${x}px`; insp.style.top = `${y}px`; insp.style.bottom = 'auto';
      const x1 = izquierda ? r.left - 6 : r.right + 6, y1 = r.top + 8;
      const x2 = izquierda ? x + ancho : x, y2 = y + 14;
      const xm = izquierda ? lb.left - hueco / 2 : lb.right + hueco / 2;
      $('path', guia).setAttribute('d', `M${x1} ${y1} H${xm} V${y2} H${x2}`);
      guia.classList.add('es-visible');
    }
    insp.classList.add('es-visible');
  }

  function cerrarNota() {
    notaAbierta = null;
    clearTimeout(temporizadorNota);
    insp.classList.remove('es-visible');
    marco.classList.remove('es-visible');
    guia.classList.remove('es-visible');
  }

  if (conRaton) {
    tira.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-nota]');
      if (el && el !== notaAbierta && !girando) { abrirNota(el); sonido.tic(0.35); }
    });
    tira.addEventListener('pointerleave', cerrarNota);
  }
  function tocarNota(e) {
    if (conRaton) return;
    const el = e.target.closest?.('[data-nota]');
    if (!el || e.target.closest('a, button')) { cerrarNota(); return; }
    abrirNota(el, { abajo: true });
    clearTimeout(temporizadorNota);
    temporizadorNota = setTimeout(cerrarNota, 5000);
  }

  // --- Lo que tu navegador tiene guardado de esta web, leído en vivo -----------------------------------------------
  const almacen = $('[data-lib-almacen]', tira);
  const RELOJ = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const bytes = (t) => new TextEncoder().encode(t).length;
  const escapar = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const recortar = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

  function leerGuardado() {
    const claves = almacen ? JSON.parse(almacen.dataset.claves) : [];
    const nuestra = (k) => claves.includes(k) || k.startsWith('ads-') || k.startsWith('ads_') || /^_ga(_|$)|^_fbp$|^_gid$/.test(k);
    const filas = [];
    [['localStorage', () => localStorage], ['sessionStorage', () => sessionStorage]].forEach(([donde, st]) => {
      try {
        const s = st();
        for (let i = 0; i < s.length; i++) { const k = s.key(i); if (nuestra(k)) filas.push({ k, donde, v: s.getItem(k) ?? '' }); }
      } catch (e) { /* sin almacenamiento */ }
    });
    document.cookie.split(';').map((c) => c.trim()).filter(Boolean).forEach((c) => {
      const i = c.indexOf('=');
      const k = i < 0 ? c : c.slice(0, i);
      if (nuestra(k)) filas.push({ k, donde: 'cookie', v: i < 0 ? '' : c.slice(i + 1) });
    });
    return filas;
  }

  function pintarAlmacen() {
    if (!almacen) return;
    const filas = leerGuardado();
    const cuerpo = $('[data-lib-almacen-filas]', almacen);
    cuerpo.innerHTML = filas.length
      ? filas.map((f) => `<tr><td><code>${escapar(f.k)}</code><small>${f.donde}</small></td><td>${escapar(recortar(f.v, 38))}</td><td>${bytes(f.k + f.v)}</td></tr>`).join('')
      : '<tr><td colspan="3"><i>Nada. Tu navegador no tiene guardado nada de esta web.</i></td></tr>';
    const suma = filas.reduce((s, f) => s + bytes(f.k + f.v), 0);
    $('[data-lib-almacen-total]', almacen).textContent = `${filas.length} ${filas.length === 1 ? 'cosa' : 'cosas'} · ${suma} bytes · leído a las ${RELOJ.format(new Date())}`;
  }

  // Borrar lo nuestro: las claves de la web y, si las hubiera, las cookies de Google y de Meta
  function borrarGuardado() {
    const filas = leerGuardado();
    filas.forEach(({ k, donde }) => {
      try {
        if (donde === 'localStorage') localStorage.removeItem(k);
        else if (donde === 'sessionStorage') sessionStorage.removeItem(k);
        else borrarCookie(k);
      } catch (e) { /* nada */ }
    });
    document.dispatchEvent(new CustomEvent('ads:consentimiento-borrado'));
    sonido.tic(1);
    pintarAlmacen();
    pintarEleccion();
  }

  const eleccion = $('[data-lib-eleccion]', tira);
  function pintarEleccion() {
    if (!eleccion) return;
    let c = null;
    try { c = JSON.parse(localStorage.getItem('ads-consentimiento')); } catch (e) { /* nada */ }
    eleccion.textContent = !c ? 'Aún no has elegido: no se mide nada.'
      : `Elegiste: medición ${c.medicion ? 'sí' : 'no'} y campañas ${c.campanas ? 'sí' : 'no'}.`;
  }

  if (almacen) {
    pintarAlmacen();
    $('[data-lib-borrar]', almacen).addEventListener('click', borrarGuardado);
    // Lo que cambie en otra pestaña (o al elegir en el aviso), al momento
    addEventListener('storage', pintarAlmacen);
    setInterval(() => { if (!document.hidden) pintarAlmacen(); }, 4000);
  }
  pintarEleccion();
  $('[data-lib-elegir]', tira)?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('ads:elegir')));
  document.addEventListener('ads:consentimiento', () => { pintarEleccion(); pintarAlmacen(); });

  // --- Arranque: maquetar y abrir el libro por su capítulo (o por el apartado de la dirección) ---------------------
  function destinoInicial() {
    const ancla = decodeURIComponent(location.hash.slice(1));
    if (ancla && mapa[ancla] != null) return mapa[ancla];
    return mapa[raiz.dataset.abrir] ?? 0;
  }

  // Al cambiar el tamaño, el libro se vuelve a paginar y se queda en el mismo sitio: la página donde cae ahora lo
  // primero que se leía (un título o un párrafo)
  const paginaDe = (el) => Math.floor((el.getClientRects()[0].left - tira.getBoundingClientRect().left + 1) / P);
  const relayout = () => {
    const v = ventana.getBoundingClientRect();
    const ancla = $$('h3, [data-nota], .lib__pag', tira).find((el) => {
      const r = el.getClientRects()[0];
      return r && r.left >= v.left - 1 && r.left < v.right - 1;
    });
    cerrarNota();
    gsap.killTweensOf(hoja);
    gsap.set([hoja, debajo], { visibility: 'hidden' });
    girando = false;
    maquetar();
    mostrar(ancla && !ancla.hidden ? paginaDe(ancla) : actual);
  };

  const listo = () => {
    maquetar();
    const destino = destinoInicial();
    if (reducido || destino < paso()) { mostrar(destino); return; }
    // El libro se abre por el sumario y se hojea hasta su capítulo
    mostrar(0);
    setTimeout(() => irA(destino), 650);
  };
  // Las letras tienen que estar para medir: con las de recambio (más anchas) un capítulo sale con una página de más.
  // Se piden las del libro y se espera a que lleguen; si tardan, se maqueta igual y se vuelve a paginar cuando llegue
  // cualquier letra (la Geist Mono viene con el JS de pagina.js, después que las demás)
  let temporizador = 0;
  const repaginar = () => { clearTimeout(temporizador); temporizador = setTimeout(relayout, 180); };
  let hecho = false;
  const una = () => { if (!hecho) { hecho = true; listo(); } };
  const LETRAS = ['300 16px "Apple Garamond"', '400 16px "Apple Garamond"', 'italic 400 16px "Apple Garamond"', '400 11px "Geist Mono"', '400 15px "Open Sauce"'];
  Promise.all(LETRAS.map((l) => document.fonts.load(l))).then(() => { if (hecho) repaginar(); else una(); }, una);
  setTimeout(una, 1500);
  document.fonts.addEventListener?.('loadingdone', () => { if (hecho) repaginar(); });

  addEventListener('resize', repaginar);

  // Al imprimir, el artículo de siempre (sin libro)
  addEventListener('beforeprint', () => { delete raiz.dataset.modo; });
  addEventListener('afterprint', relayout);
}
