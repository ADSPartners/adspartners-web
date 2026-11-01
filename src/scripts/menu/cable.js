// El cable del menú: sale del botón «Menú» en la capa de arriba, atraviesa las de debajo y baja hasta la placa. Es una
// curva suave (Catmull-Rom) por unos puntos de paso, muestreada a trozos iguales de longitud para que la cámara pueda ir
// por ella a velocidad constante (en(s), con s de 0 a 1 a lo largo del cable), y un tubo para dibujarla: cada vértice
// lleva, en «s», por dónde va del cable (con eso corre la luz).
import { Geometry } from 'ogl';

const resta = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const largo = (a) => Math.hypot(a[0], a[1], a[2]);
const unidad = (a) => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function crearCable(paso, muestras = 480) {
  // La curva por los puntos de paso (los extremos, repetidos)
  const P = [paso[0], ...paso, paso[paso.length - 1]];
  const tramos = paso.length - 1, finos = [];
  for (let i = 0; i <= muestras * 4; i++) {
    const t = (i / (muestras * 4)) * tramos, k = Math.min(tramos - 1, Math.floor(t)), u = t - k;
    const [p0, p1, p2, p3] = [P[k], P[k + 1], P[k + 2], P[k + 3]];
    finos.push([0, 1, 2].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u * u + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u * u * u)));
  }
  // A trozos iguales de longitud
  const acum = [0];
  for (let i = 1; i < finos.length; i++) acum.push(acum[i - 1] + largo(resta(finos[i], finos[i - 1])));
  const total = acum[acum.length - 1];
  const en = (s) => {
    const d = Math.min(1, Math.max(0, s)) * total;
    let lo = 0, hi = acum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acum[m] < d) lo = m; else hi = m; }
    const f = (d - acum[lo]) / (acum[hi] - acum[lo] || 1);
    return finos[lo].map((v, j) => v + (finos[hi][j] - v) * f);
  };
  const puntos = Array.from({ length: muestras + 1 }, (_, i) => en(i / muestras));
  // Dónde está s para una altura (la primera vez que el cable baja de ella)
  const sEnAltura = (y) => {
    for (let i = 1; i < puntos.length; i++) if (puntos[i][1] <= y) return i / muestras;
    return 1;
  };
  return { en, puntos, total, sEnAltura };
}

// El tubo alrededor de la curva, con marcos que se transportan de un punto al siguiente (no se retuerce)
export function tubo(gl, puntos, radio, lados = 10) {
  const n = puntos.length;
  const pos = new Float32Array(n * (lados + 1) * 3), nor = new Float32Array(n * (lados + 1) * 3), s = new Float32Array(n * (lados + 1));
  const idx = [];
  let N = null;
  for (let i = 0; i < n; i++) {
    const T = unidad(resta(puntos[Math.min(n - 1, i + 1)], puntos[Math.max(0, i - 1)]));
    if (!N) N = unidad(cruz(T, Math.abs(T[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    else { const d = punto(N, T); N = unidad([N[0] - T[0] * d, N[1] - T[1] * d, N[2] - T[2] * d]); }
    const B = cruz(T, N);
    for (let j = 0; j <= lados; j++) {
      const a = (j / lados) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a);
      const dir = [N[0] * c + B[0] * sn, N[1] * c + B[1] * sn, N[2] * c + B[2] * sn];
      const k = i * (lados + 1) + j;
      pos.set([puntos[i][0] + dir[0] * radio, puntos[i][1] + dir[1] * radio, puntos[i][2] + dir[2] * radio], k * 3);
      nor.set(dir, k * 3);
      s[k] = i / (n - 1);
      if (i < n - 1 && j < lados) {
        const a0 = k, b0 = k + lados + 1;
        idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1);
      }
    }
  }
  return new Geometry(gl, {
    position: { size: 3, data: pos }, normal: { size: 3, data: nor }, s: { size: 1, data: s },
    index: { data: n * (lados + 1) > 65535 ? new Uint32Array(idx) : new Uint16Array(idx) },
  });
}
