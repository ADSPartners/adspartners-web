// El rastro de la visita, del que sale el viento solar de la aurora (el menú): cuánto tiempo lleva aquí, cuánto ha
// recorrido el ratón (un px de CSS es 1/96 de pulgada, 0,2646 mm) y a qué velocidad media se ha movido cuando se
// movía. Se cuenta en el navegador y no se guarda ni se envía nada.
const MM_POR_PX = 25.4 / 96;
const r = { inicio: performance.now(), px: 0, moviendo: 0, x: null, y: 0, t: 0 };

export function seguirRastro() {
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (r.x !== null) {
      const d = Math.hypot(e.clientX - r.x, e.clientY - r.y), dt = t - r.t;
      if (dt < 120) { r.px += d; r.moviendo += dt; }   // pausas largas no cuentan como movimiento
    }
    r.x = e.clientX; r.y = e.clientY; r.t = t;
  }, { passive: true });
}

// segundos en la web, metros de ratón, velocidad media (px/s) y el viento solar que sale de ella (de 300 a 800 km/s,
// lo que mide de verdad el viento solar entre el lento y el rápido)
export function rastro() {
  const segundos = (performance.now() - r.inicio) / 1000;
  const metros = (r.px * MM_POR_PX) / 1000;
  const velocidad = r.moviendo > 0 ? r.px / (r.moviendo / 1000) : 0;
  const viento = Math.round(Math.min(800, Math.max(300, 300 + velocidad * 0.3)));
  return { segundos, metros, velocidad, viento };
}
