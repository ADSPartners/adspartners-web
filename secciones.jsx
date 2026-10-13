/* global React, useT */
// ============= SECCIONES DE LA HOME =============
// Portada, testimonios, preguntas y cierre, y las piezas que comparten todos los bloques (cabecera, titular
// que se rellena). Los textos viven en secciones-data.jsx (window.SECCIONES); aquí solo se pintan y se mueven.
// Las tres ramas van en ramas.jsx y la lista de trabajos, en proyectos.jsx.
//
// Regla de movimiento: una sola cosa moviéndose por pantalla. Solo se mueve sola la palabra de la portada
// (y el cielo de las ramas, al fondo); lo demás responde al scroll, al ratón o a un clic.
const { useState, useEffect, useRef } = React;

// En el prerender del build (jsdom) y con «reducir movimiento» las piezas se pintan en su estado final.
const SEC_BOT = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
const secQuieto = () => SEC_BOT || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const secLimita = (v, a, b) => Math.max(a, Math.min(b, v));
// Lleva a una altura de la página (con el scroll suave si está cargado).
const secIr = (y) => { if (window.adsIr) window.adsIr(y); else window.scrollTo({ top: y, behavior: 'smooth' }); };
const secIrA = (id) => { const el = document.getElementById(id); if (el) secIr(el.getBoundingClientRect().top + window.scrollY); };

function useSec() {
  const { lang } = useT();
  const S = window.SECCIONES || {};
  return S[lang] || S.es || {};
}

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

// ---------- Portada ----------
// Palabra que rota: entra por abajo y sale por arriba. Es lo único de la home que se mueve solo.
function Rota({ palabras }) {
  const n = palabras.length;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (secQuieto()) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % n), 3200);
    return () => clearInterval(id);
  }, [n]);
  return (
    <span className="rota">
      {palabras.map((p, k) => (
        <span className={'rota__p' + (k === i ? ' is-on' : (k === (i + n - 1) % n ? ' is-sale' : ''))} key={k} aria-hidden={k !== i}>{p}</span>
      ))}
    </span>
  );
}

function Portada() {
  const d = useSec().portada;
  const intro = useRef(null);
  // El contenido se hunde y se apaga un poco al bajar, mientras el logotipo aguanta.
  useAlBajar(() => {
    const el = intro.current;
    if (!el || secQuieto()) return;
    const y = window.scrollY;
    el.style.transform = `translate3d(0, calc(var(--hero-sube, -7vh) + ${Math.min(y * 0.3, 280).toFixed(1)}px), 0)`;
    el.style.opacity = String(secLimita(1 - y / 640, 0, 1));
  });
  return (
    <header className="hero" id="top" data-screen-label="Hero" data-nav-theme="dark" data-nav-bar-theme="light" style={{ padding: "140px 65px 15vw" }}>
      <div className="hero-grain"></div>
      <div className="hero-intro" ref={intro}>
        <h1 className="hero-titulo"><span className="hero-titulo__fijo">{d.fijo}</span> <Rota palabras={d.rota} /></h1>
        <p className="hero-tagline">{d.sub}</p>
      </div>
      <div className="hero-foot">
        <p className="hero-tagline-sub">{d.pie}</p>
        <p className="hero-ramas">{d.ramas}</p>
      </div>
      <img className="hero-wordmark" src="assets/logos/logotipo_beige.svg" alt="adsPartners" aria-hidden="true" data-parallax="0.05" />
    </header>
  );
}

// ---------- Testimonios ----------
function Testimonios() {
  const d = useSec().testimonios;
  return (
    <section className="testi panel" id="testimonios" data-screen-label="Testimonios" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="testi-rejilla">
        {d.lista.map((x, i) => (
          <figure className={'cita reveal reveal-delay-' + (i + 1)} key={i}>
            <blockquote>«{x.q}»</blockquote>
            <figcaption><strong>{x.quien}</strong>{x.cargo}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ---------- Preguntas ----------
// Un chat: se pulsa una pregunta y la respuesta llega como un mensaje, con sus puntos de «escribiendo».
function Preguntas() {
  const d = useSec().preguntas;
  const [abierta, setAbierta] = useState(0);
  const [escribe, setEscribe] = useState(false);
  const [hora, setHora] = useState('');
  useEffect(() => {
    const tic = () => setHora(new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    tic();
    const id = setInterval(tic, 30000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!escribe) return undefined;
    const id = setTimeout(() => setEscribe(false), 800);
    return () => clearTimeout(id);
  }, [escribe, abierta]);
  const abrir = (i) => {
    if (i === abierta) { setAbierta(-1); return; }
    setAbierta(i);
    if (!secQuieto()) setEscribe(true);
  };
  return (
    <section className="preguntas panel" id="preguntas" data-screen-label="Preguntas" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="chat reveal">
        <div className="chat__cab">
          <span className="chat__avatar" aria-hidden="true"></span>
          <b>{d.chat}</b>
          <span className="chat__linea"><i aria-hidden="true"></i>{d.enLinea}</span>
          <span className="chat__hora">{d.hoy} {hora}</span>
        </div>
        <div className="chat__hilo">
          {d.lista.map((x, i) => (
            <div className={'chat__item' + (i === abierta ? ' is-on' : '') + (i === abierta && escribe ? ' is-escribiendo' : '')} key={i}>
              <button type="button" className="chat__p" aria-expanded={i === abierta} onClick={() => abrir(i)} data-cursor="cta">
                <i aria-hidden="true"></i><span>{x.p}</span>
              </button>
              <div className="chat__r">
                <div>
                  <div className="chat__burbuja">
                    <span className="chat__puntos" aria-hidden="true"><i></i><i></i><i></i></span>
                    <p>{x.r}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Cierre ----------
// Las dos mitades de la frase llegan de los lados y se juntan al bajar.
function Cierre() {
  const d = useSec().cierre;
  const sec = useRef(null);
  const izq = useRef(null);
  const der = useRef(null);
  useAlBajar(() => {
    const s = sec.current;
    if (!s || secQuieto()) return;
    const r = s.getBoundingClientRect();
    const vh = window.innerHeight;
    // De 0 a 1 desde que el bloque asoma hasta poco después de quedarse fijo.
    const p = secLimita((vh * 0.85 - r.top) / (vh * 0.85 + (s.offsetHeight - vh) * 0.55), 0, 1);
    const off = ((1 - p) * 58).toFixed(2);
    const op = Math.min(1, 0.12 + p * 1.5).toFixed(3);
    if (izq.current) { izq.current.style.transform = `translate3d(${-off}vw,0,0)`; izq.current.style.opacity = op; }
    if (der.current) { der.current.style.transform = `translate3d(${off}vw,0,0)`; der.current.style.opacity = op; }
  });
  const aQuedamos = () => {
    window.dispatchEvent(new Event('open-quedamos'));
    secIrA('quedamos');
  };
  const mitad = (x) => x.map((w, i) => <React.Fragment key={i}>{i ? <br /> : null}{w}</React.Fragment>);
  return (
    <>
      <section className="cierre panel" id="cierre" ref={sec} data-screen-label="Cierre" data-nav-theme="dark">
        <div className="cierre__pin">
          <p className="cierre__frase">
            <span className="cierre__mitad cierre__mitad--i" ref={izq}>{mitad(d.izq)}</span>{' '}
            <span className="cierre__mitad cierre__mitad--d" ref={der}>{mitad(d.der)}</span>
          </p>
        </div>
      </section>
      <section className="cierre-pie" data-nav-theme="dark">
        <p className="sec-etq reveal">{d.etq}</p>
        <p className="cierre-pie__texto reveal reveal-delay-1">{secTexto(d.texto)}</p>
        <button type="button" className="qd-prompt__btn cierre-pie__btn reveal reveal-delay-2" onClick={aQuedamos} data-cursor="cta">[{d.btn}]</button>
      </section>
    </>
  );
}

Object.assign(window, {
  Portada, Testimonios, Preguntas, Cierre,
  Cabecera, Relleno, secTexto, secIr, secIrA, useSec, secQuieto,
});
