// Lo que comparten la home y las subpáginas: los imanes de los botones y la barra que se esconde al bajar.
import { gsap } from 'gsap';

// Imanes: el botón se acerca un poco al ratón cuando está cerca, y vuelve con un pequeño rebote
export function montarImanes(reducido) {
  if (reducido || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-iman]').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
  });
}

// La barra se esconde al bajar (pasada la portada) y vuelve al subir. Sobre lo claro, cambia a tinta
export function montarCabecera() {
  const cab = document.querySelector('[data-cab]');
  if (!cab) return;
  let ultimo = window.scrollY;
  const claro = document.getElementById('contacto');
  const luz = document.querySelector('[data-seccion="transicion"]');
  // Lo claro es el contacto y también el final de «se enciende la luz», que ya es crema antes de que el contacto
  // llegue arriba. La fila de arriba de la transición se enciende la última: hacia el 70 % de su recorrido ya es
  // crema en su mayor parte (con la regla de transicion.js: u = p·1,25 − 0,12 frente a v = Bayer·0,55 + 0,45)
  const sobreClaro = () => {
    if (claro) {
      const r = claro.getBoundingClientRect();
      if (r.top < 60 && r.bottom > 60) return true;
    }
    if (luz) {
      const r = luz.getBoundingClientRect();
      const recorrido = r.height - innerHeight;
      if (recorrido > 0 && -r.top / recorrido >= 0.7 && r.bottom > 60) return true;
    }
    return false;
  };
  const mirar = (y) => {
    const bajando = y > ultimo + 2, subiendo = y < ultimo - 2;
    cab.classList.toggle('cab--fondo', y > innerHeight * 0.8);
    if (bajando && y > innerHeight * 0.6) cab.classList.add('cab--fuera');
    else if (subiendo || y < innerHeight * 0.6) cab.classList.remove('cab--fuera');
    cab.classList.toggle('cab--clara', sobreClaro());
    ultimo = y;
  };
  // El scroll nativo (Lenis lo mueve también): así cuenta igual el scroll de rueda que el de foco o el de un enlace
  window.addEventListener('scroll', () => mirar(window.scrollY), { passive: true });
}
