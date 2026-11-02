// PROTOTIPO · B · Desmontada. Brand en oscuro, como la portada y Tech. Arriba, el ads terminado; al bajar, la pieza se
// pone en vista técnica y se despieza en cinco planchas (la marca, la forma, el color, la letra y la voz), cada una con
// su cota y su regla en mono; después se recorre capa a capa y al final se vuelve a montar. CSS 3D, sin WebGL. El
// ratón la ladea un poco. Debajo, lo que hacemos con la tuya. De usar y tirar.

const CSS = /* css */ `
.pb { color: var(--crema); }
.pb-viaje { position: relative; height: 460vh; }
.pb-escena { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
.pb-texto { position: absolute; left: var(--lado); top: 15vh; z-index: 3; max-width: 36vw; }
.pb-etq { margin: 0 0 3vh; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-2); }
.pb-t { margin: 0; font-family: var(--serif); font-weight: 300; font-size: clamp(44px, 5vw, 92px); line-height: .94; letter-spacing: -.02em; transition: opacity .5s var(--curva); }
.pb-t em { font-style: italic; }
.pb-p { margin: 3vh 0 0; max-width: 34ch; font-size: 15px; line-height: 1.6; color: var(--crema-2); }

.pb-pila { position: absolute; left: 58%; top: 56%; width: 0; height: 0; perspective: 1800px; }
.pb-giro { position: absolute; left: 0; top: 0; transform-style: preserve-3d; }
.pb-capa { --w: min(38vw, 58vh); --h: calc(var(--w) * .62); position: absolute; left: calc(var(--w) / -2); top: calc(var(--h) / -2); width: var(--w); height: var(--h);
  border: 1px solid rgba(245, 203, 215, .38); background: rgba(18, 13, 10, .86); transition: opacity .5s var(--curva), border-color .5s var(--curva); }
.pb-capa.apagada { opacity: .28; }
.pb-capa.activa { border-color: #F5CBD7; }
.pb-capa__dentro { position: absolute; inset: 9%; display: flex; align-items: center; justify-content: center; }
.pb-capa--marca { background: #120D0A; }
.pb-capa--marca .pb-capa__dentro { flex-direction: column; gap: 6%; }
.pb-iso { width: 58%; color: #F5CBD7; }
.pb-iso svg, .pb-logo svg { display: block; width: 100%; height: auto; }
.pb-logo { width: 34%; color: var(--crema); }
.pb-forma { width: 74%; color: #F5CBD7; position: relative; }
.pb-forma svg path { fill: none; stroke: currentColor; stroke-width: 5; }
.pb-forma::before, .pb-forma::after { content: ''; position: absolute; left: -8%; right: -8%; border-top: 1px dashed rgba(245, 203, 215, .45); }
.pb-forma::before { top: 0; } .pb-forma::after { bottom: 0; }
.pb-colores { display: grid; grid-template-columns: repeat(5, 1fr); width: 100%; height: 100%; }
.pb-colores div { display: flex; align-items: flex-end; padding: 8px; font-family: var(--mono); font-size: 9px; letter-spacing: .06em; text-transform: uppercase; }
.pb-letras { width: 100%; display: flex; align-items: baseline; justify-content: space-between; }
.pb-letras b { font-weight: 300; font-size: calc(var(--w) * .2); line-height: 1; }
.pb-voz { margin: 0; font-family: var(--serif); font-weight: 300; font-style: italic; font-size: calc(var(--w) * .07); line-height: 1.15; text-align: center; }

.pb-cotas { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.pb-cotas svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.pb-cotas line { stroke: rgba(245, 203, 215, .55); stroke-width: 1; stroke-dasharray: 3 3; }
.pb-cota { position: absolute; left: 0; top: 0; font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; color: var(--crema-2); transition: color .4s; }
.pb-cota b { font-weight: 400; color: #F5CBD7; margin-right: 8px; }
.pb-cota.activa { color: var(--crema); }

.pb-regla { position: absolute; left: var(--lado); bottom: 12vh; z-index: 3; max-width: 34vw; opacity: 0; transform: translateY(12px); transition: opacity .5s var(--curva), transform .5s var(--curva); }
.pb-regla.on { opacity: 1; transform: none; }
.pb-regla p { margin: 0; }
.pb-regla__n { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #F5CBD7; }
.pb-regla__t { margin-top: 12px !important; font-family: var(--serif); font-weight: 300; font-size: clamp(26px, 2.4vw, 42px); line-height: 1.05; }

.pb-despues { position: relative; z-index: 2; padding: 16vh var(--lado) 22vh; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 5vw; }
.pb-t2 { margin: 0; max-width: 11ch; font-family: var(--serif); font-weight: 300; font-size: clamp(46px, 6vw, 110px); line-height: .92; letter-spacing: -.03em; }
.pb-servicios { margin: 0; padding: 0; list-style: none; font-size: 15px; line-height: 1.9; }
.pb-servicios li::before { content: '· '; color: #F5CBD7; }
.pb-p2 { margin: 0 0 4vh; font-size: 16px; line-height: 1.55; color: var(--crema-2); }

@media (max-width: 760px) {
  .pb-texto { max-width: none; right: var(--lado); top: 12vh; }
  .pb-pila { left: 50%; top: 60%; }
  .pb-capa { --w: 74vw; }
  .pb-cota { font-size: 9px; }
  .pb-cota > span { display: none; }
  .pb-regla { max-width: none; right: var(--lado); bottom: 9vh; }
  .pb-despues { grid-template-columns: 1fr; }
}`;

const CAPAS = [
  { n: '01', nombre: 'La marca', cota: 'Todo junto, en su sitio', regla: 'Lo que la gente ve: todo junto y en su sitio.' },
  { n: '02', nombre: 'Forma', cota: '2500 × 1036 · se escala, no se estira', regla: 'El isotipo se escala. Nunca se estira.' },
  { n: '03', nombre: 'Color', cota: '5 colores · cada uno con su papel', regla: 'Cinco colores, y cada uno con su papel.' },
  { n: '04', nombre: 'Letra', cota: 'Garamond · Open Sauce · Quetine', regla: 'Garamond para la marca, Open Sauce para la interfaz y Quetine para el detalle.' },
  { n: '05', nombre: 'Voz', cota: 'Menos adjetivos · más hechos', regla: 'Menos adjetivos. Más hechos.' },
];
const PALETA = [['#34190A', 'Marrón', '#E7E2DA'], ['#E7E2DA', 'Beige', '#190900'], ['#F5CBD7', 'Rosa', '#190900'], ['#F5F3F1', 'Blanco', '#190900'], ['#190900', 'Negro', '#E7E2DA']];
const liso = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

export function montar(raiz, { iso, logo, reducido, conRaton, barra }) {
  barra('var(--crema-2)');
  const estilo = document.createElement('style');
  estilo.textContent = CSS;
  document.head.append(estilo);

  const dentro = [
    `<div class="pb-iso">${iso}</div><div class="pb-logo">${logo}</div>`,
    `<div class="pb-forma">${iso}</div>`,
    `<div class="pb-colores">${PALETA.map(([f, n, t]) => `<div style="background:${f};color:${t}">${n}</div>`).join('')}</div>`,
    `<div class="pb-letras"><b style="font-family: var(--serif)">Aa</b><b style="font-family: var(--sans); font-weight: 400">Aa</b><b style="font-family: 'Quetine', cursive">Aa</b></div>`,
    `<p class="pb-voz">No prometemos. Medimos.<br>Menos adjetivos. Más hechos.</p>`,
  ];
  raiz.innerHTML = `
  <section class="pb">
    <div class="pb-viaje" data-viaje>
      <div class="pb-escena">
        <div class="pb-texto">
          <p class="pb-etq">( Brand · desmontada )</p>
          <h1 class="pb-t" data-vivo data-titulo>Una marca no es <em>un logo.</em></h1>
          <p class="pb-p">Son cinco capas que cuentan lo mismo, cada una con sus reglas. Baja y desmóntala.</p>
        </div>
        <div class="pb-pila"><div class="pb-giro" data-giro>
          ${CAPAS.map((c, i) => `<div class="pb-capa ${i === 0 ? 'pb-capa--marca' : ''}" data-capa="${i}"><div class="pb-capa__dentro">${dentro[i]}</div></div>`).join('')}
        </div></div>
        <div class="pb-cotas" aria-hidden="true"><svg>${CAPAS.map(() => '<line />').join('')}</svg>${CAPAS.map((c) => `<span class="pb-cota"><b>${c.n}</b><span>${c.nombre} · ${c.cota}</span></span>`).join('')}</div>
        <div class="pb-regla" data-regla><p class="pb-regla__n" data-regla-n></p><p class="pb-regla__t" data-regla-t></p></div>
      </div>
    </div>
    <div class="pb-despues">
      <h2 class="pb-t2" data-vivo>Así trabajamos <em>la tuya.</em></h2>
      <div>
        <p class="pb-p2">Primero miramos cómo se ve tu marca y cómo debería verse. Después hacemos cada capa y la dejamos escrita en reglas. En la web, esas reglas son código, y se cumplen solas.</p>
        <ul class="pb-servicios"><li>Identidad y logotipo</li><li>Webs con una idea propia</li><li>Dirección de arte</li><li>Contenido</li></ul>
      </div>
    </div>
  </section>`;

  const viaje = raiz.querySelector('[data-viaje]'), giro = raiz.querySelector('[data-giro]');
  const capas = [...raiz.querySelectorAll('[data-capa]')], cotas = [...raiz.querySelectorAll('.pb-cota')], lineas = [...raiz.querySelectorAll('.pb-cotas line')];
  const regla = raiz.querySelector('[data-regla]'), reglaN = raiz.querySelector('[data-regla-n]'), reglaT = raiz.querySelector('[data-regla-t]');
  const titulo = raiz.querySelector('[data-titulo]');

  const raton = { x: 0, y: 0, sx: 0, sy: 0 };
  const alMover = (e) => { if (e.pointerType === 'mouse') { raton.x = e.clientX / innerWidth - 0.5; raton.y = e.clientY / innerHeight - 0.5; } };
  if (conRaton) addEventListener('pointermove', alMover, { passive: true });

  let p = 0, antes = performance.now(), raf = 0, activaAntes = -2, cierreAntes = false;
  const vuelta = (ahora) => {
    raf = requestAnimationFrame(vuelta);
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    antes = ahora;
    const r = viaje.getBoundingClientRect(), objetivo = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
    p += (objetivo - p) * (reducido ? 1 : 1 - Math.exp(-dt * 6));
    const k = 1 - Math.exp(-dt * 3);
    raton.sx += (raton.x - raton.sx) * k; raton.sy += (raton.y - raton.sy) * k;

    // Vista técnica (0-0,18), se despieza (0,08-0,36), capa a capa (0,36-0,86) y se vuelve a montar (0,86-1)
    const vista = liso(0, 0.18, p) * (1 - liso(0.86, 0.98, p)), abre = liso(0.08, 0.36, p) * (1 - liso(0.86, 0.98, p));
    const h = capas[0].offsetHeight;
    giro.style.transform = `rotateX(${vista * 56 + raton.sy * -6}deg) rotateZ(${vista * -34 + raton.sx * 6}deg)`;
    const activa = p > 0.36 && p < 0.86 ? Math.min(4, Math.floor((p - 0.36) / 0.1)) : -1;
    capas.forEach((c, i) => {
      // (con las planchas juntas, un pelo de separación: así la marca terminada queda encima y no la última del DOM)
      const z = (2 - i) * h * 0.46 * abre + (4 - i) * 0.6, fuera = i === activa ? h * 0.18 : 0;
      c.style.transform = `translate3d(${fuera}px, 0, ${z}px)`;
      c.classList.toggle('apagada', activa >= 0 && i !== activa);
      c.classList.toggle('activa', i === activa);
    });
    // Las cotas: a la derecha de cada plancha, con su línea
    cotas.forEach((cota, i) => {
      const b = capas[i].getBoundingClientRect(), y = Math.max(64, b.top + b.height / 2), x = Math.min(innerWidth - cota.offsetWidth - 24, b.right + 36);
      cota.style.opacity = abre > 0.5 ? 1 : 0;
      cota.style.transform = `translate3d(${x}px, ${y - 7}px, 0)`;
      cota.classList.toggle('activa', i === activa);
      const l = lineas[i];
      l.setAttribute('x1', b.right - b.width * 0.12); l.setAttribute('y1', y); l.setAttribute('x2', x - 8); l.setAttribute('y2', y);
      l.style.opacity = abre > 0.5 ? 1 : 0;
    });
    if (activa !== activaAntes) {
      activaAntes = activa;
      regla.classList.toggle('on', activa >= 0);
      if (activa >= 0) { reglaN.textContent = `${CAPAS[activa].n} — ${CAPAS[activa].nombre}`; reglaT.textContent = CAPAS[activa].regla; }
    }
    const cierre = p > 0.9;
    if (cierre !== cierreAntes) { cierreAntes = cierre; titulo.innerHTML = cierre ? 'Brand por fuera. <em>Tech por dentro.</em>' : 'Una marca no es <em>un logo.</em>'; }
  };
  raf = requestAnimationFrame(vuelta);

  return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', alMover); estilo.remove(); };
}
