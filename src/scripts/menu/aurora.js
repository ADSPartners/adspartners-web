// El menú es un viaje: «la aurora». Al abrirlo, la página se apaga y la cámara sube desde un horizonte de alambre,
// atraviesa las nubes y se asoma a la noche, donde se despliega una aurora. Cada cortina es una página, con el color de
// una emisión real (data/menu.js): pasar por encima la enciende y pinchar te mete dentro y te lleva a la página.
// La aurora es física exacta que aun así emociona: brand por fuera, tech por dentro.
// El viento solar sale de la visita (rastro.js): cuanto más y más deprisa se ha movido el ratón, más se mueve la
// aurora; y dentro del menú, cada movimiento rápido es una ráfaga. Suena a su «coro del amanecer» (sonido.coro).
// Todo es código con OGL: cortinas de rayos (quads sumados), suelo y nubes de líneas, estrellas de puntos.
import { Renderer, Camera, Transform, Program, Mesh, Geometry, Vec3 } from 'ogl';
import { gsap } from 'gsap';
import { rastro } from '../rastro.js';

// Dónde está cada cortina: x, z del centro; largo, la mitad de su ancho; base y alto, dónde empieza y cuánto sube.
// Por alturas como en el cielo: el rosa abajo, el verde en medio, el rojo arriba del todo. nombre: a qué altura de
// la cortina va su nombre y sNombre, en qué punto de su ancho (donde se ve sola, sin otra delante). vertical: dónde va
// en una pantalla en vertical (el móvil), escalonadas en altura para que llenen la pantalla y los nombres no se pisen.
const CORTINAS = {
  proyectos: {
    x: -10, z: -60, largo: 30, base: 13, alto: 29, fase: 0.0, rayos: 1100, nombre: 0.62, sNombre: 0,
    vertical: { x: 2, base: 22, alto: 30, nombre: 0.55, sNombre: 0.2 },
  },
  tech: {
    x: 6, z: -40, largo: 24, base: 7.5, alto: 22, fase: 1.7, rayos: 1100, borde: '#ff8fc0', nombre: 0.2, sNombre: -0.3,
    vertical: { x: 3, base: 7, alto: 22, nombre: 0.25, sNombre: 0.25 },
  },
  brand: {
    x: -16, z: -26, largo: 9, base: 4.5, alto: 6.5, fase: 3.1, rayos: 480, nombre: 0.5, sNombre: 0,
    vertical: { x: -4, base: 3.5, alto: 7, nombre: 0.6, sNombre: -0.2 },
  },
  hablemos: {
    x: 24, z: -48, largo: 12, base: 10, alto: 15, fase: 4.4, rayos: 560, nombre: 0.72, sNombre: 0.15,
    vertical: { x: -3, base: 14, alto: 16, nombre: 0.6, sNombre: -0.3 },
  },
};
const SUBIDA = 4.6;   // s del viaje la primera vez
const REPOSO = { pos: [0, 2, 12], mira: [2, 18.5, -40] };
const SALIDA = { pos: [0, 0.35, 12], mira: [0, 0.9, -40] };
// Las capas que se cruzan al subir (lo que dice el inspector mientras tanto)
const CAPAS = [[0, 'troposfera'], [2, 'troposfera'], [6, 'troposfera · nubes'], [12, 'tropopausa · por encima de las nubes']];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const mezcla = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const suave = (x) => x * x * (3 - 2 * x);
// Ruido para el CPU, el mismo que el del shader de la cortina (para saber dónde cae en pantalla)
const azar1 = (i) => { const v = Math.sin(i * 127.1) * 43758.5453; return v - Math.floor(v); };
const ruido1 = (x) => { const i = Math.floor(x), f = x - i; return azar1(i) + (azar1(i + 1) - azar1(i)) * f * f * (3 - 2 * f); };
const azar2 = (x, z) => { const v = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return v - Math.floor(v); };
const ruido2 = (x, z) => {
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = azar2(ix, iz), b = azar2(ix + 1, iz), c = azar2(ix, iz + 1), d = azar2(ix + 1, iz + 1);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
};

const CORTINA_V = /* glsl */ `
attribute vec3 position;   // x: dónde está el rayo en la cortina (-1..1); y: lado del rayo (-1/1); z: abajo/arriba (0/1)
attribute float semilla;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uT, uX, uZ, uLargo, uBase, uAlto, uFase, uAncho;
varying float vV, vU, vLuz;
float azar1(float i) { return fract(sin(i * 127.1) * 43758.5453); }
float ruido1(float x) { float i = floor(x), f = fract(x); return mix(azar1(i), azar1(i + 1.0), f * f * (3.0 - 2.0 * f)); }
void main() {
  float s = position.x;
  float x = uX + s * uLargo;
  // Los pliegues de la cortina, que se mueven con el viento
  float z = uZ + 2.4 * sin(s * 3.1 + uT * 0.7 + uFase) + 1.2 * sin(s * 7.3 - uT * 1.3 + uFase * 2.0);
  // Manchas de luz que recorren la cortina y el parpadeo de cada rayo
  float parche = ruido1(s * 5.0 - uT * 0.9 + uFase * 3.0) * 0.6 + ruido1(s * 13.0 + uT * 1.7) * 0.4;
  float chispa = 0.6 + 0.4 * sin(semilla * 60.0 + uT * (3.0 + semilla * 4.0));
  float luz = (0.25 + 0.75 * parche) * chispa * smoothstep(1.0, 0.72, abs(s));
  float alto = uAlto * (0.45 + 0.75 * parche) * (0.85 + 0.15 * chispa);
  float y = uBase + position.z * alto + (ruido1(s * 9.0 + uT * 0.5) - 0.5) * 0.5;
  x += position.y * uAncho;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
  vV = position.z; vU = position.y; vLuz = luz;
}`;
const CORTINA_F = /* glsl */ `
precision highp float;
uniform vec3 uColor, uBorde;
uniform float uBrillo, uAparece, uAlfa;
varying float vV, vU, vLuz;
void main() {
  float lado = 1.0 - abs(vU); lado *= lado;
  float abajo = smoothstep(0.0, 0.05, vV);
  float arriba = pow(1.0 - vV, 1.8);
  vec3 col = mix(uBorde, uColor, smoothstep(0.03, 0.22, vV));
  col += vec3(0.22) * (1.0 - smoothstep(0.0, 0.1, vV));   // el borde de abajo, más blanco: ahí es más intensa
  float a = lado * abajo * arriba * vLuz * (0.44 + uBrillo * 0.48) * uAlfa;
  a *= 1.0 - smoothstep(uAparece - 0.12, uAparece, vV);     // se dibuja de abajo arriba
  gl_FragColor = vec4(col, a);
}`;
// Líneas del suelo y de las nubes: se apagan a lo lejos y muy cerca de la cámara
const LINEA_V = /* glsl */ `
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying float vD;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }`;
const LINEA_F = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uAlfa, uLejos, uCerca;
varying float vD;
void main() { gl_FragColor = vec4(uColor, uAlfa * (1.0 - smoothstep(uLejos * 0.35, uLejos, vD)) * smoothstep(0.3, uCerca, vD)); }`;
const ESTRELLA_V = /* glsl */ `
attribute vec3 position;
attribute float semilla;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uT, uDpr, uEstrellas;
varying float vA;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (1.0 + semilla * 1.7) * uDpr;
  vA = uEstrellas * (0.3 + 0.7 * semilla) * (0.72 + 0.28 * sin(uT * (1.5 + semilla * 2.5) + semilla * 50.0));
}`;
const ESTRELLA_F = /* glsl */ `
precision highp float;
varying float vA;
void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.97, 0.93, vA * smoothstep(0.5, 0.0, d)); }`;

export function crear(raiz, { datos, reducido, sonido, ir }) {
  const lienzo = raiz.querySelector('[data-au-lienzo]');
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  let renderer;
  try {
    renderer = new Renderer({ canvas: lienzo, dpr: Math.min(devicePixelRatio || 1, movil ? 1.5 : 1.75), alpha: false, antialias: true });
  } catch (e) { return null; }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.clearColor(18 / 255, 13 / 255, 10 / 255, 1);
  const camara = new Camera(gl, { fov: 52, near: 0.1, far: 400 });
  const escena = new Transform();
  const CREMA = rgb('#E7E2DA');

  // --- El suelo: filas de alambre, casi llano cerca y montañas al fondo ------------------------------------------
  const suelo = [];
  for (let z = 9; z > -80; z -= 1.4) {
    const monte = suave(Math.min(1, Math.max(0, (-z - 18) / 45))) * 6;
    for (let x = -70; x < 70; x += 1.3) {
      const h = (a) => ruido2(a * 0.09, z * 0.09) * monte + ruido2(a * 0.35, z * 0.35) * 0.25;
      suelo.push(x, h(x), z, x + 1.3, h(x + 1.3), z);
    }
  }
  // Las nubes: trazos sueltos en una capa que la cámara atraviesa al subir
  const nubes = [];
  for (let i = 0; i < 320; i++) {
    const x = (Math.random() - 0.5) * 60, y = 0.9 + Math.random() * 0.9, z = 8 - Math.random() * 40, l = 1 + Math.random() * 4;
    nubes.push(x, y, z, x + l, y, z);
  }
  // Las estrellas, en una cúpula delante y por encima
  const estrellas = [], semillas = [];
  for (let i = 0; i < (movil ? 900 : 1600); i++) {
    const az = (Math.random() - 0.5) * Math.PI * 1.3, el = Math.asin(0.02 + Math.random() * 0.96) * 0.95;
    estrellas.push(Math.sin(az) * Math.cos(el) * 180, Math.sin(el) * 180, -Math.cos(az) * Math.cos(el) * 180);
    semillas.push(Math.random() ** 2);
  }

  const lineas = (datos3, uniforms, orden) => {
    const p = new Program(gl, { vertex: LINEA_V, fragment: LINEA_F, transparent: true, depthTest: false, depthWrite: false, uniforms });
    const m = new Mesh(gl, { geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(datos3) } }), program: p, mode: gl.LINES, frustumCulled: false });
    m.renderOrder = orden; m.setParent(escena);
    return p;
  };
  const pSuelo = lineas(suelo, { uColor: { value: CREMA }, uAlfa: { value: 0.15 }, uLejos: { value: 90 }, uCerca: { value: 1.5 } }, 1);
  const pNubes = lineas(nubes, { uColor: { value: CREMA }, uAlfa: { value: 0.3 }, uLejos: { value: 40 }, uCerca: { value: 2.5 } }, 2);
  const pEstrellas = new Program(gl, {
    vertex: ESTRELLA_V, fragment: ESTRELLA_F, transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uT: { value: 0 }, uDpr: { value: renderer.dpr }, uEstrellas: { value: 0 } },
  });
  const mEstrellas = new Mesh(gl, {
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(estrellas) }, semilla: { size: 1, data: new Float32Array(semillas) } }),
    program: pEstrellas, mode: gl.POINTS, frustumCulled: false,
  });
  mEstrellas.renderOrder = 0; mEstrellas.setParent(escena);

  // --- Las cortinas: rayos verticales que se suman (como la luz) ---------------------------------------------------
  const cortinas = datos.map((d, k) => {
    const c = CORTINAS[d.slug];
    const n = Math.round(c.rayos * (movil ? 0.55 : 1));
    const pos = new Float32Array(n * 12), sem = new Float32Array(n * 4), idx = new Uint16Array(n * 6);
    for (let i = 0; i < n; i++) {
      const s = -1 + (2 * (i + Math.random() * 0.8)) / n, r = Math.random();
      [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([u, v], j) => { pos.set([s, u, v], (i * 4 + j) * 3); sem[i * 4 + j] = r; });
      idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6);
    }
    const color = rgb(d.color);
    const program = new Program(gl, {
      vertex: CORTINA_V, fragment: CORTINA_F, transparent: true, depthTest: false, depthWrite: false,
      uniforms: {
        uT: { value: 0 }, uX: { value: c.x }, uZ: { value: c.z }, uLargo: { value: c.largo }, uBase: { value: c.base },
        uAlto: { value: c.alto }, uFase: { value: c.fase }, uAncho: { value: (c.largo * 2 / n) * 4.2 },
        uColor: { value: color }, uBorde: { value: c.borde ? rgb(c.borde) : mezcla(color, [1, 1, 1], 0.15) },
        uBrillo: { value: 0 }, uAparece: { value: 0 }, uAlfa: { value: 1 },
      },
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    const mesh = new Mesh(gl, { geometry: new Geometry(gl, { position: { size: 3, data: pos }, semilla: { size: 1, data: sem }, index: { data: idx } }), program, frustumCulled: false });
    mesh.renderOrder = 3 + k; mesh.setParent(escena);
    return { d, c, program, brillo: 0, poligono: [], ancla: [0, 0], etq: raiz.querySelector(`[data-au-dest="${d.slug}"]`) };
  });
  addEventListener('resize', () => medir());

  // --- La cámara: del horizonte a mirar la aurora; con el ratón, un poco de paralaje -------------------------------
  const st = { subida: 1, aparece: 1.15, estrellas: 1, zambullida: 0, destino: null, T: 0, racha: 0 };
  const raton = { x: 0, y: 0, px: null, py: 0, t: 0, sobre: null };
  let viento = 0.5, vientoKm = 500;
  // En vertical (el móvil), cada cortina va a su sitio de «vertical»; en una pantalla algo estrecha, se juntan en
  // horizontal para que quepan
  let enVertical = false;
  const medir = () => {
    renderer.setSize(innerWidth, innerHeight);
    enVertical = innerWidth < innerHeight;
    camara.perspective({ aspect: innerWidth / innerHeight, fov: enVertical ? 70 : 52 });
    raiz.classList.toggle('vertical', enVertical);
    const junta = Math.min(1, Math.max(0.42, innerWidth / innerHeight / 1.6));
    for (const k of cortinas) {
      const c = k.c, o = enVertical ? { ...c, ...c.vertical } : c;
      c.cx = enVertical ? o.x : o.x * junta; c.clargo = c.largo * (enVertical ? 0.6 : Math.max(0.6, junta));
      c.cbase = o.base; c.calto = o.alto; c.cnombre = o.nombre; c.csNombre = o.sNombre;
      const u = k.program.uniforms;
      u.uX.value = c.cx; u.uLargo.value = c.clargo; u.uBase.value = c.cbase; u.uAlto.value = c.calto;
    }
  };
  medir();
  const fovBase = () => (innerWidth < innerHeight ? 70 : 52);

  const colocarCamara = () => {
    const k = reducido ? 1 : suave(Math.min(1, st.subida));
    const pos = mezcla(SALIDA.pos, REPOSO.pos, k), mira = mezcla(SALIDA.mira, REPOSO.mira, k);
    pos[0] += raton.x * 1.2 * k; pos[1] += -raton.y * 0.4 * k;
    mira[1] += -raton.y * 1.5 * k;
    // Al pinchar, la cámara se mete en la cortina
    if (st.destino && st.zambullida > 0) {
      const c = st.destino.c, z = suave(st.zambullida) * 0.72;
      const centro = [c.cx, c.cbase + c.calto * 0.4, c.z];
      for (let i = 0; i < 3; i++) { pos[i] += (centro[i] - pos[i]) * z; mira[i] += (centro[i] - mira[i]) * z * 0.5; }
      camara.perspective({ fov: fovBase() + suave(st.zambullida) * 22 });
    }
    camara.position.set(...pos);
    camara.lookAt(mira);
    camara.updateMatrixWorld();
  };

  // Dónde cae en pantalla un punto de la cortina (con los mismos pliegues que el shader)
  const v3 = new Vec3();
  const proyectar = (c, s, alto) => {
    const z = c.z + 2.4 * Math.sin(s * 3.1 + st.T * 0.7 + c.fase) + 1.2 * Math.sin(s * 7.3 - st.T * 1.3 + c.fase * 2);
    v3.set(c.cx + s * c.clargo, c.cbase + alto, z);
    camara.project(v3);
    return [(v3.x * 0.5 + 0.5) * innerWidth, (-v3.y * 0.5 + 0.5) * innerHeight, v3.z < 1];
  };
  const dentro = (pt, pol) => {
    let si = false;
    for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
      const [xi, yi] = pol[i], [xj, yj] = pol[j];
      if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) si = !si;
    }
    return si;
  };

  // --- Pasar el ratón: ráfagas de viento y la cortina de debajo, encendida -----------------------------------------
  const elegir = (slug) => {
    raton.sobre = slug;
    lienzo.style.cursor = slug ? 'pointer' : '';
    cortinas.forEach((k) => k.etq.classList.toggle('on', k.d.slug === slug));
  };
  raiz.addEventListener('pointermove', (e) => {
    raton.x = e.clientX / innerWidth - 0.5; raton.y = e.clientY / innerHeight - 0.5;
    const t = performance.now();
    if (raton.px !== null && t - raton.t < 100) st.racha = Math.min(1, st.racha + Math.hypot(e.clientX - raton.px, e.clientY - raton.py) / 900);
    raton.px = e.clientX; raton.py = e.clientY; raton.t = t;
    if (e.target === lienzo) mirarEncima(e);
  });
  // Qué cortina hay debajo (también al tocar, que en el móvil no hay «pasar por encima» antes del clic)
  const mirarEncima = (e) => {
    // Encima del nombre de una, esa. Si no, como se solapan en pantalla: de las que tienen el ratón dentro, la que
    // tiene el nombre más cerca
    const enNombre = cortinas.find((k) => {
      const r = k.etq.getBoundingClientRect();
      return e.clientX > r.left - 12 && e.clientX < r.right + 12 && e.clientY > r.top - 12 && e.clientY < r.bottom + 12;
    });
    const encima = enNombre || cortinas.filter((k) => dentro([e.clientX, e.clientY], k.poligono))
      .sort((a, b) => Math.hypot(a.ancla[0] - e.clientX, a.ancla[1] - e.clientY) - Math.hypot(b.ancla[0] - e.clientX, b.ancla[1] - e.clientY))[0];
    if ((encima?.d.slug ?? null) !== raton.sobre) { elegir(encima?.d.slug ?? null); if (encima) sonido.tic(0.6); }
  };
  lienzo.addEventListener('pointerdown', mirarEncima);
  lienzo.addEventListener('pointerleave', () => elegir(null));
  lienzo.addEventListener('click', () => { if (raton.sobre) lanzar(raton.sobre); });

  // --- Pinchar: te mete en la cortina, se inunda de su color y vas a la página --------------------------------------
  const inundar = raiz.querySelector('[data-au-inundar]');
  function lanzar(slug) {
    const k = cortinas.find((c) => c.d.slug === slug);
    if (!k || st.destino) return;
    if (!k.d.ruta) {
      elegir(slug);
      const luz = k.etq.querySelector('.au__luz');
      clearTimeout(luz._t);
      luz.textContent = 'en obras · llega pronto';
      if (!reducido) gsap.fromTo(k.etq.querySelector('.au__nombre'), { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
      setTimeout(() => { luz.textContent = luz.dataset.texto; }, 1800);
      return;
    }
    elegir(slug);
    st.destino = k;
    raiz.classList.add('zambullendo');
    sonido.viaje(1.1, 1);
    if (reducido) { ir(k.d); return; }
    inundar.style.setProperty('--c', k.d.color);
    gsap.timeline({ onComplete: () => ir(k.d) })
      .to(st, { zambullida: 1, duration: 1.15, ease: 'power2.in' }, 0)
      .fromTo(inundar, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power1.in' }, 0.6);
  }
  raiz.querySelectorAll('[data-au-ir]').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); lanzar(a.dataset.auIr); });
    a.addEventListener('pointerenter', () => elegir(a.dataset.auIr));
    a.addEventListener('focus', () => elegir(a.dataset.auIr));
  });

  // --- El inspector: la altitud mientras se sube; después, el viento solar de tu visita ------------------------------
  const hudAltitud = raiz.querySelector('[data-au-altitud]');
  const hudViento = raiz.querySelector('[data-au-viento]');
  const escribir = (el, texto, demora = 0) => {
    clearTimeout(el._t);
    if (reducido) { el.textContent = texto; return; }
    let n = 0;
    el.textContent = '';
    const paso = () => { el.textContent = texto.slice(0, ++n); if (n < texto.length) el._t = setTimeout(paso, 16); };
    el._t = setTimeout(paso, demora);
  };
  const tiempo = (s) => (s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`);

  // --- El bucle, solo con el menú abierto -------------------------------------------------------------------------------
  let raf = 0, antes = 0, vivo = false;
  function pintar(ahora) {
    raf = requestAnimationFrame(pintar);
    const dt = Math.min(0.05, (ahora - (antes || ahora)) / 1000);
    antes = ahora;
    st.racha *= Math.exp(-dt * 1.2);
    const fuerza = Math.min(1, viento + st.racha * 0.6);
    if (!reducido) st.T += dt * (0.3 + fuerza * 0.9);
    colocarCamara();
    pEstrellas.uniforms.uT.value = ahora / 1000;
    pEstrellas.uniforms.uEstrellas.value = st.estrellas;
    pNubes.uniforms.uAlfa.value = 0.3 * (1 - st.zambullida);
    pSuelo.uniforms.uAlfa.value = 0.15 * (1 - st.zambullida);
    for (const k of cortinas) {
      const objetivo = raton.sobre === k.d.slug ? 1 : raton.sobre ? -0.12 : 0;
      k.brillo += (objetivo - k.brillo) * Math.min(1, dt * 6);
      const u = k.program.uniforms;
      u.uT.value = st.T; u.uAparece.value = st.aparece;
      u.uBrillo.value = k.brillo + (st.destino === k ? st.zambullida * 2 : 0) + st.racha * 0.25;
      u.uAlfa.value = st.destino && st.destino !== k ? 1 - st.zambullida : 1;
      // Su silueta en pantalla (para saber si el ratón está encima) y dónde va su nombre
      const abajo = [], arriba = [];
      for (let i = 0; i <= 16; i++) {
        const s = -0.85 + (1.7 * i) / 16;
        abajo.push(proyectar(k.c, s, 0));
        arriba.push(proyectar(k.c, s, k.c.calto * 0.7));
      }
      k.poligono = [...abajo, ...arriba.reverse()];
      // El nombre, sin salirse de la pantalla (con su ancho de verdad)
      const [x, y, delante] = proyectar(k.c, k.c.csNombre, k.c.calto * k.c.cnombre);
      const medio = (k.etq.offsetWidth || 180) / 2 + 12;
      k.ancla = [Math.min(innerWidth - medio, Math.max(medio, x)), Math.min(innerHeight - 150, Math.max(130, y))];
      k.etq.style.transform = `translate(${k.ancla[0].toFixed(1)}px, ${k.ancla[1].toFixed(1)}px)`;
      k.etq.style.visibility = delante ? '' : 'hidden';
    }
    renderer.render({ scene: escena, camera: camara });
  }

  return {
    // primera: si es la primera vez en esta visita (el viaje entero); si no, se llega casi arriba
    abrir(primera) {
      const r = rastro();
      vientoKm = r.viento;
      viento = (r.viento - 300) / 500;
      st.destino = null; st.zambullida = 0; st.racha = 0;
      raiz.classList.remove('zambullendo');
      inundar.style.opacity = 0;
      camara.perspective({ fov: fovBase() });
      cortinas.forEach((k) => { k.etq.querySelector('.au__luz').textContent = ''; k.etq.classList.remove('visto'); });
      elegir(null);
      if (!vivo) { vivo = true; antes = 0; raf = requestAnimationFrame(pintar); }
      sonido.coro(viento);
      const dur = reducido ? 0 : primera ? SUBIDA : 1.3;
      const desde = primera ? 0 : 0.72;
      gsap.killTweensOf(st);
      Object.assign(st, { subida: desde, aparece: primera ? 0 : 0.4, estrellas: primera ? 0 : 0.6 });
      const fin = () => {
        cortinas.forEach((k, i) => { k.etq.classList.add('visto'); escribir(k.etq.querySelector('.au__luz'), k.etq.querySelector('.au__luz').dataset.texto, i * 140); });
        escribir(hudAltitud, 'las auroras · de unos 90 a más de 300 km de altura');
        escribir(hudViento, `viento solar · ${vientoKm} km/s · sale de tu visita: ${tiempo(r.segundos)} y ${r.metros.toFixed(1).replace('.', ',')} m de ratón`, 500);
      };
      if (!dur) { Object.assign(st, { subida: 1, aparece: 1.15, estrellas: 1 }); fin(); return; }
      // La altitud mientras sube (de 0 a 12 km, con la capa que se cruza)
      const alt = { km: desde * 12 };
      gsap.to(alt, {
        km: 12, duration: dur * 0.85, ease: 'power1.inOut',
        onUpdate: () => {
          const capa = [...CAPAS].reverse().find(([km]) => alt.km >= km)[1];
          hudAltitud.textContent = `altitud · ${alt.km.toFixed(1).replace('.', ',')} km · ${capa}`;
        },
      });
      hudViento.textContent = '';
      gsap.to(st, { subida: 1, duration: dur, ease: 'power2.inOut' });
      gsap.to(st, { estrellas: 1, duration: dur * 0.8, delay: dur * 0.2, ease: 'power1.out' });
      gsap.to(st, { aparece: 1.15, duration: dur * 0.75, delay: dur * 0.3, ease: 'power2.out', onComplete: fin });
    },
    cerrar() {
      sonido.pararCoro();
      gsap.killTweensOf(st);
      cancelAnimationFrame(raf);
      vivo = false;
    },
  };
}
