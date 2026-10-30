// Misión de «Observa»: pregúntale a la cafetería de ejemplo cómo le va. Eliges una pregunta y mantienes pulsado el botón
// (como una nota de voz): la pregunta se escribe mientras aprietas y, si sueltas antes, se borra. Al completarla, el
// asistente hace lo que hizo de verdad en la grabación (src/data/preguntas.json, scripts/grabar-pregunta.mjs): decide
// qué consultar, lo consulta (la consulta queda a la vista) y contesta con la cifra y la gráfica.
// Los pasos se reproducen algo más deprisa que en la grabación; el tiempo que se enseña es el real.
import { gsap } from 'gsap';
import GRABACION from '../../data/preguntas.json';
import { NEGOCIO } from '../../data/negocio.js';

const CSS = `
.mpre { position: absolute; inset: 0; display: grid; place-items: center; user-select: none; -webkit-user-select: none; }
.mpre__panel { position: relative; display: flex; flex-direction: column; border: 1px solid rgba(231,226,218,.55); background: rgba(18,13,10,.82);
  font-family: var(--mono); color: var(--crema-2); letter-spacing: .03em; }
.mpre__cab { display: flex; align-items: center; gap: .9em; padding: .9em 1.2em; border-bottom: 1px solid rgba(231,226,218,.18); font-size: .78em; letter-spacing: .16em; text-transform: uppercase; color: var(--crema-2); }
.mpre__punto { width: .55em; height: .55em; border-radius: 50%; background: var(--rosa); box-shadow: 0 0 10px rgba(245,203,215,.8); }
.mpre__ejemplo { margin-left: auto; padding: .15em .6em; border: 1px solid var(--crema-3); font-size: .9em; color: var(--crema-3); }
.mpre__chat { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: none; padding: 1em 1.2em; display: flex; flex-direction: column; gap: .8em; }
.mpre__chat::-webkit-scrollbar { display: none; }
.mpre__vacio { margin: auto; max-width: 26em; text-align: center; font-size: .82em; line-height: 1.7; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-3); }
.mpre__yo { align-self: flex-end; max-width: 80%; margin: 0; padding: .6em .9em; border: 1px solid var(--rosa); color: var(--crema); font-size: .92em; }
.mpre__paso { margin: 0; padding-left: .9em; border-left: 1px solid rgba(245,203,215,.5); display: grid; gap: .3em; font-size: .74em; line-height: 1.5; color: var(--crema-3); }
.mpre__paso b { font-weight: 400; color: var(--rosa); letter-spacing: .12em; text-transform: uppercase; }
.mpre__paso code { font-family: inherit; color: var(--crema-2); word-break: break-word; }
.mpre__paso .mpre__res { color: var(--crema); }
.mpre__paso.es-corto code { display: none; }
.mpre__piensa { font-size: .74em; color: var(--crema-3); letter-spacing: .14em; text-transform: uppercase; }
.mpre__piensa i { font-style: normal; animation: mpre-p 1s steps(4) infinite; display: inline-block; width: 1.6em; overflow: hidden; vertical-align: bottom; white-space: nowrap; }
@keyframes mpre-p { from { width: 0; } to { width: 1.6em; } }
.mpre__resp { display: grid; gap: .5em; }
.mpre__cifra { margin: 0; font-size: 1.75em; line-height: 1; letter-spacing: -.01em; color: var(--crema); }
.mpre__frase { margin: 0; font-family: var(--sans, inherit); font-size: .92em; line-height: 1.6; color: var(--crema-2); letter-spacing: 0; }
.mpre__graf { width: 100%; max-width: 360px; height: auto; overflow: visible; }
.mpre__graf text { font-family: var(--mono); fill: var(--crema-3); }
.mpre__graf .v { fill: var(--crema-2); }
.mpre__graf-t { margin: 0; font-size: .68em; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.mpre__pie { border-top: 1px solid rgba(231,226,218,.18); padding: .8em 1.2em 1em; display: grid; gap: .8em; }
.mpre__chips { display: flex; flex-wrap: wrap; gap: .45em; }
.mpre__chip { padding: .4em .75em; border: 1px solid rgba(231,226,218,.3); font-family: inherit; font-size: .74em; letter-spacing: .04em; color: var(--crema-2); transition: border-color .3s, color .3s, background .3s; }
.mpre__chip:hover { border-color: var(--crema); color: var(--crema); }
.mpre__chip[aria-pressed='true'] { border-color: var(--rosa); color: var(--tinta); background: var(--rosa); }
.mpre__entrada { display: flex; align-items: center; gap: .9em; }
.mpre__boton { position: relative; flex: none; width: 3.4em; height: 3.4em; border-radius: 50%; border: 1px solid rgba(231,226,218,.5); display: grid; place-items: center; cursor: pointer; touch-action: none; transition: border-color .3s, transform .4s var(--curva); }
.mpre__boton:hover { border-color: var(--crema); }
.mpre__boton.es-pulsado { transform: scale(.94); border-color: var(--rosa); }
.mpre__boton::before { content: ''; width: .8em; height: .8em; border-radius: 50%; background: var(--rosa); }
.mpre__boton svg { position: absolute; inset: -4px; width: calc(100% + 8px); height: calc(100% + 8px); transform: rotate(-90deg); pointer-events: none; }
.mpre__boton circle { fill: none; stroke: var(--rosa); stroke-width: 2; }
.mpre__boton[disabled] { opacity: .35; cursor: default; }
.mpre__linea { flex: 1; min-width: 0; padding: .55em 0; border-bottom: 1px solid rgba(231,226,218,.3); font-size: .9em; color: var(--crema); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mpre__linea.es-pista { color: var(--crema-3); }
.mpre__linea u { text-decoration: none; display: inline-block; width: .55em; height: 1em; margin-left: .1em; vertical-align: -.12em; background: var(--rosa); animation: mpre-c 1s steps(2) infinite; }
@keyframes mpre-c { 50% { opacity: 0; } }
.mpre-ley { font-family: var(--mono); }
.mpre-ley__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mpre-ley ol { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(231,226,218,.25); }
.mpre-ley li { display: grid; grid-template-columns: 1.6em 1fr; padding: 8px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 10.5px; line-height: 1.5; color: var(--crema-2); }
.mpre-ley li span { color: var(--rosa); }
.mpre-ley__ok { margin: 14px 0 0; font-size: 10px; line-height: 1.6; letter-spacing: .08em; color: var(--crema-2); }
.mpre-ley__ok b { font-weight: 400; color: var(--rosa); }
`;

let estilos = false;
const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const eur = (n) => `${miles(n)} €`;
const eur2 = (n) => `${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d),)/g, '.')} €`;
const segundos = (ms) => `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
// El nombre corto de cada pregunta grabada, para los botones (la pregunta entera se escribe en la línea)
const CHIP = ['Ventas de octubre', 'Lo más vendido', 'Frente a septiembre'];
const POR = { dia: 'por día', semana: 'por semana', mes: 'por mes', producto: 'por producto' };
const corta = (f) => `${Number(f.slice(8, 10))}/${Number(f.slice(5, 7))}`;

// La gráfica de barras de la respuesta, en SVG, con su valor encima de cada barra
function grafica({ etiquetas, valores }) {
  const W = 300, H = 96, base = 78, alto = 58, n = valores.length, paso = W / n, ancho = Math.min(34, paso * 0.56);
  const max = Math.max(...valores);
  const letras = Math.floor(paso / 5.6);   // lo que cabe de cada etiqueta debajo de su barra
  const corto = (e) => (e.length > letras ? `${e.slice(0, letras - 1)}.` : e);
  const barras = valores.map((v, k) => {
    const h = Math.max(2, (v / max) * alto), x = paso * k + (paso - ancho) / 2;
    return `<g><rect x="${x}" y="${base - h}" width="${ancho}" height="${h}" data-y="${base - h}" data-h="${h}" fill="rgba(245,203,215,.16)" stroke="var(--rosa)" stroke-width="1"/>
      <text class="v" x="${x + ancho / 2}" y="${base - h - 6}" text-anchor="middle" font-size="9">${miles(v)}</text>
      <text x="${x + ancho / 2}" y="${base + 14}" text-anchor="middle" font-size="9">${corto(etiquetas[k])}</text></g>`;
  }).join('');
  return `<svg class="mpre__graf" viewBox="0 0 ${W} ${H}" aria-hidden="true"><line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="rgba(231,226,218,.35)"/>${barras}</svg>`;
}

export async function montar(zona, { mision, panel, sonido, reducido }) {
  if (!estilos) { const s = document.createElement('style'); s.textContent = CSS; document.head.append(s); estilos = true; }
  const P = GRABACION.preguntas;
  const D = reducido ? 0 : 1;
  const raiz = document.createElement('div');
  raiz.className = 'mpre';
  raiz.innerHTML = `
    <div class="mpre__panel" data-panel>
      <div class="mpre__cab"><span class="mpre__punto"></span>${NEGOCIO.nombre} · tu asistente<span class="mpre__ejemplo">Ejemplo</span></div>
      <div class="mpre__chat" data-chat aria-live="polite"><p class="mpre__vacio">Elige una pregunta y mantén pulsado el botón para hacerla</p></div>
      <div class="mpre__pie">
        <div class="mpre__chips">${P.map((q, k) => `<button type="button" class="mpre__chip" data-chip="${k}" aria-pressed="${k === 0}" aria-label="${q.pregunta}">${CHIP[k] || q.pregunta}</button>`).join('')}</div>
        <div class="mpre__entrada">
          <button type="button" class="mpre__boton" data-boton aria-label="Mantén pulsado para preguntar"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" data-aro/></svg></button>
          <span class="mpre__linea es-pista" data-linea></span>
        </div>
      </div>
    </div>`;
  zona.append(raiz);
  const caja = raiz.querySelector('[data-panel]');
  const chat = raiz.querySelector('[data-chat]');
  const boton = raiz.querySelector('[data-boton]');
  const linea = raiz.querySelector('[data-linea]');
  const aro = raiz.querySelector('[data-aro]');
  const chips = [...raiz.querySelectorAll('[data-chip]')];
  const LARGO = 2 * Math.PI * 18.5;
  aro.style.strokeDasharray = `${LARGO}`;

  // El tamaño: el de la zona; en el móvil, el hueco entre la orden de arriba y la explicación de abajo
  const medir = () => {
    const movil = innerWidth <= 760;
    const w = movil ? innerWidth - 24 : zona.clientWidth;
    const h = movil ? Math.max(300, innerHeight - 372) : zona.clientHeight;
    Object.assign(caja.style, movil ? { position: 'fixed', left: '12px', top: '200px' } : { position: '', left: '', top: '' });
    Object.assign(caja.style, { width: `${w}px`, height: `${h}px`, fontSize: `${Math.max(10.5, Math.min(14, h / 32))}px` });
  };
  medir();
  addEventListener('resize', medir);

  let elegida = 0, p = 0, ocupado = false, apretando = false, mando = null, raf = 0, vivo = true;
  const pintarLinea = () => {
    const q = P[elegida].pregunta;
    const n = Math.round(p * q.length);
    linea.classList.toggle('es-pista', n === 0);
    linea.innerHTML = n === 0 ? q : `${q.slice(0, n)}<u></u>`;
    aro.style.strokeDashoffset = `${LARGO * (1 - p)}`;
  };
  pintarLinea();
  chips.forEach((c) => c.addEventListener('click', () => {
    if (ocupado) return;
    elegida = Number(c.dataset.chip);
    chips.forEach((o) => o.setAttribute('aria-pressed', String(o === c)));
    p = 0;
    pintarLinea();
    sonido.tic(0.7);
  }));
  panel.gesto(mision.gesto);

  // Mantener pulsado: la pregunta se escribe; soltar antes la borra
  const DURA = 1.15;
  const avanzar = (antes) => (ahora) => {
    if (!vivo) return;
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    p = Math.max(0, Math.min(1, p + (apretando ? dt / DURA : -dt / 0.35)));
    mando?.avance(p);
    pintarLinea();
    if (apretando && p >= 1) { enviar(); return; }
    if (apretando || p > 0) raf = requestAnimationFrame(avanzar(ahora));
  };
  const apretar = (e) => {
    if (ocupado) return;
    e.preventDefault();
    boton.setPointerCapture?.(e.pointerId);
    apretando = true;
    boton.classList.add('es-pulsado');
    mando = sonido.subida();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(avanzar(performance.now()));
  };
  const soltar = () => {
    if (!apretando) return;
    apretando = false;
    boton.classList.remove('es-pulsado');
    if (!ocupado) { mando?.soltar(false); mando = null; }
  };
  boton.addEventListener('pointerdown', apretar);
  boton.addEventListener('pointerup', soltar);
  boton.addEventListener('pointercancel', soltar);
  boton.addEventListener('lostpointercapture', soltar);
  // Con el teclado, Intro o espacio la hacen de una vez
  boton.addEventListener('keydown', (e) => {
    if (ocupado || !['Enter', ' '].includes(e.key)) return;
    e.preventDefault();
    p = 1;
    pintarLinea();
    enviar();
  });

  const espera = (ms) => new Promise((r) => setTimeout(r, ms * D));
  const bajar = () => { chat.scrollTop = chat.scrollHeight; };
  const meter = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    const el = t.content.firstElementChild;
    chat.append(el);
    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 * D, ease: 'power3.out' });
    bajar();
    return el;
  };
  const escribir = async (el, texto, cada = 16) => {
    for (let c = 1; c <= texto.length; c++) {
      if (!vivo) return;
      el.textContent = texto.slice(0, c);
      if (c % 3 === 0) sonido.tecla(0.35);
      if (D) await new Promise((r) => setTimeout(r, cada));
    }
    bajar();
  };

  async function enviar() {
    if (ocupado) return;
    ocupado = true;
    apretando = false;
    boton.classList.remove('es-pulsado');
    boton.disabled = true;
    mando?.soltar(true);
    mando = null;
    const q = P[elegida];
    panel.gesto('');
    panel.orden(mision.curso, true);
    chat.replaceChildren();
    meter(`<p class="mpre__yo">${q.pregunta}</p>`);
    p = 0;
    pintarLinea();

    // Lo que hizo el asistente, paso a paso
    for (const paso of q.pasos) {
      const piensa = meter('<p class="mpre__piensa">Pensando qué consultar<i>...</i></p>');
      await espera(Math.min(1500, paso.ms * 0.3));
      piensa.remove();
      const e = paso.entrada;
      const bloque = meter(`<div class="mpre__paso"><b>▸ Consulta a tus datos</b><code data-a></code><code data-b></code><span class="mpre__res" data-c></span></div>`);
      sonido.nota(2);
      await escribir(bloque.querySelector('[data-a]'), `ventas · ${corta(e.desde)} a ${corta(e.hasta)} · ${POR[e.agrupar_por] || e.agrupar_por}`, 10);
      await escribir(bloque.querySelector('[data-b]'), paso.consulta, 4);
      await espera(350);
      bloque.querySelector('[data-c]').textContent = `← ${paso.filas} fila${paso.filas === 1 ? '' : 's'} · total ${eur2(paso.total)}`;
      sonido.nota(4);
      bajar();
      await espera(400);
    }
    const piensa = meter('<p class="mpre__piensa">Escribiendo la respuesta<i>...</i></p>');
    await espera(Math.min(1300, (q.msRespuesta || 1500) * 0.3));
    piensa.remove();

    // La respuesta: la cifra, la frase y la gráfica, que crece barra a barra
    const r = q.respuesta;
    const resp = meter(`<div class="mpre__resp"><p class="mpre__cifra">${r.cifra}</p><p class="mpre__frase" data-frase></p>${grafica(r.grafica)}<p class="mpre__graf-t">${r.grafica.titulo}</p></div>`);
    // Las barras crecen desde la base (por atributos: el SVG no se escala)
    const rects = [...resp.querySelectorAll('rect')];
    rects.forEach((rc, k) => {
      const y = Number(rc.dataset.y), h = Number(rc.dataset.h);
      gsap.fromTo(rc, { attr: { y: y + h, height: 0 } }, { attr: { y, height: h }, duration: 0.6 * D, delay: (0.15 + k * 0.09) * D, ease: 'power3.out', onStart: () => sonido.nota(k % 5) });
    });
    // Los pasos se quedan en una línea, para que quepa la respuesta
    chat.querySelectorAll('.mpre__paso').forEach((x) => x.classList.add('es-corto'));
    await escribir(resp.querySelector('[data-frase]'), r.texto, 14);
    if (!vivo) return;

    panel.orden(mision.veredicto, true);
    sonido.ok();
    const ley = document.createElement('div');
    ley.className = 'mpre-ley';
    const pasos = q.pasos.map((s) => `<li><span>·</span>Consultar ventas, ${corta(s.entrada.desde)} a ${corta(s.entrada.hasta)}, ${POR[s.entrada.agrupar_por] || s.entrada.agrupar_por}</li>`).join('');
    ley.innerHTML = `<p class="mpre-ley__t">Lo que ha hecho</p><ol><li><span>·</span>Entender la pregunta</li>${pasos}<li><span>·</span>Contestar: ${r.cifra}, con su gráfica</li></ol>
      <p class="mpre-ley__ok">Cada cifra sale de la consulta<br>Respondido con IA en <b>${segundos(q.ms)}</b></p>`;
    panel.leyenda(ley);
    panel.hecha(mision.explica);
    ocupado = false;
    boton.disabled = false;
  }

  return {
    destruir() {
      vivo = false;
      cancelAnimationFrame(raf);
      mando?.soltar(false);
      removeEventListener('resize', medir);
      raiz.remove();
    },
  };
}
