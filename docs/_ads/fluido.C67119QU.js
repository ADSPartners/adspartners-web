import{a as e,o as t,t as n}from"./Mesh.D48iXpEj.js";import{s as r}from"./capas.DtuhJ2sL.js";var i=class{constructor(e,{width:t=e.canvas.width,height:n=e.canvas.height,target:i=e.FRAMEBUFFER,color:a=1,depth:o=!0,stencil:s=!1,depthTexture:c=!1,wrapS:l=e.CLAMP_TO_EDGE,wrapT:u=e.CLAMP_TO_EDGE,wrapR:d=e.CLAMP_TO_EDGE,minFilter:f=e.LINEAR,magFilter:p=f,type:m=e.UNSIGNED_BYTE,format:h=e.RGBA,internalFormat:g=h,unpackAlignment:_,premultiplyAlpha:v}={}){this.gl=e,this.width=t,this.height=n,this.depth=o,this.stencil=s,this.buffer=this.gl.createFramebuffer(),this.target=i,this.gl.renderer.bindFramebuffer(this),this.textures=[];let y=[];for(let i=0;i<a;i++)this.textures.push(new r(e,{width:t,height:n,wrapS:l,wrapT:u,wrapR:d,minFilter:f,magFilter:p,type:m,format:h,internalFormat:g,unpackAlignment:_,premultiplyAlpha:v,flipY:!1,generateMipmaps:!1})),this.textures[i].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+i,this.gl.TEXTURE_2D,this.textures[i].texture,0),y.push(this.gl.COLOR_ATTACHMENT0+i);y.length>1&&this.gl.renderer.drawBuffers(y),this.texture=this.textures[0],c&&(this.gl.renderer.isWebgl2||this.gl.renderer.getExtension(`WEBGL_depth_texture`))?(this.depthTexture=new r(e,{width:t,height:n,minFilter:this.gl.NEAREST,magFilter:this.gl.NEAREST,format:this.stencil?this.gl.DEPTH_STENCIL:this.gl.DEPTH_COMPONENT,internalFormat:e.renderer.isWebgl2?this.stencil?this.gl.DEPTH24_STENCIL8:this.gl.DEPTH_COMPONENT16:this.gl.DEPTH_COMPONENT,type:this.stencil?this.gl.UNSIGNED_INT_24_8:this.gl.UNSIGNED_INT}),this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.stencil?this.gl.DEPTH_STENCIL_ATTACHMENT:this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(o&&!s&&(this.depthBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this.depthBuffer)),s&&!o&&(this.stencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.stencilBuffer)),o&&s&&(this.depthStencilBuffer=this.gl.createRenderbuffer(),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,t,n),this.gl.framebufferRenderbuffer(this.target,this.gl.DEPTH_STENCIL_ATTACHMENT,this.gl.RENDERBUFFER,this.depthStencilBuffer))),this.gl.renderer.bindFramebuffer({target:this.target})}setSize(e,t){if(this.width!==e||this.height!==t){this.width=e,this.height=t,this.gl.renderer.bindFramebuffer(this);for(let n=0;n<this.textures.length;n++)this.textures[n].width=e,this.textures[n].height=t,this.textures[n].needsUpdate=!0,this.textures[n].update(),this.gl.framebufferTexture2D(this.target,this.gl.COLOR_ATTACHMENT0+n,this.gl.TEXTURE_2D,this.textures[n].texture,0);this.depthTexture?(this.depthTexture.width=e,this.depthTexture.height=t,this.depthTexture.needsUpdate=!0,this.depthTexture.update(),this.gl.framebufferTexture2D(this.target,this.gl.DEPTH_ATTACHMENT,this.gl.TEXTURE_2D,this.depthTexture.texture,0)):(this.depthBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,e,t)),this.stencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.stencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.STENCIL_INDEX8,e,t)),this.depthStencilBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this.depthStencilBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_STENCIL,e,t))),this.gl.renderer.bindFramebuffer({target:this.target})}}},a=class extends t{constructor(e,{attributes:t={}}={}){Object.assign(t,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}}),super(e,t)}},o=`
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
}`,s={splat:`
precision highp float; varying vec2 vUv;
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point; p.x *= aspect;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,advect:`
precision highp float; varying vec2 vUv;
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = vec4(texture2D(uSource, coord).xyz / (1.0 + dissipation * dt), 1.0);
}`,divergence:`
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,curl:`
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,vorticity:`
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
}`,pressure:`
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`,gradient:`
precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  gl_FragColor = vec4(texture2D(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0);
}`,clear:`
precision highp float; varying vec2 vUv;
uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`};function c(e,t,n){let r=e.gl,a=new i(r,{width:t,height:n,type:r.HALF_FLOAT,format:r.RGBA,internalFormat:r.RGBA16F,minFilter:r.LINEAR,magFilter:r.LINEAR,wrapS:r.CLAMP_TO_EDGE,wrapT:r.CLAMP_TO_EDGE,depth:!1});e.bindFramebuffer(a);let o=r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE;if(o){let e=r.getParameter(r.COLOR_CLEAR_VALUE);r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.clearColor(e[0],e[1],e[2],e[3])}if(e.bindFramebuffer(),!o)throw Error(`FBO de media precisión incompleto`);return a}function l(e,t){t&&(e.deleteFramebuffer(t.buffer),t.textures.forEach(t=>e.deleteTexture(t.texture)))}var u=class{constructor(t,{sim:r=128,tinte:i=512,iteraciones:c=18,curl:l=20,disipVel:u=.35,disipTinte:d=.9}={}){if(!t.isWebgl2)throw Error(`sin WebGL2`);let f=this.gl=t.gl;if(!f.getExtension(`EXT_color_buffer_float`)&&!f.getExtension(`EXT_color_buffer_half_float`))throw Error(`sin color_buffer_float`);this.renderer=t,Object.assign(this,{simBase:r,tinteBase:i,iteraciones:c,curl:l,disipVel:u,disipTinte:d});let p=new a(f),m=(t,r)=>new n(f,{geometry:p,program:new e(f,{vertex:o,fragment:t,uniforms:{texelSize:{value:[0,0]},...r},depthTest:!1,depthWrite:!1})}),h={value:null};this.p={splat:m(s.splat,{uTarget:{value:null},aspect:{value:1},color:{value:[0,0,0]},point:{value:[0,0]},radius:{value:.002}}),advect:m(s.advect,{uVelocity:{value:null},uSource:{value:null},dt:{value:0},dissipation:{value:0}}),divergence:m(s.divergence,{uVelocity:{value:null}}),curl:m(s.curl,{uVelocity:{value:null}}),vorticity:m(s.vorticity,{uVelocity:{value:null},uCurl:{value:null},curl:{value:l},dt:{value:0}}),pressure:m(s.pressure,{uPressure:{value:null},uDivergence:{value:null}}),gradient:m(s.gradient,{uPressure:{value:null},uVelocity:{value:null}}),clear:m(s.clear,{uTexture:h,value:{value:.8}})},this.splats=[],this.redimensionar(t.gl.canvas.width/Math.max(1,t.gl.canvas.height))}_rt(e,t){return c(this.renderer,e,t)}_doble(e,t){let n=this._rt(e,t),r=this._rt(e,t);return{get read(){return n},get write(){return r},swap(){[n,r]=[r,n]},w:e,h:t}}_liberar(){let e=e=>l(this.gl,e);[this.vel,this.tinteFbo,this.presion].forEach(t=>{t&&(e(t.read),e(t.write))}),e(this.div),e(this.rot)}redimensionar(e){this._liberar(),this.aspect=e;let t=t=>e>=1?[Math.round(t*e),t]:[t,Math.round(t/e)],[n,r]=t(this.simBase),[i,a]=t(this.tinteBase);this.vel=this._doble(n,r),this.tinteFbo=this._doble(i,a),this.presion=this._doble(n,r),this.div=this._rt(n,r),this.rot=this._rt(n,r),this.simTexel=[1/n,1/r],this.tinteTexel=[1/i,1/a]}get tinte(){return this.tinteFbo.read.texture}get velocidad(){return this.vel.read.texture}splat(e,t,n,r,i,a=.0022){this.splats.push([e,t,n,r,i,a])}_pasada(e,t,n){e.program.uniforms.texelSize.value=n,this.renderer.render({scene:e,target:t,clear:!1,sort:!1,frustumCull:!1,update:!1})}paso(e){let{p:t}=this;for(let[e,n,r,i,a,o]of this.splats){let s=t.splat.program.uniforms;s.aspect.value=this.aspect,s.point.value=[e,n],s.radius.value=o,s.uTarget.value=this.vel.read.texture,s.color.value=[r,i,0],this._pasada(t.splat,this.vel.write,this.simTexel),this.vel.swap(),s.uTarget.value=this.tinteFbo.read.texture,s.color.value=[a,a,a],this._pasada(t.splat,this.tinteFbo.write,this.tinteTexel),this.tinteFbo.swap()}this.splats.length=0,t.curl.program.uniforms.uVelocity.value=this.vel.read.texture,this._pasada(t.curl,this.rot,this.simTexel);let n=t.vorticity.program.uniforms;n.uVelocity.value=this.vel.read.texture,n.uCurl.value=this.rot.texture,n.dt.value=e,n.curl.value=this.curl,this._pasada(t.vorticity,this.vel.write,this.simTexel),this.vel.swap(),t.divergence.program.uniforms.uVelocity.value=this.vel.read.texture,this._pasada(t.divergence,this.div,this.simTexel),t.clear.program.uniforms.uTexture.value=this.presion.read.texture,this._pasada(t.clear,this.presion.write,this.simTexel),this.presion.swap();let r=t.pressure.program.uniforms;r.uDivergence.value=this.div.texture;for(let e=0;e<this.iteraciones;e++)r.uPressure.value=this.presion.read.texture,this._pasada(t.pressure,this.presion.write,this.simTexel),this.presion.swap();let i=t.gradient.program.uniforms;i.uPressure.value=this.presion.read.texture,i.uVelocity.value=this.vel.read.texture,this._pasada(t.gradient,this.vel.write,this.simTexel),this.vel.swap();let a=t.advect.program.uniforms;a.dt.value=e,a.uVelocity.value=this.vel.read.texture,a.uSource.value=this.vel.read.texture,a.dissipation.value=this.disipVel,this._pasada(t.advect,this.vel.write,this.simTexel),this.vel.swap(),a.uVelocity.value=this.vel.read.texture,a.uSource.value=this.tinteFbo.read.texture,a.dissipation.value=this.disipTinte,this._pasada(t.advect,this.tinteFbo.write,this.simTexel),this.tinteFbo.swap()}};export{a as n,u as t};