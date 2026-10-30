// Menú, versión «workflow»: un lienzo de nodos con cables, como un flujo de n8n. El primero es «Tú · Madrid · hora»;
// de él sale un cable a cada página y de cada página otro a Hablemos. Al pasar por un nodo, sus cables se encienden
// y abajo se ve lo que entra y lo que sale (los datos de verdad de la página). Al pinchar, un pulso recorre el cable,
// el nodo queda «ejecutado» y se entra. Los nodos se pueden arrastrar y los cables los siguen.
// En el móvil van en columna y los cables hacen arcos por los lados (de Tú, por la izquierda; a Hablemos, por la
// derecha).
import { gsap } from 'gsap';

const NS = 'http://www.w3.org/2000/svg';
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
// Un objeto como JSON, con las claves en rosa y los números en azul
const json = (o) => `{\n${Object.entries(o).map(([k, v]) => `  <span class="k">"${esc(k)}"</span>: ${typeof v === 'number' ? `<span class="n">${v}</span>` : `"${esc(v)}"`}`).join(',\n')}\n}`;

export function crear(raiz, { datos, reducido, sonido, ir }) {
  const svg = raiz.querySelector('[data-mw-cables]');
  const panel = raiz.querySelector('[data-mw-panel]');
  const hora = raiz.querySelector('[data-mw-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const darHora = () => { hora.textContent = reloj.format(new Date()); };
  darHora();
  setInterval(darHora, 15000);

  const nodos = Object.fromEntries([...raiz.querySelectorAll('[data-mw-nodo]')].map((el) => [el.dataset.mwNodo, {
    el, slug: el.dataset.mwNodo, p: datos.find((d) => d.slug === el.dataset.mwNodo), x: 0, y: 0, dx: 0, dy: 0,
  }]));
  const paginas = datos.filter((d) => d.slug !== 'hablemos').map((d) => nodos[d.slug]);
  const hablemos = nodos.hablemos;
  const cables = [
    ...paginas.map((n) => ({ de: nodos.tu, a: n })),
    ...paginas.map((n) => ({ de: n, a: hablemos })),
  ];
  cables.forEach((c) => {
    c.el = document.createElementNS(NS, 'path');
    c.el.setAttribute('class', 'mw__cable');
    svg.append(c.el);
  });

  // --- Dónde va cada nodo -------------------------------------------------------------------------------------------
  let columna = false;
  function colocar() {
    const W = raiz.clientWidth, H = raiz.clientHeight;
    columna = W < 760;
    if (columna) {
      const paso = 112;
      nodos.tu.x = W / 2; nodos.tu.y = 150;
      paginas.forEach((n, k) => { n.x = W / 2; n.y = 150 + paso * (k + 1); });
      hablemos.x = W / 2; hablemos.y = 150 + paso * (paginas.length + 1);
    } else {
      // Entre la cabecera y el panel de abajo
      const arriba = 130, abajo = H - 250, medio = (arriba + abajo) / 2;
      const paso = Math.min(140, (abajo - arriba) / paginas.length);
      nodos.tu.x = W * 0.15; nodos.tu.y = medio;
      paginas.forEach((n, k) => { n.x = W * 0.48; n.y = medio + (k - (paginas.length - 1) / 2) * paso; });
      hablemos.x = W * 0.81; hablemos.y = medio;
    }
    Object.values(nodos).forEach(pintarNodo);
    cables.forEach(pintarCable);
  }
  // Con left/top (el transform queda libre para la entrada y la sacudida)
  function pintarNodo(n) {
    n.w = n.el.offsetWidth; n.h = n.el.offsetHeight;
    n.el.style.left = `${(n.x + n.dx - n.w / 2).toFixed(1)}px`;
    n.el.style.top = `${(n.y + n.dy - n.h / 2).toFixed(1)}px`;
  }
  // Un cable: de la salida de un nodo a la entrada del otro (en columna, en arco por un lado)
  function pintarCable(c) {
    const a = c.de, b = c.a;
    const ax = a.x + a.dx, ay = a.y + a.dy, bx = b.x + b.dx, by = b.y + b.dy;
    let d;
    if (columna) {
      const izq = a === nodos.tu, lado = izq ? -1 : 1;
      const x1 = ax + lado * a.w / 2, x2 = bx + lado * b.w / 2, curva = 46 + Math.abs(by - ay) * 0.12;
      d = `M${x1},${ay} C${x1 + lado * curva},${ay} ${x2 + lado * curva},${by} ${x2},${by}`;
    } else {
      const x1 = ax + a.w / 2, x2 = bx - b.w / 2, k = Math.max(50, (x2 - x1) * 0.5);
      d = `M${x1},${ay} C${x1 + k},${ay} ${x2 - k},${by} ${x2},${by}`;
    }
    c.el.setAttribute('d', d);
  }
  const ro = new ResizeObserver(colocar);
  ro.observe(raiz);

  // --- Pasar por un nodo: sus cables se encienden y abajo, lo que entra y lo que sale ------------------------------------
  const panelT = panel.querySelector('[data-mw-panel-t]');
  const panelOk = panel.querySelector('[data-mw-panel-ok]');
  const entra = panel.querySelector('[data-mw-entra]');
  const sale = panel.querySelector('[data-mw-sale]');
  const valor = (v) => (/^\d+$/.test(v) ? Number(v) : v);
  function enfocar(n) {
    cables.forEach((c) => c.el.classList.toggle('on', !!n && (c.a === n || c.de === n)));
    Object.values(nodos).forEach((m) => m.el.classList.toggle('on', m === n));
    if (!n || n === nodos.tu) { panel.classList.remove('on'); return; }
    panelT.textContent = `${n.p.nombre} · ${n === hablemos ? 'contacto' : n.p.ruta ? 'página' : 'en obras'}`;
    panelOk.textContent = n.p.ruta ? '✓ 1 item' : '— sin salida todavía';
    entra.innerHTML = n === hablemos
      ? json({ 'quién': 'tú', 'viene de': paginas.map((m) => m.p.nombre).join(', ') })
      : json({ 'quién': 'tú', desde: 'Madrid', hora: hora.textContent });
    sale.innerHTML = json({ ruta: n.p.ruta ? `/${n.p.ruta}`.replace('/#', '#') : `/${n.slug}/`, ...Object.fromEntries(n.p.datos.map(([k, v]) => [k, valor(v)])) });
    panel.classList.add('on');
  }
  Object.values(nodos).forEach((n, i) => {
    n.el.addEventListener('pointerenter', () => { if (!arrastre) { enfocar(n); sonido.tic(0.5 + (i % 3) * 0.1); } });
    n.el.addEventListener('focus', () => enfocar(n));
  });

  // --- Arrastrar un nodo (si apenas se mueve, es un clic) ------------------------------------------------------------
  let arrastre = null, arrastrado = false;
  Object.values(nodos).forEach((n) => {
    n.el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      arrastre = { n, x: e.clientX, y: e.clientY, dx: n.dx, dy: n.dy, id: e.pointerId, movido: false };
      arrastrado = false;
    });
  });
  addEventListener('pointermove', (e) => {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    const mx = e.clientX - arrastre.x, my = e.clientY - arrastre.y;
    if (!arrastre.movido && Math.hypot(mx, my) < 5) return;
    if (!arrastre.movido) { arrastre.movido = true; arrastre.n.el.classList.add('arrastrando'); }
    arrastre.n.dx = arrastre.dx + mx; arrastre.n.dy = arrastre.dy + my;
    pintarNodo(arrastre.n);
    cables.forEach((c) => { if (c.de === arrastre.n || c.a === arrastre.n) pintarCable(c); });
  });
  addEventListener('pointerup', () => {
    if (!arrastre) return;
    arrastrado = arrastre.movido;
    arrastre.n.el.classList.remove('arrastrando');
    arrastre = null;
  });

  // --- Pinchar: el pulso recorre el cable, el nodo queda ejecutado y se entra --------------------------------------------
  function pulso(camino, dur) {
    return new Promise((fin) => {
      const largo = camino.getTotalLength();
      const punto = document.createElementNS(NS, 'circle');
      punto.setAttribute('r', '4.5');
      punto.setAttribute('class', 'mw__pulso');
      svg.append(punto);
      const o = { t: 0 };
      gsap.to(o, {
        t: 1, duration: reducido ? 0 : dur, ease: 'power1.inOut',
        onUpdate: () => { const q = camino.getPointAtLength(o.t * largo); punto.setAttribute('cx', q.x); punto.setAttribute('cy', q.y); },
        onComplete: () => { punto.remove(); fin(); },
      });
    });
  }
  async function lanzar(n) {
    if (n === nodos.tu) return;
    if (!n.p.ruta) {
      enfocar(n);
      if (!reducido) gsap.fromTo(n.el, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
      return;
    }
    enfocar(n);
    sonido.viaje(0.9, 1);
    if (n === hablemos) {
      // A Hablemos se llega pasando por las páginas: un pulso por cada camino, a la vez
      await Promise.all(paginas.map(async (m) => {
        await pulso(cables.find((c) => c.de === nodos.tu && c.a === m).el, 0.45);
        await pulso(cables.find((c) => c.de === m && c.a === hablemos).el, 0.45);
      }));
    } else {
      await pulso(cables.find((c) => c.de === nodos.tu && c.a === n).el, 0.6);
    }
    n.el.classList.add('hecho');
    sonido.tic(1);
    setTimeout(() => { ir(n.p); n.el.classList.remove('hecho'); }, reducido ? 0 : 380);
  }
  Object.values(nodos).forEach((n) => n.el.addEventListener('click', (e) => {
    e.preventDefault();
    if (arrastrado) { arrastrado = false; return; }
    lanzar(n);
  }));

  return {
    abrir() {
      colocar();
      enfocar(null);
      if (reducido) return;
      const lista = [nodos.tu, ...paginas, hablemos];
      gsap.fromTo(lista.map((n) => n.el), { opacity: 0, scale: 0.85 }, {
        opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.08, delay: 0.1, clearProps: 'opacity,scale',
        onStart: () => sonido.tic(0.6),
      });
      cables.forEach((c, k) => {
        const largo = c.el.getTotalLength();
        gsap.fromTo(c.el, { strokeDasharray: largo, strokeDashoffset: largo }, {
          strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.35 + k * 0.06, clearProps: 'strokeDasharray,strokeDashoffset',
        });
      });
    },
    cerrar() { enfocar(null); },
  };
}
