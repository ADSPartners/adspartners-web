// Movimiento de las secciones de texto. Cada bloque tiene un solo momento, y siempre responde al scroll:
// - La idea: la frase se enciende palabra a palabra mientras bajas; al final se subraya «Nosotros somos uno».
// - Qué hacemos: el eje se dibuja y las dos mitades entran desde lados opuestos; «máquina» se teclea.
// - Por qué: cada razón entra con su línea.
// - Para quién: cada casilla se marca al pasar por ella (y suena una nota).
// - La barra cambia a tinta oscura sobre los capítulos claros.
// Con movimiento reducido todo se queda en su estado final.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import * as sonido from './sonido.js';

export function montarSecciones({ reducido }) {
  barraSobreClaros();
  const casos = [...document.querySelectorAll('[data-caso]')];
  if (reducido) { casos.forEach((c) => c.classList.add('marcado')); return; }

  document.fonts.ready.then(() => {
    idea();
    hacemos();
    porque();
    paraQuien(casos);
    ScrollTrigger.refresh();
  });
}

function idea() {
  const frase = document.querySelector('[data-palabras]');
  if (!frase) return;
  const split = SplitText.create(frase, { type: 'words', wordsClass: 'palabra' });
  gsap.fromTo(split.words, { opacity: 0.14 }, {
    opacity: 1, ease: 'none', stagger: 0.08,
    scrollTrigger: { trigger: frase, start: 'top 80%', end: 'bottom 52%', scrub: 0.6 },
  });
  const remate = frase.querySelector('.idea__remate');
  if (remate) {
    gsap.to(remate, {
      '--subrayado': 1, duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: remate, start: 'top 58%', toggleActions: 'play none none reverse' },
      onStart: () => sonido.nota(4, 0.8),
    });
  }
  gsap.from('.idea__notas li', {
    opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '.idea__notas', start: 'top 85%', once: true },
  });
}

function hacemos() {
  const sec = document.querySelector('.hacemos');
  if (!sec) return;
  const movil = matchMedia('(max-width: 860px)').matches;
  const titulo = SplitText.create(sec.querySelector('.hacemos__titulo'), { type: 'lines', mask: 'lines' });
  gsap.from(titulo.lines, {
    yPercent: 105, duration: 1.1, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: sec, start: 'top 78%', once: true },
  });

  const mono = sec.querySelector('.mitad__nombre--mono');
  const letras = mono ? SplitText.create(mono, { type: 'chars' }).chars : [];
  const tl = gsap.timeline({ scrollTrigger: { trigger: sec.querySelector('.hacemos__mitades'), start: 'top 75%', once: true } });
  tl.from(sec.querySelector('.hacemos__eje span'), { [movil ? 'scaleX' : 'scaleY']: 0, duration: 1.3, ease: 'power3.inOut' }, 0)
    .from(sec.querySelector('.mitad--fuera'), { x: movil ? 0 : -40, y: movil ? 24 : 0, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.15)
    .from(sec.querySelector('.mitad--dentro'), { x: movil ? 0 : 40, y: movil ? 24 : 0, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.3)
    .from(letras, { opacity: 0, duration: 0.01, stagger: 0.07, ease: 'none', onStart: () => sonido.tic(0.6) }, 0.55)
    .from(sec.querySelectorAll('.servicio'), { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out', stagger: 0.07 }, 0.6);
}

function porque() {
  document.querySelectorAll('[data-razon]').forEach((r) => {
    const t = SplitText.create(r.querySelector('.razon__t'), { type: 'lines', mask: 'lines' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 82%', once: true } });
    tl.fromTo(r, { '--linea-x': 0 }, { '--linea-x': 1, duration: 1.1, ease: 'power3.inOut' }, 0)
      .from(t.lines, { yPercent: 105, duration: 1, ease: 'power3.out' }, 0.15)
      .from(r.querySelector('.razon__d'), { opacity: 0, y: 12, duration: 0.8, ease: 'power3.out' }, 0.35);
  });
}

function paraQuien(casos) {
  casos.forEach((c, i) => {
    ScrollTrigger.create({
      trigger: c, start: 'top 64%',
      onEnter: () => { c.classList.add('marcado'); sonido.nota(2 + i * 2, 0.7); },
      onLeaveBack: () => c.classList.remove('marcado'),
    });
  });
  const cierre = document.querySelector('.quien__cierre');
  if (cierre) {
    const l = SplitText.create(cierre, { type: 'lines', mask: 'lines' });
    gsap.from(l.lines, { yPercent: 105, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: cierre, start: 'top 85%', once: true } });
  }
}

function barraSobreClaros() {
  const html = document.documentElement;
  document.querySelectorAll('.capitulo-claro').forEach((s) => {
    ScrollTrigger.create({
      trigger: s, start: 'top 48px', end: 'bottom 48px',
      onToggle: (self) => {
        const algunaActiva = ScrollTrigger.getAll().some((st) => st.vars.trigger?.classList?.contains('capitulo-claro') && st.isActive);
        html.classList.toggle('cab-clara', self.isActive || algunaActiva);
      },
    });
  });
}
