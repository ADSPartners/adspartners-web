// Los modelos en alambre de Tech, hechos en código (Orano los carga en .obj; aquí no hay ficheros),
// y las piezas del paisaje que no se calculan en el shader: la peana de cada estación, las antenas y la sala.
// Cada modelo es una lista de segmentos: dos puntos y si es la pieza protagonista (acento 1, en rosa) o no (crema),
// como la cámara amarilla sobre el rover de Orano. Todos caben en una caja de unas 3 × 2,4 unidades, con la base
// hacia y = -0,9 y el centro en el origen.

class Trazo {
  constructor() { this.p = []; this.a = []; }
  linea(x1, y1, z1, x2, y2, z2, ac = 0) { this.p.push(x1, y1, z1, x2, y2, z2); this.a.push(ac, ac); return this; }
  // Polilínea por una lista de puntos [x, y, z]
  poli(pts, ac = 0, cerrada = false) {
    for (let i = 0; i < pts.length - 1; i++) this.linea(...pts[i], ...pts[i + 1], ac);
    if (cerrada) this.linea(...pts[pts.length - 1], ...pts[0], ac);
    return this;
  }
  // Caja alineada con los ejes: sus 12 aristas
  caja(cx, cy, cz, w, h, d, ac = 0) {
    const x = [cx - w / 2, cx + w / 2], y = [cy - h / 2, cy + h / 2], z = [cz - d / 2, cz + d / 2];
    for (const yy of y) for (const zz of z) this.linea(x[0], yy, zz, x[1], yy, zz, ac);
    for (const xx of x) for (const zz of z) this.linea(xx, y[0], zz, xx, y[1], zz, ac);
    for (const xx of x) for (const yy of y) this.linea(xx, yy, z[0], xx, yy, z[1], ac);
    return this;
  }
  // Círculo en el plano que se pida ('xz' horizontal, 'xy' de frente, 'yz' de lado)
  circulo(cx, cy, cz, r, n = 28, plano = 'xz', ac = 0) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2, c = Math.cos(t) * r, s = Math.sin(t) * r;
      pts.push(plano === 'xz' ? [cx + c, cy, cz + s] : plano === 'xy' ? [cx + c, cy + s, cz] : [cx, cy + c, cz + s]);
    }
    return this.poli(pts, ac, true);
  }
  // Cilindro vertical: dos círculos y unas cuantas generatrices
  cilindro(cx, cy, cz, r, h, n = 24, ac = 0, rayas = 8) {
    this.circulo(cx, cy - h / 2, cz, r, n, 'xz', ac).circulo(cx, cy + h / 2, cz, r, n, 'xz', ac);
    for (let i = 0; i < rayas; i++) {
      const t = (i / rayas) * Math.PI * 2;
      this.linea(cx + Math.cos(t) * r, cy - h / 2, cz + Math.sin(t) * r, cx + Math.cos(t) * r, cy + h / 2, cz + Math.sin(t) * r, ac);
    }
    return this;
  }
  // Rejilla en un rectángulo del plano xz (a la altura y)
  rejilla(cx, cy, cz, w, d, nx, nz, ac = 0) {
    for (let i = 0; i <= nx; i++) { const x = cx - w / 2 + (w * i) / nx; this.linea(x, cy, cz - d / 2, x, cy, cz + d / 2, ac); }
    for (let j = 0; j <= nz; j++) { const z = cz - d / 2 + (d * j) / nz; this.linea(cx - w / 2, cy, z, cx + w / 2, cy, z, ac); }
    return this;
  }
  // Añade otro trazo girado sobre x (inclinación) y sobre y, y movido
  junta(otro, { rx = 0, ry = 0, x = 0, y = 0, z = 0 } = {}) {
    const cxr = Math.cos(rx), sxr = Math.sin(rx), cyr = Math.cos(ry), syr = Math.sin(ry);
    for (let i = 0; i < otro.p.length; i += 3) {
      let px = otro.p[i], py = otro.p[i + 1], pz = otro.p[i + 2];
      const y1 = py * cxr - pz * sxr, z1 = py * sxr + pz * cxr;           // giro en x
      const x2 = px * cyr + z1 * syr, z2 = -px * syr + z1 * cyr;          // giro en y
      this.p.push(x2 + x, y1 + y, z2 + z);
    }
    this.a.push(...otro.a);
    return this;
  }
  listo() { return { posicion: new Float32Array(this.p), acento: new Float32Array(this.a) }; }
}

// --- 03 · Automatiza: un escáner de documentos con la factura encima (la factura, en rosa) ---------------------
function escaner() {
  const t = new Trazo();
  // El cuerpo: una caja baja con el cristal y la ranura de salida
  t.caja(0, -0.72, 0.2, 2.5, 0.36, 1.7);
  t.caja(0, -0.52, 0.2, 2.3, 0.04, 1.5);
  t.rejilla(0, -0.5, 0.2, 2.1, 1.3, 10, 6);
  t.caja(0, -0.78, 1.1, 1.9, 0.08, 0.12);
  // Los pies
  for (const [x, z] of [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.9], [1.1, 0.9]]) t.cilindro(x, -0.95, z, 0.07, 0.1, 10, 0, 4);
  // La bandeja de entrada, inclinada hacia atrás
  const bandeja = new Trazo();
  bandeja.caja(0, 0, 0, 1.9, 0.04, 1.3);
  bandeja.linea(-0.95, 0.02, -0.65, -0.95, 0.18, -0.65).linea(0.95, 0.02, -0.65, 0.95, 0.18, -0.65);
  t.junta(bandeja, { rx: 1.05, y: 0.05, z: -0.85 });
  // La factura apoyada en la bandeja: el contorno, la cabecera, las líneas y el total
  const hoja = new Trazo();
  const W = 1.5, H = 1.95;
  hoja.poli([[-W / 2, -H / 2, 0], [W / 2, -H / 2, 0], [W / 2, H / 2, 0], [-W / 2, H / 2, 0]], 1, true);
  hoja.caja(-0.42, 0.74, 0, 0.5, 0.22, 0.001, 1);                       // el logo del proveedor
  for (let i = 0; i < 3; i++) hoja.linea(0.12, 0.82 - i * 0.09, 0, 0.62, 0.82 - i * 0.09, 0, 1);
  hoja.linea(-0.66, 0.42, 0, 0.66, 0.42, 0, 1);
  for (let i = 0; i < 6; i++) {
    const y = 0.3 - i * 0.14;
    hoja.linea(-0.62, y, 0, -0.05, y, 0, 1).linea(0.12, y, 0, 0.3, y, 0, 1).linea(0.42, y, 0, 0.62, y, 0, 1);
  }
  hoja.linea(-0.66, -0.58, 0, 0.66, -0.58, 0, 1);
  hoja.caja(0.36, -0.75, 0, 0.56, 0.2, 0.001, 1);                        // el total
  t.junta(hoja, { rx: -0.52, y: 0.36, z: -0.97 });
  return t.listo();
}

// --- 01 · Pregunta: un portátil con la gráfica de la respuesta en la pantalla (la gráfica, en rosa) -------------
function portatil() {
  const t = new Trazo();
  t.caja(0, -0.84, 0.35, 2.7, 0.1, 1.75);
  t.rejilla(0, -0.785, 0.15, 2.2, 0.8, 13, 4);                           // el teclado
  t.caja(0, -0.785, 0.9, 0.9, 0.001, 0.45);                              // el panel táctil
  const pantalla = new Trazo();
  pantalla.caja(0, 0.85, 0, 2.7, 1.7, 0.06);
  pantalla.poli([[-1.22, 0.1, 0.04], [1.22, 0.1, 0.04], [1.22, 1.6, 0.04], [-1.22, 1.6, 0.04]], 0, true);
  // La pregunta (una burbuja) y la respuesta: el gráfico de barras y su eje
  pantalla.poli([[-1.05, 1.42, 0.05], [-0.1, 1.42, 0.05], [-0.1, 1.24, 0.05], [-0.95, 1.24, 0.05], [-1.05, 1.16, 0.05]], 0, true);
  pantalla.linea(-0.98, 1.33, 0.05, -0.3, 1.33, 0.05);
  pantalla.linea(-0.95, 0.25, 0.05, 1.05, 0.25, 0.05, 1).linea(-0.95, 0.25, 0.05, -0.95, 1.05, 0.05, 1);
  const alturas = [0.28, 0.42, 0.36, 0.55, 0.48, 0.7];
  alturas.forEach((h, i) => {
    const x = -0.78 + i * 0.3;
    pantalla.poli([[x, 0.25, 0.05], [x, 0.25 + h, 0.05], [x + 0.18, 0.25 + h, 0.05], [x + 0.18, 0.25, 0.05]], 1);
  });
  pantalla.poli(alturas.map((h, i) => [-0.69 + i * 0.3, 0.25 + h + 0.12, 0.05]), 1);
  t.junta(pantalla, { rx: -0.22, y: -0.79, z: -0.52 });
  return t.listo();
}

// --- 04 · A medida: un microscopio con la muestra en la platina (la muestra, en rosa) ---------------------------
function microscopio() {
  const t = new Trazo();
  t.caja(0, -0.85, 0.15, 1.7, 0.16, 1.25);                               // la base
  t.caja(0, -0.75, -0.35, 0.5, 0.06, 0.4);
  // El brazo, en C, por detrás
  t.poli([[-0.18, -0.77, -0.45], [-0.18, 0.4, -0.45], [-0.18, 1.05, -0.15], [-0.18, 1.15, 0.2]]);
  t.poli([[0.18, -0.77, -0.45], [0.18, 0.4, -0.45], [0.18, 1.05, -0.15], [0.18, 1.15, 0.2]]);
  t.poli([[-0.18, -0.77, -0.25], [-0.18, 0.3, -0.25], [-0.18, 0.88, -0.02]]);
  t.poli([[0.18, -0.77, -0.25], [0.18, 0.3, -0.25], [0.18, 0.88, -0.02]]);
  for (const y of [-0.77, 0.3]) t.linea(-0.18, y, -0.45, 0.18, y, -0.45).linea(-0.18, y, -0.25, 0.18, y, -0.25);
  t.circulo(0.24, -0.35, -0.35, 0.16, 20, 'yz').circulo(0.3, -0.35, -0.35, 0.16, 20, 'yz');   // el mando
  t.circulo(-0.24, -0.35, -0.35, 0.16, 20, 'yz');
  // La platina, la muestra y las pinzas
  t.caja(0, -0.12, 0.22, 1.25, 0.06, 0.95);
  t.caja(0, -0.075, 0.22, 1.0, 0.02, 0.34, 1);
  t.circulo(0, -0.06, 0.22, 0.13, 24, 'xz', 1).circulo(0, -0.06, 0.22, 0.07, 18, 'xz', 1);
  t.linea(-0.45, -0.07, 0.05, -0.2, -0.07, 0.12).linea(0.45, -0.07, 0.05, 0.2, -0.07, 0.12);
  // El revólver con los objetivos y el tubo
  t.cilindro(0, 0.48, 0.22, 0.26, 0.12, 24, 0, 8);
  t.cilindro(0.0, 0.25, 0.22, 0.07, 0.3, 14, 0, 5).cilindro(0.17, 0.3, 0.12, 0.05, 0.22, 12, 0, 4).cilindro(-0.17, 0.3, 0.12, 0.05, 0.22, 12, 0, 4);
  const tubo = new Trazo();
  tubo.cilindro(0, 0.4, 0, 0.13, 0.8, 20, 0, 6).cilindro(0, 0.92, 0, 0.09, 0.25, 16, 0, 4);
  t.junta(tubo, { rx: 0.35, y: 0.6, z: 0.22 });
  return t.listo();
}

// --- 02 · Conecta: la tienda (una tableta) y el Excel (una hoja en pantalla), unidas por un cable (el cable, en rosa)
function conexion() {
  const t = new Trazo();
  // La tableta con la tienda, de pie a la izquierda
  const tienda = new Trazo();
  tienda.caja(0, 0, 0, 1.0, 1.4, 0.06);
  tienda.poli([[-0.42, -0.6, 0.04], [0.42, -0.6, 0.04], [0.42, 0.6, 0.04], [-0.42, 0.6, 0.04]], 0, true);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) tienda.caja(-0.2 + i * 0.42, 0.22 - j * 0.5, 0.045, 0.34, 0.34, 0.001);
  tienda.caja(0, -0.48, 0.045, 0.6, 0.1, 0.001);
  t.junta(tienda, { ry: 0.38, x: -1.25, y: 0.2, z: 0.1 });
  t.caja(-1.25, -0.6, 0.15, 0.7, 0.06, 0.5);                               // el soporte
  t.linea(-1.25, -0.57, 0.15, -1.25, -0.48, 0.05);
  // La pantalla con la hoja de cálculo, a la derecha
  const hojaCalc = new Trazo();
  hojaCalc.caja(0, 0, 0, 1.6, 1.05, 0.06);
  for (let i = 0; i <= 5; i++) hojaCalc.linea(-0.7, 0.42 - i * 0.16, 0.04, 0.7, 0.42 - i * 0.16, 0.04);
  for (let j = 0; j <= 4; j++) hojaCalc.linea(-0.7 + j * 0.35, 0.42, 0.04, -0.7 + j * 0.35, -0.38, 0.04);
  t.junta(hojaCalc, { ry: -0.42, x: 1.15, y: 0.35, z: 0.0 });
  t.caja(1.15, -0.5, 0.0, 0.12, 0.6, 0.12).caja(1.15, -0.82, 0.05, 0.8, 0.05, 0.5);
  // Los enchufes y el cable, que baja al suelo, hace una curva y sube
  t.caja(-0.8, -0.28, 0.25, 0.12, 0.12, 0.2, 1).caja(0.55, -0.15, 0.2, 0.12, 0.12, 0.2, 1);
  const cable = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40;
    const x = -0.74 + s * 1.23;
    const y = -0.28 + s * 0.13 - Math.sin(s * Math.PI) * 0.6;
    const z = 0.25 + Math.sin(s * Math.PI) * 0.55 - s * 0.05;
    cable.push([x, y, z]);
  }
  t.poli(cable, 1);
  // Los datos que pasan: tres marcas a lo largo del cable
  [0.3, 0.55, 0.8].forEach((s) => {
    const k = Math.round(s * 40), [x, y, z] = cable[k];
    t.circulo(x, y, z, 0.05, 10, 'xy', 1);
  });
  return t.listo();
}

export const MODELOS = { pregunta: portatil, conecta: conexion, automatiza: escaner, 'a-medida': microscopio };
// Lo que crece cada uno para que pesen lo mismo en pantalla (el microscopio es estrecho; el portátil, ancho)
export const ESCALA = { pregunta: 0.94, conecta: 1.04, automatiza: 1, 'a-medida': 1.32 };

// --- La peana de cada estación: el círculo del suelo, con sus marcas --------------------------------------------
export function peana() {
  const t = new Trazo();
  t.circulo(0, 0, 0, 1.62, 72).circulo(0, 0, 0, 1.44, 72);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    const grande = i % 15 === 0, r2 = grande ? 1.2 : i % 5 === 0 ? 1.32 : 1.38;
    t.linea(c * 1.44, 0, s * 1.44, c * r2, 0, s * r2);
  }
  return t.listo();
}

// --- Las antenas del valle: un mástil de celosía con la luz en la punta (en rosa). Mide 1 de alto; escena.js lo
// escala y lo planta en la ladera ---------------------------------------------------------------------------------
export function antena() {
  const t = new Trazo();
  const patas = [0, 1, 2].map((k) => (k / 3) * Math.PI * 2);
  const r = (y) => 0.11 - y * 0.08;
  const en = (a, y) => [Math.cos(a) * r(y), y, Math.sin(a) * r(y)];
  for (const a of patas) t.linea(...en(a, 0), ...en(a, 0.86));
  for (let k = 0; k < 7; k++) {
    const y0 = k * 0.12, y1 = y0 + 0.12;
    for (let p = 0; p < 3; p++) t.linea(...en(patas[p], y0), ...en(patas[(p + 1) % 3], y1));
  }
  t.linea(0, 0.86, 0, 0, 1, 0);
  t.circulo(0, 1, 0, 0.035, 8, 'xy', 1).linea(-0.07, 0.95, 0, 0.07, 0.95, 0, 1);
  return t.listo();
}

// --- La sala de las misiones: la pared del fondo, el suelo de rejilla y las aristas hacia la cámara ---------------
export function sala() {
  const t = new Trazo();
  const w = 3.6, hA = -1.45, hB = 1.75, zf = -3.2, zc = 2.6;
  t.poli([[-w, hA, zf], [w, hA, zf], [w, hB, zf], [-w, hB, zf]], 0, true);
  for (const [x, y] of [[-w, hA], [w, hA], [-w, hB], [w, hB]]) t.linea(x, y, zf, x * 2.2, y * 1.9, zc);
  for (let i = 0; i <= 18; i++) { const x = -w * 2 + (w * 4 * i) / 18; t.linea(x, hA, zf, x, hA, zc); }
  for (let j = 0; j <= 12; j++) { const z = zf + ((zc - zf) * j) / 12; t.linea(-w * 2.2, hA, z, w * 2.2, hA, z); }
  // La zona activa: un rectángulo en el centro de la pared (el amarillo fino de Orano, aquí en rosa)
  t.poli([[-1.9, -1.2, zf + 0.01], [1.9, -1.2, zf + 0.01], [1.9, 1.45, zf + 0.01], [-1.9, 1.45, zf + 0.01]], 1, true);
  return t.listo();
}
