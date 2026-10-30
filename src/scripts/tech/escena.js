// La escena de la sala de máquinas: un viaje. Las innovaciones esperan a lo largo de un valle de alambre, una cada SEP
// unidades y cada una en su lado (las pares a la izquierda, las impares a la derecha); pasar a la siguiente es volar
// por el valle hasta ella y dejar atrás la que estaba. El recorrido no se acaba: la estación k lleva la innovación
// k mod 4, así que después de la cuarta viene otra vez la primera, en los dos sentidos.
// Cada modelo se dibuja de abajo arriba al acercarte (la línea que avanza, en rosa). El paisaje (montañas, camino,
// antenas y polvo) se calcula en los shaders a partir de la posición en el mundo: es infinito y no pesa.
// Al entrar en una innovación su modelo se va al otro lado; en la misión, la sala, que también se dibuja sola.
// Todo son líneas (gl.LINES) con OGL; no hay texturas ni ficheros.
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Vec3 } from 'ogl';
import { gsap } from 'gsap';
import { MODELOS, ESCALA, peana, antena, sala } from './modelos.js';

export const SEP = 10;            // de una estación a la siguiente
const VAIVEN = 1.6;               // lo que se tuerce el valle a cada lado
const CAM_Y = 0.55, CAM_Z = 7.4;  // dónde se para la cámara, respecto a su estación
const SUELO = -1.05;

// El camino de la cámara: u es la estación por la que va (1,5 = a medio camino entre la 1 y la 2). En cada estación
// mira de frente; entre una y otra, el valle la lleva de un lado al otro.
const camX = (u) => VAIVEN * Math.cos(Math.PI * u);
export const ladoDe = (k) => (Math.abs(k) % 2 === 0 ? -1 : 1);

const VALLE = /* glsl */ `
uniform float uSep;
uniform float uVaiven;
float valle(float z) { return uVaiven * cos(3.14159265 * (${CAM_Z.toFixed(2)} - z) / uSep); }
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p), s = f * f * (3.0 - 2.0 * f);
  return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), s.x), mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), s.x), s.y);
}
// La altura del terreno: casi llano en el valle y montañas a los lados
float alto(vec2 w) {
  float d = abs(w.x - valle(w.y));
  float ladera = smoothstep(3.4, 11.0, d);
  float n = ruido(w * 0.15) * 0.6 + ruido(w * 0.34 + 7.0) * 0.28 + ruido(w * 0.8 + 3.0) * 0.12;
  return ladera * (0.25 + pow(n, 1.5) * 5.4) + (1.0 - ladera) * ruido(w * 0.45) * 0.1;
}`;

// Niebla al fondo y fundido de lo que pasa rozando la cámara (uCerca: a qué distancia ya se ve entero)
const LEJOS = /* glsl */ `
uniform float uCerca;
float lejos(float prof, float l) { return (1.0 - smoothstep(l * 0.35, l, prof)) * smoothstep(uCerca * 0.25, uCerca, prof); }`;

// Los modelos, la peana y la sala: crema con la pieza protagonista en rosa; se dibujan por orden (uDibujo)
const VERT_M = /* glsl */ `
attribute vec3 position;
attribute float acento;
attribute float orden;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uDesvio;
varying float vAcento;
varying float vProf;
varying float vOrden;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vProf = -mv.z;
  vAcento = acento;
  vOrden = orden;
  vec4 c = projectionMatrix * mv;
  c.x += uDesvio * c.w;
  gl_Position = c;
}`;
const FRAG_M = /* glsl */ `
precision highp float;
uniform vec3 uCrema;
uniform vec3 uRosa;
uniform vec3 uTinte;
uniform float uAlfa;
uniform float uLejos;
uniform float uDibujo;
varying float vAcento;
varying float vProf;
varying float vOrden;
${LEJOS}
void main() {
  if (vOrden > uDibujo) discard;
  float frente = smoothstep(0.07, 0.0, uDibujo - vOrden) * step(uDibujo, 0.999);
  float a = max(vAcento, frente);
  vec3 c = mix(uCrema, uRosa, a) * uTinte;
  gl_FragColor = vec4(c, uAlfa * mix(0.4, 1.0, a) * lejos(vProf, uLejos));
}`;

// El terreno: la rejilla se planta alrededor de la cámara y cada vértice sube a la altura de su sitio en el mundo
const VERT_T = /* glsl */ `
attribute vec3 position;
attribute float acento;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
${VALLE}
varying float vProf;
varying float vAlto;
varying float vTipo;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  float h = alto(w.xz);
  w.y = ${SUELO.toFixed(2)} + h;
  vAlto = h;
  vTipo = acento;
  vec4 mv = viewMatrix * w;
  vProf = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FRAG_T = /* glsl */ `
precision highp float;
uniform vec3 uCrema;
uniform vec3 uRosa;
uniform float uAlfa;
uniform float uLejos;
varying float vProf;
varying float vAlto;
varying float vTipo;
${LEJOS}
void main() {
  float luz = 0.4 + 0.6 * smoothstep(0.15, 3.8, vAlto);
  float cumbre = smoothstep(3.6, 4.8, vAlto);
  vec3 c = mix(uCrema, uRosa, cumbre);
  gl_FragColor = vec4(c, uAlfa * luz * lejos(vProf, uLejos) * mix(1.0, 0.4, vTipo) * (1.0 + cumbre));
}`;

// El camino: una raya rosa por el centro del valle, con un pulso de luz que avanza hacia la siguiente estación
const VERT_C = /* glsl */ `
attribute vec3 position;
attribute float carril;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
${VALLE}
varying float vProf;
varying float vZ;
varying float vCarril;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.x = valle(w.z) + carril * 2.5;
  w.y = ${(SUELO + 0.01).toFixed(2)};
  vZ = w.z;
  vCarril = carril;
  vec4 mv = viewMatrix * w;
  vProf = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FRAG_C = /* glsl */ `
precision highp float;
uniform vec3 uCrema;
uniform vec3 uRosa;
uniform float uAlfa;
uniform float uLejos;
uniform float uTiempo;
varying float vProf;
varying float vZ;
varying float vCarril;
${LEJOS}
void main() {
  float pulso = pow(smoothstep(0.75, 1.0, fract(-vZ / 14.0 - uTiempo * 0.22)), 3.0);
  gl_FragColor = vec4(uRosa, uAlfa * (0.22 + 0.78 * pulso) * lejos(vProf, uLejos));
}`;

// Las antenas: plantadas en las laderas, una cada 13 unidades y cada una a un lado, con la luz de la punta latiendo
const VERT_A = /* glsl */ `
attribute vec3 position;
attribute float acento;
attribute float base;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
${VALLE}
varying float vProf;
varying float vAcento;
varying float vFase;
void main() {
  float z = (modelMatrix * vec4(0.0, 0.0, base, 1.0)).z;
  float n = floor(z / 13.0 + 0.5);
  float lado = mod(n, 2.0) * 2.0 - 1.0;
  float r = azar(vec2(n, 3.7));
  float x = valle(z) + lado * (6.2 + r * 2.6);
  vec3 w = vec3(x, ${SUELO.toFixed(2)} + alto(vec2(x, z)) - 0.05, z) + position * (2.1 + r * 1.3);
  vAcento = acento;
  vFase = r * 6.28;
  vec4 mv = viewMatrix * vec4(w, 1.0);
  vProf = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FRAG_A = /* glsl */ `
precision highp float;
uniform vec3 uCrema;
uniform vec3 uRosa;
uniform float uAlfa;
uniform float uLejos;
uniform float uTiempo;
varying float vProf;
varying float vAcento;
varying float vFase;
${LEJOS}
void main() {
  float late = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTiempo * 2.6 + vFase), 4.0);
  vec3 c = mix(uCrema, uRosa, vAcento);
  gl_FragColor = vec4(c, uAlfa * mix(0.42, late * 1.4, vAcento) * lejos(vProf, uLejos));
}`;

// El polvo: motas quietas en el mundo, en una caja que va con la cámara; al viajar se estiran en rayas
const VERT_P = /* glsl */ `
attribute vec3 position;
attribute float cola;
attribute float brillo;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 uCam;
uniform vec3 uVel;
uniform float uEstela;
uniform float uTiempo;
varying float vProf;
varying float vBrillo;
void main() {
  vec3 lo = vec3(-15.0, -1.4, -44.0), caja = vec3(30.0, 9.0, 50.0);
  vec3 p = position + vec3(0.0, uTiempo * 0.05 * brillo, 0.0);
  vec3 w = uCam + mod(p - uCam - lo, caja) + lo;
  w -= uVel * uEstela * cola;
  // Quieta, cada mota es una raya de unos pocos píxeles, esté cerca o lejos
  w.y += cola * 0.0035 * max(0.5, -(viewMatrix * vec4(w, 1.0)).z);
  vBrillo = brillo;
  vec4 mv = viewMatrix * vec4(w, 1.0);
  vProf = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FRAG_P = /* glsl */ `
precision highp float;
uniform vec3 uCrema;
uniform vec3 uRosa;
uniform float uAlfa;
uniform float uLejos;
varying float vProf;
varying float vBrillo;
${LEJOS}
void main() {
  vec3 c = mix(uCrema, uRosa, step(0.92, vBrillo));
  gl_FragColor = vec4(c, uAlfa * (0.25 + 0.6 * vBrillo) * lejos(vProf, uLejos));
}`;

const CREMA = [231 / 255, 226 / 255, 218 / 255];
const ROSA = [245 / 255, 203 / 255, 215 / 255];
const azar = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

export function crearEscena(canvas, { conRaton = false, reducido = false, slugs = Object.keys(MODELOS) } = {}) {
  let renderer;
  try {
    renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio || 1, 2), alpha: true, antialias: true, premultipliedAlpha: false });
  } catch (e) { return null; }
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  const N = slugs.length;

  const camara = new Camera(gl, { fov: 30, near: 0.1, far: 80 });
  const raiz = new Transform();

  const programa = (vertex, fragment, uniforms = {}, aditivo = false) => {
    const p = new Program(gl, {
      vertex, fragment, transparent: true, depthTest: false, depthWrite: false,
      uniforms: {
        uCrema: { value: CREMA }, uRosa: { value: ROSA }, uAlfa: { value: 1 }, uLejos: { value: 30 },
        uSep: { value: SEP }, uVaiven: { value: VAIVEN }, uCerca: { value: 2.2 }, ...uniforms,
      },
    });
    if (aditivo) p.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    return p;
  };
  // Cada segmento lleva su orden de dibujo: de abajo arriba con un poco de azar (o por ángulo, para los círculos)
  const geometria = ({ posicion, acento }, porAngulo = false) => {
    const n = posicion.length / 3, orden = new Float32Array(n);
    let y0 = Infinity, y1 = -Infinity;
    for (let v = 1; v < posicion.length; v += 3) { y0 = Math.min(y0, posicion[v]); y1 = Math.max(y1, posicion[v]); }
    for (let v = 0; v < n; v += 2) {
      const mx = (posicion[v * 3] + posicion[v * 3 + 3]) / 2, my = (posicion[v * 3 + 1] + posicion[v * 3 + 4]) / 2, mz = (posicion[v * 3 + 2] + posicion[v * 3 + 5]) / 2;
      const o = porAngulo ? Math.atan2(mz, mx) / (Math.PI * 2) + 0.5 : ((my - y0) / (y1 - y0 || 1)) * 0.82 + azar(v) * 0.18;
      orden[v] = orden[v + 1] = Math.min(0.995, o);
    }
    return new Geometry(gl, { position: { size: 3, data: posicion }, acento: { size: 1, data: acento }, orden: { size: 1, data: orden } });
  };
  const malla = (geometry, program, padre = raiz) => {
    const m = new Mesh(gl, { geometry, program, mode: gl.LINES, frustumCulled: false });
    m.setParent(padre);
    return m;
  };

  // --- El paisaje ---------------------------------------------------------------------------------------------
  // El terreno: filas cada 0,6 (las que dibujan el perfil de las montañas) y columnas cada 2,4, de 48 × 52
  const terreno = (() => {
    const p = [], a = [];
    for (let j = 0; j <= 86; j++) {
      const z = 6 - j * 0.6;
      for (let i = 0; i < 120; i++) { p.push(-24 + i * 0.4, 0, z, -24 + (i + 1) * 0.4, 0, z); a.push(0, 0); }
    }
    for (let i = 0; i <= 20; i++) {
      const x = -24 + i * 2.4;
      for (let j = 0; j < 129; j++) { p.push(x, 0, 6 - j * 0.4, x, 0, 6 - (j + 1) * 0.4); a.push(1, 1); }
    }
    return new Geometry(gl, { position: { size: 3, data: new Float32Array(p) }, acento: { size: 1, data: new Float32Array(a) } });
  })();
  const progTerreno = programa(VERT_T, FRAG_T, { uLejos: { value: 50 } });
  const mTerreno = malla(terreno, progTerreno);

  const camino = (() => {
    const p = [], c = [];
    for (const carril of [0]) {
      for (let j = 0; j < 173; j++) { p.push(0, 0, 6 - j * 0.3, 0, 0, 6 - (j + 1) * 0.3); c.push(carril, carril); }
    }
    return new Geometry(gl, { position: { size: 3, data: new Float32Array(p) }, carril: { size: 1, data: new Float32Array(c) } });
  })();
  const progCamino = programa(VERT_C, FRAG_C, { uLejos: { value: 34 }, uTiempo: { value: 0 } });
  const mCamino = malla(camino, progCamino);

  // Seis antenas, de 13 en 13: la malla salta de 13 en 13 con la cámara y cada una cae siempre en su sitio
  const antenas = (() => {
    const una = antena(), p = [], a = [], b = [];
    for (let j = 0; j < 6; j++) {
      p.push(...una.posicion); a.push(...una.acento);
      for (let v = 0; v < una.acento.length; v++) b.push(13 - j * 13);
    }
    return new Geometry(gl, { position: { size: 3, data: new Float32Array(p) }, acento: { size: 1, data: new Float32Array(a) }, base: { size: 1, data: new Float32Array(b) } });
  })();
  const progAntenas = programa(VERT_A, FRAG_A, { uLejos: { value: 40 }, uCerca: { value: 8 }, uTiempo: { value: 0 } });
  const mAntenas = malla(antenas, progAntenas);

  const polvo = (() => {
    const n = 700, p = [], c = [], b = [];
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 30, y = Math.random() * 9, z = Math.random() * 50, br = Math.random();
      p.push(x, y, z, x, y, z); c.push(0, 1); b.push(br, br);
    }
    return new Geometry(gl, { position: { size: 3, data: new Float32Array(p) }, cola: { size: 1, data: new Float32Array(c) }, brillo: { size: 1, data: new Float32Array(b) } });
  })();
  const progPolvo = programa(VERT_P, FRAG_P, { uLejos: { value: 26 }, uCam: { value: [0, 0, 0] }, uVel: { value: [0, 0, 0] }, uEstela: { value: 0.12 }, uTiempo: { value: 0 } });
  const mPolvo = malla(polvo, progPolvo);

  // La sala de las misiones, en la estación en la que estés
  const progSala = programa(VERT_M, FRAG_M, { uLejos: { value: 34 }, uTinte: { value: [1, 1, 1] }, uDibujo: { value: 1 }, uDesvio: { value: 0 } });
  const mSala = malla(geometria(sala(), true), progSala);

  // --- Los modelos: uno por innovación, con su peana; el de verdad y dos copias para el rojo y el azul --------------
  const progModelo = programa(VERT_M, FRAG_M, { uLejos: { value: 28 }, uTinte: { value: [1, 1, 1] }, uDibujo: { value: 1 }, uDesvio: { value: 0 } });
  const progRojo = programa(VERT_M, FRAG_M, { uLejos: { value: 28 }, uTinte: { value: [1.0, 0.22, 0.42] }, uDibujo: { value: 1 }, uDesvio: { value: 0 } }, true);
  const progAzul = programa(VERT_M, FRAG_M, { uLejos: { value: 28 }, uTinte: { value: [0.25, 0.72, 1.0] }, uDibujo: { value: 1 }, uDesvio: { value: 0 } }, true);
  const progPeana = programa(VERT_M, FRAG_M, { uLejos: { value: 28 }, uTinte: { value: [1, 1, 1] }, uDibujo: { value: 1 }, uDesvio: { value: 0 } });
  const geoPeana = geometria(peana(), true);

  const estrecha = () => innerWidth / innerHeight < 0.8;
  // Dónde se pone el modelo respecto a su estación, según la vista y su lado (-1 izquierda, 1 derecha). Al entrar se
  // va al lado contrario.
  const POSES = {
    slider: (l) => (estrecha() ? { x: 0, y: 0.95, z: -0.6, ry: -0.5 * l, s: 0.62 } : { x: 1.72 * l, y: -0.32, z: -0.4, ry: -0.55 * l, s: 0.72 }),
    dentro: (l) => (estrecha() ? { x: 0, y: 0.85, z: 0.2, ry: 0.45 * l, s: 0.7 } : { x: -1.36 * l, y: -0.42, z: 0.6, ry: 0.5 * l, s: 0.84 }),
  };
  POSES.mision = POSES.dentro;

  const fichas = slugs.map((slug, idx) => {
    const grupo = new Transform();
    grupo.setParent(raiz);
    const geo = geometria(MODELOS[slug]());
    const ficha = { idx, slug, grupo, k: idx, lado: ladoDe(idx), factor: ESCALA[slug] || 1, alfa: 0, dibujo: 0, desvio: 0 };
    ficha.pose = POSES.slider(ficha.lado);
    const [m, r, a] = [progModelo, progRojo, progAzul].map((p) => malla(geo, p, grupo));
    m.onBeforeRender(() => { progModelo.uniforms.uAlfa.value = ficha.alfa; progModelo.uniforms.uDibujo.value = ficha.dibujo; });
    for (const [copia, prog, signo] of [[r, progRojo, -1], [a, progAzul, 1]]) {
      copia.onBeforeRender(() => {
        prog.uniforms.uAlfa.value = ficha.alfa * Math.min(1, ficha.desvio * 1.6) * 0.85;
        prog.uniforms.uDibujo.value = ficha.dibujo;
        prog.uniforms.uDesvio.value = signo * 0.016 * ficha.desvio;
      });
    }
    ficha.copias = [r, a];
    ficha.peana = malla(geoPeana, progPeana);
    ficha.peana.onBeforeRender(() => { progPeana.uniforms.uAlfa.value = ficha.alfa * st.terreno * 0.7; progPeana.uniforms.uDibujo.value = ficha.dibujo; });
    return ficha;
  });

  // --- Lo que se anima -----------------------------------------------------------------------------------------
  // u: por dónde va la cámara; terreno, sala y modelo: cuánto se ve cada cosa; glitch: el rojo y azul de más
  // solo: mientras llega la primera vez, solo se ve la estación a la que va
  const st = { u: 0, terreno: 0, sala: 0, modelo: 1, glitch: 0, dir: 1, solo: null };
  let vista = 'slider';
  const actual = () => fichas[((Math.round(st.u) % N) + N) % N];
  const raton = { x: 0, y: 0 };
  let rx = 0, ry = 0;
  if (conRaton && !reducido) {
    addEventListener('pointermove', (e) => { raton.x = e.clientX / innerWidth - 0.5; raton.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  }

  let fovBase = 30, fovPuesto = 0;
  const medir = () => {
    renderer.setSize(innerWidth, innerHeight);
    fovBase = estrecha() ? 42 : 30;
    fovPuesto = 0;
    const yo = actual();
    for (const f of fichas) f.pose = f === yo ? POSES[vista](f.lado) : POSES.slider(f.lado);
  };
  addEventListener('resize', medir);
  medir();

  // Dónde está la cámara para un u (y hacia dónde mira): sube, se inclina y abre el ángulo a mitad de camino
  const enCamino = (u, rxx = 0, ryy = 0) => {
    const f = u - Math.floor(u);
    const vuelo = reducido ? 0 : Math.sin(Math.PI * f);
    const cx = camX(u), cz = -u * SEP + CAM_Z;
    const dx = -VAIVEN * Math.PI * Math.sin(Math.PI * u), dz = -SEP, l = Math.hypot(dx, dz);
    camara.position.set(cx + rxx, CAM_Y + vuelo * 1.15 + ryy, cz);
    const giro = -0.1 * vuelo * Math.cos(Math.PI * u) * st.dir;
    camara.up.set(Math.sin(giro), Math.cos(giro), 0);
    camara.lookAt([cx + (dx / l) * CAM_Z + rxx * 0.3, CAM_Y - 0.5 - vuelo * 0.75, cz + (dz / l) * CAM_Z]);
    const fov = fovBase + vuelo * 9;
    if (Math.abs(fov - fovPuesto) > 0.01) { camara.perspective({ aspect: innerWidth / innerHeight, fov }); fovPuesto = fov; }
    return vuelo;
  };

  let t0 = performance.now(), antes = t0, vivo = true, raf = 0;
  const previa = new Vec3();
  const vel = [0, 0, 0];
  const pintar = (ahora) => {
    raf = requestAnimationFrame(pintar);
    if (!vivo) return;
    const t = (ahora - t0) / 1000, dt = Math.max(0.001, Math.min(0.1, (ahora - antes) / 1000));
    antes = ahora;
    const u = st.u;

    // La cámara se mueve un poco con el ratón (solo en escritorio); en la misión, quieta, para que la zona no se mueva
    const k = vista === 'mision' ? 0 : 1;
    const muelle = vista === 'mision' ? 0.18 : 0.04;
    rx += (raton.x * 0.6 * k - rx) * muelle;
    ry += (-raton.y * 0.35 * k - ry) * muelle;
    previa.copy(camara.position);
    const vuelo = enCamino(u, rx, ry);
    for (let c = 0; c < 3; c++) vel[c] += ((camara.position[c] - previa[c]) / dt - vel[c]) * 0.3;

    // El paisaje va con la cámara, saltando lo justo para que cada línea caiga siempre en el mismo sitio del mundo
    mTerreno.position.set(Math.round(camara.position.x / 2.4) * 2.4, 0, Math.round(camara.position.z / 1.2) * 1.2);
    mCamino.position.set(0, 0, Math.round(camara.position.z / 1.2) * 1.2);
    mAntenas.position.set(0, 0, Math.round(camara.position.z / 13) * 13);
    progTerreno.uniforms.uAlfa.value = st.terreno * 0.95;
    progCamino.uniforms.uAlfa.value = st.terreno;
    progAntenas.uniforms.uAlfa.value = st.terreno;
    progAntenas.uniforms.uTiempo.value = t;
    progCamino.uniforms.uTiempo.value = reducido ? 0 : t;
    progPolvo.uniforms.uAlfa.value = st.terreno * 0.8;
    progPolvo.uniforms.uTiempo.value = reducido ? 0 : t;
    progPolvo.uniforms.uCam.value = [camara.position.x, camara.position.y, camara.position.z];
    progPolvo.uniforms.uVel.value = vel;
    for (const m of [mTerreno, mCamino, mAntenas, mPolvo]) m.visible = st.terreno > 0.01;

    // Cada modelo, en la estación suya más cercana: se dibuja al acercarte y se queda atrás al pasar
    const yo = actual();
    for (const f of fichas) {
      f.k = f.idx + N * Math.round((u - f.idx) / N);
      const dk = f.k - u;
      const bx = camX(f.k), bz = -f.k * SEP;
      const p = f.pose;
      f.grupo.position.set(bx + p.x, p.y, bz + p.z);
      f.grupo.rotation.y = p.ry + (reducido ? 0 : Math.sin(t * 0.22 + f.idx) * 0.1);
      const s = p.s * f.factor;
      f.grupo.scale.set(s, s, s);
      f.dibujo = dk > 0 ? Math.max(0, Math.min(1, 1 - (dk - 0.12) / 0.62)) : 1;
      f.alfa = dk > -0.9 && dk < 0.76 && (st.solo === null || st.solo === f.k) ? (f === yo ? st.modelo : 1) : 0;
      f.desvio = Math.max(vuelo, st.glitch);
      f.grupo.visible = f.alfa > 0.01 && f.dibujo > 0;
      for (const c of f.copias) c.visible = f.desvio > 0.02;
      f.peana.visible = f.grupo.visible && st.terreno > 0.01;
      f.peana.position.set(bx + p.x, SUELO + 0.02, bz + p.z);
      f.peana.rotation.y = t * 0.06 * f.lado;
    }

    // La sala, en la estación de ahora; se dibuja sola al entrar en la misión
    mSala.position.set(camX(Math.round(u)), 0, -Math.round(u) * SEP);
    progSala.uniforms.uAlfa.value = st.sala;
    progSala.uniforms.uDibujo.value = Math.min(1, st.sala * 1.15);
    mSala.visible = st.sala > 0.01;

    renderer.render({ scene: raiz, camera: camara });
  };
  raf = requestAnimationFrame(pintar);
  document.addEventListener('visibilitychange', () => { vivo = !document.hidden; antes = performance.now(); });

  const D = reducido ? 0 : 1;
  const api = {
    ladoDe,
    // La primera vez: la cámara llega volando a su estación y el paisaje se enciende
    entrar(k) {
      st.u = k - 0.9 * D;
      st.dir = 1;
      st.solo = k;
      return gsap.timeline({ onComplete: () => { st.solo = null; } })
        .to(st, { terreno: 1, duration: 1.6 * D, ease: 'power2.out' }, 0)
        .to(st, { u: k, duration: 2.6 * D, ease: 'power3.out' }, 0);
    },
    // Volar a otra estación (k puede ser cualquier entero: el recorrido da la vuelta)
    viajar(k, duracion = 2.3) {
      st.dir = k >= st.u ? 1 : -1;
      return gsap.to(st, { u: k, duration: duracion * D, ease: 'power2.inOut', overwrite: 'auto' });
    },
    vista(nueva) {
      vista = nueva;
      const f = actual();
      const vis = nueva === 'mision' ? { modelo: 0, terreno: 0, sala: 1 } : { modelo: 1, terreno: 1, sala: 0 };
      gsap.to(f.pose, { ...POSES[nueva](f.lado), duration: 1.2 * D, ease: 'power3.inOut', overwrite: 'auto' });
      // El rojo y el azul asoman un momento mientras el modelo cambia de lado
      if (nueva !== 'mision') gsap.fromTo(st, { glitch: 0.6 }, { glitch: 0, duration: 1.1 * D, ease: 'power2.out' });
      return gsap.to(st, { ...vis, duration: 1.2 * D, ease: 'power3.inOut', overwrite: 'auto' });
    },
    // Dónde cae en pantalla un punto del modelo de ahora (para los círculos y sus etiquetas)
    proyectar([x, y, z]) {
      const f = actual();
      raiz.updateMatrixWorld();
      camara.updateMatrixWorld();
      const v = new Vec3(x, y, z).applyMatrix4(f.grupo.worldMatrix);
      camara.project(v);
      return { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight, delante: v.z < 1 };
    },
    // Lo mismo para un punto de la sala (respecto a la estación), con la cámara ya quieta en su sitio
    proyectarMundo([x, y, z]) {
      const k = Math.round(st.u);
      enCamino(k);
      camara.updateMatrixWorld();
      const v = new Vec3(camX(k) + x, y, -k * SEP + z);
      camara.project(v);
      return { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight };
    },
    destruir() { cancelAnimationFrame(raf); removeEventListener('resize', medir); },
  };
  return api;
}
