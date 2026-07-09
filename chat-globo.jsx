/* global React, useT */
// ============================================================
//  CHAT GLOBO — FRESA de cara al público (ventas)
//  Burbuja flotante que abre un chat de ventas. Aparece al pasar el Hero.
//  Cerebro AISLADO (sin datos privados): backend en ventas.ads-partners.com.
//  Clona la mecánica de cookie-consent (fixed root + card de marca + storage).
// ============================================================
const { useState: useStateCG, useEffect: useEffectCG, useRef: useRefCG, useCallback: useCallbackCG } = React;

// Endpoint del bot. Override manual (window.__CHAT_API__); en localhost apunta solo al
// backend local; en producción, al servicio desplegado.
const CG_API = (typeof window !== 'undefined' && window.__CHAT_API__) ||
  ((typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname))
    ? 'http://localhost:3000/api/chat-ventas'
    : 'https://fresa-ventas-production.up.railway.app/api/chat-ventas');
const CG_HIST_KEY = 'ads_chat_history';
const CG_MAX_TURNS = 20;

function cgReadHist() {
  try { const raw = sessionStorage.getItem(CG_HIST_KEY); return raw ? JSON.parse(raw) : []; }
  catch (e) { return []; }
}
function cgWriteHist(msgs) {
  try { sessionStorage.setItem(CG_HIST_KEY, JSON.stringify(msgs.slice(-20))); } catch (e) {}
}

// Turnstile OPCIONAL: si el widget de Cloudflare está cargado y hay sitekey
// (window.__TURNSTILE_SITEKEY__), obtiene un token; si no, devuelve '' y el backend
// omite la verificación (mientras no tenga TURNSTILE_SECRET). Ver README del backend.
async function cgTurnstileToken() {
  try {
    const sitekey = window.__TURNSTILE_SITEKEY__;
    if (!sitekey || !window.turnstile) return '';
    return await new Promise((resolve) => {
      try {
        window.turnstile.ready(() => {
          window.turnstile.execute(undefined, { sitekey, action: 'chat' })
            .then(resolve).catch(() => resolve(''));
        });
      } catch (e) { resolve(''); }
    });
  } catch (e) { return ''; }
}

function ChatGlobo({ onCTA }) {
  const { t, lang } = useT();
  const [mounted, setMounted] = useStateCG(false);
  const [revealed, setRevealed] = useStateCG(false);
  const [open, setOpen] = useStateCG(false);
  const [messages, setMessages] = useStateCG([]); // { role: 'user'|'assistant', text }
  const [input, setInput] = useStateCG('');
  const [busy, setBusy] = useStateCG(false);
  const listRef = useRefCG(null);

  // Montaje. En el prerender (jsdom) mounted queda en false y el globo NO aparece
  // en el snapshot: no interfiere con el copy exigido por build.mjs.
  useEffectCG(() => {
    setMounted(true);
    const hist = cgReadHist();
    if (hist.length) setMessages(hist);
  }, []);

  // Aparecer al pasar el Hero (#top): cuando el header del hero deja de verse.
  useEffectCG(() => {
    if (!mounted) return;
    const hero = document.getElementById('top');
    if (!hero || typeof IntersectionObserver === 'undefined') { setRevealed(true); return; }
    let io;
    try {
      io = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (e && !e.isIntersecting) setRevealed(true);
      }, { threshold: 0 });
      io.observe(hero);
    } catch (e) { setRevealed(true); }
    return () => { if (io) io.disconnect(); };
  }, [mounted]);

  // Auto-scroll al final.
  useEffectCG(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Persistir historial de la sesión (misma pestaña).
  useEffectCG(() => { if (messages.length) cgWriteHist(messages); }, [messages]);

  const openChat = useCallbackCG(() => {
    setOpen(true);
    setMessages((m) => (m.length === 0 ? [{ role: 'assistant', text: t('chat.intro') }] : m));
  }, [t]);

  const cta = useCallbackCG(() => {
    if (typeof onCTA === 'function') onCTA();            // scroll a #quedamos
    try { window.dispatchEvent(new CustomEvent('open-quedamos')); } catch (e) {} // abre la carta
    setOpen(false);
  }, [onCTA]);

  const patchLastAssistant = (fn) => setMessages((m) => {
    const copy = m.slice();
    const last = copy[copy.length - 1];
    if (last && last.role === 'assistant') copy[copy.length - 1] = { role: 'assistant', text: fn(last.text) };
    return copy;
  });

  const send = useCallbackCG(async () => {
    const text = input.trim();
    if (!text || busy) return;
    const userTurns = messages.filter((x) => x.role === 'user').length;
    if (userTurns >= CG_MAX_TURNS) {
      setMessages((m) => [...m, { role: 'assistant', text: t('chat.limit') }]);
      return;
    }
    setInput('');
    setBusy(true);
    const history = [...messages, { role: 'user', text }];
    setMessages([...history, { role: 'assistant', text: '' }]);

    try {
      const turnstileToken = await cgTurnstileToken();
      const res = await fetch(CG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((x) => ({ role: x.role, content: x.text })),
          turnstileToken,
          lang,
        }),
      });
      if (!res.ok || !res.body) throw new Error('bad response');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let got = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() || '';
        for (const part of parts) {
          if (!part || part.charAt(0) === ':') continue; // heartbeat ": keepalive"
          const line = part.replace(/^data:\s?/, '');
          if (!line) continue;
          let ev; try { ev = JSON.parse(line); } catch (e) { continue; }
          if (ev.type === 'text') { got = true; patchLastAssistant((prev) => prev + ev.text); }
          else if (ev.type === 'error') patchLastAssistant((prev) => prev || t('chat.error'));
        }
      }
      if (!got) patchLastAssistant((prev) => prev || t('chat.error'));
    } catch (e) {
      patchLastAssistant((prev) => prev || t('chat.error'));
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages, t]);

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  if (!mounted) return null;

  return (
    <div className={'cg-root' + (revealed ? ' is-revealed' : '') + (open ? ' is-open' : '')}>
      {/* Burbuja flotante */}
      <button
        type="button"
        className="cg-bubble"
        data-cursor="cta"
        aria-label={t('chat.bubble')}
        onClick={openChat}
      >
        <span className="cg-bubble-dot"></span>
        <img className="cg-bubble-logo" src="assets/logos/fresa-wordmark.webp" alt="FRESA" />
      </button>

      {/* Panel de chat */}
      {open &&
      <section className="cg-panel" role="dialog" aria-label={t('chat.title')}>
        <header className="cg-head">
          <div className="cg-head-id">
            <span className="cg-head-avatar" aria-hidden="true"><img className="cg-head-avatar-img" src="assets/logos/fresa-icono.webp" alt="" /></span>
            <div>
              <div className="cg-head-name">{t('chat.title')}</div>
              <div className="cg-head-sub">{t('chat.subtitle')}</div>
            </div>
          </div>
          <button type="button" className="cg-close" data-cursor="cta" aria-label="✕" onClick={() => setOpen(false)}>✕</button>
        </header>

        <div className="cg-list" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={'cg-msg cg-msg--' + m.role}>
              {m.text
                ? m.text
                : (busy && i === messages.length - 1
                    ? <span className="cg-typing"><span></span><span></span><span></span></span>
                    : '')}
            </div>
          ))}
        </div>

        <div className="cg-cta-row">
          <button type="button" className="cg-cta" data-cursor="cta" onClick={cta}>{t('chat.cta')}</button>
          <a className="cg-wa" data-cursor="cta" href="https://wa.me/34633565840" target="_blank" rel="noopener">{t('chat.whatsapp')}</a>
        </div>

        <div className="cg-compose">
          <input
            className="cg-input"
            data-cursor="text"
            type="text"
            value={input}
            placeholder={t('chat.placeholder')}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
            maxLength={1000}
          />
          <button
            type="button"
            className="cg-send"
            data-cursor="cta"
            aria-label={t('chat.send')}
            onClick={send}
            disabled={busy || !input.trim()}
          >→</button>
        </div>
      </section>}
    </div>
  );
}

window.ChatGlobo = ChatGlobo;
