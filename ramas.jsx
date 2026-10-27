/* global React, ReactDOM, useT, Nav, SideMenu, Footer, useReveal, I18nProvider, CookieConsent, ChatGlobo, Cabecera, secTexto, secQuieto, proyIr, ListaTrabajos */
// ============= LAS TRES RAMAS =============
// La sección «Qué hacemos» de la home (una fila por rama sobre un cielo que se mueve) y la página de cada rama
// (/finance/, /tech/, /brand/, generadas por build.mjs desde rama.html). Los textos viven en ramas-data.jsx.
// Todo es tipografía y línea fina: aquí no hay tarjetas ni diagramas.
const { useEffect, useRef } = React;

const ramasDatos = (lang) => { const R = window.RAMAS || {}; return R[lang] || R.es || {}; };
const ramasOrden = () => (window.RAMAS && window.RAMAS.orden) || [];
const ramasNum = (i) => '(0' + (i + 1) + ')';

// ---------- El cielo ----------
// Dos capas de nubes que pasan despacio y una luz de amanecer que sigue al ratón (todo CSS, ver ramas.css).
// Se pone como primer hijo de un bloque con `isolation: isolate`. `luz` (0–100) es dónde descansa la luz.
function Cielo({ tono, luz }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const sec = el && el.parentElement;
    if (!sec || secQuieto()) return undefined;
    // Las nubes solo corren mientras el bloque está a la vista.
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => es.forEach((e) => el.classList.toggle('is-on', e.isIntersecting)));
      io.observe(el);
    } else {
      el.classList.add('is-on');
    }
    let raf = 0;
    let x = 50;
    const pintar = () => {
      raf = 0;
      el.style.setProperty('--lx', x.toFixed(1));
      el.style.setProperty('--mx', ((x - 50) / 50).toFixed(3));
    };
    const mover = (e) => {
      if (e.pointerType === 'touch') return;
      const r = sec.getBoundingClientRect();
      x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    const salir = () => { el.style.removeProperty('--lx'); el.style.removeProperty('--mx'); };
    sec.addEventListener('pointermove', mover);
    sec.addEventListener('pointerleave', salir);
    return () => {
      if (io) io.disconnect();
      sec.removeEventListener('pointermove', mover);
      sec.removeEventListener('pointerleave', salir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className={'cielo cielo--' + (tono || 'alba')} ref={ref} style={luz === undefined ? undefined : { '--lx0': luz }} aria-hidden="true">
      <span className="cielo__luz"></span>
      <span className="cielo__nubes cielo__nubes--a"></span>
      <span className="cielo__nubes cielo__nubes--b"></span>
    </div>
  );
}

// Abre la página de una rama con la cortina (la misma del cambio de idioma y de los proyectos).
const ramaIr = (e, r, i) => proyIr(e, e.currentTarget.href, r.nombre + '.', ramasNum(i));

// ---------- Sección de la home ----------
// Una fila por rama: número, nombre, su frase con lo que incluye en pastillas, y cuánto tarda el primer resultado.
// Al señalar una fila (solo esa: las demás no se tocan), le sale delante el signo de la rama, las pastillas se
// rellenan una detrás de otra y la flecha del círculo empuja. Todo con la misma curva y a la vez.

// El signo de cada rama: barras (Finance), nodos que se conectan (Tech) y «Aa» (Brand).
function RamaSigno({ id }) {
  if (id === 'finance') {
    return (
      <svg viewBox="0 0 40 28"><rect x="6" y="16" width="7" height="8" rx="1.5" /><rect x="16.5" y="10" width="7" height="14" rx="1.5" /><rect x="27" y="3" width="7" height="21" rx="1.5" /></svg>
    );
  }
  if (id === 'tech') {
    return (
      <svg viewBox="0 0 40 28"><path d="M7 16 20 7l13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="16" r="3.4" /><circle cx="20" cy="7" r="3.4" /><circle cx="33" cy="20" r="3.4" /></svg>
    );
  }
  return <svg viewBox="0 0 40 28"><text x="20" y="21" textAnchor="middle">Aa</text></svg>;
}

function Ramas() {
  const { lang } = useT();
  const R = ramasDatos(lang);
  if (!R.home) return null;
  return (
    <section className="ramas panel" id="ramas" data-screen-label="Las tres ramas" data-nav-theme="light">
      <Cielo />
      <Cabecera etq={R.home.etq} titulo={R.home.titulo} lado={R.home.lado} />
      <ol className="rfilas">
        {ramasOrden().map((id, i) => {
          const r = R[id];
          return (
            <li className="rfila-w reveal" key={id} style={{ transitionDelay: i * 90 + 'ms' }}>
              <a className="rfila con-flecha" href={id + '/'} onClick={(e) => ramaIr(e, r, i)}>
                <span className="rfila__titulo">
                  <span className="rfila__num">{ramasNum(i)}</span>
                  <span className="rfila__signo" aria-hidden="true"><RamaSigno id={id} /></span>
                  <span className="rfila__nombre"><small>ads</small>{r.corto}</span>
                </span>
                <span className="rfila__cuerpo">
                  <span className="rfila__frase">{r.frase}</span>
                  <span className="rfila__pastillas">
                    {r.incluye.map((x) => <span className="pastilla" key={x.t}>{x.t}</span>)}
                  </span>
                </span>
                <span className="rfila__plazo">
                  <small>{R.pagina.plazo}</small>
                  {r.paso.etq}
                </span>
                <span className="rfila__ir" aria-hidden="true"><span className="flecha-m"></span></span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ---------- Página de una rama ----------
function RamaCabecera({ r, p, i }) {
  return (
    <header className="rama-cab" id="top" data-nav-theme="light">
      <Cielo luz={[20, 50, 80][i]} />
      <div className="rama-cab__barra">
        <a className="caso-volver" href="./#ramas" data-cursor="cta">← {p.volver}</a>
        <span className="rama-cab__cuenta">({'0' + (i + 1)}/{'0' + ramasOrden().length})</span>
      </div>
      <div className="rama-cab__centro">
        <h1 className="rama-cab__titulo"><em>ads</em> {r.corto}.</h1>
        <p className="rama-cab__frase">{r.frase}</p>
      </div>
      <dl className="rama-cab__meta">
        <div><dt><span>(01)</span> {p.lleva}</dt><dd><b>{r.persona}</b>{r.nota}</dd></div>
        <div><dt><span>(02)</span> {p.plazo}</dt><dd>{r.plazo}</dd></div>
        <div><dt><span>(03)</span> {p.contrato}</dt><dd>{p.sola}</dd></div>
      </dl>
    </header>
  );
}

function RamaIncluye({ r, p }) {
  return (
    <section className="rama-incluye panel" id="incluye" data-nav-theme="light">
      <Cabecera etq={p.incluye} titulo={r.idea} />
      <ol className="rlista">
        {r.incluye.map((x, k) => (
          <li className="rlista__fila reveal" key={x.t} style={{ transitionDelay: k * 70 + 'ms' }}>
            <span className="rlista__num">{ramasNum(k)}</span>
            <h3 className="rlista__t">{x.t}</h3>
            <p className="rlista__d">{x.d}</p>
          </li>
        ))}
      </ol>
      {r.apunte ? <p className="rama-apunte reveal">{r.apunte}</p> : null}
    </section>
  );
}

function RamaTrabajo({ p, lista }) {
  if (!lista.length) return null;
  return (
    <section className="proyectos trabajos rama-trabajo panel" id="trabajo" data-nav-theme="dark">
      <Cabecera etq={p.trabajo.etq} titulo={p.trabajo.titulo} />
      <ListaTrabajos lista={lista} />
    </section>
  );
}

function RamaEmpieza({ r, p }) {
  const pasos = p.pasos.concat([r.paso]);
  return (
    <section className="rama-empieza panel" id="empieza" data-nav-theme="light">
      <Cabecera etq={p.empieza.etq} titulo={p.empieza.titulo} />
      <ol className="rpasos">
        {pasos.map((s, k) => (
          <li className={'rpaso reveal reveal-delay-' + (k + 1)} key={s.t}>
            <p className="rpaso__etq">{'0' + (k + 1)} · {s.etq}</p>
            <h3 className="rpaso__t">{s.t}</h3>
            <p className="rpaso__d">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="rama-apunte reveal">{p.nota}</p>
    </section>
  );
}

function RamaCierre({ id, R, p, aQuedamos }) {
  const orden = ramasOrden();
  return (
    <section className="rama-cierre panel" id="siguiente" data-nav-theme="dark">
      <Cielo tono="noche" />
      <p className="sec-etq reveal">{p.cierre.etq}</p>
      <p className="rama-cierre__texto reveal reveal-delay-1">{secTexto(p.cierre.texto)}</p>
      <button type="button" className="qd-prompt__btn reveal reveal-delay-2" onClick={aQuedamos} data-cursor="cta">[{p.cierre.btn}]</button>
      <nav className="rama-otras" aria-label={p.otras}>
        <p className="sec-etq">{p.otras}</p>
        {orden.map((o, k) => (o === id ? null : (
          <a className="rama-otra" key={o} href={o + '/'} data-cursor="ver" data-cursor-label={R.home.ver} onClick={(e) => ramaIr(e, R[o], k)}>
            <span className="rama-otra__num">{ramasNum(k)}</span>
            <span className="rama-otra__nombre">{R[o].nombre}</span>
            <span className="rama-otra__frase">{R[o].frase}</span>
            <span className="rama-otra__fl" aria-hidden="true">→</span>
          </a>
        )))}
      </nav>
    </section>
  );
}

function RamaApp() {
  const { lang } = useT();
  const R = ramasDatos(lang);
  const orden = ramasOrden();
  const id = document.body.getAttribute('data-rama');
  const i = Math.max(0, orden.indexOf(id));
  const r = R[orden[i]];
  const p = R.pagina;
  const lista = (window.TRABAJOS || []).filter((x) => String(x.rama).toLowerCase() === orden[i]);
  useReveal();
  // Levanta la cortina con la que se llega (la pone el HTML antes de montar).
  useEffect(() => {
    const b = document.body;
    if (!b.classList.contains('lang-switching')) return undefined;
    const t1 = setTimeout(() => { b.classList.remove('lang-switching'); b.classList.add('lang-switched-in'); }, 380);
    const t2 = setTimeout(() => { b.classList.remove('lang-switched-in'); }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  // La carta «Quedamos» está en la home.
  const aQuedamos = () => { window.location.href = new URL('#quedamos', document.baseURI).href; };
  const items = [
    { href: '#top', key: 'side.rama.top' },
    { href: '#incluye', key: 'side.rama.incluye' },
    lista.length ? { href: '#trabajo', key: 'side.proyectos' } : null,
    { href: '#empieza', key: 'side.rama.empieza' },
    { href: '#siguiente', key: 'side.ecomm' },
  ].filter(Boolean);
  return (
    <>
      <Nav onCartClick={aQuedamos} />
      <SideMenu items={items} />
      <div className="scroll-content">
        <RamaCabecera r={r} p={p} i={i} />
        <RamaIncluye r={r} p={p} />
        <RamaTrabajo p={p} lista={lista} />
        <RamaEmpieza r={r} p={p} />
        <RamaCierre id={orden[i]} R={R} p={p} aQuedamos={aQuedamos} />
      </div>
      <Footer onCartClick={aQuedamos} />
      {typeof CookieConsent !== 'undefined' && <CookieConsent />}
      {typeof ChatGlobo !== 'undefined' && <ChatGlobo onCTA={aQuedamos} />}
    </>
  );
}

Object.assign(window, { Ramas, Cielo, ramaIr });

// Solo se monta en las páginas de rama (su <body> lleva data-rama); en la home monta app.jsx.
(function montarRama() {
  if (!document.body || !document.body.hasAttribute('data-rama')) return;
  ReactDOM.createRoot(document.getElementById('root')).render(<I18nProvider><RamaApp /></I18nProvider>);
})();
