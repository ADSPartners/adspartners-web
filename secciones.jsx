/* global React, useT, RevealText */
// ============= SECCIONES DE LA HOME =============
// Los bloques de «Recuperar el control»: punto de partida, las tres ramas, el principio, el Diagnóstico,
// el recorrido, cómo es trabajar con nosotros, testimonios, preguntas y cierre.
// Los textos viven en secciones-data.jsx (window.SECCIONES); aquí solo se pintan y se mueven.
const { useState, useEffect, useRef } = React;

// En el prerender del build (jsdom) y con «reducir movimiento» las piezas se pintan en su estado final.
const SEC_BOT = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
const secQuieto = () => SEC_BOT || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

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
      const k = Math.min(1, Math.max(0, (now - t0) / D));
      setV(Math.round(hasta * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [on, hasta]);
  return <>{String(v).replace('-', '−')}{sufijo || ''}</>;
}

// Cabecera de bloque: etiqueta, título en dos tonos y, si lo hay, un apunte al lado.
function Cabecera({ etq, titulo, lado }) {
  return (
    <header className={'sec-cab' + (lado ? ' sec-cab--lado' : '')}>
      <p className="sec-etq reveal">{etq}</p>
      <h2 className="sec-titulo reveal reveal-delay-1">{secTexto(titulo)}</h2>
      {lado ? <p className="sec-lado reveal reveal-delay-2">{lado}</p> : null}
    </header>
  );
}

// ---------- Punto de partida ----------
function PuntoPartida() {
  const d = useSec().partida;
  return (
    <section className="partida" id="partida" data-screen-label="Punto de partida" data-nav-theme="dark">
      <p className="sec-etq sec-etq--rosa reveal">{d.etq}</p>
      <RevealText className="partida-titulo" paras={[d.titulo]} />
      <div className="partida-cols">
        {d.cols.map((c, i) => (
          <div className={'partida-col reveal reveal-delay-' + (i + 1)} key={c.etq}>
            <p className="sec-etq sec-etq--rosa">{c.etq}</p>
            <h3 className="partida-col__t">{c.t}</h3>
            <p className="partida-col__d">{c.d}</p>
          </div>
        ))}
      </div>
      <p className="partida-cierre reveal">{d.cierre}</p>
    </section>
  );
}

// ---------- Las tres ramas ----------
// ads Finance: el margen de cada línea de negocio, que aparece al llegar.
function DemoFinance({ d }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.45);
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
  const dentro = useEnVista(ref, 0.4);
  const n = d.pasos.length;
  // El paso n es la pausa con todo encendido, antes de volver a empezar.
  const [paso, setPaso] = useState(secQuieto() ? n : 0);
  useEffect(() => {
    if (!dentro || secQuieto()) return undefined;
    const id = setInterval(() => setPaso((p) => (p + 1) % (n + 2)), 1150);
    return () => clearInterval(id);
  }, [dentro, n]);
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
            <p className="sec-etq">{x.etq}</p>
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
  const dentro = useEnVista(ref, 0.4);
  const [despues, setDespues] = useState(secQuieto());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!dentro || secQuieto()) return undefined;
    const id = setTimeout(() => setDespues((x) => !x), despues ? 4200 : 2600);
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

function Ramas() {
  const d = useSec().ramas;
  const demos = { finance: DemoFinance, tech: DemoTech, brand: DemoBrand };
  return (
    <section className="ramas" id="ramas" data-screen-label="Las tres ramas" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="ramas-pila">
        {d.lista.map((r, i) => {
          const Demo = demos[r.id];
          return (
            <article className={'rama rama--' + r.id} key={r.id} style={{ '--i': i }}>
              <header className="rama__cab">
                <span className="rama__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="rama__orden">{r.orden} · {r.nombre}</span>
                <span className="rama__persona">{r.persona}</span>
              </header>
              <div className="rama__cuerpo">
                <div className="rama__texto">
                  <h3 className="rama__titulo">{secTexto(r.titulo)}</h3>
                  <p className="rama__trayectoria">{r.trayectoria}</p>
                  <ul className="rama__entrega">
                    {r.entrega.map((e, k) => <li key={e}><span>{String(k + 1).padStart(2, '0')}</span>{e}</li>)}
                  </ul>
                </div>
                <div className="rama__demo"><Demo d={d[r.id]} /></div>
              </div>
            </article>
          );
        })}
        <div className="ramas-cola" aria-hidden="true"></div>
      </div>
    </section>
  );
}

// ---------- El principio ----------
function Principio() {
  const d = useSec().principio;
  return (
    <section className="principio" id="principio" data-screen-label="El principio" data-nav-theme="light">
      <p className="sec-etq reveal">{d.etq}</p>
      <RevealText className="principio-texto" paras={[d.texto]} />
    </section>
  );
}

// ---------- El Diagnóstico ----------
// «3–4» o «100 %»: cuenta el último número del texto y deja lo demás como está.
function CifraViva({ texto, on }) {
  const m = String(texto).match(/^(.*?)(\d+)(\D*)$/);
  if (!m) return <>{texto}</>;
  return <>{m[1]}<Cuenta hasta={parseInt(m[2], 10)} on={on} dur={1300} />{m[3]}</>;
}
function Diagnostico() {
  const d = useSec().diagnostico;
  const ref = useRef(null);
  const visto = useVisto(ref, 0.4);
  const on = visto || secQuieto();
  return (
    <section className="diag" id="diagnostico" data-screen-label="El Diagnóstico" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="diag-cifras" ref={ref}>
        {d.cifras.map((c, i) => (
          <div className={'diag-cifra reveal reveal-delay-' + (i + 1) + (i === 1 ? ' diag-cifra--oscura' : '')} key={c.etq}>
            <p className="sec-etq">{c.etq}</p>
            <p className={'diag-cifra__n' + (/[0-9]/.test(c.n) ? '' : ' diag-cifra__n--palabra')}><CifraViva texto={c.n} on={on} /></p>
            <p className="diag-cifra__u">{c.u}</p>
            <p className="diag-cifra__d">{c.d}</p>
          </div>
        ))}
      </div>
      <div className="diag-mapa">
        <header className="diag-mapa__cab">
          <p className="sec-etq reveal">{d.mapa.etq}</p>
          <h3 className="sec-titulo sec-titulo--2 reveal reveal-delay-1">{secTexto(d.mapa.titulo)}</h3>
        </header>
        <ol className="diag-mapa__filas">
          {d.mapa.filas.map((f, i) => (
            <li className={'reveal reveal-delay-' + Math.min(4, i + 1)} key={i}>
              <span>{String(i + 1).padStart(2, '0')}</span>{f}
            </li>
          ))}
        </ol>
      </div>
      <p className="sec-banda reveal">{secTexto(d.mapa.cierre)}</p>
    </section>
  );
}

// ---------- El recorrido ----------
// La línea se dibuja con el scroll y enciende cada parada al pasar. En ordenador va en horizontal; en móvil, en vertical.
const RECO_ICONOS = [
  <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  <><path d="M5 20V10M12 20V4M19 20v-7" /></>,
  <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
  <><path d="M12 3c.6 4.6 3.4 7.4 9 9-5.6 1.6-8.4 4.4-9 9-.6-4.6-3.4-7.4-9-9 5.6-1.6 8.4-4.4 9-9z" /></>,
  <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.3" /><path d="M16 14.2c2.9.2 5 2.6 5 5.8" /></>,
];
function Recorrido() {
  const d = useSec().recorrido;
  const ref = useRef(null);
  const n = d.pasos.length;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const paradas = el.querySelectorAll('.reco-paso');
    const pintar = (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      paradas.forEach((x, i) => x.classList.toggle('is-on', p >= i / (n - 1) - 0.002));
    };
    if (secQuieto()) { pintar(1); return undefined; }
    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const vertical = window.matchMedia('(max-width: 900px)').matches;
      const p = vertical ? (vh * 0.72 - r.top) / Math.max(1, r.height) : (vh * 0.92 - r.top) / (vh * 0.62);
      pintar(Math.min(1, Math.max(0, p)));
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(medir); };
    medir();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => {
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);
  return (
    <section className="reco" id="recorrido" data-screen-label="El recorrido" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <ol className="reco-linea" ref={ref} style={{ '--n': n }}>
        {d.pasos.map((x, i) => (
          <li className={'reco-paso' + (SEC_BOT ? ' is-on' : '')} key={i}>
            <span className="reco-paso__nodo"><svg viewBox="0 0 24 24" aria-hidden="true">{RECO_ICONOS[i]}</svg></span>
            <p className="sec-etq">{x.etq}</p>
            <h3 className="reco-paso__t">{x.t}</h3>
            <p className="reco-paso__n">{x.n}</p>
            <p className="reco-paso__d">{x.d}</p>
          </li>
        ))}
      </ol>
      <p className="sec-banda reveal">{secTexto(d.cierre)}</p>
    </section>
  );
}

// ---------- Cómo es trabajar con nosotros ----------
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

// Dentro de vuestra empresa: el Diagnóstico y, después, una visita cada mes.
function PiezaDentro({ x }) {
  const ref = useRef(null);
  const { lang } = useT();
  const paso = usePaso(ref, 14, 520);   // 12 meses + dos tiempos de pausa
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

// Una persona de referencia: las tres ramas pasan por un solo nombre hasta vosotros.
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

// Por fases y sin sorpresas: cada fase arranca con alcance y precio cerrados.
function PiezaFases({ x }) {
  const ref = useRef(null);
  const paso = usePaso(ref, 5, 900);
  return (
    <div className="pieza pieza-fases" ref={ref}>
      {[0, 1, 2].map((i) => (
        <div className={'pieza-fases__fila' + (i < paso ? ' is-on' : '')} key={i}>
          <span className="pieza-fases__n">{x.fase} {i + 1}</span>
          <span className="pieza-fases__chip">{x.alcance}</span>
          <span className="pieza-fases__chip">{x.precio}</span>
          <span className="pieza-fases__ok">{x.cerrado}</span>
        </div>
      ))}
    </div>
  );
}

// A vuestro ritmo: se explica, se prueba, se ajusta.
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

function Cerca() {
  const d = useSec().cerca;
  const piezas = { dentro: PiezaDentro, persona: PiezaPersona, fases: PiezaFases, ritmo: PiezaRitmo };
  return (
    <section className="cerca" id="cerca" data-screen-label="Cómo es trabajar con nosotros" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="cerca-rejilla">
        {d.celdas.map((c, i) => {
          const Pieza = piezas[c.id];
          return (
            <article className={'celda celda--' + c.id + ' reveal reveal-delay-' + (i % 2 + 1)} key={c.id}>
              <h3 className="celda__t">{c.t}</h3>
              <p className="celda__d">{c.d}</p>
              <Pieza x={d.piezas} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Testimonios ----------
function Testimonios() {
  const d = useSec().testimonios;
  const ref = useRef(null);
  const dentro = useEnVista(ref, 0.3);
  const n = d.lista.length;
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const ir = (k) => { setIdx((k + n) % n); setTick((x) => x + 1); };
  useEffect(() => {
    if (!dentro || secQuieto()) return undefined;
    const id = setTimeout(() => ir(idx + 1), 9000);
    return () => clearTimeout(id);
  }, [dentro, idx, tick]);
  return (
    <section className="testi" id="testimonios" ref={ref} data-screen-label="Testimonios" data-nav-theme="dark">
      <div className="testi-lado">
        <p className="sec-etq sec-etq--rosa reveal">{d.etq}</p>
        <div className="testi-mando">
          <span className="testi-cuenta">{String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <button type="button" onClick={() => ir(idx - 1)} aria-label={d.anterior} data-cursor="cta">←</button>
          <button type="button" onClick={() => ir(idx + 1)} aria-label={d.siguiente} data-cursor="cta">→</button>
        </div>
        <div className="testi-barra" aria-hidden="true"><span key={idx + '-' + tick} className={dentro ? 'is-corriendo' : ''}></span></div>
      </div>
      <div className="testi-pila">
        {d.lista.map((x, i) => (
          <figure className={'testi-cita' + (i === idx ? ' is-activa' : '')} key={i} aria-hidden={i !== idx}>
            <blockquote>«{x.q}»</blockquote>
            <figcaption><strong>{x.quien}</strong>{x.cargo}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ---------- Preguntas ----------
function Preguntas() {
  const d = useSec().preguntas;
  const [abierta, setAbierta] = useState(0);
  return (
    <section className="preguntas" id="preguntas" data-screen-label="Preguntas" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} />
      <div className="preguntas-lista">
        {d.lista.map((x, i) => (
          <div className={'pregunta reveal' + (i === abierta ? ' is-abierta' : '')} key={i}>
            <h3>
              <button type="button" aria-expanded={i === abierta} onClick={() => setAbierta(i === abierta ? -1 : i)} data-cursor="cta">
                <span>{x.p}</span><i aria-hidden="true"></i>
              </button>
            </h3>
            <div className="pregunta__r"><div><p>{x.r}</p></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Cierre ----------
// Las dos mitades de la frase llegan de los lados y se juntan al bajar (la mecánica del antiguo Win-Win).
function Cierre() {
  const d = useSec().cierre;
  const sec = useRef(null);
  const izq = useRef(null);
  const der = useRef(null);
  useEffect(() => {
    const s = sec.current;
    if (!s || secQuieto()) return undefined;
    let raf = 0;
    const pintar = () => {
      raf = 0;
      const r = s.getBoundingClientRect();
      const vh = window.innerHeight;
      // De 0 a 1 desde que el bloque asoma hasta poco después de quedarse fijo.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.85 + (s.offsetHeight - vh) * 0.55)));
      const off = ((1 - p) * 58).toFixed(2);
      const op = Math.min(1, 0.12 + p * 1.5).toFixed(3);
      if (izq.current) { izq.current.style.transform = `translate3d(${-off}vw,0,0)`; izq.current.style.opacity = op; }
      if (der.current) { der.current.style.transform = `translate3d(${off}vw,0,0)`; der.current.style.opacity = op; }
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(pintar); };
    pintar();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => {
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const aQuedamos = () => {
    window.dispatchEvent(new Event('open-quedamos'));
    const el = document.getElementById('quedamos');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  };
  const mitad = (x) => x.map((w, i) => <React.Fragment key={i}>{i ? <br /> : null}{w}</React.Fragment>);
  return (
    <>
      <section className="cierre" id="cierre" ref={sec} data-screen-label="Cierre" data-nav-theme="dark">
        <div className="cierre__pin">
          <p className="cierre__frase">
            <span className="cierre__mitad cierre__mitad--i" ref={izq}>{mitad(d.izq)}</span>{' '}
            <span className="cierre__mitad cierre__mitad--d" ref={der}>{mitad(d.der)}</span>
          </p>
        </div>
      </section>
      <section className="cierre-pie" data-nav-theme="dark">
        <p className="sec-etq sec-etq--rosa reveal">{d.etq}</p>
        <p className="cierre-pie__texto reveal reveal-delay-1">{secTexto(d.texto)}</p>
        <button type="button" className="qd-prompt__btn cierre-pie__btn reveal reveal-delay-2" onClick={aQuedamos} data-cursor="cta">[{d.btn}]</button>
      </section>
    </>
  );
}

Object.assign(window, {
  PuntoPartida, Ramas, Principio, Diagnostico, Recorrido, Cerca, Testimonios, Preguntas, Cierre,
  Cabecera, secTexto, useEnVista, useVisto, Cuenta, useSec, secQuieto,
});
