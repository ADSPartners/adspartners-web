/* global React, ReactDOM, useT, I18nProvider, CookieConsent, ChatGlobo */
// ============= HOME DE adsPartners =============
// Rehecha desde cero el 27-oct-2026 con agenciaicaro.com como referencia: portada oscura con la marca enorme,
// «lo que nos diferencia» en tarjetas, servicios en filas, método fijado al bajar, proyectos con cifras, cita,
// opiniones, la tarjeta que crece entre «ads» y «Partners», preguntas, contacto y pie. Paleta neutra (blanco,
// gris y negro) con el rosa de ads como acento, y titulares en Apple Garamond. Los textos, en inicio-data.jsx.
//
// Movimiento, como en Ícaro: las piezas entran al aparecer en pantalla y reaccionan al pasar el ratón; solo
// cambia lo que se señala, y todo con la misma curva. Sin JavaScript (prerender) o con «reducir movimiento»,
// todo se pinta en su estado final.
const { useState, useEffect, useRef } = React;

const IN_BOT = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
const inQuieto = () => IN_BOT || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const inLimita = (v, a, b) => Math.max(a, Math.min(b, v));
const inSuave = (t) => 1 - Math.pow(1 - t, 3);

// Lleva a un bloque de la página (con el scroll suave de Lenis si está).
function inIr(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : 16));
  if (window.adsIr) window.adsIr(y); else window.scrollTo({ top: y, behavior: 'smooth' });
}
// Un enlace «#bloque» que hace scroll suave; uno a otra página navega normal.
const inEnlace = (href, antes) => (e) => {
  if (antes) antes();
  if (href && href[0] === '#') { e.preventDefault(); inIr(href.slice(1)); }
};

function useInicio() {
  const { lang } = useT();
  const D = window.INICIO || {};
  return D[lang] || D.es;
}

// «Texto {en gris}» → dos tonos. Con `palabras`, cada palabra va en su caja para entrar una detrás de otra.
function dosTonos(s, palabras) {
  let n = 0;
  const trozo = (txt) => (!palabras ? txt : txt.split(/(\s+)/).map((w, k) => (
    /^\s+$/.test(w) || !w ? w : <span className="in-pal" key={k} style={{ '--i': n++ }}>{w}</span>
  )));
  return String(s).split(/(\{[^}]*\})/).filter(Boolean).map((x, i) => (x[0] === '{'
    ? <span className="in-gris" key={i}>{trozo(x.slice(1, -1))}</span>
    : <React.Fragment key={i}>{trozo(x)}</React.Fragment>));
}

// true cuando el elemento asoma por primera vez (y ya no vuelve a false).
function useVisto(ref, umbral) {
  const [visto, setVisto] = useState(IN_BOT);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (inQuieto() || !('IntersectionObserver' in window)) { setVisto(true); return undefined; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setVisto(true); io.disconnect(); }
    }, { threshold: umbral || 0.18, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return visto;
}

// Llama a `pintar` con cada scroll o cambio de tamaño, como mucho una vez por fotograma.
function useAlBajar(pintar) {
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
  }, []);
}

// Bloque que entra (sube y aparece) cuando asoma.
function Aparece({ como, className, retraso, children, ...resto }) {
  const ref = useRef(null);
  const visto = useVisto(ref);
  const Tag = como || 'div';
  return (
    <Tag ref={ref} className={'in-ap' + (visto ? ' is-visto' : '') + (className ? ' ' + className : '')}
      style={retraso ? { '--ret': retraso + 'ms' } : undefined} {...resto}>
      {children}
    </Tag>
  );
}

// Titular de dos tonos cuyas palabras entran una detrás de otra.
function Titular({ texto, como, className }) {
  const ref = useRef(null);
  const visto = useVisto(ref, 0.3);
  const Tag = como || 'h2';
  return <Tag ref={ref} className={'in-tit' + (visto ? ' is-visto' : '') + (className ? ' ' + className : '')}>{dosTonos(texto, true)}</Tag>;
}

function Etiqueta({ n, children }) {
  return <Aparece como="p" className="in-etq">({String(n).padStart(2, '0')}) — {children}</Aparece>;
}

// Botón con punto que, al pasar el ratón, se convierte en flecha que empuja.
function Boton({ href, onClick, variante, pequeno, children, className, ...resto }) {
  const cls = 'in-btn in-btn--' + (variante || 'negro') + (pequeno ? ' in-btn--peq' : '') + (className ? ' ' + className : '');
  const dentro = (<><span className="in-btn__txt">{children}</span><span className="in-morf" aria-hidden="true"><i></i><b>→</b></span></>);
  if (href) return <a className={cls} href={href} onClick={onClick} {...resto}>{dentro}</a>;
  return <button type="button" className={cls} onClick={onClick} {...resto}>{dentro}</button>;
}

function Avatar({ iniciales, grande }) {
  return <span className={'in-avatar' + (grande ? ' in-avatar--grande' : '')} aria-hidden="true">{iniciales}</span>;
}

// ---------------------------------------------------------------- BARRA
function Barra({ D }) {
  const { lang, setLang } = useT();
  const [recogida, setRecogida] = useState(false);
  const [panel, setPanel] = useState(false);
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  useAlBajar(() => setRecogida(window.scrollY > 60));
  useEffect(() => {
    document.documentElement.classList.toggle('in-sin-scroll', menu);
    return () => document.documentElement.classList.remove('in-sin-scroll');
  }, [menu]);
  const cerrar = () => { setPanel(false); setMenu(false); };
  const salir = (e) => { if (ref.current && !ref.current.contains(e.relatedTarget)) setPanel(false); };
  const links = [['servicios', D.nav.servicios], ['metodo', D.nav.metodo], ['proyectos', D.nav.proyectos], ['preguntas', D.nav.preguntas]];
  return (
    <header ref={ref} className={'in-barra' + (recogida ? ' is-recogida' : '') + (panel ? ' is-panel' : '') + (menu ? ' is-menu' : '')}
      onMouseLeave={() => setPanel(false)} onBlur={salir} onKeyDown={(e) => { if (e.key === 'Escape') cerrar(); }}>
      <div className="in-barra__pildora">
        <a className="in-barra__logo" href="#top" onClick={inEnlace('#top', cerrar)} aria-label="adsPartners">
          <span className="in-logo in-logo--entero"></span>
          <span className="in-logo in-logo--iso"></span>
        </a>
        <nav className="in-barra__links" aria-label="adsPartners">
          {links.map(([id, txt]) => (
            <a key={id} href={'#' + id} className={id === 'servicios' && panel ? 'is-on' : ''}
              onMouseEnter={() => setPanel(id === 'servicios')} onFocus={() => setPanel(id === 'servicios')}
              onClick={inEnlace('#' + id, cerrar)}>{txt}</a>
          ))}
        </nav>
        <div className="in-barra__der">
          <button type="button" className="in-barra__idioma" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label={lang === 'es' ? 'EN · English' : 'ES · Español'}>{lang === 'es' ? 'EN' : 'ES'}</button>
          <Boton variante="rosa" pequeno onClick={() => { cerrar(); inIr('contacto'); }}>{D.nav.cta}</Boton>
          <button type="button" className="in-barra__hamb" aria-label={D.nav.menu} aria-expanded={menu} onClick={() => setMenu(!menu)}>
            <i></i><i></i>
          </button>
        </div>
      </div>
      <div className="in-barra__panel" aria-hidden={!panel}>
        {D.servicios.lista.map((s) => (
          <a key={s.nombre} href={s.href} tabIndex={panel ? 0 : -1} onClick={inEnlace(s.href, cerrar)}>
            <i aria-hidden="true"></i><b>{s.nombre}</b><span>{s.corto}</span>
          </a>
        ))}
      </div>
      <div className="in-menu" aria-hidden={!menu}>
        <p className="in-menu__etq">{D.nav.servicios}</p>
        <div className="in-menu__serv">
          {D.servicios.lista.map((s) => <a key={s.nombre} href={s.href} tabIndex={menu ? 0 : -1} onClick={inEnlace(s.href, cerrar)}>{s.nombre}</a>)}
        </div>
        <p className="in-menu__etq">{D.nav.explora}</p>
        <div className="in-menu__grande">
          {links.slice(1).map(([id, txt]) => <a key={id} href={'#' + id} tabIndex={menu ? 0 : -1} onClick={inEnlace('#' + id, cerrar)}>{txt} <span>→</span></a>)}
        </div>
        <Boton variante="rosa" onClick={() => { cerrar(); inIr('contacto'); }} tabIndex={menu ? 0 : -1}>{D.nav.cta}</Boton>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------- PORTADA
function TarjetaPersona({ P, oscura }) {
  return (
    <Aparece className={'in-persona' + (oscura ? ' in-persona--oscura' : '')} retraso={500}>
      <Avatar iniciales={P.iniciales} grande />
      <div className="in-persona__txt">
        <span className="in-persona__rol">{P.rol}<br />{P.donde}</span>
        <b>{P.nombre}</b>
        <Boton variante="vidrio" pequeno onClick={() => inIr('contacto')}>{P.btn}</Boton>
      </div>
    </Aparece>
  );
}

function Portada({ D }) {
  const P = D.portada;
  const sec = useRef(null);
  // La esfera y la cinta de clientes solo se mueven mientras la portada se ve.
  useEffect(() => {
    const el = sec.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((es) => es.forEach((e) => el.classList.toggle('is-fuera', !e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="in-portada" id="top" ref={sec}>
      <div className="in-portada__astro" aria-hidden="true"><span className="in-portada__luces"></span></div>
      <div className="in-portada__centro">
        <p className="in-insignia in-entra" style={{ '--d': 0 }}><i></i>{P.insignia.join(' · ')}<i></i></p>
        <h1 className="in-portada__marca in-entra" style={{ '--d': 1 }}>
          <span className="in-oculto">{P.oculto}</span>
          <span className="in-logo in-logo--grande" aria-hidden="true"></span><sup aria-hidden="true">®</sup>
        </h1>
        <p className="in-portada__lema in-entra" style={{ '--d': 2 }}>{dosTonos(P.lema)}</p>
        <div className="in-cinta in-entra" style={{ '--d': 3 }} aria-label={P.clientesEtq}>
          <div className="in-cinta__pista">
            {P.clientes.concat(P.clientes).map((c, i) => <span key={i} aria-hidden={i >= P.clientes.length}>{c}</span>)}
          </div>
        </div>
      </div>
      <div className="in-portada__pie">
        <p className="in-portada__texto in-entra" style={{ '--d': 4 }}>{dosTonos(P.pie)}</p>
        <TarjetaPersona P={D.persona} oscura />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- LO QUE NOS DIFERENCIA
function Contador({ n, activo, dura }) {
  const [v, setV] = useState(activo === 'fin' ? n : 0);
  useEffect(() => {
    if (!activo) return undefined;
    if (inQuieto()) { setV(n); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const paso = (t) => {
      const p = inLimita((t - t0) / (dura || 1600), 0, 1);
      setV(Math.round(n * inSuave(p)));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [activo, n]);
  return <>{v}</>;
}

function IconoAviso({ ic }) {
  if (ic === 'correo') return <svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>;
  if (ic === 'cal') return <svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>;
  return <span className="in-aviso__ads">ads</span>;
}

function Diferencia({ D }) {
  const X = D.diferencia;
  const rej = useRef(null);
  const visto = useVisto(rej, 0.15);
  const [vuelta, setVuelta] = useState(0);
  return (
    <section className="in-sec in-dif" id="diferencia">
      <div className="in-ancho">
        <div className="in-cab">
          <div>
            <Etiqueta n={1}>{X.etq}</Etiqueta>
            <Titular texto={X.titulo} />
          </div>
          <Aparece como="p" className="in-cab__lado">{X.lado} <b>{X.ladoFuerte}</b></Aparece>
        </div>
        <div className={'in-bento' + (visto ? ' is-visto' : '')} ref={rej}>
          <article className="in-carta in-carta--grande" style={{ '--k': 0 }}>
            <div className="in-carta--grande__fondo" aria-hidden="true"><span></span></div>
            <div className="in-carta--grande__txt">
              <h3>{dosTonos(X.grande.t)}</h3>
              <p>{X.grande.d}</p>
            </div>
            <div className="in-carta--grande__pie">
              <span className="in-chip in-chip--oscuro"><i></i>{X.grande.chip}</span>
              <Boton variante="blanco" pequeno onClick={() => inIr('contacto')}>{X.grande.btn}</Boton>
            </div>
          </article>

          <article className="in-carta in-carta--precio" style={{ '--k': 1 }}>
            <div className="in-carta__cab"><h3>{X.precio.t}</h3><span className="in-chip in-chip--rosa">{X.precio.chip}</span></div>
            <p>{X.precio.d}</p>
            <div className="in-carpeta" aria-hidden="true">
              {X.precio.hojas.map((h, i) => <span className="in-carpeta__hoja" key={h} style={{ '--h': i }}><i></i>{h}</span>)}
              <span className="in-carpeta__frente"><span className="in-logo in-logo--iso"></span></span>
            </div>
          </article>

          <article className="in-carta in-carta--equipo" style={{ '--k': 2 }}>
            <h3>{X.equipo.t}</h3>
            <p>{X.equipo.d}</p>
            <div className="in-avisos" aria-hidden="true">
              <span className="in-chip in-chip--borde"><i></i>{X.equipo.chip}</span>
              {X.equipo.avisos.map((a, i) => (
                <div className="in-aviso" key={a.t} style={{ '--a': i }}>
                  <span className="in-aviso__ic"><IconoAviso ic={a.ic} /></span>
                  <span className="in-aviso__txt"><small>{a.de}</small>{a.t}</span>
                  <span className="in-aviso__cuando">{a.cuando}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="in-carta in-carta--persona" style={{ '--k': 3 }}>
            <h3>{X.persona.t}</h3>
            <p>{X.persona.d}</p>
            <div className="in-carta__fila">
              <Avatar iniciales={D.persona.iniciales} />
              <span className="in-chip in-chip--verde"><i></i>{X.persona.chip}</span>
            </div>
          </article>

          <article className="in-carta in-carta--solo" style={{ '--k': 4 }}
            onMouseEnter={() => { if (visto && !inQuieto()) setVuelta((v) => v + 1); }}>
            <h3>{X.solo.t}</h3>
            <div className="in-solo">
              <p className="in-solo__n"><Contador n={X.solo.n} activo={IN_BOT ? 'fin' : (visto ? 'v' + vuelta : '')} /></p>
              <div className="in-solo__barras" aria-hidden="true">{[22, 34, 46, 62, 100].map((h, i) => <i key={i} style={{ '--b': h + '%', '--j': i }}></i>)}</div>
            </div>
            <p className="in-solo__u">{X.solo.u}</p>
          </article>

          <article className="in-carta in-carta--tecno" style={{ '--k': 5 }}>
            <h3>{X.tecno.t}</h3>
            <p>{X.tecno.d}</p>
            <div className="in-orbita" aria-hidden="true">
              <span className="in-orbita__anillo"></span>
              <span className="in-orbita__anillo in-orbita__anillo--2"></span>
              <span className="in-orbita__centro"></span>
              <span className="in-orbita__giro">
                <i className="in-nodo in-nodo--1"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 10h16M10 4v16" /></svg></i>
                <i className="in-nodo in-nodo--2"><svg viewBox="0 0 24 24"><path d="M5 6h14v9H9l-4 3z" /></svg></i>
                <i className="in-nodo in-nodo--3"><svg viewBox="0 0 24 24"><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></svg></i>
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- SERVICIOS
function SignoServicio({ s }) {
  if (s === 'fin') return <svg viewBox="0 0 64 48"><rect x="10" y="28" width="9" height="12" rx="2" /><rect x="24" y="20" width="9" height="20" rx="2" /><rect x="38" y="10" width="9" height="30" rx="2" /><path d="M10 22 24 15l14 4 14-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 64 48"><circle cx="28" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="m36 30 9 9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M23 22h10M28 17v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}

function Servicios({ D }) {
  const S = D.servicios;
  return (
    <section className="in-sec in-oscuro in-serv" id="servicios">
      <span className="in-ancla" id="ramas" aria-hidden="true"></span>
      <div className="in-ancho">
        <div className="in-cab">
          <div>
            <Etiqueta n={2}>{S.etq}</Etiqueta>
            <Titular texto={S.titulo} />
          </div>
          <Aparece como="p" className="in-cab__lado in-cab__lado--grande">{dosTonos(S.lado)}</Aparece>
        </div>
        <ol className="in-serv__lista">
          {S.lista.map((s, i) => (
            <Aparece como="li" key={s.nombre} retraso={(i % 3) * 70}>
              <a className="in-serv__fila" href={s.href} onClick={inEnlace(s.href)}>
                <span className="in-serv__n">(.{String(i + 1).padStart(2, '0')})</span>
                <span className="in-serv__img">
                  {s.img ? <img src={s.img} alt="" width="1280" height="800" loading="lazy" decoding="async" /> : <span className="in-serv__signo"><SignoServicio s={s.signo} /></span>}
                </span>
                <span className="in-serv__nombre">{s.nombre}</span>
                <span className="in-serv__cuerpo">
                  <span className="in-serv__d">{s.d}</span>
                  <span className="in-serv__chips">{s.chips.map((c) => <span className="in-chip in-chip--serv" key={c}><i></i>{c}</span>)}</span>
                </span>
              </a>
            </Aparece>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- MÉTODO
function Metodo({ D }) {
  const M = D.metodo;
  const ref = useRef(null);
  const [activa, setActiva] = useState(0);
  useAlBajar(() => {
    const el = ref.current;
    if (!el) return;
    const fases = el.querySelectorAll('.in-fase');
    const mitad = window.innerHeight * 0.52;
    let k = 0;
    fases.forEach((f, i) => { if (f.getBoundingClientRect().top < mitad) k = i; });
    setActiva(k);
    const lista = el.querySelector('.in-metodo__lista');
    if (lista) {
      const r = lista.getBoundingClientRect();
      el.style.setProperty('--prog', inLimita((mitad - r.top) / r.height, 0, 1).toFixed(4));
    }
  });
  const f = M.fases[activa];
  return (
    <section className="in-sec in-metodo" id="metodo" ref={ref}>
      <div className="in-ancho">
        <div className="in-cab">
          <div>
            <Etiqueta n={3}>{M.etq}</Etiqueta>
            <Titular texto={M.titulo} />
          </div>
          <Aparece como="p" className="in-cab__lado">{M.lado} <b>{M.ladoFuerte}</b></Aparece>
        </div>
        <div className="in-metodo__rejilla">
          <div className="in-metodo__fijo">
            <div className="in-metodo__pantalla">
              <div className="in-metodo__astro" aria-hidden="true"></div>
              {M.fases.map((x, i) => (
                <div className={'in-metodo__vista' + (i === activa ? ' is-on' : '')} key={x.t} aria-hidden={i !== activa}>
                  <span className="in-metodo__num">0{i + 1}</span>
                  <span className="in-metodo__dura">{x.dura}</span>
                </div>
              ))}
              <span className="in-chip in-chip--vidrio in-metodo__lugar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>{M.lugar}</span>
              <span className="in-metodo__fase" aria-live="polite">{f.etq}</span>
            </div>
          </div>
          <div className="in-metodo__lista">
            <span className="in-metodo__linea" aria-hidden="true"><i></i></span>
            {M.fases.map((x, i) => (
              <div className={'in-fase' + (i === activa ? ' is-on' : '')} key={x.t}>
                <span className="in-chip in-chip--borde"><i></i>{x.etq}</span>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- PROYECTOS
function Caso({ c, i, ver }) {
  return (
    <div className={'in-caso' + (i % 2 ? ' in-caso--inv' : '')}>
      <Aparece className="in-caso__media">
        <a className="in-caso__ventana" href={'proyectos/' + c.slug + '/'}>
          <span className="in-caso__barra"><b>{c.cliente}.</b><i></i><i></i><i></i></span>
          <span className="in-caso__img">
            <img src={c.img} alt={c.cliente} width="1280" height="800" loading="lazy" decoding="async" />
            <span className="in-chip in-chip--vidrio"><i></i>{c.chip}</span>
          </span>
        </a>
      </Aparece>
      <Aparece className="in-caso__txt" retraso={120}>
        <p className="in-caso__kicker">{c.kicker}</p>
        <p className="in-caso__grande">{c.grande}<small>{c.unidad}</small></p>
        <p className="in-caso__d">{c.d}</p>
        <dl className="in-caso__datos">
          {c.datos.map(([n, t]) => <div key={t}><dt>{n}</dt><dd>{t}</dd></div>)}
        </dl>
        <Boton href={'proyectos/' + c.slug + '/'} variante="linea" pequeno>{ver}</Boton>
      </Aparece>
    </div>
  );
}

function Proyectos({ D }) {
  const X = D.proyectos;
  return (
    <section className="in-sec in-proy" id="proyectos">
      <div className="in-ancho">
        <div className="in-cab in-cab--solo">
          <Etiqueta n={4}>{X.etq}</Etiqueta>
          <Titular texto={X.titulo} />
        </div>
        <div className="in-proy__casos">
          {X.casos.map((c, i) => <Caso key={c.slug} c={c} i={i} ver={X.ver} />)}
        </div>
        <Aparece className="in-proy__mas">
          <span>{X.mas}</span>
          {X.otros.map((o) => (o.slug
            ? <a key={o.n} href={'proyectos/' + o.slug + '/'}>{o.n} <i aria-hidden="true">↗</i></a>
            : <b key={o.n}>{o.n}</b>))}
        </Aparece>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- CITA
function Cita({ D }) {
  return (
    <section className="in-sec in-cita">
      <div className="in-ancho">
        <Titular como="p" texto={D.cita.t} className="in-cita__t" />
        <Aparece className="in-cita__quien" retraso={200}>
          <Avatar iniciales={D.persona.iniciales} />
          <span><b>{D.persona.nombre}</b>{D.persona.rol}</span>
        </Aparece>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- OPINIONES
function Opiniones({ D }) {
  const O = D.opiniones;
  return (
    <section className="in-sec in-opi" id="opiniones">
      <div className="in-ancho in-opi__rejilla">
        <div className="in-opi__cab">
          <Etiqueta n={5}>{O.etq}</Etiqueta>
          <Titular texto={O.titulo} />
          <Aparece como="p" className="in-opi__d">{O.d}</Aparece>
        </div>
        <div className="in-opi__lista">
          {O.lista.map((o, i) => (
            <Aparece como="figure" className="in-opi__carta" key={o.quien} retraso={i * 110}>
              <span className="in-opi__marca">{o.empresa}</span>
              <blockquote>«{o.q}»</blockquote>
              <figcaption><b>{o.quien}</b>{o.cargo} · {o.empresa}</figcaption>
            </Aparece>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- MARCA (la tarjeta que crece al bajar)
function Marca({ D }) {
  const M = D.marca;
  const sec = useRef(null);
  const [abierta, setAbierta] = useState(IN_BOT);
  useAlBajar(() => {
    const s = sec.current;
    if (!s) return;
    if (inQuieto()) { s.style.setProperty('--e', '1'); setAbierta(true); return; }
    const r = s.getBoundingClientRect();
    const recorrido = s.offsetHeight - window.innerHeight;
    const p = inLimita(-r.top / (recorrido * 0.8), 0, 1);
    const e = inSuave(p);
    s.style.setProperty('--e', e.toFixed(4));
    setAbierta(e > 0.82);
  });
  return (
    <section className="in-marca" ref={sec}>
      <div className="in-marca__fijo">
        <span className="in-marca__palabra in-marca__palabra--i" aria-hidden="true">{M.izq}</span>
        <div className={'in-marca__tarjeta' + (abierta ? ' is-abierta' : '')}>
          <div className="in-marca__fondo" aria-hidden="true"><span></span></div>
          <div className="in-marca__puntos" aria-hidden="true"><i></i><i></i><i></i></div>
          <span className="in-marca__mini" aria-hidden="true">Finance · Tech · Brand</span>
          <div className="in-marca__dentro">
            <p className="in-marca__etq">{M.etq}</p>
            <p className="in-marca__t">{dosTonos(M.t)}</p>
            <Boton variante="vidrio" onClick={() => inIr('contacto')}>{M.btn}</Boton>
          </div>
        </div>
        <span className="in-marca__palabra in-marca__palabra--d" aria-hidden="true">{M.der}</span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- PREGUNTAS
function Preguntas({ D }) {
  const X = D.preguntas;
  const [abierta, setAbierta] = useState(0);
  const fresa = () => { const g = document.querySelector('.cg-bubble'); if (g) g.click(); };
  return (
    <section className="in-sec in-preg" id="preguntas">
      <div className="in-ancho">
        <div className="in-cab in-cab--solo">
          <Etiqueta n={6}>{X.etq}</Etiqueta>
          <Titular texto={X.titulo} />
        </div>
        <Aparece className="in-preg__caja">
          {X.lista.map((q, i) => (
            <div className={'in-preg__item' + (i === abierta ? ' is-on' : '')} key={q.p}>
              <button type="button" className="in-preg__p" aria-expanded={i === abierta} onClick={() => setAbierta(i === abierta ? -1 : i)}>
                <span>{q.p}</span><i aria-hidden="true"></i>
              </button>
              <div className="in-preg__r"><div><p>{q.r}</p></div></div>
            </div>
          ))}
        </Aparece>
        <Aparece className="in-preg__mas">
          <Boton variante="negro" onClick={fresa}>{X.fresa}</Boton>
        </Aparece>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- CONTACTO
// El formulario manda a n8n (mismo webhook que la carta «Quedamos»). ⚠️ Antes de publicar hay que adaptar
// el nodo «Procesar carta» del workflow b0ZiR58NwOdiKmeu a estos campos: hoy exige los de la carta (drink,
// signature, meeting.label…) y descartaría en silencio este envío.
const IN_WEBHOOK = 'https://n8n.ads-partners.com/webhook/ads-carta';
const IN_NEWS = 'https://n8n.ads-partners.com/webhook/ads-newsletter';
const IN_WA = 'https://wa.me/34633565840';
const emailValido = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s).trim());

function IconoPromesa({ ic }) {
  if (ic === 'reloj') return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
  if (ic === 'doc') return <svg viewBox="0 0 24 24"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z" /><path d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-3.9 5.6-.8z" /></svg>;
}

function Formulario({ F }) {
  const { lang } = useT();
  const [v, setV] = useState({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' });
  const [estado, setEstado] = useState('');   // '', 'error', 'enviando', 'ok'
  const cambia = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const enviar = async (e) => {
    e.preventDefault();
    if (!v.nombre.trim() || !v.empresa.trim() || !emailValido(v.email) || !v.telefono.trim()) { setEstado('error'); return; }
    setEstado('enviando');
    const datos = {
      source: 'adspartners.com/contacto', lang, submitted_at: new Date().toISOString(),
      name: v.nombre.trim(), company: v.empresa.trim(), email: v.email.trim(), phone: v.telefono.trim(), extra: v.mensaje.trim(),
    };
    try {
      await fetch(IN_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos), keepalive: true });
      setEstado('ok');
    } catch (err) {
      // Si el envío falla, el contacto no se pierde: se abre el correo con los datos.
      const cuerpo = `${F.nombre}: ${datos.name}\n${F.empresa}: ${datos.company}\n${F.email}: ${datos.email}\n${F.telefono}: ${datos.phone}\n\n${datos.extra}`;
      window.location.href = `mailto:adsgroup@ads-partners.com?subject=${encodeURIComponent('Contacto web — ' + datos.name)}&body=${encodeURIComponent(cuerpo)}`;
      setEstado('ok');
    }
  };
  if (estado === 'ok') {
    return (
      <div className="in-form in-form--ok">
        <span className="in-form__visto" aria-hidden="true">✓</span>
        <p className="in-form__t">{F.ok}</p>
        <Boton variante="linea" pequeno onClick={() => { setV({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' }); setEstado(''); }}>{F.otro}</Boton>
      </div>
    );
  }
  const campo = (k, etq, ph, tipo, req) => (
    <label className="in-campo">
      <span>{etq}{req ? '*' : ''}</span>
      <input type={tipo || 'text'} value={v[k]} onChange={cambia(k)} placeholder={ph} required={req} autoComplete={{ nombre: 'name', empresa: 'organization', email: 'email', telefono: 'tel' }[k]} />
    </label>
  );
  return (
    <form className="in-form" onSubmit={enviar} noValidate>
      <p className="in-form__t">{dosTonos(F.t)}</p>
      <div className="in-form__rejilla">
        {campo('nombre', F.nombre, F.phNombre, 'text', true)}
        {campo('empresa', F.empresa, F.phEmpresa, 'text', true)}
        {campo('email', F.email, F.phEmail, 'email', true)}
        {campo('telefono', F.telefono, F.phTel, 'tel', true)}
      </div>
      <label className="in-campo">
        <span>{F.mensaje}</span>
        <textarea rows="4" value={v.mensaje} onChange={cambia('mensaje')} placeholder={F.phMensaje}></textarea>
      </label>
      {estado === 'error' ? <p className="in-form__error" role="alert">{F.error}</p> : null}
      <button type="submit" className="in-btn in-btn--rosa in-btn--ancho" disabled={estado === 'enviando'}>
        <span className="in-btn__txt">{estado === 'enviando' ? F.enviando : F.enviar}</span>
        <span className="in-morf" aria-hidden="true"><i></i><b>→</b></span>
      </button>
      <p className="in-form__o">{F.wa}</p>
      <a className="in-btn in-btn--linea in-btn--ancho in-form__wa" href={IN_WA} target="_blank" rel="noopener">
        <span className="in-btn__txt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" /><path d="M9 8.8c.2 2.9 2.4 5.2 5.4 5.6l.9-1.2-1.6-.8-.7.6a4.3 4.3 0 0 1-2-2l.6-.7-.8-1.6z" /></svg>{F.waBtn}</span>
      </a>
      <p className="in-form__legal">{F.privacidad} <a href="privacidad.html">{F.privacidadLink}</a>.</p>
    </form>
  );
}

function Contacto({ D }) {
  const C = D.contacto;
  return (
    <section className="in-sec in-oscuro in-contacto" id="contacto">
      <span className="in-ancla" id="quedamos" aria-hidden="true"></span>
      <div className="in-ancho in-contacto__rejilla">
        <Aparece className="in-form__marco">
          <span className="in-form__brillo" aria-hidden="true"></span>
          <Formulario F={C.form} />
        </Aparece>
        <div className="in-contacto__txt">
          <Titular texto={C.titulo} />
          <Aparece como="p" className="in-contacto__d">{C.d}</Aparece>
          <ul className="in-promesas">
            {C.promesas.map((p, i) => (
              <Aparece como="li" key={p.t} retraso={i * 90}>
                <span className="in-promesas__ic" aria-hidden="true"><IconoPromesa ic={p.ic} /></span>
                <span><b>{p.t}</b>{p.d}</span>
              </Aparece>
            ))}
          </ul>
          <Aparece className="in-contacto__persona" retraso={200}>
            <Avatar iniciales={D.persona.iniciales} />
            <span><b>{D.persona.nombre}</b>{D.persona.rol}</span>
            <a href="tel:+34633565840">+34 633 565 840</a>
          </Aparece>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- PIE
function Boletin({ N }) {
  const { lang } = useT();
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const [mal, setMal] = useState(false);
  const enviar = (e) => {
    e.preventDefault();
    if (!emailValido(email)) { setMal(true); return; }
    setMal(false);
    fetch(IN_NEWS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), lang, source: 'adspartners.com/footer' }), keepalive: true }).catch(() => {});
    setOk(true);
  };
  if (ok) return <p className="in-pie__ok">{N.ok}</p>;
  return (
    <form className={'in-pie__news' + (mal ? ' is-mal' : '')} onSubmit={enviar} noValidate>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={N.ph} aria-label={N.ph} autoComplete="email" />
      <button type="submit">{N.btn}</button>
    </form>
  );
}

function Pie({ D }) {
  const X = D.pie;
  const redes = [['Instagram', 'https://www.instagram.com/adspartners.co'], ['LinkedIn', 'https://www.linkedin.com/company/ads-partners-co/'], ['TikTok', 'https://www.tiktok.com/@adspartners.co'], ['YouTube', 'https://youtube.com/@ads-partners']];
  return (
    <footer className="in-pie">
      <div className="in-ancho">
        <div className="in-pie__arriba">
          <div className="in-pie__marca">
            <span className="in-logo in-logo--entero" aria-hidden="true"></span>
            <p>{X.lema}</p>
            <p className="in-pie__news-t">{X.news.t}</p>
            <p className="in-pie__news-d">{X.news.d}</p>
            <Boletin N={X.news} />
          </div>
          <nav className="in-pie__col" aria-label={X.servicios}>
            <p>{X.servicios}</p>
            {D.servicios.lista.map((s) => <a key={s.nombre} href={s.href} onClick={inEnlace(s.href)}>{s.nombre}</a>)}
          </nav>
          <nav className="in-pie__col" aria-label={X.empresa}>
            <p>{X.empresa}</p>
            {X.enlaces.map(([t, id]) => <a key={id} href={'#' + id} onClick={inEnlace('#' + id)}>{t}</a>)}
          </nav>
          <div className="in-pie__col">
            <p>{X.contacto}</p>
            <a href="mailto:adsgroup@ads-partners.com">adsgroup@ads-partners.com</a>
            <a href="tel:+34633565840">+34 633 565 840</a>
            {redes.map(([t, u]) => <a key={t} href={u} target="_blank" rel="noopener">{t} ↗</a>)}
          </div>
        </div>
        <div className="in-pie__abajo">
          <span>© {new Date().getFullYear()} adsPartners® · {X.derechos}</span>
          <span className="in-pie__legales">
            {X.legales.map(([t, u]) => <a key={u} href={u}>{t}</a>)}
            <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-cookie-settings')); }}>{X.configurar}</a>
          </span>
        </div>
      </div>
      <div className="in-pie__gigante" aria-hidden="true"><span className="in-logo in-logo--entero"></span></div>
    </footer>
  );
}

// ---------------------------------------------------------------- PÍLDORA «DISPONIBLES» Y DESENFOQUE
function Disponible({ texto }) {
  const [ver, setVer] = useState(false);
  useAlBajar(() => {
    const hero = document.getElementById('top');
    const contacto = document.getElementById('contacto');
    const pasado = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.4 : true;
    const enContacto = contacto ? contacto.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
    setVer(pasado && !enContacto);
  });
  return (
    <button type="button" className={'in-disponible' + (ver ? ' is-on' : '')} onClick={() => inIr('contacto')} tabIndex={ver ? 0 : -1}>
      <i aria-hidden="true"></i>{texto}
    </button>
  );
}

// ---------------------------------------------------------------- PÁGINA
function Inicio() {
  const D = useInicio();
  return (
    <>
      <Barra D={D} />
      <main className="in-main">
        <Portada D={D} />
        <Diferencia D={D} />
        <Servicios D={D} />
        <Metodo D={D} />
        <Proyectos D={D} />
        <Cita D={D} />
        <Opiniones D={D} />
        <Marca D={D} />
        <Preguntas D={D} />
        <Contacto D={D} />
      </main>
      <Pie D={D} />
      <Disponible texto={D.disponible} />
      <div className="in-velo" aria-hidden="true"></div>
      {typeof CookieConsent !== 'undefined' && <CookieConsent />}
      {typeof ChatGlobo !== 'undefined' && <ChatGlobo onCTA={() => inIr('contacto')} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<I18nProvider><Inicio /></I18nProvider>);
