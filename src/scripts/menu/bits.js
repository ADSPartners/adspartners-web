// Los bits del menú: mientras la cámara baja recta de la web a la placa (menu/placa.js), entre hoja y hoja flotan bits,
// ceros y unos que cambian solos y brillan un instante al cambiar. Entre las hojas de arriba, también algo de código;
// entre las de abajo, píxeles con su luz roja, verde o azul, y por todas, paquetes rosas que caen deprisa hacia la placa.
// En el último tramo, algunos llevan ya el color de la pieza a la que van. Cada tramo es una malla de cuadraditos que
// miran a la cámara (todos del mismo atlas de caracteres) y que, si la cámara pasa deprisa, dejan una estela hacia donde
// estaban. Caen despacio y, al salir por abajo de su tramo, vuelven a entrar por arriba.
import { Geometry, Program, Mesh, Texture } from 'ogl';

const MONO = '"Geist Mono", ui-monospace, monospace';
const CELDA = 64;
const CODIGO = ['<', '/', '>', '{', '}', ';', '=', '#', 'f', 'x'];   // en el atlas, del 2 al 11 (el 0 y el 1, los bits)
const PIXEL = 12, PAQUETE = 13;
const CREMA = [231 / 255, 226 / 255, 218 / 255];
const ROSA = [245 / 255, 203 / 255, 215 / 255];
const SENAL = [1, 0.42, 0.66];
const LUCES = [[1, 0.3, 0.28], [0.36, 1, 0.5], [0.38, 0.55, 1]];

// Cada tramo, de arriba abajo (encima de la página, entre la página y su código, entre el código y los píxeles, y entre
// los píxeles y la placa): n, cuántos; codigo, pixeles y paquetes, qué parte no son bits; piezas, si algunos van del
// color de su pieza, y grande, cuánto más grandes (el último se ve desde más lejos)
const TRAMOS = [
  { n: 200, codigo: 0.3, pixeles: 0, paquetes: 0.03 },
  { n: 700, codigo: 0.26, pixeles: 0, paquetes: 0.05 },
  { n: 700, codigo: 0.04, pixeles: 0.22, paquetes: 0.05 },
  { n: 760, codigo: 0, pixeles: 0.14, paquetes: 0.09, piezas: 0.25, grande: 1.7 },
];

// Azar con semilla: salen igual en cada visita
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

// El atlas: 8 × 2 celdas en blanco sobre transparente (el color lo pone cada bit): los dos bits, el código, el píxel (un
// cuadrado) y el paquete (un punto difuminado)
function pintarAtlas() {
  const c = document.createElement('canvas');
  c.width = CELDA * 8; c.height = CELDA * 2;
  const ctx = c.getContext('2d');
  const sitio = (i) => [(i % 8) * CELDA, Math.floor(i / 8) * CELDA];
  ctx.fillStyle = '#fff';
  ctx.font = `500 ${CELDA * 0.7}px ${MONO}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ['0', '1', ...CODIGO].forEach((g, i) => { const [x, y] = sitio(i); ctx.fillText(g, x + CELDA / 2, y + CELDA * 0.53); });
  const [px, py] = sitio(PIXEL);
  ctx.fillRect(px + 14, py + 14, CELDA - 28, CELDA - 28);
  const [qx, qy] = sitio(PAQUETE), m = CELDA / 2;
  const g = ctx.createRadialGradient(qx + m, qy + m, 0, qx + m, qy + m, m * 0.8);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(qx, qy, CELDA, CELDA);
  return c;
}

// Cada cuadradito se coloca en la pantalla: su cabeza, donde está ahora, y su estela, hacia donde estaba hace uTau
// segundos (por lo que se mueve la cámara y por lo que cae él), como mucho un tercio de la pantalla. Lo que pasa pegado a
// la cámara se apaga (sería enorme) y también lo que entra o sale por los bordes de su tramo
const VERT = /* glsl */ `#version 300 es
in vec2 position;
in vec3 aPos; in vec4 aDatos; in vec3 aColor;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
uniform float uT, uSuelo, uAlto, uTau, uAsp;
uniform vec2 uExt;
uniform vec3 uVel;
out vec2 vOff; out vec2 vE; out vec3 vColor; out float vH; out float vAlfa; flat out float vGlifo;
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  float tam = aDatos.x, cae = aDatos.y, glifo = aDatos.z, s = aDatos.w;
  vOff = vec2(0.0); vE = vec2(0.0); vH = 1.0; vAlfa = 0.0; vColor = aColor; vGlifo = 0.0;
  float f = mod(aPos.y - cae * uT / uAlto, 1.0);
  vec3 p = vec3(aPos.x * uExt.x + sin(uT * 0.6 + s * 40.0) * 0.05, uSuelo + f * uAlto, aPos.z * uExt.y + cos(uT * 0.5 + s * 30.0) * 0.05);
  // Los bits cambian solos, cada uno a su ritmo, y brillan un instante al cambiar
  float flash = 0.0;
  if (glifo < 0.0) {
    float ritmo = uT * (0.35 + fract(s * 7.31) * 2.4) + s * 13.0;
    glifo = step(0.5, azar(vec2(s * 91.0, floor(ritmo))));
    flash = pow(1.0 - fract(ritmo), 8.0);
  }
  vec4 v = viewMatrix * modelMatrix * vec4(p, 1.0);
  vec4 c0 = projectionMatrix * v;
  if (c0.w < 0.05) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
  vec3 rel = mat3(viewMatrix) * (vec3(0.0, -cae, 0.0) - uVel);
  vec4 c1 = projectionMatrix * vec4(v.xyz - rel * uTau, 1.0);
  vec2 n0 = c0.xy / c0.w * vec2(uAsp, 1.0);
  vec2 e = c1.w > 0.05 ? c1.xy / c1.w * vec2(uAsp, 1.0) - n0 : vec2(0.0);
  float le = length(e);
  if (le > 0.6) { e *= 0.6 / le; le = 0.6; }
  float h = 0.5 * tam * projectionMatrix[1][1] / c0.w;
  vec2 a = le > 1e-5 ? e / le : vec2(1.0, 0.0), b = vec2(-a.y, a.x);
  vec2 off = a * mix(-1.45 * h, le + 1.45 * h, position.x + 0.5) + b * position.y * 2.9 * h;
  vec2 q = n0 + off;
  gl_Position = vec4(q.x / uAsp * c0.w, q.y * c0.w, c0.z, c0.w);
  vOff = off; vE = e; vH = h; vGlifo = glifo;
  vColor = aColor * (1.0 + flash * 1.3);
  float lejos = -v.z;
  vAlfa = smoothstep(0.6, 2.2, lejos) * smoothstep(70.0, 34.0, lejos) * smoothstep(0.0, 0.07, f) * smoothstep(1.0, 0.93, f);
}`;

// La cabeza es el carácter tal cual; la estela, una raya de luz que se apaga hacia la cola (y más débil cuanto más
// larga). Suma luz: el alfa no cambia
const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vOff; in vec2 vE; in vec3 vColor; in float vH; in float vAlfa; flat in float vGlifo;
uniform sampler2D tAtlas; uniform float uAlfa;
out vec4 salida;
void main() {
  if (vAlfa * uAlfa < 0.003) discard;
  vec2 uv = vOff / (2.0 * vH) + 0.5;
  float dentro = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec2 celda = vec2(mod(vGlifo, 8.0), floor(vGlifo / 8.0));
  uv = clamp(uv, 0.0, 1.0);
  float cabeza = texture(tAtlas, vec2((celda.x + uv.x) / 8.0, (1.0 - celda.y + uv.y) / 2.0)).a * dentro;
  float l2 = dot(vE, vE), estela = 0.0;
  if (l2 > 1e-8) {
    float t = clamp(dot(vOff, vE) / l2, 0.0, 1.0), d = length(vOff - vE * t) / vH;
    estela = exp(-d * d * 5.0) * (1.0 - t) * 0.55 / (1.0 + sqrt(l2) / vH * 0.06);
  }
  float a = min(1.0, cabeza + estela);
  if (a < 0.003) discard;
  salida = vec4(vColor * a * vAlfa * uAlfa, 0.0);
}`;

// colores: el de cada pieza (para los que llegan a la placa). Devuelve los tramos (cada uno con su malla y lo que se le
// cambia: dónde empieza, cuánto mide, hasta dónde llega a los lados y su alfa) y lo que comparten (el tiempo, la
// velocidad de la cámara, la proporción de la pantalla y cuánto dura la estela)
export function crearBits(gl, { colores, movil }) {
  const atlas = new Texture(gl, {
    image: pintarAtlas(), generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE,
  });
  const comun = { uT: { value: 0 }, uVel: { value: [0, 0, 0] }, uAsp: { value: 1 }, uTau: { value: 0.045 } };
  const quad = { data: new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]), size: 2 };
  const indices = { data: new Uint16Array([0, 1, 2, 0, 2, 3]) };
  const r = azar(2026);

  const tramos = TRAMOS.map((t, i) => {
    const n = Math.round(t.n * (movil ? 0.55 : 1));
    const pos = new Float32Array(n * 3), datos = new Float32Array(n * 4), color = new Float32Array(n * 3);
    // (más juntos hacia el centro, que es por donde baja la cámara)
    const lado = () => { const u = r() * 2 - 1; return Math.sign(u) * Math.abs(u) ** 1.6; };
    for (let j = 0; j < n; j++) {
      pos.set([lado(), r(), lado()], j * 3);
      const tipo = r(), luz = 0.35 + 0.65 * r() ** 1.6, grande = t.grande || 1;
      let tam = (0.05 + 0.11 * r() ** 2.2) * grande, cae = 0.15 + 0.45 * r(), glifo = -1, c = CREMA.map((v) => v * luz);
      if (tipo < t.paquetes) {
        glifo = PAQUETE; tam = (0.06 + 0.04 * r()) * grande; cae = 2.5 + 2.5 * r(); c = SENAL.map((v) => v * 1.5);
      } else if (tipo < t.paquetes + t.pixeles) {
        glifo = PIXEL; tam *= 0.8; c = LUCES[Math.floor(r() * 3)].map((v) => v * (0.45 + 0.5 * r()));
      } else if (tipo < t.paquetes + t.pixeles + t.codigo) {
        glifo = 2 + Math.floor(r() * CODIGO.length); c = (r() < 0.4 ? ROSA : CREMA).map((v) => v * luz * 0.85);
      } else if (t.piezas && r() < t.piezas) {
        c = colores[Math.floor(r() * colores.length)].map((v) => v * (0.5 + 0.5 * luz));
      } else if (r() < 0.15) {
        c = ROSA.map((v) => v * luz);
      }
      datos.set([tam, cae, glifo, r()], j * 4);
      color.set(c, j * 3);
    }
    const geometria = new Geometry(gl, {
      position: quad, index: indices,
      aPos: { instanced: 1, size: 3, data: pos },
      aDatos: { instanced: 1, size: 4, data: datos },
      aColor: { instanced: 1, size: 3, data: color },
    });
    const uniforms = {
      ...comun, tAtlas: { value: atlas }, uAlfa: { value: 0 },
      uSuelo: { value: 0 }, uAlto: { value: 1 }, uExt: { value: [1, 1] },
    };
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms, transparent: true, depthWrite: false, cullFace: null });
    program.setBlendFunc(gl.ONE, gl.ONE);
    const malla = new Mesh(gl, { geometry: geometria, program, frustumCulled: false });
    return { malla, uniforms, i };
  });
  return { tramos, comun };
}
