/* global React, ReactDOM, useT, Nav, SideMenu, Footer, RevealText, useReveal, I18nProvider, CookieConsent */
// ============= PROYECTOS =============
// La sección "Selected Work" de la home (entre "Lo que hacemos" y "Cómo lo hacemos") y la página
// de cada proyecto (/proyectos/<slug>/, generada por build.mjs desde proyecto.html).
// Los datos viven en proyectos-data.jsx (window.PROYECTOS).
const { useState, useEffect, useRef } = React;

// En el prerender del build (jsdom) no se tocan vídeos ni medidas.
const PROY_BOT = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '');
const proyTexto = (p, lang) => p[lang] || p.es;
const proyNum = (n) => String(n).padStart(2, '0');
const proyAsset = (slug, f) => `assets/proyectos/${slug}/${f}`;

// Transición entre páginas: la misma cortina editorial del cambio de idioma, con el nombre del proyecto.
function proyIr(e, href, palabra, num) {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (e) e.preventDefault();
  const n = document.getElementById('langMarkNum');
  const w = document.getElementById('langMarkWord');
  if (n) n.textContent = num;
  if (w) w.textContent = palabra;
  document.body.classList.remove('lang-switched-in');
  document.body.classList.add('lang-switching');
  setTimeout(() => { window.location.href = href; }, 640);
}
// Al volver atrás, el navegador puede restaurar la página con la cortina puesta.
window.addEventListener('pageshow', (ev) => {
  if (ev.persisted) document.body.classList.remove('lang-switching', 'lang-switched-in');
});

// Vídeo que solo se descarga y reproduce cuando está a la vista.
function VideoVivo({ base, className, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || PROY_BOT) return undefined;
    v.muted = true;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (!v.getAttribute('src')) v.setAttribute('src', base + '.mp4');
          const pr = v.play();
          if (pr && pr.catch) pr.catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [base]);
  return <video ref={ref} className={className} muted loop playsInline preload="none" poster={base + '.jpg'} aria-label={label} />;
}

// ---------- Sección de la home ----------
function ProyectoTile({ p, i, vertical }) {
  const { t, lang } = useT();
  const d = proyTexto(p, lang);
  const base = proyAsset(p.slug, vertical ? 'movil' : 'escritorio');
  return (
    <a
      className={'ptile reveal' + (vertical ? ' ptile--v' : '')}
      style={{ '--orden': i }}
      href={`proyectos/${p.slug}/`}
      data-cursor="ver"
      data-cursor-label={t('proy.ver')}
      onClick={(e) => proyIr(e, e.currentTarget.href, p.nombre + '.', '(' + proyNum(i + 1) + ')')}>
      <span className={'ptile__media' + (vertical ? ' ptile__media--v' : '')}>
        {vertical
          ? <span className="ptile__movil"><VideoVivo base={base} className="ptile__video" label={p.nombre} /></span>
          : <VideoVivo base={base} className="ptile__video" label={p.nombre} />}
      </span>
      <span className="ptile__pie">
        <span className="ptile__num">({proyNum(i + 1)})</span>
        <h3 className="ptile__nombre">{p.nombre}</h3>
        <span className="ptile__meta">{d.corto} · {p.anio}</span>
        <span className="ptile__idea">{d.idea}</span>
      </span>
    </a>
  );
}

function Proyectos() {
  const { t } = useT();
  const lista = window.PROYECTOS || [];
  if (!lista.length) return null;
  const aQuedamos = () => {
    const el = document.getElementById('quedamos');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
  };
  // Dos columnas escalonadas: en la ancha, el recorrido de ordenador; en la estrecha, el del móvil.
  const colA = lista.map((p, i) => ({ p, i })).filter((x) => x.i % 2 === 0);
  const colB = lista.map((p, i) => ({ p, i })).filter((x) => x.i % 2 === 1);
  return (
    <section className="proyectos" id="proyectos" data-screen-label="Proyectos" data-nav-theme="dark">
      <header className="proyectos-cab">
        <h2 className="proyectos-titulo reveal">Selected Work<sup>({proyNum(lista.length)})</sup></h2>
        <div className="proyectos-intro reveal reveal-delay-1">
          <p className="proyectos-intro__lead">{t('proy.lead')}</p>
          <p className="proyectos-intro__body">{t('proy.body')}</p>
        </div>
      </header>
      <div className="proyectos-rejilla">
        <div className="proyectos-col proyectos-col--a">
          {colA.map(({ p, i }) => <ProyectoTile key={p.slug} p={p} i={i} vertical={false} />)}
        </div>
        <div className="proyectos-col proyectos-col--b">
          {colB.map(({ p, i }) => <ProyectoTile key={p.slug} p={p} i={i} vertical={true} />)}
          <div className="proyectos-cta reveal">
            <p className="proyectos-cta__txt">{t('proy.cta')}</p>
            <button type="button" className="qd-prompt__btn" onClick={aQuedamos} data-cursor="cta">[{t('proy.cta.btn')}]</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Página de un proyecto ----------
function CasoCabecera({ p, d, i, total }) {
  const { t } = useT();
  return (
    <header className="caso-cab" id="top" data-nav-theme="light">
      <div className="ww-bg" aria-hidden="true"></div>
      <div className="caso-cab__in">
        <div className="caso-cab__barra">
          <a className="caso-volver" href="./#proyectos" data-cursor="cta">← Selected Work</a>
          <span className="caso-cab__cuenta">({proyNum(i + 1)}/{proyNum(total)})</span>
        </div>
        <h1 className="caso-cab__titulo">{p.nombre}.</h1>
        <p className="caso-cab__idea">{d.idea}</p>
        <dl className="caso-cab__meta">
          <div>
            <dt><span>(01)</span> {t('caso.marca')}</dt>
            <dd>
              {p.nombre}
              {p.instagram ? <><br /><a href={p.instagram.url} target="_blank" rel="noopener" data-cursor="cta">{p.instagram.usuario} ↗</a></> : null}
            </dd>
          </div>
          <div><dt><span>(02)</span> {t('caso.sector')}</dt><dd>{d.sector}</dd></div>
          <div><dt><span>(03)</span> {t('caso.hicimos')}</dt><dd>{d.hicimos}</dd></div>
          <div><dt><span>(04)</span> {t('caso.anio')}</dt><dd>{p.anio}</dd></div>
        </dl>
      </div>
      <figure className="caso-cab__media reveal">
        <VideoVivo base={proyAsset(p.slug, 'escritorio')} className="caso-video" label={p.nombre} />
      </figure>
    </header>
  );
}

function CasoIdea({ d }) {
  const { t } = useT();
  return (
    <section className="caso-idea" id="idea" data-nav-theme="dark">
      <div className="caso-idea__grid">
        <div className="caso-idea__lado reveal">
          <p className="caso-idea__etq">{t('caso.partida')}</p>
          <p className="caso-idea__partida">{d.partida}</p>
        </div>
        <RevealText className="caso-idea__texto" paras={d.ideaTexto} />
      </div>
    </section>
  );
}

// Pantalla a pantalla: en ordenador la pista corre en horizontal mientras bajas; en el móvil se desliza.
function CasoMomentos({ p, d }) {
  const { t } = useT();
  const sec = useRef(null);
  const pista = useRef(null);
  const barra = useRef(null);
  const cuenta = useRef(null);
  const n = p.momentos.length;
  useEffect(() => {
    const s = sec.current;
    const tr = pista.current;
    if (!s || !tr || PROY_BOT) return undefined;
    let extra = 0;
    let raf = 0;
    let activo = -1;
    const esMovil = () => window.matchMedia('(max-width: 760px)').matches;
    const marcar = (k) => {
      if (k === activo || !cuenta.current) return;
      activo = k;
      cuenta.current.textContent = `${proyNum(k + 1)} / ${proyNum(n)}`;
    };
    const pintar = () => {
      raf = 0;
      if (esMovil()) {
        const hijos = tr.children;
        const centro = tr.scrollLeft + tr.clientWidth / 2;
        let k = 0;
        for (let j = 0; j < hijos.length; j++) {
          if (hijos[j].offsetLeft <= centro) k = j;
        }
        marcar(Math.min(n - 1, k));
        return;
      }
      const r = s.getBoundingClientRect();
      const prog = extra > 0 ? Math.min(1, Math.max(0, -r.top / extra)) : 0;
      tr.style.transform = `translate3d(${(-prog * extra).toFixed(1)}px,0,0)`;
      if (barra.current) barra.current.style.transform = `scaleX(${prog.toFixed(4)})`;
      marcar(Math.min(n - 1, Math.round(prog * (n - 1))));
    };
    const pedir = () => { if (!raf) raf = requestAnimationFrame(pintar); };
    const medir = () => {
      if (esMovil()) {
        s.style.height = '';
        tr.style.transform = '';
        extra = 0;
      } else {
        extra = Math.max(0, tr.scrollWidth - window.innerWidth);
        s.style.height = (window.innerHeight + extra) + 'px';
      }
      pedir();
    };
    medir();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', medir);
    tr.addEventListener('scroll', pedir, { passive: true });
    return () => {
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', medir);
      tr.removeEventListener('scroll', pedir);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);
  return (
    <section className="caso-momentos" id="pantallas" ref={sec} data-nav-theme="light">
      <div className="caso-momentos__pin">
        <header className="caso-momentos__cab">
          <h2 className="caso-momentos__titulo">{t('caso.pantallas')}</h2>
          <p className="caso-momentos__sub">{t('caso.pantallas.sub')}</p>
          <span className="caso-momentos__cuenta" ref={cuenta}>01 / {proyNum(n)}</span>
        </header>
        <div className="caso-momentos__pista" ref={pista}>
          {p.momentos.map((f, k) => {
            const m = d.momentos[k] || { t: '', d: '' };
            return (
              <figure className="caso-momento" key={f}>
                <img src={proyAsset(p.slug, f + '.jpg')} alt={m.t} width="1280" height="800" loading="lazy" decoding="async" />
                <figcaption>
                  <span className="caso-momento__num">{proyNum(k + 1)}</span>
                  <span className="caso-momento__t">{m.t}</span>
                  <span className="caso-momento__d">{m.d}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="caso-momentos__barra" aria-hidden="true"><span ref={barra}></span></div>
      </div>
    </section>
  );
}

function CasoPractico({ p, d }) {
  if (!p.practico || !d.practico) return null;
  return (
    <section className="caso-practico" data-nav-theme="light">
      <div className="caso-practico__texto reveal">
        <h2 className="caso-h2">{d.practico.t}</h2>
        <p className="caso-p">{d.practico.d}</p>
      </div>
      <figure className="caso-practico__foto reveal reveal-delay-1">
        <img src={proyAsset(p.slug, p.practico.foto + '.jpg')} alt={d.practico.t} width="1280" height="800" loading="lazy" decoding="async" />
      </figure>
    </section>
  );
}

function CasoMovil({ p, d }) {
  const { t } = useT();
  return (
    <section className="caso-movil" id="movil" data-nav-theme="dark">
      <div className="caso-movil__texto reveal">
        <h2 className="caso-h2">{t('caso.movil')}</h2>
        <p className="caso-p">{d.movil}</p>
      </div>
      <div className="caso-telefono reveal reveal-delay-1">
        <VideoVivo base={proyAsset(p.slug, 'movil')} className="caso-video" label={p.nombre} />
      </div>
    </section>
  );
}

function CasoOtra({ p, d }) {
  const { lang } = useT();
  const web = p.webs[1];
  return (
    <section className="caso-otra" data-nav-theme="light">
      <header className="caso-otra__cab">
        <div className="reveal">
          <h2 className="caso-h2">{d.otra.t}</h2>
          <p className="caso-otra__idea">{d.otra.idea}</p>
        </div>
        <p className="caso-p reveal reveal-delay-1">{d.otra.d}</p>
      </header>
      <div className="caso-otra__medios">
        <figure className="caso-otra__video reveal">
          <VideoVivo base={proyAsset(p.slug, p.otra.video)} className="caso-video" label={d.otra.idea} />
        </figure>
        <div className="caso-telefono caso-telefono--claro reveal reveal-delay-1">
          <VideoVivo base={proyAsset(p.slug, p.otra.movil)} className="caso-video" label={d.otra.idea} />
        </div>
      </div>
      <div className="caso-otra__fotos">
        {p.otra.fotos.map((f, k) => (
          <img key={f} className={'reveal reveal-delay-' + Math.min(4, k + 1)} src={proyAsset(p.slug, f + '.jpg')} alt="" width="1280" height="800" loading="lazy" decoding="async" />
        ))}
      </div>
      {web ? <a className="caso-enlace" href={web.url} target="_blank" rel="noopener" data-cursor="cta">{web[lang] || web.es} ↗</a> : null}
    </section>
  );
}

function CasoWeb({ p }) {
  const { t, lang } = useT();
  return (
    <section className="caso-web" data-nav-theme="light">
      <p className="caso-web__txt reveal">{t(p.webs.length > 1 ? 'caso.web.varias' : 'caso.web')}</p>
      <p className="caso-web__sub reveal">{t('caso.web.sub')}</p>
      <div className="caso-web__botones reveal">
        {p.webs.map((w) => (
          <a key={w.url} className="qd-prompt__btn" href={w.url} target="_blank" rel="noopener" data-cursor="cta">[{w[lang] || w.es}]</a>
        ))}
      </div>
    </section>
  );
}

function CasoSiguiente({ sig, n }) {
  const { t, lang } = useT();
  const d = proyTexto(sig, lang);
  return (
    <section className="caso-sig" id="siguiente" data-nav-theme="dark">
      <a
        className="caso-sig__enlace"
        href={`proyectos/${sig.slug}/`}
        data-cursor="ver"
        data-cursor-label={t('proy.ver')}
        onClick={(e) => proyIr(e, e.currentTarget.href, sig.nombre + '.', '(' + proyNum(n) + ')')}>
        <span className="caso-sig__etq">{t('caso.siguiente')}</span>
        <span className="caso-sig__nombre">{sig.nombre}.</span>
        <span className="caso-sig__idea">{d.idea}</span>
        <span className="caso-sig__img" style={{ '--img': `url('${proyAsset(sig.slug, 'escritorio.jpg')}')` }} aria-hidden="true"></span>
      </a>
    </section>
  );
}

function CasoApp() {
  const { lang } = useT();
  const lista = window.PROYECTOS || [];
  const slug = document.body.getAttribute('data-proyecto');
  const i = Math.max(0, lista.findIndex((x) => x.slug === slug));
  const p = lista[i];
  const d = proyTexto(p, lang);
  const sig = lista[(i + 1) % lista.length];
  useReveal();
  // Levanta la cortina con la que se llega (la pone el HTML antes de montar).
  useEffect(() => {
    const b = document.body;
    if (!b.classList.contains('lang-switching')) return undefined;
    const t1 = setTimeout(() => { b.classList.remove('lang-switching'); b.classList.add('lang-switched-in'); }, 380);
    const t2 = setTimeout(() => { b.classList.remove('lang-switched-in'); }, 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const aQuedamos = () => { window.location.href = new URL('#quedamos', document.baseURI).href; };
  const items = [
    { href: '#top', key: 'side.caso.top' },
    { href: '#idea', key: 'side.caso.idea' },
    { href: '#pantallas', key: 'side.caso.pantallas' },
    { href: '#movil', key: 'side.caso.movil' },
    { href: '#siguiente', key: 'side.caso.siguiente' },
  ];
  return (
    <>
      <Nav onCartClick={aQuedamos} />
      <SideMenu items={items} />
      <div className="scroll-content">
        <CasoCabecera p={p} d={d} i={i} total={lista.length} />
        <CasoIdea d={d} />
        <CasoMomentos p={p} d={d} />
        <CasoPractico p={p} d={d} />
        <CasoMovil p={p} d={d} />
        {p.otra && d.otra ? <CasoOtra p={p} d={d} /> : null}
        <CasoWeb p={p} />
        <CasoSiguiente sig={sig} n={((i + 1) % lista.length) + 1} />
      </div>
      <Footer onCartClick={aQuedamos} />
      {typeof CookieConsent !== 'undefined' && <CookieConsent />}
    </>
  );
}

// Solo se monta en las páginas de proyecto (su <body> lleva data-proyecto); en la home monta app.jsx.
(function montarCaso() {
  if (!document.body || !document.body.hasAttribute('data-proyecto')) return;
  ReactDOM.createRoot(document.getElementById('root')).render(<I18nProvider><CasoApp /></I18nProvider>);
})();
