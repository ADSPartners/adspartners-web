/* global React, useT */
const { useMemo: useMemoT3, useState: useStateT3, useEffect: useEffectT3, useRef: useRefT3 } = React;

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

function t3Rand(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function Fingerprint({ seed = 1, color = '#1f1812', density = 'normal' }) {
  const r = t3Rand(seed);
  const cx = 50,cy = 62;
  const ringCount = density === 'sparse' ? 11 : density === 'dense' ? 18 : 14;
  const dots = useMemoT3(() => {
    const arr = [];
    const baseRx = 24 + r() * 3;
    const baseRy = 32 + r() * 3;
    const tilt = (r() - 0.5) * 0.35;
    const breaks = [];
    for (let b = 0; b < 3 + Math.floor(r() * 2); b++) breaks.push({ ang: r() * Math.PI * 2, span: 0.25 + r() * 0.45 });
    for (let i = 0; i < ringCount; i++) {
      const t = i / (ringCount - 1);
      const rx = 2 + t * baseRx + (r() - 0.5) * 0.8;
      const ry = 2.5 + t * baseRy + (r() - 0.5) * 0.8;
      const peri = Math.PI * (rx + ry);
      const step = 0.9 + r() * 0.4;
      const n = Math.max(20, Math.floor(peri / step));
      for (let j = 0; j < n; j++) {
        const a = j / n * Math.PI * 2;
        let skip = false;
        for (const b of breaks) {
          let da = Math.abs((a - b.ang + Math.PI) % (2 * Math.PI) - Math.PI);
          if (da < b.span && i > 3 && r() > 0.35) skip = true;
        }
        if (skip) continue;
        if (r() < 0.06) continue;
        const ex = rx * Math.cos(a),ey = ry * Math.sin(a);
        const x = cx + Math.cos(tilt) * ex - Math.sin(tilt) * ey + (r() - 0.5) * 0.55;
        const y = cy + Math.sin(tilt) * ex + Math.cos(tilt) * ey + (r() - 0.5) * 0.55;
        const distFromCenter = Math.sqrt(((x - cx) / baseRx) ** 2 + ((y - cy) / baseRy) ** 2);
        const pressureSide = (Math.cos(a + 0.6) + 1) / 2;
        const pressureFade = Math.max(0, 1 - Math.pow(distFromCenter, 2.4));
        let alpha = (0.35 + 0.55 * pressureSide) * pressureFade;
        alpha *= 0.55 + r() * 0.6;
        if (alpha < 0.06) continue;
        let rad = 0.35 + r() * 0.4;
        if (r() < 0.06) rad += 0.4;
        if (r() < 0.015) rad += 0.7;
        arr.push({ x, y, r: rad, a: alpha });
      }
    }
    for (let i = 0; i < 18; i++) {
      const a = i * 0.6,rr = 0.6 + i * 0.55;
      const x = cx + Math.cos(a + tilt) * rr + (r() - 0.5) * 0.3;
      const y = cy + Math.sin(a + tilt) * rr * 1.15 + (r() - 0.5) * 0.3;
      arr.push({ x, y, r: 0.4 + r() * 0.25, a: 0.55 + r() * 0.25 });
    }
    return arr;
  }, [seed, ringCount]);
  return (
    <svg viewBox="0 0 100 130" className="fp__svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={`m-${seed}`} cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="65%" stopColor="#fff" stopOpacity=".9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`mk-${seed}`}><rect width="100" height="130" fill={`url(#m-${seed})`} /></mask>
        <filter id={`f-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="0.45" />
        </filter>
      </defs>
      <g mask={`url(#mk-${seed})`} filter={`url(#f-${seed})`} fill={color}>
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.a} />)}
      </g>
    </svg>);

}

function Fingerprints() {
  const items = [
  { cls: 'p1', seed: 11, color: '#1a140e', density: 'dense' },
  { cls: 'p2 lg', seed: 22, color: '#241a10', density: 'normal' },
  { cls: 'p3', seed: 33, color: '#1a140e', density: 'dense' },
  { cls: 'p4 sm smudge', seed: 44, color: '#3a2c1c', density: 'sparse' },
  { cls: 'p5', seed: 55, color: '#241a10', density: 'normal' },
  { cls: 'p6 sm smudge', seed: 66, color: '#3a2c1c', density: 'sparse' },
  { cls: 'p7 sm', seed: 77, color: '#241a10', density: 'normal' },
  { cls: 'p8 sm smudge', seed: 88, color: '#3a2c1c', density: 'sparse' }];

  return (
    <div className="t3__prints" aria-hidden="true">
      {items.map((it, i) =>
      <div key={i} className={`fp ${it.cls}`}>
          <Fingerprint seed={it.seed} color={it.color} density={it.density} />
        </div>
      )}
    </div>);

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

function Team({ color = false, showFile = true, showPrints = true, showSmudges = false } = {}) {
  const { t } = useT();
  const cls = ['t3'];
  if (color) cls.push('is-color');
  if (showFile) cls.push('is-file');
  if (!showPrints) cls.push('no-prints');
  if (!showSmudges) cls.push('no-smudges');

  const members = getT3Members(t);
  const sealTop = t('team.foot.seal.top').split('\n');

  return (
    <section className={cls.join(' ')} id="equipo" data-screen-label="03 Team" data-nav-theme="light">
      {showSmudges &&
      <div className="t3__smudges" aria-hidden="true">
          <div className="t3__smudge t3__smudge--l1"></div>
          <div className="t3__smudge t3__smudge--l2"></div>
          <div className="t3__smudge t3__smudge--r1"></div>
          <div className="t3__smudge t3__smudge--r2"></div>
        </div>
      }

      <div className="t3__topbar" style={{ display: 'none' }}>
        <span className="l">
          <span className="dot"></span>
          <span>{t('team.topbar.l')}</span>
        </span>
        <span>{t('team.topbar.r')}</span>
      </div>

      <header className="t3__head" style={{ display: 'none' }}>
        <div className="t3__kicker">
          <span className="num">03</span>
          <span>{t('team.kicker')}</span>
        </div>
        <div></div>
        <div className="right">
          <span>{t('team.kicker.right1')}</span>
          <span>{t('team.kicker.right2')}</span>
        </div>
      </header>

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

      <div className="t3__foot" style={{ display: 'none', padding: "24px 0px 61.6px" }}>
        <div><span className="k">{t('team.foot.archivo.k')}</span><span className="v">{t('team.foot.archivo.v')}</span></div>
        <div><span className="k">{t('team.foot.cargo.k')}</span><span className="v">{t('team.foot.cargo.v')}</span></div>
        <div><span className="k">{t('team.foot.contacto.k')}</span><span className="v">adsgroup@ads-partners.com</span></div>
        <div className="seal">
          <div className="seal__top">{sealTop[0]}<br />{sealTop[1]}</div>
          <div className="seal__bot">{t('team.foot.seal.bot')}</div>
        </div>
      </div>
    </section>);

}

window.Team = Team;