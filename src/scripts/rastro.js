// El rastro de la visita, del que sale lo que lleva encendida la placa del menú: cuánto tiempo lleva aquí y cuánto ha
// recorrido el ratón (un px de CSS es 1/96 de pulgada, 0,2646 mm). Se cuenta en el navegador y no se guarda ni se envía
// nada.
const MM_POR_PX = 25.4 / 96;
const r = { inicio: performance.now(), px: 0, x: null, y: 0, t: 0 };

export function seguirRastro() {
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (r.x !== null && t - r.t < 120) r.px += Math.hypot(e.clientX - r.x, e.clientY - r.y);   // tras una pausa larga, no cuenta el salto
    r.x = e.clientX; r.y = e.clientY; r.t = t;
  }, { passive: true });
}

// segundos en la web y metros de ratón
export function rastro() {
  return { segundos: (performance.now() - r.inicio) / 1000, metros: (r.px * MM_POR_PX) / 1000 };
}
