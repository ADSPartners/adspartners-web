// Brand por fuera, tech por dentro: los tres tiempos de cada rotura y el barrido de la mesa entera. Cada pieza tiene dos
// capas, lo que se ve (la marca) y, debajo, el código que la pinta (lo tech). Una línea de escáner rosa pasa de una a
// otra, como en el banner de LinkedIn: por detrás de la línea queda el código. Ahí entra la regla como comentario, lo
// roto se marca, se borra letra a letra y se escribe lo bueno; la línea vuelve y la pieza se recompone detrás de ella.
// Si lo roto es de toda la marca (un color, la letra), en vez de volver, una línea cruza la mesa entera.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';
import { lineaHTML } from './codigo.js';

const limitar = (v) => Math.min(1, Math.max(0, v));

export function crearDentro(pz, { reducido }) {
  const marco = pz.querySelector('.pz__marco');
  const cara = pz.querySelector('.pz__cara');
  const capa = pz.querySelector('.pz__codigo');
  const cod = pz.querySelector('[data-cod]');
  const linea = pz.querySelector('.pz__linea');
  let lineas = [...cod.children].map((l) => l.textContent);
  let tl = null, terminar = null;

  // p: dónde va la línea (de 0 a 1, de izquierda a derecha). izq: el código queda a su izquierda (al abrir y al
  // volver); si no, a su derecha (cuando lo barre la línea de la mesa)
  function poner(p, izq = true) {
    p = limitar(p);
    const solo = izq ? p === 0 : p === 1;
    api.abierto = !solo;
    if (solo) {
      capa.style.clipPath = cara.style.clipPath = '';
      linea.style.opacity = '0';
      return;
    }
    const w = marco.offsetWidth;
    capa.style.clipPath = izq ? `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)` : `inset(0 0 0 ${(p * 100).toFixed(2)}%)`;
    // La cara se recorta con margen de sobra, para que lo que se sale del marco (el logo estirado) también se tape; con
    // el código entero, no se ve nada de ella
    const tapada = izq ? p === 1 : p === 0;
    cara.style.clipPath = tapada ? 'inset(50% 50% 50% 50%)'
      : izq ? `inset(-100vh -100vw -100vh ${(p * w).toFixed(1)}px)` : `inset(-100vh ${((1 - p) * w).toFixed(1)}px -100vh -100vw)`;
    linea.style.transform = `translateX(${(p * w).toFixed(1)}px)`;
    linea.style.opacity = p > 0 && p < 1 ? '1' : '0';
  }

  function pintar(nuevas) {
    lineas = nuevas.slice();
    cod.innerHTML = lineas.map((l) => lineaHTML(l)).join('');
  }
  const pintarLinea = (n, texto, marca, cursor) => {
    lineas[n] = texto;
    if (cod.children[n]) cod.children[n].outerHTML = lineaHTML(texto, marca, cursor);
  };

  // Escribe «texto» en la línea n, entre «antes» y «despues», con el cursor detrás
  function teclear(t, n, antes, texto, despues, porLetra) {
    const o = { k: 0 };
    let ultimo = -1;
    t.to(o, {
      k: texto.length, duration: reducido ? 0 : texto.length * porLetra, ease: 'none',
      onUpdate() {
        const k = Math.round(o.k);
        if (k === ultimo) return;
        ultimo = k;
        const fin = antes.length + k;
        pintarLinea(n, antes + texto.slice(0, k) + despues, [fin, fin], true);
        if (k % 3 === 0) sonido.tecla(0.35);
      },
    });
  }

  // Los tres tiempos. op: { lineas, comentario: { en, texto }, cambios: [{ l, i, j, por }], volver, alVolver }
  // Devuelve una promesa: true si ha acabado, false si se ha cortado (otra rotura a mitad)
  function porDentro(op) {
    cancelar();
    pintar(op.lineas);
    const st = { p: 0 };
    return new Promise((ok) => {
      terminar = ok;
      const t = tl = gsap.timeline({ onComplete() { tl = null; terminar = null; ok(true); } });
      t.call(() => sonido.tic(0.6));
      t.to(st, { p: 1, duration: reducido ? 0 : 0.55, ease: 'power2.inOut', onUpdate: () => poner(st.p, true) });
      let cambios = op.cambios.map((c) => ({ ...c }));
      // La regla, como comentario: una línea nueva que se escribe encima de lo roto
      if (op.comentario) {
        const { en, texto } = op.comentario;
        cambios = cambios.map((c) => (c.l >= en ? { ...c, l: c.l + 1 } : c));
        t.call(() => { lineas.splice(en, 0, ''); pintar(lineas); });
        const sangria = (op.lineas[en] || '').match(/^\s*/)[0];
        teclear(t, en, sangria, texto, '', 0.017);
        t.call(() => pintarLinea(en, sangria + texto));
        t.to({}, { duration: 0.25 });
      }
      // Cada cambio: se marca lo roto, se borra letra a letra y se escribe lo bueno (si hay varios en una línea, lo
      // de la derecha se mueve lo que haya crecido lo de la izquierda)
      // Con varios cambios, cada uno va más deprisa (que el arreglo entero no se haga largo)
      const prisa = cambios.length > 2 ? 0.6 : cambios.length > 1 ? 0.8 : 1;
      const desfase = {};
      cambios.sort((a, b) => a.l - b.l || a.i - b.i).forEach((c) => {
        const d = desfase[c.l] || 0;
        const i = c.i + d, j = c.j + d;
        let antes, malo, despues;
        t.call(() => {
          const s = lineas[c.l];
          antes = s.slice(0, i); malo = s.slice(i, j); despues = s.slice(j);
          pintarLinea(c.l, s, [i, j], false);
        });
        t.to({}, { duration: 0.3 * prisa });
        const o = { k: j - i };
        let ultimo = -1;
        t.to(o, {
          k: 0, duration: reducido ? 0 : (j - i) * 0.022 * prisa, ease: 'none',
          onUpdate() {
            const k = Math.round(o.k);
            if (k === ultimo) return;
            ultimo = k;
            pintarLinea(c.l, antes + malo.slice(0, k) + despues, [i, i + k], true);
          },
        });
        // Lo bueno (se escribe más despacio que se borra)
        const escribe = { k: 0 };
        let ult = -1;
        t.to(escribe, {
          k: c.por.length, duration: reducido ? 0 : c.por.length * 0.045 * prisa, ease: 'none',
          onUpdate() {
            const k = Math.round(escribe.k);
            if (k === ult) return;
            ult = k;
            pintarLinea(c.l, antes + c.por.slice(0, k) + despues, [i, i + k], true);
            if (k % 2 === 0) sonido.tecla(0.4);
          },
        });
        t.to({}, { duration: 0.16 * prisa });
        t.call(() => pintarLinea(c.l, antes + c.por + despues));
        desfase[c.l] = d + c.por.length - (j - i);
      });
      t.to({}, { duration: 0.3 });
      if (op.volver !== false) {
        t.call(() => { op.alVolver?.(); sonido.ok(); });
        t.to(st, { p: 0, duration: reducido ? 0 : 0.7, ease: 'power2.inOut', onUpdate: () => poner(st.p, true) });
      }
    });
  }

  // Si llega otra rotura a mitad, lo de antes se corta de golpe: la pieza vuelve a verse entera
  function cancelar() {
    if (!tl) return;
    tl.kill();
    tl = null;
    poner(0, true);
    const fin = terminar;
    terminar = null;
    fin?.(false);
  }

  const api = { poner, pintar, porDentro, cancelar, abierto: false, pz, ocupado: () => !!tl };
  return api;
}

// La línea que cruza la mesa entera: en escritorio, de izquierda a derecha; en el móvil, de arriba abajo por la pantalla.
// objetivos: [{ el, dentro?, revela?, alPasar? }]. Las piezas con el código abierto se cierran a su paso (el código
// queda por delante de la línea); las que «revela» aparecen; y a cada una se le llama alPasar cuando la línea va por
// un tercio. velo: un color de fondo que se va quedando detrás (el beige roto).
export function barridoMesa(mesa, { objetivos, eje = 'x', velo = null, duracion = 1, reducido }) {
  const raya = document.createElement('i');
  raya.className = `mesa__barrido mesa__barrido--${eje}`;
  raya.setAttribute('aria-hidden', 'true');
  mesa.appendChild(raya);
  let capaVelo = null;
  if (velo) {
    capaVelo = document.createElement('i');
    capaVelo.className = 'mesa__velo';
    capaVelo.style.background = velo;
    mesa.prepend(capaVelo);
  }
  const caja = mesa.getBoundingClientRect();
  const largo = eje === 'x' ? caja.width : innerHeight;
  const datos = objetivos.map((o) => {
    const r = o.el.getBoundingClientRect();
    // En el móvil, lo que está por encima de la pantalla ya ha pasado y lo de debajo pasa al final
    const a = eje === 'x' ? r.left - caja.left : Math.max(0, Math.min(largo, r.top));
    const tam = eje === 'x' ? r.width : Math.max(1, Math.min(largo, r.bottom) - a);
    return { ...o, a, tam, pasado: false };
  });
  const st = { x: 0 };
  return new Promise((ok) => {
    const paso = () => {
      const x = st.x * largo;
      if (eje === 'x') raya.style.transform = `translateX(${x.toFixed(1)}px)`;
      else raya.style.transform = `translateY(${x.toFixed(1)}px)`;
      // El velo está en la mesa: en el móvil, la línea (en la pantalla) se pasa a la mesa
      if (capaVelo) capaVelo.style.clipPath = eje === 'x' ? `inset(0 0 0 ${x.toFixed(1)}px)` : `inset(${Math.max(0, x - caja.top).toFixed(1)}px 0 0 0)`;
      datos.forEach((d) => {
        const p = limitar((x - d.a) / d.tam);
        if (d.dentro?.abierto) d.dentro.poner(eje === 'x' ? p : (p >= 1 ? 1 : 0), false);
        if (d.revela) d.el.style.clipPath = p >= 1 ? '' : (eje === 'x' ? `inset(-20px ${((1 - p) * 100).toFixed(2)}% -20px -20px)` : (p > 0 ? '' : 'inset(0 0 100% 0)'));
        if (!d.pasado && p >= 0.34) { d.pasado = true; d.alPasar?.(d.el); }
      });
    };
    gsap.to(st, {
      x: 1, duration: reducido ? 0 : duracion, ease: 'power1.inOut', onUpdate: paso,
      onComplete() {
        st.x = 1.0001;
        paso();
        datos.forEach((d) => { if (!d.pasado) { d.pasado = true; d.alPasar?.(d.el); } if (d.revela) d.el.style.clipPath = ''; });
        raya.remove();
        capaVelo?.remove();
        ok();
      },
    });
  });
}
