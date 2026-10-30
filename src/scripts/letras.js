// Las letras que notan el ratón: solo las de la zona por la que pasa, no el texto entero. Cada letra lleva su muelle:
// si el ratón pasa deprisa cerca, se lleva un empujón según lo cerca que estaba, y vuelve sola. Quieto, no hay nada.
// Lo comparten los textos vivos de la home (vivo.js) y el glitch de Tech (tech/glitch.js); cada uno pone su aspecto.
// Solo con ratón. El texto se parte en una letra por <span class="letra"> la primera vez que el ratón se acerca, sin
// tocar lo que lleva dentro (cursivas, ®, las líneas de SplitText); si alguien cambia el texto, se vuelve a partir.
import { gsap } from 'gsap';

const suave = (w) => w * w * (3 - 2 * w);

// Una letra por <span>; los espacios se quedan como texto, así las líneas se cortan igual que antes
function trocear(el) {
  const letras = [];
  const recorrer = (nodo) => {
    for (const h of [...nodo.childNodes]) {
      if (h.nodeType === Node.ELEMENT_NODE) {
        if (h.classList.contains('letra')) letras.push(h);
        else recorrer(h);
        continue;
      }
      if (h.nodeType !== Node.TEXT_NODE || !h.data.trim()) continue;
      const f = document.createDocumentFragment();
      let blanco = '';
      for (const c of h.data) {
        if (/\s/.test(c)) { blanco += c; continue; }
        if (blanco) { f.append(blanco); blanco = ''; }
        const l = document.createElement('span');
        l.className = 'letra';
        l.textContent = c;
        f.append(l);
        letras.push(l);
      }
      if (blanco) f.append(blanco);
      h.replaceWith(f);
    }
  };
  recorrer(el);
  return letras;
}

// pintar(letra, k, i, s): cada fotograma, para cada letra que se mueve (k va de -1 a 1, con el signo hacia donde va
// el ratón). apagar(letra): cuando vuelve a su sitio. despues(el, s, zona): una vez por texto, con la letra más movida.
export function letrasQueNotan(els, { velMax, radio, vale = () => true, pintar, apagar, despues }) {
  if (!els.length) return;
  const visibles = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target))));
  const estado = new Map(els.map((el) => [el, { letras: [], txt: null, pos: null, e: null, k: null, v: null, activas: 0, R: 0, fs: 0, ancho: 0, alto: 0 }]));
  els.forEach((el) => io.observe(el));
  // Si cambia la maqueta, cada texto vuelve a medir dónde tiene las letras la próxima vez que se acerque el ratón
  const remedir = () => estado.forEach((s) => (s.pos = null));
  addEventListener('resize', remedir);
  document.fonts?.ready.then(remedir);

  const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, px: null, py: 0, t: 0 };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = performance.now();
    if (m.px !== null) {
      const dt = Math.max(8, t - m.t) / 1000;
      m.vx = m.vx * 0.6 + ((e.clientX - m.px) / dt) * 0.4;
      m.vy = m.vy * 0.6 + ((e.clientY - m.py) / dt) * 0.4;
    }
    m.px = m.x = e.clientX; m.py = m.y = e.clientY; m.t = t;
  }, { passive: true });

  const partir = (el, s) => {
    s.letras = trocear(el);
    s.txt = el.textContent;
    s.e = new Float32Array(s.letras.length);
    s.k = new Float32Array(s.letras.length);
    s.v = new Float32Array(s.letras.length);
    s.pos = null;
    s.activas = 0;
  };
  // Centro de cada letra respecto al texto (se mide sin los empujones, que son de pocos píxeles)
  const medir = (el, s, r) => {
    s.ancho = r.width; s.alto = r.height;
    s.fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    s.R = radio(s.fs);
    s.pos = new Float32Array(s.letras.length * 2);
    s.letras.forEach((l, i) => {
      const q = l.getBoundingClientRect();
      s.pos[i * 2] = q.left + q.width / 2 - r.left;
      s.pos[i * 2 + 1] = q.top + q.height / 2 - r.top;
    });
  };

  let t0 = performance.now();
  const cola = [];
  gsap.ticker.add(() => {
    const t = performance.now(); const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    if (t - m.t > 50) { m.vx *= Math.exp(-dt * 10); m.vy *= Math.exp(-dt * 10); }
    const rapidez = Math.min(1, Math.hypot(m.vx, m.vy) / velMax);
    const signo = m.vx < 0 ? -1 : 1;

    // Primero se lee todo (dónde está cada texto y, si hace falta, cada letra) y después se escribe
    cola.length = 0;
    for (const el of els) {
      const s = estado.get(el);
      const vivo = visibles.has(el) && vale(el);
      if (!vivo && !s.activas) continue;
      const r = el.getBoundingClientRect();
      const R = s.R || 160;
      const cerca = vivo && rapidez > 0.01 && m.x > r.left - R && m.x < r.right + R && m.y > r.top - R && m.y < r.bottom + R;
      if (!cerca && !s.activas) continue;
      if (cerca && (!s.letras[0]?.isConnected || el.textContent !== s.txt)) partir(el, s);
      if (cerca && (!s.pos || r.width !== s.ancho || r.height !== s.alto)) medir(el, s, r);
      if (!s.pos) continue;
      cola.push(el, s, r, cerca);
    }

    // Cada letra se carga cuando el ratón pasa cerca y la carga se le va en unos 150 ms: un ratón rápido cruza una
    // letra en pocos fotogramas, y sin esa carga el muelle no llegaría a cogerla
    const descarga = Math.exp(-7 * dt);
    for (let c = 0; c < cola.length; c += 4) {
      const el = cola[c], s = cola[c + 1], r = cola[c + 2], cerca = cola[c + 3];
      let activas = 0, max = 0, imax = -1;
      for (let i = 0; i < s.letras.length; i++) {
        let e = s.e[i] * descarga;
        if (cerca) {
          // La zona es algo más ancha que alta: así coge sobre todo la línea que toca
          const d = Math.hypot(r.left + s.pos[i * 2] - m.x, (r.top + s.pos[i * 2 + 1] - m.y) * 1.5);
          const o = d < s.R ? rapidez * suave(1 - d / s.R) * signo : 0;
          if (Math.abs(o) > Math.abs(e)) e = o;
        }
        if (Math.abs(e) < 0.005) e = 0;
        s.e[i] = e;
        let k = s.k[i], v = s.v[i];
        if (!e && !k && !v) continue;
        // Muelle algo flojo: se pasa un poco y vuelve
        v += (e - k) * 240 * dt;
        v *= Math.exp(-14 * dt);
        k += v * dt;
        if (Math.abs(k) < 0.005 && Math.abs(v) < 0.02 && !e) {
          s.k[i] = 0; s.v[i] = 0;
          apagar(s.letras[i]);
          continue;
        }
        s.k[i] = k; s.v[i] = v;
        activas++;
        if (Math.abs(k) > max) { max = Math.abs(k); imax = i; }
        pintar(s.letras[i], k, i, s);
      }
      s.activas = activas;
      despues?.(el, s, { r, max, imax, t });
    }
  });
}
