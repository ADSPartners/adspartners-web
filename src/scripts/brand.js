// Brand, «El manual que se defiende»: el montaje de la página. La hora de Madrid; el contador de intentos (sale al
// llegar al logotipo, y el de conseguidos no se mueve nunca); cada prueba se carga cuando te acercas a su página; y el
// remate del cierre cuenta lo que has intentado de verdad.
import * as sonido from './sonido.js';
import { remate } from '../data/brand.js';

const dos = (n) => String(n).padStart(2, '0');

export function montarBrand({ reducido, conRaton, lenis, cursor }) {
  const raiz = document.querySelector('[data-brand]');
  if (!raiz) return;

  const hora = document.querySelector('[data-bm-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const ponerHora = () => { if (hora) hora.textContent = reloj.format(new Date()); };
  ponerHora();
  setInterval(ponerHora, 20000);

  // El índice lleva a su página con el mismo scroll suave que el resto
  raiz.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (ev) => {
    const destino = raiz.querySelector(a.getAttribute('href'));
    if (!destino) return;
    ev.preventDefault();
    if (lenis) lenis.scrollTo(destino, { duration: 1.4 });
    else destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
  }));

  // El contador: aparece en el logotipo y se queda hasta el final (en el móvil, solo en el logotipo: taparía el texto;
  // el remate del cierre ya cuenta los intentos)
  const contador = document.querySelector('[data-bm-contador]');
  const movil = matchMedia('(max-width: 760px)');
  const cifra = contador.querySelector('[data-bm-intentos]');
  const remateEl = raiz.querySelector('[data-bm-remate]');
  let intentos = 0;
  function intento() {
    intentos++;
    cifra.textContent = dos(intentos);
    cifra.classList.remove('salta');
    void cifra.offsetWidth;
    cifra.classList.add('salta');
    sonido.tecla(0.8);
    if (remateEl) remateEl.textContent = remate(intentos);
  }
  const logo = raiz.querySelector('#logotipo');
  if (logo) {
    new IntersectionObserver(([e]) => {
      contador.classList.toggle('on', e.isIntersecting || (!movil.matches && e.boundingClientRect.top < 0));
    }, { threshold: 0.2 }).observe(logo);
  }

  // Cada prueba se carga al acercarse a su página
  const pruebas = [
    ['[data-bl]', () => import('./brand/logo.js').then((m) => m.montarLogo)],
  ];
  pruebas.forEach(([sel, cargar]) => {
    const el = raiz.querySelector(sel);
    if (!el) return;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      try {
        (await cargar())(el, { reducido, conRaton, cursor, intento });
      } catch (err) {
        console.warn('Prueba sin efectos:', err);
      }
    }, { rootMargin: '60% 0px' });
    io.observe(el);
  });
}
