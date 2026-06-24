/* global React, useT */
// ============================================================
//  COOKIE CONSENT — adsPartners
//  Banner de primer acceso + panel de preferencias.
//  Texto desde window.LEGAL[lang].legal.cookieBanner.
//  Consentimiento en localStorage 'cookie_consent'.
// ============================================================
const { useState: useStateCC, useEffect: useEffectCC, useCallback: useCallbackCC } = React;

const CC_KEY = 'cookie_consent';

function ccRead() {
  try {
    const raw = localStorage.getItem(CC_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function ccWrite(obj) {
  try { localStorage.setItem(CC_KEY, JSON.stringify(obj)); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: obj })); } catch (e) {}
}

function CCSwitch({ on, onClick }) {
  return <button type="button" className={'cc-switch' + (on ? ' is-on' : '')} onClick={onClick} role="switch" aria-checked={on}></button>;
}

function CookieConsent() {
  const { lang } = useT();
  const data = (window.LEGAL && (window.LEGAL[lang] || window.LEGAL.es).legal) || null;

  const [stored, setStored] = useStateCC(ccRead);
  const [mode, setMode] = useStateCC('hidden'); // 'hidden' | 'banner' | 'settings'
  const [analytics, setAnalytics] = useStateCC(() => (stored ? !!stored.analytics : false));
  const [marketing, setMarketing] = useStateCC(() => (stored ? !!stored.marketing : false));

  // initial display + deep-link to settings (#configurar-cookies)
  useEffectCC(() => {
    const wantsSettings = window.location.hash === '#configurar-cookies';
    if (wantsSettings) {
      if (stored) { setAnalytics(!!stored.analytics); setMarketing(!!stored.marketing); }
      setMode('settings');
      try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
    } else if (!stored) {
      const t = setTimeout(() => setMode('banner'), 900);
      return () => clearTimeout(t);
    }
  }, []);

  // footer / external trigger
  useEffectCC(() => {
    const open = () => {
      const s = ccRead();
      if (s) { setAnalytics(!!s.analytics); setMarketing(!!s.marketing); }
      setMode('settings');
    };
    window.addEventListener('open-cookie-settings', open);
    return () => window.removeEventListener('open-cookie-settings', open);
  }, []);

  // lock body scroll while settings panel is open
  useEffectCC(() => {
    const lock = mode === 'settings';
    const prev = document.body.style.overflow;
    if (lock) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mode]);

  const persist = useCallbackCC((a, m) => {
    const obj = { necessary: true, analytics: a, marketing: m, ts: Date.now(), v: 1 };
    ccWrite(obj);
    setStored(obj);
    setAnalytics(a); setMarketing(m);
    setMode('hidden');
  }, []);

  const acceptAll = () => persist(true, true);
  const rejectAll = () => persist(false, false);
  const saveChoices = () => persist(analytics, marketing);

  if (!data) return null;
  const b = data.cookieBanner;
  const cats = b.categorias;
  const policyLabel = data.footer.cookies;

  return (
    <div className={'cc-root' + (mode === 'settings' ? ' is-settings' : '')}>
      {mode === 'settings' &&
        <div className="cc-scrim" onClick={() => stored ? setMode('hidden') : setMode('banner')}></div>}

      {/* COMPACT BANNER — slim horizontal bar */}
      {mode === 'banner' &&
      <section className="cc-card cc-banner" role="dialog" aria-label={b.title} aria-modal="false">
        <p className="cc-body">
          <span className="cc-blip"></span>
          <span>{b.bodyCorto || b.body} <a href="cookies.html">{policyLabel} ↗</a></span>
        </p>
        <div className="cc-actions">
          <button className="cc-btn cc-btn--text" onClick={() => setMode('settings')} type="button">{b.configurar}</button>
          <button className="cc-btn cc-btn--ghost" onClick={rejectAll} type="button">{b.rechazarTodas}</button>
          <button className="cc-btn cc-btn--primary" onClick={acceptAll} type="button">{b.aceptarTodas}</button>
        </div>
      </section>}

      {/* SETTINGS PANEL */}
      {mode === 'settings' &&
      <section className="cc-card cc-panel" role="dialog" aria-label={b.configurar} aria-modal="true">
        <div className="cc-panel-head">
          <button className="cc-close" onClick={() => stored ? setMode('hidden') : setMode('banner')} aria-label="✕" type="button">✕</button>
          <h2 className="cc-title">{b.title}</h2>
          <p className="cc-body">{b.body}</p>
        </div>

        <div className="cc-cats">
          <div className="cc-cat">
            <div className="cc-cat-text">
              <div className="cc-cat-title">{cats.necesarias.title}</div>
              <div className="cc-cat-desc">{cats.necesarias.desc}</div>
            </div>
            <span className="cc-cat-locked">{cats.necesarias.estado}</span>
          </div>

          <div className="cc-cat">
            <div className="cc-cat-text">
              <div className="cc-cat-title">{cats.analiticas.title}</div>
              <div className="cc-cat-desc">{cats.analiticas.desc}</div>
            </div>
            <CCSwitch on={analytics} onClick={() => setAnalytics((v) => !v)} />
          </div>

          <div className="cc-cat">
            <div className="cc-cat-text">
              <div className="cc-cat-title">{cats.marketing.title}</div>
              <div className="cc-cat-desc">{cats.marketing.desc}</div>
            </div>
            <CCSwitch on={marketing} onClick={() => setMarketing((v) => !v)} />
          </div>
        </div>

        <div className="cc-panel-foot">
          <button className="cc-btn cc-btn--ghost" onClick={rejectAll} type="button">{b.rechazarTodas}</button>
          <button className="cc-btn cc-btn--ghost" onClick={saveChoices} type="button">{b.guardarPreferencias}</button>
          <button className="cc-btn cc-btn--primary" onClick={acceptAll} type="button">{b.aceptarTodas}</button>
        </div>
      </section>}
    </div>
  );
}

window.CookieConsent = CookieConsent;
