import{d as e,l as t,o as n,r,s as i}from"./index.astro_astro_type_script_index_0_lang.CnEbFh-c.js";import{a,c as o,d as s,f as c,i as ee,l,m as u,n as d,o as f,p as te,r as ne,s as re,t as p,u as m}from"./capas.C78MDiZs.js";var h=`
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,g={gota:`
precision highp float; varying vec2 vUv;
uniform sampler2D uOndas; uniform vec2 punto; uniform float radio; uniform float fuerza; uniform float aspect;
void main () {
  vec4 o = texture2D(uOndas, vUv);
  vec2 d = vUv - punto; d.x *= aspect;
  // Un pico con dos surcos alrededor: al soltarse sale un tren de anillos, no uno solo
  float k = length(d) / radio;
  o.r += cos(k * 3.14159265 * 2.5) * (1.0 - smoothstep(0.0, 1.0, k)) * fuerza;
  gl_FragColor = o;
}`,paso:`
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
}`},ie=class{constructor(e,{lado:t=200,amortigua:n=.993}={}){if(!e.isWebgl2)throw Error(`sin WebGL2`);let r=this.gl=e.gl;if(!r.getExtension(`EXT_color_buffer_float`)&&!r.getExtension(`EXT_color_buffer_half_float`))throw Error(`sin color_buffer_float`);this.renderer=e,this.lado=t,this.pasosSeg=t/200*95,this.resto=0,this.gotas=[];let i=new m(r),a=(e,t)=>new c(r,{geometry:i,program:new u(r,{vertex:h,fragment:e,uniforms:t,depthTest:!1,depthWrite:!1})});this.p={gota:a(g.gota,{uOndas:{value:null},punto:{value:[0,0]},radio:{value:.03},fuerza:{value:1},aspect:{value:1}}),paso:a(g.paso,{uOndas:{value:null},texel:{value:[0,0]},amortigua:{value:n}})},this.redimensionar(r.canvas.width/Math.max(1,r.canvas.height))}_liberar(){this.agua&&(l(this.gl,this.agua.read),l(this.gl,this.agua.write))}redimensionar(e){this._liberar(),this.aspect=e;let[t,n]=e>=1?[Math.round(this.lado*e),this.lado]:[this.lado,Math.round(this.lado/e)],r=o(this.renderer,t,n),i=o(this.renderer,t,n);this.agua={get read(){return r},get write(){return i},swap(){[r,i]=[i,r]}},this.texel=[1/t,1/n]}get altura(){return this.agua.read.texture}gota(e,t,n=1,r=.03){this.gotas.push([e,t,n,r])}_pasada(e){this.renderer.render({scene:e,target:this.agua.write,clear:!1,sort:!1,frustumCull:!1,update:!1}),this.agua.swap()}paso(e){let t=this.p.gota.program.uniforms;for(let[e,n,r,i]of this.gotas)t.uOndas.value=this.agua.read.texture,t.punto.value=[e,n],t.radio.value=i,t.fuerza.value=r,t.aspect.value=this.aspect,this._pasada(this.p.gota);this.gotas.length=0,this.resto=Math.min(this.resto+e*this.pasosSeg,4);let n=this.p.paso.program.uniforms;for(n.texel.value=this.texel;this.resto>=1;)n.uOndas.value=this.agua.read.texture,this._pasada(this.p.paso),--this.resto}};function _(e,t=innerWidth<=760){if(!e)return;e.style.fontSize=``;let n=parseFloat(getComputedStyle(e).fontSize),r=[...e.querySelectorAll(`[data-trozo]`)].map(e=>{let t=document.createRange();return t.selectNodeContents(e.firstChild),t.getBoundingClientRect().width}),i=t?Math.max(...r):r.reduce((e,t)=>e+t,0);i>0&&(e.style.fontSize=`${n*e.clientWidth/i*.985}px`)}var v={alta:{sim:128,tinte:640,iteraciones:18,dpr:1.5,curl:6,disipVel:.8,disipTinte:1.1,ondas:200},baja:{sim:64,tinte:320,iteraciones:8,dpr:1,curl:6,disipVel:.8,disipTinte:1.1,ondas:128}},ae=` .·:-=+10#@`,oe=2600,y={fuerza:.6,radio:.05},se=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main () { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`,ce=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 color;
uniform sampler2D tFoto; uniform sampler2D tTitulo; uniform sampler2D tMaquina; uniform sampler2D tTituloU; uniform sampler2D tMaquinaU;
uniform sampler2D tTinte; uniform sampler2D tVel; uniform sampler2D tGlifos; uniform sampler2D tOndas;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uCelda; uniform float uGlifosN;
uniform float uRevelado; uniform vec2 uHold; uniform vec2 uPuntero; uniform float uCirculo;
uniform float uUsaFluido; uniform float uIntro; uniform float uLuz; uniform float uUsaOndas; uniform vec2 uOndasTexel;
uniform float uUmbral; uniform float uLinterna; uniform float uHalo; uniform float uInunda; uniform vec2 uFoco;
uniform vec3 cNoche; uniform vec3 cCrema; uniform vec3 cRosa;

float luma (vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash (vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float ruido (vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
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
  // Ondas: la altura del agua y su pendiente
  float h = 0.0; vec2 pend = vec2(0.0);
  if (uUsaOndas > 0.5) {
    vec2 e = uOndasTexel;
    h = texture(tOndas, uv).r;
    pend = vec2(texture(tOndas, uv + vec2(e.x, 0.0)).r - texture(tOndas, uv - vec2(e.x, 0.0)).r,
                texture(tOndas, uv + vec2(0.0, e.y)).r - texture(tOndas, uv - vec2(0.0, e.y)).r);
    if (isnan(h) || isinf(h) || isnan(pend.x) || isnan(pend.y) || isinf(pend.x) || isinf(pend.y)) { h = 0.0; pend = vec2(0.0); }
    pend = clamp(pend, vec2(-1.0), vec2(1.0));
  }

  // Máscara de la portada: tinte del fluido, crestas de las ondas, círculo (sin fluido) y anillo de «mantener»
  float circ = uCirculo * (1.0 - smoothstep(0.1, 0.125, length((uv - uPuntero) * asp)));
  float n = ruido(uv * 7.0 + uTime * 0.25) * 0.06;
  float r = uRevelado * 1.9;
  float anillo = step(0.001, uRevelado) * (1.0 - smoothstep(r - 0.015, r, length((uv - uHold) * asp) + n * uRevelado));
  float cresta = smoothstep(0.035, 0.07, h);
  float m = max(max(max(tinte, cresta), circ), anillo);
  float mascaraP = smoothstep(0.24, 0.3, m);
  float borde = (smoothstep(0.17, 0.23, m) - smoothstep(0.28, 0.34, m)) * (1.0 - uUmbral);

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

  // MARCA: la foto en clave de noche, viñeta y el título; el fluido la desplaza un poco y el agua la refracta
  vec2 uvM = uv - vel * 0.00008 - pend * 0.1;
  vec3 foto = texture(tFoto, uvM).rgb;
  vec3 marca = pow(foto, vec3(1.3)) * 0.68 * vec3(1.03, 0.99, 0.94);
  float vig = smoothstep(1.3, 0.3, length((uv - vec2(0.5, 0.56)) * vec2(1.15, 1.0)));
  marca *= mix(0.5, 1.0, vig);
  vec4 tit = mix(texture(tTitulo, uvM), texture(tTituloU, uvM), uUmbral);
  marca = mix(marca, cCrema, tit.a);
  // En el umbral, la luz calienta lo que toca
  marca *= 1.0 + luz * 0.22 * uUmbral;

  // MÁQUINA: curvas de nivel y tramado mono de la luz de la foto, rejilla y la capa dibujada
  vec2 uvQ = uv - pend * 0.05;
  vec3 f = texture(tFoto, uvQ).rgb; float l = luma(f);
  float b = l * 16.0; float fw = fwidth(b);
  float iso = 1.0 - smoothstep(0.0, fw * 1.4, abs(fract(b + 0.5) - 0.5));
  vec2 px = uv * uRes;
  vec2 cel = floor(px / uCelda);
  float lc = luma(texture(tFoto, (cel + 0.5) * uCelda / uRes - pend * 0.05).rgb);
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
  // Brillo del agua: la luz entra desde arriba a la izquierda
  col += cCrema * clamp(dot(pend, vec2(-0.6, 0.8)) * 14.0, 0.0, 1.0) * 0.22;
  col = mix(col, cRosa, frente * 0.9);
  col += (hash(px + fract(uTime * 7.0) * 91.0) - 0.5) * 0.04;
  color = vec4(col * uIntro, 1.0);
}`,b=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255),le=e=>new Promise((t,n)=>{let r=new Image;r.decoding=`async`,r.onload=()=>t(r),r.onerror=n,r.src=e});async function x({cursor:o,reducido:l}){let h=document.documentElement,g=document.getElementById(`portada`),x=g.querySelector(`[data-gl]`),S=g.querySelector(`[data-titulo]`),C=document.querySelector(`[data-umbral-ads]`),w=!matchMedia(`(hover: hover) and (pointer: fine)`).matches,T={entrar(){},listo:Promise.resolve(!1)},E=()=>innerWidth<=760;_(S,E());let ue;try{[ue]=await Promise.all([le(`${window.ADS_BASE||`/`}assets/hero/Fondo-Hero_adsPartners.webp`),document.fonts.load(`300 100px "Apple Garamond"`),document.fonts.load(`400 12px "Geist Mono"`)])}catch{return T}_(S,E());let D=`alta`,O;try{O=new te({canvas:x,webgl:2,dpr:Math.min(devicePixelRatio,v[D].dpr),alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return T}if(!O.isWebgl2)return T;let k=O.gl,A=g.clientWidth,j=g.clientHeight;O.setSize(A,j);let M=e=>new s(k,{image:e,generateMipmaps:!1,minFilter:k.LINEAR,magFilter:k.LINEAR}),N={foto:null,titulo:null,maquina:null,tituloU:null,maquinaU:null},P=()=>M(p(1,1)),F={foto:P(),titulo:P(),maquina:P(),tituloU:P(),maquinaU:P(),glifos:M(ee(ae))},I=h.classList.contains(`en-umbral`)&&!!C,L=I&&!l;function de(){let e=O.dpr,t=k.canvas.width,n=k.canvas.height,r=g.getBoundingClientRect();N.foto=p(t/2,n/2),ne(N.foto,ue),N.titulo=p(t,n),N.maquina=p(t,n);let i=d(S,r);f(N.titulo,i,e),a(N.maquina,i,e,{foto:N.foto,movil:E()});let o=[`foto`,`titulo`,`maquina`];if(I){let i={canvas:[t,n],dpr:O.dpr,nivel:v[D],glifos:ae};N.tituloU=p(t,n),N.maquinaU=p(t,n);let s=d(C,r);f(N.tituloU,s,e),a(N.maquinaU,s,e,{foto:N.foto,movil:E(),variante:`umbral`,ficha:i}),o.push(`tituloU`,`maquinaU`)}for(let e of o)F[e].image=N[e],F[e].needsUpdate=!0}de(),I&&h.classList.add(`umbral-gl`);let R=null,z=null,B=()=>{if(R&&R._liberar(),z&&z._liberar(),R=null,z=null,!l){try{R=new re(O,v[D])}catch{R=null}try{z=new ie(O,{lado:v[D].ondas})}catch{z=null}}};B();let V={tFoto:{value:F.foto},tTitulo:{value:F.titulo},tMaquina:{value:F.maquina},tTituloU:{value:F.tituloU},tMaquinaU:{value:F.maquinaU},uUmbral:{value:+!!I},uLinterna:{value:+!L},uHalo:{value:0},uInunda:{value:0},uFoco:{value:[.5,.5]},tGlifos:{value:F.glifos},tTinte:{value:F.foto},tVel:{value:F.foto},uRes:{value:[k.canvas.width,k.canvas.height]},uDpr:{value:O.dpr},uTime:{value:0},uCelda:{value:(E()?8:9)*O.dpr},uGlifosN:{value:11},uRevelado:{value:0},uHold:{value:[.5,.5]},uPuntero:{value:[-2,-2]},uCirculo:{value:0},uUsaFluido:{value:0},uIntro:{value:0},tOndas:{value:F.foto},uUsaOndas:{value:0},uOndasTexel:{value:[0,0]},uLuz:{value:+!L},cNoche:{value:b(`#120D0A`)},cCrema:{value:b(`#E7E2DA`)},cRosa:{value:b(`#F5CBD7`)}},fe=new c(k,{geometry:new m(k),program:new u(k,{vertex:se,fragment:ce,uniforms:V,depthTest:!1,depthWrite:!1})}),H={x:-1,y:-1,px:-1,py:-1,dentro:!1,movido:!1,quieto:0,recorrido:0,sx:.5,sy:.5,toque:-10},U={espera:0,n:0},W=0;function G(e,t){let n=g.getBoundingClientRect(),r=e-n.left,i=t-n.top;H.dentro=r>=0&&i>=0&&r<=n.width&&i<=n.height,H.dentro&&(H.x<0&&(H.px=r,H.py=i),H.x=r,H.y=i,H.movido=!0,H.quieto=0)}window.addEventListener(`pointermove`,e=>{e.pointerType!==`touch`&&G(e.clientX,e.clientY)},{passive:!0});let K={p:0,tween:null,mando:null,completo:!1,activo:!1},q=`mueve`,J=null;function Y(t,n){let r=g.getBoundingClientRect();V.uHold.value=[(t-r.left)/r.width,1-(n-r.top)/r.height],K.activo=!0,K.completo=!1,K.mando=i(),o.pulsando(!0),e.killTweensOf(K),K.tween=e.to(K,{p:1,duration:1.25,ease:`none`,onUpdate(){o.progreso(K.p),K.mando.avance(K.p),l||(V.uRevelado.value=e.parseEase(`power2.in`)(K.p)*.45)},onComplete(){K.completo=!0,K.mando.soltar(!0),e.to(V.uRevelado,{value:1,duration:l?0:1.1,ease:`power3.out`}),o.decir(`Así es por dentro`),q=`visto`}})}function X(){K.activo&&(K.activo=!1,o.pulsando(!1),K.tween&&K.tween.kill(),!K.completo&&K.mando?K.mando.soltar(!1):t(.8),e.to(K,{p:0,duration:.35,ease:`power2.out`,onUpdate(){o.progreso(K.p)}}),e.to(V.uRevelado,{value:0,duration:l?0:.85,ease:`power2.inOut`}),q===`visto`&&(clearTimeout(J),J=setTimeout(()=>o.decir(``),500)))}let pe=e=>e.closest&&e.closest(`a, button, input, label, [data-umbral-entradas]`);g.addEventListener(`pointerdown`,e=>{e.pointerType===`touch`||e.button!==0||pe(e.target)||h.classList.contains(`en-umbral`)||Y(e.clientX,e.clientY)}),window.addEventListener(`pointerup`,e=>{e.pointerType!==`touch`&&X()}),window.addEventListener(`blur`,X);let Z=null,Q=null;g.addEventListener(`touchstart`,e=>{let t=e.touches[0];Q=[t.clientX,t.clientY],G(t.clientX,t.clientY),H.px=H.x,H.py=H.y,clearTimeout(Z),Z=setTimeout(()=>Y(t.clientX,t.clientY),380)},{passive:!0}),g.addEventListener(`touchmove`,e=>{let t=e.touches[0];G(t.clientX,t.clientY),Q&&Math.hypot(t.clientX-Q[0],t.clientY-Q[1])>10&&clearTimeout(Z)},{passive:!0});let me=e=>{if(!I)return;let t=e.touches[0];G(t.clientX,t.clientY),H.toque=V.uTime.value,e.type===`touchstart`&&(H.px=H.x,H.py=H.y)};window.addEventListener(`touchstart`,me,{passive:!0}),window.addEventListener(`touchmove`,me,{passive:!0});let he=()=>{clearTimeout(Z),Q=null,X()};g.addEventListener(`touchend`,he),g.addEventListener(`touchcancel`,he),g.addEventListener(`contextmenu`,e=>{K.activo&&e.preventDefault()});let ge=!0;new IntersectionObserver(([e])=>{ge=e.isIntersecting}).observe(g);let _e=performance.now(),$={n:0,suma:0,hecha:!1};e.ticker.add(()=>{let e=performance.now(),t=Math.min(1/30,(e-_e)/1e3);if(_e=e,!ge||document.hidden)return;V.uTime.value+=t,H.quieto+=t;let i=0,a=0;if(H.movido){i=H.x-H.px,a=H.y-H.py,H.px=H.x,H.py=H.y,H.movido=!1;let e=Math.hypot(i,a);if(H.recorrido+=e,W=Math.min(1,e/t/2600),!I&&q===`mueve`&&H.recorrido>900&&(q=`manten`,clearTimeout(J),J=setTimeout(()=>o.decir(`Mantén pulsado`),350)),R){let e=Math.hypot(i/A,a/j),t=I?oe*.55:oe;R.splat(H.x/A,1-H.y/j,i/A*t*(A/j),-a/j*t,Math.min(.9,.35+e*12),I?.007:.0032)}U.n=0,U.espera=0}else W*=Math.exp(-t*8);if(z&&!K.activo&&H.quieto>2.5&&!I&&(U.espera-=t,U.espera<=0)){let e=U.n===0&&H.dentro&&H.x>=0,t=e?H.x/A:.1+Math.random()*.8,n=e?1-H.y/j:.15+Math.random()*.7,i=.75+Math.random()*.25;z.gota(t,n,i*y.fuerza,y.radio*(.8+Math.random()*.4)),r(t,i),U.n++,U.espera=H.quieto<22?1.2+Math.random()*1.4:2.8+Math.random()*2.6}if(I&&w&&V.uLinterna.value>0&&V.uTime.value-H.toque>1.4){let e=V.uTime.value*.42,t=A*(.5+.34*Math.sin(e)),n=j*(.5+.16*Math.sin(e*1.7));R&&H.x>=0&&R.splat(t/A,1-n/j,(t-H.x)*6,-(n-H.y)*6,.035,.004),H.x=t,H.y=n,H.dentro=!0}let s=1-Math.exp(-14*t);H.x>=0&&(H.sx+=(H.x/A-H.sx)*s,H.sy+=(1-H.y/j-H.sy)*s),V.uPuntero.value=[H.sx,H.sy],R||(V.uCirculo.value=!I&&H.dentro&&H.quieto<1.2?1:0);let c=I&&H.dentro&&H.x>=0?w?.75:H.quieto>5?.6:1:0;if(V.uHalo.value+=(c-V.uHalo.value)*(1-Math.exp(-(c>V.uHalo.value?6:1.2)*t)),R?(R.paso(t),V.tTinte.value=R.tinte,V.tVel.value=R.velocidad,V.uUsaFluido.value=1):V.uUsaFluido.value=0,z?(z.paso(t),V.tOndas.value=z.altura,V.uOndasTexel.value=z.texel,V.uUsaOndas.value=1):V.uUsaOndas.value=0,O.render({scene:fe,sort:!1,frustumCull:!1}),n(W,H.x/A,t,I?0:V.uRevelado.value),!$.hecha&&R&&($.n++,$.n>20&&($.suma+=t),$.n===140)){let e=$.suma/120;$.hecha=!0,e>.024&&D===`alta`?(D=`baja`,ve(),$.hecha=!1,$.n=0,$.suma=0):e>.04&&(R._liberar(),R=null)}}),h.classList.contains(`gl-activo`)||(h.classList.add(`gl-activo`,`titulo-gl`),e.to(V.uIntro,{value:1,duration:l?0:1.4,ease:`power2.out`}));function ve(){O.dpr=Math.min(devicePixelRatio,v[D].dpr),ye(),B()}function ye(){A=g.clientWidth,j=g.clientHeight,_(S,E()),O.setSize(A,j),V.uRes.value=[k.canvas.width,k.canvas.height],V.uDpr.value=O.dpr,V.uCelda.value=(E()?8:9)*O.dpr,de(),R&&R.redimensionar(k.canvas.width/k.canvas.height),z&&z.redimensionar(k.canvas.width/k.canvas.height)}let be=null,xe=innerWidth;window.addEventListener(`resize`,()=>{E()&&innerWidth===xe||(xe=innerWidth,clearTimeout(be),be=setTimeout(ye,160))});function Se(){I=!1,V.uUmbral.value=0,V.uInunda.value=0,V.uHalo.value=0;for(let e of[`tituloU`,`maquinaU`])N[e]=null,F[e].image=p(1,1),F[e].needsUpdate=!0;h.classList.remove(`umbral-gl`)}return{listo:Promise.resolve(!0),construir(t){return L?new Promise(n=>{e.timeline({onComplete:n}).add(()=>t(1,`alambre`)).to(V.uLuz,{value:1,duration:1.1,ease:`power2.inOut`,onStart:()=>t(2,`luz`)},1.1).to(V.uLinterna,{value:1,duration:1,ease:`power2.out`,onStart:()=>t(3,`linterna`)},2.3)}):(V.uLuz.value=1,V.uLinterna.value=1,Promise.resolve())},activarCursor(){o.decir(`Mueve el ratón`)},entrar(t=innerWidth/2,n=innerHeight/2){let r=()=>{if(R)for(let e=0;e<9;e++){let t=e/9*Math.PI*2+Math.random()*.3;R.splat(.5,.52,Math.cos(t)*900*(A/j),Math.sin(t)*900,.5,.004)}};if(!I){r();return}let i=g.getBoundingClientRect();V.uFoco.value=[(t-i.left)/A,1-(n-i.top)/j],l?Se():e.timeline({onComplete:Se}).to(V.uInunda,{value:1,duration:1.25,ease:`power2.inOut`}).to(V.uUmbral,{value:0,duration:.9,ease:`power2.inOut`},`-=0.35`).add(r,`-=0.5`)}}}export{x as crearPortada};