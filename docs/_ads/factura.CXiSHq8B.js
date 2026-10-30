import{E as e}from"./preload-helper.D93ujLFU.js";import{n as t,t as n}from"./index.astro_astro_type_script_index_0_lang.D24xpV9w.js";var r=`
.mfac { position: absolute; inset: 0; display: grid; place-items: center; touch-action: none; user-select: none; -webkit-user-select: none; }
.mfac__hoja { position: relative; aspect-ratio: .78; padding: 7% 8%; display: flex; flex-direction: column; gap: 4.2%;
  border: 1px solid rgba(231,226,218,.55); background: rgba(231,226,218,.035); color: var(--crema-2);
  font-family: var(--mono); line-height: 1.45; letter-spacing: .03em; }
.mfac__ejemplo { position: absolute; right: 8%; top: 7%; padding: .2em .6em; border: 1px solid var(--crema-3); font-size: .78em; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.mfac__logo { width: 2.6em; height: 2.6em; border: 1px solid var(--crema-3); border-radius: 50%; margin-bottom: .6em; }
.mfac__prov { font-size: 1.25em; color: var(--crema); letter-spacing: .02em; }
.mfac__fila { display: flex; justify-content: space-between; gap: 1em; }
.mfac__k { color: var(--crema-3); text-transform: uppercase; letter-spacing: .12em; font-size: .82em; }
.mfac__tabla { width: 100%; border-collapse: collapse; font-size: .92em; }
.mfac__tabla th { text-align: left; font-weight: 400; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: .82em; padding: .4em 0; border-bottom: 1px solid rgba(231,226,218,.3); }
.mfac__tabla td { padding: .45em 0; border-bottom: 1px solid rgba(231,226,218,.08); }
.mfac__tabla th:not(:first-child), .mfac__tabla td:not(:first-child) { text-align: right; }
.mfac__totales { margin-top: auto; margin-left: auto; width: 62%; display: grid; gap: .35em; }
.mfac__total { padding-top: .5em; border-top: 1px solid rgba(231,226,218,.4); font-size: 1.2em; color: var(--crema); }
.mfac__campo { position: relative; outline: 1px solid transparent; outline-offset: .3em; transition: outline-color .3s, color .3s; }
.mfac__campo.es-visto { outline-color: var(--rosa); color: var(--crema); }
.mfac__campo .insp { position: absolute; left: calc(100% + 1.1em); top: 50%; font-size: 9px; opacity: 0; transform: translate(-6px, -50%); transition: opacity .3s, transform .4s var(--curva); pointer-events: none; z-index: 2; }
.mfac__campo.es-visto .insp { opacity: 1; transform: translate(0, -50%); }
.mfac__lector { position: absolute; top: -4%; bottom: -4%; left: 0; width: 0; pointer-events: none; }
.mfac__linea { position: absolute; top: 0; bottom: 0; left: -1px; width: 2px; background: var(--rosa); box-shadow: 0 0 18px rgba(245,203,215,.7); }
.mfac__velo { position: absolute; top: 4%; bottom: 4%; right: 0; width: 100vw; max-width: var(--hecho, 0px); background: linear-gradient(90deg, transparent, rgba(245,203,215,.08)); }
.mfac__tirador { position: absolute; left: -29px; top: 50%; width: 58px; height: 58px; margin-top: -29px; border: 1.5px solid var(--crema); border-radius: 50%;
  background: rgba(18,13,10,.75); pointer-events: auto; cursor: grab; display: grid; place-items: center; }
.mfac__tirador::before { content: ''; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--rosa); }
.mfac__tirador:active { cursor: grabbing; }
.mfac__flechas { position: absolute; left: 40px; top: 50%; transform: translateY(-50%); display: flex; gap: 5px; color: var(--crema); font-size: 10px; pointer-events: none; transition: opacity .3s; }
.mfac__flechas span { animation: mfac-pasa 1.4s ease-in-out infinite; }
.mfac__flechas span:nth-child(2) { animation-delay: .12s; } .mfac__flechas span:nth-child(3) { animation-delay: .24s; } .mfac__flechas span:nth-child(4) { animation-delay: .36s; }
@keyframes mfac-pasa { 0%, 100% { opacity: .25; } 40% { opacity: 1; } }
.mfac.es-arrastrando .mfac__flechas { opacity: 0; }
.mfac-excel { font-family: var(--mono); }
.mfac-excel__t { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--rosa); }
.mfac-excel__t::before { content: ''; width: 12px; height: 12px; border: 1px solid var(--rosa); background: linear-gradient(var(--rosa), var(--rosa)) 50% 0 / 1px 100% no-repeat, linear-gradient(var(--rosa), var(--rosa)) 0 50% / 100% 1px no-repeat; }
.mfac-excel dl { margin: 0; display: grid; grid-template-columns: auto 1fr; border-top: 1px solid rgba(231,226,218,.25); }
.mfac-excel dt, .mfac-excel dd { margin: 0; padding: 7px 0; border-bottom: 1px solid rgba(231,226,218,.12); font-size: 11px; }
.mfac-excel dt { padding-right: 14px; color: var(--crema-3); text-transform: uppercase; letter-spacing: .1em; font-size: 9.5px; }
.mfac-excel dd { color: var(--crema); text-align: right; white-space: nowrap; }
.mfac-excel__ok { margin: 14px 0 0; font-size: 10px; line-height: 1.6; letter-spacing: .08em; color: var(--crema-2); }
.mfac-excel__ok b { font-weight: 400; color: var(--rosa); }
`,i=!1,a=e=>e.toLocaleString(`es-ES`,{minimumFractionDigits:2,maximumFractionDigits:2});async function o(o,{mision:s,panel:c,sonido:l,reducido:u}){if(!i){let e=document.createElement(`style`);e.textContent=r,document.head.append(e),i=!0}let d=n,f=document.createElement(`div`);f.className=`mfac`;let p=(e,t,n)=>`<span class="mfac__campo" data-campo="${e}"><span class="insp">${t}</span>${n}</span>`;f.innerHTML=`
    <div class="mfac__hoja" data-hoja>
      <span class="mfac__ejemplo">Ejemplo</span>
      <div>
        <div class="mfac__logo"></div>
        <div>${p(`proveedor`,`Proveedor`,`<span class="mfac__prov">${d.proveedor}</span>`)}</div>
        <div class="mfac__k">NIF ${d.nif}</div>
      </div>
      <div>
        <div class="mfac__fila"><span class="mfac__k">Factura</span><span>${d.numero}</span></div>
        <div class="mfac__fila"><span class="mfac__k">Fecha</span>${p(`fecha`,`Fecha`,d.fecha)}</div>
      </div>
      <table class="mfac__tabla">
        <thead><tr><th>Concepto</th><th>Cant.</th><th>Importe</th></tr></thead>
        <tbody>${d.lineas.map(([e,t,,n])=>`<tr><td>${e}</td><td>${t}</td><td>${n}</td></tr>`).join(``)}</tbody>
      </table>
      <div class="mfac__totales">
        <div class="mfac__fila"><span class="mfac__k">Base</span>${p(`base`,`Base`,`${d.base} €`)}</div>
        <div class="mfac__fila"><span class="mfac__k">IVA ${d.ivaTipo}</span>${p(`iva`,`IVA`,`${d.iva} €`)}</div>
        <div class="mfac__fila mfac__total"><span class="mfac__k">Total</span>${p(`total`,`Total`,`${d.total} €`)}</div>
      </div>
      <div class="mfac__lector" data-lector>
        <span class="mfac__velo"></span><span class="mfac__linea"></span>
        <span class="mfac__tirador" data-tirador role="slider" tabindex="0" aria-label="Lector de la factura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></span>
        <span class="mfac__flechas" aria-hidden="true"><span>▸</span><span>▸</span><span>▸</span><span>▸</span></span>
      </div>
    </div>`,o.append(f);let m=f.querySelector(`[data-hoja]`),h=f.querySelector(`[data-lector]`),g=f.querySelector(`[data-tirador]`),_=[...f.querySelectorAll(`[data-campo]`)],v=()=>{let e=Math.max(o.clientHeight*.94,Math.min(innerHeight*.5,430));m.style.height=`${e}px`,m.style.fontSize=`${Math.max(7,e/44)}px`};v(),addEventListener(`resize`,v),c.gesto(s.gesto);let y=0,b=!1,x=null,S=null,C=new Set,w=e=>{y=Math.max(0,Math.min(1,e));let t=m.clientWidth;h.style.transform=`translateX(${y*t}px)`,h.style.setProperty(`--hecho`,`${y*t}px`),g.setAttribute(`aria-valuenow`,String(Math.round(y*100))),S?.avance(y);let n=m.getBoundingClientRect();_.forEach((e,t)=>{let r=e.getBoundingClientRect(),i=(r.left+r.width/2-n.left)/n.width,a=y>=i;a&&!C.has(e)?(C.add(e),e.classList.add(`es-visto`),l.nota(2+t)):!a&&C.has(e)&&!b&&(C.delete(e),e.classList.remove(`es-visto`))})},T=e=>{b||(e.preventDefault(),g.setPointerCapture?.(e.pointerId),x={x:e.clientX,p:y},f.classList.add(`es-arrastrando`),S=l.subida())},E=e=>{x&&(w(x.p+(e.clientX-x.x)/m.clientWidth),y>=.985&&O())},D=()=>{if(!x||b)return;x=null,f.classList.remove(`es-arrastrando`),S?.soltar(!1),S=null;let t={p:y};e.to(t,{p:0,duration:.6*!u,ease:`power3.out`,onUpdate:()=>w(t.p)})};g.addEventListener(`pointerdown`,T),addEventListener(`pointermove`,E),addEventListener(`pointerup`,D),addEventListener(`pointercancel`,D),g.addEventListener(`keydown`,e=>{!b&&[`ArrowRight`,`ArrowLeft`].includes(e.key)&&(e.preventDefault(),w(y+(e.key===`ArrowRight`?.1:-.1)),y>=.985&&O())});async function O(){if(b)return;b=!0,x=null,f.classList.remove(`es-arrastrando`),w(1),S?.soltar(!0),S=null,_.forEach(e=>e.classList.add(`es-visto`)),e.to(h,{opacity:0,duration:.6,delay:.3}),c.gesto(``),c.orden(s.curso,!0),await new Promise(e=>setTimeout(e,u?0:900));let n=t.campos,r=Math.round((n.base+n.iva)*100)===Math.round(n.total*100);c.orden(r?s.veredicto:`Factura leída · no cuadra: se marca para revisar`,!0),l.ok();let i=document.createElement(`div`);i.className=`mfac-excel`;let o=[[`Proveedor`,n.proveedor],[`Fecha`,n.fecha.split(`-`).reverse().join(`/`)],[`Base`,`${a(n.base)} €`],[`IVA`,`${a(n.iva)} €`],[`Total`,`${a(n.total)} €`]];i.innerHTML=`<p class="mfac-excel__t">Tu Excel · fila nueva</p><dl>${o.map(([e])=>`<dt>${e}</dt><dd></dd>`).join(``)}</dl>
      <p class="mfac-excel__ok">${a(n.base)} + ${a(n.iva)} = <b>${a(n.total)} €</b> ${r?`· cuadra`:`· no cuadra`}${t.grabada&&t.ms?`<br>Leída con IA en ${(t.ms/1e3).toLocaleString(`es-ES`,{maximumFractionDigits:1})} s`:``}</p>`,c.leyenda(i),c.hecha(s.explica);let d=[...i.querySelectorAll(`dd`)];for(let e=0;e<o.length;e++){let t=o[e][1];for(let n=1;n<=t.length;n++)d[e].textContent=t.slice(0,n),l.tecla(.6),u||await new Promise(e=>setTimeout(e,22))}}return{destruir(){removeEventListener(`resize`,v),removeEventListener(`pointermove`,E),removeEventListener(`pointerup`,D),removeEventListener(`pointercancel`,D),S?.soltar(!1),f.remove()}}}export{o as montar};