import{d as e}from"./preload-helper.BNRheB9E.js";import{r as t}from"./index.astro_astro_type_script_index_0_lang.qAks6YUH.js";var n={nombre:`Cafetería de Ejemplo`,hoy:`2026-10-31`},r=`
.mpre { position: absolute; inset: 0; display: grid; place-items: center; user-select: none; -webkit-user-select: none; }
.mpre__panel { position: relative; display: flex; flex-direction: column; border: 1px solid rgba(231,226,218,.55); background: rgba(18,13,10,.82);
  font-family: var(--mono); color: var(--crema-2); letter-spacing: .03em; }
.mpre__cab { display: flex; align-items: center; gap: .9em; padding: .9em 1.2em; border-bottom: 1px solid rgba(231,226,218,.18); font-size: .78em; letter-spacing: .16em; text-transform: uppercase; color: var(--crema-2); }
.mpre__punto { width: .55em; height: .55em; border-radius: 50%; background: var(--rosa); box-shadow: 0 0 10px rgba(245,203,215,.8); }
.mpre__ejemplo { margin-left: auto; padding: .15em .6em; border: 1px solid var(--crema-3); font-size: .9em; color: var(--crema-3); }
.mpre__chat { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: none; padding: 1em 1.2em; display: flex; flex-direction: column; gap: .8em; }
.mpre__chat::-webkit-scrollbar { display: none; }
.mpre__vacio { margin: auto; max-width: 26em; text-align: center; font-size: .82em; line-height: 1.7; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-3); }
.mpre__yo { align-self: flex-end; max-width: 80%; margin: 0; padding: .6em .9em; border: 1px solid var(--rosa); color: var(--crema); font-size: .92em; }
.mpre__paso { margin: 0; padding-left: .9em; border-left: 1px solid rgba(245,203,215,.5); display: grid; gap: .3em; font-size: .74em; line-height: 1.5; color: var(--crema-3); }
.mpre__paso b { font-weight: 400; color: var(--rosa); letter-spacing: .12em; text-transform: uppercase; }
.mpre__paso code { font-family: inherit; color: var(--crema-2); word-break: break-word; }
.mpre__paso .mpre__res { color: var(--crema); }
.mpre__paso.es-corto code { display: none; }
.mpre__piensa { font-size: .74em; color: var(--crema-3); letter-spacing: .14em; text-transform: uppercase; }
.mpre__piensa i { font-style: normal; animation: mpre-p 1s steps(4) infinite; display: inline-block; width: 1.6em; overflow: hidden; vertical-align: bottom; white-space: nowrap; }
@keyframes mpre-p { from { width: 0; } to { width: 1.6em; } }
.mpre__resp { display: grid; gap: .5em; }
.mpre__cifra { margin: 0; font-size: 1.75em; line-height: 1; letter-spacing: -.01em; color: var(--crema); }
.mpre__frase { margin: 0; font-family: var(--sans, inherit); font-size: .92em; line-height: 1.6; color: var(--crema-2); letter-spacing: 0; }
.mpre__graf { width: 100%; max-width: 360px; height: auto; overflow: visible; }
.mpre__graf text { font-family: var(--mono); fill: var(--crema-3); }
.mpre__graf .v { fill: var(--crema-2); }
.mpre__graf-t { margin: 0; font-size: .68em; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.mpre__pie { border-top: 1px solid rgba(231,226,218,.18); padding: .8em 1.2em 1em; display: grid; gap: .8em; }
.mpre__chips { display: flex; flex-wrap: wrap; gap: .45em; }
.mpre__chip { padding: .4em .75em; border: 1px solid rgba(231,226,218,.3); font-family: inherit; font-size: .74em; letter-spacing: .04em; color: var(--crema-2); transition: border-color .3s, color .3s, background .3s; }
.mpre__chip:hover { border-color: var(--crema); color: var(--crema); }
.mpre__chip[aria-pressed='true'] { border-color: var(--rosa); color: var(--tinta); background: var(--rosa); }
.mpre__entrada { display: flex; align-items: center; gap: .9em; }
.mpre__boton { position: relative; flex: none; width: 3.4em; height: 3.4em; border-radius: 50%; border: 1px solid rgba(231,226,218,.5); display: grid; place-items: center; cursor: pointer; touch-action: none; transition: border-color .3s, transform .4s var(--curva); }
.mpre__boton:hover { border-color: var(--crema); }
.mpre__boton.es-pulsado { transform: scale(.94); border-color: var(--rosa); }
.mpre__boton::before { content: ''; width: .8em; height: .8em; border-radius: 50%; background: var(--rosa); }
.mpre__boton svg { position: absolute; inset: -4px; width: calc(100% + 8px); height: calc(100% + 8px); transform: rotate(-90deg); pointer-events: none; }
.mpre__boton circle { fill: none; stroke: var(--rosa); stroke-width: 2; }
.mpre__boton[disabled] { opacity: .35; cursor: default; }
.mpre__linea { flex: 1; min-width: 0; padding: .55em 0; border-bottom: 1px solid rgba(231,226,218,.3); font-size: .9em; color: var(--crema); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mpre__linea.es-pista { color: var(--crema-3); }
.mpre__linea u { text-decoration: none; display: inline-block; width: .55em; height: 1em; margin-left: .1em; vertical-align: -.12em; background: var(--rosa); animation: mpre-c 1s steps(2) infinite; }
@keyframes mpre-c { 50% { opacity: 0; } }
.mpre-ley { font-family: var(--mono); }
.mpre-ley__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mpre-ley ol { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(231,226,218,.25); }
.mpre-ley li { display: grid; grid-template-columns: 1.6em 1fr; padding: 8px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 10.5px; line-height: 1.5; color: var(--crema-2); }
.mpre-ley li span { color: var(--rosa); }
.mpre-ley__ok { margin: 14px 0 0; font-size: 10px; line-height: 1.6; letter-spacing: .08em; color: var(--crema-2); }
.mpre-ley__ok b { font-weight: 400; color: var(--rosa); }
`,i=!1,a=e=>String(Math.round(e)).replace(/\B(?=(\d{3})+(?!\d))/g,`.`),o=e=>`${e.toFixed(2).replace(`.`,`,`).replace(/\B(?=(\d{3})+(?!\d),)/g,`.`)} €`,s=e=>`${(e/1e3).toFixed(1).replace(`.`,`,`)} s`,c=[`Ventas de octubre`,`Lo más vendido`,`Frente a septiembre`],l={dia:`por día`,semana:`por semana`,mes:`por mes`,producto:`por producto`},u=e=>`${Number(e.slice(8,10))}/${Number(e.slice(5,7))}`;function d({etiquetas:e,valores:t}){let n=300/t.length,r=Math.min(34,n*.56),i=Math.max(...t),o=Math.floor(n/5.6),s=e=>e.length>o?`${e.slice(0,o-1)}.`:e;return`<svg class="mpre__graf" viewBox="0 0 300 96" aria-hidden="true"><line x1="0" y1="78" x2="300" y2="78" stroke="rgba(231,226,218,.35)"/>${t.map((t,o)=>{let c=Math.max(2,t/i*58),l=n*o+(n-r)/2;return`<g><rect x="${l}" y="${78-c}" width="${r}" height="${c}" data-y="${78-c}" data-h="${c}" fill="rgba(245,203,215,.16)" stroke="var(--rosa)" stroke-width="1"/>
      <text class="v" x="${l+r/2}" y="${78-c-6}" text-anchor="middle" font-size="9">${a(t)}</text>
      <text x="${l+r/2}" y="92" text-anchor="middle" font-size="9">${s(e[o])}</text></g>`}).join(``)}</svg>`}async function f(a,{mision:f,panel:p,sonido:m,reducido:h}){if(!i){let e=document.createElement(`style`);e.textContent=r,document.head.append(e),i=!0}let g=t.preguntas,_=+!h,v=document.createElement(`div`);v.className=`mpre`,v.innerHTML=`
    <div class="mpre__panel" data-panel>
      <div class="mpre__cab"><span class="mpre__punto"></span>${n.nombre} · tu asistente<span class="mpre__ejemplo">Ejemplo</span></div>
      <div class="mpre__chat" data-chat aria-live="polite"><p class="mpre__vacio">Elige una pregunta y mantén pulsado el botón para hacerla</p></div>
      <div class="mpre__pie">
        <div class="mpre__chips">${g.map((e,t)=>`<button type="button" class="mpre__chip" data-chip="${t}" aria-pressed="${t===0}" aria-label="${e.pregunta}">${c[t]||e.pregunta}</button>`).join(``)}</div>
        <div class="mpre__entrada">
          <button type="button" class="mpre__boton" data-boton aria-label="Mantén pulsado para preguntar"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" data-aro/></svg></button>
          <span class="mpre__linea es-pista" data-linea></span>
        </div>
      </div>
    </div>`,a.append(v);let y=v.querySelector(`[data-panel]`),b=v.querySelector(`[data-chat]`),x=v.querySelector(`[data-boton]`),S=v.querySelector(`[data-linea]`),C=v.querySelector(`[data-aro]`),w=[...v.querySelectorAll(`[data-chip]`)],T=2*Math.PI*18.5;C.style.strokeDasharray=`${T}`;let E=()=>{let e=innerWidth<=760,t=e?innerWidth-24:a.clientWidth,n=e?Math.max(300,innerHeight-372):a.clientHeight;Object.assign(y.style,e?{position:`fixed`,left:`12px`,top:`200px`}:{position:``,left:``,top:``}),Object.assign(y.style,{width:`${t}px`,height:`${n}px`,fontSize:`${Math.max(10.5,Math.min(14,n/32))}px`})};E(),addEventListener(`resize`,E);let D=0,O=0,k=!1,A=!1,j=null,M=0,N=!0,P=()=>{let e=g[D].pregunta,t=Math.round(O*e.length);S.classList.toggle(`es-pista`,t===0),S.innerHTML=t===0?e:`${e.slice(0,t)}<u></u>`,C.style.strokeDashoffset=`${T*(1-O)}`};P(),w.forEach(e=>e.addEventListener(`click`,()=>{k||(D=Number(e.dataset.chip),w.forEach(t=>t.setAttribute(`aria-pressed`,String(t===e))),O=0,P(),m.tic(.7))})),p.gesto(f.gesto);let F=e=>t=>{if(!N)return;let n=Math.min(.05,(t-e)/1e3);O=Math.max(0,Math.min(1,O+(A?n/1.15:-n/.35))),j?.avance(O),P(),A&&O>=1?H():(A||O>0)&&(M=requestAnimationFrame(F(t)))},I=e=>{k||(e.preventDefault(),x.setPointerCapture?.(e.pointerId),A=!0,x.classList.add(`es-pulsado`),j=m.subida(),cancelAnimationFrame(M),M=requestAnimationFrame(F(performance.now())))},L=()=>{A&&(A=!1,x.classList.remove(`es-pulsado`),k||(j?.soltar(!1),j=null))};x.addEventListener(`pointerdown`,I),x.addEventListener(`pointerup`,L),x.addEventListener(`pointercancel`,L),x.addEventListener(`lostpointercapture`,L),x.addEventListener(`keydown`,e=>{!k&&[`Enter`,` `].includes(e.key)&&(e.preventDefault(),O=1,P(),H())});let R=e=>new Promise(t=>setTimeout(t,e*_)),z=()=>{b.scrollTop=b.scrollHeight},B=t=>{let n=document.createElement(`template`);n.innerHTML=t.trim();let r=n.content.firstElementChild;return b.append(r),e.fromTo(r,{opacity:0,y:8},{opacity:1,y:0,duration:.45*_,ease:`power3.out`}),z(),r},V=async(e,t,n=16)=>{for(let r=1;r<=t.length;r++){if(!N)return;e.textContent=t.slice(0,r),r%3==0&&m.tecla(.35),_&&await new Promise(e=>setTimeout(e,n))}z()};async function H(){if(k)return;k=!0,A=!1,x.classList.remove(`es-pulsado`),x.disabled=!0,j?.soltar(!0),j=null;let t=g[D];p.gesto(``),p.orden(f.curso,!0),b.replaceChildren(),B(`<p class="mpre__yo">${t.pregunta}</p>`),O=0,P();for(let e of t.pasos){let t=B(`<p class="mpre__piensa">Pensando qué consultar<i>...</i></p>`);await R(Math.min(1500,e.ms*.3)),t.remove();let n=e.entrada,r=B(`<div class="mpre__paso"><b>▸ Consulta a tus datos</b><code data-a></code><code data-b></code><span class="mpre__res" data-c></span></div>`);m.nota(2),await V(r.querySelector(`[data-a]`),`ventas · ${u(n.desde)} a ${u(n.hasta)} · ${l[n.agrupar_por]||n.agrupar_por}`,10),await V(r.querySelector(`[data-b]`),e.consulta,4),await R(350),r.querySelector(`[data-c]`).textContent=`← ${e.filas} fila${e.filas===1?``:`s`} · total ${o(e.total)}`,m.nota(4),z(),await R(400)}let n=B(`<p class="mpre__piensa">Escribiendo la respuesta<i>...</i></p>`);await R(Math.min(1300,(t.msRespuesta||1500)*.3)),n.remove();let r=t.respuesta,i=B(`<div class="mpre__resp"><p class="mpre__cifra">${r.cifra}</p><p class="mpre__frase" data-frase></p>${d(r.grafica)}<p class="mpre__graf-t">${r.grafica.titulo}</p></div>`);if([...i.querySelectorAll(`rect`)].forEach((t,n)=>{let r=Number(t.dataset.y),i=Number(t.dataset.h);e.fromTo(t,{attr:{y:r+i,height:0}},{attr:{y:r,height:i},duration:.6*_,delay:(.15+n*.09)*_,ease:`power3.out`,onStart:()=>m.nota(n%5)})}),b.querySelectorAll(`.mpre__paso`).forEach(e=>e.classList.add(`es-corto`)),await V(i.querySelector(`[data-frase]`),r.texto,14),!N)return;p.orden(f.veredicto,!0),m.ok();let a=document.createElement(`div`);a.className=`mpre-ley`,a.innerHTML=`<p class="mpre-ley__t">Lo que ha hecho</p><ol><li><span>·</span>Entender la pregunta</li>${t.pasos.map(e=>`<li><span>·</span>Consultar ventas, ${u(e.entrada.desde)} a ${u(e.entrada.hasta)}, ${l[e.entrada.agrupar_por]||e.entrada.agrupar_por}</li>`).join(``)}<li><span>·</span>Contestar: ${r.cifra}, con su gráfica</li></ol>
      <p class="mpre-ley__ok">Cada cifra sale de la consulta<br>Respondido con IA en <b>${s(t.ms)}</b></p>`,p.leyenda(a),p.hecha(f.explica),k=!1,x.disabled=!1}return{destruir(){N=!1,cancelAnimationFrame(M),j?.soltar(!1),removeEventListener(`resize`,E),v.remove()}}}export{f as montar};