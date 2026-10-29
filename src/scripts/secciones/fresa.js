// FRESA: el globo baja hasta la sección del chat; la sección se hace visible al llegar al contacto (está pegada
// detrás); al aparecer, el globo vuela hasta el avatar y se esconde. El chat habla con el backend público de ventas
// (fresa-ventas, sin acceso a nada privado), por SSE. Si no responde, se ofrecen WhatsApp y el correo.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';

const API = window.__CHAT_API__ || 'https://fresa-ventas-production.up.railway.app/api/chat-ventas';
const CLAVE = 'ads_chat_history';
const MAX_TURNOS = 20;
const FALLO = 'Ahora mismo no puedo contestar. Escríbenos por WhatsApp (https://wa.me/34633565840) o a adsgroup@ads-partners.com y te responde una persona.';

export function montarGlobo({ lenis, reducido }) {
  const globo = document.querySelector('[data-fresa-globo]');
  const sec = document.getElementById('fresa');
  if (!globo || !sec) return;
  globo.addEventListener('click', () => {
    const destino = document.documentElement.scrollHeight - innerHeight;
    if (lenis) lenis.scrollTo(destino, { duration: reducido ? 0 : 2.4 });
    else scrollTo({ top: destino, behavior: reducido ? 'auto' : 'smooth' });
  });

  // La sección se enseña cuando el contacto está en pantalla (antes, estaría asomando por debajo de lo transparente)
  const contacto = document.getElementById('contacto');
  // (y también cuando ya se ha pasado de largo: en el móvil, FRESA es más alta que la pantalla)
  if (contacto) new IntersectionObserver(([e]) => sec.classList.toggle('cerca', e.isIntersecting || e.boundingClientRect.top < 0)).observe(contacto);

  // Cuando FRESA ya se ve, el globo vuela a su avatar y se va. Como la sección está pegada abajo (siempre «en
  // pantalla»), lo que cuenta es cuánto se ha destapado: lo que queda por debajo del borde del contacto
  const avatar = sec.querySelector('[data-fresa-avatar]');
  let dentro = false;
  const mirar = () => {
    const destapado = contacto ? (innerHeight - contacto.getBoundingClientRect().bottom) / innerHeight : 0;
    const ahora = destapado > 0.45;
    if (ahora === dentro) return;
    dentro = ahora;
    if (dentro) {
      const a = globo.querySelector('img').getBoundingClientRect(), b = avatar.getBoundingClientRect();
      if (reducido) { globo.classList.add('fuera'); return; }
      gsap.timeline()
        .to(globo, { x: b.left - a.left + (b.width - a.width) / 2, y: b.top - a.top + (b.height - a.height) / 2, scale: b.width / a.width, duration: 0.8, ease: 'power3.inOut' })
        .add(() => { globo.classList.add('fuera'); sonido.tic(1); })
        .set(globo, { clearProps: 'transform' });
      gsap.fromTo(avatar, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 0.55, ease: 'back.out(2)' });
    } else {
      globo.classList.remove('fuera');
    }
  };
  addEventListener('scroll', mirar, { passive: true });
  mirar();
}

export function montar(sec) {
  const chat = sec.querySelector('[data-fresa-chat]');
  const form = sec.querySelector('[data-fresa-form]');
  const input = form.querySelector('input');
  const enviar = form.querySelector('button');
  const sugerencias = sec.querySelector('[data-fresa-sugerencias]');
  let mensajes = leer();
  let ocupado = false;
  mensajes.forEach((m) => burbuja(m.role, m.text));

  sugerencias.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => preguntar(b.textContent)));
  form.addEventListener('submit', (e) => { e.preventDefault(); preguntar(input.value); });

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
