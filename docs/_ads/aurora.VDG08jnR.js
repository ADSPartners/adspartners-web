import{O as e}from"./preload-helper.DdhWbQZk.js";import{t}from"./index.astro_astro_type_script_index_0_lang.CERwc9hR.js";import{a as n,i as r,t as i}from"./Mesh.D48iXpEj.js";import{n as a,t as o}from"./Triangle.Bz5SUztQ.js";var s={tech:[-25,30,-82],proyectos:[28,40,-98],brand:[-27,-8,-86],about:[26,-2,-82]},c=[0,112,-260],ee=[.506,.369],te=[[0,`troposfera`],[12,`estratosfera`],[50,`mesosfera`],[85,`termosfera · aquí empiezan las auroras`]],l=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),ne=e=>l(e).map(e=>e**2.2),u=(e,t,n)=>e.map((e,r)=>e+(t[r]-e)*n),d=e=>e*e*(3-2*e),re=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,ie=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 salida;
uniform vec2 uRes;
uniform float uT, uTA;
uniform sampler2D tFoto; uniform vec2 uFotoTam; uniform vec2 uSolUv; uniform float uZoom, uMezcla;
uniform vec3 uCam, uDer, uArr, uFre; uniform float uFoco;
uniform vec3 uSol; uniform float uEstrellas, uAurora, uPasos, uVel;
uniform vec3 uTinte; uniform float uTinteK;
uniform vec3 uP0, uP1, uP2, uP3, uC0, uC1, uC2, uC3; uniform vec4 uLuzP;

const float R = 6371.0;
float azar(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p), s = f * f * (3.0 - 2.0 * f);
  return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), s.x), mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), s.x), s.y);
}

// --- 1 · La puesta de sol de la portada, y la cámara que va hacia el sol -------------------------------------------
vec2 escalaFoto() {
  float ar = uRes.x / uRes.y, ai = uFotoTam.x / uFotoTam.y;
  return ar > ai ? vec2(1.0, ai / ar) : vec2(ar / ai, 1.0);
}
vec3 puesta(vec2 uv) {
  vec2 s = escalaFoto();
  float z = 1.0 + pow(uZoom, 2.3) * 26.0;
  vec2 solPant = (uSolUv - 0.5) / s + 0.5;
  vec2 ancla = mix(solPant, vec2(0.5), smoothstep(0.0, 0.8, uZoom));   // el sol se va al centro mientras te acercas
  vec2 f = uSolUv + (uv - ancla) * s / z;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 12; i++) {                    // desenfoque de velocidad hacia el sol
    float k = 1.0 - float(i) * 0.016 * uZoom;
    acc += texture(tFoto, uSolUv + (f - uSolUv) * k).rgb;
  }
  acc /= 12.0;
  vec3 col = pow(acc, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);   // la foto en clave de noche, como en la portada
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  col *= mix(mix(0.5, 1.0, vig), 1.0, uZoom);
  float d = length((uv - ancla) * vec2(uRes.x / uRes.y, 1.0));
  col *= 1.0 + uZoom * 2.4;
  col += vec3(1.0, 0.8, 0.55) * exp(-d * mix(10.0, 1.4, uZoom)) * (0.15 + 2.6 * uZoom * uZoom);
  return mix(col, vec3(1.0, 0.94, 0.84), smoothstep(0.84, 1.0, uZoom));   // el fogonazo
}

// --- 2 · El cielo: la atmósfera según la altura, la curva de la Tierra, las estrellas y el sol --------------------------
vec3 estrellas(vec3 rd) {
  vec3 p = rd * 140.0;
  vec3 i = floor(p), f = fract(p);
  float h = azar(i.xy + i.z * 17.13);
  if (h < 0.972) return vec3(0.0);
  vec3 c = vec3(azar(i.yz + 1.7), azar(i.zx + 4.3), azar(i.xy + 9.1)) * 0.6 + 0.2;
  float b = smoothstep(0.16, 0.0, length(f - c)) * (h - 0.972) * 36.0;
  float tw = 0.7 + 0.3 * sin(uTA * (1.0 + h * 6.0) + h * 40.0);
  return mix(vec3(1.0, 0.86, 0.72), vec3(0.75, 0.86, 1.0), azar(i.xz)) * b * tw * 4.0;
}
vec3 cielo(vec3 ro, vec3 rd) {
  float alt = max(ro.y, 0.01);
  float dip = -acos(R / (R + alt));                 // a qué ángulo queda el horizonte desde esta altura
  float sobre = asin(clamp(rd.y, -1.0, 1.0)) - dip;
  float aire = exp(-alt / 9.0);                     // cuánta atmósfera queda encima
  float s = max(dot(rd, uSol), 0.0);
  vec3 col;
  if (sobre >= 0.0) {
    vec3 tarde = mix(vec3(1.0, 0.6, 0.3), vec3(0.14, 0.2, 0.42), smoothstep(0.0, 0.55, sobre));
    tarde = mix(tarde, vec3(1.0, 0.78, 0.5), pow(s, 5.0) * 0.7);
    col = tarde * aire + estrellas(rd) * uEstrellas * (1.0 - aire);
  } else {
    float bajo = -sobre;
    vec3 noche = vec3(0.006, 0.009, 0.02) + vec3(0.03, 0.06, 0.14) * exp(-bajo / 0.035) * (1.0 - aire);
    noche += vec3(0.5, 0.26, 0.1) * pow(s, 6.0) * exp(-bajo / 0.025) * (1.0 - aire);
    col = mix(noche, vec3(0.07, 0.04, 0.025) * (0.4 + 0.6 * pow(s, 3.0)), aire);
  }
  // La curva de la Tierra: una banda azul fina justo encima del horizonte, cálida del lado del sol
  float banda = exp(-pow(sobre / 0.014, 2.0)) * (1.0 - aire);
  col += banda * mix(vec3(0.2, 0.45, 1.0), vec3(1.0, 0.55, 0.28), pow(s, 2.5)) * 1.3;
  col += vec3(1.0, 0.9, 0.75) * (pow(s, 2200.0) * 40.0 + pow(s, 90.0) * 0.5 + pow(s, 9.0) * 0.18 * (0.4 + aire));
  return col;
}

// --- 3 · La aurora: cortinas de luz en volumen, entre 100 y 330 km --------------------------------------------------
vec3 colorAurora(float h) {
  vec3 c = mix(vec3(1.0, 0.3, 0.62), vec3(0.36, 1.0, 0.44), smoothstep(0.004, 0.03, h));    // borde rosa, cuerpo verde
  c = mix(c, vec3(1.0, 0.22, 0.24), smoothstep(0.4, 0.8, h));                                 // rojo arriba
  return mix(c, uTinte * (0.85 + 0.3 * h), uTinteK * smoothstep(0.01, 0.06, h));             // el punto al que apuntas
}
float densidad(vec3 p, out float h) {
  float base = 100.0 + 7.0 * ruido(p.xz * 0.008 + uT * 0.03);
  h = (p.y - base) / 220.0;
  if (h < -0.02 || h > 1.15) return 0.0;
  // El borde de abajo, nítido y más brillante; los rayos se apagan hacia arriba
  float perfil = smoothstep(-0.012, 0.004, h) * (exp(-h * 3.2) * 0.85 + 0.1 * exp(-h) + exp(-h * 45.0) * 0.9);
  float d = 0.0;
  // Cortinas a lo largo del viaje: un pasillo de luz que se pliega, con rayos finos a lo largo (las estrías de una
  // aurora de verdad) y zonas más y menos encendidas. Empiezan un poco por delante, para verlas venir. Lejos de una
  // cortina no se calcula su ruido
  float empieza = smoothstep(-30.0, -110.0, p.z);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float xc = (fi - 1.5) * 56.0 + 26.0 * sin(p.z * 0.019 + uT * 0.22 + fi * 1.7) + 8.0 * sin(p.z * 0.051 - uT * 0.37 + fi * 2.3);
    float g = (p.x - xc) * (p.x - xc) * 0.065;
    if (g > 7.0) continue;
    float zona = smoothstep(0.15, 0.75, ruido(vec2(p.z * 0.018 + fi * 9.0, uT * 0.12)));
    float rayos = pow(ruido(vec2(p.z * 0.75 + fi * 31.0, uT * 0.5 + fi)), 2.0) * 0.85 + ruido(vec2(p.z * 0.23 + fi * 7.0, uT * 0.3)) * 0.35;
    d += exp(-g) * rayos * (0.25 + 0.75 * zona) * 1.5;
  }
  d *= empieza;
  // Dos arcos que cruzan: uno se atraviesa en el viaje; el otro queda al fondo, detrás de los puntos
  for (int j = 0; j < 2; j++) {
    float fj = float(j);
    float zc = mix(-140.0, -440.0, fj) + mix(15.0, 30.0, fj) * sin(p.x * 0.013 + uT * 0.2 + fj * 2.0);
    float g = (p.z - zc) * (p.z - zc) * mix(0.06, 0.012, fj);   // el del fondo, más ancho: se ve de lejos
    if (g > 7.0) continue;
    float rayos = pow(ruido(vec2(p.x * 0.75 + fj * 13.0, uT * 0.5)), 2.0) * 0.85 + ruido(vec2(p.x * 0.23 + fj * 5.0, uT * 0.3)) * 0.35;
    d += exp(-g) * rayos * mix(1.2, 2.2, fj);
  }
  return d * perfil;
}
vec3 aurora(vec3 ro, vec3 rd) {
  float t0, t1;
  if (abs(rd.y) < 1e-4) {
    if (ro.y < 95.0 || ro.y > 340.0) return vec3(0.0);
    t0 = 0.0; t1 = 900.0;
  } else {
    float ta = (95.0 - ro.y) / rd.y, tb = (340.0 - ro.y) / rd.y;
    t0 = max(min(ta, tb), 0.0); t1 = min(max(ta, tb), 900.0);
  }
  if (t1 <= t0) return vec3(0.0);
  vec3 acc = vec3(0.0);
  float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float t = t0 + ign * 0.9;
  for (int i = 0; i < 72; i++) {
    if (float(i) >= uPasos || t > t1) break;
    float dt = max(0.8, t * 0.058);
    float h;
    float d = densidad(ro + rd * t, h);
    acc += colorAurora(h) * d * dt;
    t += dt;
  }
  return acc * 0.055;
}

// --- 4 · Los puntos: una luz con su halo, en su color ---------------------------------------------------------------
vec3 punto(vec3 ro, vec3 rd, vec3 P, vec3 c, float luz) {
  vec3 v = P - ro;
  float t = dot(v, rd);
  if (t <= 0.0) return vec3(0.0);
  float a = length(v - rd * t) / t;                  // separación angular
  float latido = 0.85 + 0.15 * sin(uTA * 2.2 + P.x);
  return (c * exp(-a * 34.0) * 0.55 + mix(c, vec3(1.0), 0.6) * exp(-a * a * 9000.0) * 1.6) * luz * latido;
}

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);
  if (uMezcla < 1.0) col = puesta(uv);
  if (uMezcla > 0.0) {
    vec2 q = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
    vec3 rd = normalize(q.x * uDer + q.y * uArr + uFoco * uFre);
    vec3 e = cielo(uCam, rd);
    if (uAurora > 0.0) e += aurora(uCam, rd) * uAurora;
    e += punto(uCam, rd, uP0, uC0, uLuzP.x) + punto(uCam, rd, uP1, uC1, uLuzP.y) + punto(uCam, rd, uP2, uC2, uLuzP.z) + punto(uCam, rd, uP3, uC3, uLuzP.w);
    // Estelas al volar hacia un punto
    float r = length(q), ang = atan(q.y, q.x);
    e += mix(vec3(1.0), uTinte, 0.5) * pow(ruido(vec2(ang * 70.0, 0.0)), 7.0) * smoothstep(0.2, 1.3, r) * uVel * 1.6;
    e = 1.0 - exp(-e * 1.25);                        // revelado suave, sin quemar los blancos
    col = mix(col, e, uMezcla);
  }
  float vig = smoothstep(1.45, 0.45, length((uv - 0.5) * vec2(1.2, 1.0)));
  col *= mix(0.72, 1.0, vig);
  col += (azar(gl_FragCoord.xy + fract(uTA) * 37.0) - 0.5) * 0.018;   // grano
  salida = vec4(col, 1.0);
}`;function f(l,{datos:f,reducido:p,sonido:m,ir:h}){let g=l.querySelector(`[data-au-lienzo]`),_=!matchMedia(`(hover: hover) and (pointer: fine)`).matches,v;try{v=new r({canvas:g,webgl:2,dpr:Math.min(devicePixelRatio||1,_?.6:1),alpha:!1,antialias:!1})}catch{return null}let y=v.gl;if(!y||!v.isWebgl2)return null;let b=new a(y,{generateMipmaps:!1,minFilter:y.LINEAR,wrapS:y.CLAMP_TO_EDGE,wrapT:y.CLAMP_TO_EDGE}),x=new Image;x.onload=()=>{b.image=x,w.uFotoTam.value=[x.naturalWidth,x.naturalHeight]},x.src=`${window.ADS_BASE||`/`}assets/hero/Fondo-Hero_adsPartners.webp`;let ae=()=>innerWidth<innerHeight?.55:1,S=e=>c.map((t,n)=>t+e[n]*(n===0?ae():1)),C=f.map(e=>({d:e,rel:s[e.slug],color:ne(e.color),etq:l.querySelector(`[data-au-dest="${e.slug}"]`),pant:[0,0,!1]})),w={uRes:{value:[1,1]},uT:{value:0},uTA:{value:0},tFoto:{value:b},uFotoTam:{value:[1600,900]},uSolUv:{value:ee},uZoom:{value:0},uMezcla:{value:0},uCam:{value:[0,2,0]},uDer:{value:[1,0,0]},uArr:{value:[0,1,0]},uFre:{value:[0,0,-1]},uFoco:{value:1.7},uSol:{value:[.9998,.02,0]},uEstrellas:{value:0},uAurora:{value:0},uPasos:{value:_?40:64},uVel:{value:0},uTinte:{value:[.3,1,.55]},uTinteK:{value:0},uLuzP:{value:[0,0,0,0]}};C.forEach((e,t)=>{w[`uP${t}`]={value:S(e.rel)},w[`uC${t}`]={value:e.color}});let oe=new n(y,{vertex:re,fragment:ie,uniforms:w,depthTest:!1,depthWrite:!1}),se=new i(y,{geometry:new o(y),program:oe}),T=()=>{v.setSize(innerWidth,innerHeight),w.uRes.value=[y.drawingBufferWidth,y.drawingBufferHeight],C.forEach((e,t)=>{w[`uP${t}`].value=S(e.rel)})};addEventListener(`resize`,T),T();let E={zoom:0,mezcla:0,alt:2,yaw:90,pitch:1,z:0,fov:56,aurora:0,estrellas:0,puntos:0,vel:0,dive:0,T:0},D={x:0,y:0,nx:0,ny:0,px:null,py:0,t:0,dentro:!1},O={yaw:0,pitch:0},k=null,A=0,j=0,M=.5,N=500,P=null,F=[0,0,0],I=()=>{let e=(E.yaw+O.yaw)*Math.PI/180,t=(E.pitch+O.pitch)*Math.PI/180,n=[Math.sin(e)*Math.cos(t),Math.sin(t),-Math.cos(e)*Math.cos(t)],r=[Math.cos(e),0,Math.sin(e)],i=[r[1]*n[2]-r[2]*n[1],r[2]*n[0]-r[0]*n[2],r[0]*n[1]-r[1]*n[0]],a=[F[0],E.alt+F[1],E.z+F[2]];P&&E.dive>0&&(a=u(a,S(P.rel),d(E.dive)*.86));let o=(E.fov+d(E.dive)*26)*(innerWidth<innerHeight?1.38:1);return{pos:a,fre:n,der:r,arr:i,foco:1/Math.tan(o*Math.PI/360)}},L=(e,t)=>{let n=t.map((t,n)=>t-e.pos[n]),r=n[0]*e.fre[0]+n[1]*e.fre[1]+n[2]*e.fre[2];if(r<=.1)return[0,0,!1];let i=(n[0]*e.der[0]+n[1]*e.der[1]+n[2]*e.der[2])/r*e.foco,a=(n[0]*e.arr[0]+n[1]*e.arr[1]+n[2]*e.arr[2])/r*e.foco;return[(i*innerHeight+innerWidth)/2,(innerHeight-a*innerHeight)/2,!0]};l.addEventListener(`pointermove`,e=>{D.x=e.clientX,D.y=e.clientY,D.dentro=!0,D.nx=e.clientX/innerWidth*2-1,D.ny=e.clientY/innerHeight*2-1;let t=performance.now();D.px!==null&&t-D.t<100&&(j=Math.min(1,j+Math.hypot(e.clientX-D.px,e.clientY-D.py)/900)),D.px=e.clientX,D.py=e.clientY,D.t=t}),l.addEventListener(`pointerleave`,()=>{D.dentro=!1});let R=(e,t,n)=>{let r=null,i=n;for(let n of C){if(!n.pant[2])continue;let a=Math.hypot(n.pant[0]-e,n.pant[1]-t);a<i&&(i=a,r=n)}return[r,i]},z=null,B=()=>!!z&&z.isActive(),ce=()=>{z&&e.to(z,{timeScale:5,duration:.4})};g.addEventListener(`click`,e=>{if(B()){ce();return}let[t]=R(e.clientX,e.clientY,_?140:200);t&&H(t.d.slug)});let V=l.querySelector(`[data-au-inundar]`);function H(t){let n=C.find(e=>e.d.slug===t);if(n&&!P){if(n.d.ruta)B()&&z.progress(1),P=n,k=n,l.classList.add(`zambullendo`),m.viaje(1.4,1),p?h(n.d):(V.style.setProperty(`--c`,n.d.color),e.timeline({onComplete:()=>h(n.d)}).to(E,{dive:1,duration:1.4,ease:`power2.in`},0).to(E,{vel:1,duration:1.1,ease:`power1.in`},.1).fromTo(V,{opacity:0},{opacity:1,duration:.5,ease:`power1.in`},.95));else{let t=n.etq.querySelector(`.au__luz`);clearTimeout(t._t),t.textContent=`en obras · llega pronto`,p||e.fromTo(n.etq.querySelector(`.au__nombre`),{x:-8},{x:0,duration:.5,ease:`elastic.out(1, 0.3)`,clearProps:`x`}),setTimeout(()=>{t.textContent=t.dataset.texto},1800)}}}l.querySelectorAll(`[data-au-ir]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),H(e.dataset.auIr)})});let U=l.querySelector(`[data-au-altitud]`),W=l.querySelector(`[data-au-viento]`),G=(e,t,n=0)=>{if(clearTimeout(e._t),p){e.textContent=t;return}let r=0;e.textContent=``;let i=()=>{e.textContent=t.slice(0,++r),r<t.length&&(e._t=setTimeout(i,16))};e._t=setTimeout(i,n)},K=e=>e<60?`${Math.round(e)} s`:`${Math.floor(e/60)} min ${Math.round(e%60)} s`;function q(){C.forEach((e,t)=>{e.etq.classList.add(`visto`),G(e.etq.querySelector(`.au__luz`),e.etq.querySelector(`.au__luz`).dataset.texto,t*150)}),G(U,`dentro de la aurora · de unos 100 a más de 300 km de altura`);let e=t();G(W,`viento solar · ${N} km/s · sale de tu visita: ${K(e.segundos)} y ${e.metros.toFixed(1).replace(`.`,`,`)} m de ratón`,400),m.coro(M)}function le(t){z?.kill();let n=e.timeline({onComplete:q});if(t){let e={km:2},t=()=>[...te].reverse().find(([t])=>e.km>=t)[1];Object.assign(E,{zoom:0,mezcla:0,alt:2,yaw:90,pitch:1.5,z:0,fov:56,aurora:0,estrellas:0,puntos:0}),n.to(E,{zoom:1,duration:2.3,ease:`power2.in`},.35).call(()=>m.viaje(2.4,1),null,.4).to(E,{mezcla:1,duration:.55,ease:`power1.inOut`},2.45).to(e,{km:c[1],duration:3.6,ease:`power2.inOut`,onUpdate:()=>{E.alt=e.km,U.textContent=`altitud · ${Math.round(e.km)} km · ${t()}`}},2.6).to(E,{pitch:-3,duration:3.6,ease:`power1.inOut`},2.6).to(E,{estrellas:1,duration:2.2,ease:`power1.out`},3.4).to(E,{yaw:0,duration:2.8,ease:`power2.inOut`},3.8).to(E,{aurora:1,duration:2,ease:`power1.out`},4.4).call(()=>m.viaje(3,-1),null,5.8).to(E,{z:c[2],duration:3.2,ease:`power2.inOut`},5.8).to(E,{fov:68,duration:1.6,ease:`power2.in`,yoyo:!0,repeat:1},5.8).to(E,{pitch:6,duration:2.2,ease:`power1.inOut`},7).to(E,{puntos:1,duration:1.2,ease:`power1.out`},8.2)}else Object.assign(E,{zoom:1,mezcla:1,alt:c[1],yaw:0,pitch:6,z:c[2]+110,fov:56,aurora:1,estrellas:1,puntos:0}),n.to(E,{z:c[2],duration:1.6,ease:`power2.out`},0).to(E,{puntos:1,duration:.8,ease:`power1.out`},.9);z=n}let J=0,Y=0,X=!1,Z=0,Q=0;function $(e){J=requestAnimationFrame($);let t=Math.min(.05,(e-(Y||e))/1e3);Y=e,Z<90&&(Z++,Q+=t,Z===90&&!_&&Q/90<.011&&devicePixelRatio>1&&(v.dpr=Math.min(devicePixelRatio,1.5),T())),j*=Math.exp(-t*1.2);let n=Math.min(1,M+j*.6);p||(E.T+=t*(.3+n*.8),w.uTA.value=e/1e3);let r=E.puntos>.5&&!P&&D.dentro&&!_;O.yaw+=((r?D.nx*9:0)-O.yaw)*Math.min(1,t*2.5),O.pitch+=((r?-D.ny*6:0)-O.pitch)*Math.min(1,t*2.5);let i=I();if(C.forEach(e=>{e.pant=L(i,S(e.rel))}),!P){let[e,n]=r?R(D.x,D.y,260):[null,260];A+=((e?1-n/260:0)-A)*Math.min(1,t*4),e!==k&&(e&&m.tic(.6),k=e,C.forEach(e=>e.etq.classList.toggle(`on`,e===k)),g.style.cursor=k?`pointer`:``)}let a=k&&!P?S(k.rel).map((e,t)=>(e-c[t])*.16*d(Math.min(1,A*1.4))):[0,0,0];F=u(F,a,Math.min(1,t*1.6)),k&&(w.uTinte.value=u(w.uTinte.value,k.color,Math.min(1,t*6)));let o=P?1:k?Math.min(1,A*2.2)*.9:0;w.uTinteK.value+=(o-w.uTinteK.value)*Math.min(1,t*4),i=I(),w.uCam.value=i.pos,w.uDer.value=i.der,w.uArr.value=i.arr,w.uFre.value=i.fre,w.uFoco.value=i.foco,w.uT.value=E.T,w.uZoom.value=E.zoom,w.uMezcla.value=E.mezcla,w.uEstrellas.value=E.estrellas,w.uAurora.value=E.aurora,w.uVel.value=E.vel,w.uLuzP.value=C.map(e=>E.puntos*(e===k?1.7:.9)*(e.d.ruta?1:.6)),C.forEach(e=>{e.pant=L(i,S(e.rel));let t=(e.etq.offsetWidth||120)/2+10,n=Math.min(innerWidth-t,Math.max(t,e.pant[0]));e.etq.style.transform=`translate(${n.toFixed(1)}px, ${e.pant[1].toFixed(1)}px)`,e.etq.style.visibility=e.pant[2]&&E.puntos>.2?``:`hidden`}),v.render({scene:se})}return{abrir(e){let n=t();N=n.viento,M=(n.viento-300)/500,P=null,k=null,A=0,j=0,F=[0,0,0],Object.assign(E,{dive:0,vel:0}),w.uTinteK.value=0,l.classList.remove(`zambullendo`),V.style.opacity=0,C.forEach(e=>{e.etq.classList.remove(`visto`,`on`),e.etq.querySelector(`.au__luz`).textContent=``}),U.textContent=``,W.textContent=``,X||(X=!0,Y=0,J=requestAnimationFrame($)),p?(Object.assign(E,{zoom:1,mezcla:1,alt:c[1],yaw:0,pitch:6,z:c[2],fov:56,aurora:1,estrellas:1,puntos:1}),q()):le(e)},cerrar(){m.pararCoro(),z?.kill(),e.killTweensOf(E),cancelAnimationFrame(J),X=!1}}}export{f as crear};