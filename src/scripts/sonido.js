// Sonido de la web, generado en el navegador con Web Audio: no hay ni un fichero de audio.
// - Música: cuatro acordes que se suceden despacio (Fa maj9, La m7, Re m9, Si♭ maj7♯11), con colchón de
//   cuerdas suaves, un bajo y notas sueltas de piano que nunca se repiten igual, todo en una sala con eco.
// - El pincel suena a agua: un vaivén grave y burbujas que suben, más cuanto más rápido se mueve el ratón.
// - Las gotas de la portada caen al agua con un «plic» y su eco.
// - Efectos (entrar, gota, mantener y soltar) en la misma tonalidad que la música.
// Solo suena si se eligió en el umbral o en Ajustes, y se calla al cambiar de pestaña.

let ctx = null;
let master = null;
let busMusica = null;
let busEfectos = null;
let sala = null;
let eco = null;
let ruido = null;
let marron = null;
let activo = false;
const agua = {};

const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
// Acordes: [bajo, ...colchón] en MIDI. Cada uno dura COMPAS segundos.
const ACORDES = [
  [41, 57, 60, 64, 67],        // Fa maj9
  [45, 55, 60, 64, 71],        // La m7 (add 11 arriba)
  [38, 53, 57, 60, 64],        // Re m9
  [46, 62, 65, 69, 76],        // Si♭ maj7 ♯11
];
const PENTA = [65, 67, 69, 72, 74, 77, 79, 81, 84];   // Fa mayor pentatónica, octavas 4-5
const COMPAS = 9;

export const sonidoActivo = () => activo;

export async function encender() {
  if (!ctx) crear();
  if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) { /* sin gesto todavía */ } }
  activo = true;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setTargetAtTime(0.9, t, 0.3);
  document.documentElement.classList.add('sonido-on');
}

export function apagar() {
  activo = false;
  document.documentElement.classList.remove('sonido-on');
  if (!ctx) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
}

function crear() {
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 14; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.4;
  master = ctx.createGain(); master.gain.value = 0;
  master.connect(comp).connect(ctx.destination);

  ruido = buferRuido(4, 'blanco');
  marron = buferRuido(4, 'marron');

  // Sala: reverberación de ~4,5 s hecha con ruido que se apaga, filtrada para que sea cálida
  sala = ctx.createConvolver();
  sala.buffer = respuestaSala(4.6);
  const salaVuelta = ctx.createGain(); salaVuelta.gain.value = 0.9;
  const salaLp = ctx.createBiquadFilter(); salaLp.type = 'lowpass'; salaLp.frequency.value = 5200;
  sala.connect(salaLp).connect(salaVuelta).connect(master);

  // Eco en ping-pong para las notas sueltas
  eco = crearEco(0.42, 0.63, 0.32);
  eco.salida.connect(master);

  busMusica = ctx.createGain(); busMusica.gain.value = 0;
  busMusica.connect(master);
  const envioMusica = ctx.createGain(); envioMusica.gain.value = 0.55;
  busMusica.connect(envioMusica).connect(sala);

  busEfectos = ctx.createGain(); busEfectos.gain.value = 1;
  busEfectos.connect(master);
  const envioEfectos = ctx.createGain(); envioEfectos.gain.value = 0.35;
  busEfectos.connect(envioEfectos).connect(sala);

  montarAgua();
  arrancarMusica();
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (activo) ctx.resume();
  });
}

function buferRuido(seg, tipo) {
  const n = Math.floor(ctx.sampleRate * seg);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let ultimo = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (tipo === 'marron') { ultimo = (ultimo + 0.02 * w) / 1.02; d[i] = ultimo * 3.2; }
      else d[i] = w * 0.5;
    }
  }
  return buf;
}

function respuestaSala(seg) {
  const n = Math.floor(ctx.sampleRate * seg);
  const buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      lp += ((Math.random() * 2 - 1) - lp) * (0.55 - t * 0.4);   // cada vez más oscura
      d[i] = lp * Math.pow(1 - t, 2.6) * (i < 120 ? i / 120 : 1);
    }
  }
  return buf;
}

function crearEco(ti, td, realim) {
  const entrada = ctx.createGain();
  const salida = ctx.createGain(); salida.gain.value = 0.5;
  const di = ctx.createDelay(2), dd = ctx.createDelay(2);
  di.delayTime.value = ti; dd.delayTime.value = td;
  const fb = ctx.createGain(); fb.gain.value = realim;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
  const pi = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  const pd = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  if (pi.pan) { pi.pan.value = -0.7; pd.pan.value = 0.7; }
  entrada.connect(di); di.connect(lp); lp.connect(dd); dd.connect(fb); fb.connect(di);
  di.connect(pi).connect(salida); dd.connect(pd).connect(salida);
  salida.connect(sala);
  return { entrada, salida };
}

function panner(v) {
  if (!ctx.createStereoPanner) return ctx.createGain();
  const p = ctx.createStereoPanner(); p.pan.value = v; return p;
}

// --- Música -----------------------------------------------------------------
let siguienteAcorde = 0;
let indice = 0;

function arrancarMusica() {
  siguienteAcorde = ctx.currentTime + 0.3;
  busMusica.gain.setValueAtTime(0, ctx.currentTime);
  busMusica.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 6);
  setInterval(() => {
    if (!ctx || ctx.state !== 'running') return;
    // Si la pestaña estuvo parada, se retoma desde ahora (sin soltar de golpe los acordes atrasados)
    if (siguienteAcorde < ctx.currentTime - 0.5) siguienteAcorde = ctx.currentTime + 0.2;
    while (siguienteAcorde < ctx.currentTime + 1.5) {
      programarAcorde(ACORDES[indice % ACORDES.length], siguienteAcorde);
      siguienteAcorde += COMPAS;
      indice++;
    }
  }, 250);
}

function programarAcorde([bajo, ...notas], t) {
  const fin = t + COMPAS;
  // Colchón: dos osciladores suaves por nota, filtro que respira y entrada y salida largas
  notas.forEach((m, i) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.034, t + 3.2);
    g.gain.setValueAtTime(0.034, fin - 0.5);
    g.gain.linearRampToValueAtTime(0.0001, fin + 3.8);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.4;
    lp.frequency.setValueAtTime(500, t);
    lp.frequency.linearRampToValueAtTime(1100 + i * 140, t + COMPAS * 0.55);
    lp.frequency.linearRampToValueAtTime(650, fin + 3);
    const p = panner((i / (notas.length - 1) - 0.5) * 1.1);
    [['sawtooth', -6], ['triangle', 5]].forEach(([tipo, cents]) => {
      const o = ctx.createOscillator(); o.type = tipo; o.frequency.value = hz(m); o.detune.value = cents;
      o.connect(lp); o.start(t); o.stop(fin + 4);
    });
    lp.connect(g).connect(p).connect(busMusica);
  });
  // Bajo
  const ob = ctx.createOscillator(); ob.type = 'sine'; ob.frequency.value = hz(bajo);
  const gb = ctx.createGain();
  gb.gain.setValueAtTime(0.0001, t); gb.gain.linearRampToValueAtTime(0.11, t + 2.4);
  gb.gain.setValueAtTime(0.11, fin - 0.6); gb.gain.linearRampToValueAtTime(0.0001, fin + 2);
  ob.connect(gb).connect(busMusica); ob.start(t); ob.stop(fin + 2.2);
  // Notas sueltas de piano: de 3 a 6 por acorde, en una rejilla de medio segundo, moviéndose por grados
  const n = 3 + Math.floor(Math.random() * 4);
  let pos = Math.floor(Math.random() * PENTA.length);
  const huecos = new Set();
  for (let k = 0; k < n; k++) {
    let paso = 1 + Math.floor(Math.random() * (COMPAS * 2 - 3));
    while (huecos.has(paso)) paso = (paso + 1) % (COMPAS * 2 - 2) + 1;
    huecos.add(paso);
    pos = Math.max(0, Math.min(PENTA.length - 1, pos + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
    piano(hz(PENTA[pos]), t + paso * 0.5, 0.05 + Math.random() * 0.03);
  }
}

function piano(f, t, vol, destino = busMusica) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + 1.2);
  [[1, 1, 'sine'], [2, 0.32, 'triangle'], [3, 0.08, 'sine']].forEach(([mult, nivel, tipo]) => {
    const o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f * mult; o.detune.value = (Math.random() - 0.5) * 6;
    const og = ctx.createGain(); og.gain.value = nivel;
    o.connect(og).connect(lp); o.start(t); o.stop(t + 2.8);
  });
  const p = panner((Math.random() - 0.5) * 0.9);
  lp.connect(g).connect(p);
  p.connect(destino);
  p.connect(eco.entrada);
}

// --- Agua (el pincel) -------------------------------------------------------
function montarAgua() {
  // Vaivén: ruido marrón por un paso bajo que se mueve solo, como agua que se desplaza
  const src = ctx.createBufferSource(); src.buffer = marron; src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 0.9;
  const bp = ctx.createBiquadFilter(); bp.type = 'peaking'; bp.frequency.value = 300; bp.gain.value = 6; bp.Q.value = 1.4;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.23;
  const lfoG = ctx.createGain(); lfoG.gain.value = 140;
  lfo.connect(lfoG).connect(lp.frequency); lfo.start();
  const g = ctx.createGain(); g.gain.value = 0;
  const p = panner(0);
  src.connect(lp).connect(bp).connect(g).connect(p).connect(busEfectos);
  src.start();
  Object.assign(agua, { g, lp, p, acumulado: 0 });
}

// Llamar en cada fotograma. velocidad 0..1, x 0..1, maquina 0..1 (cuánto «dentro» se está viendo)
export function pincel(velocidad, x, dt, maquina = 0) {
  if (!activo || !ctx || !agua.g) return;
  const t = ctx.currentTime;
  const v = Math.min(1, velocidad);
  agua.g.gain.setTargetAtTime(Math.pow(v, 1.4) * 0.3, t, v > 0.03 ? 0.12 : 0.6);
  agua.lp.frequency.setTargetAtTime(320 + v * 520, t, 0.25);
  if (agua.p.pan) agua.p.pan.setTargetAtTime((x - 0.5) * 1.2, t, 0.2);
  // Burbujas: pocas y al azar, nunca un tren continuo
  agua.acumulado += v * (5 + maquina * 6) * dt * (0.5 + Math.random());
  if (agua.acumulado >= 1) { agua.acumulado = 0; burbuja(x, 0.6 + v * 0.4); }
}

function burbuja(x, fuerza = 1, t = ctx.currentTime + Math.random() * 0.02) {
  // Una burbuja suena como un tono que sube muy deprisa y se apaga
  const tam = Math.random();
  const f0 = 380 + tam * 1100;
  const dur = 0.05 + (1 - tam) * 0.07;
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f0 * (1.7 + Math.random() * 0.6), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.045 * fuerza, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const p = panner((x - 0.5) * 1.4 + (Math.random() - 0.5) * 0.4);
  o.connect(g).connect(p).connect(busEfectos);
  o.start(t); o.stop(t + dur + 0.02);
}

// --- Efectos -----------------------------------------------------------------
export function entrar() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.02;
  // Golpe grave y suave
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(87, t); o.frequency.exponentialRampToValueAtTime(43.6, t + 1.2);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2);
  o.connect(g).connect(busEfectos); o.start(t); o.stop(t + 2.1);
  // Ola: ruido que crece y rompe
  const s = ctx.createBufferSource(); s.buffer = marron;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(200, t); lp.frequency.exponentialRampToValueAtTime(1800, t + 0.7); lp.frequency.exponentialRampToValueAtTime(300, t + 2.4);
  const sg = ctx.createGain(); sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.5, t + 0.6); sg.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
  s.connect(lp).connect(sg).connect(busEfectos); s.start(t); s.stop(t + 2.8);
  // Arpegio del primer acorde
  [57, 60, 64, 67, 72].forEach((m, i) => piano(hz(m), t + 0.25 + i * 0.11, 0.06, busEfectos));
}

let ultimaGota = 0;
// Gota: una burbuja aguda (hover, líneas que entran, casillas)
export function tic(volumen = 1) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;
  if (t - ultimaGota < 0.07) return;
  ultimaGota = t;
  burbuja(0.5 + (Math.random() - 0.5) * 0.4, 0.8 * volumen, t);
}

// Gota que cae al agua (las ondas de la portada): un «plic» que sube, un golpe grave debajo y su eco
export function gota(x = 0.5, fuerza = 1) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.01;
  const f0 = 700 + Math.random() * 500;
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f0 * 2.2, t + 0.06);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.03 * fuerza, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  const ob = ctx.createOscillator(); ob.type = 'sine';
  ob.frequency.setValueAtTime(220, t);
  ob.frequency.exponentialRampToValueAtTime(110, t + 0.08);
  const gb = ctx.createGain();
  gb.gain.setValueAtTime(0.0001, t);
  gb.gain.exponentialRampToValueAtTime(0.04 * fuerza, t + 0.004);
  gb.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  const p = panner((x - 0.5) * 1.2);
  o.connect(g).connect(p);
  ob.connect(gb).connect(p);
  p.connect(busEfectos);
  p.connect(eco.entrada);
  o.start(t); o.stop(t + 0.16);
  ob.start(t); ob.stop(t + 0.14);
}

// Nota suelta afinada con la música (para ir marcando cosas, como las casillas)
export function nota(grado = 0, volumen = 1) {
  if (!activo || !ctx) return;
  piano(hz(PENTA[Math.max(0, Math.min(PENTA.length - 1, grado))]), ctx.currentTime + 0.01, 0.06 * volumen, busEfectos);
}

// Mantener pulsado: un acorde que se abre poco a poco; devuelve un mando con avance(p 0..1) y soltar(completo)
export function subida() {
  if (!activo || !ctx) return { avance() {}, soltar() {} };
  const t = ctx.currentTime;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.value = 300;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.3);
  const oscs = [65, 69, 72, 76].map((m, i) => {
    const o = ctx.createOscillator(); o.type = i % 2 ? 'triangle' : 'sawtooth'; o.frequency.value = hz(m); o.detune.value = (i - 1.5) * 4;
    o.connect(lp); o.start(t); return o;
  });
  const s = ctx.createBufferSource(); s.buffer = ruido; s.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9; bp.frequency.value = 500;
  const sg = ctx.createGain(); sg.gain.value = 0.0001;
  s.connect(bp).connect(sg).connect(busEfectos); s.start(t);
  lp.connect(g).connect(busEfectos);
  let parado = false;
  return {
    avance(p) {
      if (parado) return;
      const a = ctx.currentTime;
      lp.frequency.setTargetAtTime(300 + p * p * 3200, a, 0.06);
      oscs.forEach((o, i) => o.detune.setTargetAtTime((i - 1.5) * 4 + p * 1200 * (i === 3 ? 1 : 0), a, 0.08));
      bp.frequency.setTargetAtTime(500 + p * 2500, a, 0.06);
      sg.gain.setTargetAtTime(0.0001 + p * 0.05, a, 0.06);
    },
    soltar(completo) {
      if (parado) return;
      parado = true;
      const a = ctx.currentTime;
      const caida = completo ? 1.4 : 0.3;
      [g, sg].forEach((n) => { n.gain.cancelScheduledValues(a); n.gain.setTargetAtTime(0.0001, a, caida / 4); });
      [...oscs, s].forEach((n) => n.stop(a + caida + 0.3));
      if (completo) [72, 76, 79, 84].forEach((m, i) => piano(hz(m), a + i * 0.07, 0.07, busEfectos));
    },
  };
}

// --- Efectos de la home (segunda ronda) ------------------------------------------
let ultimaTecla = 0;
// Máquina de escribir: un chasquido de ruido filtrado más un golpe seco, cada uno un poco distinto (máx. 25 por segundo)
export function tecla(volumen = 1) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;
  if (t - ultimaTecla < 0.04) return;
  ultimaTecla = t;
  const s = ctx.createBufferSource(); s.buffer = ruido;
  const off = Math.random() * 3;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400 + Math.random() * 1800; bp.Q.value = 1.6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.11 * volumen, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
  const o = ctx.createOscillator(); o.type = 'triangle';
  o.frequency.setValueAtTime(190 + Math.random() * 60, t);
  o.frequency.exponentialRampToValueAtTime(70, t + 0.04);
  const go = ctx.createGain();
  go.gain.setValueAtTime(0.0001, t);
  go.gain.exponentialRampToValueAtTime(0.07 * volumen, t + 0.003);
  go.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  const p = panner((Math.random() - 0.5) * 0.3);
  s.connect(bp).connect(g).connect(p);
  o.connect(go).connect(p);
  p.connect(busEfectos);
  s.start(t, off, 0.05); o.start(t); o.stop(t + 0.06);
}

// Un logo que pasa por delante de la cámara: un soplo que sube y baja, del lado por el que pasa
export function pasa(x = 0.5) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.005;
  const s = ctx.createBufferSource(); s.buffer = ruido;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.2;
  bp.frequency.setValueAtTime(380, t); bp.frequency.exponentialRampToValueAtTime(1900, t + 0.22); bp.frequency.exponentialRampToValueAtTime(500, t + 0.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.18); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  const p = panner((x - 0.5) * 1.6);
  s.connect(bp).connect(g).connect(p).connect(busEfectos);
  s.start(t, Math.random() * 3, 0.6);
  piano(hz(PENTA[Math.floor(Math.random() * 5) + 2]), t + 0.12, 0.022, busEfectos);
}

// Un proyecto que se acerca (abrir) o vuelve a su sitio (cerrar)
export function abrir() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.01;
  const s = ctx.createBufferSource(); s.buffer = marron;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(220, t); lp.frequency.exponentialRampToValueAtTime(2400, t + 0.45);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  s.connect(lp).connect(g).connect(busEfectos); s.start(t); s.stop(t + 1);
  [60, 64, 67, 72].forEach((m, i) => piano(hz(m), t + 0.32 + i * 0.06, 0.05, busEfectos));
}
export function cerrar() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.01;
  const s = ctx.createBufferSource(); s.buffer = marron;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(1800, t); lp.frequency.exponentialRampToValueAtTime(200, t + 0.5);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  s.connect(lp).connect(g).connect(busEfectos); s.start(t); s.stop(t + 0.7);
  piano(hz(67), t + 0.05, 0.04, busEfectos);
}

// Enviado: un sello grave y un acorde que se abre
export function ok() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.01;
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(65, t + 0.25);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  o.connect(g).connect(busEfectos); o.start(t); o.stop(t + 0.55);
  [65, 69, 72, 76, 79].forEach((m, i) => piano(hz(m), t + 0.18 + i * 0.08, 0.06, busEfectos));
}

// El muro de FRESA: cada empujón, un golpe sordo que sube con la tensión; al romperse, un soplo que baja y un acorde
export function empuje(nivel = 0) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.005;
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(70 + nivel * 60, t); o.frequency.exponentialRampToValueAtTime(42 + nivel * 30, t + 0.22);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.connect(g).connect(busEfectos); o.start(t); o.stop(t + 0.4);
  const s = ctx.createBufferSource(); s.buffer = marron;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260 + nivel * 500;
  const sg = ctx.createGain(); sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.18, t + 0.02); sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  s.connect(lp).connect(sg).connect(busEfectos); s.start(t, Math.random() * 2, 0.35);
}
export function rompe() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.01;
  const s = ctx.createBufferSource(); s.buffer = ruido;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(2600, t); bp.frequency.exponentialRampToValueAtTime(240, t + 1.1);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
  s.connect(bp).connect(g).connect(busEfectos); s.start(t, Math.random() * 2, 1.4);
  [60, 67, 72, 76].forEach((m, i) => piano(hz(m), t + 0.5 + i * 0.09, 0.05, busEfectos));
}
