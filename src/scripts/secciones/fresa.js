// FRESA, en tres partes:
// - El muro: la página acaba de verdad en el contacto (la sección de FRESA está fuera del flujo, «sellada»). Al seguir
//   empujando hacia abajo, el contacto se levanta un poco y vuelve a caer; hacen falta varios empujones seguidos para
//   que se rompa, entre FRESA en el flujo y la página baje hasta ella. Si se vuelve arriba, se sella otra vez.
//   Sin Lenis (movimiento reducido) no hay muro.
// - El globo: baja hasta el chat al pulsarlo; cuando FRESA se destapa, vuela hasta la píldora grande y se convierte en
//   ella (y al volver arriba, hace el camino al revés).
// - El chat: habla con el backend público de ventas (fresa-ventas, sin acceso a nada privado), por SSE. Las
//   sugerencias se escriben y se borran dentro de la caja, una tras otra. Si no responde, WhatsApp y el correo.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';

const API = window.__CHAT_API__ || 'https://fresa-ventas-production.up.railway.app/api/chat-ventas';
const CLAVE = 'ads_chat_history';
const MAX_TURNOS = 20;
const FALLO = 'Ahora mismo no puedo contestar. Escríbenos por WhatsApp (https://wa.me/34633565840) o a adsgroup@ads-partners.com y te responde una persona.';
const SUGERENCIAS = ['¿Qué hacéis exactamente?', '¿Cómo empezamos?', '¿Cuánto cuesta?', '¿Me hacéis una web?', '¿Podéis automatizar mis facturas?'];
const EMPUJES = ['Hay algo más abajo.', 'Empuja otra vez.', 'Casi…'];

export function montarGlobo({ lenis, reducido }) {
  const globo = document.querySelector('[data-fresa-globo]');
  const sec = document.getElementById('fresa');
  const contacto = document.getElementById('contacto');
  if (!globo || !sec || !contacto) return;
  const pildora = globo.querySelector('[data-fresa-pildora]');
  const avatar = sec.querySelector('[data-fresa-avatar]');
  const aviso = sec.querySelector('[data-fresa-empuja]');

  // --- El muro --------------------------------------------------------------------
  const muro = { sellado: !!lenis && !reducido, tension: 0, empuje: 0, ultimo: 0, n: 0, alto: 0 };
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
    // Cada gesto (rueda, trackpad o dedo) es un empujón; dentro de un mismo gesto se suma como mucho 0,42
    lenis.on('virtual-scroll', ({ deltaY, event }) => {
      if (!muro.sellado || deltaY <= 0 || lenis.scroll < lenis.limit - 2) return;
      const ahora = performance.now();
      if (ahora - muro.ultimo > 220) {
        muro.empuje = 0;
        aviso.textContent = EMPUJES[Math.min(muro.n, EMPUJES.length - 1)];
        aviso.classList.add('on');
        sonido.empuje(Math.min(1, muro.tension));
        muro.n++;
      }
      muro.ultimo = ahora;
      const suma = Math.min(0.42 - muro.empuje, deltaY / (event.type.includes('touch') ? 600 : 900));
      if (suma > 0) { muro.empuje += suma; muro.tension += suma; }
      if (muro.tension >= 1) romper();
    });
    let t0 = performance.now();
    gsap.ticker.add(() => {
      const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
      if (muro.sellado) {
        muro.tension = Math.max(0, muro.tension - dt * 0.22);
        const objetivo = innerHeight * 0.17 * (1 - Math.exp(-muro.tension * 1.8));
        muro.alto += (objetivo - muro.alto) * (1 - Math.exp(-(objetivo > muro.alto ? 12 : 3) * dt));
        if (muro.tension < 0.02 && muro.n) { muro.n = 0; aviso.classList.remove('on'); }
      }
      const y = muro.alto > 0.3 ? `translate3d(0, ${(-muro.alto).toFixed(1)}px, 0)` : '';
      if (contacto.style.transform !== y) { contacto.style.transform = y; mirar(); }
    });
  }

  // --- El globo ---------------------------------------------------------------------
  globo.addEventListener('click', () => {
    if (muro.sellado) { romper(2.2); return; }
    const destino = document.documentElement.scrollHeight - innerHeight;
    if (lenis) lenis.scrollTo(destino, { duration: reducido ? 0 : 2.4 });
    else scrollTo({ top: destino, behavior: reducido ? 'auto' : 'smooth' });
  });

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

export function montar(sec) {
  const chat = sec.querySelector('[data-fresa-chat]');
  const form = sec.querySelector('[data-fresa-form]');
  const input = form.querySelector('input');
  const enviar = form.querySelector('button');
  const sugiere = sec.querySelector('[data-fresa-sugiere]');
  const intro = sec.querySelector('[data-fresa-intro]');
  let mensajes = leer();
  let ocupado = false;
  let sug = { lista: () => '' };
  mensajes.forEach((m) => burbuja(m.role, m.text));

  // Con la caja vacía, «↵» (o la flecha) pregunta la sugerencia que se está viendo
  form.addEventListener('submit', (e) => { e.preventDefault(); preguntar(input.value.trim() || sug.lista()); });
  montarSugerencias();

  // --- Las sugerencias: se escriben, se quedan un momento y se borran letra a letra -------
  function montarSugerencias() {
    const s = { i: 0, n: 0, fase: 'escribe', t: null, vista: false };
    const texto = () => SUGERENCIAS[s.i % SUGERENCIAS.length];
    const pintar = () => {
      const vacia = !input.value;
      sugiere.textContent = vacia ? texto().slice(0, s.n) : '';
      sugiere.hidden = !vacia;
      intro.classList.toggle('on', vacia && s.fase === 'espera');
    };
    const paso = () => {
      clearTimeout(s.t);
      if (!s.vista || ocupado) { s.t = setTimeout(paso, 500); return; }
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
    sug = { lista: () => (s.fase === 'espera' || s.n > 3 ? texto() : '') };
  }

  function burbuja(rol, texto) {
    const el = document.createElement('p');
    el.className = `fr-msg fr-msg--${rol === 'user' ? 'yo' : 'fresa'}`;
    pintar(el, texto);
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
  }
  // Texto plano con los enlaces (http y correos) clicables
  function pintar(el, texto) {
    const seguro = texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    el.innerHTML = seguro
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>');
  }

  async function preguntar(q) {
    const texto = String(q || '').trim();
    if (!texto || ocupado) return;
    if (mensajes.filter((m) => m.role === 'user').length >= MAX_TURNOS) { burbuja('assistant', 'Hemos hablado mucho por aquí. Para seguir, mejor con una persona: WhatsApp o adsgroup@ads-partners.com.'); return; }
    input.value = '';
    ocupado = true; enviar.disabled = true;
    sonido.tic(0.8);
    mensajes.push({ role: 'user', text: texto });
    burbuja('user', texto);
    const el = burbuja('assistant', '');
    el.classList.add('fr-pensando');
    let respuesta = '';
    let fallo = false;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: mensajes.map((m) => ({ role: m.role, content: m.text })), turnstileToken: '', lang: 'es' }),
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
          if (ev.type === 'text') { respuesta += ev.text; el.classList.remove('fr-pensando'); pintar(el, respuesta); chat.scrollTop = chat.scrollHeight; }
        }
      }
      if (!respuesta) throw new Error('vacía');
    } catch (e) {
      fallo = true;
      pintar(el, FALLO);
    } finally {
      el.classList.remove('fr-pensando');
      // Si no contestó, la pregunta no entra en el historial (así se puede volver a intentar)
      if (fallo) mensajes.pop();
      else mensajes.push({ role: 'assistant', text: respuesta });
      guardar(mensajes);
      ocupado = false; enviar.disabled = false;
    }
  }
}

function leer() { try { return JSON.parse(sessionStorage.getItem(CLAVE)) || []; } catch (e) { return []; } }
function guardar(m) { try { sessionStorage.setItem(CLAVE, JSON.stringify(m.slice(-20))); } catch (e) { /* sin almacenamiento */ } }
