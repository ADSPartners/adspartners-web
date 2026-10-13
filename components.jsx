/* global React, useT */
const { useState, useEffect, useRef } = React;

// ============= LEAD CAPTURE · n8n =============
// Pega aquí la "Production URL" del nodo Webhook de n8n.
// Mientras esté vacío, el formulario sigue funcionando por correo (mailto),
// así que la web funciona aunque todavía no hayas conectado la automatización.
// Cuando lo pegues, el formulario hará POST de un JSON con todos los datos del lead.
// (Ver README → "Conexión con n8n" para la estructura del JSON y el tema CORS.)
const N8N_WEBHOOK_URL = 'https://n8n.ads-partners.com/webhook/ads-carta';
// Newsletter del footer → guarda el email en el Excel de leads (hoja "Newsletter").
const N8N_NEWSLETTER_URL = 'https://n8n.ads-partners.com/webhook/ads-newsletter';

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

  // ---- Subtle parallax (depth on scroll, no scroll hijacking) ----
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 760px)').matches;
    if (reduce || narrow) return;
    const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!nodes.length) return;
    const items = nodes.map((el) => ({ el, speed: parseFloat(el.getAttribute('data-parallax')) || 0.1 }));
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      items.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const delta = center - vh / 2;
        el.style.transform = `translate3d(0, ${(-delta * speed).toFixed(1)}px, 0)`;
      });
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
function Nav({ onCartClick }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const probeY = 28; // sample just under the top edge, where the nav sits
    const onScroll = () => {
      const themed = document.querySelectorAll('[data-nav-theme]');
      let current = 'dark';
      themed.forEach((el) => {
        if (el.classList.contains('foot')) return; // fixed footer handled below
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) current = el.getAttribute('data-nav-bar-theme') || el.getAttribute('data-nav-theme') || current;
      });
      // Footer reveal: once the scrolling content lifts above the probe, use footer theme
      const sc = document.querySelector('.scroll-content');
      const foot = document.querySelector('.foot');
      if (sc && foot && sc.getBoundingClientRect().bottom <= probeY) {
        current = foot.getAttribute('data-nav-bar-theme') || foot.getAttribute('data-nav-theme') || current;
      }
      setTheme(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText('adsgroup@ads-partners.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <nav className={`nav nav--${theme}`}>
      <a className="nav-block nav-logo-block" href="#top" aria-label="adsPartners">
        <span className="nav-logo" role="img" aria-label="adsPartners"></span>
      </a>
      <div className="nav-block nav-tag">
        <span>{t('nav.tag.1')}</span>
        <span>{t('nav.tag.2')}</span>
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
            {t('nav.cart.default')}
          </span>
          <span className="nav-cart-text nav-cart-hover">{t('nav.cart.hover')}</span>
        </button>
      </div>
    </nav>);

}

// ============= SIDE MENU =============
function SideMenu({ items: itemsProp }) {
  const { t } = useT();
  const items = itemsProp || [
  { href: '#partida', key: 'side.partida' },
  { href: '#ramas', key: 'side.ramas' },
  { href: '#diagnostico', key: 'side.diagnostico' },
  { href: '#recorrido', key: 'side.recorrido' },
  { href: '#proyectos', key: 'side.proyectos' },
  { href: '#cerca', key: 'side.cerca' },
  { href: '#quedamos', key: 'side.ecomm' }];


  const [active, setActive] = useState(-1);
  const [theme, setTheme] = useState('dark');
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

      // Detect the background theme of whatever section sits under the menu's
      // vertical centre, so the menu can use exact corporate colours.
      const themed = document.querySelectorAll('[data-nav-theme]');
      let current = 'dark';
      themed.forEach((el) => {
        if (el.classList.contains('foot')) return; // fixed footer handled below
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = el.getAttribute('data-nav-theme') || current;
      });
      const sc = document.querySelector('.scroll-content');
      const foot = document.querySelector('.foot');
      if (sc && foot && sc.getBoundingClientRect().bottom <= mid) {
        current = foot.getAttribute('data-nav-theme') || current;
      }
      setTheme(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <aside className={`side-menu side-menu--${theme}`} aria-label={t('side.aria')}>
      <ul className="side-menu-list">
        {items.map((it, i) =>
        <li key={it.href} className={`side-menu-item ${i === active ? 'active' : ''}`}>
            <a href={it.href} data-cursor="cta" style={{ padding: "0px 0px 0px 4px" }} onClick={(e) => {
              // Scroll dentro de la página: las de proyecto llevan <base>, y un "#ancla" iría a la home.
              const el = document.querySelector(it.href);
              if (!el) return;
              e.preventDefault();
              window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
            }}>
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

  return (
    <header className="hero" id="top" data-screen-label="Hero" data-nav-theme="dark" data-nav-bar-theme="light" style={{ padding: "140px 65px 15vw" }}>
      <div className="hero-grain"></div>
      <div className="hero-intro">
        <p className="hero-eyebrow">{t('hero.etq')}</p>
        <h1 className="hero-titulo">
          {t('hero.titulo').split(' ').map((w, i) =>
          <React.Fragment key={i}><span><i style={{ '--i': i }}>{w}</i></span>{' '}</React.Fragment>
          )}
        </h1>
        <p className="hero-tagline">{t('hero.sub')}</p>
      </div>
      <div className="hero-foot">
        <p className="hero-tagline-sub">{t('hero.pie.izq')}</p>
        <div className="hero-stamp">
          <strong>{t('hero.pie.der')}</strong>
        </div>
      </div>
      <img className="hero-wordmark" src="assets/logos/logotipo_beige.svg" alt="adsPartners" aria-hidden="true" data-parallax="0.05" />
    </header>);

}

// ============= QUEDAMOS =============
function MadridClock({ lang }) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => {
      const t = new Intl.DateTimeFormat('es-ES', {
        timeZone: 'Europe/Madrid',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
      setNow(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="qd-clock__inner">
      <span className="qd-clock__dot" aria-hidden="true"></span>
      {now} <span className="qd-clock__zone">{lang === 'en' ? 'Madrid, Spain' : 'Madrid, España'}</span>
    </span>);

}

function QdInput({ value, onChange, placeholder, required }) {
  const ref = React.useRef(null);
  // contenteditable inline: fluye con el texto de la carta y envuelve a 2 líneas
  // si hace falta (en móvil) sin recortar el placeholder. En escritorio, al ser
  // el contenedor ancho, se mantiene en una sola línea (idéntico a antes).
  React.useEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== (value || '')) el.textContent = value || '';
  }, [value]);
  const ph = required ? placeholder + ' *' : placeholder;
  return (
    <span className="qd-field">
      <span className="qd-bracket" aria-hidden="true">[</span>
      <span
        ref={ref}
        className={'qd-input qd-input--ce' + (required && !value ? ' is-req' : '')}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        data-ph={ph}
        aria-label={ph}
        data-cursor="text"
        onInput={(e) => onChange(e.currentTarget.textContent)} />
      <span className="qd-bracket" aria-hidden="true">]</span>
    </span>);

}

function QdDate({ value, onClick, placeholder, required }) {
  const ph = required ? placeholder + ' *' : placeholder;
  return (
    <button type="button" className="qd-field qd-datebtn" onClick={onClick} data-cursor="cta">
      <span className="qd-bracket" aria-hidden="true">[</span>
      <span className={value ? 'qd-dateval' : 'qd-dateph'}>{value || ph}</span>
      <span className="qd-bracket" aria-hidden="true">]</span>
    </button>);

}

// ============= QUEDAMOS — CALENDAR PICKER =============
// Lun–Sáb, mañanas 10:00–15:00 en intervalos de 1h. Solo rellena el campo
// FECHA Y HORA de la carta (no reserva nada por sí mismo).
function QdCalendar({ lang, value, onConfirm, onClose }) {
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  const SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00'];
  const today = React.useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [day, setDay] = useState(value && value.date ? new Date(value.date + 'T00:00:00') : null);
  const [time, setTime] = useState(value && value.time ? value.time : null);

  const y = view.getFullYear(), m = view.getMonth();
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(view);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7; // semana empieza en lunes
  const weekHead = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const atMonthStart = (y === today.getFullYear() && m === today.getMonth());

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));

  const isDisabled = (d) => !d || d < today || d.getDay() === 0; // domingos cerrados
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const confirm = () => {
    if (!day || !time) return;
    const txt = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(day);
    const cap = txt.charAt(0).toUpperCase() + txt.slice(1);
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    onConfirm({ date: iso, time, label: `${cap} · ${time}` });
  };

  return (
    <div className="qd-cal" onClick={(e) => e.stopPropagation()}>
      <button className="qd-modal__close" onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Cerrar'} data-cursor="cta">✕</button>
      <p className="qd-cal__title">{lang === 'en' ? 'Pick a day & time' : 'Elige día y hora'}</p>
      <p className="qd-cal__hint">{lang === 'en' ? 'Mon–Sat · mornings, 10:00–15:00 (Madrid)' : 'Lun–Sáb · mañanas, 10:00–15:00 (hora de Madrid)'}</p>

      <div className="qd-cal__head">
        <button className="qd-cal__nav" onClick={() => { if (!atMonthStart) setView(new Date(y, m - 1, 1)); }} disabled={atMonthStart} aria-label="←" data-cursor="cta">‹</button>
        <span className="qd-cal__month">{monthLabel}</span>
        <button className="qd-cal__nav" onClick={() => setView(new Date(y, m + 1, 1))} aria-label="→" data-cursor="cta">›</button>
      </div>

      <div className="qd-cal__weekhead">
        {weekHead.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className="qd-cal__grid">
        {cells.map((d, i) => d === null
          ? <span key={i} className="qd-cal__empty"></span>
          : <button key={i} type="button" className={'day' + (sameDay(d, day) ? ' is-sel' : '')} disabled={isDisabled(d)} onClick={() => { setDay(d); setTime(null); }} data-cursor="cta">{d.getDate()}</button>
        )}
      </div>

      <div className={'qd-cal__times' + (day ? ' is-on' : '')}>
        <p className="qd-cal__times-label">{day ? (lang === 'en' ? 'Available times' : 'Horas disponibles') : (lang === 'en' ? 'Select a day first' : 'Selecciona un día primero')}</p>
        <div className="qd-cal__slots">
          {SLOTS.map((s) =>
            <button key={s} type="button" className={'time-slot' + (time === s ? ' is-sel' : '')} disabled={!day} onClick={() => setTime(s)} data-cursor="cta">{s}</button>
          )}
        </div>
      </div>

      <button className="qd-cal__confirm" disabled={!day || !time} onClick={confirm} data-cursor="cta">
        {lang === 'en' ? 'Confirm' : 'Confirmar'}
      </button>
    </div>);

}

function Quedamos() {
  const { t, lang } = useT();
  const [v, setV] = useState({});
  const [dateOpen, setDateOpen] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [sending, setSending] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyMail = (e) => {
    e.preventDefault();
    const email = 'adsgroup@ads-partners.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }));
  // El pop-up de confirmación se cierra solo al terminar el GIF (15.15 s)
  React.useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(false), 15150);
    return () => clearTimeout(id);
  }, [sent]);

  // El chat (ChatGlobo) abre la carta directamente al pulsar "¿Quedamos?" — mismo
  // patrón de evento window que usa el cookie-consent.
  React.useEffect(() => {
    const open = () => setRevealed(true);
    window.addEventListener('open-quedamos', open);
    return () => window.removeEventListener('open-quedamos', open);
  }, []);

  // Letter segments per language. type: 'text'|'date', req marks required (*)
  const F = {
    es: [
    'Estimado grupo adsPartners:\n\nHola, me llamo ', { k: 'name', ph: 'TU NOMBRE AQUÍ', req: true },
    '.\n\nTrabajo en ', { k: 'company', ph: 'TU EMPRESA', req: true },
    ' como ', { k: 'role', ph: 'PUESTO DE TRABAJO, O LO QUE TE GUSTARÍA QUE DIGA TU PERFIL DE LINKEDIN' },
    '. Echadle un ojo a ', { k: 'web', ph: 'TU PÁGINA WEB o REDES SOCIALES' },
    ' si os apetece!\n\nPreferiría quedar ', { k: 'mode', ph: 'ONLINE o PRESENCIAL', req: true },
    ', a ser posible el ', { k: 'datetime', ph: 'FECHA Y HORA', date: true, req: true },
    '. (', { k: 'place', ph: 'EN DÓNDE TE VENGA BIEN, EN CASO DE SER PRESENCIAL' },
    ').\n\nEntiendo que esto no es para todos, por eso me gustaría aclarar que prefiero más ', { k: 'drink', ph: 'UN CAFÉ, UNA CERVEZA, UN VINO, UN VASO DE AGUA, LO QUE TE APETEZCA', req: true },
    '.\n\nLa mejor manera de contactarme es por teléfono: ', { k: 'phone', ph: 'TU NÚMERO DE TELÉFONO', req: true },
    ', o si lo prefieres, podéis molestarme por aquí: ', { k: 'email', ph: 'TU CORREO ELECTRÓNICO', req: true },
    '. Por favor, comunicación simple y sencilla, sin spam.\n\nUna cosa que os puede servir antes de vernos es ', { k: 'extra', ph: 'LO QUE TE APETEZCA CONTAR, NO JUZGAMOS' },
    '.\n\nAtentamente, ', { k: 'signature', ph: 'EL NOMBRE CON EL QUE SOLO TE LLAMAN TUS PADRES', req: true },
    '.'],

    en: [
    'Dear adsPartners team:\n\nHi, my name is ', { k: 'name', ph: 'YOUR NAME HERE', req: true },
    '.\n\nI work at ', { k: 'company', ph: 'YOUR COMPANY', req: true },
    ' as a ', { k: 'role', ph: "JOB TITLE, OR WHATEVER YOU'D LIKE YOUR LINKEDIN PROFILE TO SAY" },
    '. Feel free to check out ', { k: 'web', ph: 'YOUR WEBSITE or SOCIAL MEDIA' },
    " if you'd like!\n\nI'd prefer to meet ", { k: 'mode', ph: 'ONLINE or IN PERSON', req: true },
    ', if possible on ', { k: 'datetime', ph: 'DATE AND TIME', date: true, req: true },
    '. (', { k: 'place', ph: "WHERE IT SUITS YOU, IF IT'S IN PERSON" },
    ').\n\nI understand that this is not for everyone, that’s why I would like to clarify that I prefer more ', { k: 'drink', ph: 'A COFFEE, A BEER, A WINE, A GLASS OF WATER, WHATEVER YOU\'D LIKE', req: true },
    '.\n\nThe best way to contact me is by phone: ', { k: 'phone', ph: 'YOUR PHONE NUMBER', req: true },
    ', or if you prefer, you can bother me here: ', { k: 'email', ph: 'YOUR EMAIL ADDRESS', req: true },
    '. Please keep communication simple and straightforward, no spam.\n\nSomething that might be helpful before we meet is ', { k: 'extra', ph: "WHATEVER YOU'D LIKE TO SHARE, WE WON'T JUDGE" },
    '.\n\nSincerely, ', { k: 'signature', ph: 'THE NAME ONLY YOUR PARENTS CALL YOU', req: true },
    '.']

  };
  const segs = F[lang] || F.es;
  const reqKeys = segs.filter((s) => s && s.req).map((s) => s.k);

  // Estructura que recibe n8n. Claves estables en inglés para mapear fácil.
  const buildPayload = () => ({
    source: 'adspartners.com/quedamos',
    lang,
    submitted_at: new Date().toISOString(),
    name: v.name || '',
    company: v.company || '',
    role: v.role || '',
    web: v.web || '',
    mode: v.mode || '',
    place: v.place || '',
    drink: v.drink || '',
    email: v.email || '',
    phone: v.phone || '',
    extra: v.extra || '',
    signature: v.signature || '',
    meeting: {
      date: meeting ? meeting.date : '',
      time: meeting ? meeting.time : '',
      label: v.datetime || (meeting ? meeting.label : '')
    }
  });

  // Respaldo por correo (se usa si no hay webhook configurado o si el POST falla).
  const sendMailto = (payload) => {
    const label = (k) => { const seg = segs.find((s) => s && s.k === k); return seg ? seg.ph : k; };
    const lines = segs.filter((s) => s && s.k).map((s) => `${label(s.k)}: ${v[s.k] || ''}`).join('\n');
    const subject = lang === 'en' ? `Meeting request — ${v.name || ''}` : `Solicitud de reunión — ${v.name || ''}`;
    window.location.href = `mailto:adsgroup@ads-partners.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
  };

  const submit = async () => {
    const missing = reqKeys.some((k) => !(v[k] && v[k].trim()));
    if (missing || !(v.datetime && v.datetime.trim())) {
      setError(true);
      return;
    }
    setError(false);
    const payload = buildPayload();

    if (!N8N_WEBHOOK_URL) {
      // Todavía sin automatización conectada: enviamos por correo.
      sendMailto(payload);
      setSent(true);
      return;
    }

    setSending(true);
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
      setSending(false);
      setSent(true);
    } catch (err) {
      // Si el POST falla (p.ej. CORS no configurado en n8n), no perdemos el lead.
      setSending(false);
      sendMailto(payload);
      setSent(true);
    }
  };

  return (
    <section className={'quedamos' + (revealed ? ' is-revealed-sec' : '')} id="quedamos" data-screen-label="Quedamos" data-nav-theme="light">
      <div className="quedamos__inner">
        <h2 className="ww-intro__title" style={{ textAlign: 'left', marginBottom: '8px', fontSize: 'clamp(28px, 4vw, 64px)' }}>{lang === 'en' ? 'Shall we talk about your company?' : '¿Hablamos de vuestra empresa?'}</h2>
        <p className="ww-intro__sub" style={{ textAlign: 'left', maxWidth: '760px' }}>{lang === 'en' ? "We don't hold boring meetings." : 'No hacemos reuniones aburridas.'}</p>

        <div className={'qd-grid' + (revealed ? ' is-revealed' : '')}>
          <aside className="qd-side">
            <p className="qd-side__lead">{lang === 'en' ? '45 minutes, online or in person. No strings attached.' : '45 minutos, online o en persona. Sin compromiso.'}</p>
            <ul className="qd-side__contact">
              <li>{lang === 'en' ? 'Madrid · We come to you, wherever you are' : 'Madrid · Vamos donde estéis'}</li>
              <li className="qd-clock"><MadridClock lang={lang} /></li>
              <li><a href="mailto:adsgroup@ads-partners.com" onClick={copyMail} data-cursor="cta">{copied ? (lang === 'en' ? 'Copied!' : '¡Copiado!') : 'adsgroup@ads-partners.com'}</a></li>
              <li><a href="https://wa.me/34633565840" target="_blank" rel="noopener" data-cursor="cta">+34 633 565 840</a></li>
            </ul>
          </aside>

          <div className="qd-letterwrap">
            {revealed &&
            <button type="button" className="qd-close" onClick={() => setRevealed(false)} aria-label={lang === 'en' ? 'Close' : 'Cerrar'} data-cursor="cta">✕</button>
            }
            {!revealed &&
            <div className="qd-prompt">
              <p className="qd-prompt__txt">{lang === 'en' ? 'Drop us a message, and we’ll take it from there.' : 'Escribidnos y nosotros nos encargamos del resto.'}</p>
              <button type="button" className="qd-prompt__btn" onClick={() => setRevealed(true)} data-cursor="cta">
              <span className="qd-prompt__btn-default">[{lang === 'en' ? 'CLICK HERE' : 'HAZ CLICK AQUÍ'}]</span>
              </button>
            </div>
            }
            <div className="qd-letter">
              {segs.map((s, i) => {
                if (typeof s === 'string') {
                  return s.split('\n').map((line, j, arr) =>
                  <React.Fragment key={i + '-' + j}>{line}{j < arr.length - 1 ? <br /> : null}</React.Fragment>);

                }
                if (s.date) {
                  return <QdDate key={i} value={v[s.k]} placeholder={s.ph} required={s.req} onClick={() => setDateOpen(true)} />;
                }
                return <QdInput key={i} value={v[s.k] || ''} onChange={set(s.k)} placeholder={s.ph} required={s.req} />;
              })}
            </div>
            <div className="qd-actions">
              {error &&
              <span className="qd-error">{lang === 'en' ? 'Please fill in the required fields (*).' : 'Por favor, rellena los campos obligatorios (*).'}</span>
              }
              <button type="button" className="qd-submit" onClick={submit} disabled={sending} data-cursor="cta">
                {sending ? (lang === 'en' ? 'Sending…' : 'Enviando…') : (lang === 'en' ? 'Send message' : 'Enviar mensaje')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {dateOpen &&
      <div className="qd-modal" onClick={() => setDateOpen(false)}>
        <QdCalendar
          lang={lang}
          value={meeting}
          onClose={() => setDateOpen(false)}
          onConfirm={(mt) => { setMeeting(mt); setV((s) => ({ ...s, datetime: mt.label })); setDateOpen(false); }} />
      </div>
      }

      {sent &&
      <div className="qd-modal qd-thanks qd-thanks--gif" style={{ '--count-dur': '15.15s' }} onClick={() => setSent(false)}>
        <div className="qd-thanks__box qd-thanks__box--gif" onClick={(e) => e.stopPropagation()}>
          <button className="qd-modal__close" onClick={() => setSent(false)} aria-label={lang === 'en' ? 'Close' : 'Cerrar'} data-cursor="cta">✕</button>
          <img className="qd-thanks__gif" src="assets/letter-thanks.webp" alt="" />
          <span className="qd-thanks__bar" aria-hidden="true"></span>
        </div>
      </div>
      }
    </section>);

}

// ============= FOOTER =============
function Footer({ onCartClick }) {
  const { t, lang } = useT();
  const c = {
    es: {
      center1: 'Del movimiento al crecimiento. Sin plan B.',
      c1h: '(01) Comunicación.',
      c2h: '(02) Legal y cosas de esas.',
      c3h: '(03) Únete a nuestro grupo de terapia.',
      c3note: 'No te preocupes. No hacemos emails aburridos.',
      emailPh: 'Email',
      join: 'Únete',
      phone: 'Teléfono',
      legal: [
        { label: 'Cookies', href: 'cookies.html' },
        { label: 'Privacidad', href: 'privacidad.html' },
        { label: 'Aviso legal', href: 'aviso-legal.html' },
      ],
      configurar: 'Configurar cookies'
    },
    en: {
      center1: 'From movement to growth. No plan B.',
      c1h: '(01) Communication.',
      c2h: '(02) Legal and stuff like that.',
      c3h: '(03) Join our support group.',
      c3note: 'Don’t worry. We don’t send boring emails.',
      emailPh: 'Email',
      join: 'Join',
      phone: 'Phone',
      legal: [
        { label: 'Cookies', href: 'cookies.html' },
        { label: 'Privacy', href: 'privacidad.html' },
        { label: 'Legal notice', href: 'aviso-legal.html' },
      ],
      configurar: 'Cookie settings'
    }
  }[lang] || {};
  const [copied, setCopied] = useState(false);
  const [joined, setJoined] = useState(false);
  // El pop-up de la newsletter se cierra solo a los 10 s
  React.useEffect(() => {
    if (!joined) return;
    const id = setTimeout(() => setJoined(false), 10000);
    return () => clearTimeout(id);
  }, [joined]);
  const onJoin = (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('.foot__newsinput');
    const email = input ? input.value.trim() : '';
    if (!email) { if (input) input.focus(); return; }
    // Guarda el email en el Excel de leads vía n8n. Best-effort: si falla el POST
    // no bloqueamos la UX (igual mostramos el GIF de gracias).
    if (N8N_NEWSLETTER_URL) {
      try {
        fetch(N8N_NEWSLETTER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, lang: lang, source: 'adspartners.com/footer' }),
          keepalive: true
        }).catch(() => {});
      } catch (err) {}
    }
    if (input) input.value = '';
    setJoined(true);
  };
  const copyMail = (e) => {
    e.preventDefault();
    const email = 'adsgroup@ads-partners.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = email; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const copiedTxt = lang === 'en' ? 'Copied!' : '¡Copiado!';
  // Separa el número "(NN)" del texto para poder forzar un salto solo en móvil (CSS).
  const splitHead = (s) => {
    const m = (s || '').match(/^(\(\d+\))\s*(.*)$/);
    return m ? [m[1], m[2]] : ['', s];
  };
  const Head = ({ text }) => {
    const [num, label] = splitHead(text);
    return <h4>{num && <span className="foot__num">{num}</span>}{num ? ' ' : ''}{label}</h4>;
  };
  return (
    <footer className="foot" data-screen-label="Footer" data-nav-theme="light">
      <div className="foot__panel">
        <div className="foot__cols">
          <div className="foot__col">
            <Head text={c.c1h} />
            <ul>
              <li><a href="mailto:adsgroup@ads-partners.com" onClick={copyMail} data-cursor="cta">{copied ? copiedTxt : 'adsgroup@ads-partners.com'}</a></li>
              <li><a href="https://wa.me/34633565840" target="_blank" rel="noopener">+34 633 565 840</a></li>
              <li><a href="https://www.instagram.com/adspartners.co?igsh=a2R0enBqMng3cXdr&utm_source=qr" target="_blank" rel="noopener">Instagram ↗</a></li>
              <li><a href="https://www.tiktok.com/@adspartners.co?_r=1&_t=ZN-97KyiYqMAhq" target="_blank" rel="noopener">TikTok ↗</a></li>
              <li><a href="https://youtube.com/@ads-partners?si=M7j50qTGzCwHU-7d" target="_blank" rel="noopener">YouTube ↗</a></li>
              <li><a href="https://www.linkedin.com/company/ads-partners-co/" target="_blank" rel="noopener">LinkedIn ↗</a></li>
            </ul>
          </div>
          <div className="foot__col">
            <Head text={c.c2h} />
            <ul>
              {c.legal && c.legal.map((x, i) => <li key={i}><a href={x.href}>{x.label}</a></li>)}
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-cookie-settings')); }} data-cursor="cta">{c.configurar}</a></li>
            </ul>
          </div>
          <div className="foot__col foot__col--news">
            <Head text={c.c3h} />
            <p className="foot__newsnote">{c.c3note}</p>
            <form className="foot__news" onSubmit={onJoin}>
              <input className="foot__newsinput" type="email" placeholder={c.emailPh} aria-label={c.emailPh} data-cursor="text" />
              <button type="submit" className="foot__newsbtn" data-cursor="cta">{c.join}</button>
            </form>
          </div>
        </div>

        <div className="foot__legal">
          <span>© {new Date().getFullYear()} adsPartners®</span>
          <span>{lang === 'en' ? 'All rights reserved' : 'Todos los derechos reservados'}</span>
          <span>27032025-NSLQHPMLP-1M</span>
        </div>
      </div>

      <div className="foot__brand" aria-hidden="true">
        <img src="assets/logos/logotipo_marron.svg" alt="" />
      </div>

      {joined &&
      <div className="qd-modal qd-thanks qd-thanks--gif" onClick={() => setJoined(false)}>
        <div className="qd-thanks__box qd-thanks__box--gif" onClick={(e) => e.stopPropagation()}>
          <button className="qd-modal__close" onClick={() => setJoined(false)} aria-label={lang === 'en' ? 'Close' : 'Cerrar'} data-cursor="cta">✕</button>
          <img className="qd-thanks__gif" src="assets/newsletter-thanks.webp" alt="" />
          <span className="qd-thanks__bar" aria-hidden="true"></span>
        </div>
      </div>
      }
    </footer>);

}

// ============= TEXTO QUE SE ENCIENDE AL BAJAR =============
function RevealText({ paras, className }) {
  const ref = React.useRef(null);
  const splitWords = (s) => s.split(/(\s+)/);
  React.useEffect(() => {
    const container = ref.current;
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
          el.style.opacity = (0.06 + 0.94 * p).toFixed(3);
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
  }, [paras.join('|')]);
  // Lo que va entre {llaves} sale en cursiva (lo usan los títulos de secciones.jsx).
  const palabras = (text) => splitWords(text).map((w, i) =>
  /\s+/.test(w) ?
  <React.Fragment key={i}>{w}</React.Fragment> :
  <span key={i} className="mani-word">{w}</span>
  );
  return (
    <div className={className} ref={ref}>
      {paras.map((text, pi) =>
      <p key={pi} className="manifesto-text">
        {text.split(/(\{[^}]*\})/).filter(Boolean).map((trozo, ti) =>
        trozo[0] === '{' ?
        <em key={ti}>{palabras(trozo.slice(1, -1))}</em> :
        <React.Fragment key={ti}>{palabras(trozo)}</React.Fragment>
        )}
      </p>
      )}
    </div>);

}

Object.assign(window, { Nav, SideMenu, Hero, RevealText, Footer, Quedamos, useReveal });