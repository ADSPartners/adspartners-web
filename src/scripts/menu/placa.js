// El menú baja de la web a la placa que la ejecuta, siguiendo un cable. Al abrirlo, del botón sale una ola que va
// convirtiendo lo que tenías en pantalla en el código que lo construye, cada cosa en su sitio (menu/codigo.js); por
// delante de la ola se sigue viendo la página de verdad. Cuando la ola lo cubre todo, la cámara se aparta y la página
// queda como una hoja de una vista explotada: debajo, la hoja del código que la pinta y la de sus bytes, cada una con su
// nombre al lado, y del botón sale un cable (menu/cable.js) que las atraviesa y baja hasta la placa base
// (menu/circuito.js). La cámara baja por el cable detrás de un pulso de luz; el cable se conecta a un bus del
// procesador, la señal entra en él y suben las piezas, una por página, que arrancan como en una placa de verdad: primero
// la BIOS. Apuntar a una pieza enciende sus pistas y la señal corre hacia ella; pinchar baja hasta ella y entra. Cerrar
// es subir por el cable, y la ola vuelve a meterse en el botón. Es una escena 3D con OGL: las hojas son planos, la
// placa es otro plano con su textura, el cable es un tubo y las piezas son cajas y cilindros que crecen desde la placa.
// El lienzo es transparente (con el alfa premultiplicado) para que la página se vea fuera de la ola.
import { Renderer, Camera, Transform, Program, Mesh, Plane, Box, Cylinder, Texture, Vec3 } from 'ogl';
import { gsap } from 'gsap';
import { rastro } from '../rastro.js';
import { capaVisible, capaCodigo, capaBytes } from './codigo.js';
import { LADO, BUS, disposicion, huella, pintarPlaca, pintarCaras } from './circuito.js';
import { crearCable, tubo } from './cable.js';

const FOV = 40;
const TAN = Math.tan((FOV * Math.PI) / 360);
const D0 = 10;    // de la cámara de partida a la hoja de arriba (la que coincide con la pantalla)
const SEP = 5.5;  // entre hoja y hoja
const NOCHE = [18 / 255, 13 / 255, 10 / 255];
const ROSA = [245 / 255, 203 / 255, 215 / 255];
const CREMA = [231 / 255, 226 / 255, 218 / 255];
const SENAL = [1, 0.42, 0.66];   // el rosa encendido del cable
const ARRANQUE = ['about', 'tech', 'proyectos', 'brand'];   // el orden en que se encienden los LED, como al arrancar

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const mezcla = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const suave = (x) => x * x * (3 - 2 * x);
const entre = (a, b, x) => suave(Math.min(1, Math.max(0, (x - a) / (b - a))));
const vertical = () => innerWidth < innerHeight;
const coma = (v, d = 1) => v.toFixed(d).replace('.', ',');

// --- Lo que se pinta antes de abrir (sin WebGL): la placa, sus caras y las capas 2 y 3 ----------------------------
let hecho = null;
export function preparar(datos) {
  const v = vertical();
  if (hecho && hecho.vertical === v) return hecho;
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  const disp = disposicion(v);
  const ancho = movil ? 1024 : 2048, proporcion = Math.min(2.4, Math.max(0.45, innerWidth / innerHeight));
  hecho = {
    vertical: v, disp,
    placa: pintarPlaca(disp, movil ? 2048 : 4096),
    caras: pintarCaras(datos),
    codigo: capaCodigo(ancho, Math.round(ancho / proporcion)),
    bytes: capaBytes(ancho, Math.round(ancho / proporcion)),
    proporcion,
  };
  return hecho;
}

// --- Shaders ---------------------------------------------------------------------------------------------------------
const VERT_PLANO = /* glsl */ `#version 300 es
in vec3 position; in vec2 uv;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
out vec2 vUv; out vec3 vMundo;
void main() { vUv = uv; vec4 m = modelMatrix * vec4(position, 1.0); vMundo = m.xyz; gl_Position = projectionMatrix * viewMatrix * m; }`;

// Una hoja de código: su textura sobre su fondo de noche, su marco, el agujero por el que pasa el cable (uVia) y, en la
// de los bytes, las pistas que corren. La de arriba lleva
// además la ola (uPant > 0): sale del botón del menú (uOrigen, en px desde arriba a la izquierda) con el borde ondulado;
// dentro, el código; en el frente, el código se rasga (franjas que saltan, el rojo y el azul que se separan) y se tiñe
// de rosa, con un hilo rosa por delante; fuera, nada, y se ve la página. Sale con el alfa premultiplicado
const FRAG_CAPA = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; out vec4 salida;
uniform sampler2D tMapa, tPistas;
uniform float uAlfa, uFondo, uPistas, uT, uOla, uMarco, uAsp;
uniform vec2 uOrigen, uPant, uVia;
uniform vec3 uNoche, uRosa, uCrema;
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ruido(float x) { float i = floor(x), f = fract(x); return mix(azar(vec2(i, 3.1)), azar(vec2(i + 1.0, 3.1)), f * f * (3.0 - 2.0 * f)); }
vec4 leer(vec2 uv) {
  vec4 a = texture(tMapa, uv);
  if (uPistas > 0.001) a = mix(a, texture(tPistas, uv + vec2(uT * 0.025, 0.0)), uPistas);
  return a;
}
void main() {
  float dentro = 1e5, frente = 0.0, ola = uPant.x > 0.0 ? 1.0 : 0.0;
  if (ola > 0.5) {
    vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uPant - uOrigen;
    float ang = atan(px.y, px.x);
    float onda = (ruido(ang * 5.0 + uT * 1.7) - 0.5) * 70.0 + sin(ang * 11.0 - uT * 6.0) * 12.0;
    dentro = uOla - length(px) + onda;
    frente = exp(-abs(dentro) / 46.0);
  }
  vec2 uv = vUv;
  float banda = floor(uv.y * 46.0);
  float r = azar(vec2(banda, floor(uT * 30.0)));
  uv.x += (r - 0.5) * 0.07 * frente * step(0.45, r);
  float sep = 0.008 * frente;
  vec4 c = leer(uv), cr = leer(uv + vec2(sep, 0.0)), cb = leer(uv - vec2(sep, 0.0));
  vec3 col = mix(vec3(cr.r, c.g, cb.b), uRosa, frente * 0.45);
  float a = max(c.a, max(cr.a, cb.a));
  float fa = uFondo * (1.0 - a), sale = a + fa;
  vec3 res = (col * a + uNoche * fa) / max(sale, 1e-4);
  float alfa = sale * uAlfa * smoothstep(-2.0, 4.0, dentro);
  vec3 sal = res * alfa;
  // El marco de la hoja (una línea de 1 px, más fuerte en las esquinas) y el agujero por el que pasa el cable
  vec2 fw = fwidth(vUv), dd = min(vUv, 1.0 - vUv);
  float esquina = step(dd.x, 0.05) * step(dd.y, 0.05 * uAsp);
  float marco = uMarco * uAlfa * (1.0 - smoothstep(0.5, 1.5, min(dd.x / fw.x, dd.y / fw.y))) * mix(0.35, 1.0, esquina);
  sal = sal * (1.0 - marco) + uCrema * marco; alfa = max(alfa, marco);
  float rv = length((vUv - uVia) * vec2(uAsp, 1.0));
  float via = min(1.0, uMarco * uAlfa * (exp(-abs(rv - 0.028) / 0.004) * 0.9 + exp(-rv / 0.018) * 0.6));
  sal = sal * (1.0 - via) + uRosa * via; alfa = max(alfa, via);
  float hilo = ola * uAlfa * exp(-abs(dentro + 6.0) / 5.0);
  salida = vec4(sal + uRosa * hilo * (1.0 - alfa), alfa + hilo * (1.0 - alfa));
}`;

// El cable: un rosa encendido, con la luz que baja por él (los datos, un pulso cada 3 unidades) y uno más fuerte, la
// cabeza, que es lo que sigue la cámara. El halo es otro tubo más ancho que suma luz (más por donde el tubo mira a la
// cámara). Lo que pasa pegado a la cámara no se dibuja: sería un tubo enorme delante
const VERT_CABLE = /* glsl */ `#version 300 es
in vec3 position; in vec3 normal; in float s;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
out vec3 vN; out vec3 vMundo; out float vS;
void main() { vN = normal; vS = s; vec4 m = modelMatrix * vec4(position, 1.0); vMundo = m.xyz; gl_Position = projectionMatrix * viewMatrix * m; }`;
const FRAG_CABLE = /* glsl */ `#version 300 es
precision highp float;
in vec3 vN; in vec3 vMundo; in float vS; out vec4 salida;
uniform vec3 cameraPosition, uSenal;
uniform float uT, uCabeza, uAlfa, uHalo, uLargo;
void main() {
  float cerca = smoothstep(1.8, 4.0, distance(cameraPosition, vMundo));
  float frente = abs(dot(normalize(vN), normalize(cameraPosition - vMundo)));
  float pulsos = pow(fract(vS * uLargo / 3.0 - uT * 1.4), 8.0);
  float cabeza = exp(-abs(vS - uCabeza) * uLargo * 0.9);
  float k = 0.6 + pulsos * 0.9 + cabeza * 2.5;
  if (uHalo > 0.5) {
    salida = vec4(uSenal * pow(frente, 2.0) * 0.32 * k * uAlfa * cerca, 0.0);
  } else {
    float a = uAlfa * cerca;
    salida = vec4(mix(uSenal, vec3(1.0, 0.93, 0.96), 0.3 + min(0.6, cabeza * 0.5)) * k * a, a);
  }
}`;

// La placa: su textura con la luz de una lámpara, el brillo de los LED (y donde se conecta el cable) y la señal que corre
// por los buses encendidos.
// La señal guarda en el rojo a qué pieza va y en el verde la distancia al procesador; el alfa es cuánto tapa la pista,
// así que se divide por él (los bordes de las pistas no cambian de pieza al filtrar)
const FRAG_PLACA = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; in vec3 vMundo; out vec4 salida;
uniform sampler2D tAspecto, tSenal;
uniform vec3 cameraPosition, uNoche, uRosa;
uniform float uT, uLuz;
uniform vec4 uBus, uSentido;
uniform vec3 uC1, uC2, uC3, uC4, uL1, uL2, uL3, uL4, uAterriza;
vec3 led(vec3 l, vec3 c, vec2 p) {
  vec2 d = p - l.xy; float r2 = dot(d, d);
  return c * l.z * (exp(-r2 / 0.3) * 1.1 + exp(-r2 / 5.0) * 0.16);
}
void main() {
  vec3 col = texture(tAspecto, vUv).rgb;
  vec2 p = vMundo.xz;
  vec2 lp = p - vec2(-8.0, -10.0);
  col *= 0.72 + 0.5 * exp(-dot(lp, lp) / 700.0);
  vec4 s = texture(tSenal, vUv);
  if (s.a > 0.02) {
    float id = floor(s.r / s.a * 255.0 / 60.0 + 0.5);
    vec4 sel = vec4(equal(vec4(id), vec4(1.0, 2.0, 3.0, 4.0)));
    float k = dot(sel, uBus);
    if (k > 0.001) {
      vec3 c = sel.x * uC1 + sel.y * uC2 + sel.z * uC3 + sel.w * uC4;
      float fase = fract(s.g / s.a * 2.0 - uT * 0.9 * dot(sel, uSentido));
      float pulso = pow(fase, 16.0) * 2.6 + pow(fase, 4.0) * 0.35;
      col += c * k * (0.22 + pulso) * s.a;
    }
  }
  col += led(uL1, uC1, p) + led(uL2, uC2, p) + led(uL3, uC3, p) + led(uL4, uC4, p) + led(uAterriza, uRosa, p) * 1.4;
  float d = distance(cameraPosition, vMundo);
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);
  col = mix(uNoche, col, smoothstep(0.5, 0.34, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))));
  salida = vec4(col, 1.0);
}`;

// Las piezas: cajas y cilindros de tamaño 1 que el shader estira a su medida y hace crecer desde la placa (uSube). La
// cara de arriba y la de delante pueden llevar dibujo; luz de la misma lámpara, brillo de metal y un borde del color
// de la pieza cuando la apuntas
const VERT_PIEZA = /* glsl */ `#version 300 es
in vec3 position; in vec3 normal;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
uniform vec3 uTam; uniform float uY0, uSube;
out vec3 vLocal; out vec3 vN; out vec3 vMundo;
void main() {
  vLocal = position; vN = normal;
  vec3 p = vec3(position.x * uTam.x, (position.y + 0.5) * uTam.y * uSube + uY0, position.z * uTam.z);
  vec4 m = modelMatrix * vec4(p, 1.0);
  vMundo = m.xyz;
  gl_Position = projectionMatrix * viewMatrix * m;
}`;
const FRAG_PIEZA = /* glsl */ `#version 300 es
precision highp float;
in vec3 vLocal; in vec3 vN; in vec3 vMundo; out vec4 salida;
uniform sampler2D tArriba, tFrente;
uniform vec3 cameraPosition, uNoche, uColor, uBorde;
uniform float uMetal, uArriba, uFrente, uLuz, uBrillo;
void main() {
  vec3 n = normalize(vN);
  vec3 base = uColor;
  if (n.y > 0.5 && uArriba > 0.5) base = texture(tArriba, vec2(vLocal.x + 0.5, 0.5 - vLocal.z)).rgb;
  else if (n.z > 0.5 && uFrente > 0.5) base = texture(tFrente, vec2(vLocal.x + 0.5, vLocal.y + 0.5)).rgb;
  vec3 l = normalize(vec3(-0.35, 1.0, 0.3));
  vec3 v = normalize(cameraPosition - vMundo);
  float dif = max(dot(n, l), 0.0);
  float esp = pow(max(dot(n, normalize(l + v)), 0.0), mix(8.0, 56.0, uMetal)) * mix(0.04, 0.55, uMetal);
  vec3 col = base * (0.34 + 0.76 * dif) + vec3(1.0, 0.96, 0.92) * esp;
  col += uBorde * uBrillo * (0.2 + 0.8 * pow(1.0 - max(dot(n, v), 0.0), 2.0));
  float d = distance(cameraPosition, vMundo);
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);
  salida = vec4(col, 1.0);
}`;

// La sombra de cada pieza en la placa: una caja (o un círculo) difuminada, que se oscurece a la vez que la pieza crece
const FRAG_SOMBRA = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv; in vec3 vMundo; out vec4 salida;
uniform vec2 uTam; uniform float uMargen, uRedondo, uSube;
void main() {
  vec2 p = (vUv - 0.5) * (uTam + 2.0 * uMargen);
  float d = uRedondo > 0.5 ? length(p) - uTam.x * 0.5 : length(max(abs(p) - uTam * 0.5, 0.0));
  salida = vec4(0.0, 0.0, 0.0, (1.0 - smoothstep(0.0, uMargen, d)) * 0.82 * uSube);
}`;

// pagina: el <main>, que se esconde cuando la ola lo ha cubierto y vuelve antes de que la ola se retire
export function crear(raiz, { datos, reducido, sonido, ir, pagina }) {
  const lienzo = raiz.querySelector('[data-pl-lienzo]');
  const boton = document.querySelector('[data-menu-btn]');
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  let renderer;
  try {
    renderer = new Renderer({ canvas: lienzo, webgl: 2, dpr: Math.min(devicePixelRatio || 1, movil ? 1.5 : 2), alpha: true, premultipliedAlpha: true, antialias: true });
  } catch (e) { return null; }
  const gl = renderer.gl;
  if (!gl || !renderer.isWebgl2) return null;

  const camara = new Camera(gl, { fov: FOV, near: 0.05, far: 400 });
  camara.up.set(0, 0, -1);   // la parte de arriba de la pantalla es -z: lo de arriba de la página
  const mundo = new Transform(), capas = new Transform();
  const textura = (image, { mip = true, filtro = gl.LINEAR } = {}) => new Texture(gl, {
    image, generateMipmaps: mip, minFilter: mip ? gl.LINEAR_MIPMAP_LINEAR : filtro, magFilter: filtro,
    wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE, anisotropy: mip ? 8 : 1,
  });
  const vacia = new Texture(gl, { image: new Uint8Array([0, 0, 0, 0]), width: 1, height: 1, generateMipmaps: false });
  const plano = new Plane(gl), caja = new Box(gl), cilindro = new Cylinder(gl, { radialSegments: 48 });

  // --- Las hojas de código (de abajo arriba se dibujan en orden: primero la de los bytes) ---------------------------------------------------------------------------------------
  const capa = (orden) => {
    const program = new Program(gl, {
      vertex: VERT_PLANO, fragment: FRAG_CAPA, transparent: true, depthWrite: false,
      uniforms: {
        tMapa: { value: vacia }, tPistas: { value: vacia }, uAlfa: { value: 0 }, uFondo: { value: 0 }, uPistas: { value: 0 },
        uT: { value: 0 }, uNoche: { value: NOCHE }, uRosa: { value: ROSA }, uCrema: { value: CREMA },
        uOla: { value: 1e5 }, uOrigen: { value: [0, 0] }, uPant: { value: [0, 0] },
        uMarco: { value: 0 }, uAsp: { value: 1.6 }, uVia: { value: [-1, -1] },
      },
    });
    const m = new Mesh(gl, { geometry: plano, program, renderOrder: 3 - orden });
    m.rotation.x = -Math.PI / 2;
    m.setParent(capas);
    return m;
  };
  const capa1 = capa(0), capa2 = capa(1), capa3 = capa(2);

  // --- La placa y las piezas --------------------------------------------------------------------------------------
  const uniPlaca = {
    tAspecto: { value: vacia }, tSenal: { value: vacia }, uNoche: { value: NOCHE }, uRosa: { value: ROSA }, uT: { value: 0 },
    uLuz: { value: 1 }, uAterriza: { value: [0, 0, 0] },
    uBus: { value: [0, 0, 0, 0] }, uSentido: { value: [1, 1, 1, 1] },
    uC1: { value: [1, 1, 1] }, uC2: { value: [1, 1, 1] }, uC3: { value: [1, 1, 1] }, uC4: { value: [1, 1, 1] },
    uL1: { value: [0, 0, 0] }, uL2: { value: [0, 0, 0] }, uL3: { value: [0, 0, 0] }, uL4: { value: [0, 0, 0] },
  };
  const placaMesh = new Mesh(gl, { geometry: plano, program: new Program(gl, { vertex: VERT_PLANO, fragment: FRAG_PLACA, uniforms: uniPlaca }) });
  placaMesh.rotation.x = -Math.PI / 2;
  placaMesh.scale.set(LADO, LADO, 1);
  placaMesh.setParent(mundo);
  const colores = {};
  datos.forEach((d) => { colores[d.slug] = rgb(d.color); uniPlaca[`uC${BUS[d.slug]}`].value = colores[d.slug]; });

  // Un solo programa para todas las piezas: cada malla pone sus valores justo antes de dibujarse
  const uniPieza = {
    tArriba: { value: vacia }, tFrente: { value: vacia }, uNoche: { value: NOCHE }, uColor: { value: [0, 0, 0] },
    uBorde: { value: [0, 0, 0] }, uMetal: { value: 0 }, uArriba: { value: 0 }, uFrente: { value: 0 }, uLuz: { value: 1 },
    uBrillo: { value: 0 }, uTam: { value: [1, 1, 1] }, uY0: { value: 0 }, uSube: { value: 1 },
  };
  const progPieza = new Program(gl, { vertex: VERT_PIEZA, fragment: FRAG_PIEZA, uniforms: uniPieza, cullFace: null });
  const uniSombra = { uTam: { value: [1, 1] }, uMargen: { value: 0.7 }, uRedondo: { value: 0 }, uSube: { value: 0 } };
  const progSombra = new Program(gl, { vertex: VERT_PLANO, fragment: FRAG_SOMBRA, uniforms: uniSombra, transparent: true, depthWrite: false });

  // El cable: el tubo y su halo comparten valores (la luz que baja, la cabeza y el alfa)
  const uniCable = { uSenal: { value: SENAL }, uT: { value: 0 }, uCabeza: { value: 0 }, uAlfa: { value: 1 }, uLargo: { value: 60 } };
  const progNucleo = new Program(gl, { vertex: VERT_CABLE, fragment: FRAG_CABLE, uniforms: { ...uniCable, uHalo: { value: 0 } }, transparent: true });
  const progHalo = new Program(gl, { vertex: VERT_CABLE, fragment: FRAG_CABLE, uniforms: { ...uniCable, uHalo: { value: 1 } }, transparent: true, depthWrite: false });
  progHalo.setBlendFunc(gl.ONE, gl.ONE);
  let cable = null, nucleo = null, halo = null, sCapas = [0, 0, 0], sFin = 1, senal = 0;

  // --- El estado del viaje y la cámara -----------------------------------------------------------------------------
  // f: por dónde va el viaje (0, recto sobre la hoja de arriba; 1, la vista explotada; 2, al final del tramo de cable que
  // recorre la cámara; 3, la vista de la placa); sube: cuánto han crecido las piezas; ola: cuánto ha avanzado la ola
  // desde el botón (1, lo cubre todo); dive: la bajada hasta una pieza al pincharla
  const st = { f: 0, sube: 0, ola: 1, dive: 0, T: 0 };
  const raton = { x: 0, y: 0, nx: 0, ny: 0, dentro: false };
  let piezas = [], mallas = [], alturas = null, final = null, general = null, disp = null, texturasPlaca = null;
  let apuntado = null, peso = 0, destino = null, llegado = false, vistaGeneral = true, adelante = [0, -1, 0];
  let hoja = { w: 1, h: 1 };
  const leds = {};
  const bus = [0, 0, 0, 0], sentido = [1, 1, 1, 1];
  let deriva = [0, 0, 0];

  // Dónde se queda la cámara al final: encuadra todas las piezas (dejando sitio a la lista de abajo y a la cabecera y,
  // en vertical, a los nombres, que van a la derecha), un poco inclinada
  function encuadrar() {
    const hs = disp.piezas.map(huella);
    const x0 = Math.min(...hs.map((h) => h.x0)) - 1.6, x1 = Math.max(...hs.map((h) => h.x1)) + (hecho.vertical ? 7.5 : 1.6);
    const z0 = Math.min(...hs.map((h) => h.z0)) - 2.2, z1 = Math.max(...hs.map((h) => h.z1)) + 1.4;
    const asp = innerWidth / innerHeight, inc = hecho.vertical ? 0.3 : 0.42;
    const d = Math.max((z1 - z0) / 2 / (TAN * (hecho.vertical ? 0.64 : 0.74)), (x1 - x0) / 2 / (TAN * asp * 0.94));
    const mira = [(x0 + x1) / 2, 0, (z0 + z1) / 2 + 0.6];
    final = { pos: [mira[0], d * Math.cos(inc), mira[2] + d * Math.sin(inc)], mira };
    // Las hojas, apiladas por encima de donde se queda la cámara (así, al final, quedan detrás de ella)
    const yf = final.pos[1];
    alturas = { yf, capas: [yf + 3 + SEP * 2, yf + 3 + SEP, yf + 3], y0: yf + 3 + SEP * 2 + D0 };
    // Las tres miden lo que ve la cámara de partida desde la de arriba (que así coincide con la pantalla)
    const h1 = 2 * D0 * TAN;
    hoja = { w: h1 * asp, h: h1 };
    [capa1, capa2, capa3].forEach((c, i) => {
      c.position.y = alturas.capas[i];
      c.scale.set(hoja.w, hoja.h, 1);
      c.program.uniforms.uAsp.value = asp;
    });
    // La vista explotada: desde delante, un poco a la derecha y por encima, con las hojas a la izquierda para que quepan
    // sus nombres a la derecha
    const sitio = asp < 1 ? 6.5 : hoja.w * 0.45;
    const anchoV = hoja.w / 2 + sitio, altoV = ((SEP * 2 + hoja.h * 0.8) / 2) * 0.9 + 1;
    const lejos = Math.max(altoV / (TAN * (asp < 1 ? 0.7 : 1)), anchoV / (TAN * asp));
    const miraG = [asp < 1 ? 1.8 : sitio / 2, (alturas.capas[0] + alturas.capas[2]) / 2 - 1.2, 0.4];
    const dir = [0.3, 0.74, 0.6], l = Math.hypot(...dir);
    general = { pos: miraG.map((v, i) => v + (dir[i] / l) * lejos), mira: miraG };
  }

  // El cable: del botón (en la hoja de arriba) baja por las otras dos hasta el bus del procesador. Se monta al abrir,
  // cuando ya se sabe dónde está el botón
  function montarCable() {
    const bx = (origen[0] / innerWidth - 0.5) * hoja.w, bz = (origen[1] / innerHeight - 0.5) * hoja.h;
    const [y1, y2, y3] = alturas.capas, [lx, lz] = disp.aterriza;
    cable = crearCable([
      [bx, y1 + 0.02, bz],
      [bx * 0.85, y1 - SEP * 0.45, bz * 0.85 + 0.2],
      [bx * 0.55, y2, bz * 0.55 + 0.4],
      [bx * 0.35 + 0.2, y2 - SEP * 0.5, bz * 0.35 + 0.6],
      [bx * 0.2 + 0.4, y3, bz * 0.2 + 0.8],
      [(bx * 0.2 + lx) / 2 + 1.2, y3 * 0.45, (bz * 0.2 + lz) / 2 + 1.5],
      [lx, 1.4, lz + 0.5],
      [lx, 0.03, lz],
    ]);
    [nucleo, halo].forEach((m) => { if (m) { m.setParent(null); m.geometry.remove(); } });
    nucleo = new Mesh(gl, { geometry: tubo(gl, cable.puntos, 0.05), program: progNucleo, renderOrder: 5, frustumCulled: false });
    halo = new Mesh(gl, { geometry: tubo(gl, cable.puntos, 0.35), program: progHalo, renderOrder: 6, frustumCulled: false });
    nucleo.setParent(mundo); halo.setParent(mundo);
    uniCable.uLargo.value = cable.total;
    // Dónde atraviesa cada hoja (su agujero) y hasta dónde lo recorre la cámara (justo por debajo de la última hoja)
    sCapas = alturas.capas.map((y) => cable.sEnAltura(y));
    [capa1, capa2, capa3].forEach((c, i) => {
      const q = cable.en(sCapas[i]);
      c.program.uniforms.uVia.value = [q[0] / hoja.w + 0.5, 0.5 - q[2] / hoja.h];
    });
    sFin = cable.sEnAltura(alturas.yf + 1);
  }

  // Monta la placa y las piezas (la primera vez, o si el móvil ha girado)
  function montarPlaca() {
    disp = hecho.disp;
    if (texturasPlaca) { texturasPlaca.forEach((t) => gl.deleteTexture(t.texture)); }
    const tAspecto = textura(hecho.placa.aspecto), tSenal = textura(hecho.placa.senal, { mip: false });
    uniPlaca.tAspecto.value = tAspecto; uniPlaca.tSenal.value = tSenal;
    const caras = {};
    for (const [k, c] of Object.entries(hecho.caras)) caras[k] = textura(c);
    uniPieza.tArriba.value = caras.ihs;   // para que el primer uso ya tenga algo válido
    capa2.program.uniforms.tMapa.value = textura(hecho.codigo);
    capa3.program.uniforms.tMapa.value = textura(hecho.bytes.texto);
    capa3.program.uniforms.tPistas.value = textura(hecho.bytes.pistas);
    texturasPlaca = [tAspecto, tSenal, ...Object.values(caras), capa2.program.uniforms.tMapa.value,
      capa3.program.uniforms.tMapa.value, capa3.program.uniforms.tPistas.value];

    mallas.forEach((m) => m.setParent(null));
    mallas = [];
    const malla = (forma, x, z, q, extra = {}) => {
      const m = new Mesh(gl, { geometry: forma === 'pila' ? cilindro : caja, program: progPieza, frustumCulled: false });
      m.position.set(x, 0, z);
      m.datos = {
        tam: [q.w, q.h, q.d], y0: q.y0 || 0, color: q.color ? rgb(q.color) : [0, 0, 0], metal: q.metal || 0,
        arriba: q.arriba ? caras[q.arriba] : null, frente: q.frente ? caras[q.frente] : null,
        orden: Math.min(1, Math.hypot(x, z) / 22), sube: 0, brillo: 0, ...extra,
      };
      m.onBeforeRender(() => {
        const d = m.datos;
        uniPieza.uTam.value = d.tam; uniPieza.uY0.value = d.y0; uniPieza.uSube.value = Math.max(0.001, d.sube);
        uniPieza.uColor.value = d.led ? mezcla([0.16, 0.05, 0.05], d.ledColor, Math.min(1, d.on)) : d.color;
        uniPieza.uMetal.value = d.metal;
        uniPieza.uArriba.value = d.arriba ? 1 : 0; uniPieza.uFrente.value = d.frente ? 1 : 0;
        uniPieza.tArriba.value = d.arriba || caras.ihs; uniPieza.tFrente.value = d.frente || caras.ihs;
        uniPieza.uBorde.value = d.borde || [0, 0, 0];
        uniPieza.uBrillo.value = d.led ? d.on * 1.4 : d.brillo || 0;
      });
      m.setParent(mundo);
      mallas.push(m);
      // Su sombra (los LED no llevan): comparte los datos de la pieza, así crece con ella
      if (!extra.led) {
        const s = new Mesh(gl, { geometry: plano, program: progSombra });
        s.rotation.x = -Math.PI / 2;
        s.position.set(x, 0.015, z);
        s.scale.set(q.w + 1.4, q.d + 1.4, 1);
        s.datos = m.datos;
        s.onBeforeRender(() => {
          uniSombra.uTam.value = [q.w, q.d]; uniSombra.uRedondo.value = forma === 'pila' ? 1 : 0;
          uniSombra.uSube.value = m.datos.sube;
        });
        s.setParent(mundo);
        mallas.push(s);
      }
      return m;
    };
    piezas = disp.piezas.map((p) => {
      const d = datos.find((x) => x.slug === p.slug);
      const partes = p.partes.map((q) => malla(q.forma, p.x + q.dx, p.z + q.dz, q, { borde: colores[p.slug] }));
      const led = malla('caja', p.led[0], p.led[1], { w: 0.5, h: 0.22, d: 0.3 }, { led: true, ledColor: colores[p.slug], borde: colores[p.slug], on: 0 });
      leds[p.slug] = led.datos;
      return { p, d, partes, led, h: huella(p), rect: null, etq: raiz.querySelector(`[data-pl-dest="${p.slug}"]`) };
    });
    disp.decor.forEach((q) => malla(q.forma, q.x, q.z, q));
    encuadrar();
  }

  const medir = () => {
    renderer.setSize(innerWidth, innerHeight);
    camara.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    if (disp) encuadrar();
  };
  addEventListener('resize', medir);

  // Las cámaras: la de partida (recta sobre la hoja de arriba, que coincide con la pantalla), la vista explotada, la que
  // va por el cable (detrás de un punto, un poco por encima, mirando más adelante en el cable) y la final. La segunda vez
  // de cada visita no hay vista explotada: se va derecho al cable
  const mezclaCam = (a, b, k) => ({ pos: mezcla(a.pos, b.pos, k), mira: mezcla(a.mira, b.mira, k) });
  const enCable = (s) => {
    const p = cable.en(s), atras = cable.en(s - 0.05), mira = cable.en(s + 0.08);
    return { pos: [atras[0] + (atras[0] - p[0]) * 0.4 + 1, atras[1] + 2.2, atras[2] + (atras[2] - p[2]) * 0.4 + 1.2], mira };
  };
  const camaraBase = () => {
    const f = st.f, s = (x) => suave(Math.min(1, Math.max(0, x)));
    const inicio = { pos: [0, alturas.y0, 0], mira: [0, alturas.capas[0], 0] };
    const gen = vistaGeneral ? general : enCable(0);
    if (f <= 1) return mezclaCam(inicio, gen, s(f));
    if (f <= 2) return mezclaCam(gen, enCable(sFin * (f - 1)), s((f - 1) * 3));
    return mezclaCam(enCable(sFin), final, s(f - 2));
  };
  // Además, se acerca un poco a la pieza que apuntas, sigue al ratón un poco y, al pinchar, baja hasta la pieza
  const camaraEn = () => {
    let { pos, mira } = camaraBase();
    const conRaton = llegado && raton.dentro && !movil && !destino;
    pos = [pos[0] + deriva[0] + (conRaton ? raton.nx * 1.1 : 0), pos[1] + deriva[1], pos[2] + deriva[2] + (conRaton ? raton.ny * 0.8 : 0)];
    mira = [mira[0] + deriva[0] * 0.6, mira[1], mira[2] + deriva[2] * 0.6];
    if (destino && st.dive > 0) {
      const e = st.dive * st.dive;
      const c = [(destino.h.x0 + destino.h.x1) / 2, destino.h.h, (destino.h.z0 + destino.h.z1) / 2];
      pos = mezcla(pos, [c[0], c[1] + 1.6, c[2] + 0.01], e);
      mira = mezcla(mira, c, e);
    }
    camara.position.set(...pos);
    camara.lookAt(mira);
    camara.updateMatrixWorld();
    const d = mira.map((v, i) => v - pos[i]), l = Math.hypot(...d) || 1;
    adelante = d.map((v) => v / l);
  };

  // Dónde cae en la pantalla una pieza (la caja de sus ocho esquinas, con lo que haya crecido)
  const v3 = new Vec3();
  // Dónde cae en pantalla un punto, y si está delante de la cámara
  const aPantalla = (x, y, z) => {
    const p = camara.position;
    const delante = (x - p.x) * adelante[0] + (y - p.y) * adelante[1] + (z - p.z) * adelante[2] > 0.1;
    v3.set(x, y, z);
    camara.project(v3);
    return [((v3.x + 1) / 2) * innerWidth, ((1 - v3.y) / 2) * innerHeight, delante];
  };
  const rectDe = (pz) => {
    const { x0, x1, z0, z1, h } = pz.h;
    const alto = h * Math.max(0, Math.min(1, pz.partes[0].datos.sube));
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const x of [x0, x1]) for (const y of [0, alto]) for (const z of [z0, z1]) {
      v3.set(x, y, z);
      camara.project(v3);
      const sx = ((v3.x + 1) / 2) * innerWidth, sy = ((1 - v3.y) / 2) * innerHeight;
      a = Math.min(a, sx); b = Math.min(b, sy); c = Math.max(c, sx); d = Math.max(d, sy);
    }
    return { x0: a, y0: b, x1: c, y1: d };
  };
  const apuntar = (x, y) => {
    let mejor = null, area = Infinity;
    for (const pz of piezas) {
      const r = pz.rect;
      if (!r || x < r.x0 - 14 || x > r.x1 + 14 || y < r.y0 - 14 || y > r.y1 + 14) continue;
      const ar = (r.x1 - r.x0) * (r.y1 - r.y0);
      if (ar < area) { area = ar; mejor = pz; }
    }
    return mejor;
  };

  // --- Ratón y dedo ------------------------------------------------------------------------------------------------
  raiz.addEventListener('pointermove', (e) => {
    raton.x = e.clientX; raton.y = e.clientY; raton.dentro = true;
    raton.nx = (e.clientX / innerWidth) * 2 - 1; raton.ny = (e.clientY / innerHeight) * 2 - 1;
  });
  raiz.addEventListener('pointerleave', () => { raton.dentro = false; });

  let viaje = null;
  const enViaje = () => !!viaje && viaje.isActive();
  lienzo.addEventListener('click', (e) => {
    if (enViaje()) { gsap.to(viaje, { timeScale: 5, duration: 0.3 }); return; }
    if (!llegado) return;
    const pz = apuntar(e.clientX, e.clientY);
    if (pz) lanzar(pz.p.slug);
  });

  const inundar = raiz.querySelector('[data-pl-inundar]');
  function lanzar(slug) {
    const pz = piezas.find((q) => q.p.slug === slug);
    if (!pz || destino) return;
    if (!pz.d.ruta) {
      const frase = pz.etq.querySelector('.pl__frase');
      clearTimeout(frase._t);
      frase.textContent = 'en obras · llega pronto';
      if (!reducido) gsap.fromTo(pz.etq.querySelector('.pl__nombre'), { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
      gsap.fromTo(leds[slug], { on: 2 }, { on: 0.35, duration: 0.6, ease: 'power2.out' });
      frase._t = setTimeout(() => { frase.textContent = pz.d.frase; }, 1800);
      return;
    }
    if (enViaje()) viaje.progress(1);
    destino = pz;
    apuntado = pz;
    raiz.classList.add('zambullendo');
    sonido.viaje(1.3, 1);
    if (reducido) { ir(pz.d); return; }
    inundar.style.setProperty('--c', pz.d.color);
    gsap.timeline({ onComplete: () => ir(pz.d) })
      .to(st, { dive: 1, duration: 1.3, ease: 'power2.in' }, 0)
      .fromTo(inundar, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.in' }, 0.9);
  }
  raiz.querySelectorAll('[data-pl-ir]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (!llegado) { viaje?.progress(1); }
      lanzar(a.dataset.plIr);
    });
  });

  // --- El inspector: la capa por la que vas; al llegar, cuánto lleva encendida (tu visita) --------------------------
  const hudCapa = raiz.querySelector('[data-pl-capa]');
  const hudEncendida = raiz.querySelector('[data-pl-encendida]');
  const cajaInsp = raiz.querySelector('[data-pl-caja]');
  const cajaEtq = raiz.querySelector('[data-pl-caja-etq]');
  let ultimaCapa = '';
  const escribir = (el, texto, demora = 0) => {
    clearTimeout(el._t);
    if (reducido) { el.textContent = texto; return; }
    let n = 0;
    el.textContent = '';
    const paso = () => { el.textContent = texto.slice(0, ++n); if (n < texto.length) el._t = setTimeout(paso, 14); };
    el._t = setTimeout(paso, demora);
  };
  const tiempo = (s) => (s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`);
  const hojas = [...raiz.querySelectorAll('[data-pl-hoja]')];
  function textoCapa() {
    if (vistaGeneral && st.f > 0.5 && st.f < 1.3) return 'vista explotada · 4 capas, de lo que ves a lo que lo ejecuta';
    const i = alturas.capas.findIndex((c) => camara.position.y > c + 0.3);
    const n = i === -1 || st.f >= 2 ? 3 : i;
    return `capa ${n + 1} de 4 · ${hojas[n].dataset.nombre.toLowerCase()}`;
  }

  function llegar() {
    llegado = true;
    raiz.classList.add('llegado');
    piezas.forEach((pz) => pz.etq.classList.add('visto'));
    const r = rastro();
    const metros = r.metros >= 0.1 ? ` · ${coma(r.metros)} m de ratón` : '';
    escribir(hudEncendida, `encendida desde hace ${tiempo(r.segundos)} · es tu visita${metros}`, 300);
    // Arrancan como una placa de verdad: primero la BIOS, luego el procesador, el almacenamiento y la gráfica
    if (!reducido) {
      ARRANQUE.forEach((slug, i) => {
        gsap.timeline({ delay: i * 0.16 })
          .call(() => sonido.tic(0.45))
          .fromTo(leds[slug], { on: 0 }, { on: 1.6, duration: 0.08 })
          .to(leds[slug], { on: 0.35, duration: 0.5, ease: 'power2.out' });
      });
    } else ARRANQUE.forEach((slug) => { leds[slug].on = 0.35; });
    sonido.zumbido();
  }

  // La ola: sale del centro del botón del menú y tiene que llegar más allá de la esquina más lejana
  let origen = [0, 0], alcance = 1, cubierta = true;
  const medirOla = () => {
    const r = boton?.getBoundingClientRect();
    origen = r ? [r.left + r.width / 2, r.top + r.height / 2] : [0, 0];
    alcance = Math.max(...[[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]].map(([x, y]) => Math.hypot(x - origen[0], y - origen[1]))) + 140;
  };
  // Mientras avanza (o se retira) chisporrotea, del lado por el que va
  const crepitar = (tl, desde, dur, dir) => {
    for (let i = 0; i <= 8; i++) {
      const k = dir > 0 ? i / 8 : 1 - i / 8;
      tl.call(() => sonido.glitch(0.5 + Math.random() * 0.5, Math.min(1, (origen[0] + alcance * k * 0.6) / innerWidth)), null, desde + (i / 8) * dur);
    }
  };
  // Cuando la ola lo tapa todo, la página se esconde y el menú enseña lo suyo (la lista y el inspector); mientras no,
  // la página se ve fuera de la ola
  function cubrir(si) {
    cubierta = si;
    raiz.classList.toggle('ola', !si);
    if (pagina) pagina.style.visibility = si ? 'hidden' : '';
  }

  // Primero la ola; cuando ha cubierto la página, la vista explotada (solo la primera vez de cada visita, con un momento
  // para leerla), la bajada por el cable y la llegada a la placa
  function montarViaje(primera) {
    viaje?.kill();
    vistaGeneral = primera;
    Object.assign(st, { f: 0, sube: 0, ola: 0, dive: 0 });
    cubrir(false);
    const ola = primera ? 1.2 : 0.85, abre = primera ? 1.5 : 0.45, lee = primera ? 0.8 : 0, baja = primera ? 3.4 : 1.6, llega = primera ? 1.5 : 0.9;
    const tl = gsap.timeline({ onComplete: llegar });
    tl.call(() => sonido.viaje(ola + 0.2, 1), null, 0)
      .to(st, { ola: 1, duration: ola, ease: 'power1.inOut' }, 0)
      .call(() => cubrir(true), null, ola);
    let t = ola + 0.05;
    tl.to(st, { f: 1, duration: abre, ease: primera ? 'power2.inOut' : 'power2.in' }, t);
    t += abre + lee;
    tl.call(() => sonido.viaje(baja + 0.4, 1), null, t)
      .to(st, { f: 2, duration: baja, ease: primera ? 'power1.inOut' : 'none' }, t);
    t += baja;
    tl.to(st, { f: 3, duration: llega, ease: 'power2.inOut' }, t)
      .to(st, { sube: 1, duration: primera ? 1.1 : 0.6, ease: 'power2.out' }, t + llega * 0.45);
    crepitar(tl, 0, ola, 1);
    viaje = tl;
  }

  // --- El bucle, solo con el menú abierto -----------------------------------------------------------------------------
  let raf = 0, antes = 0, vivo = false;
  function pintar(ahora) {
    if (vivo) raf = requestAnimationFrame(pintar);
    const dt = Math.min(0.05, (ahora - (antes || ahora)) / 1000);
    antes = ahora;
    st.T += dt;

    // La pieza a la que apuntas (con ratón), y la cámara que se acerca un poco a ella
    if (llegado && !destino) {
      const pz = raton.dentro && !movil ? apuntar(raton.x, raton.y) : null;
      if (pz !== apuntado) {
        if (pz) sonido.tic(0.6);
        apuntado = pz;
        piezas.forEach((q) => q.etq.classList.toggle('on', q === apuntado));
        lienzo.style.cursor = apuntado ? 'pointer' : '';
      }
    }
    peso += ((apuntado ? 1 : 0) - peso) * Math.min(1, dt * 4);
    const objetivo = apuntado && !destino
      ? [((apuntado.h.x0 + apuntado.h.x1) / 2 - final.mira[0]) * 0.14, -1.2, ((apuntado.h.z0 + apuntado.h.z1) / 2 - final.mira[2]) * 0.14]
      : [0, 0, 0];
    deriva = mezcla(deriva, objetivo.map((v) => v * suave(peso)), Math.min(1, dt * 2.2));
    camaraEn();

    // Las piezas crecen desde la placa, primero las del centro
    for (const m of mallas) {
      const s = Math.min(1, Math.max(0, st.sube * 1.5 - m.datos.orden * 0.5));
      m.datos.sube = 1 - (1 - s) ** 3;
      m.visible = m.datos.sube > 0.004;
    }
    for (const pz of piezas) {
      pz.rect = rectDe(pz);
      const b = pz === apuntado ? 1 : 0;
      pz.partes.forEach((m) => { m.datos.brillo += (b * 0.55 - m.datos.brillo) * Math.min(1, dt * 6); });
    }

    // Los buses: un poco de vida en todos; el de la pieza apuntada, entero (y si es el procesador, todos hacia él)
    const objetivoBus = [0.12, 0.12, 0.12, 0.12], objetivoSentido = [1, 1, 1, 1];
    if (apuntado) {
      const id = BUS[apuntado.p.slug] - 1;
      if (apuntado.p.slug === 'tech') { objetivoBus.fill(0.85); objetivoSentido.fill(-1); objetivoSentido[3] = 1; }
      else objetivoBus[id] = 1;
    }
    for (let i = 0; i < 4; i++) {
      // (el bus del procesador también se enciende con la señal que llega por el cable, hacia él)
      const objetivo = i === 3 ? Math.max(objetivoBus[i] * st.sube, senal * 0.95) : objetivoBus[i] * st.sube;
      bus[i] += (objetivo - bus[i]) * Math.min(1, dt * 5);
      sentido[i] = i === 3 && senal > 0.01 && !apuntado ? -1 : objetivoSentido[i];
    }
    uniPlaca.uBus.value = bus; uniPlaca.uSentido.value = sentido; uniPlaca.uT.value = st.T;
    for (const pz of piezas) {
      const l = leds[pz.p.slug];
      if (pz === apuntado && l.on < 1.2) l.on += (1.2 - l.on) * Math.min(1, dt * 8);
      else if (pz !== apuntado && llegado && !gsap.isTweening(l) && l.on > 0.35) l.on += (0.35 - l.on) * Math.min(1, dt * 4);
      // (el LED no brilla en la placa hasta que ha crecido)
      uniPlaca[`uL${BUS[pz.p.slug]}`].value = [pz.p.led[0], pz.p.led[1], l.on * l.sube];
    }

    // Cada hoja se ve entera mientras la cámara está por encima y se aparta al pasarla (de cerca se vería borrosa). La de
    // arriba empieza siendo la pantalla: sin marco, que le sale al separarse
    const A = alturas, y = camara.position.y;
    const dist = A.capas.map((c) => y - c);
    const u1 = capa1.program.uniforms, u2 = capa2.program.uniforms, u3 = capa3.program.uniforms;
    u1.uFondo.value = 1; u2.uFondo.value = 0.86; u3.uFondo.value = 0.86;
    u1.uMarco.value = entre(0.05, 0.6, st.f); u2.uMarco.value = 1; u3.uMarco.value = 1;
    u1.uAlfa.value = entre(1.1, 3.2, dist[0]);
    u1.uOla.value = st.ola >= 1 ? 1e5 : st.ola * alcance;
    u1.uOrigen.value = origen; u1.uPant.value = [innerWidth, innerHeight];
    u2.uAlfa.value = entre(1.1, 3.2, dist[1]);
    u3.uAlfa.value = entre(1.1, 3.2, dist[2]);
    u3.uPistas.value = entre(7, 2.5, dist[2]);
    for (const u of [u1, u2, u3]) u.uT.value = st.T;
    // (mientras la ola no lo cubre todo, solo la de arriba: fuera de la ola tiene que verse la página)
    capa1.visible = u1.uAlfa.value > 0.002;
    capa2.visible = cubierta && u2.uAlfa.value > 0.002; capa3.visible = cubierta && u3.uAlfa.value > 0.002;
    const luz = 0.35 + 0.65 * entre(A.yf + 26, A.yf + 4, y);
    uniPlaca.uLuz.value = luz; uniPieza.uLuz.value = luz;

    // El cable: la cabeza va justo delante de la cámara mientras baja; al final corre sola hasta la placa, se conecta
    // (brilla donde aterriza y la señal entra por el bus en el procesador) y el cable se apaga
    if (cable) {
      const cab = st.f < 1 ? 0 : st.f < 2 ? sFin * (st.f - 1) + 0.07 : Math.min(1, sFin + 0.07 + (1 - sFin) * (st.f - 2) * 1.7);
      uniCable.uCabeza.value = cab; uniCable.uT.value = st.T;
      const alfa = 1 - entre(2.7, 3, st.f);
      uniCable.uAlfa.value = alfa;
      nucleo.visible = halo.visible = cubierta && alfa > 0.01;
      const at = entre(2.45, 2.6, st.f);
      uniPlaca.uAterriza.value = [disp.aterriza[0], disp.aterriza[1], at * (1.2 - 0.8 * entre(2.6, 3, st.f))];
      senal = llegado ? 0 : at;
    }

    // El inspector: la capa, y la caja de la pieza apuntada con lo que mide en pantalla
    const txt = textoCapa();
    if (txt !== ultimaCapa) { ultimaCapa = txt; hudCapa.textContent = txt; }
    // El nombre de cada hoja, a su derecha (o debajo, si ahí no cabe), en la vista explotada y mientras bajas; el de la
    // placa, junto a donde se conecta el cable, al final del viaje. Si uno pisa al de encima, baja lo justo
    let suelo = -Infinity;
    hojas.forEach((el, i) => {
      let [x, yy, delante] = i < 3 ? aPantalla(hoja.w / 2, A.capas[i], 0) : aPantalla(disp.aterriza[0], 0, disp.aterriza[1]);
      let debajo = false;
      if (hecho.vertical) x = Math.min(x, innerWidth - 150);
      else if (i < 3 && x + 230 > innerWidth) { [x, yy, delante] = aPantalla(0, A.capas[i], hoja.h / 2); debajo = true; }
      el.style.maxWidth = hecho.vertical ? `${Math.round(innerWidth - x - 30)}px` : '';
      const alfa = [u1, u2, u3][i]?.uAlfa.value ?? 1;
      const alto = el.offsetHeight || 60;
      if (!debajo && i < 3) { yy = Math.max(yy, suelo + 12 + alto / 2); }
      const ve = cubierta && !llegado && !destino && delante && x > 0 && x < innerWidth && yy > 80 && yy < innerHeight - 110 &&
        (i < 3 ? st.f > 0.55 && alfa > 0.6 : st.f > 2.1);
      if (ve && i < 3) suelo = debajo ? yy + 14 + alto : yy + alto / 2;
      el.classList.toggle('on', ve);
      el.classList.toggle('debajo', debajo);
      if (ve) el.style.transform = `translate(${(x + (debajo ? 0 : 18)).toFixed(1)}px, ${(yy + (debajo ? 14 : 0)).toFixed(1)}px)`;
    });
    if (apuntado && !movil && !destino) {
      const r = apuntado.rect;
      cajaInsp.style.transform = `translate(${(r.x0 - 6).toFixed(1)}px, ${(r.y0 - 6).toFixed(1)}px)`;
      cajaInsp.style.width = `${(r.x1 - r.x0 + 12).toFixed(1)}px`;
      cajaInsp.style.height = `${(r.y1 - r.y0 + 12).toFixed(1)}px`;
      cajaInsp.style.setProperty('--c', apuntado.d.color);
      const etq = `${apuntado.d.ficha} · ${Math.round(r.x1 - r.x0)} × ${Math.round(r.y1 - r.y0)} px`;
      if (cajaEtq.textContent !== etq) cajaEtq.textContent = etq;
      cajaInsp.classList.add('on');
    } else cajaInsp.classList.remove('on');

    // Los nombres, junto a su pieza: en horizontal, debajo si cabe (si no, encima); en vertical, a su derecha
    for (const pz of piezas) {
      const r = pz.rect;
      if (hecho.vertical) {
        const x = r.x1 + 14;
        pz.etq.style.maxWidth = `${Math.max(90, innerWidth - x - 12).toFixed(0)}px`;
        pz.etq.style.transform = `translate(${x.toFixed(1)}px, ${((r.y0 + r.y1) / 2).toFixed(1)}px)`;
        continue;
      }
      const alto = pz.etq.offsetHeight || 60, medio = (pz.etq.offsetWidth || 120) / 2 + 10;
      const abajo = r.y1 + 12 + alto < innerHeight - 96;
      const x = Math.min(innerWidth - medio, Math.max(medio, (r.x0 + r.x1) / 2));
      const yy = abajo ? r.y1 + 12 : r.y0 - 12 - alto;
      pz.etq.style.maxWidth = '';
      pz.etq.style.transform = `translate(${x.toFixed(1)}px, ${yy.toFixed(1)}px)`;
    }

    // Con la ola a medias, el lienzo es transparente y solo lleva la capa 1; después, la noche, la placa y las capas
    if (cubierta) {
      gl.clearColor(...NOCHE, 1);
      renderer.render({ scene: mundo, camera: camara });
    } else {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    renderer.render({ scene: capas, camera: camara, clear: false });
  }

  // La capa 1, con la página tal cual está ahora mismo; si alguna imagen aún cargaba, se repinta al llegar
  let tCapa1 = null;
  function pintarCapa1() {
    const { lienzo: c, pendientes } = capaVisible(renderer.dpr);
    if (tCapa1) gl.deleteTexture(tCapa1.texture);
    tCapa1 = textura(c, { mip: false });
    capa1.program.uniforms.tMapa.value = tCapa1;
    capa1.program.uniforms.tPistas.value = tCapa1;
    if (pendientes.length) {
      Promise.all(pendientes).then(() => {
        if (!vivo || camara.position.y < alturas.capas[0] + 3) return;
        const { lienzo: nuevo } = capaVisible(renderer.dpr);
        tCapa1.image = nuevo;
        tCapa1.needsUpdate = true;
      });
    }
  }

  // Lo que pesa, antes de abrir: pintar la placa, sus caras y las capas 2 y 3, y subirlas a la tarjeta gráfica
  function precalentar() {
    if (!hecho || hecho.vertical !== vertical()) preparar(datos);
    if (disp !== hecho.disp) montarPlaca();
    texturasPlaca.forEach((t) => t.update());
  }

  return {
    precalentar,
    // primera: si es la primera vez en esta visita (el viaje entero, más despacio)
    abrir(primera) {
      precalentar();
      raiz.classList.toggle('en-vertical', hecho.vertical);
      medir();
      medirOla();
      montarCable();
      destino = null; apuntado = null; peso = 0; deriva = [0, 0, 0]; llegado = false;
      raiz.classList.remove('zambullendo', 'llegado');
      inundar.style.opacity = 0;
      piezas.forEach((pz) => { pz.etq.classList.remove('visto', 'on'); pz.etq.querySelector('.pl__frase').textContent = pz.d.frase; });
      Object.values(leds).forEach((l) => { l.on = 0; });
      hudEncendida.textContent = '';
      pintarCapa1();
      if (reducido) {
        Object.assign(st, { f: 3, sube: 1, ola: 1, dive: 0 });
        cubrir(true);
        llegar();
      } else montarViaje(primera);
      // El primer fotograma, ahora mismo, con la ola aún dentro del botón
      vivo = true; antes = 0;
      pintar(performance.now());
    },
    // El viaje de vuelta hasta la capa 1 y la ola, que se vuelve a meter en el botón y deja la página; la promesa se
    // cumple cuando ya no queda nada
    salir() {
      viaje?.kill();
      gsap.killTweensOf(st);
      raiz.classList.remove('llegado');
      piezas.forEach((pz) => pz.etq.classList.remove('visto', 'on'));
      apuntado = null; llegado = false;
      clearTimeout(hudEncendida._t); hudEncendida.textContent = '';
      sonido.pararZumbido();
      if (reducido || !vivo) return Promise.resolve();
      sonido.viaje(1, -1);
      // De vuelta se sube por el cable, sin la vista explotada (si ya se había pasado de ella)
      const arriba = st.f <= 0.001, desde = arriba ? 0 : 1.55, ola = 0.8;
      if (st.f >= 1.34) vistaGeneral = false;
      return new Promise((listo) => {
        const tl = gsap.timeline({ onComplete: listo });
        if (!arriba) {
          tl.to(st, { sube: 0, duration: 0.35, ease: 'power2.in' }, 0)
            .to(st, { dive: 0, duration: 0.5, ease: 'power2.inOut' }, 0)
            .to(st, { f: 0, duration: 1.5, ease: 'power2.inOut' }, 0.05);
        }
        tl.call(() => { medirOla(); cubrir(false); }, null, desde)
          .to(st, { ola: 0, duration: ola, ease: 'power1.inOut' }, desde);
        crepitar(tl, desde, ola, -1);
      });
    },
    parar() {
      viaje?.kill();
      gsap.killTweensOf(st);
      cancelAnimationFrame(raf);
      vivo = false;
    },
  };
}
