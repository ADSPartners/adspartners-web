// El umbral (Overworld): mientras carga, frases con humor y una barra de 1 px; después, entrar con o sin sonido.
// La elección se guarda para la sesión: al recargar no vuelve a salir.
import { gsap } from 'gsap';

const FRASES = [
  'Encendiendo la máquina…',
  'Afinando el kerning…',
  'Leyendo 115 facturas…',
  'Discutiendo con Sebas si esto es rosa o salmón…',
  'Conectando lo de fuera con lo de dentro…',
];

export function montarUmbral({ listo, reducido, alEntrar }) {
  const html = document.documentElement;
  const el = document.getElementById('umbral');
  if (!el || !html.classList.contains('en-umbral')) { alEntrar(null); return; }

  const barra = el.querySelector('[data-umbral-barra]');
  const frase = el.querySelector('[data-umbral-frase]');
  const entradas = el.querySelector('[data-umbral-entradas]');
  const iso = el.querySelector('[data-umbral-iso]');
  const velo = el.querySelector('.umbral__velo');

  // Frases: una cada 0,9 s, en orden, entrando desde abajo
  let i = 0;
  const cambiar = () => {
    i = Math.min(i + 1, FRASES.length - 1);
    if (reducido) { frase.textContent = FRASES[i]; return; }
    gsap.timeline()
      .to(frase, { yPercent: -100, opacity: 0, duration: 0.22, ease: 'power2.in' })
      .add(() => { frase.textContent = FRASES[i]; })
      .fromTo(frase, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  };
  const reloj = setInterval(() => { if (i < FRASES.length - 1) cambiar(); }, 900);

  // Progreso real (fuentes, imagen y WebGL) con una duración mínima para que se lean las frases
  const minimo = reducido ? 500 : 3600;
  const t0 = performance.now();
  const avance = { v: 0 };
  gsap.to(avance, { v: 0.7, duration: minimo / 1000, ease: 'power1.inOut', onUpdate: () => { barra.style.transform = `scaleX(${avance.v})`; } });

  Promise.all([listo, new Promise((ok) => setTimeout(ok, minimo))]).then(() => {
    clearInterval(reloj);
    gsap.to(avance, { v: 1, duration: 0.5, ease: 'power2.out', onUpdate: () => { barra.style.transform = `scaleX(${avance.v})`; } });
    frase.textContent = 'Listo.';
    gsap.set(entradas, { visibility: 'visible' });
    gsap.fromTo(entradas, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: reducido ? 0 : 0.9, ease: 'power3.out', delay: 0.2 });
    setTimeout(() => entradas.querySelector('[data-entrar="con"]').focus({ preventScroll: true }), 250);
  });

  let hecho = false;
  el.querySelectorAll('[data-entrar]').forEach((b) => b.addEventListener('click', () => {
    if (hecho) return;
    hecho = true;
    const modo = b.dataset.entrar;
    try { sessionStorage.setItem('ads-umbral', modo); } catch (e) { /* sin almacenamiento */ }
    clearInterval(reloj);
    const rectIso = iso.getBoundingClientRect();
    alEntrar(modo, { rectIso, msDesdeInicio: performance.now() - t0 });
    const tl = gsap.timeline({ onComplete: () => { html.classList.remove('en-umbral'); } });
    if (reducido) { tl.to(el, { opacity: 0, duration: 0.2 }); return; }
    tl.to([el.querySelector('.umbral__centro'), entradas, el.querySelector('.umbral__pie'), el.querySelector('.umbral__saltar')], { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(velo, { opacity: 0, duration: 1.3, ease: 'power2.inOut' }, 0.1);
  }));
}
