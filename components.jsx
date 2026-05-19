/* global React, useT, THtml */
const { useState, useEffect, useRef } = React;

// ============= REVEAL HOOK =============
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ============= LANG TOGGLE =============
function LangToggle() {
  const { lang, setLang, transitioning } = useT();
  const next = lang === 'es' ? 'en' : 'es';
  return (
    <button
      className="nav-lang"
      onClick={() => setLang(next)}
      aria-label="Change language"
      data-cursor="cta"
      disabled={transitioning}>
      
      {next.toUpperCase()}
    </button>);

}

// ============= NAV =============
function Nav({ cartCount, onCartClick }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText('adsgroup@ads-partners.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <nav className="nav">
      <a className="nav-block nav-logo-block" href="#top" aria-label="adsPartners">
        <img className="nav-logo" src="assets/logos/logotipo_blanco.svg" alt="adsPartners" />
      </a>
      <div className="nav-block nav-tag">
        <span><em>{t('nav.tag.creative')}</em></span>
        <span>{t('nav.tag.studio')}</span>
      </div>
      <div className="nav-block nav-contact">
        <a href="#" onClick={handleCopyEmail} className="nav-mail" data-cursor="cta">
          <span className="nav-mail-default">adsgroup@ads-partners.com</span>
          <span className="nav-mail-copied">{copied ? t('nav.mail.copied') : t('nav.mail.copy')}</span>
        </a>
        <span>{t('nav.based')}</span>
      </div>
      <div className="nav-block nav-cta-group">
        <LangToggle />
        <button className="nav-cart" onClick={onCartClick} data-cursor="cta">
          <span className="nav-cart-text nav-cart-default">
            <span className="nav-cart-dot" aria-hidden="true"></span>
            {t('nav.cart.default')}
          </span>
          <span className="nav-cart-text nav-cart-hover">{t('nav.cart.hover')}</span>
        </button>
      </div>
    </nav>);

}

// ============= SIDE MENU =============
function SideMenu({ onCartClick }) {
  const { t } = useT();
  const items = [
  { href: '#manifiesto', key: 'side.manifesto' },
  { href: '#clientes', key: 'side.cases' },
  { href: '#equipo', key: 'side.team' },
  { href: '#growth', key: 'side.studio' },
  { href: '#trabajo', key: 'side.work' },
  { href: '#contacto', key: 'side.ecomm' },
  { href: '#faqs', key: 'side.faqs' }];


  const [active, setActive] = useState(-1);
  useEffect(() => {
    const onScroll = () => {
      const sections = items.map((it) => document.querySelector(it.href));
      const mid = window.innerHeight / 2;
      let idx = -1;
      sections.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        if (r.top <= mid) idx = i;
      });
      setActive(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleClick = (e, href) => {
    if (href === '#contacto') {
      e.preventDefault();
      onCartClick();
    }
  };
  return (
    <aside className="side-menu" aria-label={t('side.aria')}>
      <ul className="side-menu-list">
        {items.map((it, i) =>
        <li key={it.href} className={`side-menu-item ${i === active ? 'active' : ''}`}>
            <a href={it.href} onClick={(e) => handleClick(e, it.href)} data-cursor="cta" style={{ padding: "0px 0px 0px 4px" }}>
              <span className="side-menu-dots"></span>
              <span className="side-menu-text">{t(it.key)}</span>
            </a>
          </li>
        )}
      </ul>
    </aside>);

}

// ============= HERO =============
function Hero() {
  const { t, lang } = useT();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  const timeStr = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });

  return (
    <header className="hero" id="top" data-screen-label="Hero" data-nav-theme="dark" style={{ padding: "116.8px 40px 82.3998px" }}>
      <div className="hero-grain"></div>
      <div className="hero-meta" style={{ padding: "0px" }}>
        <span><span className="dot"></span> {t('hero.meta.location')} · {timeStr} CET</span>
        <span>{t('hero.meta.brand')}</span>
        <span>{t('hero.meta.studio')}</span>
      </div>
      <h1 className="hero-title" style={{ padding: "45.6001px 0px 0px" }}>
        <span className="hero-creative">{t('hero.stamp.creative')}</span>
        <span className="hero-growthstudio">{t('hero.stamp.growth')} {t('hero.stamp.studioword')}</span>
      </h1>
      <div className="hero-foot">
        <p className="hero-tagline">
          <span className="tag-part">{t('hero.tagline.part1')}</span>{' '}
          <span className="tag-part">{t('hero.tagline.part2')}</span>
        </p>
        <div className="hero-stamp">
          <strong>{t('hero.stamp.notforeveryone')}</strong>
          {t('hero.stamp.available')}
        </div>
      </div>
    </header>);

}

// ============= MARQUEE =============
function Marquee({ items }) {
  const content =
  <span>
      {items.map((it, i) =>
    <React.Fragment key={i}>
          {it}<span className="sep"></span>
        </React.Fragment>
    )}
    </span>;

  return (
    <div className="marquee" aria-hidden="true" data-nav-theme="dark">
      <div className="marquee-track">
        {content}{content}
      </div>
    </div>);

}

// ============= MANIFIESTO =============
function Manifiesto() {
  const { t, lang } = useT();
  const textRef = React.useRef(null);

  const p1 = t('mani.p1');
  const p2 = t('mani.p2');
  const splitWords = (s) => s.split(/(\s+)/);

  React.useEffect(() => {
    const container = textRef.current;
    if (!container) return;
    const wordEls = container.querySelectorAll('.mani-word');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const fullBrightAt = vh * 0.58;
        const dimAt = vh * 0.95;
        wordEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          let p;
          if (center <= fullBrightAt) p = 1;else
          if (center >= dimAt) p = 0;else
          p = 1 - (center - fullBrightAt) / (dimAt - fullBrightAt);
          el.style.opacity = (0.18 + 0.82 * p).toFixed(3);
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [p1, p2]);

  const renderPara = (text, key) =>
  <p key={key} className="manifesto-text">
      {splitWords(text).map((w, i) =>
    /\s+/.test(w) ?
    <React.Fragment key={i}>{w}</React.Fragment> :
    <span key={i} className="mani-word">{w}</span>
    )}
    </p>;

  return (
    <section className="section manifesto" id="manifiesto" data-screen-label="Manifiesto" data-nav-theme="dark">
      <div className="manifesto-grid">
        <figure className="manifesto-photo manifesto-photo--duo">
          <div className="manifesto-pol manifesto-pol--1">
            <img src="assets/team/manifesto-1.jpeg" alt={t('mani.poladroid.alt')} />
          </div>
          <div className="manifesto-pol manifesto-pol--2">
            <img src="assets/team/manifesto-2.jpeg" alt="" />
            <figcaption>
              <span>[ADSPARTNERS]</span>
              <span>2025</span>
            </figcaption>
          </div>
        </figure>
        <div className="manifesto-text-wrap" ref={textRef}>
          {renderPara(p1, 'p1')}
          {renderPara(p2, 'p2')}
        </div>
      </div>
    </section>);

}

// ============= FAQS =============
function FAQs() {
  const { t } = useT();
  const [open, setOpen] = useState(-1);
  const faqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({ q: t(`faq.${i}.q`), a: t(`faq.${i}.a`) }));

  return (
    <section className="section faqs" id="faqs" data-screen-label="FAQs" data-nav-theme="light">
      <div className="section-label">
        <span className="num">{t('faqs.num')}</span>
        <span className="line"></span>
        <span>{t('faqs.label')}</span>
      </div>
      <div className="faqs-grid">
        <h2 className="faqs-title reveal">
          <span dangerouslySetInnerHTML={{ __html: t('faqs.title.1.html') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('faqs.title.2.html') }} />
        </h2>
        <ul className="faqs-list reveal reveal-delay-1">
          {faqs.map((f, i) =>
          <li key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} data-cursor="cta">
                <span className="faq-q-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq-q-text">{f.q}</span>
                <span className="faq-q-icon">{open === i ? '−' : '+'}</span>
              </button>
              <div className="faq-a"><p><span className="faq-a-inner">{f.a}</span></p></div>
            </li>
          )}
        </ul>
      </div>
    </section>);

}

// ============= SERVICES =============
function StudioPanel({ studio, onHover }) {
  const { t } = useT();
  const code = t(`srv.${studio}.code`);
  const items = [1, 2, 3, 4].map((n) => ({
    num: String(n).padStart(2, '0'),
    name: t(`srv.${studio}.${n}.name`),
    desc: t(`srv.${studio}.${n}.desc`),
    line: t(`srv.${studio}.${n}.line`)
  }));
  const [active, setActive] = useState(-1);
  const [hovering, setHovering] = useState(false);

  const detail = active >= 0 ? items[active] : null;

  return (
    <article
      className={`studio-panel studio-panel--${studio} ${hovering ? 'is-hovering' : ''}`}
      onMouseEnter={() => {setHovering(true);onHover && onHover(studio);}}
      onMouseLeave={() => {setHovering(false);setActive(-1);onHover && onHover(null);}}>

      <header className="studio-head">
        <span className="studio-code">{code} / STUDIO</span>
        <h3 className="studio-name">{t(`srv.${studio}.name`)}</h3>
        <p className="studio-line">{t(`srv.${studio}.line`)}</p>
      </header>

      <ul className="studio-list">
        {items.map((it, i) =>
        <li
          key={it.num}
          className={`studio-item ${active === i ? 'is-active' : ''}`}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          tabIndex={0}
          data-cursor="cta">

            <span className="studio-item__code">{code}.{it.num}</span>
            <span className="studio-item__name">{it.name}</span>
            <span className="studio-item__arrow" aria-hidden="true">↗</span>
          </li>
        )}
      </ul>

      <footer className="studio-foot">
        <p className={`studio-detail ${detail ? 'is-visible' : ''}`}>
          {detail ? detail.desc : ''}
        </p>
        <p className={`studio-tagline ${detail ? '' : 'is-visible'}`}>
          {t(`srv.${studio}.tagline`)}
        </p>
        <p className={`studio-pull ${detail ? 'is-visible' : ''}`}>
          {detail ? `“${detail.line}”` : ''}
        </p>
      </footer>
    </article>);

}

function Services() {
  const { t } = useT();
  const [hoverStudio, setHoverStudio] = useState(null);
  return (
    <section
      className={`section services ${hoverStudio ? 'is-hovering' : ''}`}
      id="growth" data-screen-label="Services" data-nav-theme="dark">

      <div className="services-bg" aria-hidden="true">
        <div
          className={`services-bg-img ${hoverStudio === 'gs' ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(assets/services/growth-studio-bg.png)` }} />
        <div
          className={`services-bg-img ${hoverStudio === 'bs' ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(assets/services/brand-studio-bg.png)` }} />
        <div className="services-bg-veil"></div>
      </div>

      <div className="services-header">
        <h2 className="services-title reveal">
          {t('srv.title.line1')} <span dangerouslySetInnerHTML={{ __html: t('srv.title.line2.html') }} />
        </h2>
        <p className="services-kicker reveal">{t('srv.kicker')}</p>
        <p className="services-intro reveal reveal-delay-1">
          {t('srv.intro')}
        </p>
      </div>
      <div className="studios-grid reveal">
        <StudioPanel studio="gs" onHover={setHoverStudio} />
        <StudioPanel studio="bs" onHover={setHoverStudio} />
      </div>
    </section>);

}

// ============= TEAM =============
// (Team component is now defined in team-section.jsx)

// ============= WORK MODEL — THE WIN-WIN METHOD =============
function WorkModel() {
  const { t } = useT();
  return (
    <section className="win-win-wrap" id="trabajo" data-screen-label="Modelo" data-nav-theme="dark">
      <div className="ww-grain" aria-hidden="true"></div>
      <div className="ww-inner">

        {/* MASTHEAD */}
        <header className="ww-masthead reveal" style={{ margin: "0px 0px 110.4px" }}>
          <h2 className="ww-title">
            Win<span className="ww-title__slash" style={{ width: "10px", padding: "0px 0px 0px 3.20007px", fontSize: "70px" }}>-</span>Win <em>Method.</em>
          </h2>
          <div className="ww-masthead__side">
            <p
              className="ww-lede"
              dangerouslySetInnerHTML={{ __html: t('work.lede.html') }} />
            
          </div>
        </header>

        {/* TWO BLOCKS */}
        <div className="ww-blocks">
          {/* BLOCK 01 */}
          <article className="ww-block reveal">
            <header className="ww-block__head">
              <span className="ww-block__num">{t('work.b1.num')}</span>
              <span className="ww-block__rule"></span>
              <h3 className="ww-block__title">{t('work.b1.title')}</h3>
            </header>

            <div className="ww-figure">
              <div className="ww-figure__value" style={{ fontSize: "100px", padding: "10px 0px 20px" }}>{t('work.b1.figure')}</div>
              <div className="ww-figure__label">{t('work.b1.figure.label')}</div>
            </div>

            <p className="ww-block__body">{t('work.b1.body').split('\n\n').map((para, i) =>
              <React.Fragment key={i}>{i > 0 ? <><br /><br /></> : null}{para}</React.Fragment>
              )}</p>
          </article>

          {/* BLOCK 02 */}
          <article className="ww-block ww-block--alt reveal reveal-delay-2">
            <header className="ww-block__head">
              <span className="ww-block__num">{t('work.b2.num')}</span>
              <span className="ww-block__rule"></span>
              <h3 className="ww-block__title">{t('work.b2.title')}</h3>
            </header>

            <div className="ww-figure">
              <div className="ww-figure__value ww-figure__value--alt" style={{ fontSize: "100px", padding: "10px 0px 20px" }}>{t('work.b2.figure.v')}</div>
              <div className="ww-figure__label">{t('work.b2.figure.label')}</div>
            </div>

            <p className="ww-block__body">{t('work.b2.body').split('\n\n').map((para, i) =>
              <React.Fragment key={i}>{i > 0 ? <><br /><br /></> : null}{para}</React.Fragment>
              )}</p>
          </article>
        </div>

        {/* CLOSING LINE */}
        <div className="ww-close reveal">
          <span className="ww-close__rule" aria-hidden="true"></span>
          <p className="ww-close__text">
            <span className="ww-close__line">{t('work.pull.line1')}</span>
            <span
              className="ww-close__line ww-close__line--accent"
              dangerouslySetInnerHTML={{ __html: t('work.pull.line2.html') }} />
            
          </p>
        </div>

      </div>
    </section>);

}

// ============= CLIENTS =============
function Clients() {
  const { t } = useT();
  const clients = [
  { id: 'aqva', letter: 'a.', name: t('cli.aqva.name'), img: 'assets/clients/aqva.png', tags: t('cli.aqva.tags'), desc: t('cli.aqva.desc') },
  { id: 'inversalia', letter: 'b.', name: t('cli.inversalia.name'), img: 'assets/clients/inversalia.png', tags: t('cli.inversalia.tags'), desc: t('cli.inversalia.desc') },
  { id: 'sapphira', letter: 'c.', name: t('cli.sapphira.name'), img: 'assets/clients/sapphira.png', tags: t('cli.sapphira.tags'), desc: t('cli.sapphira.desc') },
  { id: 'klink', letter: 'd.', name: t('cli.klink.name'), img: 'assets/clients/klink.png', tags: t('cli.klink.tags'), desc: t('cli.klink.desc') },
  { id: 'inverstone', letter: 'e.', name: t('cli.inverstone.name'), img: 'assets/clients/inverstone.png', tags: t('cli.inverstone.tags'), desc: t('cli.inverstone.desc') }];


  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const current = clients[active];

  return (
    <section
      className={`section clients ${hovering ? 'is-hovering' : ''}`}
      id="clientes"
      data-screen-label="Clientes"
      data-nav-theme="dark" style={{ padding: "18.8px 40px 180px 90px" }}>
      
      <div className="clients-bg" aria-hidden="true">
        {clients.map((c, i) =>
        <div
          key={c.id}
          className={`clients-bg-img ${hovering && i === active ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${c.img})` }} />

        )}
        <div className="clients-bg-veil"></div>
      </div>

      <div className="clients-topbar" style={{ margin: "15.2px 0px 320px" }}>
        <a href="#clientes" className="clients-topbar-label" data-cursor="cta">
          <span className="ctl-bracket ctl-bracket-l">&lt;</span>
          <span className="ctl-text">
            <span className="ctl-default">{t('cli.topbar')}</span>
            <span className="ctl-hover">{t('cli.topbar.hover')}</span>
          </span>
          <span className="ctl-bracket ctl-bracket-r">&gt;</span>
        </a>
      </div>

      <div className="clients-stage">
        <div
          className="clients-cards"
          onMouseLeave={() => setHovering(false)}
          onBlur={() => setHovering(false)}>
          
          {clients.map((c, i) =>
          <button
            key={c.id}
            type="button"
            className={`cli-card ${hovering && i === active ? 'is-active' : ''}`}
            style={{ '--cli-bg': `url(${c.img})` }}
            onMouseEnter={() => {setActive(i);setHovering(true);}}
            onFocus={() => {setActive(i);setHovering(true);}}
            data-cursor="cta"
            aria-label={c.name}>
            
              <span className="cli-card__name">{c.name}</span>
              <span className="cli-card__active">
                <span className="cli-card__active-dot" aria-hidden="true"></span>
                {t('cli.active')}
              </span>
              <span className="cli-card__tags">
                {c.tags.split('\n').map((tag) =>
              <span key={tag}>{tag}</span>
              )}
              </span>
            </button>
          )}
        </div>

        <div className="clients-copy-wrap">
          <aside className={`clients-copy ${hovering ? 'is-visible' : ''}`}>
            {current.desc.split('\n\n').map((para, idx) =>
            <p key={idx}>{para.split(/\.\s+/).map((sentence, i, arr) =>
              <React.Fragment key={i}>{sentence}{i < arr.length - 1 ? '. ' : ''}</React.Fragment>
              )}</p>
            )}
          </aside>
          <aside className={`clients-copy clients-copy-default ${hovering ? '' : 'is-visible'}`}>
            <p className="clients-copy-brand">adsPartners<sup>®</sup></p>
            <p>{t('clients.default.p1')}</p>
            <p>{t('clients.default.p2')}</p>
            <p>{t('clients.default.p3')}</p>
          </aside>
        </div>
      </div>
    </section>);

}

// ============= FOOTER =============
function Footer({ onCartClick }) {
  const { t } = useT();
  return (
    <footer className="foot" data-screen-label="Footer" data-nav-theme="dark">
      <div className="foot__top">
        <div className="foot__col">
          <h4>{t('foot.tag.k')}</h4>
          <p className="foot__tag">{t('foot.tag.d')}</p>
        </div>
        <div className="foot__col">
          <h4>{t('foot.nav')}</h4>
          <ul>
            <li><a href="#manifiesto">{t('nav.studio')}</a></li>
            <li><a href="#growth">{t('nav.services')}</a></li>
            <li><a href="#trabajo">{t('nav.method')}</a></li>
            <li><a href="#equipo">{t('nav.team')}</a></li>
            <li><a href="#faqs">FAQ</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h4>{t('foot.contact')}</h4>
          <ul>
            <li><a href="mailto:adsgroup@ads-partners.com">adsgroup@ads-partners.com</a></li>
            <li><a href="https://wa.me/34633565840" target="_blank" rel="noopener">+34 633 56 58 40</a></li>
            <li><a href="#contacto" onClick={(e) => { e.preventDefault(); onCartClick && onCartClick(); }} data-cursor="cta">{t('foot.col4.cta')}</a></li>
            <li><span>ads-partners.com</span></li>
          </ul>
        </div>
        <div className="foot__col">
          <h4>{t('foot.social')}</h4>
          <ul>
            <li><a href="https://instagram.com/adspartners.co" target="_blank" rel="noopener">Instagram ↗</a></li>
            <li><a href="https://tiktok.com/@adspartners.co" target="_blank" rel="noopener">TikTok ↗</a></li>
            <li><a href="#" target="_blank" rel="noopener">LinkedIn ↗</a></li>
          </ul>
        </div>
      </div>

      <a href="#hero" className="foot__logo" aria-label="adsPartners">
        <img src="assets/logos/imagotipo_beige.svg" alt="adsPartners" />
      </a>

      <div className="foot__bottom">
        <span className="small">{t('foot.bot.left')}</span>
        <span className="small" style={{ opacity: .45, letterSpacing: '.18em' }}>{t('foot.bot.center')}</span>
        <span className="small"><a href="#">Aviso</a> · <a href="#">Privacidad</a> · <a href="#">Cookies</a></span>
      </div>
    </footer>);

}

Object.assign(window, { Nav, SideMenu, Hero, Marquee, Manifiesto, Services, StudioPanel, WorkModel, Clients, FAQs, Footer, useReveal });