import{d as e}from"./index.astro_astro_type_script_index_0_lang.CnEbFh-c.js";import{d as t,f as n,i as r,m as i,p as a,r as o,s,t as c,u as l}from"./capas.C78MDiZs.js";var u=` .·:-=+10#@`,d={sim:64,tinte:320,iteraciones:10,curl:3,disipVel:1.4,disipTinte:2.2},f=1800,p=2.6,m=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,h=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tFoto; uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;
uniform vec2 uRes; uniform float uDpr; uniform float uCelda; uniform float uGlifosN; uniform float uIntro;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main () {
  vec2 uv = vUv;
  vec2 vel = texture(tVel, uv).xy;
  float tinte = texture(tTinte, uv).r;
  if (isnan(vel.x) || isnan(vel.y) || isinf(vel.x) || isinf(vel.y)) vel = vec2(0.0);
  if (isnan(tinte) || isinf(tinte)) tinte = 0.0;
  vel = clamp(vel, vec2(-2000.0), vec2(2000.0));

  // Máquina: rejilla y glifos; el fluido los empuja un poco
  vec2 px = uv * uRes - vel * 0.01 * uDpr;
  vec2 cel = floor(px / uCelda);
  vec2 den = fract(px / uCelda);
  float v = ruido(cel * 0.09) * 0.7 + ruido(cel * 0.021 + 7.0) * 0.3;
  float idx = floor(clamp(v, 0.0, 0.999) * uGlifosN);
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;
  vec2 q = uv * uRes;
  float paso = 64.0 * uDpr;
  float rej = max(1.0 - step(uDpr, mod(q.x, paso)), 1.0 - step(uDpr, mod(q.y, paso)));
  vec3 col = cNoche;
  col = mix(col, cCrema, rej * 0.045);
  col = mix(col, cCrema, glifo * (0.03 + v * 0.07));

  // Marca: la foto de la portada en mosaico, solo donde hay luz; cada celda, un cuadrado con su color
  float luz = smoothstep(0.06, 0.42, tinte);
  vec3 foto = texture(tFoto, (cel + 0.5) * uCelda / uRes).rgb;
  // La foto, más viva, y teñida de rosa según su luz: en lo oscuro, rosa; en lo claro, crema
  float lf = dot(foto, vec3(0.299, 0.587, 0.114));
  vec3 marca = mix(cRosa * 0.92, mix(foto * 1.35, cCrema, 0.35), smoothstep(0.15, 0.7, lf));
  float hueco = step(0.09, den.x) * step(0.09, den.y);
  col = mix(col, marca, luz * hueco * 0.92);
  col = mix(col, cNoche, glifo * luz * 0.22);
  float filo = smoothstep(0.015, 0.05, tinte) - smoothstep(0.06, 0.16, tinte);
  col = mix(col, cRosa, clamp(filo, 0.0, 1.0) * 0.35);

  color = vec4(mix(cNoche, col, uIntro), 1.0);
}`,g=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),_=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});async function v(){let v=document.documentElement,y=document.querySelector(`[data-fondo]`);if(!y)return null;let b;try{[b]=await Promise.all([_(`${window.ADS_BASE||`/`}assets/hero/Fondo-Hero_adsPartners.webp`),document.fonts.load(`400 12px "Geist Mono"`)])}catch{return null}let x;try{x=new a({canvas:y,webgl:2,dpr:1,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return null}if(!x.isWebgl2)return null;let S=x.gl,C=innerWidth,w=innerHeight;x.setSize(C,w);let T=e=>new t(S,{image:e,generateMipmaps:!1,minFilter:S.LINEAR,magFilter:S.LINEAR}),E=T(c(1,1)),D=()=>{let e=c(C/2,w/2);o(e,b),E.image=e,E.needsUpdate=!0};D();let O=null;try{O=new s(x,d)}catch{return null}let k={tFoto:{value:E},tTinte:{value:O.tinte},tVel:{value:O.velocidad},tGlifos:{value:T(r(u))},uRes:{value:[S.canvas.width,S.canvas.height]},uDpr:{value:x.dpr},uCelda:{value:12*x.dpr},uGlifosN:{value:11},uIntro:{value:0},cNoche:{value:g(`#120D0A`)},cCrema:{value:g(`#E7E2DA`)},cRosa:{value:g(`#F5CBD7`)}},A=new n(S,{geometry:new l(S),program:new i(S,{vertex:m,fragment:h,uniforms:k,depthTest:!1,depthWrite:!1})}),j={x:-1,y:-1,px:-1,py:-1,movido:!1,ultimo:-99},M=0;window.addEventListener(`pointermove`,e=>{e.pointerType!==`touch`&&(j.x<0&&(j.px=e.clientX,j.py=e.clientY),j.x=e.clientX,j.y=e.clientY,j.movido=!0,j.ultimo=M)},{passive:!0});let N=!0,P=document.getElementById(`portada`);P?new IntersectionObserver(([e])=>{N=e.intersectionRatio>.97},{threshold:[0,.5,.97,1]}).observe(P):N=!1;let F=()=>{k.tTinte.value=O.tinte,k.tVel.value=O.velocidad,x.render({scene:A,sort:!1,frustumCull:!1})},I=performance.now();e.ticker.add(()=>{let e=performance.now(),t=Math.min(1/30,(e-I)/1e3);if(I=e,M+=t,document.hidden||N||v.classList.contains(`en-umbral`))j.movido=!1;else if(!(M-j.ultimo>p)){if(j.movido){let e=j.x-j.px,t=j.y-j.py;j.px=j.x,j.py=j.y,j.movido=!1;let n=Math.hypot(e/C,t/w);n>0&&O.splat(j.x/C,1-j.y/w,e/C*f*(C/w),-t/w*f,Math.min(.8,.28+n*9),.0016)}O.paso(t),F()}}),e.to(k.uIntro,{value:1,duration:1.2,ease:`power2.out`,onUpdate:F}),v.classList.add(`fondo-gl`);let L=null;return window.addEventListener(`resize`,()=>{clearTimeout(L),L=setTimeout(()=>{C=innerWidth,w=innerHeight,x.setSize(C,w),k.uRes.value=[S.canvas.width,S.canvas.height],O.redimensionar(S.canvas.width/S.canvas.height),D(),F()},160)}),{pintar:F}}export{v as crearFondo};