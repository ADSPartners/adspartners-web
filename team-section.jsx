/* global React, useT */
const { useMemo: useMemoT3, useState: useStateT3 } = React;

function getT3Members(t) {
  return [
  {
    id: 'alvaro', first: 'Álvaro', last: 'Espinosa', role: t('team.role.alvaro'),
    file: 'AE—01·26',
    photo: 'assets/team/alvaro.png?v=2',
    pos: 'center 28%',
    stats: [
    { k: t('team.stat.coffees'), v: '26,7' },
    { k: t('team.stat.sleep'), v: '5,7' },
    { k: t('team.stat.ontime'), v: '0' },
    { k: t('team.stat.alvaro.note'), v: '' }]

  },
  {
    id: 'daniel', first: 'Daniel', last: 'Céspedes', role: t('team.role.daniel'),
    file: 'DC—02·26',
    photo: 'assets/team/dani.png?v=2',
    pos: 'center 18%',
    stats: [
    { k: t('team.stat.coffees'), v: '3' },
    { k: t('team.stat.sleep'), v: '4,3' },
    { k: t('team.stat.dani.financiacion'), v: <>10,3<span className="t3__unit">(M)</span>€</> },
    { k: t('team.stat.dani.note'), v: '' }]

  },
  {
    id: 'sebas', first: 'Sebastián', last: 'Lorenzo', role: t('team.role.sebas'),
    file: 'SL—03·26',
    photo: 'assets/team/sebas.png?v=2',
    pos: 'center 18%',
    stats: [
    { k: t('team.stat.coffees'), v: '19' },
    { k: t('team.stat.sleep'), v: t('team.stat.sebas.sleep') },
    { k: t('team.stat.sebas.pitis'), v: '4' },
    { k: t('team.stat.sebas.note'), v: '' }]

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
  return (
    <article
      className={'t3__pol' + (flipped ? ' is-flip' : '')}
      onClick={() => setFlipped((f) => !f)}
      role="button" tabIndex={0}
      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();setFlipped((f) => !f);}}}
      aria-pressed={flipped}
      data-cursor="cta">
      
      <div className="t3__pol__inner">
        <div className="t3__pol__face t3__pol__face--front">
          <div className="t3__photo" data-fileno={m.file}>
            <span className="id">FILE · 0{i + 1}/03</span>
            <img src={m.photo} alt={`${m.first} ${m.last}`} style={{ objectPosition: m.pos }} />
          </div>
          <div className="t3__cap">
            <span className="name">{m.last}, {m.first}</span>
            <span className="role">0{i + 1} / 03</span>
          </div>
        </div>
        <div className="t3__pol__face t3__pol__face--back">
          <div className="t3__back">
            <div className="t3__back__head">
              <span className="t3__back__id">{m.file}</span>
              <span className="t3__back__no">0{i + 1} / 03</span>
            </div>
            <div className="t3__back__name">
              <span className="t3__back__first">{m.first}</span>
              <span className="t3__back__last">{m.last}</span>
            </div>
            <ul className="t3__back__stats">
              {m.stats.map((s, j) =>
              <li key={j} className={!s.v ? 't3__back__note' : undefined}>
                  {s.v ?
                <>
                      <span className="k">{s.k}</span>
                      <span className="dots" aria-hidden="true"></span>
                      <span className="v">{s.v}</span>
                    </> :
                <span className="note">{s.k}</span>}
                </li>
              )}
            </ul>
            <div className="t3__back__foot">
              <span>{t('team.archivado')}</span>
              <span>{t('team.adsp.founder')}</span>
            </div>
          </div>
          <div className="t3__cap">
            <span className="name">{m.last}, {m.first}</span>
            <span className="role">{t('team.expediente')}</span>
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

      <div className="t3__topbar">
        <span className="l">
          <span className="dot"></span>
          <span>{t('team.topbar.l')}</span>
        </span>
        <span>{t('team.topbar.r')}</span>
      </div>

      <header className="t3__head">
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
        <h1>
          <span dangerouslySetInnerHTML={{ __html: t('team.title.1.html') }} /><br />
          <span className="sub">{t('team.title.2')}</span>
        </h1>
        <p className="lede">{t('team.lede')}</p>
      </div>

      <div className="t3__stage">
        <div className="t3__row">
          {showPrints && <Fingerprints />}
          {members.map((m, i) => <Polaroid key={m.id} m={m} i={i} />)}
        </div>

        <p className="t3__credit">
          <b>Álvaro Espinosa</b><span className="sep">/</span>
          <b>Daniel Céspedes</b><span className="sep">/</span>
          <b>Sebastián Lorenzo</b>
        </p>
      </div>

      <div className="t3__foot" style={{ padding: "24px 0px 61.6px" }}>
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