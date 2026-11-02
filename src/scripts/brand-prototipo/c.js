// PROTOTIPO · C · Una regla, en todas partes. Brand como un sistema: un muro con seis piezas de la marca (la web, un
// post, la tarjeta, la firma del correo, un cartel y el icono). Empiezan cada una a su aire (cada una con su letra, su
// color y su forma de hablar) y un interruptor les pone sistema: pasan, una detrás de otra, a la misma regla. Con
// sistema, tocar un color lo cambia en todas a la vez, y al lado se ve la regla escrita en código. Debajo, lo que
// hacemos con la tuya. De usar y tirar.

const CSS = /* css */ `
.pc { color: var(--crema); }
.pc-portada { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 4vw; align-items: center; padding: 14vh var(--lado) 12vh; }
.pc-etq { margin: 0 0 3vh; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-2); }
.pc-t { margin: 0; font-family: var(--serif); font-weight: 300; font-size: clamp(44px, 4.8vw, 88px); line-height: .94; letter-spacing: -.02em; }
.pc-t em { font-style: italic; }
.pc-p { margin: 3vh 0 0; max-width: 34ch; font-size: 15px; line-height: 1.6; color: var(--crema-2); }
.pc-mando { margin-top: 5vh; display: grid; gap: 18px; }
.pc-interruptor { display: inline-flex; align-items: center; gap: 12px; width: max-content; padding: 0; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-2); cursor: pointer; }
.pc-interruptor i { position: relative; width: 46px; height: 24px; border-radius: 12px; border: 1px solid var(--crema-3); }
.pc-interruptor i::after { content: ''; position: absolute; left: 3px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--crema); transition: transform .45s var(--curva), background .45s; }
.pc-interruptor[aria-pressed="true"] i::after { transform: translateX(22px); background: #F5CBD7; }
.pc-interruptor span { transition: color .3s; }
.pc-interruptor[aria-pressed="false"] span:first-child, .pc-interruptor[aria-pressed="true"] span:last-child { color: var(--crema); }
.pc-interruptor:not(.tocado) i { animation: pc-late 1.6s var(--curva) infinite; }
@keyframes pc-late { 50% { box-shadow: 0 0 0 6px rgba(245, 203, 215, .18); } }
.pc-tokens { display: flex; gap: 22px; opacity: .3; pointer-events: none; transition: opacity .5s var(--curva); }
.pc-sistema .pc-tokens { opacity: 1; pointer-events: auto; }
.pc-tokens p { margin: 0 0 8px; font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-3); }
.pc-tokens div { display: flex; gap: 8px; }
.pc-tokens button { width: 26px; height: 26px; border-radius: 50%; outline: 1px solid var(--crema-3); outline-offset: 3px; cursor: pointer; }
.pc-tokens button[aria-pressed="true"] { outline-color: #F5CBD7; }
.pc-codigo { margin: 0; padding: 14px 16px; border: 1px solid var(--linea); font-family: var(--mono); font-size: 11px; line-height: 1.7; color: var(--crema-2); white-space: pre; overflow: hidden; }
.pc-codigo b { font-weight: 400; color: #F5CBD7; }

.pc-muro { --fondo: #34190A; --acento: #F5CBD7; --texto: #E7E2DA; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: minmax(0, 1fr); gap: 12px; height: min(74vh, 720px); }
.pc-pieza { position: relative; overflow: hidden; }
.pc-pieza > div { position: absolute; inset: 0; transition: background-color .7s var(--curva), color .7s var(--curva); }
.pc-pieza .sis { clip-path: inset(0 100% 0 0); }
.pc-sistema .pc-pieza .sis { clip-path: inset(0 0 0 0); transition: clip-path .55s steps(9) var(--retraso, 0s), background-color .7s var(--curva), color .7s var(--curva); }
.pc-pieza .caos { transition: opacity .3s steps(4) calc(var(--retraso, 0s) + .45s); }
.pc-sistema .pc-pieza .caos { opacity: 0; }
.pc-nombre { position: absolute; left: 8px; top: 8px; z-index: 2; padding: 2px 6px; font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: #190900; background: rgba(231, 226, 218, .85); opacity: 0; transition: opacity .25s; }
.pc-pieza:hover .pc-nombre { opacity: 1; }
.pc-web { grid-column: 1 / 5; grid-row: 1 / 3; }
.pc-post { grid-column: 5 / 7; grid-row: 1 / 3; }
.pc-tarjeta { grid-column: 1 / 3; grid-row: 3 / 4; }
.pc-firma { grid-column: 3 / 5; grid-row: 3 / 4; }
.pc-cartel { grid-column: 5 / 6; grid-row: 3 / 5; }
.pc-icono { grid-column: 6 / 7; grid-row: 3 / 4; }
.pc-hueco { grid-column: 1 / 5; grid-row: 4 / 5; }
.pc-muro .sis { background: var(--fondo); color: var(--texto); font-family: var(--sans); }
.pc-muro .sis .tit { font-family: var(--serif); font-weight: 300; letter-spacing: -.015em; line-height: .95; }
.pc-muro .sis .tit em { font-style: italic; color: var(--acento); }
.pc-muro .sis .iso { color: var(--acento); }
.pc-muro svg { display: block; width: 100%; height: auto; }
.pc-boton { display: inline-block; padding: 8px 14px; font-size: 11px; }
.sis .pc-boton { background: var(--acento); color: #190900; }
.pc-mini { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; opacity: .7; }

.pc-despues { padding: 14vh var(--lado) 22vh; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 5vw; border-top: 1px solid var(--linea); }
.pc-t2 { margin: 0; max-width: 12ch; font-family: var(--serif); font-weight: 300; font-size: clamp(46px, 6vw, 110px); line-height: .92; letter-spacing: -.03em; }
.pc-t2 em { font-style: italic; }
.pc-p2 { margin: 0 0 4vh; font-size: 16px; line-height: 1.55; color: var(--crema-2); }
.pc-servicios { margin: 0; padding: 0; list-style: none; font-size: 15px; line-height: 1.9; }
.pc-servicios li::before { content: '· '; color: #F5CBD7; }

@media (max-width: 760px) {
  .pc-portada { grid-template-columns: 1fr; padding-top: 12vh; }
  .pc-muro { height: 120vw; }
  .pc-despues { grid-template-columns: 1fr; }
}`;

// Cada pieza, a su aire (sin sistema) y con la regla (con sistema). Los textos con sistema son los del manual
const PIEZAS = (iso, logo) => [
  {
    clase: 'web', nombre: 'Web',
    caos: `<div class="caos" style="background:#1E5EFF;color:#fff;font-family:Verdana,sans-serif;padding:7% 8%">
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:bold"><span style="display:inline-block;width:30%;transform:scaleX(1.5);transform-origin:left;color:#FFD400">${logo}</span><span>INICIO · SERVICIOS · CONTACTO</span></div>
      <p style="margin:12% 0 4%;font-size:clamp(20px,2.4vw,40px);font-weight:bold;line-height:1.05">¡Soluciones integrales 360º para tu negocio!</p>
      <span class="pc-boton" style="background:#FFD400;color:#1E5EFF;font-weight:bold;border-radius:20px">¡¡PÍDENOS PRESUPUESTO!!</span></div>`,
    sis: `<div class="sis" style="padding:7% 8%"><div style="display:flex;justify-content:space-between;align-items:center"><span style="width:22%;display:block">${logo}</span><span class="pc-mini">Brand · Tech · Proyectos</span></div>
      <p class="tit" style="margin:9% 0 4%;max-width:13ch;font-size:clamp(26px,3.2vw,56px)">Lo bonito por sí solo <em>no aguanta nada.</em></p>
      <span class="pc-boton">Hablemos</span></div>`,
  },
  {
    clase: 'post', nombre: 'Post',
    caos: `<div class="caos" style="background:linear-gradient(135deg,#FF6B00,#E91E63);color:#fff;font-family:Impact,sans-serif;display:grid;place-items:center;text-align:center;padding:10%">
      <p style="margin:0;font-size:clamp(20px,2.4vw,40px);line-height:1;text-transform:uppercase">¡Líderes del sector!<br><span style="font-family:'Comic Sans MS',cursive;font-size:.5em;text-transform:none">Calidad y profesionalidad 💯</span></p></div>`,
    sis: `<div class="sis" style="display:flex;flex-direction:column;justify-content:space-between;padding:10%"><span class="iso" style="width:42%">${iso}</span>
      <p class="tit" style="margin:0;font-size:clamp(22px,2.4vw,42px)">Una buena marca no decora. <em>Coloca.</em></p></div>`,
  },
  {
    clase: 'tarjeta', nombre: 'Tarjeta',
    caos: `<div class="caos" style="background:#fff;color:#13A05A;font-family:'Times New Roman',serif;padding:8%;display:flex;flex-direction:column;justify-content:center;gap:6px">
      <b style="font-size:20px;font-style:italic;letter-spacing:4px">ADS PARTNERS S.L.</b><span style="font-size:11px;color:#555">Consultoría · Marketing · Soluciones</span></div>`,
    sis: `<div class="sis" style="padding:9%;display:flex;flex-direction:column;justify-content:space-between"><span style="width:52%;display:block">${logo}</span>
      <span class="pc-mini">Madrid · adsgroup@ads-partners.com</span></div>`,
  },
  {
    clase: 'firma', nombre: 'Firma del correo',
    caos: `<div class="caos" style="background:#F2F2F2;color:#8E44AD;font-family:'Courier New',monospace;padding:8%;font-size:11px;line-height:1.6">
      Un saludo!!<br><b style="font-family:Georgia,serif;font-size:14px;color:#222">El equipo de ADS-Partners</b><br><span style="color:#2C7BE5;text-decoration:underline">www.ads-partners.com</span> · Innovación disruptiva</div>`,
    sis: `<div class="sis" style="padding:8%;display:flex;align-items:center;gap:8%"><span class="iso" style="width:24%;flex:none">${iso}</span>
      <div><p class="tit" style="margin:0 0 6px;font-size:20px">El equipo de adsPartners</p><span class="pc-mini">Brand por fuera · Tech por dentro</span></div></div>`,
  },
  {
    clase: 'cartel', nombre: 'Cartel',
    caos: `<div class="caos" style="background:#FFC107;color:#B00020;font-family:'Arial Black',sans-serif;padding:12%;display:flex;flex-direction:column;justify-content:space-between">
      <p style="margin:0;font-size:22px;line-height:1;transform:rotate(-4deg)">¡TU PARTNER DE CONFIANZA!</p><span style="font-size:10px;color:#222;font-family:Arial">Llámanos ya</span></div>`,
    sis: `<div class="sis" style="padding:12%;display:flex;flex-direction:column;justify-content:space-between"><p class="tit" style="margin:0;font-size:clamp(20px,1.8vw,30px)">Brand por fuera. <em>Tech por dentro.</em></p>
      <span class="iso" style="width:60%">${iso}</span></div>`,
  },
  {
    clase: 'icono', nombre: 'Icono',
    caos: `<div class="caos" style="background:#13A05A;display:grid;place-items:center"><span style="width:56%;color:#fff;transform:scaleY(1.7) rotate(8deg)">${iso}</span></div>`,
    sis: `<div class="sis" style="display:grid;place-items:center"><span class="iso" style="width:56%">${iso}</span></div>`,
  },
  {
    clase: 'hueco', nombre: 'Hasta aquí',
    caos: `<div class="caos" style="display:grid;place-items:center;border:1px dashed var(--crema-3);color:var(--crema-3);font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase">Seis piezas · seis empresas distintas</div>`,
    sis: `<div class="sis" style="display:grid;place-items:center;background:transparent;border:1px solid var(--linea);color:var(--crema-2)"><span class="pc-mini">Seis piezas · una sola marca</span></div>`,
  },
];
const FONDOS = [['Marrón', '#34190A', '#E7E2DA'], ['Negro', '#190900', '#E7E2DA'], ['Beige', '#E7E2DA', '#190900']];
const ACENTOS = [['Rosa', '#F5CBD7'], ['Beige', '#E7E2DA'], ['Blanco', '#F5F3F1']];

export function montar(raiz, { iso, logo, reducido, barra }) {
  barra('var(--crema-2)');
  const estilo = document.createElement('style');
  estilo.textContent = CSS;
  document.head.append(estilo);

  raiz.innerHTML = `
  <section class="pc" data-pc>
    <div class="pc-portada">
      <div>
        <p class="pc-etq">( Brand · una regla, en todas partes )</p>
        <h1 class="pc-t" data-vivo>Si no se entiende, <em>no se compra.</em></h1>
        <p class="pc-p">El branding es que todo cuente lo mismo, en todas partes. Ahora mismo, cada pieza va a su aire. Ponle una regla.</p>
        <div class="pc-mando">
          <button class="pc-interruptor" type="button" aria-pressed="false" data-interruptor><span>Sin sistema</span><i></i><span>Con sistema</span></button>
          <div class="pc-tokens">
            <div><p>Fondo</p><div>${FONDOS.map(([n, c], i) => `<button type="button" aria-label="${n}" data-fondo="${i}" aria-pressed="${i === 0}" style="background:${c}"></button>`).join('')}</div></div>
            <div><p>Acento</p><div>${ACENTOS.map(([n, c], i) => `<button type="button" aria-label="${n}" data-acento="${i}" aria-pressed="${i === 0}" style="background:${c}"></button>`).join('')}</div></div>
          </div>
          <pre class="pc-codigo" data-codigo></pre>
        </div>
      </div>
      <div class="pc-muro" data-muro>
        ${PIEZAS(iso, logo).map((p, i) => `<div class="pc-pieza pc-${p.clase}" style="--retraso:${(i * 0.09).toFixed(2)}s"><span class="pc-nombre">${p.nombre}</span>${p.caos}${p.sis}</div>`).join('')}
      </div>
    </div>
    <div class="pc-despues">
      <h2 class="pc-t2" data-vivo>Bonita, sí. <em>Pero con sentido.</em></h2>
      <div>
        <p class="pc-p2">Miramos cómo se ve tu marca y cómo debería verse. Hacemos la identidad y la dejamos escrita en reglas. En la web, esas reglas son código, y se cumplen solas.</p>
        <ul class="pc-servicios"><li>Identidad y logotipo</li><li>Webs con una idea propia</li><li>Dirección de arte</li><li>Contenido</li></ul>
      </div>
    </div>
  </section>`;

  const pc = raiz.querySelector('[data-pc]'), muro = raiz.querySelector('[data-muro]'), codigo = raiz.querySelector('[data-codigo]');
  const interruptor = raiz.querySelector('[data-interruptor]');
  const regla = { fondo: 0, acento: 0, sistema: false };
  const pintar = () => {
    const [nf, f, t] = FONDOS[regla.fondo];
    // La regla también cuida que se lea: sobre beige, el acento claro pasa a marrón
    const claro = f === '#E7E2DA', [na, a] = claro ? ['Marrón (sobre beige)', '#34190A'] : ACENTOS[regla.acento];
    muro.style.setProperty('--fondo', f); muro.style.setProperty('--texto', t); muro.style.setProperty('--acento', a);
    codigo.innerHTML = regla.sistema
      ? `:root {\n  --fondo:   <b>${f}</b>; /* ${nf.toLowerCase()} */\n  --acento:  <b>${a}</b>; /* ${na.toLowerCase()} */\n  --titular: <b>'Apple Garamond'</b>;\n  --texto:   <b>'Open Sauce'</b>;\n}${claro ? '\n/* sobre beige, el rosa no se lee */' : ''}`
      : `/* sin reglas: cada pieza\n   decide lo suyo */\n.web     { font: Verdana;     }\n.post    { font: Impact;      }\n.tarjeta { font: Times;       }`;
    raiz.querySelectorAll('[data-fondo]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.fondo) === regla.fondo)));
    raiz.querySelectorAll('[data-acento]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.acento) === regla.acento)));
  };
  interruptor.addEventListener('click', () => {
    regla.sistema = !regla.sistema;
    interruptor.classList.add('tocado');
    interruptor.setAttribute('aria-pressed', String(regla.sistema));
    pc.classList.toggle('pc-sistema', regla.sistema);
    pintar();
  });
  raiz.querySelectorAll('[data-fondo]').forEach((b) => b.addEventListener('click', () => { regla.fondo = Number(b.dataset.fondo); pintar(); }));
  raiz.querySelectorAll('[data-acento]').forEach((b) => b.addEventListener('click', () => { regla.acento = Number(b.dataset.acento); pintar(); }));
  pintar();

  return () => { estilo.remove(); };
}
