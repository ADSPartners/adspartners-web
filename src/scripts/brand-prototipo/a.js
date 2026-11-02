// PROTOTIPO · A · El inspector. Brand en crema, como Proyectos. Una pieza de nuestra marca (el póster del manual) y,
// al pasar el ratón, el inspector de la portada: enmarca la parte que tienes debajo y saca dos etiquetas, lo que mide
// de verdad (medido del DOM) y la decisión que hay detrás. Quieto, se pasea solo por las partes. Debajo, las cuatro
// fichas de la marca, que también se inspeccionan. De usar y tirar.

const CSS = /* css */ `
.pa { background: var(--crema); color: var(--tinta); }
.pa-portada { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 4vw; padding: 15vh var(--lado) 11vh; }
.pa-etq { margin: 0 0 4vh; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(25, 9, 0, .55); }
.pa-t { margin: 0; max-width: 11ch; font-family: var(--serif); font-weight: 300; font-size: clamp(46px, 5.6vw, 100px); line-height: .94; letter-spacing: -.02em; }
.pa-t em, .pa-t2 em { font-style: italic; }
.pa-p { margin: 4vh 0 0; max-width: 40ch; font-size: 16px; line-height: 1.55; color: rgba(25, 9, 0, .74); }
.pa-pista { margin: 5vh 0 0; display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: rgba(25, 9, 0, .55); }
.pa-pista::before { content: ''; width: 6px; height: 6px; background: var(--rosa); outline: 1px solid var(--tinta); }

.pa-pieza { --pad: 8%; position: relative; justify-self: center; margin: 0; width: min(36vw, 60vh); aspect-ratio: 4 / 5; overflow: hidden;
  box-shadow: 0 50px 90px -40px rgba(52, 25, 10, .55), 0 2px 8px rgba(52, 25, 10, .14); }
.pa-pieza__fondo { position: absolute; inset: 0; background: #34190A; }
.pa-pieza__iso { position: absolute; left: var(--pad); width: 46%; top: 11%; color: #F5CBD7; }
.pa-pieza__iso svg { display: block; width: 100%; height: auto; }
.pa-pieza__claim { position: absolute; left: var(--pad); right: var(--pad); bottom: 20%; margin: 0; font-family: var(--serif); font-weight: 300; font-size: clamp(30px, 3.4vw, 60px); line-height: .95; letter-spacing: -.015em; color: #E7E2DA; }
.pa-pieza__claim em { font-style: italic; color: #F5CBD7; }
.pa-pieza__pie { position: absolute; left: var(--pad); right: var(--pad); bottom: 6%; margin: 0; padding-top: 12px; display: flex; justify-content: space-between; border-top: 1px solid rgba(231, 226, 218, .26);
  font-family: var(--sans); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(231, 226, 218, .62); }

.pa-capas { padding: 14vh var(--lado) 20vh; border-top: 1px solid rgba(25, 9, 0, .12); }
.pa-t2 { margin: 0; max-width: 15ch; font-family: var(--serif); font-weight: 300; font-size: clamp(40px, 4.4vw, 80px); line-height: .96; letter-spacing: -.02em; }
.pa-p2 { margin: 3vh 0 0; max-width: 46ch; font-size: 16px; line-height: 1.55; color: rgba(25, 9, 0, .74); }
.pa-fichas { margin-top: 9vh; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.pa-ficha { position: relative; min-height: 320px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; background: #F5F3F1; }
.pa-num { margin: 0; font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: rgba(25, 9, 0, .5); }
.pa-ficha__logo { color: #34190A; }
.pa-ficha__logo svg { display: block; width: 100%; height: auto; }
.pa-paleta { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.pa-paleta li { display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
.pa-paleta i { width: 34px; height: 22px; outline: 1px solid rgba(25, 9, 0, .12); }
.pa-letras { display: grid; gap: 10px; }
.pa-letras p { margin: 0; display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.pa-letras b { font-weight: 400; font-size: 46px; line-height: 1; }
.pa-letras span { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: rgba(25, 9, 0, .5); }
.pa-voz { margin: 0; font-family: var(--serif); font-weight: 300; font-size: 30px; line-height: 1.08; }
.pa-voz s { color: rgba(25, 9, 0, .38); text-decoration-thickness: 1px; }
.pa-voz b { font-weight: 300; font-style: italic; }
.pa-voz__no { margin: 0; font-family: var(--mono); font-size: 10px; line-height: 1.5; letter-spacing: .08em; text-transform: uppercase; color: rgba(25, 9, 0, .55); min-height: 3em; }

.pa-insp { position: fixed; inset: 0; z-index: 30; pointer-events: none; }
.pa-insp svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.pa-insp rect, .pa-insp line, .pa-insp path { fill: none; stroke: #190900; stroke-width: 1; vector-effect: non-scaling-stroke; }
.pa-insp .sobre-oscuro { stroke: #F5CBD7; }
.pa-tag { position: absolute; left: 0; top: 0; padding: 3px 8px 3px 18px; font-family: var(--mono); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap;
  color: #190900; background: #F5CBD7; opacity: 0; transition: opacity .25s var(--curva); }
.pa-tag::before { content: ''; position: absolute; left: 7px; top: 50%; width: 5px; height: 5px; margin-top: -2.5px; background: #190900; }
.pa-tag--2 { color: #E7E2DA; background: #190900; }
.pa-tag--2::before { background: #F5CBD7; }
.pa-tag.on { opacity: 1; }

@media (max-width: 760px) {
  .pa-portada { grid-template-columns: 1fr; padding-top: 13vh; gap: 7vh; }
  .pa-pieza { width: 84vw; }
  .pa-fichas { grid-template-columns: 1fr; }
}`;

const hexDe = (rgb) => '#' + (rgb.match(/\d+/g) || []).slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
const PALETA = [
  ['Marrón', '#34190A', 'Fondo: el que da peso'],
  ['Beige', '#E7E2DA', 'Fondo claro y texto sobre oscuro'],
  ['Rosa', '#F5CBD7', 'Acento: lo que tiene que verse'],
  ['Blanco', '#F5F3F1', 'El aire'],
  ['Negro', '#190900', 'El texto'],
];
const VOZ = [
  ['Somos', 'una agencia', 'un equipo', 'pequeño.', 'No somos una agencia que hace campañas y ya está.'],
  ['Trabajamos como', 'proveedores', 'socios', '.', 'No somos proveedores. Trabajamos como socios.'],
  ['Resultados', 'garantizados', 'medidos', '.', 'No prometemos. Medimos.'],
  ['Te damos', 'soluciones integrales', 'un sistema', 'que se repite.', 'Nada de soluciones integrales: un sistema que se mide y se repite.'],
];

export function montar(raiz, { iso, logo, reducido, conRaton, barra }) {
  barra('rgba(25, 9, 0, .62)');
  const estilo = document.createElement('style');
  estilo.textContent = CSS;
  document.head.append(estilo);

  raiz.innerHTML = `
  <section class="pa">
    <div class="pa-portada">
      <div>
        <p class="pa-etq">( Brand · identidad, dirección de arte, webs y contenido )</p>
        <h1 class="pa-t" data-vivo>Tu marca es lo que la gente <em>recuerda</em> de ti.</h1>
        <p class="pa-p">Diseñamos cómo se ve tu empresa: el logotipo, el color, la letra y la forma de hablar. Nada está puesto porque sí: detrás de cada cosa hay una decisión.</p>
        <p class="pa-pista">${conRaton ? 'Pasa el ratón por la pieza: debajo están las decisiones' : 'Toca la pieza: debajo están las decisiones'}</p>
      </div>
      <figure class="pa-pieza" data-pieza>
        <div class="pa-pieza__fondo" data-insp="fondo"></div>
        <div class="pa-pieza__iso" data-insp="iso">${iso}</div>
        <p class="pa-pieza__claim" data-insp="claim">Una buena marca no decora. <em>Coloca.</em></p>
        <p class="pa-pieza__pie" data-insp="pie"><span>adsPartners</span><span>Madrid</span></p>
      </figure>
    </div>
    <div class="pa-capas">
      <h2 class="pa-t2" data-vivo>Branding no es un logo. Es <em>todo</em> lo que cuentas.</h2>
      <p class="pa-p2">El nombre, el color, la letra, cómo hablas y dónde apareces. El branding es que todo eso cuente lo mismo, en todas partes.</p>
      <div class="pa-fichas">
        <article class="pa-ficha"><p class="pa-num">01 · Logotipo</p><div class="pa-ficha__logo" data-insp="logo">${logo}</div></article>
        <article class="pa-ficha"><p class="pa-num">02 · Color</p><ul class="pa-paleta">${PALETA.map(([n, h], i) => `<li data-insp="color" data-i="${i}"><i style="background:${h}"></i>${n} · ${h}</li>`).join('')}</ul></article>
        <article class="pa-ficha"><p class="pa-num">03 · Letra</p><div class="pa-letras">
          <p data-insp="letra" data-i="0"><b style="font-family: var(--serif); font-weight: 300">Aa</b><span>Apple Garamond</span></p>
          <p data-insp="letra" data-i="1"><b style="font-family: var(--sans)">Aa</b><span>Open Sauce</span></p>
          <p data-insp="letra" data-i="2"><b style="font-family: 'Quetine', cursive">Aa</b><span>Quetine</span></p>
        </div></article>
        <article class="pa-ficha" data-insp="voz"><p class="pa-num">04 · Voz</p><p class="pa-voz" data-voz></p><p class="pa-voz__no" data-voz-no></p></article>
      </div>
    </div>
  </section>
  <div class="pa-insp" aria-hidden="true"><svg><path data-marco /><line data-guia /></svg><span class="pa-tag" data-t1></span><span class="pa-tag pa-tag--2" data-t2></span></div>`;

  const pieza = raiz.querySelector('[data-pieza]');
  const marco = raiz.querySelector('[data-marco]'), guia = raiz.querySelector('[data-guia]');
  const t1 = raiz.querySelector('[data-t1]'), t2 = raiz.querySelector('[data-t2]');

  // La voz: una frase de agencia que se tacha y se corrige, cada pocos segundos
  const voz = raiz.querySelector('[data-voz]'), vozNo = raiz.querySelector('[data-voz-no]');
  let iv = 0;
  const ponerVoz = () => {
    const [a, mal, bien, b, no] = VOZ[iv % VOZ.length];
    voz.innerHTML = `${a} <s>${mal}</s> <b>${bien}</b> ${b}`.replace(' .', '.');
    vozNo.textContent = no;
    iv++;
  };
  ponerVoz();
  const relojVoz = setInterval(ponerVoz, 2800);

  // Qué dice el inspector de cada parte: lo medido y la decisión
  const px = (v) => Math.round(parseFloat(v));
  const QUE = {
    fondo: (el, r) => [`Marrón #34190A · ${Math.round(r.width)} × ${Math.round(r.height)} px`, 'El fondo que da peso'],
    margen: (el, r, m) => [`Margen ${m} px · ${Math.round((m / r.width) * 100)} % del ancho`, 'Aire, no relleno'],
    iso: (el, r) => [`Isotipo · ${Math.round(r.width)} × ${Math.round(r.height)} px · rosa #F5CBD7`, 'No se estira: se escala'],
    claim: (el) => { const s = getComputedStyle(el); return [`Apple Garamond ${s.fontWeight} · ${px(s.fontSize)} px · interlineado ${(parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2).replace('.', ',')}`, 'La marca habla en Garamond']; },
    pie: (el) => { const s = getComputedStyle(el); return [`Open Sauce · ${px(s.fontSize)} px · ${hexDe(s.color)}`, 'La interfaz, en Open Sauce']; },
    logo: (el, r) => [`Logotipo · ${Math.round(r.width)} × ${Math.round(r.height)} px · 6,87 : 1`, 'Siempre entero, nunca deformado'],
    color: (el) => { const [n, h, uso] = PALETA[el.dataset.i]; return [`${n} · ${h}`, uso]; },
    letra: (el) => [['Apple Garamond · la marca', 'Open Sauce · la interfaz', 'Quetine · el detalle'][el.dataset.i], ['Titulares', 'Texto y botones', 'Firmas y notas a mano'][el.dataset.i]],
    voz: () => [`Voz · ${VOZ.length} frases de agencia, corregidas`, 'Menos adjetivos. Más hechos.'],
  };

  // A qué apunta: la parte con data-insp; en la pieza, cerca del borde, el margen
  let blanco = null, desdeRaton = 0;
  const apuntar = (x, y) => {
    const el = document.elementFromPoint(x, y)?.closest?.('[data-insp]');
    if (!el || !raiz.contains(el)) { blanco = null; return; }
    let clave = el.dataset.insp, m = 0;
    if (clave === 'fondo') {
      const r = pieza.getBoundingClientRect();
      m = Math.round(r.width * 0.08);
      const dentro = Math.min(x - r.left, r.right - x, y - r.top, r.bottom - y);
      if (dentro < m) clave = 'margen';
    }
    blanco = { el, clave, m };
  };
  const alMover = (e) => { if (e.pointerType === 'mouse') { desdeRaton = performance.now(); apuntar(e.clientX, e.clientY); } };
  const alTocar = (e) => { desdeRaton = performance.now() + 4000; apuntar(e.clientX, e.clientY); };
  addEventListener('pointermove', alMover, { passive: true });
  raiz.addEventListener('pointerdown', alTocar);

  // Quieto, se pasea solo por las partes de la pieza
  const PASEO = ['iso', 'claim', 'pie', 'margen', 'fondo'];
  let paso = 0;
  const pasear = setInterval(() => {
    if (performance.now() - desdeRaton < 2600) return;
    const r = pieza.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { blanco = null; return; }
    const clave = PASEO[paso++ % PASEO.length];
    const el = clave === 'margen' || clave === 'fondo' ? pieza.querySelector('[data-insp="fondo"]') : pieza.querySelector(`[data-insp="${clave}"]`);
    blanco = { el, clave, m: Math.round(r.width * 0.08) };
  }, 2000);

  // Cada fotograma: el marco va hacia la parte (con inercia) y las etiquetas lo siguen
  const caja = { x: 0, y: 0, w: 0, h: 0, a: 0 };
  let antes = performance.now(), raf = 0, clavePuesta = null;
  const vuelta = (ahora) => {
    raf = requestAnimationFrame(vuelta);
    const dt = Math.min(0.05, (ahora - antes) / 1000);
    antes = ahora;
    const k = reducido ? 1 : 1 - Math.exp(-dt * 14);
    let r = null;
    if (blanco) {
      r = blanco.el.getBoundingClientRect();
      if (blanco.clave === 'margen') r = { left: r.left, top: r.top, width: blanco.m, height: r.height, right: r.left + blanco.m, bottom: r.bottom };
      caja.x += (r.left - caja.x) * (caja.a ? k : 1); caja.y += (r.top - caja.y) * (caja.a ? k : 1);
      caja.w += (r.width - caja.w) * (caja.a ? k : 1); caja.h += (r.height - caja.h) * (caja.a ? k : 1);
      caja.a = 1;
      const clave = blanco.clave + (blanco.el.dataset.i ?? '');
      if (clave !== clavePuesta) {
        clavePuesta = clave;
        const [a, b] = QUE[blanco.clave](blanco.el, blanco.el.getBoundingClientRect(), blanco.m);
        t1.textContent = a; t2.textContent = b;
      }
    } else { caja.a = 0; clavePuesta = null; }
    t1.classList.toggle('on', !!blanco); t2.classList.toggle('on', !!blanco);
    if (!blanco) { marco.setAttribute('d', ''); guia.setAttribute('x1', 0); guia.setAttribute('x2', 0); return; }
    // el marco con sus esquinas marcadas (y, en el margen, la cota)
    const { x, y, w, h } = caja, e = 7;
    const oscuro = ['fondo', 'margen', 'iso', 'claim', 'pie'].includes(blanco.clave);
    marco.classList.toggle('sobre-oscuro', oscuro); guia.classList.toggle('sobre-oscuro', false);
    marco.setAttribute('d', blanco.clave === 'margen'
      ? `M${x} ${y + h / 2}H${x + w}M${x} ${y + h / 2 - e}V${y + h / 2 + e}M${x + w} ${y + h / 2 - e}V${y + h / 2 + e}`
      : `M${x} ${y}H${x + w}V${y + h}H${x}Z M${x - e} ${y}H${x + e}M${x} ${y - e}V${y + e} M${x + w - e} ${y + h}H${x + w + e}M${x + w} ${y + h - e}V${y + h + e}`);
    // las etiquetas, a la derecha del marco si caben; si no, a la izquierda
    const ancho = Math.max(t1.offsetWidth, t2.offsetWidth), aLaDerecha = x + w + 40 + ancho < innerWidth - 16;
    const tx = aLaDerecha ? x + w + 40 : Math.max(12, x - 40 - ancho), ty = Math.max(70, Math.min(innerHeight - 90, y + Math.min(h, 120) / 2 - 20));
    t1.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    t2.style.transform = `translate3d(${tx}px, ${ty + 22}px, 0)`;
    guia.setAttribute('x1', aLaDerecha ? x + w : x); guia.setAttribute('y1', ty + 9);
    guia.setAttribute('x2', aLaDerecha ? tx : tx + ancho); guia.setAttribute('y2', ty + 9);
  };
  raf = requestAnimationFrame(vuelta);

  return () => {
    cancelAnimationFrame(raf); clearInterval(pasear); clearInterval(relojVoz);
    removeEventListener('pointermove', alMover);
    estilo.remove();
  };
}
