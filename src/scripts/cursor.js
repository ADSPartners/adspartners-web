// Cursor-mensaje (Cartier, Hatom): sigue al ratón con inercia independiente de los fps,
// pos += (objetivo - pos) * (1 - e^(-k·dt)), y lleva una frase que cambia con un fundido.
// Solo aparece en las zonas con data-cursor; fuera, vuelve el cursor del sistema.
import { gsap } from 'gsap';

const NULO = { decir() {}, progreso() {}, activar() {}, volarDesde() {}, pulsando() {}, zona: () => null, activo: false };

export function crearCursor({ reducido }) {
  const html = document.documentElement;
  const el = document.querySelector('[data-cursor-el]');
  if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return NULO;

  const texto = el.querySelector('[data-cursor-texto]');
  const prog = el.querySelector('[data-cursor-progreso]');
  const cuerpo = el.querySelector('[data-cursor-cuerpo]');
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  let k = reducido ? 60 : 7;
  let zona = null;
  let activo = false;
  let frase = '';
  let ultimo = performance.now();

  function actualizarZona(destino) {
    const z = destino && destino.closest ? destino.closest('[data-cursor]') : null;
    zona = z ? z.dataset.cursor : null;
    const sobreControl = destino && destino.closest && destino.closest('a, button, input, label');
    html.classList.toggle('cursor-visible', activo && !!zona && !sobreControl && !html.classList.contains('en-umbral'));
  }
  function onMove(e) { tx = e.clientX; ty = e.clientY; actualizarZona(e.target); }
  window.addEventListener('pointermove', onMove, { passive: true });
  // Al hacer scroll sin mover el ratón, lo que hay debajo cambia: se vuelve a mirar
  window.addEventListener('scroll', () => actualizarZona(document.elementFromPoint(tx, ty)), { passive: true });
  document.addEventListener('pointerleave', () => html.classList.remove('cursor-visible'));

  gsap.ticker.add(() => {
    const ahora = performance.now();
    const dt = Math.min(0.05, (ahora - ultimo) / 1000);
    ultimo = ahora;
    const a = 1 - Math.exp(-k * dt);
    x += (tx - x) * a; y += (ty - y) * a;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  });

  function decir(nueva) {
    if (nueva === frase) return;
    frase = nueva;
    gsap.killTweensOf(texto);
    if (reducido) { texto.textContent = nueva; return; }
    gsap.timeline()
      .to(texto, { yPercent: -110, opacity: 0, duration: 0.2, ease: 'power2.in' })
      .add(() => { texto.textContent = nueva; })
      .fromTo(texto, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.38, ease: 'power3.out' });
  }

  return {
    activo: true,
    zona: () => zona,
    decir,
    progreso(p) { prog.style.strokeDashoffset = String(1 - p); },
    pulsando(si) { html.classList.toggle('cursor-pulsando', si); },
    activar() { activo = true; html.classList.add('cursor-propio'); },
    // Al salir del umbral, el isotipo vuela desde el centro hasta el ratón y se convierte en el cursor
    volarDesde(rect) {
      if (!rect) return;
      x = rect.left + rect.width / 2; y = rect.top + rect.height / 2;
      html.classList.add('cursor-visible');
      if (reducido) return;
      k = 2.2;
      gsap.fromTo(cuerpo, { scale: rect.width / 20 }, { scale: 1, duration: 1.1, ease: 'power3.inOut' });
      gsap.to({ v: 2.2 }, { v: 7, duration: 1.4, ease: 'power2.in', onUpdate() { k = this.targets()[0].v; } });
    },
  };
}
