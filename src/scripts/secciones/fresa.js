// FRESA, en cuatro partes:
// - La conversación: una sola, compartida por la ventana y la sección (lo que se pregunta en una sale en la otra).
//   Habla con el backend público de ventas (fresa-ventas, sin acceso a nada privado), por SSE. Si no responde,
//   WhatsApp y el correo, y esa pregunta no entra en el historial.
// - La ventana: el globo de abajo a la izquierda la abre donde estés, construida como un dibujo técnico (guías que
//   se trazan, asas, cotas con su medida real, el borde que se dibuja, un rayado y el panel que se revela). Sin
//   mensajes ni sugerencias: solo la caja para escribir.
// - El muro: la página acaba de verdad en el contacto (la sección de FRESA está fuera del flujo, «sellada»). Al seguir
//   empujando hacia abajo, el contacto se levanta un poco y vuelve a caer; hacen falta varios empujones seguidos para
//   que se rompa, entre FRESA en el flujo y la página baje hasta ella. Si se vuelve arriba, se sella otra vez.
//   Sin Lenis (movimiento reducido) no hay muro.
// - La sección: cuando FRESA se destapa, el globo vuela hasta la píldora grande y se convierte en ella (y al volver
//   arriba, hace el camino al revés). Allí las sugerencias se escriben y se borran dentro de la caja.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';

const API = window.__CHAT_API__ || 'https://fresa-ventas-production.up.railway.app/api/chat-ventas';
const CLAVE = 'ads_chat_history';
const MAX_TURNOS = 20;
const FALLO = 'Ahora mismo no puedo contestar. Escríbenos por WhatsApp (https://wa.me/34633565840) o a adsgroup@ads-partners.com y te responde una persona.';
const LIMITE = 'Hemos hablado mucho por aquí. Para seguir, mejor con una persona: WhatsApp o adsgroup@ads-partners.com.';
const SUGERENCIAS = ['¿Qué hacéis exactamente?', '¿Cómo empezamos?', '¿Cuánto cuesta?', '¿Me hacéis una web?', '¿Podéis automatizar mis facturas?'];
const EMPUJES = ['Hay algo más abajo.', 'Empuja otra vez.', 'Casi…'];

// --- La conversación ---------------------------------------------------------------------
// fallo: la pregunta que no se contestó y su aviso; se ven en pantalla pero no se guardan ni se mandan
const chat = { mensajes: leer(), ocupado: false, vistas: new Set() };
const avisar = () => chat.vistas.forEach((v) => v());

async function preguntar(q) {
  const texto = String(q || '').trim();
  if (!texto || chat.ocupado) return;
  if (chat.mensajes.filter((m) => m.role === 'user' && !m.fallo).length >= MAX_TURNOS) {
    chat.mensajes.push({ role: 'assistant', text: LIMITE, fallo: true }); avisar(); return;
  }
  chat.ocupado = true;
  sonido.tic(0.8);
  const yo = { role: 'user', text: texto };
  const ella = { role: 'assistant', text: '', pensando: true };
  chat.mensajes.push(yo, ella);
  avisar();
  // El texto llega a trozos: se repinta como mucho una vez por fotograma
  let pendiente = false;
  const pintarPronto = () => { if (pendiente) return; pendiente = true; requestAnimationFrame(() => { pendiente = false; avisar(); }); };
  try {
    const historial = chat.mensajes.filter((m) => !m.fallo && m !== ella).map((m) => ({ role: m.role, content: m.text }));
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: historial, turnstileToken: '', lang: 'es' }),
    });
    if (!res.ok || !res.body) throw new Error('respuesta mala');
    const lector = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    for (;;) {
      const { value, done } = await lector.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const partes = buf.split('\n\n');
      buf = partes.pop() || '';
      for (const parte of partes) {
        if (!parte || parte[0] === ':') continue;   // latido «: keepalive»
        const linea = parte.replace(/^data:\s?/, '');
        let ev; try { ev = JSON.parse(linea); } catch (e) { continue; }
        if (ev.type === 'text') { ella.text += ev.text; ella.pensando = false; pintarPronto(); }
      }
    }
    if (!ella.text) throw new Error('vacía');
  } catch (e) {
    // Si no contestó, la pregunta no entra en el historial (así se puede volver a intentar)
    ella.text = FALLO; yo.fallo = true; ella.fallo = true;
  } finally {
    ella.pensando = false;
    chat.ocupado = false;
    guardar(chat.mensajes.filter((m) => !m.fallo));
    avisar();
  }
}

// Una vista de la conversación (la ventana o la sección): crea lo que falta, quita lo que sobra y solo reescribe el
// texto que ha cambiado. alEnviar decide qué se pregunta (en la sección, con la caja vacía, la sugerencia que se ve)
function montarVista({ lista, form, input, enviar, vacia, alEnviar }) {
  const pintar = () => {
    const ms = chat.mensajes;
    while (lista.children.length > ms.length) lista.lastChild.remove();
    ms.forEach((m, i) => {
      let el = lista.children[i];
      if (!el) { el = document.createElement('p'); lista.appendChild(el); }
      const clase = `fr-msg fr-msg--${m.role === 'user' ? 'yo' : 'fresa'}${m.pensando ? ' fr-pensando' : ''}`;
      if (el.className !== clase) el.className = clase;
      if (el.dataset.texto !== m.text) { el.dataset.texto = m.text; pintarTexto(el, m.text); }
    });
    lista.scrollTop = lista.scrollHeight;
    enviar.disabled = chat.ocupado;
    if (vacia) vacia.hidden = ms.length > 0;
  };
  chat.vistas.add(pintar);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = alEnviar ? alEnviar() : input.value;
    input.value = '';
    preguntar(q);
  });
  pintar();
}

// Texto plano con los enlaces (http y correos) clicables
function pintarTexto(el, texto) {
  const seguro = texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  el.innerHTML = seguro
    .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');
}

// --- La ventana ------------------------------------------------------------------------------
function montarVentana({ globo, reducido }) {
  const v = document.querySelector('[data-fresa-ventana]');
  if (!v) return { abierta: () => false, abrir() {}, cerrar() {} };
  const q = (s) => v.querySelector(s);
  const qq = (s) => [...v.querySelectorAll(s)];
  const input = q('[data-fv-form] input');
  montarVista({ lista: q('[data-fv-lista]'), form: q('[data-fv-form]'), input, enviar: q('[data-fv-form] button'), vacia: q('[data-fv-vacia]') });

  const guiasH = qq('.fv__guia--h'), guiasV = qq('.fv__guia--v');
  const bordesH = qq('.fv__borde--h'), bordesV = qq('.fv__borde--v');
  const asas = qq('.fv__asa'), cotas = qq('[data-fv-cota]');
  const caja = q('.fv__caja'), rayado = q('.fv__rayado');
  const sobran = qq('[data-fv-sobra]');   // lo que se aparta al terminar (en reposo el plano queda asimétrico)
  let abierta = false, tl = null;

  // Las cotas dicen la medida real de la ventana y dónde está
  function medir() {
    const r = v.getBoundingClientRect();
    const valores = { ancho: `${Math.round(r.width)} px`, alto: `${Math.round(r.height)} px`, coord: `x ${Math.round(r.left)} · y ${Math.round(r.top)}` };
    cotas.forEach((c) => { c.dataset.txt = valores[c.dataset.fvCota]; });
  }
  function escribirCotas() {
    cotas.forEach((c) => {
      let n = 0; const txt = c.dataset.txt || '';
      const paso = () => { c.textContent = txt.slice(0, ++n); if (n < txt.length) setTimeout(paso, 18); };
      paso();
    });
  }

  function abrir() {
    if (abierta) return;
    abierta = true;
    globo.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('fresa-abierta');
    v.hidden = false;
    medir();
    tl?.kill();
    if (reducido) {
      gsap.set([...guiasH, ...guiasV, ...bordesH, ...bordesV, ...asas], { scale: 1, opacity: 1 });
      gsap.set(caja, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
      gsap.set(sobran, { opacity: 0 });
      escribirCotas();
      input.focus({ preventScroll: true });
      return;
    }
    sonido.abrir();
    tl = gsap.timeline({ onComplete: () => input.focus({ preventScroll: true }) })
      .set([...guiasH, ...guiasV, ...bordesH, ...bordesV, ...sobran], { opacity: 1 })
      .set(rayado, { opacity: 0 })
      .set(caja, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 })
      // 1. Las guías de construcción, desde la esquina del globo
      .fromTo(guiasH, { scaleX: 0 }, { scaleX: 1, duration: 0.42, stagger: 0.07, ease: 'power3.out' }, 0)
      .fromTo(guiasV, { scaleY: 0 }, { scaleY: 1, duration: 0.42, stagger: 0.07, ease: 'power3.out' }, 0.05)
      .fromTo(asas, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(3)' }, 0.18)
      .add(escribirCotas, 0.22)
      // 2. El borde, trazado como con un plóter (arriba, derecha, abajo, izquierda)
      .fromTo(bordesH[0], { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: 'none' }, 0.25)
      .fromTo(bordesV[1], { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: 'none' }, 0.47)
      .fromTo(bordesH[1], { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: 'none' }, 0.69)
      .fromTo(bordesV[0], { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: 'none' }, 0.91)
      // 3. El rayado de sección y, encima, el panel que se revela de arriba abajo
      .to(rayado, { opacity: 1, duration: 0.25 }, 0.5)
      .to(caja, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut' }, 0.95)
      .to(rayado, { opacity: 0, duration: 0.3 }, 1.35)
      // En reposo, el plano se queda asimétrico: se apartan algunas guías y cotas
      .to(sobran, { opacity: 0, duration: 0.4 }, 1.45)
      .add(() => sonido.tic(0.9), 1.1);
  }

  function cerrar(rapido = false) {
    if (!abierta) return;
    abierta = false;
    globo.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('fresa-abierta');
    tl?.kill();
    if (reducido || rapido) { v.hidden = true; return; }
    sonido.cerrar();
    tl = gsap.timeline({ onComplete: () => { v.hidden = true; } })
      .to(caja, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.3, ease: 'power3.in' }, 0)
      .to([...bordesH, ...bordesV], { scale: 0, duration: 0.25, ease: 'power2.in' }, 0.15)
      .to([...asas, ...cotas], { opacity: 0, duration: 0.2 }, 0.15)
      .to([...guiasH, ...guiasV], { scale: 0, duration: 0.3, ease: 'power3.in', stagger: 0.04 }, 0.2)
      .set([...asas, ...cotas], { opacity: 1 });
  }

  q('[data-fv-cerrar]').addEventListener('click', () => { cerrar(); globo.focus({ preventScroll: true }); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierta) { cerrar(); globo.focus({ preventScroll: true }); } });
  addEventListener('resize', () => { if (abierta) { medir(); cotas.forEach((c) => { c.textContent = c.dataset.txt; }); } });
  return { abierta: () => abierta, abrir, cerrar };
}

// --- El globo, el muro y la sección -------------------------------------------------------------
export function montarGlobo({ lenis, reducido }) {
  const globo = document.querySelector('[data-fresa-globo]');
  const sec = document.getElementById('fresa');
  const contacto = document.getElementById('contacto');
  if (!globo || !sec || !contacto) return;
  const pildora = globo.querySelector('[data-fresa-pildora]');
  const avatar = sec.querySelector('[data-fresa-avatar]');
  const aviso = sec.querySelector('[data-fresa-empuja]');
  const ventana = montarVentana({ globo, reducido });

  // El globo abre y cierra la ventana, estés donde estés
  globo.addEventListener('click', () => (ventana.abierta() ? ventana.cerrar() : ventana.abrir()));

  // --- El muro --------------------------------------------------------------------
  const muro = { sellado: !!lenis && !reducido, tension: 0, empuje: 0, ultimo: 0, n: 0, alto: 0, pico: 0, minimo: 0, frenado: false };
  if (muro.sellado) sec.classList.add('sellada');

  function romper(duracion = 1.6) {
    if (!muro.sellado) return;
    muro.sellado = false;
    sec.classList.remove('sellada');
    aviso.classList.remove('on');
    lenis.resize();
    sonido.rompe();
    gsap.to(muro, { alto: 0, duration: duracion * 0.6, ease: 'power2.out' });
    // Un fotograma después: el mismo gesto que rompe el muro lo procesa Lenis justo detrás y pisaría este scrollTo.
    // Bloqueado hasta llegar abajo (la inercia del trackpad tampoco lo frena)
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(lenis.limit, { duration: duracion, easing: (t) => 1 - Math.pow(1 - t, 3), force: true, lock: true });
    });
  }
  function sellar() {
    if (muro.sellado || !lenis || reducido) return;
    muro.sellado = true; muro.tension = 0; muro.n = 0;
    sec.classList.add('sellada');
    lenis.resize();
  }

  if (lenis && !reducido) {
    // Cada gesto (rueda, trackpad o dedo) es un empujón; dentro de un mismo gesto se suma como mucho 0,42.
    // Un empujón nuevo empieza tras un silencio (la rueda) o cuando el gesto vuelve a acelerar después de haber
    // frenado: el trackpad no se calla nunca (su inercia sigue mandando eventos) y el siguiente deslizamiento llega
    // pegado al anterior
    lenis.on('virtual-scroll', ({ deltaY, event }) => {
      if (!muro.sellado || deltaY <= 0 || lenis.scroll < lenis.limit - 2) return;
      const ahora = performance.now();
      const acelera = muro.frenado && deltaY > muro.minimo * 2 + 4;
      if (ahora - muro.ultimo > 220 || acelera) {
        muro.empuje = 0;
        muro.pico = deltaY;
        muro.frenado = false;
        aviso.textContent = EMPUJES[Math.min(muro.n, EMPUJES.length - 1)];
        aviso.classList.add('on');
        sonido.empuje(Math.min(1, muro.tension));
        muro.n++;
      }
      muro.ultimo = ahora;
      // Frena cuando baja de la mitad de lo más fuerte del gesto; desde ahí se mira lo más flojo que llega
      muro.pico = Math.max(muro.pico, deltaY);
      if (!muro.frenado && deltaY < muro.pico * 0.5) { muro.frenado = true; muro.minimo = deltaY; }
      else muro.minimo = Math.min(muro.minimo, deltaY);
      const suma = Math.min(0.42 - muro.empuje, deltaY / (event.type.includes('touch') ? 600 : 900));
      if (suma > 0) { muro.empuje += suma; muro.tension += suma; }
      if (muro.tension >= 1) romper();
    });
    let t0 = performance.now();
    gsap.ticker.add(() => {
      const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
      if (muro.sellado) {
        // El muro vuelve a caer cuando se deja de empujar (no mientras siguen llegando eventos)
        if (t - muro.ultimo > 250) muro.tension = Math.max(0, muro.tension - dt * 0.22);
        const objetivo = innerHeight * 0.17 * (1 - Math.exp(-muro.tension * 1.8));
        muro.alto += (objetivo - muro.alto) * (1 - Math.exp(-(objetivo > muro.alto ? 12 : 3) * dt));
        if (muro.tension < 0.02 && muro.n) { muro.n = 0; aviso.classList.remove('on'); }
      }
      const y = muro.alto > 0.3 ? `translate3d(0, ${(-muro.alto).toFixed(1)}px, 0)` : '';
      if (contacto.style.transform !== y) { contacto.style.transform = y; mirar(); }
    });
  }

  // FRESA solo se pinta cuando asoma por debajo del contacto (si no, se vería por la transición de antes, que es
  // transparente); el globo vuela cuando se ha destapado casi media pantalla, y vuelve con un margen (sin parpadeos)
  let dentro = false, vuelo = null;
  function mirar() {
    const abajo = contacto.getBoundingClientRect().bottom;
    sec.classList.toggle('cerca', abajo < innerHeight - 1);
    const destapado = (innerHeight - abajo) / innerHeight;
    if (!dentro && destapado > 0.45) entrar();
    else if (dentro && destapado < 0.25) salir();
  }
  // Lo que hay que mover el globo para que su píldora caiga sobre la grande. Escala desde su esquina de arriba a la
  // izquierda; si ya va movido, se descuenta lo que lleva
  const distancia = () => {
    const a = pildora.getBoundingClientRect(), b = avatar.getBoundingClientRect();
    const x0 = Number(gsap.getProperty(globo, 'x')) || 0, y0 = Number(gsap.getProperty(globo, 'y')) || 0, s0 = Number(gsap.getProperty(globo, 'scale')) || 1;
    return { x: b.left - (a.left - x0), y: b.top - (a.top - y0), s: (b.height * s0) / (a.height || 1) };
  };
  function entrar() {
    dentro = true;
    // En la sección ya está el chat: la ventana sobra
    ventana.cerrar(true);
    vuelo?.kill();
    if (reducido) { globo.classList.add('fuera'); avatar.classList.add('llego'); return; }
    const d = distancia();
    vuelo = gsap.to(globo, {
      x: d.x, y: d.y, scale: d.s, duration: 0.85, ease: 'power3.inOut',
      onComplete: () => { avatar.classList.add('llego'); globo.classList.add('fuera'); sonido.tic(1); },
    });
  }
  function salir() {
    dentro = false;
    vuelo?.kill();
    avatar.classList.remove('llego');
    // El globo aparece de golpe donde estaba la píldora grande (sin fundido: nunca hay dos) y vuelve a su esquina
    globo.style.transition = 'none';
    globo.classList.remove('fuera');
    void globo.offsetWidth;
    globo.style.transition = '';
    if (reducido) { gsap.set(globo, { clearProps: 'transform' }); return; }
    const d = distancia();
    gsap.set(globo, { x: d.x, y: d.y, scale: d.s });
    vuelo = gsap.to(globo, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.inOut', clearProps: 'transform' });
  }
  addEventListener('scroll', () => {
    mirar();
    // De vuelta arriba (el borde del contacto bien por debajo de la pantalla), el muro se sella otra vez
    if (!muro.sellado && contacto.getBoundingClientRect().bottom > innerHeight * 1.6) sellar();
  }, { passive: true });
  addEventListener('resize', mirar);
  mirar();
}

// La sección del final: la misma conversación, con las sugerencias que se escriben y se borran en la caja
export function montar(sec) {
  const form = sec.querySelector('[data-fresa-form]');
  const input = form.querySelector('input');
  const sugiere = sec.querySelector('[data-fresa-sugiere]');
  const intro = sec.querySelector('[data-fresa-intro]');
  const s = { i: 0, n: 0, fase: 'escribe', t: null, vista: false };
  const texto = () => SUGERENCIAS[s.i % SUGERENCIAS.length];
  // Con la caja vacía, «↵» (o la flecha) pregunta la sugerencia que se está viendo
  const sugerencia = () => (s.fase === 'espera' || s.n > 3 ? texto() : '');
  montarVista({ lista: sec.querySelector('[data-fresa-chat]'), form, input, enviar: form.querySelector('button'), alEnviar: () => input.value.trim() || sugerencia() });

  // Las sugerencias: se escriben, se quedan un momento y se borran letra a letra
  const pintar = () => {
    const vacia = !input.value;
    sugiere.textContent = vacia ? texto().slice(0, s.n) : '';
    sugiere.hidden = !vacia;
    intro.classList.toggle('on', vacia && s.fase === 'espera');
  };
  const paso = () => {
    clearTimeout(s.t);
    if (!s.vista || chat.ocupado) { s.t = setTimeout(paso, 500); return; }
    if (input.value) { pintar(); s.t = setTimeout(paso, 400); return; }
    if (s.fase === 'escribe') {
      s.n++;
      if (texto()[s.n - 1]?.trim()) sonido.tecla(0.22);
      if (s.n >= texto().length) { s.fase = 'espera'; s.t = setTimeout(() => { s.fase = 'borra'; paso(); }, 1700); }
      else s.t = setTimeout(paso, 45 + Math.random() * 45);
    } else if (s.fase === 'borra') {
      s.n--;
      if (s.n <= 0) { s.n = 0; s.fase = 'escribe'; s.i++; s.t = setTimeout(paso, 420); }
      else s.t = setTimeout(paso, 26);
    }
    pintar();
  };
  new IntersectionObserver(([e]) => { s.vista = e.isIntersecting; }).observe(form);
  input.addEventListener('input', pintar);
  paso();
}

function leer() { try { return JSON.parse(sessionStorage.getItem(CLAVE)) || []; } catch (e) { return []; } }
function guardar(m) { try { sessionStorage.setItem(CLAVE, JSON.stringify(m.slice(-20))); } catch (e) { /* sin almacenamiento */ } }
