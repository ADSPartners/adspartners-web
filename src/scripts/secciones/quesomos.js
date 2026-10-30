// Qué somos: reloj de Madrid, cotas del isotipo medidas de verdad, la lente que cambia la ropa de las palabras
// fantasma, el isotipo que se inclina hacia el ratón y las entradas (líneas con máscara y un tic por elemento).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import * as sonido from '../sonido.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function montar(sec, { reducido, conRaton }) {
  montarReloj(sec);
  medirIso(sec);
  ajustarFantasmas(sec);
  addEventListener('resize', () => { medirIso(sec); ajustarFantasmas(sec); });
  document.fonts.ready.then(() => ajustarFantasmas(sec));
  if (conRaton && !reducido) montarRaton(sec);
  if (!reducido) montarEntradas(sec);
}

// «Madrid, 17:30 · trabajando»: la hora real y qué estamos haciendo (fuera de horario, contesta FRESA)
function montarReloj(sec) {
  const hora = sec.querySelector('[data-qs-hora]');
  const estado = sec.querySelector('[data-qs-estado]');
  const formato = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false });
  const pintar = () => {
    const partes = Object.fromEntries(formato.formatToParts(new Date()).map((p) => [p.type, p.value]));
    hora.textContent = `${partes.hour}:${partes.minute}`;
    const h = Number(partes.hour) + Number(partes.minute) / 60;
    const finde = /^(sáb|dom)/.test(partes.weekday);
    estado.textContent = finde ? 'fin de semana · contesta FRESA'
      : h >= 9 && h < 14 ? 'trabajando'
      : h >= 14 && h < 15.5 ? 'comiendo'
      : h >= 15.5 && h < 20 ? 'trabajando'
      : h >= 20 && h < 24 ? 'fuera de horario · contesta FRESA'
      : 'durmiendo · contesta FRESA';
  };
  pintar();
  setInterval(pintar, 20000);
}

// Las cotas del isotipo enseñan su medida real en pantalla
function medirIso(sec) {
  const iso = sec.querySelector('[data-qs-iso]');
  if (!iso) return;
  const { width, height } = iso.getBoundingClientRect();
  sec.querySelector('[data-qs-medida="x"]').textContent = `${Math.round(width / 2)} px`;
  sec.querySelector('[data-qs-medida="y"]').textContent = `${Math.round(height)} px`;
}

// La palabra de la lente ocupa el mismo ancho que la fantasma de debajo, aunque vaya en otra letra
function ajustarFantasmas(sec) {
  const base = sec.querySelector('[data-qs-fantasmas]');
  const lente = sec.querySelector('[data-qs-lente]');
  for (const k of ['brand', 'tech']) {
    const a = base.querySelector(`[data-qs-f="${k}"]`);
    const b = lente.querySelector(`[data-qs-f="${k}"]`);
    a.style.transform = ''; b.style.transform = ''; b.dataset.dy = '0';
    b.style.fontSize = '';
    const wa = a.getBoundingClientRect().width, wb = b.getBoundingClientRect().width;
    if (wa > 0 && wb > 0) b.style.fontSize = `${parseFloat(getComputedStyle(b).fontSize) * (wa / wb)}px`;
    // Misma altura de la línea base: se alinean por abajo
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const dy = ra.bottom - rb.bottom;
    b.dataset.dy = String(dy);
    b.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
  }
}

function montarRaton(sec) {
  const iso = sec.querySelector('[data-qs-iso]');
  const fantasmas = [...sec.querySelectorAll('.qs__f')];
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(sec);
  const objetivo = { x: -999, y: -999, nx: 0, ny: 0 };
  const actual = { x: -999, y: -999, nx: 0, ny: 0 };
  addEventListener('pointermove', (e) => {
    if (!visible) return;
    const r = sec.getBoundingClientRect();
    objetivo.x = e.clientX - r.left; objetivo.y = e.clientY - r.top;
    objetivo.nx = e.clientX / innerWidth - 0.5; objetivo.ny = e.clientY / innerHeight - 0.5;
    if (actual.x < -900) { actual.x = objetivo.x; actual.y = objetivo.y; }
  }, { passive: true });
  // Al hacer scroll sin mover el ratón, la lente se queda en el mismo sitio de la pantalla
  let ultimoY = scrollY;
  addEventListener('scroll', () => { const d = scrollY - ultimoY; ultimoY = scrollY; objetivo.y += d; actual.y += d; }, { passive: true });

  let t0 = performance.now();
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (!visible) return;
    const k = 1 - Math.exp(-9 * dt), k2 = 1 - Math.exp(-4 * dt);
    actual.x += (objetivo.x - actual.x) * k; actual.y += (objetivo.y - actual.y) * k;
    actual.nx += (objetivo.nx - actual.nx) * k2; actual.ny += (objetivo.ny - actual.ny) * k2;
    sec.style.setProperty('--mx', `${actual.x.toFixed(1)}px`);
    sec.style.setProperty('--my', `${actual.y.toFixed(1)}px`);
    // Paralaje: las palabras de fondo se van al lado contrario; el isotipo mira al ratón
    for (const f of fantasmas) {
      const lado = f.classList.contains('qs__f--brand') ? 1 : -1;
      const dy = Number(f.dataset.dy || 0);
      f.style.transform = `translate3d(${(-actual.nx * 22 * lado).toFixed(2)}px, ${(dy - actual.ny * 14).toFixed(2)}px, 0)`;
    }
    iso.style.transform = `perspective(700px) rotateY(${(actual.nx * 26).toFixed(2)}deg) rotateX(${(-actual.ny * 20).toFixed(2)}deg)`;
  });
}

function montarEntradas(sec) {
  // Las líneas se vuelven a partir si cambia el ancho o termina de cargar la letra (autoSplit): partidas una sola vez,
  // al estrechar la ventana cada línea dejaba caer su última palabra. La entrada se devuelve en onSplit para que, al
  // volver a partir, siga por donde iba (si ya entró, no se repite)
  for (const el of sec.querySelectorAll('[data-qs-lineas]')) {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'qs-linea', autoSplit: true,
      onSplit: (partido) => gsap.from(partido.lines, {
        yPercent: 105, duration: 1.1, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    });
  }
  // Las listas entran elemento a elemento, con una gota cada uno
  for (const ul of sec.querySelectorAll('[data-qs-lista]')) {
    gsap.from(ul.children, {
      opacity: 0, y: 12, duration: 0.6, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: ul, start: 'top 90%', once: true },
      onStart() { sonido.tic(0.5); },
    });
    ul.querySelectorAll('li').forEach((li, i) => li.addEventListener('pointerenter', () => sonido.tic(0.4 + (i % 3) * 0.1)));
  }
  gsap.from(sec.querySelector('.qs__bocadillo'), {
    scale: 0.6, opacity: 0, transformOrigin: '100% 50%', duration: 0.9, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: sec.querySelector('[data-qs-centro]'), start: 'top 80%', once: true },
    onStart() { sonido.gota(0.4, 0.8); },
  });
}
