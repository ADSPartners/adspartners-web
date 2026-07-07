/* global React, useT */
const { useState: useStateT3, useEffect: useEffectT3, useRef: useRefT3 } = React;

// Auto-fit: binary-search the largest font-size that fits the container without overflow.
function useFitText(min = 7, max = 14, deps = []) {
  const ref = useRefT3(null);
  const run = (el) => {
    if (!el || !el.clientHeight) return;
    let lo = min, hi = max;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      if (el.scrollHeight > el.clientHeight + 1) hi = mid;
      else lo = mid;
    }
    let fs = lo;
    el.style.fontSize = fs.toFixed(2) + 'px';
    // Post-check: sub-pixel wrapping can flip overflow on/off at the converged value.
    // Step back in small decrements until it definitively fits.
    let guard = 24;
    while (guard-- > 0 && el.scrollHeight > el.clientHeight + 0.5 && fs > min) {
      fs -= 0.25;
      el.style.fontSize = fs.toFixed(2) + 'px';
    }
  };
  useEffectT3(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => run(el));
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener('resize', schedule);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { ref, refit: () => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => run(el));
  }};
}

function getT3Members(t) {
  return [
  {
    id: 'alvaro', first: 'Álvaro', last: '', role: t('team.role.alvaro'),
    file: 'AE—01·26',
    photo: window.IMG.alvaro,
    pos: 'center 28%',
    bio: [t('team.bio.alvaro.1'), t('team.bio.alvaro.2'), t('team.bio.alvaro.3'), t('team.bio.alvaro.4')]
  },
  {
    id: 'daniel', first: 'Daniel', last: '', role: t('team.role.daniel'),
    file: 'DC—02·26',
    photo: window.IMG.dani,
    pos: 'center 18%',
    bio: [t('team.bio.daniel.1'), t('team.bio.daniel.2'), t('team.bio.daniel.3')]
  },
  {
    id: 'sebas', first: 'Sebastián', last: '', role: t('team.role.sebas'),
    file: 'SL—03·26',
    photo: window.IMG.sebas,
    pos: 'center 18%',
    bio: [t('team.bio.sebas.1'), t('team.bio.sebas.2'), t('team.bio.sebas.3')]
  }];

}

function Polaroid({ m, i }) {
  const { t } = useT();
  const [flipped, setFlipped] = useStateT3(false);
  const { ref: bioRef, refit: refitBio } = useFitText(7, 18, [m.id, m.bio.join('|')]);
  return (
    <article
      className={'t3__pol' + (flipped ? ' is-flip' : '')}
      onClick={() => { setFlipped((f) => !f); setTimeout(refitBio, 850); }}
      role="button" tabIndex={0}
      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();setFlipped((f) => !f);setTimeout(refitBio, 850);}}}
      aria-pressed={flipped}
      data-cursor="cta">
      
      <div className="t3__pol__inner">
        <div className="t3__pol__face t3__pol__face--front">
          <div className="t3__photo" data-fileno={m.file}>
            <span className="id">FILE · 0{i + 1}/03</span>
            <img src={m.photo} alt={m.first} style={{ objectPosition: m.pos }} />
          </div>
          <div className="t3__cap">
            <span className="name">{m.first}</span>
            <span className="role">0{i + 1} / 03</span>
          </div>
        </div>
        <div className="t3__pol__face t3__pol__face--back">
          <div className="t3__back">
            <div className="t3__back__name">
              <span className="t3__back__first">{m.first}</span>
              <span className="t3__back__role">{m.role}</span>
            </div>
            <div className="t3__back__bio" ref={bioRef}>
              {m.bio.map((p, j) => <p key={j}>{p}</p>)}
            </div>
          </div>
        </div>
      </div>
    </article>);

}

function Team({ showFile = true } = {}) {
  const { t } = useT();
  const cls = ['t3'];
  if (showFile) cls.push('is-file');

  const members = getT3Members(t);

  return (
    <section className={cls.join(' ')} id="equipo" data-screen-label="03 Team" data-nav-theme="light">
      <div className="t3__title">
        <div className="ww-intro" style={{ margin: '0 auto 8px', textAlign: 'center' }}>
          <h2 className="ww-intro__title">{t('team.title.1.html')}</h2>
          <p className="ww-intro__sub" style={{ maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto' }}>{t('team.founders.sub')}</p>
        </div>
      </div>

      <div className="t3__stage">
        <div className="t3__row">
          {members.map((m, i) => <Polaroid key={m.id} m={m} i={i} />)}
        </div>

        <p className="t3__credit">
          <b>Álvaro</b><span className="sep">/</span>
          <b>Daniel</b><span className="sep">/</span>
          <b>Sebastián</b>
        </p>
      </div>

    </section>);

}

window.Team = Team;