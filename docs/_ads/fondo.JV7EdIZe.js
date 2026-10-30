import{O as e}from"./preload-helper.BAm-WlXS.js";import{a as t,i as n,t as r}from"./Mesh.D48iXpEj.js";import{c as i,i as a,l as o,s}from"./capas.BXwimVS-.js";var c=` .·:-=+10#@`,l={sim:64,tinte:256,iteraciones:10,curl:4,disipVel:1.2,disipTinte:2.4},u=2e3,d=2.6,f=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,p=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;
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
  float luz = smoothstep(0.02, 0.45, tinte);

  // Rejilla quieta; los glifos, empujados por el fluido
  vec2 q = uv * uRes;
  float paso = 64.0 * uDpr;
  float rej = max(1.0 - step(uDpr, mod(q.x, paso)), 1.0 - step(uDpr, mod(q.y, paso)));
  vec2 px = q - vel * 0.02 * uDpr;
  vec2 cel = floor(px / uCelda);
  vec2 den = fract(px / uCelda);
  float v = ruido(cel * 0.09) * 0.7 + ruido(cel * 0.021 + 7.0) * 0.3;
  // Por donde pasa el ratón, los glifos se excitan: suben a los más densos
  float idx = floor(clamp(v + luz * 0.55, 0.0, 0.999) * uGlifosN);
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;

  vec3 col = cNoche;
  col = mix(col, cCrema, rej * 0.045);
  col = mix(col, mix(cCrema, cRosa, luz * 0.7), glifo * (0.03 + v * 0.07 + luz * 0.26));
  col = mix(col, cRosa, luz * 0.045);

  color = vec4(mix(cNoche, col, uIntro), 1.0);
}`,m=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255);async function h(){let h=document.documentElement,g=document.querySelector(`[data-fondo]`);if(!g)return null;try{await document.fonts.load(`400 12px "Geist Mono"`)}catch{}let _;try{_=new n({canvas:g,webgl:2,dpr:1,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return null}if(!_.isWebgl2)return null;let v=_.gl,y=innerWidth,b=innerHeight;_.setSize(y,b);let x=e=>new o(v,{image:e,generateMipmaps:!1,minFilter:v.LINEAR,magFilter:v.LINEAR}),S=null;try{S=new s(_,l)}catch{return null}let C={tTinte:{value:S.tinte},tVel:{value:S.velocidad},tGlifos:{value:x(a(c))},uRes:{value:[v.canvas.width,v.canvas.height]},uDpr:{value:_.dpr},uCelda:{value:12*_.dpr},uGlifosN:{value:11},uIntro:{value:0},cNoche:{value:m(`#120D0A`)},cCrema:{value:m(`#E7E2DA`)},cRosa:{value:m(`#F5CBD7`)}},w=new r(v,{geometry:new i(v),program:new t(v,{vertex:f,fragment:p,uniforms:C,depthTest:!1,depthWrite:!1})}),T={x:-1,y:-1,px:-1,py:-1,movido:!1,ultimo:-99},E=0;window.addEventListener(`pointermove`,e=>{e.pointerType!==`touch`&&(T.x<0&&(T.px=e.clientX,T.py=e.clientY),T.x=e.clientX,T.y=e.clientY,T.movido=!0,T.ultimo=E)},{passive:!0});let D=!0,O=document.getElementById(`portada`);O?new IntersectionObserver(([e])=>{D=e.intersectionRatio>.97},{threshold:[0,.5,.97,1]}).observe(O):D=!1;let k=()=>{C.tTinte.value=S.tinte,C.tVel.value=S.velocidad,_.render({scene:w,sort:!1,frustumCull:!1})},A=performance.now();e.ticker.add(()=>{let e=performance.now(),t=Math.min(1/30,(e-A)/1e3);if(A=e,E+=t,document.hidden||D||h.classList.contains(`en-umbral`))T.movido=!1;else if(!(E-T.ultimo>d)){if(T.movido){let e=T.x-T.px,t=T.y-T.py;T.px=T.x,T.py=T.y,T.movido=!1;let n=Math.hypot(e/y,t/b);n>0&&S.splat(T.x/y,1-T.y/b,e/y*u*(y/b),-t/b*u,Math.min(.45,.12+n*6),.0014)}S.paso(t),k()}}),e.to(C.uIntro,{value:1,duration:1.2,ease:`power2.out`,onUpdate:k}),h.classList.add(`fondo-gl`);let j=null;return window.addEventListener(`resize`,()=>{clearTimeout(j),j=setTimeout(()=>{y=innerWidth,b=innerHeight,_.setSize(y,b),C.uRes.value=[v.canvas.width,v.canvas.height],S.redimensionar(v.canvas.width/v.canvas.height),k()},160)}),{pintar:k}}export{h as crearFondo};