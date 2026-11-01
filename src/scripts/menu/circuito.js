// La placa base del menú: dónde va cada pieza, cómo se ve la placa y por dónde corre la señal. Se pinta una vez en dos
// lienzos que menu/placa.js sube como texturas:
// - aspecto: máscara negra mate con el cobre debajo, vías y contactos dorados, la huella de cada pieza y
//   la serigrafía en crema (designadores, la etiqueta de cada LED y la firma de la placa);
// - señal: solo las pistas de los buses que salen del procesador. En rojo, a qué pieza va (60 Proyectos, 120 Brand,
//   180 About, 240 los del propio procesador) y, en verde, la distancia desde el procesador, para que el shader haga
//   correr la señal solo por las pistas de la pieza que apuntas.
// Y las caras de las piezas que llevan dibujo: el disipador del procesador, el SSD, la gráfica, la BIOS y la pila.
// Medidas en unidades de la escena: la placa mide LADO × LADO y el procesador está cerca del centro. En vertical (el
// móvil) las piezas van una encima de otra.
import { lienzo } from '../gl/capas.js';

export const LADO = 72;
export const BUS = { proyectos: 1, brand: 2, about: 3, tech: 4 };

const MONO = '"Geist Mono", ui-monospace, monospace';
const SERIF = '"Apple Garamond", Georgia, serif';
const MASCARA = '#0f0c0a', COBRE = '#2b2119', COBRE_BUS = '#3d2d1f', ORO = '#b8954f', SERIGRAFIA = 'rgba(231,226,218,.72)';

// Azar con semilla: la placa sale igual en cada visita
function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fila = (n, x0, paso, z, parte) => Array.from({ length: n }, (_, i) => ({ x: x0 + i * paso, z, ...parte }));
const BOBINA = { w: 1.25, h: 1.05, d: 1.25, color: '#34302c', metal: 0.5 };
const CONDENSADOR = { forma: 'pila', w: 0.72, h: 0.9, d: 0.72, color: '#8d8881', metal: 0.9 };

// Cada pieza: su sitio, sus partes (cajas o cilindros, «pila»; y0, a qué altura empieza) y su LED. Los buses van del
// borde del procesador al de la pieza; n pistas separadas «ancho». «aterriza», dónde se conecta el cable del menú
export function disposicion(vertical) {
  if (!vertical) {
    return {
      piezas: [
        { slug: 'tech', x: 0, z: -1, led: [6.1, -5.4], designador: 'U1', partes: [
          { dx: 0, dz: 0, w: 9.6, h: 0.45, d: 9.6, color: '#25211d', metal: 0.35 },
          { dx: 0, dz: 0, w: 6.8, h: 0.5, d: 6.8, y0: 0.45, color: '#b3ada4', metal: 0.9, arriba: 'ihs' },
        ] },
        { slug: 'proyectos', x: 14, z: -1, led: [19.6, -1], designador: 'M2_1', partes: [
          { dx: -5.3, dz: 0, w: 1, h: 0.55, d: 2.9, color: '#1d1a17', metal: 0.2 },
          { dx: 0, dz: 0, w: 9.6, h: 0.18, d: 2.6, y0: 0.32, color: '#151210', metal: 0.2, arriba: 'ssd' },
        ] },
        { slug: 'brand', x: 0, z: 8.8, led: [14.2, 8.8], designador: 'PCIE_1', partes: [
          { dx: 0, dz: 0, w: 25.6, h: 0.5, d: 1.1, color: '#1b1815', metal: 0.1 },
          { dx: 0.4, dz: 0, w: 24, h: 3.4, d: 1.8, y0: 0.3, color: '#1c1916', metal: 0.4, arriba: 'vga-arriba', frente: 'vga-frente' },
        ] },
        { slug: 'about', x: -12.6, z: -1, led: [-9.6, 1.2], designador: 'U14 · BAT1', partes: [
          { forma: 'pila', dx: -0.9, dz: 0.3, w: 3.5, h: 0.32, d: 3.5, color: '#c9c4bc', metal: 1, arriba: 'pila' },
          { dx: 1.6, dz: -2.6, w: 2.4, h: 0.28, d: 1.9, color: '#161311', metal: 0.2, arriba: 'bios' },
        ] },
      ],
      decor: [...fila(8, -5.25, 1.5, -7.4, BOBINA), ...fila(7, -4.5, 1.5, -9.0, CONDENSADOR)],
      buses: [
        { slug: 'proyectos', n: 6, ancho: 0.3, ruta: [[4.8, -1], [8.2, -1]] },
        { slug: 'brand', n: 10, ancho: 0.3, ruta: [[0, 3.8], [0, 8.25]] },
        { slug: 'about', n: 4, ancho: 0.32, ruta: [[-4.8, -2.2], [-7.6, -2.2], [-9, -3.6], [-9.8, -3.6]] },
        { slug: 'tech', n: 8, ancho: 0.28, ruta: [[-4.8, -4.6], [-6.6, -4.6], [-6.6, -12], [-10.2, -15.6], [-36, -15.6]] },
        { slug: 'tech', n: 8, ancho: 0.28, ruta: [[4.8, -4.6], [6.6, -4.6], [6.6, -12], [10.2, -15.6], [36, -15.6]] },
      ],
      firma: [-30, 12.6],
      aterriza: [-6.6, -9.4],   // donde se conecta el cable del menú: en el bus del procesador que sube a la izquierda
    };
  }
  // En vertical (el móvil), las piezas en columna y un poco a la izquierda: sus nombres van a la derecha
  return {
    piezas: [
      { slug: 'about', x: -3.2, z: -14.4, led: [-3.2, -11.3], designador: 'U14 · BAT1', partes: [
        { forma: 'pila', dx: -1.9, dz: 0, w: 3.5, h: 0.32, d: 3.5, color: '#c9c4bc', metal: 1, arriba: 'pila' },
        { dx: 2.0, dz: 0, w: 2.4, h: 0.28, d: 1.9, color: '#161311', metal: 0.2, arriba: 'bios' },
      ] },
      { slug: 'tech', x: -3.2, z: -3.6, led: [-3, 2.1], designador: 'U1', partes: [
        { dx: 0, dz: 0, w: 9.6, h: 0.45, d: 9.6, color: '#25211d', metal: 0.35 },
        { dx: 0, dz: 0, w: 6.8, h: 0.5, d: 6.8, y0: 0.45, color: '#b3ada4', metal: 0.9, arriba: 'ihs' },
      ] },
      { slug: 'proyectos', x: -3, z: 4.4, led: [-1, 6.8], designador: 'M2_1', partes: [
        { dx: -5.3, dz: 0, w: 1, h: 0.55, d: 2.9, color: '#1d1a17', metal: 0.2 },
        { dx: 0, dz: 0, w: 9.6, h: 0.18, d: 2.6, y0: 0.32, color: '#151210', metal: 0.2, arriba: 'ssd' },
      ] },
      { slug: 'brand', x: -3.2, z: 10.8, led: [-3.2, 12.9], designador: 'PCIE_1', partes: [
        { dx: 0, dz: 0, w: 12.6, h: 0.5, d: 1.1, color: '#1b1815', metal: 0.1 },
        { dx: 0.3, dz: 0, w: 11.6, h: 2.6, d: 1.6, y0: 0.3, color: '#1c1916', metal: 0.4, arriba: 'vga-arriba', frente: 'vga-frente' },
      ] },
    ],
    decor: fila(6, -6.95, 1.5, -9.5, BOBINA),
    buses: [
      { slug: 'proyectos', n: 5, ancho: 0.3, ruta: [[-6, 1.2], [-6, 1.3], [-7.65, 2.95]] },
      { slug: 'brand', n: 6, ancho: 0.3, ruta: [[0.4, 1.2], [0.4, 1.6], [3.6, 4.8], [3.6, 8.4], [1.75, 10.25]] },
      { slug: 'about', n: 4, ancho: 0.32, ruta: [[1, -8.4], [1.6, -9], [1.6, -12.1], [-0.3, -12.1], [-0.9, -12.7], [-0.9, -13.45]] },
      { slug: 'tech', n: 6, ancho: 0.28, ruta: [[-8, -1], [-36, -1]] },
      { slug: 'tech', n: 6, ancho: 0.28, ruta: [[1.6, -1], [36, -1]] },
    ],
    firma: [-9.4, 15.6],
    aterriza: [-8.8, -1],
  };
}

// La caja que ocupa una pieza en la placa (para su sombra, para no pisarla con pistas y para el ratón)
export function huella(p) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity, h = 0;
  for (const q of p.partes) {
    x0 = Math.min(x0, p.x + q.dx - q.w / 2); x1 = Math.max(x1, p.x + q.dx + q.w / 2);
    z0 = Math.min(z0, p.z + q.dz - q.d / 2); z1 = Math.max(z1, p.z + q.dz + q.d / 2);
    h = Math.max(h, (q.y0 || 0) + q.h);
  }
  return { x0, z0, x1, z1, h };
}

// Una línea quebrada desplazada «d» a un lado (en los codos, a inglete): las pistas paralelas de un bus
function paralela(ruta, d) {
  return ruta.map((p, i) => {
    const a = ruta[Math.max(0, i - 1)], b = ruta[Math.min(ruta.length - 1, i + 1)];
    const n1 = i > 0 ? normal(a, p) : normal(p, b), n2 = i < ruta.length - 1 ? normal(p, b) : n1;
    const m = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(m[0], m[1]) || 1;
    const k = d / Math.max(0.35, (m[0] / l) * n1[0] + (m[1] / l) * n1[1]);
    return [p[0] + (m[0] / l) * k, p[1] + (m[1] / l) * k];
  });
}
function normal(a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
  return [-dz / l, dx / l];
}

// --- La placa --------------------------------------------------------------------------------------------------------
export function pintarPlaca(disp, N) {
  const u = N / LADO;
  const X = (v) => (v / LADO + 0.5) * N;
  const aspecto = lienzo(N, N), senal = lienzo(N, N);
  const ctx = aspecto.getContext('2d'), sc = senal.getContext('2d');
  const r = azar(2026);
  const huellas = disp.piezas.map(huella).concat(disp.decor.map((q) => ({ x0: q.x - q.w / 2, x1: q.x + q.w / 2, z0: q.z - q.d / 2, z1: q.z + q.d / 2 })));
  const libre = (x, z, m = 0.6) => huellas.every((h) => x < h.x0 - m || x > h.x1 + m || z < h.z0 - m || z > h.z1 + m);

  // Máscara mate, con su grano y alguna zona de cobre debajo (los planos de masa)
  ctx.fillStyle = MASCARA; ctx.fillRect(0, 0, N, N);
  for (let i = 0; i < 26; i++) {
    const x = X((r() - 0.5) * LADO), z = X((r() - 0.5) * LADO), w = (3 + r() * 9) * u, h = (2 + r() * 7) * u;
    ctx.fillStyle = 'rgba(30,23,18,.55)'; ctx.fillRect(x, z, w, h);
  }
  for (let i = 0; i < N * 6; i++) {
    ctx.fillStyle = r() < 0.5 ? 'rgba(255,240,225,.025)' : 'rgba(0,0,0,.18)';
    ctx.fillRect(r() * N, r() * N, 1.5, 1.5);
  }

  const via = (x, z, rr = 0.22) => {
    ctx.fillStyle = ORO; ctx.beginPath(); ctx.arc(X(x), X(z), rr * u, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#070605'; ctx.beginPath(); ctx.arc(X(x), X(z), rr * 0.46 * u, 0, Math.PI * 2); ctx.fill();
  };
  const trazo = (pts, color, ancho) => {
    ctx.strokeStyle = color; ctx.lineWidth = ancho * u; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); pts.forEach(([x, z], i) => (i ? ctx.lineTo(X(x), X(z)) : ctx.moveTo(X(x), X(z)))); ctx.stroke();
  };
  const texto = (t, x, z, tam, { color = SERIGRAFIA, fuente = MONO, alinear = 'left', peso = 400 } = {}) => {
    ctx.font = `${peso} ${tam * u}px ${fuente}`;
    ctx.fillStyle = color; ctx.textAlign = alinear; ctx.textBaseline = 'middle';
    ctx.fillText(t, X(x), X(z));
  };

  // Pistas sueltas por toda la placa: tramos rectos y a 45°, con una vía en cada punta (sin pisar las piezas)
  // (direcciones: 0-3 rectas, 4-7 a 45°; cada codo gira 45° a un lado o a otro)
  const DIR = [[1, 0], [0, 1], [-1, 0], [0, -1], [0.7071, 0.7071], [-0.7071, 0.7071], [0.7071, -0.7071], [-0.7071, -0.7071]];
  const GIRO = [[4, 6], [4, 5], [5, 7], [6, 7], [0, 1], [1, 2], [0, 3], [2, 3]];
  for (let i = 0; i < N * 0.18; i++) {
    let x = Math.round(((r() - 0.5) * LADO * 0.96) * 2) / 2, z = Math.round(((r() - 0.5) * LADO * 0.96) * 2) / 2;
    if (!libre(x, z)) continue;
    const pts = [[x, z]];
    let d = Math.floor(r() * 4);
    for (let s = 0, n = 2 + Math.floor(r() * 3); s < n; s++) {
      const l = 1 + r() * 6;
      const nx = x + DIR[d][0] * l, nz = z + DIR[d][1] * l;
      if (!libre(nx, nz) || !libre((x + nx) / 2, (z + nz) / 2)) break;
      x = nx; z = nz; pts.push([x, z]);
      d = GIRO[d][r() < 0.5 ? 0 : 1];
    }
    if (pts.length < 2) continue;
    trazo(pts, COBRE, 0.1 + r() * 0.08);
    if (r() < 0.45) via(...pts[0], 0.15);
    if (r() < 0.45) via(...pts[pts.length - 1], 0.15);
  }

  // Componentes pequeños (resistencias y condensadores de montaje superficial), con su designador a veces
  for (let i = 0; i < N * 0.16; i++) {
    const x = (r() - 0.5) * LADO * 0.94, z = (r() - 0.5) * LADO * 0.94;
    if (!libre(x, z, 0.4)) continue;
    const vertical = r() < 0.4, w = vertical ? 0.22 : 0.44, h = vertical ? 0.44 : 0.22;
    ctx.fillStyle = r() < 0.5 ? '#2a2420' : '#5b4a36';
    ctx.fillRect(X(x - w / 2), X(z - h / 2), w * u, h * u);
    ctx.fillStyle = ORO;
    if (vertical) { ctx.fillRect(X(x - w / 2), X(z - h / 2), w * u, 0.09 * u); ctx.fillRect(X(x - w / 2), X(z + h / 2 - 0.09), w * u, 0.09 * u); }
    else { ctx.fillRect(X(x - w / 2), X(z - h / 2), 0.09 * u, h * u); ctx.fillRect(X(x + w / 2 - 0.09), X(z - h / 2), 0.09 * u, h * u); }
    if (r() < 0.12) texto(`${r() < 0.5 ? 'R' : 'C'}${100 + Math.floor(r() * 400)}`, x + 0.4, z, 0.3, { color: 'rgba(231,226,218,.45)' });
  }

  // Los buses: en el aspecto, cobre más vivo; en la señal, a qué pieza van y a qué distancia del procesador
  for (const b of disp.buses) {
    const id = BUS[b.slug];
    for (let k = 0; k < b.n; k++) {
      const pts = paralela(b.ruta, (k - (b.n - 1) / 2) * b.ancho);
      trazo(pts, COBRE_BUS, 0.13);
      via(...pts[pts.length - 1], 0.16);
      // La señal, a trozos de 0,12 para que el verde suba con la distancia
      sc.lineWidth = 0.2 * u; sc.lineCap = 'butt';
      let dist = 0;
      for (let s = 1; s < pts.length; s++) {
        const [ax, az] = pts[s - 1], [bx, bz] = pts[s];
        const l = Math.hypot(bx - ax, bz - az), pasos = Math.max(1, Math.ceil(l / 0.12));
        for (let j = 0; j < pasos; j++) {
          const t0 = j / pasos, t1 = (j + 1) / pasos;
          sc.strokeStyle = `rgb(${id * 60},${Math.floor((dist + l * t0) * 12) % 256},255)`;
          sc.beginPath(); sc.moveTo(X(ax + (bx - ax) * t0), X(az + (bz - az) * t0)); sc.lineTo(X(ax + (bx - ax) * t1), X(az + (bz - az) * t1)); sc.stroke();
        }
        dist += l;
      }
    }
  }

  // Huellas de las piezas: contactos y serigrafía (designador, el contorno y la etiqueta de su LED)
  const contorno = (x0, z0, x1, z1) => { ctx.strokeStyle = SERIGRAFIA; ctx.lineWidth = 0.07 * u; ctx.strokeRect(X(x0), X(z0), (x1 - x0) * u, (z1 - z0) * u); };
  const PIEZA = { tech: 'CPU', proyectos: 'SSD', brand: 'VGA', about: 'BIOS' };
  for (const p of disp.piezas) {
    const h = huella(p);
    contorno(h.x0 - 0.35, h.z0 - 0.35, h.x1 + 0.35, h.z1 + 0.35);
    // el triángulo del pin 1
    ctx.fillStyle = SERIGRAFIA; ctx.beginPath();
    ctx.moveTo(X(h.x0 - 0.35), X(h.z0 - 0.35)); ctx.lineTo(X(h.x0 + 0.6), X(h.z0 - 0.35)); ctx.lineTo(X(h.x0 - 0.35), X(h.z0 + 0.6)); ctx.fill();
    texto(p.designador, h.x0 - 0.3, h.z0 - 0.95, 0.5);
    // El LED de estado, con su nombre al lado (como los de diagnóstico de las placas: CPU, SSD, VGA, BOOT)
    const [lx, lz] = p.led;
    ctx.fillStyle = ORO; ctx.fillRect(X(lx - 0.42), X(lz - 0.2), 0.18 * u, 0.4 * u); ctx.fillRect(X(lx + 0.24), X(lz - 0.2), 0.18 * u, 0.4 * u);
    texto(PIEZA[p.slug], lx + 0.65, lz, 0.46);
  }
  // La ranura PCIe y el conector M.2 llevan sus contactos dorados a la vista; el SSD, su tornillo al otro extremo
  for (const p of disp.piezas) {
    if (p.slug === 'proyectos') { via(p.x + 5.25, p.z, 0.55); }
    if (p.slug === 'about') {
      const bios = p.partes[1];
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = ORO;
        ctx.fillRect(X(p.x + bios.dx - 0.95 + k * 0.62), X(p.z + bios.dz - bios.d / 2 - 0.45), 0.28 * u, 0.5 * u);
        ctx.fillRect(X(p.x + bios.dx - 0.95 + k * 0.62), X(p.z + bios.dz + bios.d / 2 - 0.05), 0.28 * u, 0.5 * u);
      }
    }
  }
  disp.decor.forEach((q, i) => { if (q.forma !== 'pila') texto(`L${i + 1}`, q.x - q.w / 2, q.z - q.d / 2 - 0.4, 0.34, { color: 'rgba(231,226,218,.5)' }); });

  // Agujeros de montaje en las esquinas de la zona de las piezas
  const todas = disp.piezas.map(huella);
  const caja = { x0: Math.min(...todas.map((h) => h.x0)) - 3, x1: Math.max(...todas.map((h) => h.x1)) + 3, z0: Math.min(...todas.map((h) => h.z0)) - 3.5, z1: Math.max(...todas.map((h) => h.z1)) + 2.5 };
  for (const [x, z] of [[caja.x0, caja.z0], [caja.x1, caja.z0], [caja.x0, caja.z1], [caja.x1, caja.z1]]) {
    ctx.strokeStyle = SERIGRAFIA; ctx.lineWidth = 0.06 * u; ctx.beginPath(); ctx.arc(X(x), X(z), 0.9 * u, 0, Math.PI * 2); ctx.stroke();
    via(x, z, 0.55);
  }

  // La firma de la placa
  const [fx, fz] = disp.firma;
  texto('adsPartners', fx, fz, 1.5, { fuente: SERIF, peso: 300 });
  texto('MADRID · REV. 2026 · BRAND POR FUERA, TECH POR DENTRO', fx, fz + 1.3, 0.42);
  return { aspecto, senal };
}

// --- Las caras con dibujo ------------------------------------------------------------------------------------------
// datos: lo que se escribe en ellas (frase de cada página, de data/menu.js)
export function pintarCaras(datos) {
  const caras = {};
  const nueva = (nombre, w, h, pintar) => { const c = lienzo(w, h); pintar(c.getContext('2d'), w, h); caras[nombre] = c; };
  const de = (slug) => datos.find((d) => d.slug === slug) || {};

  // El disipador del procesador: metal cepillado, con el grabado
  nueva('ihs', 512, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#c4beb4'); g.addColorStop(1, '#9a948b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const r = azar(7);
    for (let i = 0; i < 700; i++) { ctx.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '0,0,0'},${0.015 + r() * 0.03})`; ctx.fillRect(0, r() * h, w, 1); }
    ctx.fillStyle = 'rgba(70,64,58,.85)';
    ctx.font = `300 78px ${SERIF}`; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('adsPartners', 46, 168);
    ctx.font = `400 19px ${MONO}`;
    const frase = (de('tech').frase || '').toUpperCase().split(', ');
    ['TECH · U1', ...frase, 'MADRID · 2026'].forEach((t, i) => ctx.fillText(t, 50, 230 + i * 30));
    // Una matriz de datos, como la que llevan grabada (aquí con el nombre de la casa)
    const bits = [...new TextEncoder().encode('adsPartners')].flatMap((v) => [...v.toString(2).padStart(8, '0')].map(Number));
    for (let i = 0; i < 12 * 12; i++) if (bits[i % bits.length]) ctx.fillRect(360 + (i % 12) * 9, 330 + Math.floor(i / 12) * 9, 8, 8);
  });

  // El SSD: su placa, el controlador, dos chips de memoria, la pegatina y los contactos dorados del conector
  nueva('ssd', 1024, 278, (ctx, w, h) => {
    ctx.fillStyle = '#151210'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = ORO; for (let i = 0; i < 26; i++) if (i !== 6) ctx.fillRect(4, 14 + i * 9.6, 30, 6);
    const chip = (x, y, cw, ch, t) => {
      ctx.fillStyle = '#211c18'; ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
      ctx.fillStyle = 'rgba(231,226,218,.55)'; ctx.font = `400 15px ${MONO}`; ctx.fillText(t, x + 12, y + 26);
    };
    chip(90, 62, 150, 150, 'ads · ctrl');
    chip(300, 46, 230, 186, 'ads · NAND');
    chip(580, 46, 230, 186, 'ads · NAND');
    ctx.fillStyle = '#e7e2da'; ctx.fillRect(320, 92, 470, 96);
    ctx.fillStyle = '#190900'; ctx.font = `400 26px ${MONO}`; ctx.fillText('M.2 2280 · ARCHIVO', 340, 132);
    ctx.font = `400 19px ${MONO}`; ctx.fillText((de('proyectos').frase || '').toUpperCase(), 340, 168);
    ctx.fillStyle = ORO; ctx.beginPath(); ctx.arc(w - 26, h / 2, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#070605'; ctx.beginPath(); ctx.arc(w - 26, h / 2, 10, 0, Math.PI * 2); ctx.fill();
  });

  // La gráfica, por arriba (la carcasa, con rejillas y una línea rosa) y por delante (los dos ventiladores)
  nueva('vga-arriba', 1024, 76, (ctx, w, h) => {
    ctx.fillStyle = '#1c1916'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#F5CBD7'; ctx.fillRect(196, h * 0.3 - 1, w * 0.62 - 196, 2);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; for (let i = 0; i < 40; i++) ctx.fillRect(w * 0.66 + i * 8.4, 12, 4, h - 24);
    ctx.fillStyle = '#F5CBD7'; ctx.font = `300 30px ${SERIF}`; ctx.textBaseline = 'middle'; ctx.fillText('adsPartners', 22, h * 0.3);
  });
  nueva('vga-frente', 1024, 145, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#262220'); g.addColorStop(1, '#151210');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (const cx of [w * 0.3, w * 0.7]) {
      const rr = h * 0.42;
      ctx.fillStyle = '#0c0a09'; ctx.beginPath(); ctx.arc(cx, h / 2, rr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(231,226,218,.18)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = 'rgba(231,226,218,.32)'; ctx.lineWidth = 3;
      for (let a = 0; a < 11; a++) {
        const t = (a / 11) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(cx, h / 2, rr * 0.62, t, t + 0.55); ctx.stroke();
      }
      ctx.fillStyle = '#F5CBD7'; ctx.beginPath(); ctx.arc(cx, h / 2, rr * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#190900'; ctx.font = `600 ${Math.round(rr * 0.2)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('ads', cx, h / 2 + 1);
    }
    ctx.fillStyle = '#F5CBD7'; ctx.fillRect(0, h - 5, w, 3);
  });

  // La BIOS y la pila
  nueva('bios', 256, 202, (ctx, w, h) => {
    ctx.fillStyle = '#161311'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(231,226,218,.8)'; ctx.font = `400 44px ${MONO}`; ctx.fillText('BIOS', 34, 96);
    ctx.font = `400 19px ${MONO}`; ctx.fillText('ads · 2026', 36, 136);
    ctx.beginPath(); ctx.arc(26, 26, 9, 0, Math.PI * 2); ctx.fill();
  });
  nueva('pila', 512, 512, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w * 0.4, h * 0.38, 20, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#e2ddd5'); g.addColorStop(1, '#8f8a83');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(60,56,52,.8)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `400 64px ${MONO}`; ctx.fillText('CR2032', w / 2, h * 0.46);
    ctx.font = `400 40px ${MONO}`; ctx.fillText('3V  +', w / 2, h * 0.6);
  });
  return caras;
}
