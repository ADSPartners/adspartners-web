// El umbral (Overworld): mientras carga, frases con humor y una barra de 1 px; cuando el canvas está listo, se
// construye delante de ti en tres pases (alambre, luz y la linterna de marca) y aparecen «entrar con o sin sonido».
// Al entrar, la portada inunda de marca desde el punto del clic. La elección se guarda para la sesión.
import { gsap } from 'gsap';

const FRASES = [
  'Encendiendo la máquina…',
  'Afinando el kerning…',
  'Discutiendo con Sebas si esto es rosa o salmón…',
];
const tactil = () => !matchMedia('(hover: hover) and (pointer: fine)').matches;
const PASES = {
  1: 'Pase 1 de 3 · alambre',
  2: 'Pase 2 de 3 · luz',
  3: () => `Pase 3 de 3 · la marca, donde pases ${tactil() ? 'el dedo' : 'el ratón'}`,
};

export function montarUmbral({ listo, reducido, alEntrar }) {
  const html = document.documentElement;
  const el = document.getElementById('umbral');
  if (!el || !html.classList.contains('en-umbral')) { alEntrar(null); return; }

  const barra = el.querySelector('[data-umbral-barra]');
  const frase = el.querySelector('[data-umbral-frase]');
  const carga = el.querySelector('[data-umbral-carga]');
  const entradas = el.querySelector('[data-umbral-entradas]');
  const iso = el.querySelector('[data-umbral-iso]');
  const velo = el.querySelector('.umbral__velo');

  const escribir = (texto) => {
    if (typeof texto === 'function') texto = texto();
    if (reducido) { frase.textContent = texto; return; }
    gsap.timeline()
      .to(frase, { yPercent: -100, opacity: 0, duration: 0.2, ease: 'power2.in' })
      .add(() => { frase.textContent = texto; })
      .fromTo(frase, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.38, ease: 'power3.out' });
  };

  // Mientras carga: frases con humor; la barra llega a la mitad
  let i = 0;
  const reloj = setInterval(() => { if (i < FRASES.length - 1) escribir(FRASES[++i]); }, 900);
  const avance = { v: 0 };
  const barraA = (v, d, ease = 'power2.out') => gsap.to(avance, { v, duration: d, ease, onUpdate: () => { barra.style.transform = `scaleX(${avance.v})`; } });
  barraA(0.45, 1.6, 'power1.inOut');

  Promise.all([listo, new Promise((ok) => setTimeout(ok, reducido ? 300 : 1200))]).then(async ([portada]) => {
    clearInterval(reloj);
    // Los tres pases, cada uno con su rótulo; la barra completa el resto
    if (portada?.construir && !reducido) {
      barraA(1, 3.3, 'none');
      await portada.construir((n) => escribir(PASES[n]));
      await new Promise((ok) => setTimeout(ok, 900));
    } else {
      barraA(1, 0.4);
    }
    // La carga deja su sitio a los botones
    gsap.to(carga, { opacity: 0, y: -10, duration: reducido ? 0 : 0.4, ease: 'power2.in' });
    gsap.set(entradas, { visibility: 'visible' });
    gsap.fromTo(entradas, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: reducido ? 0 : 0.9, ease: 'power3.out', delay: reducido ? 0 : 0.3 });
    // El foco va al botón (para el teclado), sin el recuadro de foco: solo se pinta si se navega con el teclado
    setTimeout(() => entradas.querySelector('[data-entrar="con"]').focus({ preventScroll: true, focusVisible: false }), 400);
  });

  let hecho = false;
  el.querySelectorAll('[data-entrar]').forEach((b) => b.addEventListener('click', (e) => {
    if (hecho) return;
    hecho = true;
    const modo = b.dataset.entrar;
    try { sessionStorage.setItem('ads-umbral', modo); } catch (err) { /* sin almacenamiento */ }
    clearInterval(reloj);
    const rectIso = iso.getBoundingClientRect();
    // El punto del clic (con teclado, el centro del botón): de ahí sale la marca
    const rb = b.getBoundingClientRect();
    const x = e.clientX || rb.left + rb.width / 2, y = e.clientY || rb.top + rb.height / 2;
    alEntrar(modo, { rectIso, x, y });
    const tl = gsap.timeline({ onComplete: () => { html.classList.remove('en-umbral'); } });
    if (reducido) { tl.to(el, { opacity: 0, duration: 0.2 }); return; }
    tl.to([...el.querySelectorAll('.umbral__abajo, .umbral__pie, .umbral__saltar, .umbral__iso, .umbral__ads')], { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(velo, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.1)
      .to({}, { duration: 1.6 });
  }));
}
