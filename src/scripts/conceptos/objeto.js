// Idea «objeto»: el isotipo de ads extruido en cristal (three.js), en un canvas fijo detrás de toda la página.
// Cada sección le da un estado (sitio, giro, tamaño, material y color del fondo) y el objeto viaja de uno a otro:
// - portada: cristal sobre la noche · la idea: se gira y asoma el alambre
// - qué hacemos: partido en dos, mitad cristal (marca) y mitad alambre (máquina)
// - capítulos claros: cerámica marrón sobre crema (la paleta oficial de ads)
// Ratón: el objeto se inclina hacia él. Mantener pulsado en la portada: se vuelve todo máquina y la cámara se acerca.
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as sonido from '../sonido.js';
import isoRaw from '../../../public/assets/logos/isotipo_marron.svg?raw';

const NOCHE = new THREE.Color('#120D0A');
const CREMA = new THREE.Color('#E7E2DA');
const MARRON = new THREE.Color('#34190A');

// Estados por sección (escritorio). x, y en unidades de escena; giro en radianes; corte: dónde se parte (lejos = sin partir)
const ESTADOS = {
  portada: { x: 0, y: 0.62, giro: 0, escala: 1, corte: 9, alambre: 0, arcilla: 0, fondo: 0 },
  idea: { x: 2.7, y: -0.2, giro: 0.9, escala: 0.8, corte: 9, alambre: 0.35, arcilla: 0, fondo: 0 },
  hacemos: { x: 2.75, y: 1.55, giro: 0.25, escala: 0.56, corte: 0, alambre: 1, arcilla: 0, fondo: 0 },
  porque: { x: 3.0, y: 0.9, giro: -0.6, escala: 0.42, corte: 9, alambre: 0, arcilla: 1, fondo: 1 },
  contacto: { x: 3.0, y: 1.25, giro: 0.35, escala: 0.4, corte: 9, alambre: 0, arcilla: 1, fondo: 1 },
};
// En el móvil, en la portada va al hueco entre el lema y el texto; en las secciones, emblema pequeño en la esquina
const ESTADOS_MOVIL = {
  portada: { x: 0, y: 0.5, escala: 0.42 },
  idea: { x: 0.95, y: 2.2, escala: 0.18 },
  hacemos: { x: 0.95, y: 2.2, escala: 0.18 },
  porque: { x: 0.95, y: 2.2, escala: 0.18 },
  contacto: { x: 0.95, y: 2.2, escala: 0.18 },
};

export async function crearObjeto({ cursor, reducido, calidad = 'auto' }) {
  const html = document.documentElement;
  const canvas = document.querySelector('[data-escena]');
  const nada = { entrar() {}, calidad() {}, activarCursor() {} };
  if (!canvas) return nada;
  const movil = () => innerWidth <= 760;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { return nada; }
  let nivel = calidad === 'baja' ? 'baja' : 'alta';
  const fijarDpr = () => renderer.setPixelRatio(Math.min(devicePixelRatio, nivel === 'baja' ? 1 : 1.75));
  fijarDpr();
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  const fondo = NOCHE.clone();
  renderer.setClearColor(fondo, 1);

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camara = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100);
  camara.position.set(0, 0, 9);
  const luzCalida = new THREE.DirectionalLight('#ffe7d1', 2.4); luzCalida.position.set(3, 4, 5); escena.add(luzCalida);
  const luzRosa = new THREE.DirectionalLight('#F5CBD7', 1.3); luzRosa.position.set(-4, -2, 3); escena.add(luzRosa);
  escena.add(new THREE.AmbientLight('#ffffff', 0.25));

  // El isotipo: el trazado del SVG extruido con bisel, centrado y a escala
  const formas = new SVGLoader().parse(isoRaw).paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(formas, { depth: 420, bevelEnabled: true, bevelThickness: 70, bevelSize: 46, bevelSegments: 8, curveSegments: 28 });
  geo.center();
  geo.rotateX(Math.PI);           // el SVG tiene la y hacia abajo
  geo.scale(3.6 / 2500, 3.6 / 2500, 3.6 / 2500);
  geo.computeVertexNormals();

  // Dos planos de corte complementarios: a la izquierda del corte, cristal; a la derecha, alambre
  const corteCristal = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 9);
  const corteAlambre = new THREE.Plane(new THREE.Vector3(1, 0, 0), -9);
  const cristal = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0.06, transmission: 1, thickness: 0.9, ior: 1.42,
    iridescence: 0.35, iridescenceIOR: 1.3, clearcoat: 1, clearcoatRoughness: 0.05,
    attenuationColor: new THREE.Color('#F5CBD7'), attenuationDistance: 2.6, envMapIntensity: 1.3,
    clippingPlanes: [corteCristal],
  });
  const alambre = new THREE.MeshBasicMaterial({ color: '#E7E2DA', wireframe: true, transparent: true, opacity: 0, depthWrite: false, clippingPlanes: [corteAlambre] });
  const aristas = new THREE.LineBasicMaterial({ color: '#F5CBD7', transparent: true, opacity: 0, clippingPlanes: [corteAlambre] });

  const grupo = new THREE.Group();
  const inclinacion = new THREE.Group();
  inclinacion.add(new THREE.Mesh(geo, cristal));
  inclinacion.add(new THREE.Mesh(geo, alambre));
  inclinacion.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), aristas));
  grupo.add(inclinacion);
  escena.add(grupo);

  // Resplandor cálido detrás del objeto: el cristal necesita algo detrás que refractar, o sobre la noche se ve negro.
  // Es opaco (three.js solo refracta lo opaco) y se funde con el color del fondo, así que no se le ven los bordes.
  const resplandor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.ShaderMaterial({
      toneMapped: false,
      uniforms: { uColor: { value: new THREE.Color('#E9CDB8') }, uFondo: { value: new THREE.Color() }, uFuerza: { value: 0.6 } },
      vertexShader: 'varying vec2 vUv; void main () { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform vec3 uFondo; uniform float uFuerza; varying vec2 vUv;
        void main () {
          float d = length(vUv - 0.5) * 2.0;
          float a = pow(max(0.0, 1.0 - d), 2.6) * uFuerza;
          gl_FragColor = vec4(mix(uFondo, uColor, a), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  escena.add(resplandor);

  // Estado actual (se interpola hacia el de cada sección)
  const st = { ...ESTADOS.portada, mantener: 0 };
  const objetivo = (nombre) => ({ ...ESTADOS[nombre], ...(movil() ? ESTADOS_MOVIL[nombre] : {}) });
  Object.assign(st, objetivo('portada'));

  function irA(nombre) {
    gsap.to(st, { ...objetivo(nombre), duration: reducido ? 0 : 1.8, ease: 'power3.inOut', overwrite: 'auto' });
    if (nombre !== 'portada') sonido.tic(0.6);
  }
  const secciones = [['portada', '#portada'], ['idea', '#idea'], ['hacemos', '#hacemos'], ['porque', '#porque'], ['contacto', '#contacto']];
  secciones.forEach(([nombre, sel]) => {
    const el = document.querySelector(sel);
    if (!el) return;
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) irA(nombre); } });
  });

  // Ratón: inclinación con inercia
  const raton = { x: 0, y: 0, ix: 0, iy: 0, recorrido: 0, px: null, py: null };
  let fase = 'mueve';
  window.addEventListener('pointermove', (e) => {
    raton.x = e.clientX / innerWidth - 0.5; raton.y = e.clientY / innerHeight - 0.5;
    if (raton.px !== null) raton.recorrido += Math.hypot(e.clientX - raton.px, e.clientY - raton.py);
    raton.px = e.clientX; raton.py = e.clientY;
    if (fase === 'mueve' && raton.recorrido > 900 && window.scrollY < innerHeight * 0.5) { fase = 'manten'; setTimeout(() => cursor.decir('Mantén pulsado'), 300); }
  }, { passive: true });

  // Mantener pulsado en la portada: todo máquina y la cámara se acerca
  const portada = document.getElementById('portada');
  const hold = { p: 0, mando: null, activo: false, completo: false, tween: null };
  function empezar() {
    hold.activo = true; hold.completo = false; hold.mando = sonido.subida();
    cursor.pulsando(true);
    hold.tween = gsap.to(hold, {
      p: 1, duration: 1.25, ease: 'none',
      onUpdate() { cursor.progreso(hold.p); hold.mando.avance(hold.p); st.mantener = hold.p; },
      onComplete() { hold.completo = true; hold.mando.soltar(true); cursor.decir('Así es por dentro'); fase = 'visto'; },
    });
  }
  function soltar() {
    if (!hold.activo) return;
    hold.activo = false; cursor.pulsando(false);
    hold.tween?.kill();
    if (!hold.completo) hold.mando?.soltar(false);
    gsap.to(hold, { p: 0, duration: 0.8, ease: 'power2.inOut', onUpdate() { cursor.progreso(hold.p); st.mantener = hold.p; } });
    if (fase === 'visto') setTimeout(() => cursor.decir(''), 500);
  }
  portada?.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('a, button') || html.classList.contains('en-umbral')) return;
    empezar();
  });
  window.addEventListener('pointerup', soltar);
  window.addEventListener('blur', soltar);
  portada?.addEventListener('contextmenu', (e) => { if (hold.activo) e.preventDefault(); });

  // Bucle
  let t = 0, previo = performance.now();
  const medida = { n: 0, suma: 0, hecha: calidad !== 'auto' };
  const colorArcilla = new THREE.Color();
  gsap.ticker.add(() => {
    const ahora = performance.now();
    const dt = Math.min(1 / 30, (ahora - previo) / 1000);
    previo = ahora;
    if (document.hidden) return;
    t += dt;

    const k = 1 - Math.exp(-4 * dt);
    raton.ix += ((reducido ? 0 : raton.x) - raton.ix) * k;
    raton.iy += ((reducido ? 0 : raton.y) - raton.iy) * k;

    const m = st.mantener;
    grupo.position.set(st.x, st.y + (reducido ? 0 : Math.sin(t * 0.8) * 0.05), 0);
    grupo.scale.setScalar(st.escala * (1 + m * 0.08));
    grupo.rotation.y = st.giro + (reducido ? 0 : t * 0.12) + m * Math.PI * 0.5;
    inclinacion.rotation.x = raton.iy * 0.5;
    inclinacion.rotation.y = raton.ix * 0.7;
    camara.position.z = 9 - m * 2.2;

    // Corte en coordenadas del mundo: el plano sigue al objeto. Al mantener, todo pasa al lado del alambre
    const corte = st.x + st.corte * st.escala - m * 12;
    corteCristal.constant = corte;
    corteAlambre.constant = -corte;
    alambre.opacity = Math.min(0.45, st.alambre * 0.28 + m * 0.3);
    aristas.opacity = Math.min(1, st.alambre * 0.9 + m);

    // Cristal → cerámica marrón en los capítulos claros
    const a = st.arcilla;
    cristal.transmission = nivel === 'baja' ? 0 : 1 - a;
    cristal.roughness = 0.06 + a * 0.5 + (nivel === 'baja' ? 0.1 : 0);
    cristal.metalness = nivel === 'baja' ? 0.85 * (1 - a) : 0;
    cristal.color.copy(colorArcilla.set('#ffffff').lerp(MARRON, a));
    cristal.iridescence = 0.35 * (1 - a);
    aristas.color.set(a > 0.5 ? '#B4627C' : '#F5CBD7');
    alambre.color.set(a > 0.5 ? '#34190A' : '#E7E2DA');

    fondo.copy(NOCHE).lerp(CREMA, st.fondo);
    resplandor.position.set(grupo.position.x, grupo.position.y, -2.6);
    resplandor.scale.setScalar(st.escala);
    resplandor.material.uniforms.uFondo.value.copy(fondo);
    resplandor.material.uniforms.uFuerza.value = 0.5 * (1 - a) * (1 - m * 0.7) * Math.min(1, st.escala / 0.4);
    renderer.setClearColor(fondo, 1);
    renderer.render(escena, camara);

    if (!medida.hecha) {
      medida.n++;
      if (medida.n > 20) medida.suma += dt;
      if (medida.n === 140) { medida.hecha = true; if (medida.suma / 120 > 0.03 && nivel === 'alta') { nivel = 'baja'; fijarDpr(); renderer.setSize(innerWidth, innerHeight, false); } }
    }
  });

  window.addEventListener('resize', () => {
    camara.aspect = innerWidth / innerHeight; camara.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  });

  html.classList.add('gl-activo');

  return {
    activarCursor() { cursor.decir('Mueve el ratón'); },
    // Al entrar: el objeto da una vuelta y se asienta
    entrar() {
      if (reducido) return;
      gsap.fromTo(st, { giro: -Math.PI * 1.5, escala: st.escala * 0.7 }, { giro: objetivo('portada').giro, escala: objetivo('portada').escala, duration: 2.2, ease: 'power3.out' });
    },
    calidad(v) { nivel = v === 'baja' ? 'baja' : 'alta'; medida.hecha = v !== 'auto'; fijarDpr(); renderer.setSize(innerWidth, innerHeight, false); },
  };
}
