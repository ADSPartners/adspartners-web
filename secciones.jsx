/* global React, useT */
// ============= SECCIONES DE LA HOME =============
// Portada, «sin letra pequeña», testimonios, preguntas y cierre, y las piezas que comparten todos los bloques (cabecera, titular
// que se rellena). Los textos viven en secciones-data.jsx (window.SECCIONES); aquí solo se pintan y se mueven.
// Las tres ramas van en ramas.jsx y la lista de trabajos, en proyectos.jsx.
//
// Regla de movimiento: una sola cosa moviéndose por pantalla. Solo se mueve sola la palabra de la portada
// (y el cielo de las ramas, al fondo); lo demás responde al scroll, al ratón o a un clic. Las tarjetas de
// «sin letra pequeña» se animan una sola vez al entrar y se quedan quietas.
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

// ---------- Sin letra pequeña ----------
// Cinco tarjetas, cada una con una pieza que cuenta su promesa. Cada pieza se mueve UNA vez, al entrar en
// pantalla, y se queda quieta: no hay nada en bucle. Sin JavaScript, en el prerender y con «reducir
// movimiento», se pinta directamente el estado final (el CSS por defecto es el final; .is-espera lo esconde).

// 'espera' hasta que la tarjeta asoma, 'on' mientras se anima y 'fin' si no hay que animar.
function useUnaVez(ref) {
  const [estado, setEstado] = useState(SEC_BOT ? 'fin' : 'espera');
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (secQuieto() || !('IntersectionObserver' in window)) { setEstado('fin'); return undefined; }
    let fin = 0;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        setEstado('on');
        io.disconnect();
        fin = setTimeout(() => setEstado('fin'), 3200);
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fin); };
  }, []);
  return estado;
}

function PqTarjeta({ id, x, children, pie, alEntrar }) {
  const ref = useRef(null);
  const estado = useUnaVez(ref);
  return (
    <article className={'pq-tar pq-tar--' + id + (estado === 'espera' ? ' is-espera' : estado === 'on' ? ' is-on' : '')} ref={ref}
      onMouseEnter={alEntrar ? () => alEntrar(estado) : undefined}>
      <div className="pq-tar__texto">
        <h3 className="pq-tar__t">{x.t}</h3>
        <p className="pq-tar__d">{x.d}</p>
        {pie || null}
      </div>
      <div className="pq-tar__vivo" aria-hidden="true">{children(estado)}</div>
    </article>
  );
}

// Un mensaje que llega: «escribiendo…» y, después, la burbuja.
function PqPersona({ x }) {
  return (
    <PqTarjeta id="persona" x={x}>
      {() => (
        <div className="pq-chat">
          <div className="pq-chat__cab">
            <span className="pq-av">{x.iniciales}</span>
            <b>{x.quien}</b>
            <span className="pq-chat__linea"><i></i>{x.enLinea}</span>
          </div>
          <div className="pq-chat__escribe">{x.escribiendo}<span><i></i><i></i><i></i></span></div>
          <div className="pq-chat__msg">
            <p>{x.msg}</p>
            <span className="pq-chat__hora">{x.hora} · {x.visto} ✓✓</span>
          </div>
        </div>
      )}
    </PqTarjeta>
  );
}

// Un presupuesto: se marcan alcance, plazo y precio, y le cae el sello.
function PqPrecio({ x }) {
  return (
    <PqTarjeta id="precio" x={x}>
      {() => (
        <div className="pq-doc">
          <p className="pq-doc__t">{x.doc}</p>
          <span className="pq-raya"></span>
          <span className="pq-raya pq-raya--corta"></span>
          <ul className="pq-doc__lista">
            {x.lineas.map((l, k) => <li key={l} style={{ '--k': k }}><span>{l}</span><i>✓</i></li>)}
          </ul>
          <span className="pq-sello">{x.sello}</span>
        </div>
      )}
    </PqTarjeta>
  );
}

// El calendario de este mes, con la visita rodeada.
function PqVisita({ x }) {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();
  const hueco = (new Date(anio, mes, 1).getDay() + 6) % 7;    // la semana empieza en lunes
  const total = new Date(anio, mes + 1, 0).getDate();
  // La visita: el primer jueves a partir del día 8.
  let dia = 8;
  while (new Date(anio, mes, dia).getDay() !== 4) dia += 1;
  const nombreMes = new Intl.DateTimeFormat(x.locale, { month: 'long' }).format(hoy);
  const corto = new Intl.DateTimeFormat(x.locale, { weekday: 'short' }).format(new Date(anio, mes, dia)).replace('.', '');
  const nombreDia = corto.charAt(0).toUpperCase() + corto.slice(1);
  const celdas = [];
  for (let k = 0; k < hueco; k += 1) celdas.push(<span key={'h' + k}></span>);
  for (let d = 1; d <= total; d += 1) {
    celdas.push(
      <span key={d} className={d === dia ? 'is-visita' : undefined}>
        {d}
        {d === dia ? <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" pathLength="1" /></svg> : null}
      </span>,
    );
  }
  return (
    <PqTarjeta id="visita" x={x}>
      {() => (
        <div className="pq-cal">
          <p className="pq-cal__mes">{nombreMes} <span>{anio}</span></p>
          <div className="pq-cal__rejilla">
            {x.dias.map((d, k) => <b key={k}>{d}</b>)}
            {celdas}
          </div>
          <p className="pq-cal__evento"><i></i>{nombreDia} {dia} · {x.evento}</p>
        </div>
      )}
    </PqTarjeta>
  );
}

// Una factura: la línea del Diagnóstico se tacha y el total se queda más corto.
function PqDescuento({ x }) {
  return (
    <PqTarjeta id="descuento" x={x}>
      {() => (
        <div className="pq-fact">
          {x.lineas.map((l, k) => (
            <div className={'pq-fact__l pq-fact__l--' + k} key={l}>
              <span>{l}</span>
              <span className="pq-fact__puntos"></span>
              <span className="pq-fact__importe"><i></i></span>
              {k === 0 ? <span className="pq-fact__marca">{x.marca}</span> : null}
            </div>
          ))}
        </div>
      )}
    </PqTarjeta>
  );
}

// Un contador de facturas leídas solas, con el dato real del trabajo de hostelería.
function PqSolo({ x }) {
  const pie = (
    <a className="pq-tar__ver con-flecha" href="proyectos/gestion-hosteleria/" data-cursor="cta"
      onClick={(e) => { if (window.proyIr) window.proyIr(e, e.currentTarget.href, x.caso, '(02)'); }}>
      {x.ver} <span className="flecha-m" aria-hidden="true"></span>
    </a>
  );
  const [vuelta, setVuelta] = useState(0);
  const alEntrar = (estado) => { if (estado === 'fin' && !secQuieto()) setVuelta((v) => v + 1); };
  return (
    <PqTarjeta id="solo" x={x} pie={pie} alEntrar={alEntrar}>
      {(estado) => <PqCuenta x={x} estado={estado} vuelta={vuelta} />}
    </PqTarjeta>
  );
}

function PqCuenta({ x, estado, vuelta }) {
  const [n, setN] = useState(estado === 'espera' ? 0 : x.n);
  useEffect(() => {
    const otra = estado === 'fin' && vuelta > 0;
    if (estado === 'fin' && !otra) { setN(x.n); return undefined; }
    if (estado !== 'on' && !otra) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const dura = otra ? 1100 : 1700;
    const paso = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / dura));
      setN(Math.round(x.n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [estado, vuelta, x.n]);
  return (
    <div className="pq-cuenta">
      <p className="pq-cuenta__n">{n}</p>
      <p className="pq-cuenta__u">{x.unidad}</p>
      <span className="pq-cuenta__barra"><i style={{ transform: 'scaleX(' + (n / x.n).toFixed(3) + ')' }}></i></span>
      <p className="pq-cuenta__extra"><span className="pq-semaforo"><i></i><i></i><i></i></span>{x.extra}</p>
    </div>
  );
}

function PorQue() {
  const d = useSec().porque;
  if (!d) return null;
  return (
    <section className="porque panel" id="porque" data-screen-label="Sin letra pequeña" data-nav-theme="light">
      <Cabecera etq={d.etq} titulo={d.titulo} lado={d.lado} />
      <div className="pq-rejilla">
        <PqPersona x={d.persona} />
        <PqPrecio x={d.precio} />
        <PqVisita x={d.visita} />
        <PqDescuento x={d.descuento} />
        <PqSolo x={d.solo} />
      </div>
    </section>
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
// Una franja fina: el titular y una flecha que señala el globo de FRESA (fijo, abajo a la derecha) y lo sigue al
// bajar. Las preguntas se le hacen a FRESA: aquí no se pinta ningún chat. Pulsar la flecha abre el chat.
function Preguntas() {
  const d = useSec().preguntas;
  const sec = useRef(null);
  const flecha = useRef(null);
  useAlBajar(() => {
    const s = sec.current;
    const f = flecha.current;
    if (!s || !f) return;
    const r = s.getBoundingClientRect();
    const vista = r.bottom > 0 && r.top < window.innerHeight;
    s.classList.toggle('is-vista', vista && !secQuieto());
    if (!vista) return;
    const globo = document.querySelector('.cg-bubble');
    const g = globo && globo.getBoundingClientRect();
    if (!g || !g.width) return;
    const a = f.getBoundingClientRect();
    const ang = Math.atan2(g.top + g.height / 2 - (a.top + a.height / 2), g.left + g.width / 2 - (a.left + a.width / 2));
    f.style.setProperty('--ang', (ang * 180 / Math.PI).toFixed(1) + 'deg');
  });
  const abrir = () => {
    const globo = document.querySelector('.cg-bubble');
    if (globo) globo.click();
  };
  return (
    <section className="preguntas panel" id="preguntas" ref={sec} data-screen-label="Preguntas" data-nav-theme="light">
      <Relleno texto={d.titulo} className="preguntas__titulo" ventana={0.3} />
      <button type="button" className="preguntas__flecha" ref={flecha} onClick={abrir} aria-label={d.abrir} data-cursor="cta">
        <span className="preguntas__giro">
          <svg viewBox="0 0 120 24" aria-hidden="true"><path d="M2 12h114M103 2.5l13 9.5-13 9.5" /></svg>
        </span>
      </button>
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
        <button type="button" className="qd-prompt__btn cierre-pie__btn con-flecha reveal reveal-delay-2" onClick={aQuedamos} data-cursor="cta">[{d.btn}]<span className="flecha-m" aria-hidden="true"></span></button>
      </section>
    </>
  );
}

Object.assign(window, {
  Portada, PorQue, Testimonios, Preguntas, Cierre,
  Cabecera, Relleno, secTexto, secIr, secIrA, useSec, secQuieto,
});
