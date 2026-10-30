// Los nodos de un trazado SVG: los puntos de anclaje, como los enseña Illustrator en modo contorno. Recorre el «d» y
// apunta dónde acaba cada tramo, en coordenadas absolutas. Se usa al compilar (en la página), no en el navegador.
const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

export function nodos(d) {
  const piezas = d.match(/[a-df-z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) || [];
  const puntos = [];
  let i = 0, cmd = '', x = 0, y = 0, x0 = 0, y0 = 0;
  while (i < piezas.length) {
    if (/[a-z]/i.test(piezas[i])) cmd = piezas[i++];
    const k = cmd.toLowerCase();
    const rel = cmd === k;
    if (k === 'z') {
      x = x0; y = y0;
      if (i < piezas.length && !/[a-z]/i.test(piezas[i])) break;   // un número detrás de una z: trazado roto
      continue;
    }
    const n = ARGS[k];
    if (!n) break;
    const a = piezas.slice(i, i + n).map(Number);
    if (a.length < n) break;
    i += n;
    const fx = (v) => (rel ? x + v : v), fy = (v) => (rel ? y + v : v);
    if (k === 'm') { x = fx(a[0]); y = fy(a[1]); x0 = x; y0 = y; cmd = rel ? 'l' : 'L'; }
    else if (k === 'l' || k === 't') { [x, y] = [fx(a[0]), fy(a[1])]; }
    else if (k === 'h') x = fx(a[0]);
    else if (k === 'v') y = fy(a[0]);
    else if (k === 'c') { [x, y] = [fx(a[4]), fy(a[5])]; }
    else if (k === 's' || k === 'q') { [x, y] = [fx(a[2]), fy(a[3])]; }
    else if (k === 'a') { [x, y] = [fx(a[5]), fy(a[6])]; }
    // El último tramo suele acabar donde empezó el trazado: ese nodo ya está
    const p = puntos[puntos.length - 1];
    if (!p || Math.hypot(p[0] - x, p[1] - y) > 0.5) puntos.push([x, y]);
  }
  return puntos;
}

// Todos los nodos en un solo trazado de tramos de largo cero: con remate cuadrado y «non-scaling-stroke», cada uno se
// pinta como un cuadradito del mismo tamaño en pantalla, se estire como se estire el logo
export const nodosComoTrazo = (puntos) => puntos.map(([x, y]) => `M${x.toFixed(1)} ${y.toFixed(1)}h0`).join('');
