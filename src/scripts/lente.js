// La lente: fuera de la portada, el ratón sigue enseñando «por dentro». Sobre los textos grandes ([data-lente])
// un círculo deja ver las letras en contorno sobre una rejilla de plano, con la fuente y el tamaño reales del
// texto que tiene debajo. Es un fondo recortado al texto (background-clip: text): las letras no se duplican ni se
// mueven. Cada trozo de texto del titular que tienes debajo recibe su posición en pantalla en cada fotograma.
// Además, los botones marcados con [data-iman] se dejan atraer un poco.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function montarLente({ reducido }) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const html = document.documentElement;
  html.classList.add('lente-activa');
  const raiz = html.style;
  const aro = document.createElement('div');
  aro.className = 'lente';
  aro.setAttribute('aria-hidden', 'true');
  aro.innerHTML = '<span class="lente__dato mono"></span>';
  document.body.appendChild(aro);
  const dato = aro.firstElementChild;

  // Los titulares que no se parten en líneas al entrar se parten aquí: así una cursiva que salta de línea
  // queda en trozos de una sola línea y el círculo cae en su sitio
  document.fonts.ready.then(() => {
    document.querySelectorAll('[data-lente]').forEach((el) => {
      if (el.querySelector('em') && !el.querySelector('div')) SplitText.create(el, { type: 'lines' });
    });
  });

  const st = { x: -999, y: -999, tx: -999, ty: -999, r: 0, tr: 0 };
  let sobre = null;
  let trozos = [];
  let previo = performance.now();
  let quieto = 0;

  function mirar(destino) {
    const el = destino?.closest?.('[data-lente]') || null;
    if (el === sobre) return;
    sobre?.classList.remove('lente-sobre');
    sobre = el;
    st.tr = el ? 112 : 0;
    trozos = el ? [el, ...el.querySelectorAll('div, span:not(.oculto-accesible), em')] : [];
    el?.classList.add('lente-sobre');
    if (el) {
      const cs = getComputedStyle(el);
      const familia = cs.fontFamily.split(',')[0].replace(/["']/g, '');
      dato.textContent = `${el.tagName.toLowerCase()} · ${familia} ${cs.fontWeight} · ${Math.round(parseFloat(cs.fontSize))} px`;
      aro.classList.toggle('lente--clara', !!el.closest('.capitulo-claro'));
    }
  }
  window.addEventListener('pointermove', (e) => {
    st.tx = e.clientX; st.ty = e.clientY;
    if (st.x < -900) { st.x = st.tx; st.y = st.ty; }
    quieto = 0;
    mirar(e.target);
  }, { passive: true });
  window.addEventListener('scroll', () => mirar(document.elementFromPoint(st.tx, st.ty)), { passive: true });
  document.addEventListener('pointerleave', () => { sobre?.classList.remove('lente-sobre'); sobre = null; trozos = []; st.tr = 0; });

  gsap.ticker.add(() => {
    const ahora = performance.now(); const dt = Math.min(0.05, (ahora - previo) / 1000); previo = ahora;
    quieto += dt;
    if (Math.abs(st.r - st.tr) < 0.2 && st.tr === 0 && st.r === 0) return;
    const a = 1 - Math.exp(-(reducido ? 60 : 9) * dt);
    const ar = 1 - Math.exp(-(reducido ? 60 : 7) * dt);
    st.x += (st.tx - st.x) * a; st.y += (st.ty - st.y) * a;
    st.r += (st.tr - st.r) * ar;
    if (st.tr === 0 && st.r < 0.4) st.r = 0;
    raiz.setProperty('--lx', `${st.x.toFixed(1)}px`);
    raiz.setProperty('--ly', `${st.y.toFixed(1)}px`);
    raiz.setProperty('--lr', `${st.r.toFixed(1)}px`);
    // Posición en pantalla de cada trozo del titular (primero se lee todo y después se escribe)
    const cajas = trozos.map((t) => t.getBoundingClientRect());
    trozos.forEach((t, i) => { t.style.setProperty('--ox', `${cajas[i].left.toFixed(1)}px`); t.style.setProperty('--oy', `${cajas[i].top.toFixed(1)}px`); });
    aro.style.transform = `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(1)}px, 0)`;
    aro.style.setProperty('--d', `${(st.r * 2).toFixed(1)}px`);
    aro.classList.toggle('lente--visible', st.r > 2);
  });

  // Imanes: el botón se acerca un poco al ratón cuando está cerca, y vuelve con un pequeño rebote
  document.querySelectorAll('[data-iman]').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      if (reducido) return;
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
  });
}
