/* global React, ReactDOM */
// ============================================================
//  LEGAL.JSX — Renderiza las páginas legales de adsPartners
//  Datos en window.LEGAL (legal-content.jsx)
//  La página activa se indica en <body data-legal-page="avisoLegal|privacidad|cookies">
// ============================================================
const { useState: useStateL, useEffect: useEffectL, useCallback: useCallbackL } = React;

const PAGE_FILES = {
  avisoLegal: 'aviso-legal.html',
  privacidad: 'privacidad.html',
  cookies: 'cookies.html',
};
const PAGE_ORDER = ['avisoLegal', 'privacidad', 'cookies'];

// split "Label: value" → ["Label", "value"]
function splitKV(s) {
  const i = (s || '').indexOf(':');
  if (i === -1) return [null, s];
  return [s.slice(0, i).trim(), s.slice(i + 1).trim()];
}
function isEmail(v) { return /@/.test(v) && !/\s/.test(v); }
function isWeb(v) { return /^www\.|^https?:\/\//i.test(v); }

function KVRow({ raw }) {
  const [k, v] = splitKV(raw);
  let valEl = v;
  if (v && isEmail(v)) valEl = <a className="lg-inline" href={'mailto:' + v}>{v}</a>;
  else if (v && isWeb(v)) {
    const href = v.startsWith('http') ? v : 'https://' + v;
    valEl = <a className="lg-inline" href={href} target="_blank" rel="noopener">{v}</a>;
  }
  return (
    <li>
      <span className="lg-k">{k}</span>
      <span className="lg-v">{valEl}</span>
    </li>
  );
}

function Table({ data }) {
  if (!data) return null;
  return (
    <div className="lg-tablewrap">
      <table className="lg-table">
        <thead>
          <tr>{data.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{ci === 0 ? <span className="lg-mono">{cell}</span> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- per-page section builders ----------
// each returns [{ id, heading, content }]

function avisoLegalSections(d) {
  return [
    { id: 'info', heading: d.infoGeneral.heading, content: (
      <>
        <p>{d.infoGeneral.intro}</p>
        <ul className="lg-data">
          {[d.infoGeneral.titular, d.infoGeneral.cif, d.infoGeneral.domicilio, d.infoGeneral.email, d.infoGeneral.registro, d.infoGeneral.web]
            .map((r, i) => <KVRow key={i} raw={r} />)}
        </ul>
      </>
    )},
    { id: 'objeto', heading: d.objeto.heading, content: <p>{d.objeto.body}</p> },
    { id: 'uso', heading: d.condicionesUso.heading, content: <p>{d.condicionesUso.body}</p> },
    { id: 'ip', heading: d.propiedadIntelectual.heading, content: (
      <><p>{d.propiedadIntelectual.body1}</p><p>{d.propiedadIntelectual.body2}</p></>
    )},
    { id: 'resp', heading: d.responsabilidad.heading, content: <p>{d.responsabilidad.body}</p> },
    { id: 'links', heading: d.enlaces.heading, content: <p>{d.enlaces.body}</p> },
    { id: 'ley', heading: d.legislacion.heading, content: <p>{d.legislacion.body}</p> },
  ];
}

function privacidadSections(d) {
  return [
    { id: 'resp', heading: d.responsable.heading, content: (
      <ul className="lg-data">
        {[d.responsable.responsable, d.responsable.cif, d.responsable.domicilio, d.responsable.email, d.responsable.web]
          .map((r, i) => <KVRow key={i} raw={r} />)}
      </ul>
    )},
    { id: 'fines', heading: d.finalidades.heading, content: (
      <>
        <p>{d.finalidades.intro}</p>
        <ul className="lg-list">{d.finalidades.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </>
    )},
    { id: 'base', heading: d.baseLegal.heading, content: (
      <ul className="lg-list">{d.baseLegal.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    )},
    { id: 'cons', heading: d.conservacion.heading, content: <p>{d.conservacion.body}</p> },
    { id: 'dest', heading: d.destinatarios.heading, content: (
      <><p>{d.destinatarios.body1}</p><p>{d.destinatarios.body2}</p></>
    )},
    { id: 'derechos', heading: d.derechos.heading, content: (
      <>
        <p>{d.derechos.intro}</p>
        <ul className="lg-list">{d.derechos.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
        <p>{d.derechos.ejercicio}</p>
        <p>{d.derechos.reclamacion}</p>
      </>
    )},
    { id: 'seg', heading: d.seguridad.heading, content: <p>{d.seguridad.body}</p> },
  ];
}

function cookiesSections(d, footer, openSettings) {
  return [
    { id: 'que', heading: d.queSon.heading, content: <p>{d.queSon.body}</p> },
    { id: 'tipos', heading: d.tipos.heading, content: (
      <>
        <h3>{d.tipos.entidad}</h3>
        <ul className="lg-list">{d.tipos.entidadItems.map((x, i) => <li key={i}>{x}</li>)}</ul>
        <h3>{d.tipos.finalidad}</h3>
        <Table data={d.tipos.tabla} />
      </>
    )},
    { id: 'listado', heading: d.listado.heading, content: <Table data={d.listado.tabla} /> },
    { id: 'gestion', heading: d.gestion.heading, content: (
      <>
        <p>{d.gestion.body1}</p>
        <button className="lg-config-btn" onClick={openSettings} type="button">
          ⚙ {footer.configurarCookies}
        </button>
        <p style={{ marginTop: '20px' }}>{d.gestion.body2}</p>
        <ul className="lg-list">{d.gestion.navegadores.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </>
    )},
    { id: 'transf', heading: d.transferencias.heading, content: <p>{d.transferencias.body}</p> },
  ];
}

// ---------- shell ----------
function LegalPage({ page }) {
  const [lang, setLang] = useStateL(() => {
    try { return localStorage.getItem('ads_lang') || 'es'; } catch (e) { return 'es'; }
  });
  const [fading, setFading] = useStateL(false);

  const L = (window.LEGAL[lang] || window.LEGAL.es).legal;
  const footer = L.footer;
  const d = L[page];

  useEffectL(() => {
    document.documentElement.lang = lang;
    document.title = d.title + ' · adsPartners®';
  }, [lang, d.title]);

  const swapLang = (next) => {
    if (next === lang) return;
    setFading(true);
    setTimeout(() => {
      setLang(next);
      try { localStorage.setItem('ads_lang', next); } catch (e) {}
      setTimeout(() => setFading(false), 30);
    }, 280);
  };

  const openSettings = () => {
    // banner lives on the homepage; jump there with the settings hash
    window.location.href = 'index.html#configurar-cookies';
  };

  let sections;
  if (page === 'avisoLegal') sections = avisoLegalSections(d);
  else if (page === 'privacidad') sections = privacidadSections(d);
  else sections = cookiesSections(d, footer, openSettings);

  const docLabel = (k) => footer[k];

  return (
    <div className="legal-root">
      {/* TOP BAR */}
      <header className="lg-top">
        <a className="lg-back" href="index.html" aria-label="adsPartners">
          <span className="lg-arrow">←</span>
          <img src="assets/logos/logotipo_marron.svg" alt="adsPartners" />
        </a>
        <div className="lg-top-right">
          <nav className="lg-docnav" aria-label={lang === 'en' ? 'Legal documents' : 'Documentos legales'}>
            {PAGE_ORDER.map((k) => (
              <a key={k} href={PAGE_FILES[k]} className={k === page ? 'is-current' : ''}>
                {docLabel(k)}
              </a>
            ))}
          </nav>
          <div className="lg-lang" role="group" aria-label="Language">
            <button className={lang === 'es' ? 'is-active' : ''} onClick={() => swapLang('es')} type="button">ES</button>
            <button className={lang === 'en' ? 'is-active' : ''} onClick={() => swapLang('en')} type="button">EN</button>
          </div>
        </div>
      </header>

      {/* DOC */}
      <main className={'lg-main lg-fade' + (fading ? ' is-out' : '')}>
        <div className="lg-wrap">
          <aside className="lg-aside">
            <div className="lg-eyebrow"><span className="lg-dot"></span>{lang === 'en' ? 'Legal' : 'Legal'} · adsPartners®</div>
            <h1 className="lg-h1">{d.title}</h1>
            <ul className="lg-toc">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={'#' + s.id}>
                    <span className="lg-toc-n">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s.heading}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="lg-updated">
              ALDASE SOCIOS GP S.L.<br />
              {lang === 'en' ? 'Last updated' : 'Última actualización'}: 06 · 2026
            </p>
          </aside>

          <article className="lg-doc">
            {sections.map((s, i) => (
              <section className="lg-sec" id={s.id} key={s.id}>
                <h2><span className="lg-sec-n">{String(i + 1).padStart(2, '0')}</span>{s.heading}</h2>
                {s.content}
              </section>
            ))}
          </article>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="lg-foot">
        <span>© {new Date().getFullYear()} adsPartners® · ALDASE SOCIOS GP S.L.</span>
        <nav className="lg-foot-links">
          {PAGE_ORDER.map((k) => <a key={k} href={PAGE_FILES[k]}>{docLabel(k)}</a>)}
          <a href="index.html#configurar-cookies">{footer.configurarCookies}</a>
        </nav>
      </footer>
    </div>
  );
}

(function mountLegal() {
  const page = document.body.getAttribute('data-legal-page') || 'avisoLegal';
  ReactDOM.createRoot(document.getElementById('root')).render(<LegalPage page={page} />);
})();
