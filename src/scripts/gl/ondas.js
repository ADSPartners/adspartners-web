// Ondas de agua en GPU (la ecuación de onda del agua de Evan Wallace) sobre OGL.
// Cada gota levanta un bulto; la altura se propaga en anillos que se cruzan, rebotan en los bordes y se apagan.
// En la textura, r es la altura y g la velocidad. La portada convierte la altura en máscara, refracción y brillo.
// Los pasos van a ritmo fijo por segundo, así que las ondas corren igual a 60 que a 120 Hz.
import { Program, Mesh, Triangle } from 'ogl';
import { objetivo, soltar } from './fluido.js';

const V = /* glsl */ `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const F = {
  gota: /* glsl */ `
precision highp float; varying vec2 vUv;
uniform sampler2D uOndas; uniform vec2 punto; uniform float radio; uniform float fuerza; uniform float aspect;
void main () {
  vec4 o = texture2D(uOndas, vUv);
  vec2 d = vUv - punto; d.x *= aspect;
  // Un pico con dos surcos alrededor: al soltarse sale un tren de anillos, no uno solo
  float k = length(d) / radio;
  o.r += cos(k * 3.14159265 * 2.5) * (1.0 - smoothstep(0.0, 1.0, k)) * fuerza;
  gl_FragColor = o;
}`,
  paso: /* glsl */ `
precision highp float; varying vec2 vUv;
uniform sampler2D uOndas; uniform vec2 texel; uniform float amortigua;
void main () {
  vec4 o = texture2D(uOndas, vUv);
  float media = (texture2D(uOndas, vUv - vec2(texel.x, 0.0)).r + texture2D(uOndas, vUv + vec2(texel.x, 0.0)).r
    + texture2D(uOndas, vUv - vec2(0.0, texel.y)).r + texture2D(uOndas, vUv + vec2(0.0, texel.y)).r) * 0.25;
  o.g += (media - o.r) * 2.0;
  o.g *= amortigua;
  o.r += o.g;
  // Los bordes se tragan las ondas en vez de devolverlas (rebotadas se suman y hacen manchas)
  float borde = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float absorbe = mix(0.9, 1.0, smoothstep(0.0, 0.06, borde));
  o.rg *= absorbe;
  gl_FragColor = o;
}`,
};

export class Ondas {
  // lado: celdas en el lado corto; pasosSeg se escala con él para que el agua vaya igual de deprisa en pantalla
  constructor(renderer, { lado = 200, amortigua = 0.993 } = {}) {
    if (!renderer.isWebgl2) throw new Error('sin WebGL2');
    const gl = (this.gl = renderer.gl);
    if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) throw new Error('sin color_buffer_float');
    this.renderer = renderer;
    this.lado = lado;
    this.pasosSeg = 95 * (lado / 200);
    this.resto = 0;
    this.gotas = [];
    const geo = new Triangle(gl);
    const prog = (frag, uniforms) => new Mesh(gl, {
      geometry: geo,
      program: new Program(gl, { vertex: V, fragment: frag, uniforms, depthTest: false, depthWrite: false }),
    });
    this.p = {
      gota: prog(F.gota, { uOndas: { value: null }, punto: { value: [0, 0] }, radio: { value: 0.03 }, fuerza: { value: 1 }, aspect: { value: 1 } }),
      paso: prog(F.paso, { uOndas: { value: null }, texel: { value: [0, 0] }, amortigua: { value: amortigua } }),
    };
    this.redimensionar(gl.canvas.width / Math.max(1, gl.canvas.height));
  }

  _liberar() { if (this.agua) { soltar(this.gl, this.agua.read); soltar(this.gl, this.agua.write); } }

  redimensionar(aspect) {
    this._liberar();
    this.aspect = aspect;
    const [w, h] = aspect >= 1 ? [Math.round(this.lado * aspect), this.lado] : [this.lado, Math.round(this.lado / aspect)];
    let a = objetivo(this.renderer, w, h), b = objetivo(this.renderer, w, h);
    this.agua = { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
    this.texel = [1 / w, 1 / h];
  }

  get altura() { return this.agua.read.texture; }

  // x, y en 0..1 (y hacia arriba); radio en altos de pantalla
  gota(x, y, fuerza = 1, radio = 0.03) { this.gotas.push([x, y, fuerza, radio]); }

  _pasada(mesh) {
    this.renderer.render({ scene: mesh, target: this.agua.write, clear: false, sort: false, frustumCull: false, update: false });
    this.agua.swap();
  }

  paso(dt) {
    const g = this.p.gota.program.uniforms;
    for (const [x, y, fuerza, radio] of this.gotas) {
      g.uOndas.value = this.agua.read.texture; g.punto.value = [x, y]; g.radio.value = radio; g.fuerza.value = fuerza; g.aspect.value = this.aspect;
      this._pasada(this.p.gota);
    }
    this.gotas.length = 0;
    this.resto = Math.min(this.resto + dt * this.pasosSeg, 4);
    const pa = this.p.paso.program.uniforms;
    pa.texel.value = this.texel;
    while (this.resto >= 1) {
      pa.uOndas.value = this.agua.read.texture;
      this._pasada(this.p.paso);
      this.resto -= 1;
    }
  }
}
