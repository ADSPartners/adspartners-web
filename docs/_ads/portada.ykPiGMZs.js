import{O as e,S as t,_ as n,b as r}from"./preload-helper.DdhWbQZk.js";import{a as i,i as a,t as o}from"./Mesh.D48iXpEj.js";import{a as s,c,i as l,l as u,n as d,o as f,r as p,s as m,t as h}from"./capas.BXwimVS-.js";function g(e,t=innerWidth<=760){if(!e)return;e.style.fontSize=``;let n=parseFloat(getComputedStyle(e).fontSize),r=[...e.querySelectorAll(`[data-trozo]`)].map(e=>{let t=document.createRange();return t.selectNodeContents(e.firstChild),t.getBoundingClientRect().width}),i=t?Math.max(...r):r.reduce((e,t)=>e+t,0);i>0&&(e.style.fontSize=`${n*e.clientWidth/i*.985}px`)}var _={alta:{sim:128,tinte:640,iteraciones:18,dpr:1.5,curl:6,disipVel:.8,disipTinte:1.1},baja:{sim:64,tinte:320,iteraciones:8,dpr:1,curl:6,disipVel:.8,disipTinte:1.1}},v=` .·:-=+10#@`,ee=2600,te=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,ne=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tFoto; uniform sampler2D tTitulo; uniform sampler2D tMaquina; uniform sampler2D tTituloU; uniform sampler2D tMaquinaU;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uCelda; uniform float uGlifosN;
uniform float uRevelado; uniform vec2 uHold; uniform vec2 uPuntero; uniform float uCirculo;
uniform float uUsaFluido; uniform float uIntro; uniform float uLuz;
uniform vec4 uCaja0; uniform vec4 uCaja1; uniform vec2 uCajaA; uniform float uSalida;
uniform float uUmbral; uniform float uLinterna; uniform float uHalo; uniform float uInunda; uniform vec2 uFoco;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float luma (vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
// Una caja del inspector (en píxeles del canvas): se abre desde su línea del medio, como una persiana
float caja (vec2 px, vec4 c, float a, out float filo) {
  vec2 d = abs(px - (c.xy + c.zw) * 0.5) - (c.zw - c.xy) * 0.5 * vec2(1.0, a);
  float fuera = max(d.x, d.y);
  float dentro = (1.0 - step(0.0, fuera)) * step(0.02, a);
  filo = dentro * (1.0 - step(1.5 * uDpr, -fuera));
  return dentro;
}

void main () {
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 vel = uUsaFluido > 0.5 ? texture(tVel, uv).xy : vec2(0.0);
  float tinte = uUsaFluido > 0.5 ? texture(tTinte, uv).r : 0.0;
  // Si el fluido trae valores no numéricos (algún navegador), mejor sin pincel que la pantalla en negro
  if (isnan(vel.x) || isnan(vel.y) || isinf(vel.x) || isinf(vel.y)) vel = vec2(0.0);
  if (isnan(tinte) || isinf(tinte)) tinte = 0.0;
  vel = clamp(vel, vec2(-2000.0), vec2(2000.0));
  vec2 px = uv * uRes;
  float portada = 1.0 - uUmbral;

  // Máscara de la portada: tinte del fluido, círculo (sin fluido), anillo de «mantener» y las cajas del inspector
  float circ = uCirculo * (1.0 - smoothstep(0.1, 0.125, length((uv - uPuntero) * asp)));
  float n = ruido(uv * 7.0 + uTime * 0.25) * 0.06;
  float r = uRevelado * 1.9;
  float anillo = step(0.001, uRevelado) * (1.0 - smoothstep(r - 0.015, r, length((uv - uHold) * asp) + n * uRevelado));
  float filo0, filo1;
  float cajas = max(caja(px, uCaja0, uCajaA.x, filo0), caja(px, uCaja1, uCajaA.y, filo1));
  float m = max(max(tinte, circ), anillo);
  float mascaraP = max(smoothstep(0.24, 0.3, m), cajas);
  float borde = (smoothstep(0.17, 0.23, m) - smoothstep(0.28, 0.34, m)) * portada;
  // Al bajar, la máquina sube desde abajo celda a celda (con el grano del tramado), con un frente rosa
  vec2 celS = floor(px / (uCelda * 2.0));
  float yS = uv.y + hash(celS) * 0.09;
  float frenteS = uSalida * 1.4 - 0.1;   // en reposo (uSalida = 0) no hay ninguna celda
  float salida = portada * step(yS, frenteS);
  float filoS = portada * step(yS, frenteS + 0.014) * (1.0 - salida) * step(0.001, uSalida);
  mascaraP = max(mascaraP, salida);

  // Máscara del umbral, al revés: la marca solo donde hay luz (la estela del fluido y un halo en el puntero).
  // Al entrar, la marca inunda en círculo desde el clic, con un frente rosa
  float halo = uHalo * (1.0 - smoothstep(0.0, 0.21, length((uv - uPuntero) * asp) + n * 0.5));
  float luz = max(tinte * 1.3, halo) * uLinterna;
  float dF = length((uv - uFoco) * asp) + n * 0.6;
  float rF = uInunda * 2.3;
  float inunda = step(0.001, uInunda) * (1.0 - smoothstep(rF - 0.03, rF, dF));
  float mascaraU = 1.0 - max(smoothstep(0.08, 0.62, luz), inunda);
  float frente = step(0.001, uInunda) * step(uInunda, 0.999) * (1.0 - smoothstep(0.0, 0.005, abs(dF - rF + 0.015)));

  float mascara = mix(mascaraP, mascaraU, uUmbral);

  // MARCA: la foto en clave de noche, viñeta y el título; el fluido la desplaza un poco
  vec2 uvM = uv - vel * 0.00008;
  vec3 foto = texture(tFoto, uvM).rgb;
  vec3 marca = pow(foto, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  marca *= mix(0.5, 1.0, vig);
  vec4 tit = mix(texture(tTitulo, uvM), texture(tTituloU, uvM), uUmbral);
  marca = mix(marca, cCrema, tit.a);
  // En el umbral, la luz calienta lo que toca
  marca *= 1.0 + luz * 0.22 * uUmbral;

  // MÁQUINA: curvas de nivel y tramado mono de la luz de la foto, rejilla y la capa dibujada.
  // Abajo se apaga hasta parecerse al fondo de la página, que sigue debajo
  vec2 uvQ = uv;
  float abajo = smoothstep(0.24, 0.0, uv.y) * portada;
  vec3 f = texture(tFoto, uvQ).rgb; float l = luma(f);
  float b = l * 16.0; float fw = fwidth(b);
  float iso = (1.0 - smoothstep(0.0, fw * 1.4, abs(fract(b + 0.5) - 0.5))) * (1.0 - abajo * 0.85);
  vec2 cel = floor(px / uCelda);
  float lc = luma(texture(tFoto, (cel + 0.5) * uCelda / uRes).rgb) * (1.0 - abajo * 0.7);
  float idx = floor(clamp(lc, 0.0, 0.999) * uGlifosN);
  vec2 den = fract(px / uCelda);
  float glifo = texture(tGlifos, vec2((idx + den.x) / uGlifosN, den.y)).r;
  float paso = 64.0 * uDpr;
  float rej = max(1.0 - step(uDpr, mod(px.x, paso)), 1.0 - step(uDpr, mod(px.y, paso)));
  vec3 maq = cNoche;
  maq = mix(maq, cCrema, rej * 0.06);
  maq = mix(maq, cCrema, glifo * (0.08 + lc * 0.34) * uLuz * (1.0 + uUmbral * 0.4));
  maq = mix(maq, cCrema, iso * (0.2 + l * 0.38) * uLuz);
  vec4 cap = mix(texture(tMaquina, uvQ), texture(tMaquinaU, uvQ), uUmbral);
  maq = mix(maq, cap.rgb, cap.a);

  vec3 col = mix(marca, maq, mascara);
  col = mix(col, cRosa, clamp(borde, 0.0, 1.0) * 0.4);
  col = mix(col, cRosa, max(filo0, filo1) * portada * 0.95);
  col = mix(col, cRosa, filoS * 0.55);
  col = mix(col, cRosa, frente * 0.9);
  // El último borde, en noche, solo al bajar (es donde empieza el fondo de la página); quieta, la portada no se toca
  col = mix(col, cNoche, smoothstep(0.035, 0.0, uv.y) * portada * min(1.0, uSalida * 10.0));
  col += (hash(px + fract(uTime * 7.0) * 91.0) - 0.5) * 0.04;
  color = vec4(col * uIntro, 1.0);
}`,y=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),re=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});async function b({cursor:b,reducido:x}){let S=document.documentElement,C=document.getElementById(`portada`),ae=C.querySelector(`[data-gl]`),w=C.querySelector(`[data-titulo]`),oe=document.querySelector(`[data-umbral-ads]`),T=!matchMedia(`(hover: hover) and (pointer: fine)`).matches,E={entrar(){},listo:Promise.resolve(!1)},D=()=>innerWidth<=760;g(w,D());let O;try{[O]=await Promise.all([re(`${window.ADS_BASE||`/`}assets/hero/Fondo-Hero_adsPartners.webp`),document.fonts.load(`300 100px "Apple Garamond"`),document.fonts.load(`400 12px "Geist Mono"`)])}catch{return E}g(w,D());let k=`alta`,A;try{A=new a({canvas:ae,webgl:2,dpr:Math.min(devicePixelRatio,_[k].dpr),alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return E}if(!A.isWebgl2)return E;let j=A.gl,M=C.clientWidth,N=C.clientHeight;A.setSize(M,N);let P=e=>new u(j,{image:e,generateMipmaps:!1,minFilter:j.LINEAR,magFilter:j.LINEAR}),F={foto:null,titulo:null,maquina:null,tituloU:null,maquinaU:null},I=()=>P(h(1,1)),L={foto:I(),titulo:I(),maquina:I(),tituloU:I(),maquinaU:I(),glifos:P(l(v))},R=S.classList.contains(`en-umbral`)&&!!oe,z=R&&!x;function se(){let e=A.dpr,t=j.canvas.width,n=j.canvas.height,r=C.getBoundingClientRect();F.foto=h(t/2,n/2),p(F.foto,O),F.titulo=h(t,n),F.maquina=h(t,n);let i=d(w,r);f(F.titulo,i,e),s(F.maquina,i,e,{foto:F.foto,movil:D()});let a=[`foto`,`titulo`,`maquina`];if(R){let i={canvas:[t,n],dpr:A.dpr,nivel:_[k],glifos:v};F.tituloU=h(t,n),F.maquinaU=h(t,n);let o=d(oe,r);f(F.tituloU,o,e),s(F.maquinaU,o,e,{foto:F.foto,movil:D(),variante:`umbral`,ficha:i}),a.push(`tituloU`,`maquinaU`)}for(let e of a)L[e].image=F[e],L[e].needsUpdate=!0}se(),R&&S.classList.add(`umbral-gl`);let B=null,ce=()=>{if(B&&B._liberar(),B=null,!x)try{B=new m(A,_[k])}catch{B=null}};ce();let V={tFoto:{value:L.foto},tTitulo:{value:L.titulo},tMaquina:{value:L.maquina},tTituloU:{value:L.tituloU},tMaquinaU:{value:L.maquinaU},uUmbral:{value:+!!R},uLinterna:{value:+!z},uHalo:{value:0},uInunda:{value:0},uFoco:{value:[.5,.5]},tGlifos:{value:L.glifos},tTinte:{value:L.foto},tVel:{value:L.foto},uRes:{value:[j.canvas.width,j.canvas.height]},uDpr:{value:A.dpr},uTime:{value:0},uCelda:{value:(D()?8:9)*A.dpr},uGlifosN:{value:11},uRevelado:{value:0},uHold:{value:[.5,.5]},uPuntero:{value:[-2,-2]},uCirculo:{value:0},uUsaFluido:{value:0},uIntro:{value:0},uCaja0:{value:[0,0,0,0]},uCaja1:{value:[0,0,0,0]},uCajaA:{value:[0,0]},uSalida:{value:0},uLuz:{value:+!z},cNoche:{value:y(`#120D0A`)},cCrema:{value:y(`#E7E2DA`)},cRosa:{value:y(`#F5CBD7`)}},le=new o(j,{geometry:new c(j),program:new i(j,{vertex:te,fragment:ne,uniforms:V,depthTest:!1,depthWrite:!1})}),H={x:-1,y:-1,px:-1,py:-1,dentro:!1,movido:!1,quieto:0,recorrido:0,sx:.5,sy:.5,toque:-10},U=0;function W(e,t){let n=C.getBoundingClientRect(),r=e-n.left,i=t-n.top;H.dentro=r>=0&&i>=0&&r<=n.width&&i<=n.height,H.dentro&&(H.x<0&&(H.px=r,H.py=i),H.x=r,H.y=i,H.movido=!0,H.quieto=0)}window.addEventListener(`pointermove`,e=>{e.pointerType!==`touch`&&W(e.clientX,e.clientY)},{passive:!0});let G={p:0,tween:null,mando:null,completo:!1,activo:!1},K=`mueve`,q=null;function J(t,n){let i=C.getBoundingClientRect();V.uHold.value=[(t-i.left)/i.width,1-(n-i.top)/i.height],G.activo=!0,G.completo=!1,G.mando=r(),b.pulsando(!0),e.killTweensOf(G),G.tween=e.to(G,{p:1,duration:1.25,ease:`none`,onUpdate(){b.progreso(G.p),G.mando.avance(G.p),x||(V.uRevelado.value=e.parseEase(`power2.in`)(G.p)*.45)},onComplete(){G.completo=!0,G.mando.soltar(!0),e.to(V.uRevelado,{value:1,duration:x?0:1.1,ease:`power3.out`}),b.decir(`Así es por dentro`),K=`visto`}})}function Y(){G.activo&&(G.activo=!1,b.pulsando(!1),G.tween&&G.tween.kill(),!G.completo&&G.mando?G.mando.soltar(!1):t(.8),e.to(G,{p:0,duration:.35,ease:`power2.out`,onUpdate(){b.progreso(G.p)}}),e.to(V.uRevelado,{value:0,duration:x?0:.85,ease:`power2.inOut`}),K===`visto`&&(clearTimeout(q),q=setTimeout(()=>b.decir(``),500)))}let ue=e=>e.closest&&e.closest(`a, button, input, label, [data-umbral-entradas]`);C.addEventListener(`pointerdown`,e=>{e.pointerType===`touch`||e.button!==0||ue(e.target)||S.classList.contains(`en-umbral`)||J(e.clientX,e.clientY)}),window.addEventListener(`pointerup`,e=>{e.pointerType!==`touch`&&Y()}),window.addEventListener(`blur`,Y);let X=null,Z=null;C.addEventListener(`touchstart`,e=>{let t=e.touches[0];Z=[t.clientX,t.clientY],W(t.clientX,t.clientY),H.px=H.x,H.py=H.y,clearTimeout(X),X=setTimeout(()=>J(t.clientX,t.clientY),380)},{passive:!0}),C.addEventListener(`touchmove`,e=>{let t=e.touches[0];W(t.clientX,t.clientY),Z&&Math.hypot(t.clientX-Z[0],t.clientY-Z[1])>10&&clearTimeout(X)},{passive:!0});let Q=e=>{if(!R)return;let t=e.touches[0];W(t.clientX,t.clientY),H.toque=V.uTime.value,e.type===`touchstart`&&(H.px=H.x,H.py=H.y)};window.addEventListener(`touchstart`,Q,{passive:!0}),window.addEventListener(`touchmove`,Q,{passive:!0});let de=()=>{clearTimeout(X),Z=null,Y()};C.addEventListener(`touchend`,de),C.addEventListener(`touchcancel`,de),C.addEventListener(`contextmenu`,e=>{G.activo&&e.preventDefault()});let fe=ie({sec:C,h1:w,u:V,renderer:A,capas:F,nivel:()=>_[k],tam:()=>[M,N]}),pe=!0;new IntersectionObserver(([e])=>{pe=e.isIntersecting}).observe(C);let me=performance.now(),$={n:0,suma:0,hecha:!1};e.ticker.add(()=>{let e=performance.now(),t=Math.min(1/30,(e-me)/1e3);if(me=e,!pe||document.hidden)return;V.uTime.value+=t,H.quieto+=t;let r=0,i=0;if(H.movido){r=H.x-H.px,i=H.y-H.py,H.px=H.x,H.py=H.y,H.movido=!1;let e=Math.hypot(r,i);if(H.recorrido+=e,U=Math.min(1,e/t/2600),!R&&K===`mueve`&&H.recorrido>900&&(K=`manten`,clearTimeout(q),q=setTimeout(()=>b.decir(`Mantén pulsado`),350)),B){let e=Math.hypot(r/M,i/N),t=R?ee*.55:ee;B.splat(H.x/M,1-H.y/N,r/M*t*(M/N),-i/N*t,Math.min(.9,.35+e*12),R?.007:.0032)}}else U*=Math.exp(-t*8);let a=Math.min(1,Math.max(0,-C.getBoundingClientRect().top/N));if(V.uSalida.value=a,C.style.setProperty(`--salida`,a.toFixed(3)),fe.paso(t,!R&&!G.activo&&H.quieto>2.5&&a<.15),R&&T&&V.uLinterna.value>0&&V.uTime.value-H.toque>1.4){let e=V.uTime.value*.42,t=M*(.5+.34*Math.sin(e)),n=N*(.5+.16*Math.sin(e*1.7));B&&H.x>=0&&B.splat(t/M,1-n/N,(t-H.x)*6,-(n-H.y)*6,.035,.004),H.x=t,H.y=n,H.dentro=!0}let o=1-Math.exp(-14*t);H.x>=0&&(H.sx+=(H.x/M-H.sx)*o,H.sy+=(1-H.y/N-H.sy)*o),V.uPuntero.value=[H.sx,H.sy],B||(V.uCirculo.value=!R&&H.dentro&&H.quieto<1.2?1:0);let s=R&&H.dentro&&H.x>=0?T?.75:H.quieto>5?.6:1:0;if(V.uHalo.value+=(s-V.uHalo.value)*(1-Math.exp(-(s>V.uHalo.value?6:1.2)*t)),B?(B.paso(t),V.tTinte.value=B.tinte,V.tVel.value=B.velocidad,V.uUsaFluido.value=1):V.uUsaFluido.value=0,A.render({scene:le,sort:!1,frustumCull:!1}),n(U,H.x/M,t,R?0:V.uRevelado.value),!$.hecha&&B&&($.n++,$.n>20&&($.suma+=t),$.n===140)){let e=$.suma/120;$.hecha=!0,e>.024&&k===`alta`?(k=`baja`,he(),$.hecha=!1,$.n=0,$.suma=0):e>.04&&(B._liberar(),B=null)}}),S.classList.contains(`gl-activo`)||(S.classList.add(`gl-activo`,`titulo-gl`),e.to(V.uIntro,{value:1,duration:x?0:1.4,ease:`power2.out`}));function he(){A.dpr=Math.min(devicePixelRatio,_[k].dpr),ge(),ce()}function ge(){M=C.clientWidth,N=C.clientHeight,g(w,D()),A.setSize(M,N),V.uRes.value=[j.canvas.width,j.canvas.height],V.uDpr.value=A.dpr,V.uCelda.value=(D()?8:9)*A.dpr,se(),B&&B.redimensionar(j.canvas.width/j.canvas.height)}let _e=null,ve=innerWidth;window.addEventListener(`resize`,()=>{D()&&innerWidth===ve||(ve=innerWidth,clearTimeout(_e),_e=setTimeout(ge,160))});function ye(){R=!1,V.uUmbral.value=0,V.uInunda.value=0,V.uHalo.value=0;for(let e of[`tituloU`,`maquinaU`])F[e]=null,L[e].image=h(1,1),L[e].needsUpdate=!0;S.classList.remove(`umbral-gl`)}return{listo:Promise.resolve(!0),construir(t){return z?new Promise(n=>{e.timeline({onComplete:n}).add(()=>t(1,`alambre`)).to(V.uLuz,{value:1,duration:1.1,ease:`power2.inOut`,onStart:()=>t(2,`luz`)},1.1).to(V.uLinterna,{value:1,duration:1,ease:`power2.out`,onStart:()=>t(3,`linterna`)},2.3)}):(V.uLuz.value=1,V.uLinterna.value=1,Promise.resolve())},activarCursor(){b.decir(`Mueve el ratón`)},entrar(t=innerWidth/2,n=innerHeight/2){let r=()=>{if(B)for(let e=0;e<9;e++){let t=e/9*Math.PI*2+Math.random()*.3;B.splat(.5,.52,Math.cos(t)*900*(M/N),Math.sin(t)*900,.5,.004)}};if(!R){r();return}let i=C.getBoundingClientRect();V.uFoco.value=[(t-i.left)/M,1-(n-i.top)/N],x?ye():e.timeline({onComplete:ye}).to(V.uInunda,{value:1,duration:1.25,ease:`power2.inOut`}).to(V.uUmbral,{value:0,duration:.9,ease:`power2.inOut`},`-=0.35`).add(r,`-=0.5`)}}}function ie({sec:n,h1:r,u:i,renderer:a,capas:o,nivel:s,tam:c}){let l=n.querySelector(`[data-inspector]`),u=(l?[...l.querySelectorAll(`[data-inspector-etq]`)]:[]).map(e=>({a:0,r:[0,0,0,0],el:e,t:null})),d={espera:.2,n:0,activo:!1,tipos:[]};if(u.length<2)return{paso(){}};let f=e=>{let t=n.getBoundingClientRect();return{x:e.left-t.left,y:e.top-t.top,w:e.width,h:e.height}},p=e=>Math.round(parseFloat(getComputedStyle(e).fontSize)),m=(e,t,n)=>({x:e.x-t,y:e.y-n,w:e.w+t*2,h:e.h+n*2}),h={letra(){let e=[],t=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);for(;t.nextNode();)t.currentNode.textContent.trim()&&e.push(t.currentNode);if(!e.length)return null;let n=e[Math.floor(Math.random()*e.length)],i=Math.floor(Math.random()*n.textContent.length),a=document.createRange();a.setStart(n,i),a.setEnd(n,i+1);let o=f(a.getBoundingClientRect());return{r:{x:o.x-6,y:o.y+o.h*.12,w:o.w+12,h:o.h*.8},txt:`«${n.textContent[i]}» · Apple Garamond 300 · ${p(r)} px`}},lema(){let e=n.querySelector(`.portada__lema`);return e&&{r:m(f(e.getBoundingClientRect()),10,8),txt:`p.lema · Garamond 300 + 400 itálica · ${p(e)} px`}},texto(){let e=n.querySelector(`.portada__texto`);if(!e)return null;let t=Math.round(parseFloat(getComputedStyle(e).lineHeight));return{r:m(f(e.getBoundingClientRect()),10,8),txt:`p · Open Sauce 400 · ${p(e)}/${t} px · ${e.textContent.trim().split(/\s+/).length} palabras`}},foto(){let[e,t]=c(),n=Math.round(Math.min(e,t)*(.18+Math.random()*.08)),r=e*(.32+Math.random()*.3),i=t*(.06+Math.random()*.22),a=``;try{let t=o.foto.width/e,s=Math.max(1,Math.round(n*t)),c=o.foto.getContext(`2d`,{willReadFrequently:!0}).getImageData(Math.round(r*t),Math.round(i*t),s,s).data,l=0;for(let e=0;e<c.length;e+=4)l+=c[e]*.299+c[e+1]*.587+c[e+2]*.114;a=` · luz media ${Math.round(l/(c.length/4)/2.55)} %`}catch{}return{r:{x:r,y:i,w:n,h:n},txt:`foto · ${n}×${n} px${a} · fluido ${s().sim}²`}},etiqueta(){let e=n.querySelector(`.portada__etq`);return e&&{r:m(f(e.getBoundingClientRect()),8,6),txt:`p.mono · Geist Mono · ${p(e)} px · ${e.textContent.length} caracteres`}}};function g(){for(let e=0;e<6;e++){d.tipos.length||(d.tipos=Object.keys(h).sort(()=>Math.random()-.5));let e=h[d.tipos.pop()]();if(e&&e.r.w>4&&e.r.h>4)return e}return null}function _(n,r){n.r=[r.r.x,r.r.y,r.r.x+r.r.w,r.r.y+r.r.h];let[i]=c(),a=r.r.y>34?r.r.y-24:r.r.y+r.r.h+6;n.el.style.transform=`translate3d(${Math.max(0,Math.min(r.r.x,i-340)).toFixed(0)}px, ${a.toFixed(0)}px, 0)`,n.el.classList.add(`on`),clearTimeout(n.t);let o=0,s=()=>{n.el.textContent=r.txt.slice(0,++o),o<r.txt.length&&(n.t=setTimeout(s,14))};s(),e.to(n,{a:1,duration:.6,ease:`expo.out`,overwrite:!0}),t(.45)}function v(t,n){clearTimeout(t.t),t.el.classList.remove(`on`),e.to(t,{a:0,duration:n?.18:.45,ease:`power3.in`,overwrite:!0})}return{paso(e,t){if(t){if(d.activo=!0,d.espera-=e,d.espera<=0){let e=u[d.n%u.length];u.forEach(t=>{t!==e&&t.a>0&&v(t)});let t=g();t&&_(e,t),d.n++,d.espera=2.8}}else d.activo&&(d.activo=!1,d.espera=.2,u.forEach(e=>v(e,!0)));let[,n]=c(),r=a.dpr,o=e=>[e.r[0]*r,(n-e.r[3])*r,e.r[2]*r,(n-e.r[1])*r];i.uCaja0.value=o(u[0]),i.uCaja1.value=o(u[1]),i.uCajaA.value=[u[0].a,u[1].a]}}}export{b as crearPortada};