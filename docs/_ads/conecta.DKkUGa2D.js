import{D as e}from"./preload-helper.B-0fTmDk.js";var t=[[`1041`,`Taza`,2,24],[`1042`,`Camiseta`,1,22],[`1043`,`Libreta`,3,27],[`1044`,`Bolsa de tela`,1,14.5],[`1045`,`Lámina A3`,2,36],[`1046`,`Taza`,1,12],[`1047`,`Camiseta`,2,44]],n=3,r=1.5,i=`
.mcon { position: absolute; inset: 0; display: grid; place-items: center; user-select: none; -webkit-user-select: none; }
.mcon__mesa { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 18%; font-family: var(--mono); color: var(--crema-2); letter-spacing: .03em; }
.mcon--vertical .mcon__mesa { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; gap: 14%; }
.mcon__caja { position: relative; min-height: 0; display: flex; flex-direction: column; border: 1px solid rgba(231,226,218,.55); background: rgba(18,13,10,.82); }
.mcon__cab { display: flex; align-items: center; gap: .7em; padding: .8em 1em; border-bottom: 1px solid rgba(231,226,218,.18); font-size: .74em; letter-spacing: .16em; text-transform: uppercase; color: var(--crema-2); }
.mcon__ejemplo { margin-left: auto; padding: .1em .5em; border: 1px solid var(--crema-3); font-size: .85em; color: var(--crema-3); }
.mcon__ico { width: 1em; height: .8em; border: 1px solid var(--crema-3); }
.mcon__excel .mcon__ico { background: linear-gradient(var(--crema-3), var(--crema-3)) 50% 0 / 1px 100% no-repeat, linear-gradient(var(--crema-3), var(--crema-3)) 0 50% / 100% 1px no-repeat; }
.mcon__lista { flex: 1; min-height: 0; overflow: hidden; margin: 0; padding: .5em 1em; list-style: none; display: flex; flex-direction: column; gap: .4em; }
.mcon__pedido { display: grid; grid-template-columns: auto 1fr auto; gap: .2em .7em; align-items: baseline; padding: .45em .6em; border: 1px solid rgba(231,226,218,.14); font-size: .74em; line-height: 1.4; }
.mcon__pedido b { font-weight: 400; color: var(--crema); }
.mcon__pedido em { grid-column: 1 / -1; font-style: normal; font-size: .9em; letter-spacing: .1em; text-transform: uppercase; color: var(--rosa); }
.mcon__pedido.es-pasado { border-color: rgba(245,203,215,.35); }
.mcon__pedido.es-pasado em { color: var(--crema-3); }
.mcon__pie { padding: .7em 1em; border-top: 1px solid rgba(231,226,218,.18); font-size: .72em; letter-spacing: .12em; text-transform: uppercase; color: var(--crema-3); }
.mcon__pie b { font-weight: 400; color: var(--rosa); }
.mcon__tabla { width: 100%; border-collapse: collapse; font-size: .72em; }
.mcon__tabla th { text-align: left; font-weight: 400; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: .9em; padding: .55em .6em; border-bottom: 1px solid rgba(231,226,218,.3); }
.mcon__tabla td { padding: .5em .6em; border-bottom: 1px solid rgba(231,226,218,.1); color: var(--crema); white-space: nowrap; }
.mcon__tabla td + td, .mcon__tabla th + th { border-left: 1px solid rgba(231,226,218,.1); }
.mcon__tabla tr.es-nueva td { background: rgba(245,203,215,.1); }
.mcon__hueco { flex: 1; min-height: 0; overflow: hidden; }
.mcon__enchufe { position: absolute; z-index: 2; width: 2.6em; height: 2.6em; margin: -1.3em 0 0 -1.3em; border-radius: 50%; border: 1.5px solid var(--crema); background: var(--noche); display: grid; place-items: center; }
.mcon__enchufe::before { content: ''; width: .8em; height: .8em; border-radius: 50%; border: 1.5px solid var(--rosa); }
.mcon__enchufe--a { left: 100%; top: 50%; cursor: grab; touch-action: none; }
.mcon__enchufe--b { left: 0; top: 50%; border-color: rgba(231,226,218,.45); }
.mcon__enchufe--b::before { border-color: rgba(231,226,218,.45); border-style: dashed; }
.mcon--vertical .mcon__enchufe--a { left: 50%; top: 100%; }
.mcon--vertical .mcon__enchufe--b { left: 50%; top: 0; }
.mcon.es-conectada .mcon__enchufe--b { border-color: var(--rosa); box-shadow: 0 0 18px rgba(245,203,215,.6); }
.mcon.es-conectada .mcon__enchufe--b::before { border-style: solid; border-color: var(--rosa); background: var(--rosa); }
.mcon__enchufe--a:focus-visible { outline: 1px solid var(--rosa); outline-offset: 4px; }
.mcon__cable { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 1; }
.mcon__cable path { fill: none; stroke: var(--crema); stroke-width: 1.5; }
.mcon.es-conectada .mcon__cable path { stroke: var(--rosa); }
.mcon__cable circle { fill: var(--rosa); }
.mcon__flechas { position: absolute; z-index: 2; display: flex; gap: 4px; color: var(--crema); font-size: 10px; transform: translate(1.9em, -50%); pointer-events: none; transition: opacity .3s; }
.mcon--vertical .mcon__flechas { transform: translate(-50%, 1.7em) rotate(90deg); }
.mcon__flechas span { animation: mcon-pasa 1.4s ease-in-out infinite; }
.mcon__flechas span:nth-child(2) { animation-delay: .12s; } .mcon__flechas span:nth-child(3) { animation-delay: .24s; }
@keyframes mcon-pasa { 0%, 100% { opacity: .25; } 40% { opacity: 1; } }
.mcon.es-arrastrando .mcon__flechas, .mcon.es-conectada .mcon__flechas { opacity: 0; }
.mcon-ley { font-family: var(--mono); }
.mcon-ley__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mcon-ley dl { margin: 0; display: grid; grid-template-columns: 1fr auto; border-top: 1px solid rgba(231,226,218,.25); }
.mcon-ley dt, .mcon-ley dd { margin: 0; padding: 7px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 10.5px; }
.mcon-ley dt { color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: 9.5px; }
.mcon-ley dd { color: var(--crema); text-align: right; }
`,a=!1,o=e=>`${e.toFixed(2).replace(`.`,`,`)} €`,s=()=>new Date().toTimeString().slice(0,8);async function c(c,{mision:l,panel:u,sonido:d,reducido:f}){if(!a){let e=document.createElement(`style`);e.textContent=i,document.head.append(e),a=!0}let p=+!f,m=document.createElement(`div`);m.className=`mcon`,m.innerHTML=`
    <div class="mcon__mesa" data-mesa>
      <div class="mcon__caja mcon__tienda">
        <div class="mcon__cab"><span class="mcon__ico"></span>Tu tienda online<span class="mcon__ejemplo">Ejemplo</span></div>
        <ul class="mcon__lista" data-lista></ul>
        <div class="mcon__pie">Sin pasar al Excel: <b data-sin>0</b></div>
        <button type="button" class="mcon__enchufe mcon__enchufe--a" data-a aria-label="Conectar la tienda con el Excel"></button>
        <span class="mcon__flechas" data-flechas aria-hidden="true"><span>▸</span><span>▸</span><span>▸</span></span>
      </div>
      <div class="mcon__caja mcon__excel">
        <div class="mcon__cab"><span class="mcon__ico"></span>Excel de pedidos</div>
        <div class="mcon__hueco"><table class="mcon__tabla"><thead><tr><th>Nº</th><th>Producto</th><th>Importe</th><th>Hora</th></tr></thead><tbody data-filas></tbody></table></div>
        <span class="mcon__enchufe mcon__enchufe--b" data-b aria-hidden="true"></span>
      </div>
      <svg class="mcon__cable" data-cable aria-hidden="true"><path data-path d=""/></svg>
    </div>`,c.append(m);let h=m.querySelector(`[data-mesa]`),g=m.querySelector(`[data-lista]`),_=m.querySelector(`[data-filas]`),v=m.querySelector(`[data-sin]`),y=m.querySelector(`[data-a]`),b=m.querySelector(`[data-b]`),x=m.querySelector(`[data-cable]`),S=m.querySelector(`[data-path]`),C=m.querySelector(`[data-flechas]`),w=!1,T=()=>{let e=innerWidth<=760,t=e?innerWidth-24:c.clientWidth,n=e?Math.max(300,innerHeight-372):c.clientHeight;w=t/n<1.1,m.classList.toggle(`mcon--vertical`,w),Object.assign(h.style,e?{position:`fixed`,left:`12px`,top:`200px`}:{position:``,left:``,top:``}),Object.assign(h.style,{width:`${t}px`,height:`${n}px`,fontSize:`${Math.max(10,Math.min(13.5,(w?t:n)/30))}px`});let r=E(y);Object.assign(C.style,{left:`${r.x}px`,top:`${r.y}px`}),O(D||r)},E=e=>{let t=h.getBoundingClientRect(),n=e.getBoundingClientRect();return{x:n.left+n.width/2-t.left,y:n.top+n.height/2-t.top}},D=null,O=e=>{let t=E(y);if(!e){S.setAttribute(`d`,``);return}let n=Math.hypot(e.x-t.x,e.y-t.y),r=Math.min(90,14+n*.28),i=w?{x:r,y:0}:{x:0,y:r},a=(e.x-t.x)*.35,o=(e.y-t.y)*.35;S.setAttribute(`d`,`M ${t.x} ${t.y} C ${t.x+a+i.x} ${t.y+o+i.y}, ${e.x-a+i.x} ${e.y-o+i.y}, ${e.x} ${e.y}`)};T(),addEventListener(`resize`,T);let k=[],A=!1,j=!1,M=!0,N=0,P=[],F=()=>{v.textContent=String(k.filter(e=>!e.pasado).length)},I=n=>{if(!M)return;let[r,i,a,c]=t[n],l=document.createElement(`li`);l.className=`mcon__pedido`,l.innerHTML=`<b>#${r}</b><span>${a} × ${i}</span><span>${o(c)}</span><em>Sin pasar</em>`,g.prepend(l),e.fromTo(l,{opacity:0,y:-8},{opacity:1,y:0,duration:.4*p,ease:`power3.out`});let u={num:r,prod:i,imp:c,li:l,pasado:!1,hora:s()};k.push(u),F(),d.gota(.25,.5),A&&R(u)};for(let e=0;e<n;e++)I(e);for(let e=n;e<t.length;e++)P.push(setTimeout(()=>I(e),(e-n+1)*r*1e3));u.gesto(l.gesto);let L=Promise.resolve(),R=n=>{L=L.then(async()=>{if(!M)return;let r=document.createElementNS(`http://www.w3.org/2000/svg`,`circle`);r.setAttribute(`r`,`4`),x.append(r);let i=S.getTotalLength(),a={t:0};d.nota(1+k.indexOf(n)%5,.7),await e.to(a,{t:1,duration:.55*p,ease:`power1.inOut`,onUpdate:()=>{let e=S.getPointAtLength(a.t*i);r.setAttribute(`cx`,e.x),r.setAttribute(`cy`,e.y)}}).then(),r.remove();let s=document.createElement(`tr`);s.className=`es-nueva`,s.innerHTML=`<td>${n.num}</td><td>${n.prod}</td><td>${o(n.imp)}</td><td>${n.hora}</td>`,_.append(s),setTimeout(()=>s.classList.remove(`es-nueva`),900),d.tecla(.6),n.pasado=!0,n.li.classList.add(`es-pasado`),n.li.querySelector(`em`).textContent=`En el Excel ✓`,F(),k.length===t.length&&k.every(e=>e.pasado)&&G()})},z=!1,B=null,V=e=>{A||(e.preventDefault(),y.setPointerCapture?.(e.pointerId),z=!0,m.classList.add(`es-arrastrando`),B=d.subida(),H(e))},H=e=>{if(!z)return;let t=h.getBoundingClientRect();D={x:e.clientX-t.left,y:e.clientY-t.top};let n=E(b),r=E(y),i=Math.max(0,1-Math.hypot(D.x-n.x,D.y-n.y)/Math.max(1,Math.hypot(r.x-n.x,r.y-n.y)));B?.avance(i),O(D)},U=t=>{if(!z)return;z=!1,m.classList.remove(`es-arrastrando`);let n=E(b);if(D&&Math.hypot(D.x-n.x,D.y-n.y)<Math.max(44,h.clientWidth*.08)){W();return}B?.soltar(!1),B=null;let r=E(y),i={...D};e.to(i,{x:r.x,y:r.y,duration:.5*p,ease:`power3.out`,onUpdate:()=>O(i),onComplete:()=>{D=null,O(null)}})};y.addEventListener(`pointerdown`,V),addEventListener(`pointermove`,H),addEventListener(`pointerup`,U),addEventListener(`pointercancel`,U),y.addEventListener(`keydown`,e=>{!A&&[`Enter`,` `].includes(e.key)&&(e.preventDefault(),W())});function W(){A||(A=!0,D=E(b),O(D),B?.soltar(!0),B=null,m.classList.add(`es-conectada`),N=k.filter(e=>!e.pasado).length,u.gesto(``),u.orden(l.curso,!0),k.filter(e=>!e.pasado).forEach(R))}function G(){if(j)return;j=!0,u.orden(l.veredicto,!0),d.ok();let e=document.createElement(`div`);e.className=`mcon-ley`,e.innerHTML=`<p class="mcon-ley__t">Lo que ha pasado</p><dl>
      <dt>Pedidos en la tienda</dt><dd>${k.length}</dd>
      <dt>Pasados al Excel</dt><dd>${k.filter(e=>e.pasado).length}</dd>
      <dt>Copiados a mano</dt><dd>0</dd>
      <dt>Esperaban al conectar</dt><dd>${N}</dd></dl>`,u.leyenda(e),u.hecha(l.explica)}return{destruir(){M=!1,P.forEach(clearTimeout),B?.soltar(!1),removeEventListener(`resize`,T),removeEventListener(`pointermove`,H),removeEventListener(`pointerup`,U),removeEventListener(`pointercancel`,U),m.remove()}}}export{c as montar};