/* global React, useT */
// ============= SECCIONES DE LA HOME =============
// Portada, cinta, las seis tarjetas, las tres ramas, el método, testimonios, preguntas y cierre.
// Los textos viven en secciones-data.jsx (window.SECCIONES); aquí solo se pintan y se mueven.
// La lista de trabajos va aparte, en proyectos.jsx.
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

// true mientras el elemento está a la vista: arranca y para las piezas que se mueven solas.
function useEnVista(ref, umbral) {
  const [dentro, setDentro] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setDentro(true); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((e) => setDentro(e.isIntersecting)), { threshold: umbral || 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return dentro;
}

// true desde la primera vez que se ve (para lo que se anima una sola vez).
function useVisto(ref, umbral) {
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setVisto(true); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { setVisto(true); io.disconnect(); }
    }), { threshold: umbral || 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return visto;
}

// Paso que avanza solo mientras la pieza se ve (y se queda en el último si no hay movimiento).
function usePaso(ref, n, ms) {
  const dentro = useEnVista(ref, 0.4);
  const [paso, setPaso] = useState(secQuieto() ? n - 1 : 0);
  useEffect(() => {
    if (!dentro || secQuieto()) return undefined;
    const id = setInterval(() => setPaso((p) => (p + 1) % n), ms);
    return () => clearInterval(id);
  }, [dentro, n, ms]);
  return paso;
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

// Número que cuenta hasta su valor cuando `on` pasa a true.
function Cuenta({ hasta, on, sufijo, dur }) {
  const [v, setV] = useState(secQuieto() ? hasta : 0);
  useEffect(() => {
    if (!on) return undefined;
    if (secQuieto()) { setV(hasta); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const D = dur || 1200;
    const paso = (now) => {
      const k = secLimita((now - t0) / D, 0, 1);
      setV(Math.round(hasta * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [on, hasta]);
  return <>{String(v).replace('-', '−')}{sufijo || ''}</>;
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
      <p className="sec-etq reveal"><i aria-hidden="true"></i>{etq}</p>
      <Relleno texto={titulo} className="sec-titulo" />
      {lado ? <p className="sec-lado reveal reveal-delay-2">{lado}</p> : null}
    </header>
  );
}

// ---------- Portada ----------
// Palabra que rota: entra por abajo y sale por arriba.
function Rota({ palabras }) {
  const n = palabras.length;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (secQuieto()) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % n), 2600);
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

// Frase que se escribe sola, letra a letra.
function Teclea({ texto, espera }) {
  const [n, setN] = useState(secQuieto() ? texto.length : 0);
  useEffect(() => {
    if (secQuieto()) { setN(texto.length); return undefined; }
    setN(0);
    let k = 0;
    let id = setTimeout(function paso() {
      k++;
      setN(k);
      if (k < texto.length) id = setTimeout(paso, 14 + Math.random() * 26);
    }, espera || 1600);
    return () => clearTimeout(id);
  }, [texto]);
  return (
    <span className="teclea" aria-label={texto}>
      <span aria-hidden="true">{texto.slice(0, n)}</span>
      <i className={'teclea__c' + (n >= texto.length ? ' is-fin' : '')} aria-hidden="true"></i>
      <span className="teclea__r" aria-hidden="true">{texto.slice(n)}</span>
    </span>
  );
}

// Tarjeta que va pasando quién lleva cada rama.
function PortadaTarjeta({ d }) {
  const n = d.equipo.length;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (secQuieto()) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % n), 3400);
    return () => clearInterval(id);
  }, [n]);
  return (
    <button type="button" className="hero-tarjeta" onClick={() => secIrA('ramas')} data-cursor="cta">
      <span className="hero-tarjeta__punto" aria-hidden="true"></span>
      <span className="hero-tarjeta__txt">
        <span className="hero-tarjeta__etq">{d.tarjeta}</span>
        <span className="hero-tarjeta__pila">
          {d.equipo.map((x, k) => (
            <span className={'hero-tarjeta__p' + (k === i ? ' is-on' : '')} key={k} aria-hidden={k !== i}><b>{x.rama}</b>{x.quien}</span>
          ))}
        </span>
      </span>
      <span className="hero-tarjeta__fl" aria-hidden="true">↓</span>
    </button>
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
        <p className="hero-etq"><i aria-hidden="true"></i>{d.etq}</p>
        <h1 className="hero-titulo"><span className="hero-titulo__fijo">{d.fijo}</span> <Rota palabras={d.rota} /></h1>
        <p className="hero-tagline">{d.sub}</p>
      </div>
      <div className="hero-foot">
        <p className="hero-tagline-sub"><Teclea texto={d.teclea} /></p>
        <PortadaTarjeta d={d} />
      </div>
      <img className="hero-wordmark" src="assets/logos/logotipo_beige.svg" alt="adsPartners" aria-hidden="true" data-parallax="0.05" />
    </header>
  );
}

// ---------- Cinta ----------
// Lo que hacemos, pasando sin parar. Va más deprisa al bajar y se frena al ponerle el ratón.
function Cinta() {
  const items = useSec().cinta;
  const despl = useRef(null);
  const pista = useRef(null);
  useAlBajar(() => {
    const el = despl.current;
    const grupo = pista.current && pista.current.firstChild;
    if (!el || !grupo || secQuieto()) return;
    const w = grupo.offsetWidth || 1;
    el.style.transform = `translate3d(${(-((window.scrollY * 0.35) % w)).toFixed(1)}px, 0, 0)`;
  }, [items.length]);
  const ritmo = (v) => {
    const t = pista.current;
    if (t && t.getAnimations) t.getAnimations().forEach((a) => { if (a.updatePlaybackRate) a.updatePlaybackRate(v); else a.playbackRate = v; });
  };
  const grupo = (k) => (
    <span className="cinta__grupo" aria-hidden={k > 0} key={k}>
      {items.map((t, i) => <span className="cinta__it" key={i}>{t}<i aria-hidden="true"></i></span>)}
    </span>
  );
  return (
    <div className="cinta panel" data-nav-theme="light" onPointerEnter={() => ritmo(0.25)} onPointerLeave={() => ritmo(1)}>
      <div className="cinta__despl" ref={despl}>
        <div className="cinta__pista" ref={pista}>{[0, 1, 2, 3].map(grupo)}</div>
      </div>
    </div>
  );
}

// ---------- Seis cosas (tarjetas vivas) ----------
// Una visita cada mes.
function PiezaDentro({ x }) {
  const ref = useRef(null);
  const { lang } = useT();
  const paso = usePaso(ref, 14, 480);   // 12 meses + dos tiempos de pausa
  const meses = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'es-ES', { month: 'short' }).format(new Date(2026, i, 1)).replace('.', ''));
  return (
    <div className="pieza pieza-dentro" ref={ref}>
      <p className="pieza__etq">{x.visita}</p>
      <ol className="pieza-dentro__meses">
        {meses.map((m, i) => (
          <li className={(i <= paso ? 'is-on' : '') + (i === paso ? ' is-ahora' : '')} key={i}><i></i><span>{m}</span></li>
        ))}
      </ol>
    </div>
  );
}

// Las tres ramas pasan por una sola persona hasta vosotros.
function PiezaPersona({ x }) {
  return (
    <div className="pieza pieza-persona">
      <ul className="pieza-persona__ramas">
        <li>Finance</li><li>Tech</li><li>Brand</li>
      </ul>
      <svg className="pieza-persona__lineas" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,8 C55,8 45,30 100,30" /><path d="M0,30 L100,30" /><path d="M0,52 C55,52 45,30 100,30" />
      </svg>
      <span className="pieza-persona__nodo">{x.referencia}</span>
      <span className="pieza-persona__tramo" aria-hidden="true"></span>
      <span className="pieza-persona__vos">{x.vosotros}</span>
    </div>
  );
}

// Alcance y precio, cerrados antes de cada fase.
function PiezaFases({ x }) {
  const ref = useRef(null);
  const paso = usePaso(ref, 5, 850);
  return (
    <div className="pieza pieza-fases" ref={ref}>
      {[0, 1, 2].map((i) => (
        <div className={'pieza-fases__fila' + (i < paso ? ' is-on' : '')} key={i}>
          <span className="pieza-fases__n">{x.fase} {i + 1}</span>
          <span className="pieza-fases__chip">{x.alcance}</span>
          <span className="pieza-fases__chip">{x.precio}</span>
        </div>
      ))}
    </div>
  );
}

// Empezar por una rama: los interruptores se van encendiendo.
function PiezaUna() {
  const ref = useRef(null);
  const paso = usePaso(ref, 5, 950);
  return (
    <div className="pieza pieza-una" ref={ref}>
      {['Finance', 'Tech', 'Brand'].map((r, i) => (
        <div className={'pieza-una__fila' + (i <= Math.min(paso, 2) && paso < 4 ? ' is-on' : (paso === 4 && i === 0 ? ' is-on' : ''))} key={r}>
          <span>ads {r}</span><i aria-hidden="true"></i>
        </div>
      ))}
    </div>
  );
}

// Se explica, se prueba, se ajusta.
function PiezaRitmo({ x }) {
  const ref = useRef(null);
  const paso = usePaso(ref, x.ritmo.length, 1500);
  return (
    <ol className="pieza pieza-ritmo" ref={ref}>
      {x.ritmo.map((t, i) => (
        <li className={i === paso ? 'is-on' : ''} key={i}><span>{String(i + 1).padStart(2, '0')}</span>{t}</li>
      ))}
    </ol>
  );
}

// El Diagnóstico, descontado entero.
function PiezaDescuento({ x }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.5);
  const on = visto || secQuieto();
  return (
    <div className={'pieza pieza-desc' + (on ? ' is-on' : '')} ref={ref}>
      <p className="pieza-desc__n"><Cuenta hasta={100} on={on} dur={1700} /><small>%</small></p>
      <p className="pieza-desc__t">{x.descuento}</p>
      <span className="pieza-desc__barra" aria-hidden="true"><i></i></span>
    </div>
  );
}

function Diferencias() {
  const d = useSec().diferencias;
  const piezas = { dentro: PiezaDentro, persona: PiezaPersona, fases: PiezaFases, una: PiezaUna, ritmo: PiezaRitmo, descuento: PiezaDescuento };
  // La tarjeta bajo el ratón se inclina hacia él y le sigue una luz.
  const mover = (e) => {
    const c = e.target.closest && e.target.closest('.celda');
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    c.style.setProperty('--mx', x.toFixed(0) + 'px');
    c.style.setProperty('--my', y.toFixed(0) + 'px');
    c.style.setProperty('--rx', ((y / r.height - 0.5) * -5).toFixed(2) + 'deg');
    c.style.setProperty('--ry', ((x / r.width - 0.5) * 5).toFixed(2) + 'deg');
  };
  const salir = (e) => {
    const c = e.target.closest && e.target.closest('.celda');
    if (!c || (e.relatedTarget && c.contains(e.relatedTarget))) return;
    c.style.setProperty('--rx', '0deg');
    c.style.setProperty('--ry', '0deg');
  };
  return (
    <section className="difs panel" id="diferencias" data-screen-label="Cómo trabajamos" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} lado={d.lado} />
      <div className="difs-rejilla" onMouseMove={mover} onMouseOut={salir}>
        {d.celdas.map((c, i) => {
          const Pieza = piezas[c.id];
          return (
            <div className={'celda-w celda-w--' + c.id + ' reveal reveal-delay-' + (i % 3 + 1)} key={c.id}>
              <article className={'celda celda--' + c.id}>
                <h3 className="celda__t">{c.t}</h3>
                <p className="celda__d">{c.d}</p>
                <Pieza x={d.piezas} />
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Las tres ramas ----------
// ads Finance: el margen de cada línea de negocio.
function DemoFinance({ d }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.3);
  const on = visto || secQuieto();
  const max = Math.max.apply(null, d.filas.map((f) => Math.abs(f.v)));
  return (
    <div className={'demo demo-fin' + (on ? ' is-on' : '')} ref={ref}>
      <div className="demo__cab">
        <span className="demo__t">{d.cab}</span>
        <span className="demo__ej">{d.ejemplo}</span>
      </div>
      <div className="demo-fin__filas">
        {d.filas.map((f, i) => (
          <div className={'demo-fin__fila' + (f.v < 0 ? ' es-perdida' : '')} key={f.n} style={{ '--w': (Math.abs(f.v) / max).toFixed(3), '--i': i }}>
            <span className="demo-fin__n">{f.n}</span>
            <span className="demo-fin__pista" aria-hidden="true"><span className="demo-fin__barra"></span></span>
            <span className="demo-fin__v"><Cuenta hasta={f.v} on={on} sufijo=" %" dur={900 + i * 180} /></span>
            <span className="demo-fin__nota">{f.nota}</span>
          </div>
        ))}
      </div>
      <p className="demo-fin__frase">{secTexto(d.frase)}</p>
    </div>
  );
}

// ads Tech: una factura recorre sus cuatro pasos sola, en bucle mientras se ve.
const SEC_ICONOS = [
  <><path d="M3 6.5h18v11H3z" /><path d="M3 7l9 6.5L21 7" /></>,
  <><path d="M6 3h9l4 4v14H6z" /><path d="M9 11h7M9 14.5h7M9 18h4" /></>,
  <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
  <><path d="M4 20V4M4 20h16" /><path d="M8.5 20v-6M13 20V9M17.5 20v-9" /></>,
];
function DemoTech({ d }) {
  const ref = useRef(null);
  const n = d.pasos.length;
  const paso = usePaso(ref, n + 2, 1100);   // los dos últimos tiempos son la pausa con todo encendido
  return (
    <div className="demo demo-tech" ref={ref}>
      <div className="demo__cab">
        <span className="demo__t">{d.cab}</span>
        <span className="demo__ej">{d.ejemplo}</span>
      </div>
      <ol className="demo-tech__pasos">
        {d.pasos.map((t, i) => (
          <li className={'demo-tech__paso' + (i <= paso ? ' is-hecho' : '') + (i === Math.min(paso, n - 1) ? ' is-activo' : '')} key={i}>
            <svg className="demo-tech__ico" viewBox="0 0 24 24" aria-hidden="true">{SEC_ICONOS[i]}</svg>
            <span className="demo-tech__txt">{t}</span>
          </li>
        ))}
      </ol>
      <div className="demo-tech__extras">
        {d.extras.map((x) => (
          <div className="demo-tech__extra" key={x.etq}>
            <p className="demo-tech__etq">{x.etq}</p>
            <p className="demo-tech__d">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ads Brand: cuatro negocios sueltos pasan a ser una familia («olmo» es una marca de ejemplo).
const OLMO_HOJAS = ['M47,47 Q47,6 6,6 Q6,47 47,47 Z', 'M53,47 Q53,6 94,6 Q94,47 53,47 Z', 'M47,53 Q6,53 6,94 Q47,94 47,53 Z', 'M53,53 Q94,53 94,94 Q53,94 53,53 Z'];
const OLMO_COLOR = ['#d9694b', '#e3a63f', '#74b796', '#7fb1d1'];
function Olmo({ hoja }) {
  // Sin `hoja` es la marca madre, a cuatro colores; con ella, la hoja de ese negocio.
  const madre = hoja === undefined;
  return (
    <svg className="olmo" viewBox="0 0 100 100" aria-hidden="true">
      {OLMO_HOJAS.map((p, i) => (
        <path key={i} d={p} fill={madre ? OLMO_COLOR[i] : 'currentColor'} fillOpacity={madre || hoja === i ? 1 : 0.28} />
      ))}
    </svg>
  );
}
function DemoBrand({ d }) {
  const ref = useRef(null);
  const dentro = useEnVista(ref, 0.3);
  const [despues, setDespues] = useState(secQuieto());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!dentro || secQuieto()) return undefined;
    const id = setTimeout(() => setDespues((x) => !x), despues ? 3800 : 2000);
    return () => clearTimeout(id);
  }, [dentro, despues, tick]);
  const ir = (v) => { setDespues(v); setTick((x) => x + 1); };
  return (
    <div className={'demo demo-brand' + (despues ? ' is-despues' : '')} ref={ref}>
      <div className="demo__cab">
        <span className="demo-brand__tabs">
          <button type="button" className={despues ? '' : 'is-on'} onClick={() => ir(false)} data-cursor="cta">{d.antes}</button>
          <button type="button" className={despues ? 'is-on' : ''} onClick={() => ir(true)} data-cursor="cta">{d.despues}</button>
        </span>
        <span className="demo__ej">{d.ejemplo}</span>
      </div>
      <div className="demo-brand__escena">
        <div className="demo-brand__capa demo-brand__capa--antes" aria-hidden={despues}>
          {d.sueltos.map((s, i) => <span className={'suelto suelto--' + i} key={i} style={{ '--i': i }}>{s}</span>)}
        </div>
        <div className="demo-brand__capa demo-brand__capa--despues" aria-hidden={!despues}>
          <div className="olmo-madre">
            <Olmo />
            <b>olmo</b>
            <span>{d.madre}</span>
          </div>
          <div className="olmo-hijas">
            {d.negocios.map((nombre, i) => (
              <div className={'olmo-hija olmo-hija--' + i} key={i} style={{ '--i': i }}>
                <Olmo hoja={i} />
                <span>olmo</span>
                <b>{nombre}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="demo-brand__pie">{despues ? d.pieDespues : d.pieAntes}</p>
    </div>
  );
}

// Tres filas y un escenario: la fila que se señala enseña su pieza al lado. Si nadie toca, van pasando solas.
function Ramas() {
  const d = useSec().ramas;
  const ref = useRef(null);
  const dentro = useEnVista(ref, 0.25);
  const n = d.lista.length;
  const [act, setAct] = useState(0);
  const [toco, setToco] = useState(false);
  useEffect(() => {
    if (toco || !dentro || secQuieto()) return undefined;
    const id = setTimeout(() => setAct((x) => (x + 1) % n), 7000);
    return () => clearTimeout(id);
  }, [act, toco, dentro, n]);
  const elegir = (i) => { setToco(true); setAct(i); };
  const demos = { finance: DemoFinance, tech: DemoTech, brand: DemoBrand };
  return (
    <section className="ramas panel" id="ramas" data-screen-label="Las tres ramas" data-nav-theme="dark">
      <Cabecera etq={d.etq} titulo={d.titulo} lado={d.lado} />
      <div className="ramas-duo" ref={ref} onMouseLeave={() => setToco(false)}>
        {d.lista.map((r, i) => (
          <button
            type="button"
            className={'rfila' + (i === act ? ' is-on' : '')}
            style={{ order: i * 2 }}
            key={r.id}
            aria-pressed={i === act}
            onMouseEnter={() => elegir(i)}
            onFocus={() => elegir(i)}
            onClick={() => elegir(i)}
            data-cursor="cta">
            <span className="rfila__num">(.0{i + 1})</span>
            <span className="rfila__cuerpo">
              <span className="rfila__nombre">{r.nombre}</span>
              <span className="rfila__frase">{r.frase}</span>
              <span className="rfila__chips">{r.chips.map((c) => <span className="chip" key={c}><i aria-hidden="true"></i>{c}</span>)}</span>
            </span>
            <span className="rfila__barra" aria-hidden="true">{i === act && !toco && dentro ? <i key={act}></i> : null}</span>
          </button>
        ))}
        <div className="ramas-escena" style={{ order: act * 2 + 1 }}>
          {(SEC_BOT ? d.lista : [d.lista[act]]).map((r) => {
            const D = demos[r.id];
            return (
              <div className="ramas-pieza" key={r.id}>
                <D d={d[r.id]} />
                <p className="ramas-quien"><span>{d.lleva}</span><b>{r.persona}</b>{r.nota}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- El método ----------
// Lo que se ve al lado de cada paso.
function VisCharla({ x }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.3);
  const paso = usePaso(ref, 2, 1700);
  return (
    <div className="vis vis-charla" ref={ref}>
      <p className="vis-charla__n"><Cuenta hasta={parseInt(x.n, 10)} on={visto || secQuieto()} dur={1100} /><small>{x.u}</small></p>
      <div className="vis-charla__modos">
        {x.modos.map((m, i) => <span className={i === paso ? 'is-on' : ''} key={m}><i aria-hidden="true"></i>{m}</span>)}
      </div>
      <p className="vis__pie">{x.pie}</p>
    </div>
  );
}
// Los días que pasamos dentro, repartidos en las semanas del Diagnóstico (la cuarta, si hace falta).
const VIS_DIAS = [[0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [2, 2], [3, 4]];
function VisSemanas({ x }) {
  const ref = useRef(null);
  const paso = usePaso(ref, VIS_DIAS.length + 3, 420);
  return (
    <div className="vis vis-semanas" ref={ref}>
      <div className="vis-semanas__cab"><span></span>{x.dias.map((dia, i) => <span key={i}>{dia}</span>)}</div>
      {[0, 1, 2, 3].map((s) => (
        <div className={'vis-semanas__fila' + (s === 3 ? ' es-opcional' : '')} key={s}>
          <span>{x.cab} {s + 1}</span>
          {x.dias.map((_, dia) => {
            const k = VIS_DIAS.findIndex((p) => p[0] === s && p[1] === dia);
            return <i className={k >= 0 && k <= paso ? 'is-on' : ''} key={dia}></i>;
          })}
        </div>
      ))}
      <p className="vis__pie">{x.pie}</p>
    </div>
  );
}
function VisMapa({ x }) {
  const ref = useRef(null);
  const paso = usePaso(ref, x.filas.length + 3, 700);
  return (
    <div className="vis vis-mapa" ref={ref}>
      <p className="vis-mapa__cab">{x.cab}</p>
      <ul>
        {x.filas.map((f, i) => <li className={i <= paso ? 'is-on' : ''} key={i}><i aria-hidden="true"></i>{f}</li>)}
      </ul>
      <span className={'vis-mapa__sello' + (paso >= x.filas.length ? ' is-on' : '')}>{x.sello}</span>
    </div>
  );
}
function VisFases({ x }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.3);
  return (
    <div className={'vis vis-fases' + (visto || secQuieto() ? ' is-on' : '')} ref={ref}>
      {x.filas.map((f, i) => (
        <div className="vis-fases__fila" key={f.n} style={{ '--w': f.w, '--i': i }}>
          <p><b>{f.n}</b><span>{f.v}</span></p>
          <span className="vis-fases__barra" aria-hidden="true"><i></i></span>
          <p className="vis-fases__d">{f.d}</p>
        </div>
      ))}
    </div>
  );
}
function VisMes({ x }) {
  return <div className="vis vis-mes"><PiezaDentro x={x} /></div>;
}
const VIS = { charla: VisCharla, semanas: VisSemanas, mapa: VisMapa, fases: VisFases, mes: VisMes };

// En ordenador el bloque se queda fijo y los pasos van pasando: el activo, nítido y en el centro; los demás,
// pequeños y desenfocados. En móvil (o sin movimiento) es una lista normal, cada paso con su pieza.
function Metodo() {
  const d = useSec().metodo;
  const n = d.pasos.length;
  const env = useRef(null);
  const linea = useRef(null);
  const pila = useRef(null);
  const [act, setAct] = useState(0);
  useAlBajar(() => {
    const e = env.current;
    if (!e) return;
    const pasos = e.querySelectorAll('.mpaso');
    const fijo = !secQuieto() && window.matchMedia('(min-width: 1025px) and (min-height: 640px)').matches;
    if (!fijo) {
      if (e.__fijo !== false) {
        e.__fijo = false;
        pasos.forEach((S) => { S.style.transform = ''; S.style.opacity = ''; S.style.filter = ''; });
      }
      return;
    }
    e.__fijo = true;
    const r = e.getBoundingClientRect();
    const tramo = r.height - window.innerHeight;
    if (tramo <= 0) return;
    const h = secLimita(-r.top / tramo, 0, 1);
    if (linea.current) linea.current.style.transform = `scaleY(${h.toFixed(4)})`;
    // Cada paso aguanta un rato quieto (62 % de su tramo) y luego deja sitio al siguiente.
    const b = secLimita(h, 0, 0.9999) * n;
    const g = Math.floor(b);
    const f = b - g;
    const w = Math.min(n - 1, g + (f <= 0.62 ? 0 : (f - 0.62) / 0.38));
    const alto = pila.current ? pila.current.clientHeight : 360;
    pasos.forEach((S, A) => {
      const k = A - w;
      const M = Math.abs(k);
      const F = Math.max(0, (M - 0.18) / 0.82);
      S.style.transform = `translateY(calc(-50% + ${(k * alto * 0.6).toFixed(1)}px)) scale(${(1 - Math.min(F, 1) * 0.08).toFixed(3)})`;
      S.style.opacity = M > 1.3 ? '0' : Math.max(0, 1 - F * 0.82).toFixed(3);
      S.style.filter = `blur(${Math.min(F * 6, 7).toFixed(1)}px)`;
    });
    const x = Math.min(n - 1, Math.round(w));
    if (e.__act !== x) { e.__act = x; setAct(x); }
  }, [n]);
  const Vis = VIS[d.pasos[act].id];
  return (
    <section className="metodo panel" id="metodo" data-screen-label="Cómo se empieza" data-nav-theme="light">
      <div className="metodo-env" ref={env} style={{ '--n': n }}>
        <div className="metodo-pin">
          <Cabecera etq={d.etq} titulo={d.titulo} />
          <div className="metodo-duo">
            <div className="metodo-vis">
              <span className="metodo-vis__cuenta">{String(act + 1).padStart(2, '0')}<small> / {String(n).padStart(2, '0')}</small></span>
              <Vis key={d.pasos[act].id} x={d.vis[d.pasos[act].id]} />
            </div>
            <div className="metodo-pila" ref={pila}>
              <span className="metodo-linea" aria-hidden="true"><i ref={linea}></i></span>
              {d.pasos.map((p, i) => {
                const V = VIS[p.id];
                return (
                  <div className={'mpaso' + (i === act ? ' is-on' : '')} key={p.id}>
                    <p className="mpaso__etq"><i aria-hidden="true"></i>{String(i + 1).padStart(2, '0')} · {p.etq}</p>
                    <h3 className="mpaso__t">{p.t}</h3>
                    <p className="mpaso__d">{p.d}</p>
                    <div className="mpaso__vis"><V x={d.vis[p.id]} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Testimonios ----------
// Las citas pasan solas; se pueden arrastrar y se frenan al ponerles el ratón.
function Testimonios() {
  const d = useSec().testimonios;
  const caja = useRef(null);
  const pista = useRef(null);
  useEffect(() => {
    const c = caja.current;
    const t = pista.current;
    if (!c || !t || secQuieto()) return undefined;
    let x = 0;
    let mitad = 0;
    let arrastra = false;
    let x0 = 0;
    let p0 = 0;
    let visible = false;
    let ritmo = 1;
    let raf = 0;
    const medir = () => { mitad = t.scrollWidth / 2; };
    const pintar = () => {
      if (mitad > 0) { while (x <= -mitad) x += mitad; while (x > 0) x -= mitad; }
      t.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    };
    const tic = () => {
      raf = requestAnimationFrame(tic);
      if (!visible || arrastra) return;
      x -= 0.7 * ritmo;
      pintar();
    };
    medir();
    raf = requestAnimationFrame(tic);
    const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; }));
    io.observe(c);
    const abajo = (e) => {
      arrastra = true; x0 = e.clientX; p0 = x;
      c.classList.add('is-arrastrando');
      try { c.setPointerCapture(e.pointerId); } catch (err) {}
    };
    const mueve = (e) => { if (arrastra) { x = p0 + (e.clientX - x0); pintar(); } };
    const arriba = () => { arrastra = false; c.classList.remove('is-arrastrando'); };
    const entra = () => { ritmo = 0.25; };
    const sale = () => { ritmo = 1; };
    window.addEventListener('resize', medir);
    c.addEventListener('pointerdown', abajo);
    c.addEventListener('pointermove', mueve);
    c.addEventListener('pointerup', arriba);
    c.addEventListener('pointercancel', arriba);
    c.addEventListener('mouseenter', entra);
    c.addEventListener('mouseleave', sale);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', medir);
      c.removeEventListener('pointerdown', abajo);
      c.removeEventListener('pointermove', mueve);
      c.removeEventListener('pointerup', arriba);
      c.removeEventListener('pointercancel', arriba);
      c.removeEventListener('mouseenter', entra);
      c.removeEventListener('mouseleave', sale);
    };
  }, [d.lista.length]);
  const cita = (x, k, oculta) => (
    <figure className="cita" key={k} aria-hidden={oculta}>
      <blockquote>«{x.q}»</blockquote>
      <figcaption><strong>{x.quien}</strong>{x.cargo}</figcaption>
    </figure>
  );
  // Cuatro tandas: la pista siempre es más ancha que dos pantallas y puede dar la vuelta sin saltos.
  const tandas = SEC_BOT ? [0] : [0, 1, 2, 3];
  return (
    <section className="testi panel" id="testimonios" data-screen-label="Testimonios" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="testi-caja" ref={caja} data-cursor="ver" data-cursor-label={d.arrastra}>
        <div className="testi-pista" ref={pista}>
          {tandas.map((t) => d.lista.map((x, i) => cita(x, t + '-' + i, t > 0)))}
        </div>
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
        <p className="sec-etq sec-etq--rosa reveal"><i aria-hidden="true"></i>{d.etq}</p>
        <p className="cierre-pie__texto reveal reveal-delay-1">{secTexto(d.texto)}</p>
        <button type="button" className="qd-prompt__btn cierre-pie__btn reveal reveal-delay-2" onClick={aQuedamos} data-cursor="cta">[{d.btn}]</button>
      </section>
    </>
  );
}

Object.assign(window, {
  Portada, Cinta, Diferencias, Ramas, Metodo, Testimonios, Preguntas, Cierre,
  Cabecera, Relleno, secTexto, secIr, secIrA, useEnVista, useVisto, Cuenta, useSec, secQuieto,
});
