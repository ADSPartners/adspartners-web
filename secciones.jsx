/* global React, useT */
// ============= PIEZAS COMUNES DE LAS PÁGINAS DE RAMA =============
// La cabecera de bloque y el titular que se rellena al bajar, que usan /finance/, /tech/ y /brand/ (ramas.jsx).
// La home ya no las usa: desde el 27-oct-2026 es inicio.jsx.
const { useState, useEffect, useRef } = React;

// En el prerender del build (jsdom) y con «reducir movimiento» las piezas se pintan en su estado final.
const SEC_BOT = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
const secQuieto = () => SEC_BOT || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const secLimita = (v, a, b) => Math.max(a, Math.min(b, v));
// Lleva a una altura de la página (con el scroll suave si está cargado).
const secIr = (y) => { if (window.adsIr) window.adsIr(y); else window.scrollTo({ top: y, behavior: 'smooth' }); };
const secIrA = (id) => { const el = document.getElementById(id); if (el) secIr(el.getBoundingClientRect().top + window.scrollY); };

// «Texto {en cursiva}» → nodos
function secTexto(s) {
  return String(s).split(/(\{[^}]*\})/).filter(Boolean).map((x, i) =>
    x[0] === '{' ? <em key={i}>{x.slice(1, -1)}</em> : <React.Fragment key={i}>{x}</React.Fragment>);
}

// Llama a `pintar` en cada cambio de scroll o de tamaño, como mucho una vez por fotograma.
function useAlBajar(pintar, deps) {
  useEffect(() => {
    let raf = 0;
    const tic = () => { raf = 0; pintar(); };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(tic); };
    pintar();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => {
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, deps || []);
}

// Titular que se rellena al bajar: cada palabra pasa de desenfocada y tenue a nítida.
function Relleno({ texto, como, className, ventana }) {
  const ref = useRef(null);
  const Tag = como || 'h2';
  useAlBajar(() => {
    const el = ref.current;
    if (!el) return;
    const ps = el.querySelectorAll('.rell__p');
    if (secQuieto()) { ps.forEach((p) => p.classList.add('is-on')); return; }
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const n = Math.round(secLimita((vh * 0.94 - r.top) / (vh * (ventana || 0.5)), 0, 1) * ps.length);
    if (el.__n === n) return;
    el.__n = n;
    ps.forEach((p, i) => p.classList.toggle('is-on', i < n));
  }, [texto]);
  const palabras = (t) => t.split(/(\s+)/).map((w, i) =>
    (!w || /^\s+$/.test(w)) ? w : <span className={'rell__p' + (SEC_BOT ? ' is-on' : '')} key={i}>{w}</span>);
  return (
    <Tag className={'rell ' + (className || '')} ref={ref}>
      {String(texto).split(/(\{[^}]*\})/).filter(Boolean).map((t, i) =>
        t[0] === '{' ? <em key={i}>{palabras(t.slice(1, -1))}</em> : <React.Fragment key={i}>{palabras(t)}</React.Fragment>)}
    </Tag>
  );
}

// Cabecera de bloque: etiqueta, título que se rellena y, si lo hay, un apunte al lado.
function Cabecera({ etq, titulo, lado }) {
  return (
    <header className={'sec-cab' + (lado ? ' sec-cab--lado' : '')}>
      <p className="sec-etq reveal">{etq}</p>
      <Relleno texto={titulo} className="sec-titulo" />
      {lado ? <p className="sec-lado reveal reveal-delay-2">{lado}</p> : null}
    </header>
  );
}

Object.assign(window, { Cabecera, Relleno, secTexto, secIr, secIrA, secQuieto });
