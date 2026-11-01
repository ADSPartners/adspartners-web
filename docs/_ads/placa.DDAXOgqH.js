import{O as e}from"./preload-helper.Dylh4JsC.js";import{t}from"./index.astro_astro_type_script_index_0_lang.Y3OfRDEd.js";import{a as n,i as r,n as i,o as a,s as o,t as s}from"./Mesh.D48iXpEj.js";import{t as c}from"./Camera.DbFdqk_T.js";import{s as l,t as u}from"./capas.DtuhJ2sL.js";var d=class e extends a{constructor(t,{width:n=1,height:r=1,widthSegments:i=1,heightSegments:a=1,attributes:o={}}={}){let s=i,c=a,l=(s+1)*(c+1),u=s*c*6,d=new Float32Array(l*3),f=new Float32Array(l*3),p=new Float32Array(l*2),m=u>65536?new Uint32Array(u):new Uint16Array(u);e.buildPlane(d,f,p,m,n,r,0,s,c),Object.assign(o,{position:{size:3,data:d},normal:{size:3,data:f},uv:{size:2,data:p},index:{data:m}}),super(t,o)}static buildPlane(e,t,n,r,i,a,o,s,c,l=0,u=1,d=2,f=1,p=-1,m=0,h=0){let g=m,_=i/s,v=a/c;for(let y=0;y<=c;y++){let b=y*v-a/2;for(let a=0;a<=s;a++,m++){let v=a*_-i/2;if(e[m*3+l]=v*f,e[m*3+u]=b*p,e[m*3+d]=o/2,t[m*3+l]=0,t[m*3+u]=0,t[m*3+d]=o>=0?1:-1,n[m*2]=a/s,n[m*2+1]=1-y/c,y===c||a===s)continue;let x=g+a+y*(s+1),S=g+a+(y+1)*(s+1),C=g+a+(y+1)*(s+1)+1,w=g+a+y*(s+1)+1;r[h*6]=x,r[h*6+1]=S,r[h*6+2]=w,r[h*6+3]=S,r[h*6+4]=C,r[h*6+5]=w,h++}}}},f=class extends a{constructor(e,{width:t=1,height:n=1,depth:r=1,widthSegments:i=1,heightSegments:a=1,depthSegments:o=1,attributes:s={}}={}){let c=i,l=a,u=o,f=(c+1)*(l+1)*2+(c+1)*(u+1)*2+(l+1)*(u+1)*2,p=(c*l*2+c*u*2+l*u*2)*6,m=new Float32Array(f*3),h=new Float32Array(f*3),g=new Float32Array(f*2),_=f>65536?new Uint32Array(p):new Uint16Array(p),v=0,y=0;d.buildPlane(m,h,g,_,r,n,t,u,l,2,1,0,-1,-1,v,y),v+=(u+1)*(l+1),y+=u*l,d.buildPlane(m,h,g,_,r,n,-t,u,l,2,1,0,1,-1,v,y),v+=(u+1)*(l+1),y+=u*l,d.buildPlane(m,h,g,_,t,r,n,u,c,0,2,1,1,1,v,y),v+=(c+1)*(u+1),y+=c*u,d.buildPlane(m,h,g,_,t,r,-n,u,c,0,2,1,1,-1,v,y),v+=(c+1)*(u+1),y+=c*u,d.buildPlane(m,h,g,_,t,n,-r,c,l,0,1,2,-1,-1,v,y),v+=(c+1)*(l+1),y+=c*l,d.buildPlane(m,h,g,_,t,n,r,c,l,0,1,2,1,-1,v,y),Object.assign(s,{position:{size:3,data:m},normal:{size:3,data:h},uv:{size:2,data:g},index:{data:_}}),super(e,s)}},p=class extends a{constructor(e,{radiusTop:t=.5,radiusBottom:n=.5,height:r=1,radialSegments:i=8,heightSegments:a=1,openEnded:s=!1,thetaStart:c=0,thetaLength:l=Math.PI*2,attributes:u={}}={}){let d=i,f=a,p=c,m=l,h=s?0:n&&t?2:1,g=(d+1)*(f+1+h)+h,_=d*f*6+h*d*3,v=new Float32Array(g*3),y=new Float32Array(g*3),b=new Float32Array(g*2),x=g>65536?new Uint32Array(_):new Uint16Array(_),S=0,C=0,w=[];ee(),s||(t&&T(!0),n&&T(!1));function ee(){let e,i,a=new o,s=(n-t)/r;for(i=0;i<=f;i++){let o=[],c=i/f,l=c*(n-t)+t;for(e=0;e<=d;e++){let t=e/d,n=t*m+p,i=Math.sin(n),u=Math.cos(n);v.set([l*i,(.5-c)*r,l*u],S*3),a.set(i,s,u).normalize(),y.set([a.x,a.y,a.z],S*3),b.set([t,1-c],S*2),o.push(S++)}w.push(o)}for(e=0;e<d;e++)for(i=0;i<f;i++){let t=w[i][e],n=w[i+1][e],r=w[i+1][e+1],a=w[i][e+1];x.set([t,n,a,n,r,a],C*3),C+=2}}function T(e){let i,a=e===!0?t:n,o=e===!0?1:-1,s=S;for(v.set([0,.5*r*o,0],S*3),y.set([0,o,0],S*3),b.set([.5,.5],S*2),S++,i=0;i<=d;i++){let e=i/d*m+p,t=Math.cos(e),n=Math.sin(e);v.set([a*n,.5*r*o,a*t],S*3),y.set([0,o,0],S*3),b.set([t*.5+.5,n*.5*o+.5],S*2),S++}for(i=0;i<d;i++){let t=s+i+1;e?x.set([t,t+1,s],C*3):x.set([t+1,t,s],C*3),C++}}Object.assign(u,{position:{size:3,data:v},normal:{size:3,data:y},uv:{size:2,data:b},index:{data:x}}),super(e,u)}},m=`// La portada en WebGL: capa de marca (foto en clave de noche + «adsPartners» en Garamond) y, bajo el pincel,\r
// la capa máquina (curvas de nivel y tramado mono sacados de la luz de la foto, rejilla, anatomía del título y código).\r
// El mismo canvas pinta antes el final de la carga (modo umbral), al revés: todo es máquina, con «ads» enorme en el\r
// centro, y la marca solo aparece donde hay luz (el ratón es una linterna). Al entrar, la marca inunda desde el clic,\r
// «ads» se funde en «adsPartners» y la máscara vuelve a la de la portada.\r
// - Ratón: escribe velocidad en el fluido; el tinte es la máscara.\r
// - Quieto 2,5 s (o en el móvil sin tocar), el inspector: cajas que se abren sobre una letra, un texto o un trozo de\r
//   foto, enseñan la máquina dentro y dicen lo que es (medido del DOM y de la foto).\r
// - Mantener pulsado: un anillo se abre desde el puntero y enseña la máquina entera.\r
// - Al bajar, la máquina sube desde abajo celda a celda y se funde con el fondo de la página (sin corte).\r
// - Movimiento reducido o sin fluido: la máscara es un círculo pegado al puntero, sin estela.\r
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';\r
import { gsap } from 'gsap';\r
import { Fluido } from './fluido.js';\r
import { lienzo, pintarFoto, medirTitulo, pintarTitulo, pintarMaquina, pintarGlifos } from './capas.js';\r
import * as sonido from '../sonido.js';\r
import { ajustarTitulo } from '../titulo.js';\r
\r
const NIVELES = {\r
  alta: { sim: 128, tinte: 640, iteraciones: 18, dpr: 1.5, curl: 6, disipVel: 0.8, disipTinte: 1.1 },\r
  baja: { sim: 64, tinte: 320, iteraciones: 8, dpr: 1, curl: 6, disipVel: 0.8, disipTinte: 1.1 },\r
};\r
const GLIFOS = ' .·:-=+10#@';\r
const FUERZA = 2600;\r
\r
const VERT = /* glsl */ \`#version 300 es\r
in vec2 position; in vec2 uv; out vec2 vUv;\r
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }\`;\r
\r
const FRAG = /* glsl */ \`#version 300 es\r
precision highp float;\r
in vec2 vUv; out vec4 color;\r
uniform sampler2D tFoto; uniform sampler2D tTitulo; uniform sampler2D tMaquina; uniform sampler2D tTituloU; uniform sampler2D tMaquinaU;\r
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;\r
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uCelda; uniform float uGlifosN;\r
uniform float uRevelado; uniform vec2 uHold; uniform vec2 uPuntero; uniform float uCirculo;\r
uniform float uUsaFluido; uniform float uIntro; uniform float uLuz;\r
uniform vec4 uCaja0; uniform vec4 uCaja1; uniform vec2 uCajaA; uniform float uSalida;\r
uniform float uUmbral; uniform float uLinterna; uniform float uHalo; uniform float uInunda; uniform vec2 uFoco;\r
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;\r
\r
float luma (vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }\r
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }\r
float ruido (vec2 p) {\r
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);\r
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);\r
}\r
// Una caja del inspector (en píxeles del canvas): se abre desde su línea del medio, como una persiana\r
float caja (vec2 px, vec4 c, float a, out float filo) {\r
  vec2 d = abs(px - (c.xy + c.zw) * 0.5) - (c.zw - c.xy) * 0.5 * vec2(1.0, a);\r
  float fuera = max(d.x, d.y);\r
  float dentro = (1.0 - step(0.0, fuera)) * step(0.02, a);\r
  filo = dentro * (1.0 - step(1.5 * uDpr, -fuera));\r
  return dentro;\r
}\r
\r
void main () {\r
  vec2 uv = vUv;\r
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);\r
  vec2 vel = uUsaFluido > 0.5 ? texture(tVel, uv).xy : vec2(0.0);\r
  float tinte = uUsaFluido > 0.5 ? texture(tTinte, uv).r : 0.0;\r
  // Si el fluido trae valores no numéricos (algún navegador), mejor sin pincel que la pantalla en negro\r
  if (isnan(vel.x) || isnan(vel.y) || isinf(vel.x) || isinf(vel.y)) vel = vec2(0.0);\r
  if (isnan(tinte) || isinf(tinte)) tinte = 0.0;\r
  vel = clamp(vel, vec2(-2000.0), vec2(2000.0));\r
  vec2 px = uv * uRes;\r
  float portada = 1.0 - uUmbral;\r
\r
  // Máscara de la portada: tinte del fluido, círculo (sin fluido), anillo de «mantener» y las cajas del inspector\r
  float circ = uCirculo * (1.0 - smoothstep(0.1, 0.125, length((uv - uPuntero) * asp)));\r
  float n = ruido(uv * 7.0 + uTime * 0.25) * 0.06;\r
  float r = uRevelado * 1.9;\r
  float anillo = step(0.001, uRevelado) * (1.0 - smoothstep(r - 0.015, r, length((uv - uHold) * asp) + n * uRevelado));\r
  float filo0, filo1;\r
  float cajas = max(caja(px, uCaja0, uCajaA.x, filo0), caja(px, uCaja1, uCajaA.y, filo1));\r
  float m = max(max(tinte, circ), anillo);\r
  float mascaraP = max(smoothstep(0.24, 0.3, m), cajas);\r
  float borde = (smoothstep(0.17, 0.23, m) - smoothstep(0.28, 0.34, m)) * portada;\r
  // Al bajar, la máquina sube desde abajo celda a celda (con el grano del tramado), con un frente rosa\r
  vec2 celS = floor(px / (uCelda * 2.0));\r
  float yS = uv.y + hash(celS) * 0.09;\r
  float frenteS = uSalida * 1.4 - 0.1;   // en reposo (uSalida = 0) no hay ninguna celda\r
  float salida = portada * step(yS, frenteS);\r
  float filoS = portada * step(yS, frenteS + 0.014) * (1.0 - salida) * step(0.001, uSalida);\r
  mascaraP = max(mascaraP, salida);\r
\r
  // Máscara del umbral, al revés: la marca solo donde hay luz (la estela del fluido y un halo en el puntero).\r
  // Al entrar, la marca inunda en círculo desde el clic, con un frente rosa\r
  float halo = uHalo * (1.0 - smoothstep(0.0, 0.21, length((uv - uPuntero) * asp) + n * 0.5));\r
  float luz = max(tinte * 1.3, halo) * uLinterna;\r
  float dF = length((uv - uFoco) * asp) + n * 0.6;\r
  float rF = uInunda * 2.3;\r
  float inunda = step(0.001, uInunda) * (1.0 - smoothstep(rF - 0.03, rF, dF));\r
  float mascaraU = 1.0 - max(smoothstep(0.08, 0.62, luz), inunda);\r
  float frente = step(0.001, uInunda) * step(uInunda, 0.999) * (1.0 - smoothstep(0.0, 0.005, abs(dF - rF + 0.015)));\r
\r
  float mascara = mix(mascaraP, mascaraU, uUmbral);\r
\r
  // MARCA: la foto en clave de noche, viñeta y el título; el fluido la desplaza un poco\r
  vec2 uvM = uv - vel * 0.00008;\r
  vec3 foto = texture(tFoto, uvM).rgb;\r
  vec3 marca = pow(foto, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);\r
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));\r
  marca *= mix(0.5, 1.0, vig);\r
  vec4 tit = mix(texture(tTitulo, uvM), texture(tTituloU, uvM), uUmbral);\r
  marca = mix(marca, cCrema, tit.a);\r
  // En el umbral, la luz calienta lo que toca\r
  marca *= 1.0 + luz * 0.22 * uUmbral;\r
\r
  // MÁQUINA: curvas de nivel y tramado mono de la luz de la foto, rejilla y la capa dibujada.\r
  // Abajo se apaga hasta parecerse al fondo de la página, que sigue debajo\r
  vec2 uvQ = uv;\r
  float abajo = smoothstep(0.24, 0.0, uv.y) * portada;\r
  vec3 f = texture(tFoto, uvQ).rgb; float l = luma(f);\r
  float b = l * 16.0; float fw = fwidth(b);\r
  float iso = (1.0 - smoothstep(0.0, fw * 1.4, abs(fract(b + 0.5) - 0.5))) * (1.0 - abajo * 0.85);\r
  vec2 cel = floor(px / uCelda);\r
  float lc = luma(texture(tFoto, (cel + 0.5) * uCelda / uRes).rgb) * (1.0 - abajo * 0.7);\r
  float idx = floor(clamp(lc, 0.0, 0.999) * uGlifosN);\r
  vec2 den = fract(px / uCelda);\r
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;\r
  float paso = 64.0 * uDpr;\r
  float rej = max(1.0 - step(uDpr, mod(px.x, paso)), 1.0 - step(uDpr, mod(px.y, paso)));\r
  vec3 maq = cNoche;\r
  maq = mix(maq, cCrema, rej * 0.06);\r
  maq = mix(maq, cCrema, glifo * (0.08 + lc * 0.34) * uLuz * (1.0 + uUmbral * 0.4));\r
  maq = mix(maq, cCrema, iso * (0.2 + l * 0.38) * uLuz);\r
  vec4 cap = mix(texture(tMaquina, uvQ), texture(tMaquinaU, uvQ), uUmbral);\r
  maq = mix(maq, cap.rgb, cap.a);\r
\r
  vec3 col = mix(marca, maq, mascara);\r
  col = mix(col, cRosa, clamp(borde, 0.0, 1.0) * 0.4);\r
  col = mix(col, cRosa, max(filo0, filo1) * portada * 0.95);\r
  col = mix(col, cRosa, filoS * 0.55);\r
  col = mix(col, cRosa, frente * 0.9);\r
  // El último borde, en noche, solo al bajar (es donde empieza el fondo de la página); quieta, la portada no se toca\r
  col = mix(col, cNoche, smoothstep(0.035, 0.0, uv.y) * portada * min(1.0, uSalida * 10.0));\r
  col += (hash(px + fract(uTime * 7.0) * 91.0) - 0.5) * 0.04;\r
  color = vec4(col * uIntro, 1.0);\r
}\`;\r
\r
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);\r
const cargarImagen = (src) => new Promise((ok, mal) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = mal; i.src = src; });\r
\r
export async function crearPortada({ cursor, reducido }) {\r
  const html = document.documentElement;\r
  const sec = document.getElementById('portada');\r
  const canvas = sec.querySelector('[data-gl]');\r
  const h1 = sec.querySelector('[data-titulo]');\r
  const adsU = document.querySelector('[data-umbral-ads]');\r
  const tactil = !matchMedia('(hover: hover) and (pointer: fine)').matches;\r
  const nada = { entrar() {}, listo: Promise.resolve(false) };\r
  const esMovil = () => innerWidth <= 760;\r
\r
  ajustarTitulo(h1, esMovil());\r
\r
  let img;\r
  try {\r
    [img] = await Promise.all([\r
      cargarImagen(\`\${window.ADS_BASE || '/'}assets/hero/Fondo-Hero_adsPartners.webp\`),\r
      document.fonts.load('300 100px "Apple Garamond"'),\r
      document.fonts.load('400 12px "Geist Mono"'),\r
    ]);\r
  } catch (e) { return nada; }\r
  ajustarTitulo(h1, esMovil());\r
\r
  let nivel = 'alta';\r
  let renderer;\r
  try {\r
    renderer = new Renderer({ canvas, webgl: 2, dpr: Math.min(devicePixelRatio, NIVELES[nivel].dpr), alpha: false, antialias: false, powerPreference: 'high-performance' });\r
  } catch (e) { return nada; }\r
  if (!renderer.isWebgl2) return nada;\r
  const gl = renderer.gl;\r
\r
  let W = sec.clientWidth, H = sec.clientHeight;\r
  renderer.setSize(W, H);\r
  const tex = (image) => new Texture(gl, { image, generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });\r
\r
  const capas = { foto: null, titulo: null, maquina: null, tituloU: null, maquinaU: null };\r
  const vacio = () => tex(lienzo(1, 1));\r
  const texturas = { foto: vacio(), titulo: vacio(), maquina: vacio(), tituloU: vacio(), maquinaU: vacio(), glifos: tex(pintarGlifos(GLIFOS)) };\r
  // umbral: el final de la carga se pinta aquí mismo. construyendo: las pasadas de carga (sin movimiento reducido)\r
  let umbral = html.classList.contains('en-umbral') && !!adsU;\r
  const construyendo = umbral && !reducido;\r
\r
  function pintarCapas() {\r
    const dpr = renderer.dpr;\r
    const cw = gl.canvas.width, ch = gl.canvas.height;\r
    const origen = sec.getBoundingClientRect();\r
    capas.foto = lienzo(cw / 2, ch / 2); pintarFoto(capas.foto, img);\r
    capas.titulo = lienzo(cw, ch);\r
    capas.maquina = lienzo(cw, ch);\r
    const trozos = medirTitulo(h1, origen);\r
    pintarTitulo(capas.titulo, trozos, dpr);\r
    pintarMaquina(capas.maquina, trozos, dpr, { foto: capas.foto, movil: esMovil() });\r
    const claves = ['foto', 'titulo', 'maquina'];\r
    if (umbral) {\r
      const ficha = { canvas: [cw, ch], dpr: renderer.dpr, nivel: NIVELES[nivel], glifos: GLIFOS };\r
      capas.tituloU = lienzo(cw, ch);\r
      capas.maquinaU = lienzo(cw, ch);\r
      const trozosU = medirTitulo(adsU, origen);\r
      pintarTitulo(capas.tituloU, trozosU, dpr);\r
      pintarMaquina(capas.maquinaU, trozosU, dpr, { foto: capas.foto, movil: esMovil(), variante: 'umbral', ficha });\r
      claves.push('tituloU', 'maquinaU');\r
    }\r
    for (const k of claves) { texturas[k].image = capas[k]; texturas[k].needsUpdate = true; }\r
  }\r
  pintarCapas();\r
  if (umbral) html.classList.add('umbral-gl');\r
\r
  let fluido = null;\r
  const crearFluido = () => {\r
    if (fluido) fluido._liberar();\r
    fluido = null;\r
    if (reducido) return;\r
    try { fluido = new Fluido(renderer, NIVELES[nivel]); } catch (e) { fluido = null; }\r
  };\r
  crearFluido();\r
\r
  const u = {\r
    tFoto: { value: texturas.foto }, tTitulo: { value: texturas.titulo }, tMaquina: { value: texturas.maquina },\r
    tTituloU: { value: texturas.tituloU }, tMaquinaU: { value: texturas.maquinaU },\r
    uUmbral: { value: umbral ? 1 : 0 }, uLinterna: { value: construyendo ? 0 : 1 }, uHalo: { value: 0 },\r
    uInunda: { value: 0 }, uFoco: { value: [0.5, 0.5] },\r
    tGlifos: { value: texturas.glifos }, tTinte: { value: texturas.foto }, tVel: { value: texturas.foto },\r
    uRes: { value: [gl.canvas.width, gl.canvas.height] }, uDpr: { value: renderer.dpr }, uTime: { value: 0 },\r
    uCelda: { value: (esMovil() ? 8 : 9) * renderer.dpr }, uGlifosN: { value: GLIFOS.length },\r
    uRevelado: { value: 0 }, uHold: { value: [0.5, 0.5] }, uPuntero: { value: [-2, -2] }, uCirculo: { value: 0 },\r
    uUsaFluido: { value: 0 }, uIntro: { value: 0 },\r
    uCaja0: { value: [0, 0, 0, 0] }, uCaja1: { value: [0, 0, 0, 0] }, uCajaA: { value: [0, 0] }, uSalida: { value: 0 },\r
    uLuz: { value: construyendo ? 0 : 1 },\r
    cNoche: { value: hex('#120D0A') }, cCrema: { value: hex('#E7E2DA') }, cRosa: { value: hex('#F5CBD7') },\r
  };\r
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: u, depthTest: false, depthWrite: false }) });\r
\r
  // --- Puntero -------------------------------------------------------------\r
  const p = { x: -1, y: -1, px: -1, py: -1, dentro: false, movido: false, quieto: 0, recorrido: 0, sx: 0.5, sy: 0.5, toque: -10 };\r
  let velocidadSonido = 0;\r
\r
  function mover(cx, cy) {\r
    const r = sec.getBoundingClientRect();\r
    const x = cx - r.left, y = cy - r.top;\r
    p.dentro = x >= 0 && y >= 0 && x <= r.width && y <= r.height;\r
    if (!p.dentro) return;\r
    if (p.x < 0) { p.px = x; p.py = y; }\r
    p.x = x; p.y = y; p.movido = true; p.quieto = 0;\r
  }\r
  window.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') mover(e.clientX, e.clientY); }, { passive: true });\r
\r
  // --- Mantener pulsado ------------------------------------------------------\r
  const hold = { p: 0, tween: null, mando: null, completo: false, activo: false };\r
  let fase = 'mueve';\r
  let temporizadorFase = null;\r
\r
  function empezarHold(cx, cy) {\r
    const r = sec.getBoundingClientRect();\r
    u.uHold.value = [(cx - r.left) / r.width, 1 - (cy - r.top) / r.height];\r
    hold.activo = true; hold.completo = false;\r
    hold.mando = sonido.subida();\r
    cursor.pulsando(true);\r
    gsap.killTweensOf(hold);\r
    hold.tween = gsap.to(hold, {\r
      p: 1, duration: 1.25, ease: 'none',\r
      onUpdate() {\r
        cursor.progreso(hold.p);\r
        hold.mando.avance(hold.p);\r
        if (!reducido) u.uRevelado.value = gsap.parseEase('power2.in')(hold.p) * 0.45;\r
      },\r
      onComplete() {\r
        hold.completo = true;\r
        hold.mando.soltar(true);\r
        gsap.to(u.uRevelado, { value: 1, duration: reducido ? 0 : 1.1, ease: 'power3.out' });\r
        cursor.decir('Así es por dentro');\r
        fase = 'visto';\r
      },\r
    });\r
  }\r
  function soltarHold() {\r
    if (!hold.activo) return;\r
    hold.activo = false;\r
    cursor.pulsando(false);\r
    if (hold.tween) hold.tween.kill();\r
    if (!hold.completo && hold.mando) hold.mando.soltar(false);\r
    else sonido.tic(0.8);\r
    gsap.to(hold, { p: 0, duration: 0.35, ease: 'power2.out', onUpdate() { cursor.progreso(hold.p); } });\r
    gsap.to(u.uRevelado, { value: 0, duration: reducido ? 0 : 0.85, ease: 'power2.inOut' });\r
    if (fase === 'visto') { clearTimeout(temporizadorFase); temporizadorFase = setTimeout(() => cursor.decir(''), 500); }\r
  }\r
  const sobreControl = (t) => t.closest && t.closest('a, button, input, label, [data-umbral-entradas]');\r
  sec.addEventListener('pointerdown', (e) => {\r
    if (e.pointerType === 'touch' || e.button !== 0 || sobreControl(e.target) || html.classList.contains('en-umbral')) return;\r
    empezarHold(e.clientX, e.clientY);\r
  });\r
  window.addEventListener('pointerup', (e) => { if (e.pointerType !== 'touch') soltarHold(); });\r
  window.addEventListener('blur', soltarHold);\r
\r
  // Táctil: el dedo pinta (sin bloquear el scroll) y la pulsación larga abre la máquina\r
  let pendiente = null, inicioToque = null;\r
  sec.addEventListener('touchstart', (e) => {\r
    const t = e.touches[0]; inicioToque = [t.clientX, t.clientY];\r
    mover(t.clientX, t.clientY); p.px = p.x; p.py = p.y;\r
    clearTimeout(pendiente);\r
    pendiente = setTimeout(() => empezarHold(t.clientX, t.clientY), 380);\r
  }, { passive: true });\r
  sec.addEventListener('touchmove', (e) => {\r
    const t = e.touches[0];\r
    mover(t.clientX, t.clientY);\r
    if (inicioToque && Math.hypot(t.clientX - inicioToque[0], t.clientY - inicioToque[1]) > 10) clearTimeout(pendiente);\r
  }, { passive: true });\r
  // En el umbral el velo está encima de la sección: el dedo se escucha en la ventana\r
  const dedoUmbral = (e) => {\r
    if (!umbral) return;\r
    const t = e.touches[0];\r
    mover(t.clientX, t.clientY);\r
    p.toque = u.uTime.value;\r
    if (e.type === 'touchstart') { p.px = p.x; p.py = p.y; }\r
  };\r
  window.addEventListener('touchstart', dedoUmbral, { passive: true });\r
  window.addEventListener('touchmove', dedoUmbral, { passive: true });\r
  const finToque = () => { clearTimeout(pendiente); inicioToque = null; soltarHold(); };\r
  sec.addEventListener('touchend', finToque);\r
  sec.addEventListener('touchcancel', finToque);\r
  sec.addEventListener('contextmenu', (e) => { if (hold.activo) e.preventDefault(); });\r
\r
  const inspector = crearInspector({ sec, h1, u, renderer, capas, nivel: () => NIVELES[nivel], tam: () => [W, H] });\r
\r
  // --- Bucle ------------------------------------------------------------------\r
  let visible = true;\r
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(sec);\r
  let tAnterior = performance.now();\r
  const medida = { n: 0, suma: 0, hecha: false };\r
\r
  gsap.ticker.add(() => {\r
    const ahora = performance.now();\r
    const dt = Math.min(1 / 30, (ahora - tAnterior) / 1000);\r
    tAnterior = ahora;\r
    if (!visible || document.hidden) return;\r
\r
    u.uTime.value += dt;\r
    p.quieto += dt;\r
\r
    let dx = 0, dy = 0;\r
    if (p.movido) {\r
      dx = p.x - p.px; dy = p.y - p.py;\r
      p.px = p.x; p.py = p.y; p.movido = false;\r
      const dist = Math.hypot(dx, dy);\r
      p.recorrido += dist;\r
      velocidadSonido = Math.min(1, dist / dt / 2600);\r
      if (!umbral && fase === 'mueve' && p.recorrido > 900) {\r
        fase = 'manten';\r
        clearTimeout(temporizadorFase);\r
        temporizadorFase = setTimeout(() => cursor.decir('Mantén pulsado'), 350);\r
      }\r
      if (fluido) {\r
        const dist01 = Math.hypot(dx / W, dy / H);\r
        // En el umbral la estela es más ancha y más suave: es luz, no pincel\r
        const fuerza = umbral ? FUERZA * 0.55 : FUERZA;\r
        fluido.splat(p.x / W, 1 - p.y / H, (dx / W) * fuerza * (W / H), (-dy / H) * fuerza, Math.min(0.9, 0.35 + dist01 * 12), umbral ? 0.007 : 0.0032);\r
      }\r
    } else {\r
      velocidadSonido *= Math.exp(-dt * 8);\r
    }\r
\r
    // Al bajar: la máquina sube y los textos se van (sin corte con la sección de abajo)\r
    const salida = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / H));\r
    u.uSalida.value = salida;\r
    sec.style.setProperty('--salida', salida.toFixed(3));\r
\r
    // Quieto 2,5 s (o en el móvil sin tocar): el inspector\r
    inspector.paso(dt, !umbral && !hold.activo && p.quieto > 2.5 && salida < 0.15);\r
\r
    // El umbral en un móvil sin tocar: un haz lento que barre el «ads» (lo único que se mueve solo)\r
    if (umbral && tactil && u.uLinterna.value > 0 && u.uTime.value - p.toque > 1.4) {\r
      const t = u.uTime.value * 0.42;\r
      const ax = W * (0.5 + 0.34 * Math.sin(t)), ay = H * (0.5 + 0.16 * Math.sin(t * 1.7));\r
      // Solo velocidad y un hilo de tinte: si no, la luz se acumula y quema la foto\r
      if (fluido && p.x >= 0) fluido.splat(ax / W, 1 - ay / H, (ax - p.x) * 6, -(ay - p.y) * 6, 0.035, 0.004);\r
      p.x = ax; p.y = ay; p.dentro = true;\r
    }\r
\r
    // Puntero suavizado (halo de la linterna y círculo sin fluido)\r
    const k = 1 - Math.exp(-14 * dt);\r
    if (p.x >= 0) { p.sx += (p.x / W - p.sx) * k; p.sy += (1 - p.y / H - p.sy) * k; }\r
    u.uPuntero.value = [p.sx, p.sy];\r
    if (!fluido) u.uCirculo.value = !umbral && p.dentro && p.quieto < 1.2 ? 1 : 0;\r
    // El halo se queda aunque el ratón pare; si lleva mucho quieto, baja un poco\r
    const haloObj = umbral && p.dentro && p.x >= 0 ? (tactil ? 0.75 : p.quieto > 5 ? 0.6 : 1) : 0;\r
    u.uHalo.value += (haloObj - u.uHalo.value) * (1 - Math.exp(-(haloObj > u.uHalo.value ? 6 : 1.2) * dt));\r
\r
    if (fluido) {\r
      fluido.paso(dt);\r
      u.tTinte.value = fluido.tinte; u.tVel.value = fluido.velocidad; u.uUsaFluido.value = 1;\r
    } else {\r
      u.uUsaFluido.value = 0;\r
    }\r
    renderer.render({ scene: malla, sort: false, frustumCull: false });\r
    sonido.pincel(velocidadSonido, p.x / W, dt, umbral ? 0 : u.uRevelado.value);\r
\r
    // Calidad automática: si va lento, se baja; si sigue lento, fuera el fluido\r
    if (!medida.hecha && fluido) {\r
      medida.n++;\r
      if (medida.n > 20) medida.suma += dt;\r
      if (medida.n === 140) {\r
        const media = medida.suma / 120;\r
        medida.hecha = true;\r
        if (media > 0.024 && nivel === 'alta') { nivel = 'baja'; aplicarNivel(); medida.hecha = false; medida.n = 0; medida.suma = 0; }\r
        else if (media > 0.04) { fluido._liberar(); fluido = null; }\r
      }\r
    }\r
  });\r
\r
  if (!html.classList.contains('gl-activo')) {\r
    html.classList.add('gl-activo', 'titulo-gl');\r
    gsap.to(u.uIntro, { value: 1, duration: reducido ? 0 : 1.4, ease: 'power2.out' });\r
  }\r
\r
  function aplicarNivel() {\r
    renderer.dpr = Math.min(devicePixelRatio, NIVELES[nivel].dpr);\r
    redimensionar();\r
    crearFluido();\r
  }\r
\r
  function redimensionar() {\r
    W = sec.clientWidth; H = sec.clientHeight;\r
    ajustarTitulo(h1, esMovil());\r
    renderer.setSize(W, H);\r
    u.uRes.value = [gl.canvas.width, gl.canvas.height];\r
    u.uDpr.value = renderer.dpr;\r
    u.uCelda.value = (esMovil() ? 8 : 9) * renderer.dpr;\r
    pintarCapas();\r
    if (fluido) fluido.redimensionar(gl.canvas.width / gl.canvas.height);\r
  }\r
  let espera = null;\r
  let anchoPrevio = innerWidth;\r
  window.addEventListener('resize', () => {\r
    // En móvil la barra del navegador cambia el alto al hacer scroll: solo se redimensiona si cambia el ancho\r
    if (esMovil() && innerWidth === anchoPrevio) return;\r
    anchoPrevio = innerWidth;\r
    clearTimeout(espera); espera = setTimeout(redimensionar, 160);\r
  });\r
\r
  // Después de entrar ya no hacen falta las texturas del umbral\r
  function soltarUmbral() {\r
    umbral = false;\r
    u.uUmbral.value = 0; u.uInunda.value = 0; u.uHalo.value = 0;\r
    for (const k of ['tituloU', 'maquinaU']) { capas[k] = null; texturas[k].image = lienzo(1, 1); texturas[k].needsUpdate = true; }\r
    html.classList.remove('umbral-gl');\r
  }\r
\r
  return {\r
    listo: Promise.resolve(true),\r
    // La carga se construye en tres pases: alambre, luz y, al final, la linterna (la marca donde pasa el ratón)\r
    construir(alPase) {\r
      if (!construyendo) { u.uLuz.value = 1; u.uLinterna.value = 1; return Promise.resolve(); }\r
      return new Promise((ok) => {\r
        gsap.timeline({ onComplete: ok })\r
          .add(() => alPase(1, 'alambre'))\r
          .to(u.uLuz, { value: 1, duration: 1.1, ease: 'power2.inOut', onStart: () => alPase(2, 'luz') }, 1.1)\r
          .to(u.uLinterna, { value: 1, duration: 1.0, ease: 'power2.out', onStart: () => alPase(3, 'linterna') }, 2.3);\r
      });\r
    },\r
    activarCursor() { cursor.decir('Mueve el ratón'); },\r
    // Al entrar: la marca inunda desde el punto del clic, «ads» se funde en «adsPartners» y vuelve la portada.\r
    // Al final de la inundación, un golpe de fluido desde el centro que destapa la máquina y se disuelve\r
    entrar(cx = innerWidth / 2, cy = innerHeight / 2) {\r
      const golpe = () => {\r
        if (!fluido) return;\r
        for (let i = 0; i < 9; i++) {\r
          const a = (i / 9) * Math.PI * 2 + Math.random() * 0.3;\r
          fluido.splat(0.5, 0.52, Math.cos(a) * 900 * (W / H), Math.sin(a) * 900, 0.5, 0.004);\r
        }\r
      };\r
      if (!umbral) { golpe(); return; }\r
      const r = sec.getBoundingClientRect();\r
      u.uFoco.value = [(cx - r.left) / W, 1 - (cy - r.top) / H];\r
      if (reducido) { soltarUmbral(); return; }\r
      gsap.timeline({ onComplete: soltarUmbral })\r
        .to(u.uInunda, { value: 1, duration: 1.25, ease: 'power2.inOut' })\r
        .to(u.uUmbral, { value: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.35')\r
        .add(golpe, '-=0.5');\r
    },\r
  };\r
}\r
\r
// --- El inspector ----------------------------------------------------------------------\r
// Con la portada quieta, unas cajas se abren sobre algo concreto (una letra del título, el lema, el texto, un trozo de\r
// foto o la etiqueta de arriba), enseñan la máquina dentro y dicen lo que es con valores medidos. Una caja se abre\r
// mientras la anterior se cierra; al mover el ratón, se cierran todas.\r
function crearInspector({ sec, h1, u, renderer, capas, nivel, tam }) {\r
  const capa = sec.querySelector('[data-inspector]');\r
  const etqs = capa ? [...capa.querySelectorAll('[data-inspector-etq]')] : [];\r
  const cajas = etqs.map((el) => ({ a: 0, r: [0, 0, 0, 0], el, t: null }));\r
  const estado = { espera: 0.2, n: 0, activo: false, tipos: [] };\r
  if (cajas.length < 2) return { paso() {} };\r
\r
  const relativa = (r) => { const o = sec.getBoundingClientRect(); return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }; };\r
  const fs = (el) => Math.round(parseFloat(getComputedStyle(el).fontSize));\r
  const margen = (r, mx, my) => ({ x: r.x - mx, y: r.y - my, w: r.w + mx * 2, h: r.h + my * 2 });\r
  const OBJETIVOS = {\r
    letra() {\r
      const nodos = [];\r
      const w = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);\r
      while (w.nextNode()) if (w.currentNode.textContent.trim()) nodos.push(w.currentNode);\r
      if (!nodos.length) return null;\r
      const nodo = nodos[Math.floor(Math.random() * nodos.length)];\r
      const i = Math.floor(Math.random() * nodo.textContent.length);\r
      const rango = document.createRange(); rango.setStart(nodo, i); rango.setEnd(nodo, i + 1);\r
      const r = relativa(rango.getBoundingClientRect());\r
      return { r: { x: r.x - 6, y: r.y + r.h * 0.12, w: r.w + 12, h: r.h * 0.8 }, txt: \`«\${nodo.textContent[i]}» · Apple Garamond 300 · \${fs(h1)} px\` };\r
    },\r
    lema() {\r
      const el = sec.querySelector('.portada__lema');\r
      return el && { r: margen(relativa(el.getBoundingClientRect()), 10, 8), txt: \`p.lema · Garamond 300 + 400 itálica · \${fs(el)} px\` };\r
    },\r
    texto() {\r
      const el = sec.querySelector('.portada__texto');\r
      if (!el) return null;\r
      const lh = Math.round(parseFloat(getComputedStyle(el).lineHeight));\r
      return { r: margen(relativa(el.getBoundingClientRect()), 10, 8), txt: \`p · Open Sauce 400 · \${fs(el)}/\${lh} px · \${el.textContent.trim().split(/\\s+/).length} palabras\` };\r
    },\r
    foto() {\r
      const [W, H] = tam();\r
      const lado = Math.round(Math.min(W, H) * (0.18 + Math.random() * 0.08));\r
      const x = W * (0.32 + Math.random() * 0.3), y = H * (0.06 + Math.random() * 0.22);\r
      // La luz media de ese trozo, leída de la foto que pinta la portada\r
      let luz = '';\r
      try {\r
        const k = capas.foto.width / W, l = Math.max(1, Math.round(lado * k));\r
        const d = capas.foto.getContext('2d', { willReadFrequently: true }).getImageData(Math.round(x * k), Math.round(y * k), l, l).data;\r
        let s = 0;\r
        for (let i = 0; i < d.length; i += 4) s += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;\r
        luz = \` · luz media \${Math.round(s / (d.length / 4) / 2.55)} %\`;\r
      } catch (e) { /* sin lectura */ }\r
      return { r: { x, y, w: lado, h: lado }, txt: \`foto · \${lado}×\${lado} px\${luz} · fluido \${nivel().sim}²\` };\r
    },\r
    etiqueta() {\r
      const el = sec.querySelector('.portada__etq');\r
      return el && { r: margen(relativa(el.getBoundingClientRect()), 8, 6), txt: \`p.mono · Geist Mono · \${fs(el)} px · \${el.textContent.length} caracteres\` };\r
    },\r
  };\r
\r
  function elegir() {\r
    for (let i = 0; i < 6; i++) {\r
      if (!estado.tipos.length) estado.tipos = Object.keys(OBJETIVOS).sort(() => Math.random() - 0.5);\r
      const o = OBJETIVOS[estado.tipos.pop()]();\r
      if (o && o.r.w > 4 && o.r.h > 4) return o;\r
    }\r
    return null;\r
  }\r
\r
  function abrir(c, o) {\r
    c.r = [o.r.x, o.r.y, o.r.x + o.r.w, o.r.y + o.r.h];\r
    const [W] = tam();\r
    const y = o.r.y > 34 ? o.r.y - 24 : o.r.y + o.r.h + 6;\r
    c.el.style.transform = \`translate3d(\${Math.max(0, Math.min(o.r.x, W - 340)).toFixed(0)}px, \${y.toFixed(0)}px, 0)\`;\r
    c.el.classList.add('on');\r
    clearTimeout(c.t);\r
    let n = 0;\r
    const escribir = () => { c.el.textContent = o.txt.slice(0, ++n); if (n < o.txt.length) c.t = setTimeout(escribir, 14); };\r
    escribir();\r
    gsap.to(c, { a: 1, duration: 0.6, ease: 'expo.out', overwrite: true });\r
    sonido.tic(0.45);\r
  }\r
  function cerrar(c, rapido) {\r
    clearTimeout(c.t);\r
    c.el.classList.remove('on');\r
    gsap.to(c, { a: 0, duration: rapido ? 0.18 : 0.45, ease: 'power3.in', overwrite: true });\r
  }\r
\r
  return {\r
    paso(dt, quieto) {\r
      if (quieto) {\r
        estado.activo = true;\r
        estado.espera -= dt;\r
        if (estado.espera <= 0) {\r
          const c = cajas[estado.n % cajas.length];\r
          cajas.forEach((otra) => { if (otra !== c && otra.a > 0) cerrar(otra); });\r
          const o = elegir();\r
          if (o) abrir(c, o);\r
          estado.n++;\r
          estado.espera = 2.8;\r
        }\r
      } else if (estado.activo) {\r
        estado.activo = false; estado.espera = 0.2;\r
        cajas.forEach((c) => cerrar(c, true));\r
      }\r
      // A píxeles del canvas (con la y hacia arriba, como el shader)\r
      const [, H] = tam(); const k = renderer.dpr;\r
      const vec = (c) => [c.r[0] * k, (H - c.r[3]) * k, c.r[2] * k, (H - c.r[1]) * k];\r
      u.uCaja0.value = vec(cajas[0]); u.uCaja1.value = vec(cajas[1]);\r
      u.uCajaA.value = [cajas[0].a, cajas[1].a];\r
    },\r
  };\r
}\r
`,h=`// El menú baja de la web a la placa que la ejecuta. Al abrirlo, del botón sale una ola que va convirtiendo lo que tenías\r
// en pantalla en el código que lo construye, cada cosa en su sitio (menu/codigo.js); por delante de la ola se sigue\r
// viendo la página de verdad. Cuando la ola lo cubre todo, la cámara baja hacia el centro sin cortes: atraviesa esa capa\r
// y las de debajo (el código que la pinta y sus bytes, que se estiran hasta ser pistas) hasta la placa base\r
// (menu/circuito.js). Allí suben las piezas, una por página, y arrancan como en una placa de verdad: primero la BIOS.\r
// Apuntar a una pieza enciende sus pistas y la señal corre hacia ella; pinchar baja hasta ella y entra. Cerrar es el\r
// mismo viaje hacia arriba, y la ola vuelve a meterse en el botón. Es una escena 3D con OGL: las capas de código son\r
// planos apilados encima de la placa, que es otro plano con su textura, y las piezas son cajas y cilindros que crecen\r
// desde ella. El lienzo es transparente (con el alfa premultiplicado) para que la página se vea fuera de la ola.\r
import { Renderer, Camera, Transform, Program, Mesh, Plane, Box, Cylinder, Texture, Vec3 } from 'ogl';\r
import { gsap } from 'gsap';\r
import { rastro } from '../rastro.js';\r
import { capaVisible, capaCodigo, capaBytes } from './codigo.js';\r
import { LADO, BUS, disposicion, huella, pintarPlaca, pintarCaras } from './circuito.js';\r
\r
const FOV = 40;\r
const TAN = Math.tan((FOV * Math.PI) / 360);\r
const D0 = 10;   // de la cámara de partida a la capa 1 (la que coincide con la pantalla)\r
const SEP = 10;  // entre capa y capa\r
const NOCHE = [18 / 255, 13 / 255, 10 / 255];\r
const ROSA = [245 / 255, 203 / 255, 215 / 255];\r
const CAPAS = [\r
  ['lo que ves', 'HTML y CSS'],\r
  ['el código que lo pinta', 'JS y GLSL'],\r
  ['lo que entiende la máquina', 'bytes'],\r
  ['la placa que lo ejecuta', 'cobre y silicio'],\r
];\r
const ARRANQUE = ['about', 'tech', 'proyectos', 'brand'];   // el orden en que se encienden los LED, como al arrancar\r
\r
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);\r
const mezcla = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);\r
const suave = (x) => x * x * (3 - 2 * x);\r
const entre = (a, b, x) => suave(Math.min(1, Math.max(0, (x - a) / (b - a))));\r
const vertical = () => innerWidth < innerHeight;\r
const coma = (v, d = 1) => v.toFixed(d).replace('.', ',');\r
\r
// --- Lo que se pinta antes de abrir (sin WebGL): la placa, sus caras y las capas 2 y 3 ----------------------------\r
let hecho = null;\r
export function preparar(datos) {\r
  const v = vertical();\r
  if (hecho && hecho.vertical === v) return hecho;\r
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;\r
  const disp = disposicion(v);\r
  const ancho = movil ? 1024 : 2048, proporcion = v ? 0.75 : 1.9;\r
  hecho = {\r
    vertical: v, disp,\r
    placa: pintarPlaca(disp, movil ? 2048 : 4096),\r
    caras: pintarCaras(datos),\r
    codigo: capaCodigo(ancho, Math.round(ancho / proporcion)),\r
    bytes: capaBytes(ancho, Math.round(ancho / proporcion)),\r
    proporcion,\r
  };\r
  return hecho;\r
}\r
\r
// --- Shaders ---------------------------------------------------------------------------------------------------------\r
const VERT_PLANO = /* glsl */ \`#version 300 es\r
in vec3 position; in vec2 uv;\r
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;\r
out vec2 vUv; out vec3 vMundo;\r
void main() { vUv = uv; vec4 m = modelMatrix * vec4(position, 1.0); vMundo = m.xyz; gl_Position = projectionMatrix * viewMatrix * m; }\`;\r
\r
// Una capa de código: su textura, el fondo de noche solo en la capa 1 y en la 3 las pistas que corren. La capa 1 lleva\r
// además la ola (uPant > 0): sale del botón del menú (uOrigen, en px desde arriba a la izquierda) con el borde ondulado;\r
// dentro, el código; en el frente, el código se rasga (franjas que saltan, el rojo y el azul que se separan) y se tiñe\r
// de rosa, con un hilo rosa por delante; fuera, nada, y se ve la página. Sale con el alfa premultiplicado\r
const FRAG_CAPA = /* glsl */ \`#version 300 es\r
precision highp float;\r
in vec2 vUv; out vec4 salida;\r
uniform sampler2D tMapa, tPistas;\r
uniform float uAlfa, uFondo, uPistas, uT, uBordes, uOla;\r
uniform vec2 uOrigen, uPant;\r
uniform vec3 uNoche, uRosa;\r
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }\r
float ruido(float x) { float i = floor(x), f = fract(x); return mix(azar(vec2(i, 3.1)), azar(vec2(i + 1.0, 3.1)), f * f * (3.0 - 2.0 * f)); }\r
vec4 leer(vec2 uv) {\r
  vec4 a = texture(tMapa, uv);\r
  if (uPistas > 0.001) a = mix(a, texture(tPistas, uv + vec2(uT * 0.025, 0.0)), uPistas);\r
  return a;\r
}\r
void main() {\r
  float dentro = 1e5, frente = 0.0, ola = uPant.x > 0.0 ? 1.0 : 0.0;\r
  if (ola > 0.5) {\r
    vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uPant - uOrigen;\r
    float ang = atan(px.y, px.x);\r
    float onda = (ruido(ang * 5.0 + uT * 1.7) - 0.5) * 70.0 + sin(ang * 11.0 - uT * 6.0) * 12.0;\r
    dentro = uOla - length(px) + onda;\r
    frente = exp(-abs(dentro) / 46.0);\r
  }\r
  vec2 uv = vUv;\r
  float banda = floor(uv.y * 46.0);\r
  float r = azar(vec2(banda, floor(uT * 30.0)));\r
  uv.x += (r - 0.5) * 0.07 * frente * step(0.45, r);\r
  float sep = 0.008 * frente;\r
  vec4 c = leer(uv), cr = leer(uv + vec2(sep, 0.0)), cb = leer(uv - vec2(sep, 0.0));\r
  vec3 col = mix(vec3(cr.r, c.g, cb.b), uRosa, frente * 0.45);\r
  float a = max(c.a, max(cr.a, cb.a));\r
  float fa = uFondo * (1.0 - a), sale = a + fa;\r
  vec3 res = (col * a + uNoche * fa) / max(sale, 1e-4);\r
  float borde = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) * smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);\r
  float alfa = sale * uAlfa * mix(1.0, borde, uBordes) * smoothstep(-2.0, 4.0, dentro);\r
  float hilo = ola * uAlfa * exp(-abs(dentro + 6.0) / 5.0);\r
  salida = vec4(res * alfa + uRosa * hilo * (1.0 - alfa), alfa + hilo * (1.0 - alfa));\r
}\`;\r
\r
// La placa: su textura con la luz de una lámpara, el brillo de los LED y la señal que corre por los buses encendidos.\r
// La señal guarda en el rojo a qué pieza va y en el verde la distancia al procesador; el alfa es cuánto tapa la pista,\r
// así que se divide por él (los bordes de las pistas no cambian de pieza al filtrar)\r
const FRAG_PLACA = /* glsl */ \`#version 300 es\r
precision highp float;\r
in vec2 vUv; in vec3 vMundo; out vec4 salida;\r
uniform sampler2D tAspecto, tSenal;\r
uniform vec3 cameraPosition, uNoche;\r
uniform float uT, uLuz;\r
uniform vec4 uBus, uSentido;\r
uniform vec3 uC1, uC2, uC3, uC4, uL1, uL2, uL3, uL4;\r
vec3 led(vec3 l, vec3 c, vec2 p) {\r
  vec2 d = p - l.xy; float r2 = dot(d, d);\r
  return c * l.z * (exp(-r2 / 0.3) * 1.1 + exp(-r2 / 5.0) * 0.16);\r
}\r
void main() {\r
  vec3 col = texture(tAspecto, vUv).rgb;\r
  vec2 p = vMundo.xz;\r
  vec2 lp = p - vec2(-8.0, -10.0);\r
  col *= 0.72 + 0.5 * exp(-dot(lp, lp) / 700.0);\r
  vec4 s = texture(tSenal, vUv);\r
  if (s.a > 0.02) {\r
    float id = floor(s.r / s.a * 255.0 / 60.0 + 0.5);\r
    vec4 sel = vec4(equal(vec4(id), vec4(1.0, 2.0, 3.0, 4.0)));\r
    float k = dot(sel, uBus);\r
    if (k > 0.001) {\r
      vec3 c = sel.x * uC1 + sel.y * uC2 + sel.z * uC3 + sel.w * uC4;\r
      float fase = fract(s.g / s.a * 2.0 - uT * 0.9 * dot(sel, uSentido));\r
      float pulso = pow(fase, 16.0) * 2.6 + pow(fase, 4.0) * 0.35;\r
      col += c * k * (0.22 + pulso) * s.a;\r
    }\r
  }\r
  col += led(uL1, uC1, p) + led(uL2, uC2, p) + led(uL3, uC3, p) + led(uL4, uC4, p);\r
  float d = distance(cameraPosition, vMundo);\r
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);\r
  col = mix(uNoche, col, smoothstep(0.5, 0.34, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))));\r
  salida = vec4(col, 1.0);\r
}\`;\r
\r
// Las piezas: cajas y cilindros de tamaño 1 que el shader estira a su medida y hace crecer desde la placa (uSube). La\r
// cara de arriba y la de delante pueden llevar dibujo; luz de la misma lámpara, brillo de metal y un borde del color\r
// de la pieza cuando la apuntas\r
const VERT_PIEZA = /* glsl */ \`#version 300 es\r
in vec3 position; in vec3 normal;\r
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;\r
uniform vec3 uTam; uniform float uY0, uSube;\r
out vec3 vLocal; out vec3 vN; out vec3 vMundo;\r
void main() {\r
  vLocal = position; vN = normal;\r
  vec3 p = vec3(position.x * uTam.x, (position.y + 0.5) * uTam.y * uSube + uY0, position.z * uTam.z);\r
  vec4 m = modelMatrix * vec4(p, 1.0);\r
  vMundo = m.xyz;\r
  gl_Position = projectionMatrix * viewMatrix * m;\r
}\`;\r
const FRAG_PIEZA = /* glsl */ \`#version 300 es\r
precision highp float;\r
in vec3 vLocal; in vec3 vN; in vec3 vMundo; out vec4 salida;\r
uniform sampler2D tArriba, tFrente;\r
uniform vec3 cameraPosition, uNoche, uColor, uBorde;\r
uniform float uMetal, uArriba, uFrente, uLuz, uBrillo;\r
void main() {\r
  vec3 n = normalize(vN);\r
  vec3 base = uColor;\r
  if (n.y > 0.5 && uArriba > 0.5) base = texture(tArriba, vec2(vLocal.x + 0.5, 0.5 - vLocal.z)).rgb;\r
  else if (n.z > 0.5 && uFrente > 0.5) base = texture(tFrente, vec2(vLocal.x + 0.5, vLocal.y + 0.5)).rgb;\r
  vec3 l = normalize(vec3(-0.35, 1.0, 0.3));\r
  vec3 v = normalize(cameraPosition - vMundo);\r
  float dif = max(dot(n, l), 0.0);\r
  float esp = pow(max(dot(n, normalize(l + v)), 0.0), mix(8.0, 56.0, uMetal)) * mix(0.04, 0.55, uMetal);\r
  vec3 col = base * (0.34 + 0.76 * dif) + vec3(1.0, 0.96, 0.92) * esp;\r
  col += uBorde * uBrillo * (0.2 + 0.8 * pow(1.0 - max(dot(n, v), 0.0), 2.0));\r
  float d = distance(cameraPosition, vMundo);\r
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);\r
  salida = vec4(col, 1.0);\r
}\`;\r
\r
// La sombra de cada pieza en la placa: una caja (o un círculo) difuminada, que se oscurece a la vez que la pieza crece\r
const FRAG_SOMBRA = /* glsl */ \`#version 300 es\r
precision highp float;\r
in vec2 vUv; in vec3 vMundo; out vec4 salida;\r
uniform vec2 uTam; uniform float uMargen, uRedondo, uSube;\r
void main() {\r
  vec2 p = (vUv - 0.5) * (uTam + 2.0 * uMargen);\r
  float d = uRedondo > 0.5 ? length(p) - uTam.x * 0.5 : length(max(abs(p) - uTam * 0.5, 0.0));\r
  salida = vec4(0.0, 0.0, 0.0, (1.0 - smoothstep(0.0, uMargen, d)) * 0.82 * uSube);\r
}\`;\r
\r
// pagina: el <main>, que se esconde cuando la ola lo ha cubierto y vuelve antes de que la ola se retire\r
export function crear(raiz, { datos, reducido, sonido, ir, pagina }) {\r
  const lienzo = raiz.querySelector('[data-pl-lienzo]');\r
  const boton = document.querySelector('[data-menu-btn]');\r
  const movil = !matchMedia('(hover: hover) and (pointer: fine)').matches;\r
  let renderer;\r
  try {\r
    renderer = new Renderer({ canvas: lienzo, webgl: 2, dpr: Math.min(devicePixelRatio || 1, movil ? 1.5 : 2), alpha: true, premultipliedAlpha: true, antialias: true });\r
  } catch (e) { return null; }\r
  const gl = renderer.gl;\r
  if (!gl || !renderer.isWebgl2) return null;\r
\r
  const camara = new Camera(gl, { fov: FOV, near: 0.05, far: 400 });\r
  camara.up.set(0, 0, -1);   // la parte de arriba de la pantalla es -z: lo de arriba de la página\r
  const mundo = new Transform(), capas = new Transform();\r
  const textura = (image, { mip = true, filtro = gl.LINEAR } = {}) => new Texture(gl, {\r
    image, generateMipmaps: mip, minFilter: mip ? gl.LINEAR_MIPMAP_LINEAR : filtro, magFilter: filtro,\r
    wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE, anisotropy: mip ? 8 : 1,\r
  });\r
  const vacia = new Texture(gl, { image: new Uint8Array([0, 0, 0, 0]), width: 1, height: 1, generateMipmaps: false });\r
  const plano = new Plane(gl), caja = new Box(gl), cilindro = new Cylinder(gl, { radialSegments: 48 });\r
\r
  // --- Las capas de código ---------------------------------------------------------------------------------------\r
  const capa = (orden) => {\r
    const program = new Program(gl, {\r
      vertex: VERT_PLANO, fragment: FRAG_CAPA, transparent: true, depthTest: false, depthWrite: false,\r
      uniforms: {\r
        tMapa: { value: vacia }, tPistas: { value: vacia }, uAlfa: { value: 0 }, uFondo: { value: 0 }, uPistas: { value: 0 },\r
        uT: { value: 0 }, uBordes: { value: orden ? 1 : 0 }, uNoche: { value: NOCHE }, uRosa: { value: ROSA },\r
        uOla: { value: 1e5 }, uOrigen: { value: [0, 0] }, uPant: { value: [0, 0] },\r
      },\r
    });\r
    const m = new Mesh(gl, { geometry: plano, program, renderOrder: 3 - orden });\r
    m.rotation.x = -Math.PI / 2;\r
    m.setParent(capas);\r
    return m;\r
  };\r
  const capa1 = capa(0), capa2 = capa(1), capa3 = capa(2);\r
\r
  // --- La placa y las piezas --------------------------------------------------------------------------------------\r
  const uniPlaca = {\r
    tAspecto: { value: vacia }, tSenal: { value: vacia }, uNoche: { value: NOCHE }, uT: { value: 0 }, uLuz: { value: 1 },\r
    uBus: { value: [0, 0, 0, 0] }, uSentido: { value: [1, 1, 1, 1] },\r
    uC1: { value: [1, 1, 1] }, uC2: { value: [1, 1, 1] }, uC3: { value: [1, 1, 1] }, uC4: { value: [1, 1, 1] },\r
    uL1: { value: [0, 0, 0] }, uL2: { value: [0, 0, 0] }, uL3: { value: [0, 0, 0] }, uL4: { value: [0, 0, 0] },\r
  };\r
  const placaMesh = new Mesh(gl, { geometry: plano, program: new Program(gl, { vertex: VERT_PLANO, fragment: FRAG_PLACA, uniforms: uniPlaca }) });\r
  placaMesh.rotation.x = -Math.PI / 2;\r
  placaMesh.scale.set(LADO, LADO, 1);\r
  placaMesh.setParent(mundo);\r
  const colores = {};\r
  datos.forEach((d) => { colores[d.slug] = rgb(d.color); uniPlaca[\`uC\${BUS[d.slug]}\`].value = colores[d.slug]; });\r
\r
  // Un solo programa para todas las piezas: cada malla pone sus valores justo antes de dibujarse\r
  const uniPieza = {\r
    tArriba: { value: vacia }, tFrente: { value: vacia }, uNoche: { value: NOCHE }, uColor: { value: [0, 0, 0] },\r
    uBorde: { value: [0, 0, 0] }, uMetal: { value: 0 }, uArriba: { value: 0 }, uFrente: { value: 0 }, uLuz: { value: 1 },\r
    uBrillo: { value: 0 }, uTam: { value: [1, 1, 1] }, uY0: { value: 0 }, uSube: { value: 1 },\r
  };\r
  const progPieza = new Program(gl, { vertex: VERT_PIEZA, fragment: FRAG_PIEZA, uniforms: uniPieza, cullFace: null });\r
  const uniSombra = { uTam: { value: [1, 1] }, uMargen: { value: 0.7 }, uRedondo: { value: 0 }, uSube: { value: 0 } };\r
  const progSombra = new Program(gl, { vertex: VERT_PLANO, fragment: FRAG_SOMBRA, uniforms: uniSombra, transparent: true, depthWrite: false });\r
\r
  // --- El estado del viaje y la cámara -----------------------------------------------------------------------------\r
  // y: altura de la cámara mientras baja; k: de mirar recto hacia abajo a la vista final; sube: cuánto han crecido las\r
  // piezas; ola: cuánto ha avanzado la ola desde el botón (1, lo cubre todo); dive: la bajada hasta una pieza al pincharla\r
  const st = { y: 0, k: 0, sube: 0, ola: 1, dive: 0, T: 0 };\r
  const raton = { x: 0, y: 0, nx: 0, ny: 0, dentro: false };\r
  let piezas = [], mallas = [], alturas = null, final = null, disp = null, texturasPlaca = null;\r
  let apuntado = null, peso = 0, destino = null, llegado = false;\r
  const leds = {};\r
  const bus = [0, 0, 0, 0], sentido = [1, 1, 1, 1];\r
  let deriva = [0, 0, 0];\r
\r
  // Dónde se queda la cámara al final: encuadra todas las piezas (dejando sitio a la lista de abajo y a la cabecera y,\r
  // en vertical, a los nombres, que van a la derecha), un poco inclinada\r
  function encuadrar() {\r
    const hs = disp.piezas.map(huella);\r
    const x0 = Math.min(...hs.map((h) => h.x0)) - 1.6, x1 = Math.max(...hs.map((h) => h.x1)) + (hecho.vertical ? 7.5 : 1.6);\r
    const z0 = Math.min(...hs.map((h) => h.z0)) - 2.2, z1 = Math.max(...hs.map((h) => h.z1)) + 1.4;\r
    const asp = innerWidth / innerHeight, inc = hecho.vertical ? 0.3 : 0.42;\r
    const d = Math.max((z1 - z0) / 2 / (TAN * (hecho.vertical ? 0.64 : 0.74)), (x1 - x0) / 2 / (TAN * asp * 0.94));\r
    const mira = [(x0 + x1) / 2, 0, (z0 + z1) / 2 + 0.6];\r
    final = { pos: [mira[0], d * Math.cos(inc), mira[2] + d * Math.sin(inc)], mira };\r
    const yf = final.pos[1];\r
    alturas = { yf, capas: [yf + 5 + SEP * 2, yf + 5 + SEP, yf + 5], y0: yf + 5 + SEP * 2 + D0 };\r
    capa1.position.y = alturas.capas[0];\r
    capa2.position.y = alturas.capas[1];\r
    capa3.position.y = alturas.capas[2];\r
    // La capa 1 mide exactamente lo que ve la cámara de partida; las de debajo, lo bastante para no enseñar el borde\r
    const h1 = 2 * D0 * TAN;\r
    capa1.scale.set(h1 * asp, h1, 1);\r
    const h2 = hecho.vertical ? 17 : 14;\r
    capa2.scale.set(h2 * hecho.proporcion, h2, 1);\r
    capa3.scale.set(h2 * hecho.proporcion, h2, 1);\r
  }\r
\r
  // Monta la placa y las piezas (la primera vez, o si el móvil ha girado)\r
  function montarPlaca() {\r
    disp = hecho.disp;\r
    if (texturasPlaca) { texturasPlaca.forEach((t) => gl.deleteTexture(t.texture)); }\r
    const tAspecto = textura(hecho.placa.aspecto), tSenal = textura(hecho.placa.senal, { mip: false });\r
    uniPlaca.tAspecto.value = tAspecto; uniPlaca.tSenal.value = tSenal;\r
    const caras = {};\r
    for (const [k, c] of Object.entries(hecho.caras)) caras[k] = textura(c);\r
    uniPieza.tArriba.value = caras.ihs;   // para que el primer uso ya tenga algo válido\r
    capa2.program.uniforms.tMapa.value = textura(hecho.codigo);\r
    capa3.program.uniforms.tMapa.value = textura(hecho.bytes.texto);\r
    capa3.program.uniforms.tPistas.value = textura(hecho.bytes.pistas);\r
    texturasPlaca = [tAspecto, tSenal, ...Object.values(caras), capa2.program.uniforms.tMapa.value,\r
      capa3.program.uniforms.tMapa.value, capa3.program.uniforms.tPistas.value];\r
\r
    mallas.forEach((m) => m.setParent(null));\r
    mallas = [];\r
    const malla = (forma, x, z, q, extra = {}) => {\r
      const m = new Mesh(gl, { geometry: forma === 'pila' ? cilindro : caja, program: progPieza, frustumCulled: false });\r
      m.position.set(x, 0, z);\r
      m.datos = {\r
        tam: [q.w, q.h, q.d], y0: q.y0 || 0, color: q.color ? rgb(q.color) : [0, 0, 0], metal: q.metal || 0,\r
        arriba: q.arriba ? caras[q.arriba] : null, frente: q.frente ? caras[q.frente] : null,\r
        orden: Math.min(1, Math.hypot(x, z) / 22), sube: 0, brillo: 0, ...extra,\r
      };\r
      m.onBeforeRender(() => {\r
        const d = m.datos;\r
        uniPieza.uTam.value = d.tam; uniPieza.uY0.value = d.y0; uniPieza.uSube.value = Math.max(0.001, d.sube);\r
        uniPieza.uColor.value = d.led ? mezcla([0.16, 0.05, 0.05], d.ledColor, Math.min(1, d.on)) : d.color;\r
        uniPieza.uMetal.value = d.metal;\r
        uniPieza.uArriba.value = d.arriba ? 1 : 0; uniPieza.uFrente.value = d.frente ? 1 : 0;\r
        uniPieza.tArriba.value = d.arriba || caras.ihs; uniPieza.tFrente.value = d.frente || caras.ihs;\r
        uniPieza.uBorde.value = d.borde || [0, 0, 0];\r
        uniPieza.uBrillo.value = d.led ? d.on * 1.4 : d.brillo || 0;\r
      });\r
      m.setParent(mundo);\r
      mallas.push(m);\r
      // Su sombra (los LED no llevan): comparte los datos de la pieza, así crece con ella\r
      if (!extra.led) {\r
        const s = new Mesh(gl, { geometry: plano, program: progSombra });\r
        s.rotation.x = -Math.PI / 2;\r
        s.position.set(x, 0.015, z);\r
        s.scale.set(q.w + 1.4, q.d + 1.4, 1);\r
        s.datos = m.datos;\r
        s.onBeforeRender(() => {\r
          uniSombra.uTam.value = [q.w, q.d]; uniSombra.uRedondo.value = forma === 'pila' ? 1 : 0;\r
          uniSombra.uSube.value = m.datos.sube;\r
        });\r
        s.setParent(mundo);\r
        mallas.push(s);\r
      }\r
      return m;\r
    };\r
    piezas = disp.piezas.map((p) => {\r
      const d = datos.find((x) => x.slug === p.slug);\r
      const partes = p.partes.map((q) => malla(q.forma, p.x + q.dx, p.z + q.dz, q, { borde: colores[p.slug] }));\r
      const led = malla('caja', p.led[0], p.led[1], { w: 0.5, h: 0.22, d: 0.3 }, { led: true, ledColor: colores[p.slug], borde: colores[p.slug], on: 0 });\r
      leds[p.slug] = led.datos;\r
      return { p, d, partes, led, h: huella(p), rect: null, etq: raiz.querySelector(\`[data-pl-dest="\${p.slug}"]\`) };\r
    });\r
    disp.decor.forEach((q) => malla(q.forma, q.x, q.z, q));\r
    encuadrar();\r
  }\r
\r
  const medir = () => {\r
    renderer.setSize(innerWidth, innerHeight);\r
    camara.perspective({ aspect: gl.canvas.width / gl.canvas.height });\r
    if (disp) encuadrar();\r
  };\r
  addEventListener('resize', medir);\r
\r
  // La cámara: baja recta por el centro y al final se inclina hacia la vista de la placa; se acerca un poco a la pieza\r
  // que apuntas, sigue al ratón un poco y, al pinchar, baja hasta la pieza\r
  const camaraEn = () => {\r
    const k = suave(Math.min(1, st.k));\r
    let pos = [final.pos[0] * k, st.y, final.pos[2] * k];\r
    let mira = [final.mira[0] * k, 0, final.mira[2] * k];\r
    const conRaton = llegado && raton.dentro && !movil && !destino;\r
    pos = [pos[0] + deriva[0] + (conRaton ? raton.nx * 1.1 : 0), pos[1] + deriva[1], pos[2] + deriva[2] + (conRaton ? raton.ny * 0.8 : 0)];\r
    mira = [mira[0] + deriva[0] * 0.6, mira[1], mira[2] + deriva[2] * 0.6];\r
    if (destino && st.dive > 0) {\r
      const e = st.dive * st.dive;\r
      const c = [(destino.h.x0 + destino.h.x1) / 2, destino.h.h, (destino.h.z0 + destino.h.z1) / 2];\r
      pos = mezcla(pos, [c[0], c[1] + 1.6, c[2] + 0.01], e);\r
      mira = mezcla(mira, c, e);\r
    }\r
    camara.position.set(...pos);\r
    camara.lookAt(mira);\r
    camara.updateMatrixWorld();\r
  };\r
\r
  // Dónde cae en la pantalla una pieza (la caja de sus ocho esquinas, con lo que haya crecido)\r
  const v3 = new Vec3();\r
  const rectDe = (pz) => {\r
    const { x0, x1, z0, z1, h } = pz.h;\r
    const alto = h * Math.max(0, Math.min(1, pz.partes[0].datos.sube));\r
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;\r
    for (const x of [x0, x1]) for (const y of [0, alto]) for (const z of [z0, z1]) {\r
      v3.set(x, y, z);\r
      camara.project(v3);\r
      const sx = ((v3.x + 1) / 2) * innerWidth, sy = ((1 - v3.y) / 2) * innerHeight;\r
      a = Math.min(a, sx); b = Math.min(b, sy); c = Math.max(c, sx); d = Math.max(d, sy);\r
    }\r
    return { x0: a, y0: b, x1: c, y1: d };\r
  };\r
  const apuntar = (x, y) => {\r
    let mejor = null, area = Infinity;\r
    for (const pz of piezas) {\r
      const r = pz.rect;\r
      if (!r || x < r.x0 - 14 || x > r.x1 + 14 || y < r.y0 - 14 || y > r.y1 + 14) continue;\r
      const ar = (r.x1 - r.x0) * (r.y1 - r.y0);\r
      if (ar < area) { area = ar; mejor = pz; }\r
    }\r
    return mejor;\r
  };\r
\r
  // --- Ratón y dedo ------------------------------------------------------------------------------------------------\r
  raiz.addEventListener('pointermove', (e) => {\r
    raton.x = e.clientX; raton.y = e.clientY; raton.dentro = true;\r
    raton.nx = (e.clientX / innerWidth) * 2 - 1; raton.ny = (e.clientY / innerHeight) * 2 - 1;\r
  });\r
  raiz.addEventListener('pointerleave', () => { raton.dentro = false; });\r
\r
  let viaje = null;\r
  const enViaje = () => !!viaje && viaje.isActive();\r
  lienzo.addEventListener('click', (e) => {\r
    if (enViaje()) { gsap.to(viaje, { timeScale: 5, duration: 0.3 }); return; }\r
    if (!llegado) return;\r
    const pz = apuntar(e.clientX, e.clientY);\r
    if (pz) lanzar(pz.p.slug);\r
  });\r
\r
  const inundar = raiz.querySelector('[data-pl-inundar]');\r
  function lanzar(slug) {\r
    const pz = piezas.find((q) => q.p.slug === slug);\r
    if (!pz || destino) return;\r
    if (!pz.d.ruta) {\r
      const frase = pz.etq.querySelector('.pl__frase');\r
      clearTimeout(frase._t);\r
      frase.textContent = 'en obras · llega pronto';\r
      if (!reducido) gsap.fromTo(pz.etq.querySelector('.pl__nombre'), { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });\r
      gsap.fromTo(leds[slug], { on: 2 }, { on: 0.35, duration: 0.6, ease: 'power2.out' });\r
      frase._t = setTimeout(() => { frase.textContent = pz.d.frase; }, 1800);\r
      return;\r
    }\r
    if (enViaje()) viaje.progress(1);\r
    destino = pz;\r
    apuntado = pz;\r
    raiz.classList.add('zambullendo');\r
    sonido.viaje(1.3, 1);\r
    if (reducido) { ir(pz.d); return; }\r
    inundar.style.setProperty('--c', pz.d.color);\r
    gsap.timeline({ onComplete: () => ir(pz.d) })\r
      .to(st, { dive: 1, duration: 1.3, ease: 'power2.in' }, 0)\r
      .fromTo(inundar, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.in' }, 0.9);\r
  }\r
  raiz.querySelectorAll('[data-pl-ir]').forEach((a) => {\r
    a.addEventListener('click', (e) => {\r
      e.preventDefault();\r
      if (!llegado) { viaje?.progress(1); }\r
      lanzar(a.dataset.plIr);\r
    });\r
  });\r
\r
  // --- El inspector: la capa por la que vas; al llegar, cuánto lleva encendida (tu visita) --------------------------\r
  const hudCapa = raiz.querySelector('[data-pl-capa]');\r
  const hudEncendida = raiz.querySelector('[data-pl-encendida]');\r
  const cajaInsp = raiz.querySelector('[data-pl-caja]');\r
  const cajaEtq = raiz.querySelector('[data-pl-caja-etq]');\r
  let ultimaCapa = '';\r
  const escribir = (el, texto, demora = 0) => {\r
    clearTimeout(el._t);\r
    if (reducido) { el.textContent = texto; return; }\r
    let n = 0;\r
    el.textContent = '';\r
    const paso = () => { el.textContent = texto.slice(0, ++n); if (n < texto.length) el._t = setTimeout(paso, 14); };\r
    el._t = setTimeout(paso, demora);\r
  };\r
  const tiempo = (s) => (s < 60 ? \`\${Math.round(s)} s\` : \`\${Math.floor(s / 60)} min \${Math.round(s % 60)} s\`);\r
  function textoCapa() {\r
    const y = camara.position.y, A = alturas;\r
    const i = A.capas.findIndex((c) => y > c + 0.3);\r
    const n = i === -1 ? 3 : i;\r
    const [nombre, que] = CAPAS[n];\r
    const zoom = n < 3 ? \` · ×\${coma((A.y0 - A.capas[n]) / (y - A.capas[n]))}\` : '';\r
    return \`capa \${n + 1} de 4 · \${nombre} · \${que}\${zoom}\`;\r
  }\r
\r
  function llegar() {\r
    llegado = true;\r
    raiz.classList.add('llegado');\r
    piezas.forEach((pz) => pz.etq.classList.add('visto'));\r
    const r = rastro();\r
    const metros = r.metros >= 0.1 ? \` · \${coma(r.metros)} m de ratón\` : '';\r
    escribir(hudEncendida, \`encendida desde hace \${tiempo(r.segundos)} · es tu visita\${metros}\`, 300);\r
    // Arrancan como una placa de verdad: primero la BIOS, luego el procesador, el almacenamiento y la gráfica\r
    if (!reducido) {\r
      ARRANQUE.forEach((slug, i) => {\r
        gsap.timeline({ delay: i * 0.16 })\r
          .call(() => sonido.tic(0.45))\r
          .fromTo(leds[slug], { on: 0 }, { on: 1.6, duration: 0.08 })\r
          .to(leds[slug], { on: 0.35, duration: 0.5, ease: 'power2.out' });\r
      });\r
    } else ARRANQUE.forEach((slug) => { leds[slug].on = 0.35; });\r
    sonido.zumbido();\r
  }\r
\r
  // La ola: sale del centro del botón del menú y tiene que llegar más allá de la esquina más lejana\r
  let origen = [0, 0], alcance = 1, cubierta = true;\r
  const medirOla = () => {\r
    const r = boton?.getBoundingClientRect();\r
    origen = r ? [r.left + r.width / 2, r.top + r.height / 2] : [0, 0];\r
    alcance = Math.max(...[[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]].map(([x, y]) => Math.hypot(x - origen[0], y - origen[1]))) + 140;\r
  };\r
  // Mientras avanza (o se retira) chisporrotea, del lado por el que va\r
  const crepitar = (tl, desde, dur, dir) => {\r
    for (let i = 0; i <= 8; i++) {\r
      const k = dir > 0 ? i / 8 : 1 - i / 8;\r
      tl.call(() => sonido.glitch(0.5 + Math.random() * 0.5, Math.min(1, (origen[0] + alcance * k * 0.6) / innerWidth)), null, desde + (i / 8) * dur);\r
    }\r
  };\r
  // Cuando la ola lo tapa todo, la página se esconde y el menú enseña lo suyo (la lista y el inspector); mientras no,\r
  // la página se ve fuera de la ola\r
  function cubrir(si) {\r
    cubierta = si;\r
    raiz.classList.toggle('ola', !si);\r
    if (pagina) pagina.style.visibility = si ? 'hidden' : '';\r
  }\r
\r
  // Primero la ola y, cuando ha cubierto la página, la bajada (más despacio la primera vez de cada visita)\r
  function montarViaje(primera) {\r
    viaje?.kill();\r
    const A = alturas;\r
    Object.assign(st, { y: A.y0, k: 0, sube: 0, ola: 0, dive: 0 });\r
    cubrir(false);\r
    const ola = primera ? 1.25 : 0.85, dur = primera ? 4.6 : 1.9, z = ola + 0.05;\r
    const tl = gsap.timeline({ onComplete: llegar });\r
    tl.call(() => sonido.viaje(ola + 0.2, 1), null, 0)\r
      .to(st, { ola: 1, duration: ola, ease: 'power1.inOut' }, 0)\r
      .call(() => cubrir(true), null, ola)\r
      .call(() => sonido.viaje(dur, 1), null, z)\r
      .to(st, { y: A.yf, duration: dur, ease: 'power2.inOut' }, z)\r
      .to(st, { k: 1, duration: primera ? 1.7 : 0.8, ease: 'power2.inOut' }, z + dur * 0.62)\r
      .to(st, { sube: 1, duration: primera ? 1.2 : 0.6, ease: 'power2.out' }, z + dur * 0.74);\r
    crepitar(tl, 0, ola, 1);\r
    viaje = tl;\r
  }\r
\r
  // --- El bucle, solo con el menú abierto -----------------------------------------------------------------------------\r
  let raf = 0, antes = 0, vivo = false;\r
  function pintar(ahora) {\r
    if (vivo) raf = requestAnimationFrame(pintar);\r
    const dt = Math.min(0.05, (ahora - (antes || ahora)) / 1000);\r
    antes = ahora;\r
    st.T += dt;\r
\r
    // La pieza a la que apuntas (con ratón), y la cámara que se acerca un poco a ella\r
    if (llegado && !destino) {\r
      const pz = raton.dentro && !movil ? apuntar(raton.x, raton.y) : null;\r
      if (pz !== apuntado) {\r
        if (pz) sonido.tic(0.6);\r
        apuntado = pz;\r
        piezas.forEach((q) => q.etq.classList.toggle('on', q === apuntado));\r
        lienzo.style.cursor = apuntado ? 'pointer' : '';\r
      }\r
    }\r
    peso += ((apuntado ? 1 : 0) - peso) * Math.min(1, dt * 4);\r
    const objetivo = apuntado && !destino\r
      ? [((apuntado.h.x0 + apuntado.h.x1) / 2 - final.mira[0]) * 0.14, -1.2, ((apuntado.h.z0 + apuntado.h.z1) / 2 - final.mira[2]) * 0.14]\r
      : [0, 0, 0];\r
    deriva = mezcla(deriva, objetivo.map((v) => v * suave(peso)), Math.min(1, dt * 2.2));\r
    camaraEn();\r
\r
    // Las piezas crecen desde la placa, primero las del centro\r
    for (const m of mallas) {\r
      const s = Math.min(1, Math.max(0, st.sube * 1.5 - m.datos.orden * 0.5));\r
      m.datos.sube = 1 - (1 - s) ** 3;\r
      m.visible = m.datos.sube > 0.004;\r
    }\r
    for (const pz of piezas) {\r
      pz.rect = rectDe(pz);\r
      const b = pz === apuntado ? 1 : 0;\r
      pz.partes.forEach((m) => { m.datos.brillo += (b * 0.55 - m.datos.brillo) * Math.min(1, dt * 6); });\r
    }\r
\r
    // Los buses: un poco de vida en todos; el de la pieza apuntada, entero (y si es el procesador, todos hacia él)\r
    const objetivoBus = [0.12, 0.12, 0.12, 0.12], objetivoSentido = [1, 1, 1, 1];\r
    if (apuntado) {\r
      const id = BUS[apuntado.p.slug] - 1;\r
      if (apuntado.p.slug === 'tech') { objetivoBus.fill(0.85); objetivoSentido.fill(-1); objetivoSentido[3] = 1; }\r
      else objetivoBus[id] = 1;\r
    }\r
    for (let i = 0; i < 4; i++) { bus[i] += (objetivoBus[i] * st.sube - bus[i]) * Math.min(1, dt * 5); sentido[i] = objetivoSentido[i]; }\r
    uniPlaca.uBus.value = bus; uniPlaca.uSentido.value = sentido; uniPlaca.uT.value = st.T;\r
    for (const pz of piezas) {\r
      const l = leds[pz.p.slug];\r
      if (pz === apuntado && l.on < 1.2) l.on += (1.2 - l.on) * Math.min(1, dt * 8);\r
      else if (pz !== apuntado && llegado && !gsap.isTweening(l) && l.on > 0.35) l.on += (0.35 - l.on) * Math.min(1, dt * 4);\r
      // (el LED no brilla en la placa hasta que ha crecido)\r
      uniPlaca[\`uL\${BUS[pz.p.slug]}\`].value = [pz.p.led[0], pz.p.led[1], l.on * l.sube];\r
    }\r
\r
    // Cada capa se ve según lo lejos que esté la cámara: la 1 empieza tapándolo todo (es la pantalla), las de debajo\r
    // asoman por sus huecos y cada una se aparta al pasarla\r
    const A = alturas, y = camara.position.y;\r
    const dist = A.capas.map((c) => y - c);\r
    const u1 = capa1.program.uniforms, u2 = capa2.program.uniforms, u3 = capa3.program.uniforms;\r
    u1.uFondo.value = 1 - entre(A.y0 - 0.15, A.y0 - 3.2, y);\r
    u1.uAlfa.value = entre(1.1, 3.2, dist[0]);\r
    u1.uOla.value = st.ola >= 1 ? 1e5 : st.ola * alcance;\r
    u1.uOrigen.value = origen; u1.uPant.value = [innerWidth, innerHeight];\r
    u2.uAlfa.value = entre(23, 15, dist[1]) * entre(1.1, 3.2, dist[1]);\r
    u3.uAlfa.value = entre(23, 15, dist[2]) * entre(2.4, 5.5, dist[2]);\r
    u3.uPistas.value = entre(13, 7, dist[2]);\r
    for (const u of [u1, u2, u3]) u.uT.value = st.T;\r
    // (mientras la ola no lo cubre todo, solo la capa 1: fuera de la ola tiene que verse la página)\r
    capa1.visible = u1.uAlfa.value > 0.002;\r
    capa2.visible = cubierta && u2.uAlfa.value > 0.002; capa3.visible = cubierta && u3.uAlfa.value > 0.002;\r
    const luz = 0.3 + 0.7 * entre(A.yf + 30, A.yf + 6, y);\r
    uniPlaca.uLuz.value = luz; uniPieza.uLuz.value = luz;\r
\r
    // El inspector: la capa, y la caja de la pieza apuntada con lo que mide en pantalla\r
    const txt = textoCapa();\r
    if (txt !== ultimaCapa) { ultimaCapa = txt; hudCapa.textContent = txt; }\r
    if (apuntado && !movil && !destino) {\r
      const r = apuntado.rect;\r
      cajaInsp.style.transform = \`translate(\${(r.x0 - 6).toFixed(1)}px, \${(r.y0 - 6).toFixed(1)}px)\`;\r
      cajaInsp.style.width = \`\${(r.x1 - r.x0 + 12).toFixed(1)}px\`;\r
      cajaInsp.style.height = \`\${(r.y1 - r.y0 + 12).toFixed(1)}px\`;\r
      cajaInsp.style.setProperty('--c', apuntado.d.color);\r
      const etq = \`\${apuntado.d.ficha} · \${Math.round(r.x1 - r.x0)} × \${Math.round(r.y1 - r.y0)} px\`;\r
      if (cajaEtq.textContent !== etq) cajaEtq.textContent = etq;\r
      cajaInsp.classList.add('on');\r
    } else cajaInsp.classList.remove('on');\r
\r
    // Los nombres, junto a su pieza: en horizontal, debajo si cabe (si no, encima); en vertical, a su derecha\r
    for (const pz of piezas) {\r
      const r = pz.rect;\r
      if (hecho.vertical) {\r
        const x = r.x1 + 14;\r
        pz.etq.style.maxWidth = \`\${Math.max(90, innerWidth - x - 12).toFixed(0)}px\`;\r
        pz.etq.style.transform = \`translate(\${x.toFixed(1)}px, \${((r.y0 + r.y1) / 2).toFixed(1)}px)\`;\r
        continue;\r
      }\r
      const alto = pz.etq.offsetHeight || 60, medio = (pz.etq.offsetWidth || 120) / 2 + 10;\r
      const abajo = r.y1 + 12 + alto < innerHeight - 96;\r
      const x = Math.min(innerWidth - medio, Math.max(medio, (r.x0 + r.x1) / 2));\r
      const yy = abajo ? r.y1 + 12 : r.y0 - 12 - alto;\r
      pz.etq.style.maxWidth = '';\r
      pz.etq.style.transform = \`translate(\${x.toFixed(1)}px, \${yy.toFixed(1)}px)\`;\r
    }\r
\r
    // Con la ola a medias, el lienzo es transparente y solo lleva la capa 1; después, la noche, la placa y las capas\r
    if (cubierta) {\r
      gl.clearColor(...NOCHE, 1);\r
      renderer.render({ scene: mundo, camera: camara });\r
    } else {\r
      gl.clearColor(0, 0, 0, 0);\r
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);\r
    }\r
    renderer.render({ scene: capas, camera: camara, clear: false });\r
  }\r
\r
  // La capa 1, con la página tal cual está ahora mismo; si alguna imagen aún cargaba, se repinta al llegar\r
  let tCapa1 = null;\r
  function pintarCapa1() {\r
    const { lienzo: c, pendientes } = capaVisible(renderer.dpr);\r
    if (tCapa1) gl.deleteTexture(tCapa1.texture);\r
    tCapa1 = textura(c, { mip: false });\r
    capa1.program.uniforms.tMapa.value = tCapa1;\r
    capa1.program.uniforms.tPistas.value = tCapa1;\r
    if (pendientes.length) {\r
      Promise.all(pendientes).then(() => {\r
        if (!vivo || camara.position.y < alturas.capas[0] + 3) return;\r
        const { lienzo: nuevo } = capaVisible(renderer.dpr);\r
        tCapa1.image = nuevo;\r
        tCapa1.needsUpdate = true;\r
      });\r
    }\r
  }\r
\r
  // Lo que pesa, antes de abrir: pintar la placa, sus caras y las capas 2 y 3, y subirlas a la tarjeta gráfica\r
  function precalentar() {\r
    if (!hecho || hecho.vertical !== vertical()) preparar(datos);\r
    if (disp !== hecho.disp) montarPlaca();\r
    texturasPlaca.forEach((t) => t.update());\r
  }\r
\r
  return {\r
    precalentar,\r
    // primera: si es la primera vez en esta visita (el viaje entero, más despacio)\r
    abrir(primera) {\r
      precalentar();\r
      raiz.classList.toggle('en-vertical', hecho.vertical);\r
      medir();\r
      medirOla();\r
      destino = null; apuntado = null; peso = 0; deriva = [0, 0, 0]; llegado = false;\r
      raiz.classList.remove('zambullendo', 'llegado');\r
      inundar.style.opacity = 0;\r
      piezas.forEach((pz) => { pz.etq.classList.remove('visto', 'on'); pz.etq.querySelector('.pl__frase').textContent = pz.d.frase; });\r
      Object.values(leds).forEach((l) => { l.on = 0; });\r
      hudEncendida.textContent = '';\r
      pintarCapa1();\r
      if (reducido) {\r
        Object.assign(st, { y: alturas.yf, k: 1, sube: 1, ola: 1, dive: 0 });\r
        cubrir(true);\r
        llegar();\r
      } else montarViaje(primera);\r
      // El primer fotograma, ahora mismo, con la ola aún dentro del botón\r
      vivo = true; antes = 0;\r
      pintar(performance.now());\r
    },\r
    // El viaje de vuelta hasta la capa 1 y la ola, que se vuelve a meter en el botón y deja la página; la promesa se\r
    // cumple cuando ya no queda nada\r
    salir() {\r
      viaje?.kill();\r
      gsap.killTweensOf(st);\r
      raiz.classList.remove('llegado');\r
      piezas.forEach((pz) => pz.etq.classList.remove('visto', 'on'));\r
      apuntado = null; llegado = false;\r
      clearTimeout(hudEncendida._t); hudEncendida.textContent = '';\r
      sonido.pararZumbido();\r
      if (reducido || !vivo) return Promise.resolve();\r
      sonido.viaje(1, -1);\r
      const arriba = st.y >= alturas.y0 - 0.01, desde = arriba ? 0 : 1.08, ola = 0.8;\r
      return new Promise((listo) => {\r
        const tl = gsap.timeline({ onComplete: listo });\r
        if (!arriba) {\r
          tl.to(st, { sube: 0, duration: 0.35, ease: 'power2.in' }, 0)\r
            .to(st, { k: 0, dive: 0, duration: 0.6, ease: 'power2.inOut' }, 0)\r
            .to(st, { y: alturas.y0, duration: 1, ease: 'power2.inOut' }, 0.05);\r
        }\r
        tl.call(() => { medirOla(); cubrir(false); }, null, desde)\r
          .to(st, { ola: 0, duration: ola, ease: 'power1.inOut' }, desde);\r
        crepitar(tl, desde, ola, -1);\r
      });\r
    },\r
    parar() {\r
      viaje?.kill();\r
      gsap.killTweensOf(st);\r
      cancelAnimationFrame(raf);\r
      vivo = false;\r
    },\r
  };\r
}\r
`,g=`"Geist Mono", ui-monospace, monospace`,_=e=>`rgba(231,226,218,${e})`,v=e=>`rgba(245,203,215,${e})`,y=` .·:-=+*#%@`,b=`h1,h2,h3,h4,h5,h6,p,li,a,button,label,figcaption,blockquote,dt,dd,td,th,legend,summary`,x=new Set([`SPAN`,`EM`,`I`,`B`,`STRONG`,`SMALL`,`SUP`,`SUB`,`BR`,`MARK`,`ABBR`,`TIME`]),S=(e,t)=>e.length>t?`${e.slice(0,t-1)}…`:e,C=e=>e.replace(/\s+/g,` `).trim();function w(e){let t=new Map,n=e=>{let n=t.get(e);return n===void 0&&(n=parseFloat(getComputedStyle(e).opacity),t.set(e,n)),n};return t=>{if(t.checkVisibility&&!t.checkVisibility({opacityProperty:!0,visibilityProperty:!0}))return!1;let r=1;for(let i=t;i&&i!==e.parentElement&&r>=.2;i=i.parentElement)r*=n(i);return r>=.2}}var ee=(e,t,n)=>e.width>2&&e.height>2&&e.bottom>0&&e.top<n&&e.right>0&&e.left<t;function T(e,t){let n=[],r=``;for(let i of e.split(` `)){for(;i.length>t;)r&&=(n.push(r),``),n.push(i.slice(0,t)),i=i.slice(t);r?r.length+1+i.length<=t?r+=` ${i}`:(n.push(r),r=i):r=i}return r&&n.push(r),n}var E=/(\/\/.*$|\/\*.*?\*\/)|(<\/?[\w-]+|\/?>|\b(?:const|let|function|return|import|export|float|vec2|vec3|vec4|uniform|if|else|for|new)\b)|([^</\s]+\s*|\s+|[</])/g;function D(e,t,n,r,{tag:i=.9,txt:a=.86,com:o=.42}={}){let s=n,c=null,l=``,u=()=>{l&&=(e.fillStyle=c,e.fillText(l,s,r),s+=e.measureText(l).width,``)};for(let[,e,n,r]of t.matchAll(E)){let t=e?_(o):n?v(i):_(a);t!==c&&(u(),c=t),l+=e||n||r}u()}function te(e,t){let n=[],r=e=>`<${e.tagName.toLowerCase()}${[...e.attributes].slice(0,3).map(e=>e.value?` ${e.name}="${S(e.value,34)}"`:` ${e.name}`).join(``)}>`,i=e=>[...e.querySelectorAll(`*`)].every(e=>x.has(e.tagName)||e.classList.contains(`letra`)),a=(e,o)=>{if(n.length>=t)return;if(e.nodeType===3){let t=C(e.textContent);t&&n.push([o,S(t,90)]);return}if(e.nodeType!==1)return;let s=e.tagName.toLowerCase();if(s!==`script`&&s!==`style`&&s!==`template`){if(s===`svg`||s===`canvas`||s===`video`)n.push([o,S(`${r(e)}…</${s}>`,110)]);else if(s===`img`||s===`input`||s===`br`||s===`source`)n.push([o,S(r(e),110)]);else if(i(e))n.push([o,S(`${r(e)}${C(e.textContent)}</${s}>`,110)]);else{n.push([o,r(e)]);for(let t of e.childNodes)a(t,o+1);n.push([o,`</${s}>`])}}};return a(e,0),n}function ne(e,t,n,r){if(!t.length)return;e.font=`400 10px ${g}`;let i=e.measureText(`0`).width,a=Math.round(i*58),o=Math.ceil(n/(a+26)),s=Math.ceil(r/14)+1,c=0;for(let n=0;n<o;n++)for(let r=0;r<s;r++){let[i,o]=t[c++%t.length],s=Math.min(i,12)*2;D(e,S(` `.repeat(s)+o,58),n*(a+26)+14,r*14+4,{tag:.3,txt:.17,com:.14})}}function re(e,t,n,r){let i=new Set,a=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let t=a.nextNode();t;t=a.nextNode()){if(!t.textContent.trim()||!t.parentElement)continue;let n=t.parentElement.closest(b);if(!n||!e.contains(n))for(n=t.parentElement;n.parentElement&&n.parentElement!==e&&(x.has(n.tagName)||n.classList.contains(`letra`));)n=n.parentElement;if(i.add(n),i.size>500)break}return[...i].filter(t=>{for(let n=t.parentElement;n&&n!==e;n=n.parentElement)if(i.has(n))return!1;return!0}).map(e=>[e,e.getBoundingClientRect()]).filter(([e,i])=>ee(i,t,n)&&r(e)).slice(0,300)}function O(e,t,n){let r=getComputedStyle(t),i=t.tagName.toLowerCase(),a=t.classList[0],o=`<${i}${a?` class="${a}"`:``}>`,s=`</${i}>`,c=C(t.innerText||t.textContent);if(!c)return;let l=parseFloat(r.fontSize)||16,u=l>=28?`/* ${r.fontWeight} ${Math.round(l)}px ${r.fontFamily.split(`,`)[0].replace(/['"]/g,``)} */`:null,d=Math.max(n.width,60),f=Math.max(n.height,12),p=o.length+c.length+s.length+(u?u.length:0),m=Math.max(8.5,Math.min(Math.sqrt(d*f/(.87*p)),34,l*.9));e.font=`400 ${m}px ${g}`;let h=e.measureText(`0`).width,_=m*1.45,v=Math.max(8,Math.floor(d/h)),y=[S(o,v)];u&&y.push(S(u,v)),y.push(...T(c,v),s);let b=r.textAlign===`center`?.5:+(r.textAlign===`right`||r.textAlign===`end`);y.forEach((t,r)=>{D(e,t,n.left+(d-e.measureText(t).width)*b,n.top+r*_)})}var k=new Map;function A(e,t){let n=k.get(e);return n||(n=new Image,n.decoding=`async`,n.src=e,k.set(e,n)),n.complete&&n.naturalWidth?n:(t.push(new Promise(e=>{n.addEventListener(`load`,e,{once:!0}),n.addEventListener(`error`,e,{once:!0})})),null)}function j(e,t,n,r){let i=t.naturalWidth||t.videoWidth,a=t.naturalHeight||t.videoHeight;if(!i||!a)return;let o=n.width*n.height>3e5?10:8;e.font=`400 ${o}px ${g}`;let s=e.measureText(`0`).width,c=o*1.12,l={x0:Math.max(0,n.left),y0:Math.max(0,n.top),x1:Math.min(innerWidth,n.right),y1:Math.min(innerHeight,n.bottom)},d=Math.floor((l.x1-l.x0)/s),f=Math.floor((l.y1-l.y0)/c);if(d<2||f<2)return;let p=r===`contain`?Math.min(n.width/i,n.height/a):Math.max(n.width/i,n.height/a),m=i*p,h=a*p,v=n.left+(n.width-m)/2,b=n.top+(n.height-h)/2,x=u(d,f).getContext(`2d`,{willReadFrequently:!0});try{x.drawImage(t,(v-l.x0)/(l.x1-l.x0)*d,(b-l.y0)/(l.y1-l.y0)*f,m/(l.x1-l.x0)*d,h/(l.y1-l.y0)*f);let n=x.getImageData(0,0,d,f).data;e.fillStyle=_(.62);for(let t=0;t<f;t++){let r=``;for(let e=0;e<d;e++){let i=(t*d+e)*4,a=(.299*n[i]+.587*n[i+1]+.114*n[i+2])/255*(n[i+3]/255);r+=y[Math.min(10,Math.floor(a*11))]}e.fillText(r,l.x0,l.y0+t*c)}}catch{}}function ie(e,t,n,r){e.font=`400 10px ${g}`,`letterSpacing`in e&&(e.letterSpacing=`0.4px`);let i=t.toUpperCase(),a=e.measureText(i).width+25;e.fillStyle=v(1),e.fillRect(n,r,a,18),e.fillStyle=`#190900`,e.fillRect(n+7,r+6.5,5,5),e.fillText(i,n+18,r+3.5),`letterSpacing`in e&&(e.letterSpacing=`0px`)}function M(e,t,n,r,i,a){let o=t.tagName.toLowerCase(),s=(()=>{if(!r)return null;let e=performance.getEntriesByName(new URL(r,location.href).href)[0],t=e&&(e.encodedBodySize||e.transferSize);return t?`${Math.round(t/1024)} KB`:null})();i&&j(e,i,n,getComputedStyle(t)[o===`img`||o===`video`?`objectFit`:`backgroundSize`]===`contain`?`contain`:`cover`),e.strokeStyle=_(.3),e.lineWidth=1,e.strokeRect(Math.max(.5,n.left+.5),Math.max(.5,n.top+.5),Math.min(n.width,innerWidth)-1,Math.min(n.height,innerHeight)-1);let c=Math.max(8,n.left+8),l=Math.max(92,n.top+8),u=r?decodeURI(new URL(r,location.href).pathname).replace(/^.*\/assets\//,`assets/`):``;if(o===`canvas`){ie(e,`canvas · ${t.width} × ${t.height} px`,c,l),e.font=`400 11px ${g}`,u&&D(e,`texture(tFoto, uv); // ${S(u,48)}`,c,l+26);return}let d=i?.naturalWidth||i?.videoWidth,f=i?.naturalHeight||i?.videoHeight,p=u.split(`.`).pop();ie(e,[o===`img`||o===`video`?o:`fondo`,d?`${d} × ${f}`:null,p,s].filter(Boolean).join(` · `),c,l),e.font=`400 11px ${g}`,D(e,o===`img`?`<img src="${S(u,52)}">`:o===`video`?`<video src="${S(u,50)}">`:`background-image: url("${S(u,40)}");`,c,l+26)}var N=e=>{let t=getComputedStyle(e).backgroundImage,n=t&&t!==`none`&&t.match(/url\(["']?([^"')]+)["']?\)/);return n?n[1]:null};function ae(e,t,n,r,i,a){for(let o of t.querySelectorAll(`*`)){if(o.classList.contains(`letra`))continue;let t=o.tagName,s=o.getBoundingClientRect();if(ee(s,n,r)){if(t===`IMG`||t===`VIDEO`){if(!a(o))continue;M(e,o,s,o.currentSrc||o.src,(t===`IMG`?o.complete&&o.naturalWidth:o.readyState>=2)?o:null,i)}else if(t===`CANVAS`){if(!a(o)||s.width*s.height<2e4)continue;let t=[...o.parentElement?.children||[]].map(e=>e===o?null:N(e)).find(Boolean)||null;M(e,o,s,t,t?A(t,i):null,i)}else if(t===`svg`){if(!a(o))continue;e.strokeStyle=_(.22),e.strokeRect(s.left+.5,s.top+.5,s.width-1,s.height-1),e.font=`400 9px ${g}`,D(e,S(`<svg viewBox="${o.getAttribute(`viewBox`)||``}">`,Math.max(6,Math.floor(s.width/5.4))),s.left+3,s.top+3,{tag:.75,txt:.6})}else if(s.width*s.height>6400){let t=N(o);if(!t||!a(o))continue;M(e,o,s,t,A(t,i),i)}}}}function oe(e){let t=innerWidth,n=innerHeight,r=u(t*e,n*e),i=r.getContext(`2d`);i.scale(e,e),i.textBaseline=`top`;let a=document.querySelector(`main`),o=[];if(a){let e=n/2,r=[...a.children].find(t=>{let n=t.getBoundingClientRect();return n.top<=e&&n.bottom>=e})||a,s=w(a);ne(i,te(r,600),t,n),ae(i,a,t,n,o,s);for(let[e,r]of re(a,t,n,s))O(i,e,r)}return{lienzo:r,pendientes:o}}var P=[[`src/scripts/gl/portada.js`,m,Math.max(0,m.split(`
`).findIndex(e=>e.includes(`precision highp float`))-2)],[`src/scripts/menu/placa.js`,h,0]];function se(e,t){let n=u(e,t),r=n.getContext(`2d`);r.textBaseline=`top`;let i=Math.max(9,Math.round(e/165)),a=Math.round(i*1.55);r.font=`400 ${i}px ${g}`;let o=r.measureText(`0`).width,s=o*84,c=Math.max(1,Math.floor(e/s)),l=(e-c*s)/2,d=Math.floor((t-a*2)/a);for(let e=0;e<c;e++){let[t,n,i]=P[e%P.length],c=n.split(`
`),u=i+Math.floor(e/P.length)*d,f=l+e*s;D(r,`// ${t}`,f,a*.6,{com:.75});for(let e=0;e<d;e++){let t=(u+e)%c.length;r.fillStyle=_(.26),r.fillText(String(t+1).padStart(4,` `),f,a*2+e*a),D(r,S(c[t].replace(/\t/g,`  `),78),f+o*6,a*2+e*a,{tag:.85,txt:.7,com:.38})}}return n}function F(e,t){let n=new TextEncoder().encode(m.slice(m.indexOf(`precision highp float`))),r=u(e,t),i=u(e,t),a=r.getContext(`2d`),o=i.getContext(`2d`);a.textBaseline=`top`;let s=Math.max(9,Math.round(e/150)),c=Math.round(s*1.7);a.font=`400 ${s}px ${g}`;let l=a.measureText(`0`).width,d=l*76,f=Math.max(1,Math.floor(e/d)),p=(e-f*d)/2,h=Math.floor(t/c),y=(e,t)=>e.toString(16).padStart(t,`0`);o.lineCap=`butt`;let b=0;for(let e=0;e<f;e++)for(let t=0;t<h;t++,b++){let r=b*16%n.length,i=p+e*d,u=t*c;a.fillStyle=_(.3),a.fillText(y(r,8),i,u);let f=i+l*10,m=``;for(let e=0;e<16;e++){let t=n[(r+e)%n.length];a.fillStyle=t>127?v(.9):_(.74),a.fillText(y(t,2),f,u);let i=l*(.6+t/255*2.4);o.strokeStyle=v(.55+t/255*.45),o.lineWidth=Math.max(1,s*.12),o.beginPath(),o.moveTo(f+l-i/2,u+s*.55),o.lineTo(f+l+i/2,u+s*.55),o.stroke(),m+=t>=32&&t<127?String.fromCharCode(t):`.`,f+=l*(e===7?4:3)}o.fillStyle=v(.9),o.beginPath(),o.arc(f+l*.6,u+s*.55,s*.2,0,Math.PI*2),o.fill(),a.fillStyle=_(.4),a.fillText(`|${m}|`,f+l,u)}return{texto:r,pistas:i}}var ce={proyectos:1,brand:2,about:3,tech:4},I=`"Geist Mono", ui-monospace, monospace`,L=`"Apple Garamond", Georgia, serif`,R=`#0f0c0a`,z=`#2b2119`,B=`#3d2d1f`,V=`#b8954f`,H=`rgba(231,226,218,.72)`;function U(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var W=(e,t,n,r,i)=>Array.from({length:e},(e,a)=>({x:t+a*n,z:r,...i})),G={w:1.25,h:1.05,d:1.25,color:`#34302c`,metal:.5},K={forma:`pila`,w:.72,h:.9,d:.72,color:`#8d8881`,metal:.9};function q(e){return e?{piezas:[{slug:`about`,x:-3.2,z:-14.4,led:[-3.2,-11.3],designador:`U14 · BAT1`,partes:[{forma:`pila`,dx:-1.9,dz:0,w:3.5,h:.32,d:3.5,color:`#c9c4bc`,metal:1,arriba:`pila`},{dx:2,dz:0,w:2.4,h:.28,d:1.9,color:`#161311`,metal:.2,arriba:`bios`}]},{slug:`tech`,x:-3.2,z:-3.6,led:[-3,2.1],designador:`U1`,partes:[{dx:0,dz:0,w:9.6,h:.45,d:9.6,color:`#25211d`,metal:.35},{dx:0,dz:0,w:6.8,h:.5,d:6.8,y0:.45,color:`#b3ada4`,metal:.9,arriba:`ihs`}]},{slug:`proyectos`,x:-3,z:4.4,led:[-1,6.8],designador:`M2_1`,partes:[{dx:-5.3,dz:0,w:1,h:.55,d:2.9,color:`#1d1a17`,metal:.2},{dx:0,dz:0,w:9.6,h:.18,d:2.6,y0:.32,color:`#151210`,metal:.2,arriba:`ssd`}]},{slug:`brand`,x:-3.2,z:10.8,led:[-3.2,12.9],designador:`PCIE_1`,partes:[{dx:0,dz:0,w:12.6,h:.5,d:1.1,color:`#1b1815`,metal:.1},{dx:.3,dz:0,w:11.6,h:2.6,d:1.6,y0:.3,color:`#1c1916`,metal:.4,arriba:`vga-arriba`,frente:`vga-frente`}]}],decor:W(6,-6.95,1.5,-9.5,G),buses:[{slug:`proyectos`,n:5,ancho:.3,ruta:[[-6,1.2],[-6,1.3],[-7.65,2.95]]},{slug:`brand`,n:6,ancho:.3,ruta:[[.4,1.2],[.4,1.6],[3.6,4.8],[3.6,8.4],[1.75,10.25]]},{slug:`about`,n:4,ancho:.32,ruta:[[1,-8.4],[1.6,-9],[1.6,-12.1],[-.3,-12.1],[-.9,-12.7],[-.9,-13.45]]},{slug:`tech`,n:6,ancho:.28,ruta:[[-8,-1],[-36,-1]]},{slug:`tech`,n:6,ancho:.28,ruta:[[1.6,-1],[36,-1]]}],firma:[-9.4,15.6]}:{piezas:[{slug:`tech`,x:0,z:-1,led:[6.1,-5.4],designador:`U1`,partes:[{dx:0,dz:0,w:9.6,h:.45,d:9.6,color:`#25211d`,metal:.35},{dx:0,dz:0,w:6.8,h:.5,d:6.8,y0:.45,color:`#b3ada4`,metal:.9,arriba:`ihs`}]},{slug:`proyectos`,x:14,z:-1,led:[19.6,-1],designador:`M2_1`,partes:[{dx:-5.3,dz:0,w:1,h:.55,d:2.9,color:`#1d1a17`,metal:.2},{dx:0,dz:0,w:9.6,h:.18,d:2.6,y0:.32,color:`#151210`,metal:.2,arriba:`ssd`}]},{slug:`brand`,x:0,z:8.8,led:[14.2,8.8],designador:`PCIE_1`,partes:[{dx:0,dz:0,w:25.6,h:.5,d:1.1,color:`#1b1815`,metal:.1},{dx:.4,dz:0,w:24,h:3.4,d:1.8,y0:.3,color:`#1c1916`,metal:.4,arriba:`vga-arriba`,frente:`vga-frente`}]},{slug:`about`,x:-12.6,z:-1,led:[-9.6,1.2],designador:`U14 · BAT1`,partes:[{forma:`pila`,dx:-.9,dz:.3,w:3.5,h:.32,d:3.5,color:`#c9c4bc`,metal:1,arriba:`pila`},{dx:1.6,dz:-2.6,w:2.4,h:.28,d:1.9,color:`#161311`,metal:.2,arriba:`bios`}]}],decor:[...W(8,-5.25,1.5,-7.4,G),...W(7,-4.5,1.5,-9,K)],buses:[{slug:`proyectos`,n:6,ancho:.3,ruta:[[4.8,-1],[8.2,-1]]},{slug:`brand`,n:10,ancho:.3,ruta:[[0,3.8],[0,8.25]]},{slug:`about`,n:4,ancho:.32,ruta:[[-4.8,-2.2],[-7.6,-2.2],[-9,-3.6],[-9.8,-3.6]]},{slug:`tech`,n:8,ancho:.28,ruta:[[-4.8,-4.6],[-6.6,-4.6],[-6.6,-12],[-10.2,-15.6],[-36,-15.6]]},{slug:`tech`,n:8,ancho:.28,ruta:[[4.8,-4.6],[6.6,-4.6],[6.6,-12],[10.2,-15.6],[36,-15.6]]}],firma:[-30,12.6]}}function le(e){let t=1/0,n=1/0,r=-1/0,i=-1/0,a=0;for(let o of e.partes)t=Math.min(t,e.x+o.dx-o.w/2),r=Math.max(r,e.x+o.dx+o.w/2),n=Math.min(n,e.z+o.dz-o.d/2),i=Math.max(i,e.z+o.dz+o.d/2),a=Math.max(a,(o.y0||0)+o.h);return{x0:t,z0:n,x1:r,z1:i,h:a}}function ue(e,t){return e.map((n,r)=>{let i=e[Math.max(0,r-1)],a=e[Math.min(e.length-1,r+1)],o=r>0?de(i,n):de(n,a),s=r<e.length-1?de(n,a):o,c=[o[0]+s[0],o[1]+s[1]],l=Math.hypot(c[0],c[1])||1,u=t/Math.max(.35,c[0]/l*o[0]+c[1]/l*o[1]);return[n[0]+c[0]/l*u,n[1]+c[1]/l*u]})}function de(e,t){let n=t[0]-e[0],r=t[1]-e[1],i=Math.hypot(n,r)||1;return[-r/i,n/i]}function J(e,t){let n=t/72,r=e=>(e/72+.5)*t,i=u(t,t),a=u(t,t),o=i.getContext(`2d`),s=a.getContext(`2d`),c=U(2026),l=e.piezas.map(le).concat(e.decor.map(e=>({x0:e.x-e.w/2,x1:e.x+e.w/2,z0:e.z-e.d/2,z1:e.z+e.d/2}))),d=(e,t,n=.6)=>l.every(r=>e<r.x0-n||e>r.x1+n||t<r.z0-n||t>r.z1+n);o.fillStyle=R,o.fillRect(0,0,t,t);for(let e=0;e<26;e++){let e=r((c()-.5)*72),t=r((c()-.5)*72),i=(3+c()*9)*n,a=(2+c()*7)*n;o.fillStyle=`rgba(30,23,18,.55)`,o.fillRect(e,t,i,a)}for(let e=0;e<t*6;e++)o.fillStyle=c()<.5?`rgba(255,240,225,.025)`:`rgba(0,0,0,.18)`,o.fillRect(c()*t,c()*t,1.5,1.5);let f=(e,t,i=.22)=>{o.fillStyle=V,o.beginPath(),o.arc(r(e),r(t),i*n,0,Math.PI*2),o.fill(),o.fillStyle=`#070605`,o.beginPath(),o.arc(r(e),r(t),i*.46*n,0,Math.PI*2),o.fill()},p=(e,t,i)=>{o.strokeStyle=t,o.lineWidth=i*n,o.lineJoin=`round`,o.lineCap=`round`,o.beginPath(),e.forEach(([e,t],n)=>n?o.lineTo(r(e),r(t)):o.moveTo(r(e),r(t))),o.stroke()},m=(e,t,i,a,{color:s=H,fuente:c=I,alinear:l=`left`,peso:u=400}={})=>{o.font=`${u} ${a*n}px ${c}`,o.fillStyle=s,o.textAlign=l,o.textBaseline=`middle`,o.fillText(e,r(t),r(i))},h=[[1,0],[0,1],[-1,0],[0,-1],[.7071,.7071],[-.7071,.7071],[.7071,-.7071],[-.7071,-.7071]],g=[[4,6],[4,5],[5,7],[6,7],[0,1],[1,2],[0,3],[2,3]];for(let e=0;e<t*.18;e++){let e=Math.round((c()-.5)*72*.96*2)/2,t=Math.round((c()-.5)*72*.96*2)/2;if(!d(e,t))continue;let n=[[e,t]],r=Math.floor(c()*4);for(let i=0,a=2+Math.floor(c()*3);i<a;i++){let i=1+c()*6,a=e+h[r][0]*i,o=t+h[r][1]*i;if(!d(a,o)||!d((e+a)/2,(t+o)/2))break;e=a,t=o,n.push([e,t]),r=g[r][c()<.5?0:1]}n.length<2||(p(n,z,.1+c()*.08),c()<.45&&f(...n[0],.15),c()<.45&&f(...n[n.length-1],.15))}for(let e=0;e<t*.16;e++){let e=(c()-.5)*72*.94,t=(c()-.5)*72*.94;if(!d(e,t,.4))continue;let i=c()<.4,a=i?.22:.44,s=i?.44:.22;o.fillStyle=c()<.5?`#2a2420`:`#5b4a36`,o.fillRect(r(e-a/2),r(t-s/2),a*n,s*n),o.fillStyle=V,i?(o.fillRect(r(e-a/2),r(t-s/2),a*n,.09*n),o.fillRect(r(e-a/2),r(t+s/2-.09),a*n,.09*n)):(o.fillRect(r(e-a/2),r(t-s/2),.09*n,s*n),o.fillRect(r(e+a/2-.09),r(t-s/2),.09*n,s*n)),c()<.12&&m(`${c()<.5?`R`:`C`}${100+Math.floor(c()*400)}`,e+.4,t,.3,{color:`rgba(231,226,218,.45)`})}for(let t of e.buses){let e=ce[t.slug];for(let i=0;i<t.n;i++){let a=ue(t.ruta,(i-(t.n-1)/2)*t.ancho);p(a,B,.13),f(...a[a.length-1],.16),s.lineWidth=.2*n,s.lineCap=`butt`;let o=0;for(let t=1;t<a.length;t++){let[n,i]=a[t-1],[c,l]=a[t],u=Math.hypot(c-n,l-i),d=Math.max(1,Math.ceil(u/.12));for(let t=0;t<d;t++){let a=t/d,f=(t+1)/d;s.strokeStyle=`rgb(${e*60},${Math.floor((o+u*a)*12)%256},255)`,s.beginPath(),s.moveTo(r(n+(c-n)*a),r(i+(l-i)*a)),s.lineTo(r(n+(c-n)*f),r(i+(l-i)*f)),s.stroke()}o+=u}}}let _=(e,t,i,a)=>{o.strokeStyle=H,o.lineWidth=.07*n,o.strokeRect(r(e),r(t),(i-e)*n,(a-t)*n)},v={tech:`CPU`,proyectos:`SSD`,brand:`VGA`,about:`BIOS`};for(let t of e.piezas){let e=le(t);_(e.x0-.35,e.z0-.35,e.x1+.35,e.z1+.35),o.fillStyle=H,o.beginPath(),o.moveTo(r(e.x0-.35),r(e.z0-.35)),o.lineTo(r(e.x0+.6),r(e.z0-.35)),o.lineTo(r(e.x0-.35),r(e.z0+.6)),o.fill(),m(t.designador,e.x0-.3,e.z0-.95,.5);let[i,a]=t.led;o.fillStyle=V,o.fillRect(r(i-.42),r(a-.2),.18*n,.4*n),o.fillRect(r(i+.24),r(a-.2),.18*n,.4*n),m(v[t.slug],i+.65,a,.46)}for(let t of e.piezas)if(t.slug===`proyectos`&&f(t.x+5.25,t.z,.55),t.slug===`about`){let e=t.partes[1];for(let i=0;i<4;i++)o.fillStyle=V,o.fillRect(r(t.x+e.dx-.95+i*.62),r(t.z+e.dz-e.d/2-.45),.28*n,.5*n),o.fillRect(r(t.x+e.dx-.95+i*.62),r(t.z+e.dz+e.d/2-.05),.28*n,.5*n)}e.decor.forEach((e,t)=>{e.forma!==`pila`&&m(`L${t+1}`,e.x-e.w/2,e.z-e.d/2-.4,.34,{color:`rgba(231,226,218,.5)`})});let y=e.piezas.map(le),b={x0:Math.min(...y.map(e=>e.x0))-3,x1:Math.max(...y.map(e=>e.x1))+3,z0:Math.min(...y.map(e=>e.z0))-3.5,z1:Math.max(...y.map(e=>e.z1))+2.5};for(let[e,t]of[[b.x0,b.z0],[b.x1,b.z0],[b.x0,b.z1],[b.x1,b.z1]])o.strokeStyle=H,o.lineWidth=.06*n,o.beginPath(),o.arc(r(e),r(t),.9*n,0,Math.PI*2),o.stroke(),f(e,t,.55);let[x,S]=e.firma;return m(`adsPartners`,x,S,1.5,{fuente:L,peso:300}),m(`MADRID · REV. 2026 · BRAND POR FUERA, TECH POR DENTRO`,x,S+1.3,.42),{aspecto:i,senal:a}}function fe(e){let t={},n=(e,n,r,i)=>{let a=u(n,r);i(a.getContext(`2d`),n,r),t[e]=a},r=t=>e.find(e=>e.slug===t)||{};return n(`ihs`,512,512,(e,t,n)=>{let i=e.createLinearGradient(0,0,t,n);i.addColorStop(0,`#c4beb4`),i.addColorStop(1,`#9a948b`),e.fillStyle=i,e.fillRect(0,0,t,n);let a=U(7);for(let r=0;r<700;r++)e.fillStyle=`rgba(${a()<.5?`255,255,255`:`0,0,0`},${.015+a()*.03})`,e.fillRect(0,a()*n,t,1);e.fillStyle=`rgba(70,64,58,.85)`,e.font=`300 78px ${L}`,e.textAlign=`left`,e.textBaseline=`alphabetic`,e.fillText(`adsPartners`,46,168),e.font=`400 19px ${I}`,[`TECH · U1`,...(r(`tech`).frase||``).toUpperCase().split(`, `),`MADRID · 2026`].forEach((t,n)=>e.fillText(t,50,230+n*30));let o=[...new TextEncoder().encode(`adsPartners`)].flatMap(e=>[...e.toString(2).padStart(8,`0`)].map(Number));for(let t=0;t<144;t++)o[t%o.length]&&e.fillRect(360+t%12*9,330+Math.floor(t/12)*9,8,8)}),n(`ssd`,1024,278,(e,t,n)=>{e.fillStyle=`#151210`,e.fillRect(0,0,t,n),e.fillStyle=V;for(let t=0;t<26;t++)t!==6&&e.fillRect(4,14+t*9.6,30,6);let i=(t,n,r,i,a)=>{e.fillStyle=`#211c18`,e.fillRect(t,n,r,i),e.strokeStyle=`rgba(255,255,255,.06)`,e.strokeRect(t+.5,n+.5,r-1,i-1),e.fillStyle=`rgba(231,226,218,.55)`,e.font=`400 15px ${I}`,e.fillText(a,t+12,n+26)};i(90,62,150,150,`ads · ctrl`),i(300,46,230,186,`ads · NAND`),i(580,46,230,186,`ads · NAND`),e.fillStyle=`#e7e2da`,e.fillRect(320,92,470,96),e.fillStyle=`#190900`,e.font=`400 26px ${I}`,e.fillText(`M.2 2280 · ARCHIVO`,340,132),e.font=`400 19px ${I}`,e.fillText((r(`proyectos`).frase||``).toUpperCase(),340,168),e.fillStyle=V,e.beginPath(),e.arc(t-26,n/2,22,0,Math.PI*2),e.fill(),e.fillStyle=`#070605`,e.beginPath(),e.arc(t-26,n/2,10,0,Math.PI*2),e.fill()}),n(`vga-arriba`,1024,76,(e,t,n)=>{e.fillStyle=`#1c1916`,e.fillRect(0,0,t,n),e.fillStyle=`#F5CBD7`,e.fillRect(196,n*.3-1,t*.62-196,2),e.fillStyle=`rgba(0,0,0,.5)`;for(let r=0;r<40;r++)e.fillRect(t*.66+r*8.4,12,4,n-24);e.fillStyle=`#F5CBD7`,e.font=`300 30px ${L}`,e.textBaseline=`middle`,e.fillText(`adsPartners`,22,n*.3)}),n(`vga-frente`,1024,145,(e,t,n)=>{let r=e.createLinearGradient(0,0,0,n);r.addColorStop(0,`#262220`),r.addColorStop(1,`#151210`),e.fillStyle=r,e.fillRect(0,0,t,n);for(let r of[t*.3,t*.7]){let t=n*.42;e.fillStyle=`#0c0a09`,e.beginPath(),e.arc(r,n/2,t,0,Math.PI*2),e.fill(),e.strokeStyle=`rgba(231,226,218,.18)`,e.lineWidth=2,e.stroke(),e.strokeStyle=`rgba(231,226,218,.32)`,e.lineWidth=3;for(let i=0;i<11;i++){let a=i/11*Math.PI*2;e.beginPath(),e.arc(r,n/2,t*.62,a,a+.55),e.stroke()}e.fillStyle=`#F5CBD7`,e.beginPath(),e.arc(r,n/2,t*.22,0,Math.PI*2),e.fill(),e.fillStyle=`#190900`,e.font=`600 ${Math.round(t*.2)}px ${I}`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(`ads`,r,n/2+1)}e.fillStyle=`#F5CBD7`,e.fillRect(0,n-5,t,3)}),n(`bios`,256,202,(e,t,n)=>{e.fillStyle=`#161311`,e.fillRect(0,0,t,n),e.fillStyle=`rgba(231,226,218,.8)`,e.font=`400 44px ${I}`,e.fillText(`BIOS`,34,96),e.font=`400 19px ${I}`,e.fillText(`ads · 2026`,36,136),e.beginPath(),e.arc(26,26,9,0,Math.PI*2),e.fill()}),n(`pila`,512,512,(e,t,n)=>{let r=e.createRadialGradient(t*.4,n*.38,20,t/2,n/2,t/2);r.addColorStop(0,`#e2ddd5`),r.addColorStop(1,`#8f8a83`),e.fillStyle=r,e.fillRect(0,0,t,n),e.fillStyle=`rgba(60,56,52,.8)`,e.textAlign=`center`,e.textBaseline=`middle`,e.font=`400 64px ${I}`,e.fillText(`CR2032`,t/2,n*.46),e.font=`400 40px ${I}`,e.fillText(`3V  +`,t/2,n*.6)}),t}var pe=40,me=Math.tan(pe*Math.PI/360),he=10,ge=10,_e=[18/255,13/255,10/255],ve=[245/255,203/255,215/255],ye=[[`lo que ves`,`HTML y CSS`],[`el código que lo pinta`,`JS y GLSL`],[`lo que entiende la máquina`,`bytes`],[`la placa que lo ejecuta`,`cobre y silicio`]],be=[`about`,`tech`,`proyectos`,`brand`],xe=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),Se=(e,t,n)=>e.map((e,r)=>e+(t[r]-e)*n),Ce=e=>e*e*(3-2*e),Y=(e,t,n)=>Ce(Math.min(1,Math.max(0,(n-e)/(t-e)))),we=()=>innerWidth<innerHeight,Te=(e,t=1)=>e.toFixed(t).replace(`.`,`,`),X=null;function Ee(e){let t=we();if(X&&X.vertical===t)return X;let n=!matchMedia(`(hover: hover) and (pointer: fine)`).matches,r=q(t),i=n?1024:2048,a=t?.75:1.9;return X={vertical:t,disp:r,placa:J(r,n?2048:4096),caras:fe(e),codigo:se(i,Math.round(i/a)),bytes:F(i,Math.round(i/a)),proporcion:a},X}var De=`#version 300 es
in vec3 position; in vec2 uv;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
out vec2 vUv; out vec3 vMundo;
void main() { vUv = uv; vec4 m = modelMatrix * vec4(position, 1.0); vMundo = m.xyz; gl_Position = projectionMatrix * viewMatrix * m; }`,Oe=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 salida;
uniform sampler2D tMapa, tPistas;
uniform float uAlfa, uFondo, uPistas, uT, uBordes, uOla;
uniform vec2 uOrigen, uPant;
uniform vec3 uNoche, uRosa;
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ruido(float x) { float i = floor(x), f = fract(x); return mix(azar(vec2(i, 3.1)), azar(vec2(i + 1.0, 3.1)), f * f * (3.0 - 2.0 * f)); }
vec4 leer(vec2 uv) {
  vec4 a = texture(tMapa, uv);
  if (uPistas > 0.001) a = mix(a, texture(tPistas, uv + vec2(uT * 0.025, 0.0)), uPistas);
  return a;
}
void main() {
  float dentro = 1e5, frente = 0.0, ola = uPant.x > 0.0 ? 1.0 : 0.0;
  if (ola > 0.5) {
    vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uPant - uOrigen;
    float ang = atan(px.y, px.x);
    float onda = (ruido(ang * 5.0 + uT * 1.7) - 0.5) * 70.0 + sin(ang * 11.0 - uT * 6.0) * 12.0;
    dentro = uOla - length(px) + onda;
    frente = exp(-abs(dentro) / 46.0);
  }
  vec2 uv = vUv;
  float banda = floor(uv.y * 46.0);
  float r = azar(vec2(banda, floor(uT * 30.0)));
  uv.x += (r - 0.5) * 0.07 * frente * step(0.45, r);
  float sep = 0.008 * frente;
  vec4 c = leer(uv), cr = leer(uv + vec2(sep, 0.0)), cb = leer(uv - vec2(sep, 0.0));
  vec3 col = mix(vec3(cr.r, c.g, cb.b), uRosa, frente * 0.45);
  float a = max(c.a, max(cr.a, cb.a));
  float fa = uFondo * (1.0 - a), sale = a + fa;
  vec3 res = (col * a + uNoche * fa) / max(sale, 1e-4);
  float borde = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) * smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
  float alfa = sale * uAlfa * mix(1.0, borde, uBordes) * smoothstep(-2.0, 4.0, dentro);
  float hilo = ola * uAlfa * exp(-abs(dentro + 6.0) / 5.0);
  salida = vec4(res * alfa + uRosa * hilo * (1.0 - alfa), alfa + hilo * (1.0 - alfa));
}`,ke=`#version 300 es
precision highp float;
in vec2 vUv; in vec3 vMundo; out vec4 salida;
uniform sampler2D tAspecto, tSenal;
uniform vec3 cameraPosition, uNoche;
uniform float uT, uLuz;
uniform vec4 uBus, uSentido;
uniform vec3 uC1, uC2, uC3, uC4, uL1, uL2, uL3, uL4;
vec3 led(vec3 l, vec3 c, vec2 p) {
  vec2 d = p - l.xy; float r2 = dot(d, d);
  return c * l.z * (exp(-r2 / 0.3) * 1.1 + exp(-r2 / 5.0) * 0.16);
}
void main() {
  vec3 col = texture(tAspecto, vUv).rgb;
  vec2 p = vMundo.xz;
  vec2 lp = p - vec2(-8.0, -10.0);
  col *= 0.72 + 0.5 * exp(-dot(lp, lp) / 700.0);
  vec4 s = texture(tSenal, vUv);
  if (s.a > 0.02) {
    float id = floor(s.r / s.a * 255.0 / 60.0 + 0.5);
    vec4 sel = vec4(equal(vec4(id), vec4(1.0, 2.0, 3.0, 4.0)));
    float k = dot(sel, uBus);
    if (k > 0.001) {
      vec3 c = sel.x * uC1 + sel.y * uC2 + sel.z * uC3 + sel.w * uC4;
      float fase = fract(s.g / s.a * 2.0 - uT * 0.9 * dot(sel, uSentido));
      float pulso = pow(fase, 16.0) * 2.6 + pow(fase, 4.0) * 0.35;
      col += c * k * (0.22 + pulso) * s.a;
    }
  }
  col += led(uL1, uC1, p) + led(uL2, uC2, p) + led(uL3, uC3, p) + led(uL4, uC4, p);
  float d = distance(cameraPosition, vMundo);
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);
  col = mix(uNoche, col, smoothstep(0.5, 0.34, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))));
  salida = vec4(col, 1.0);
}`,Ae=`#version 300 es
in vec3 position; in vec3 normal;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
uniform vec3 uTam; uniform float uY0, uSube;
out vec3 vLocal; out vec3 vN; out vec3 vMundo;
void main() {
  vLocal = position; vN = normal;
  vec3 p = vec3(position.x * uTam.x, (position.y + 0.5) * uTam.y * uSube + uY0, position.z * uTam.z);
  vec4 m = modelMatrix * vec4(p, 1.0);
  vMundo = m.xyz;
  gl_Position = projectionMatrix * viewMatrix * m;
}`,je=`#version 300 es
precision highp float;
in vec3 vLocal; in vec3 vN; in vec3 vMundo; out vec4 salida;
uniform sampler2D tArriba, tFrente;
uniform vec3 cameraPosition, uNoche, uColor, uBorde;
uniform float uMetal, uArriba, uFrente, uLuz, uBrillo;
void main() {
  vec3 n = normalize(vN);
  vec3 base = uColor;
  if (n.y > 0.5 && uArriba > 0.5) base = texture(tArriba, vec2(vLocal.x + 0.5, 0.5 - vLocal.z)).rgb;
  else if (n.z > 0.5 && uFrente > 0.5) base = texture(tFrente, vec2(vLocal.x + 0.5, vLocal.y + 0.5)).rgb;
  vec3 l = normalize(vec3(-0.35, 1.0, 0.3));
  vec3 v = normalize(cameraPosition - vMundo);
  float dif = max(dot(n, l), 0.0);
  float esp = pow(max(dot(n, normalize(l + v)), 0.0), mix(8.0, 56.0, uMetal)) * mix(0.04, 0.55, uMetal);
  vec3 col = base * (0.34 + 0.76 * dif) + vec3(1.0, 0.96, 0.92) * esp;
  col += uBorde * uBrillo * (0.2 + 0.8 * pow(1.0 - max(dot(n, v), 0.0), 2.0));
  float d = distance(cameraPosition, vMundo);
  col = mix(uNoche, col, exp(-d * 0.009) * uLuz);
  salida = vec4(col, 1.0);
}`,Me=`#version 300 es
precision highp float;
in vec2 vUv; in vec3 vMundo; out vec4 salida;
uniform vec2 uTam; uniform float uMargen, uRedondo, uSube;
void main() {
  vec2 p = (vUv - 0.5) * (uTam + 2.0 * uMargen);
  float d = uRedondo > 0.5 ? length(p) - uTam.x * 0.5 : length(max(abs(p) - uTam * 0.5, 0.0));
  salida = vec4(0.0, 0.0, 0.0, (1.0 - smoothstep(0.0, uMargen, d)) * 0.82 * uSube);
}`;function Ne(a,{datos:u,reducido:m,sonido:h,ir:g,pagina:_}){let v=a.querySelector(`[data-pl-lienzo]`),y=document.querySelector(`[data-menu-btn]`),b=!matchMedia(`(hover: hover) and (pointer: fine)`).matches,x;try{x=new r({canvas:v,webgl:2,dpr:Math.min(devicePixelRatio||1,b?1.5:2),alpha:!0,premultipliedAlpha:!0,antialias:!0})}catch{return null}let S=x.gl;if(!S||!x.isWebgl2)return null;let C=new c(S,{fov:pe,near:.05,far:400});C.up.set(0,0,-1);let w=new i,ee=new i,T=(e,{mip:t=!0,filtro:n=S.LINEAR}={})=>new l(S,{image:e,generateMipmaps:t,minFilter:t?S.LINEAR_MIPMAP_LINEAR:n,magFilter:n,wrapS:S.CLAMP_TO_EDGE,wrapT:S.CLAMP_TO_EDGE,anisotropy:t?8:1}),E=new l(S,{image:new Uint8Array([0,0,0,0]),width:1,height:1,generateMipmaps:!1}),D=new d(S),te=new f(S),ne=new p(S,{radialSegments:48}),re=e=>{let t=new n(S,{vertex:De,fragment:Oe,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{tMapa:{value:E},tPistas:{value:E},uAlfa:{value:0},uFondo:{value:0},uPistas:{value:0},uT:{value:0},uBordes:{value:+!!e},uNoche:{value:_e},uRosa:{value:ve},uOla:{value:1e5},uOrigen:{value:[0,0]},uPant:{value:[0,0]}}}),r=new s(S,{geometry:D,program:t,renderOrder:3-e});return r.rotation.x=-Math.PI/2,r.setParent(ee),r},O=re(0),k=re(1),A=re(2),j={tAspecto:{value:E},tSenal:{value:E},uNoche:{value:_e},uT:{value:0},uLuz:{value:1},uBus:{value:[0,0,0,0]},uSentido:{value:[1,1,1,1]},uC1:{value:[1,1,1]},uC2:{value:[1,1,1]},uC3:{value:[1,1,1]},uC4:{value:[1,1,1]},uL1:{value:[0,0,0]},uL2:{value:[0,0,0]},uL3:{value:[0,0,0]},uL4:{value:[0,0,0]}},ie=new s(S,{geometry:D,program:new n(S,{vertex:De,fragment:ke,uniforms:j})});ie.rotation.x=-Math.PI/2,ie.scale.set(72,72,1),ie.setParent(w);let M={};u.forEach(e=>{M[e.slug]=xe(e.color),j[`uC${ce[e.slug]}`].value=M[e.slug]});let N={tArriba:{value:E},tFrente:{value:E},uNoche:{value:_e},uColor:{value:[0,0,0]},uBorde:{value:[0,0,0]},uMetal:{value:0},uArriba:{value:0},uFrente:{value:0},uLuz:{value:1},uBrillo:{value:0},uTam:{value:[1,1,1]},uY0:{value:0},uSube:{value:1}},ae=new n(S,{vertex:Ae,fragment:je,uniforms:N,cullFace:null}),P={uTam:{value:[1,1]},uMargen:{value:.7},uRedondo:{value:0},uSube:{value:0}},se=new n(S,{vertex:De,fragment:Me,uniforms:P,transparent:!0,depthWrite:!1}),F={y:0,k:0,sube:0,ola:1,dive:0,T:0},I={x:0,y:0,nx:0,ny:0,dentro:!1},L=[],R=[],z=null,B=null,V=null,H=null,U=null,W=0,G=null,K=!1,q={},ue=[0,0,0,0],de=[1,1,1,1],J=[0,0,0];function fe(){let e=V.piezas.map(le),t=Math.min(...e.map(e=>e.x0))-1.6,n=Math.max(...e.map(e=>e.x1))+(X.vertical?7.5:1.6),r=Math.min(...e.map(e=>e.z0))-2.2,i=Math.max(...e.map(e=>e.z1))+1.4,a=innerWidth/innerHeight,o=X.vertical?.3:.42,s=Math.max((i-r)/2/(me*(X.vertical?.64:.74)),(n-t)/2/(me*a*.94)),c=[(t+n)/2,0,(r+i)/2+.6];B={pos:[c[0],s*Math.cos(o),c[2]+s*Math.sin(o)],mira:c};let l=B.pos[1];z={yf:l,capas:[l+5+20,l+5+ge,l+5],y0:l+5+20+he},O.position.y=z.capas[0],k.position.y=z.capas[1],A.position.y=z.capas[2];let u=20*me;O.scale.set(u*a,u,1);let d=X.vertical?17:14;k.scale.set(d*X.proporcion,d,1),A.scale.set(d*X.proporcion,d,1)}function Ne(){V=X.disp,H&&H.forEach(e=>S.deleteTexture(e.texture));let e=T(X.placa.aspecto),t=T(X.placa.senal,{mip:!1});j.tAspecto.value=e,j.tSenal.value=t;let n={};for(let[e,t]of Object.entries(X.caras))n[e]=T(t);N.tArriba.value=n.ihs,k.program.uniforms.tMapa.value=T(X.codigo),A.program.uniforms.tMapa.value=T(X.bytes.texto),A.program.uniforms.tPistas.value=T(X.bytes.pistas),H=[e,t,...Object.values(n),k.program.uniforms.tMapa.value,A.program.uniforms.tMapa.value,A.program.uniforms.tPistas.value],R.forEach(e=>e.setParent(null)),R=[];let r=(e,t,r,i,a={})=>{let o=new s(S,{geometry:e===`pila`?ne:te,program:ae,frustumCulled:!1});if(o.position.set(t,0,r),o.datos={tam:[i.w,i.h,i.d],y0:i.y0||0,color:i.color?xe(i.color):[0,0,0],metal:i.metal||0,arriba:i.arriba?n[i.arriba]:null,frente:i.frente?n[i.frente]:null,orden:Math.min(1,Math.hypot(t,r)/22),sube:0,brillo:0,...a},o.onBeforeRender(()=>{let e=o.datos;N.uTam.value=e.tam,N.uY0.value=e.y0,N.uSube.value=Math.max(.001,e.sube),N.uColor.value=e.led?Se([.16,.05,.05],e.ledColor,Math.min(1,e.on)):e.color,N.uMetal.value=e.metal,N.uArriba.value=+!!e.arriba,N.uFrente.value=+!!e.frente,N.tArriba.value=e.arriba||n.ihs,N.tFrente.value=e.frente||n.ihs,N.uBorde.value=e.borde||[0,0,0],N.uBrillo.value=e.led?e.on*1.4:e.brillo||0}),o.setParent(w),R.push(o),!a.led){let n=new s(S,{geometry:D,program:se});n.rotation.x=-Math.PI/2,n.position.set(t,.015,r),n.scale.set(i.w+1.4,i.d+1.4,1),n.datos=o.datos,n.onBeforeRender(()=>{P.uTam.value=[i.w,i.d],P.uRedondo.value=+(e===`pila`),P.uSube.value=o.datos.sube}),n.setParent(w),R.push(n)}return o};L=V.piezas.map(e=>{let t=u.find(t=>t.slug===e.slug),n=e.partes.map(t=>r(t.forma,e.x+t.dx,e.z+t.dz,t,{borde:M[e.slug]})),i=r(`caja`,e.led[0],e.led[1],{w:.5,h:.22,d:.3},{led:!0,ledColor:M[e.slug],borde:M[e.slug],on:0});return q[e.slug]=i.datos,{p:e,d:t,partes:n,led:i,h:le(e),rect:null,etq:a.querySelector(`[data-pl-dest="${e.slug}"]`)}}),V.decor.forEach(e=>r(e.forma,e.x,e.z,e)),fe()}let Pe=()=>{x.setSize(innerWidth,innerHeight),C.perspective({aspect:S.canvas.width/S.canvas.height}),V&&fe()};addEventListener(`resize`,Pe);let Fe=()=>{let e=Ce(Math.min(1,F.k)),t=[B.pos[0]*e,F.y,B.pos[2]*e],n=[B.mira[0]*e,0,B.mira[2]*e],r=K&&I.dentro&&!b&&!G;if(t=[t[0]+J[0]+(r?I.nx*1.1:0),t[1]+J[1],t[2]+J[2]+(r?I.ny*.8:0)],n=[n[0]+J[0]*.6,n[1],n[2]+J[2]*.6],G&&F.dive>0){let e=F.dive*F.dive,r=[(G.h.x0+G.h.x1)/2,G.h.h,(G.h.z0+G.h.z1)/2];t=Se(t,[r[0],r[1]+1.6,r[2]+.01],e),n=Se(n,r,e)}C.position.set(...t),C.lookAt(n),C.updateMatrixWorld()},Ie=new o,Le=e=>{let{x0:t,x1:n,z0:r,z1:i,h:a}=e.h,o=a*Math.max(0,Math.min(1,e.partes[0].datos.sube)),s=1/0,c=1/0,l=-1/0,u=-1/0;for(let e of[t,n])for(let t of[0,o])for(let n of[r,i]){Ie.set(e,t,n),C.project(Ie);let r=(Ie.x+1)/2*innerWidth,i=(1-Ie.y)/2*innerHeight;s=Math.min(s,r),c=Math.min(c,i),l=Math.max(l,r),u=Math.max(u,i)}return{x0:s,y0:c,x1:l,y1:u}},Re=(e,t)=>{let n=null,r=1/0;for(let i of L){let a=i.rect;if(!a||e<a.x0-14||e>a.x1+14||t<a.y0-14||t>a.y1+14)continue;let o=(a.x1-a.x0)*(a.y1-a.y0);o<r&&(r=o,n=i)}return n};a.addEventListener(`pointermove`,e=>{I.x=e.clientX,I.y=e.clientY,I.dentro=!0,I.nx=e.clientX/innerWidth*2-1,I.ny=e.clientY/innerHeight*2-1}),a.addEventListener(`pointerleave`,()=>{I.dentro=!1});let Z=null,ze=()=>!!Z&&Z.isActive();v.addEventListener(`click`,t=>{if(ze()){e.to(Z,{timeScale:5,duration:.3});return}if(!K)return;let n=Re(t.clientX,t.clientY);n&&Ve(n.p.slug)});let Be=a.querySelector(`[data-pl-inundar]`);function Ve(t){let n=L.find(e=>e.p.slug===t);if(n&&!G){if(n.d.ruta)ze()&&Z.progress(1),G=n,U=n,a.classList.add(`zambullendo`),h.viaje(1.3,1),m?g(n.d):(Be.style.setProperty(`--c`,n.d.color),e.timeline({onComplete:()=>g(n.d)}).to(F,{dive:1,duration:1.3,ease:`power2.in`},0).fromTo(Be,{opacity:0},{opacity:1,duration:.45,ease:`power1.in`},.9));else{let r=n.etq.querySelector(`.pl__frase`);clearTimeout(r._t),r.textContent=`en obras · llega pronto`,m||e.fromTo(n.etq.querySelector(`.pl__nombre`),{x:-8},{x:0,duration:.5,ease:`elastic.out(1, 0.3)`,clearProps:`x`}),e.fromTo(q[t],{on:2},{on:.35,duration:.6,ease:`power2.out`}),r._t=setTimeout(()=>{r.textContent=n.d.frase},1800)}}}a.querySelectorAll(`[data-pl-ir]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),K||Z?.progress(1),Ve(e.dataset.plIr)})});let He=a.querySelector(`[data-pl-capa]`),Ue=a.querySelector(`[data-pl-encendida]`),Q=a.querySelector(`[data-pl-caja]`),We=a.querySelector(`[data-pl-caja-etq]`),Ge=``,Ke=(e,t,n=0)=>{if(clearTimeout(e._t),m){e.textContent=t;return}let r=0;e.textContent=``;let i=()=>{e.textContent=t.slice(0,++r),r<t.length&&(e._t=setTimeout(i,14))};e._t=setTimeout(i,n)},qe=e=>e<60?`${Math.round(e)} s`:`${Math.floor(e/60)} min ${Math.round(e%60)} s`;function Je(){let e=C.position.y,t=z,n=t.capas.findIndex(t=>e>t+.3),r=n===-1?3:n,[i,a]=ye[r],o=r<3?` · ×${Te((t.y0-t.capas[r])/(e-t.capas[r]))}`:``;return`capa ${r+1} de 4 · ${i} · ${a}${o}`}function Ye(){K=!0,a.classList.add(`llegado`),L.forEach(e=>e.etq.classList.add(`visto`));let n=t(),r=n.metros>=.1?` · ${Te(n.metros)} m de ratón`:``;Ke(Ue,`encendida desde hace ${qe(n.segundos)} · es tu visita${r}`,300),m?be.forEach(e=>{q[e].on=.35}):be.forEach((t,n)=>{e.timeline({delay:n*.16}).call(()=>h.tic(.45)).fromTo(q[t],{on:0},{on:1.6,duration:.08}).to(q[t],{on:.35,duration:.5,ease:`power2.out`})}),h.zumbido()}let Xe=[0,0],Ze=1,Qe=!0,$e=()=>{let e=y?.getBoundingClientRect();Xe=e?[e.left+e.width/2,e.top+e.height/2]:[0,0],Ze=Math.max(...[[0,0],[innerWidth,0],[0,innerHeight],[innerWidth,innerHeight]].map(([e,t])=>Math.hypot(e-Xe[0],t-Xe[1])))+140},et=(e,t,n,r)=>{for(let i=0;i<=8;i++){let a=r>0?i/8:1-i/8;e.call(()=>h.glitch(.5+Math.random()*.5,Math.min(1,(Xe[0]+Ze*a*.6)/innerWidth)),null,t+i/8*n)}};function tt(e){Qe=e,a.classList.toggle(`ola`,!e),_&&(_.style.visibility=e?`hidden`:``)}function nt(t){Z?.kill();let n=z;Object.assign(F,{y:n.y0,k:0,sube:0,ola:0,dive:0}),tt(!1);let r=t?1.25:.85,i=t?4.6:1.9,a=r+.05,o=e.timeline({onComplete:Ye});o.call(()=>h.viaje(r+.2,1),null,0).to(F,{ola:1,duration:r,ease:`power1.inOut`},0).call(()=>tt(!0),null,r).call(()=>h.viaje(i,1),null,a).to(F,{y:n.yf,duration:i,ease:`power2.inOut`},a).to(F,{k:1,duration:t?1.7:.8,ease:`power2.inOut`},a+i*.62).to(F,{sube:1,duration:t?1.2:.6,ease:`power2.out`},a+i*.74),et(o,0,r,1),Z=o}let rt=0,it=0,at=!1;function ot(t){at&&(rt=requestAnimationFrame(ot));let n=Math.min(.05,(t-(it||t))/1e3);if(it=t,F.T+=n,K&&!G){let e=I.dentro&&!b?Re(I.x,I.y):null;e!==U&&(e&&h.tic(.6),U=e,L.forEach(e=>e.etq.classList.toggle(`on`,e===U)),v.style.cursor=U?`pointer`:``)}W+=(+!!U-W)*Math.min(1,n*4);let r=U&&!G?[((U.h.x0+U.h.x1)/2-B.mira[0])*.14,-1.2,((U.h.z0+U.h.z1)/2-B.mira[2])*.14]:[0,0,0];J=Se(J,r.map(e=>e*Ce(W)),Math.min(1,n*2.2)),Fe();for(let e of R){let t=Math.min(1,Math.max(0,F.sube*1.5-e.datos.orden*.5));e.datos.sube=1-(1-t)**3,e.visible=e.datos.sube>.004}for(let e of L){e.rect=Le(e);let t=+(e===U);e.partes.forEach(e=>{e.datos.brillo+=(t*.55-e.datos.brillo)*Math.min(1,n*6)})}let i=[.12,.12,.12,.12],a=[1,1,1,1];if(U){let e=ce[U.p.slug]-1;U.p.slug===`tech`?(i.fill(.85),a.fill(-1),a[3]=1):i[e]=1}for(let e=0;e<4;e++)ue[e]+=(i[e]*F.sube-ue[e])*Math.min(1,n*5),de[e]=a[e];j.uBus.value=ue,j.uSentido.value=de,j.uT.value=F.T;for(let t of L){let r=q[t.p.slug];t===U&&r.on<1.2?r.on+=(1.2-r.on)*Math.min(1,n*8):t!==U&&K&&!e.isTweening(r)&&r.on>.35&&(r.on+=(.35-r.on)*Math.min(1,n*4)),j[`uL${ce[t.p.slug]}`].value=[t.p.led[0],t.p.led[1],r.on*r.sube]}let o=z,s=C.position.y,c=o.capas.map(e=>s-e),l=O.program.uniforms,u=k.program.uniforms,d=A.program.uniforms;l.uFondo.value=1-Y(o.y0-.15,o.y0-3.2,s),l.uAlfa.value=Y(1.1,3.2,c[0]),l.uOla.value=F.ola>=1?1e5:F.ola*Ze,l.uOrigen.value=Xe,l.uPant.value=[innerWidth,innerHeight],u.uAlfa.value=Y(23,15,c[1])*Y(1.1,3.2,c[1]),d.uAlfa.value=Y(23,15,c[2])*Y(2.4,5.5,c[2]),d.uPistas.value=Y(13,7,c[2]);for(let e of[l,u,d])e.uT.value=F.T;O.visible=l.uAlfa.value>.002,k.visible=Qe&&u.uAlfa.value>.002,A.visible=Qe&&d.uAlfa.value>.002;let f=.3+.7*Y(o.yf+30,o.yf+6,s);j.uLuz.value=f,N.uLuz.value=f;let p=Je();if(p!==Ge&&(Ge=p,He.textContent=p),U&&!b&&!G){let e=U.rect;Q.style.transform=`translate(${(e.x0-6).toFixed(1)}px, ${(e.y0-6).toFixed(1)}px)`,Q.style.width=`${(e.x1-e.x0+12).toFixed(1)}px`,Q.style.height=`${(e.y1-e.y0+12).toFixed(1)}px`,Q.style.setProperty(`--c`,U.d.color);let t=`${U.d.ficha} · ${Math.round(e.x1-e.x0)} × ${Math.round(e.y1-e.y0)} px`;We.textContent!==t&&(We.textContent=t),Q.classList.add(`on`)}else Q.classList.remove(`on`);for(let e of L){let t=e.rect;if(X.vertical){let n=t.x1+14;e.etq.style.maxWidth=`${Math.max(90,innerWidth-n-12).toFixed(0)}px`,e.etq.style.transform=`translate(${n.toFixed(1)}px, ${((t.y0+t.y1)/2).toFixed(1)}px)`;continue}let n=e.etq.offsetHeight||60,r=(e.etq.offsetWidth||120)/2+10,i=t.y1+12+n<innerHeight-96,a=Math.min(innerWidth-r,Math.max(r,(t.x0+t.x1)/2)),o=i?t.y1+12:t.y0-12-n;e.etq.style.maxWidth=``,e.etq.style.transform=`translate(${a.toFixed(1)}px, ${o.toFixed(1)}px)`}Qe?(S.clearColor(..._e,1),x.render({scene:w,camera:C})):(S.clearColor(0,0,0,0),S.clear(S.COLOR_BUFFER_BIT|S.DEPTH_BUFFER_BIT)),x.render({scene:ee,camera:C,clear:!1})}let $=null;function st(){let{lienzo:e,pendientes:t}=oe(x.dpr);$&&S.deleteTexture($.texture),$=T(e,{mip:!1}),O.program.uniforms.tMapa.value=$,O.program.uniforms.tPistas.value=$,t.length&&Promise.all(t).then(()=>{if(!at||C.position.y<z.capas[0]+3)return;let{lienzo:e}=oe(x.dpr);$.image=e,$.needsUpdate=!0})}function ct(){X&&X.vertical===we()||Ee(u),V!==X.disp&&Ne(),H.forEach(e=>e.update())}return{precalentar:ct,abrir(e){ct(),a.classList.toggle(`en-vertical`,X.vertical),Pe(),$e(),G=null,U=null,W=0,J=[0,0,0],K=!1,a.classList.remove(`zambullendo`,`llegado`),Be.style.opacity=0,L.forEach(e=>{e.etq.classList.remove(`visto`,`on`),e.etq.querySelector(`.pl__frase`).textContent=e.d.frase}),Object.values(q).forEach(e=>{e.on=0}),Ue.textContent=``,st(),m?(Object.assign(F,{y:z.yf,k:1,sube:1,ola:1,dive:0}),tt(!0),Ye()):nt(e),at=!0,it=0,ot(performance.now())},salir(){if(Z?.kill(),e.killTweensOf(F),a.classList.remove(`llegado`),L.forEach(e=>e.etq.classList.remove(`visto`,`on`)),U=null,K=!1,clearTimeout(Ue._t),Ue.textContent=``,h.pararZumbido(),m||!at)return Promise.resolve();h.viaje(1,-1);let t=F.y>=z.y0-.01,n=t?0:1.08,r=.8;return new Promise(i=>{let a=e.timeline({onComplete:i});t||a.to(F,{sube:0,duration:.35,ease:`power2.in`},0).to(F,{k:0,dive:0,duration:.6,ease:`power2.inOut`},0).to(F,{y:z.y0,duration:1,ease:`power2.inOut`},.05),a.call(()=>{$e(),tt(!1)},null,n).to(F,{ola:0,duration:r,ease:`power1.inOut`},n),et(a,n,r,-1)})},parar(){Z?.kill(),e.killTweensOf(F),cancelAnimationFrame(rt),at=!1}}}export{Ne as crear,Ee as preparar};