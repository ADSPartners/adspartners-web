// Sonido de la web, generado en el navegador con Web Audio: no hay ni un fichero de audio.
// - Textura del pincel: un roce de papel (la marca) y un granulado de datos (la máquina) que crecen con la velocidad del ratón.
// - Efectos: entrar, tic, encaje del cubo, subida al mantener pulsado y suelta.
// - Dron de fondo, muy bajo.
// Solo suena si se eligió en el umbral o en Ajustes, y se calla al cambiar de pestaña.

let ctx = null;
let master = null;
let ruido = null;
let activo = false;
const textura = {};
const PENTA = [880, 987.77, 1174.66, 1318.51, 1567.98, 1760];

export const sonidoActivo = () => activo;

export async function encender() {
  if (!ctx) crear();
  if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) { /* sin gesto todavía */ } }
  activo = true;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.25);
  document.documentElement.classList.add('sonido-on');
}

export function apagar() {
  activo = false;
  document.documentElement.classList.remove('sonido-on');
  if (!ctx) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
}

function crear() {
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3.5;
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(comp).connect(ctx.destination);
  ruido = ruidoRosa(3);
  montarTextura();
  montarDron();
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (activo) ctx.resume();
  });
}

// Ruido rosa (filtro de Paul Kellet): más cálido que el blanco
function ruidoRosa(seg) {
  const n = Math.floor(ctx.sampleRate * seg);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

function fuenteRuido(loop = true) {
  const s = ctx.createBufferSource();
  s.buffer = ruido; s.loop = loop;
  if (loop) s.loopStart = Math.random();
  return s;
}

function env(g, t, ataque, pico, caida) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(pico, t + ataque);
  g.gain.exponentialRampToValueAtTime(0.0001, t + ataque + caida);
}

function montarTextura() {
  // Roce de papel: ruido rosa por un paso banda, panoramizado con la x del ratón
  const src = fuenteRuido();
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
  const g = ctx.createGain(); g.gain.value = 0;
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  src.connect(bp).connect(lp).connect(g);
  if (pan) { g.connect(pan).connect(master); } else { g.connect(master); }
  src.start();
  Object.assign(textura, { g, bp, pan, acumulado: 0 });
}

function montarDron() {
  const g = ctx.createGain(); g.gain.value = 0;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320; lp.Q.value = 0.6;
  [55, 82.41, 110.3].forEach((f, i) => {
    const o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine';
    o.frequency.value = f; o.detune.value = (i - 1) * 6;
    const og = ctx.createGain(); og.gain.value = i === 2 ? 0.25 : 0.5;
    o.connect(og).connect(lp); o.start();
  });
  const aire = fuenteRuido();
  const ag = ctx.createGain(); ag.gain.value = 0.18;
  aire.connect(ag).connect(lp); aire.start();
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
  const lfoG = ctx.createGain(); lfoG.gain.value = 140;
  lfo.connect(lfoG).connect(lp.frequency); lfo.start();
  lp.connect(g).connect(master);
  g.gain.setTargetAtTime(0.05, ctx.currentTime + 0.5, 2.5);
}

// Llamar en cada fotograma. velocidad 0..1, x 0..1, maquina 0..1 (cuánto «dentro» se está viendo)
export function pincel(velocidad, x, dt, maquina = 0) {
  if (!activo || !ctx || !textura.g) return;
  const t = ctx.currentTime;
  const v = Math.min(1, velocidad);
  textura.g.gain.setTargetAtTime(v * 0.42 * (1 - maquina * 0.5), t, v > 0.02 ? 0.05 : 0.25);
  textura.bp.frequency.setTargetAtTime(700 + v * 1400, t, 0.1);
  if (textura.pan) textura.pan.pan.setTargetAtTime((x - 0.5) * 1.4, t, 0.1);
  // Granulado de datos: más granos cuanto más rápido y cuanta más máquina
  textura.acumulado += v * (18 + maquina * 40) * dt;
  let n = 0;
  while (textura.acumulado >= 1 && n < 4) { textura.acumulado -= 1; grano(x, maquina); n++; }
}

function grano(x, maquina) {
  const t = ctx.currentTime + Math.random() * 0.01;
  const s = fuenteRuido(false);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2400 + Math.random() * 3600;
  const g = ctx.createGain();
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  env(g, t, 0.002, 0.05 + Math.random() * 0.07, 0.01);
  s.connect(hp).connect(g);
  if (pan) { pan.pan.value = (x - 0.5) * 1.6 + (Math.random() - 0.5) * 0.3; g.connect(pan).connect(master); } else g.connect(master);
  s.start(t, Math.random() * 2, 0.03);
  if (Math.random() < 0.05 + maquina * 0.08) bip(t, PENTA[(Math.random() * PENTA.length) | 0], 0.025);
}

function bip(t, f, vol, dur = 0.08, tipo = 'sine') {
  const o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f;
  const g = ctx.createGain(); env(g, t, 0.004, vol, dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
}

export function entrar() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime + 0.02;
  // Golpe grave
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(92, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.8);
  const g = ctx.createGain(); env(g, t, 0.006, 0.7, 1.3);
  o.connect(g).connect(master); o.start(t); o.stop(t + 1.5);
  // Soplo que barre
  const s = fuenteRuido();
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(260, t); bp.frequency.exponentialRampToValueAtTime(3200, t + 0.6); bp.frequency.exponentialRampToValueAtTime(700, t + 1.6);
  const sg = ctx.createGain(); sg.gain.setValueAtTime(0.0001, t); sg.gain.exponentialRampToValueAtTime(0.32, t + 0.45); sg.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
  s.connect(bp).connect(sg).connect(master); s.start(t); s.stop(t + 2);
  // Brillo: quinta abierta que se queda
  [440, 659.25, 880].forEach((f, i) => {
    const so = ctx.createOscillator(); so.type = 'sine'; so.frequency.value = f; so.detune.value = (Math.random() - 0.5) * 8;
    const sg2 = ctx.createGain();
    sg2.gain.setValueAtTime(0.0001, t + 0.1); sg2.gain.exponentialRampToValueAtTime(0.045 - i * 0.01, t + 0.6); sg2.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    so.connect(sg2).connect(master); so.start(t + 0.1); so.stop(t + 3.4);
  });
}

let ultimoTic = 0;
export function tic(volumen = 1) {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;
  if (t - ultimoTic < 0.06) return;
  ultimoTic = t;
  bip(t, [1760, 1975.5, 2349.3][(Math.random() * 3) | 0], 0.035 * volumen, 0.035);
  const s = fuenteRuido(false);
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4000;
  const g = ctx.createGain(); env(g, t, 0.001, 0.05 * volumen, 0.006);
  s.connect(hp).connect(g).connect(master); s.start(t, Math.random() * 2, 0.02);
}

export function encaje() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = 'triangle';
  o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(170, t + 0.08);
  const g = ctx.createGain(); env(g, t, 0.002, 0.13, 0.09);
  o.connect(g).connect(master); o.start(t); o.stop(t + 0.15);
  const s = fuenteRuido(false);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
  const sg = ctx.createGain(); env(sg, t, 0.001, 0.12, 0.03);
  s.connect(lp).connect(sg).connect(master); s.start(t, Math.random() * 2, 0.05);
}

// Mantener pulsado: devuelve un mando con avance(p 0..1) y soltar(completo)
export function subida() {
  if (!activo || !ctx) return { avance() {}, soltar() {} };
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 110;
  const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = 110; o2.detune.value = 9;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 7; lp.frequency.value = 180;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.25);
  const s = fuenteRuido();
  const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.Q.value = 0.8; hp.frequency.value = 600;
  const sg = ctx.createGain(); sg.gain.value = 0.0001;
  o.connect(lp); o2.connect(lp); lp.connect(g).connect(master);
  s.connect(hp).connect(sg).connect(master);
  o.start(t); o2.start(t); s.start(t);
  let parado = false;
  return {
    avance(p) {
      if (parado) return;
      const ahora = ctx.currentTime;
      lp.frequency.setTargetAtTime(180 + p * p * 2600, ahora, 0.05);
      o.frequency.setTargetAtTime(110 + p * 110, ahora, 0.05);
      o2.frequency.setTargetAtTime(110 + p * 110, ahora, 0.05);
      hp.frequency.setTargetAtTime(600 + p * 3000, ahora, 0.05);
      sg.gain.setTargetAtTime(0.0001 + p * 0.12, ahora, 0.05);
    },
    soltar(completo) {
      if (parado) return;
      parado = true;
      const ahora = ctx.currentTime;
      const caida = completo ? 0.9 : 0.25;
      [g, sg].forEach((n) => { n.gain.cancelScheduledValues(ahora); n.gain.setTargetAtTime(0.0001, ahora, caida / 4); });
      lp.frequency.setTargetAtTime(160, ahora, caida / 3);
      [o, o2, s].forEach((n) => n.stop(ahora + caida + 0.2));
      if (completo) {
        bip(ahora, 220, 0.09, 1.4, 'sine');
        bip(ahora + 0.02, 330, 0.05, 1.6, 'sine');
      }
    },
  };
}
