// Simulación de fluido en GPU (Stable Fluids, como Lando Norris o Hatom) sobre OGL.
// La velocidad la escribe el ratón; el «tinte» es la máscara que destapa la capa máquina.
// Pide WebGL2 y poder pintar en texturas de media precisión; si no puede, lanza y la portada se queda sin fluido.
import { RenderTarget, Program, Mesh, Triangle } from 'ogl';

const V = /* glsl */ `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
uniform vec2 texelSize;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
void main () {
  vUv = uv;
  vL = uv - vec2(texelSize.x, 0.0); vR = uv + vec2(texelSize.x, 0.0);
  vT = uv + vec2(0.0, texelSize.y); vB = uv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const F = {
  splat: /* glsl */ `
precision highp float; varying vec2 vUv;
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point; p.x *= aspect;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
  advect: /* glsl */ `
precision highp float; varying vec2 vUv;
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = vec4(texture2D(uSource, coord).xyz / (1.0 + dissipation * dt), 1.0);
}`,
  divergence: /* glsl */ `
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: /* glsl */ `
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: /* glsl */ `
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy + force * dt;
  gl_FragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: /* glsl */ `
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: /* glsl */ `
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,
  clear: /* glsl */ `
precision highp float; varying vec2 vUv;
uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,
};

export class Fluido {
  constructor(renderer, { sim = 128, tinte = 512, iteraciones = 18, curl = 20, disipVel = 0.35, disipTinte = 0.9 } = {}) {
    if (!renderer.isWebgl2) throw new Error('sin WebGL2');
    const gl = (this.gl = renderer.gl);
    if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) throw new Error('sin color_buffer_float');
    this.renderer = renderer;
    Object.assign(this, { simBase: sim, tinteBase: tinte, iteraciones, curl, disipVel, disipTinte });

    const geo = new Triangle(gl);
    const prog = (frag, uniforms) => new Mesh(gl, {
      geometry: geo,
      program: new Program(gl, { vertex: V, fragment: frag, uniforms: { texelSize: { value: [0, 0] }, ...uniforms }, depthTest: false, depthWrite: false }),
    });
    const t = { value: null };
    this.p = {
      splat: prog(F.splat, { uTarget: { value: null }, aspect: { value: 1 }, color: { value: [0, 0, 0] }, point: { value: [0, 0] }, radius: { value: 0.002 } }),
      advect: prog(F.advect, { uVelocity: { value: null }, uSource: { value: null }, dt: { value: 0 }, dissipation: { value: 0 } }),
      divergence: prog(F.divergence, { uVelocity: { value: null } }),
      curl: prog(F.curl, { uVelocity: { value: null } }),
      vorticity: prog(F.vorticity, { uVelocity: { value: null }, uCurl: { value: null }, curl: { value: curl }, dt: { value: 0 } }),
      pressure: prog(F.pressure, { uPressure: { value: null }, uDivergence: { value: null } }),
      gradient: prog(F.gradient, { uPressure: { value: null }, uVelocity: { value: null } }),
      clear: prog(F.clear, { uTexture: t, value: { value: 0.8 } }),
    };
    this.splats = [];
    this.redimensionar(renderer.gl.canvas.width / Math.max(1, renderer.gl.canvas.height));
  }

  _rt(w, h) {
    const gl = this.gl;
    const rt = new RenderTarget(gl, {
      width: w, height: h, type: gl.HALF_FLOAT, format: gl.RGBA, internalFormat: gl.RGBA16F,
      minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE, depth: false,
    });
    this.renderer.bindFramebuffer(rt);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    if (ok) {
      // WebKit no siempre entrega la textura a cero: si trae basura (NaN), el fluido la arrastra y la portada sale negra
      const antes = gl.getParameter(gl.COLOR_CLEAR_VALUE);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clearColor(antes[0], antes[1], antes[2], antes[3]);
    }
    this.renderer.bindFramebuffer();
    if (!ok) throw new Error('FBO de media precisión incompleto');
    return rt;
  }

  _doble(w, h) {
    let a = this._rt(w, h), b = this._rt(w, h);
    return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; }, w, h };
  }

  _liberar() {
    const gl = this.gl;
    const fuera = (rt) => { if (!rt) return; gl.deleteFramebuffer(rt.buffer); rt.textures.forEach((t) => gl.deleteTexture(t.texture)); };
    [this.vel, this.tinteFbo, this.presion].forEach((d) => { if (d) { fuera(d.read); fuera(d.write); } });
    fuera(this.div); fuera(this.rot);
  }

  redimensionar(aspect) {
    this._liberar();
    this.aspect = aspect;
    const tam = (base) => (aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)]);
    const [sw, sh] = tam(this.simBase);
    const [dw, dh] = tam(this.tinteBase);
    this.vel = this._doble(sw, sh);
    this.tinteFbo = this._doble(dw, dh);
    this.presion = this._doble(sw, sh);
    this.div = this._rt(sw, sh);
    this.rot = this._rt(sw, sh);
    this.simTexel = [1 / sw, 1 / sh];
    this.tinteTexel = [1 / dw, 1 / dh];
  }

  get tinte() { return this.tinteFbo.read.texture; }
  get velocidad() { return this.vel.read.texture; }

  // x, y en 0..1 (y hacia arriba); dx, dy en unidades de velocidad; cantidad de tinte 0..1
  splat(x, y, dx, dy, cantidad, radio = 0.0022) { this.splats.push([x, y, dx, dy, cantidad, radio]); }

  _pasada(mesh, target, texel) {
    mesh.program.uniforms.texelSize.value = texel;
    this.renderer.render({ scene: mesh, target, clear: false, sort: false, frustumCull: false, update: false });
  }

  paso(dt) {
    const { p } = this;
    for (const [x, y, dx, dy, cant, radio] of this.splats) {
      const u = p.splat.program.uniforms;
      u.aspect.value = this.aspect; u.point.value = [x, y]; u.radius.value = radio;
      u.uTarget.value = this.vel.read.texture; u.color.value = [dx, dy, 0];
      this._pasada(p.splat, this.vel.write, this.simTexel); this.vel.swap();
      u.uTarget.value = this.tinteFbo.read.texture; u.color.value = [cant, cant, cant];
      this._pasada(p.splat, this.tinteFbo.write, this.tinteTexel); this.tinteFbo.swap();
    }
    this.splats.length = 0;

    p.curl.program.uniforms.uVelocity.value = this.vel.read.texture;
    this._pasada(p.curl, this.rot, this.simTexel);

    const vo = p.vorticity.program.uniforms;
    vo.uVelocity.value = this.vel.read.texture; vo.uCurl.value = this.rot.texture; vo.dt.value = dt; vo.curl.value = this.curl;
    this._pasada(p.vorticity, this.vel.write, this.simTexel); this.vel.swap();

    p.divergence.program.uniforms.uVelocity.value = this.vel.read.texture;
    this._pasada(p.divergence, this.div, this.simTexel);

    p.clear.program.uniforms.uTexture.value = this.presion.read.texture;
    this._pasada(p.clear, this.presion.write, this.simTexel); this.presion.swap();

    const pr = p.pressure.program.uniforms;
    pr.uDivergence.value = this.div.texture;
    for (let i = 0; i < this.iteraciones; i++) {
      pr.uPressure.value = this.presion.read.texture;
      this._pasada(p.pressure, this.presion.write, this.simTexel); this.presion.swap();
    }

    const gr = p.gradient.program.uniforms;
    gr.uPressure.value = this.presion.read.texture; gr.uVelocity.value = this.vel.read.texture;
    this._pasada(p.gradient, this.vel.write, this.simTexel); this.vel.swap();

    const ad = p.advect.program.uniforms;
    ad.dt.value = dt;
    ad.uVelocity.value = this.vel.read.texture; ad.uSource.value = this.vel.read.texture; ad.dissipation.value = this.disipVel;
    this._pasada(p.advect, this.vel.write, this.simTexel); this.vel.swap();

    ad.uVelocity.value = this.vel.read.texture; ad.uSource.value = this.tinteFbo.read.texture; ad.dissipation.value = this.disipTinte;
    // La advección del tinte usa el texel de la velocidad (la textura de origen se muestrea con filtro lineal)
    this._pasada(p.advect, this.tinteFbo.write, this.simTexel); this.tinteFbo.swap();
  }
}
