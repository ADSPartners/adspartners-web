// La 404, «Fe de erratas» (pages/404.astro): qué dirección escribiste y cuál es la buena. Se calcula de verdad:
//   1. las fichas de proyecto que se borraron (/proyectos/<slug>/) llevan al archivo, a su proyecto (/proyectos/#slug);
//   2. sinónimos (nosotros → About, servicios → Tech, contacto → la carta…), si esa página existe;
//   3. si no, la distancia de edición (Damerau-Levenshtein) contra las páginas que hay y los sinónimos;
//   4. si nada se parece lo bastante, la página principal.
// Después se escribe la fila: lo que dice (a máquina), el tachón en píxeles y lo que debe decir.
import * as sonido from './sonido.js';

const SINONIMOS = {
  about: ['nosotros', 'quienes-somos', 'quienessomos', 'sobre-nosotros', 'equipo', 'team', 'about-us', 'aboutus', 'socios', 'alvaro', 'sebas'],
  brand: ['marca', 'branding', 'identidad', 'diseno', 'design', 'logo'],
  tech: ['tecnologia', 'servicios', 'services', 'ia', 'ai', 'automatizacion', 'automatizaciones', 'software', 'desarrollo', 'it', 'apps'],
  proyectos: ['portfolio', 'portafolio', 'trabajos', 'trabajo', 'work', 'casos', 'clientes', 'proyecto', 'projects'],
  '#contacto': ['contacto', 'contact', 'hablemos', 'presupuesto', 'quedamos', 'carta', 'escribenos'],
  'aviso-legal': ['legal', 'aviso', 'legales', 'terminos', 'condiciones', 'legal-notice'],
  privacidad: ['privacy', 'politica-de-privacidad', 'politica-privacidad', 'rgpd', 'gdpr', 'proteccion-de-datos', 'privacy-policy'],
  cookies: ['politica-de-cookies', 'cookie-policy', 'cookie'],
  '': ['inicio', 'home', 'index', 'principal'],
};

// Distancia de edición con transposiciones (Damerau-Levenshtein, la versión de cadena óptima)
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + coste);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

const normal = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\.(html?|php|aspx?)$/, '');

export function corregir(ruta, rutas, proyectos, base) {
  const existe = (slug) => rutas.find((r) => r.slug === slug);
  const destino = (slug, extra = '') => {
    if (slug === '#contacto') return { href: `${base}#contacto`, texto: '/#contacto', nombre: 'la carta de la página principal' };
    const r = existe(slug);
    return r ? { href: `${r.href}${extra}`, texto: `/${slug ? `${slug}/` : ''}${extra}`, nombre: r.nombre } : null;
  };
  const trozos = normal(ruta).split('/').filter(Boolean).filter((t) => t !== 'index');

  // 1. Las fichas de proyecto que ya no existen
  if (trozos[0] === 'proyectos' && trozos[1]) {
    const slug = trozos[1];
    let mejor = proyectos.find((p) => p.slug === slug);
    if (!mejor) {
      const [p, dd] = proyectos.map((pr) => [pr, distancia(slug, pr.slug)]).sort((x, y) => x[1] - y[1])[0] || [];
      if (p && 1 - dd / Math.max(slug.length, p.slug.length) >= 0.5) mejor = p;
    }
    const d = destino('proyectos', mejor ? `#${mejor.slug}` : '');
    if (d) return { ...d, como: mejor ? `Las fichas de proyecto ya no existen: ${mejor.nombre} está en el archivo` : 'Las fichas de proyecto ya no existen: todo está en el archivo' };
  }

  // 2. Sinónimos: la dirección entera, cada trozo y cada palabra (del último trozo al primero)
  const candidatos = [];
  [...trozos].reverse().forEach((t) => { candidatos.push(t); t.split(/[-_.+\s]+/).forEach((p) => p && p !== t && candidatos.push(p)); });
  for (const c of candidatos) {
    const directa = rutas.find((r) => r.slug && r.slug === c);
    if (directa) return { ...destino(directa.slug), como: `«${c}» está, pero no ahí` };
    for (const [slug, lista] of Object.entries(SINONIMOS)) {
      if (lista.includes(c)) {
        const d = destino(slug);
        if (d) return { ...d, como: `«${c}» lo tenemos apuntado como sinónimo de ${d.nombre}` };
      }
    }
  }

  // 3. La distancia de edición contra las páginas y los sinónimos de las que existen
  const objetivo = trozos[trozos.length - 1] || '';
  if (objetivo) {
    const opciones = [];
    rutas.filter((r) => r.slug).forEach((r) => opciones.push([r.slug, r.slug]));
    Object.entries(SINONIMOS).forEach(([slug, lista]) => { if (slug === '#contacto' || existe(slug)) lista.forEach((s) => opciones.push([slug, s])); });
    const medidas = opciones.map(([slug, palabra]) => {
      const d = distancia(objetivo, palabra);
      return { slug, palabra, d, parecido: 1 - d / Math.max(objetivo.length, palabra.length) };
    }).sort((x, y) => y.parecido - x.parecido || x.d - y.d);
    const m = medidas[0];
    if (m && m.parecido >= 0.45) {
      const d = destino(m.slug);
      if (d) return { ...d, como: `Distancia de edición ${m.d} con «${m.palabra}» · parecido ${Math.round(m.parecido * 100)} %` };
    }
  }

  // 4. Nada se parece: la página principal
  return { ...destino(''), texto: '/', como: 'No sabemos qué buscabas: empieza por aquí' };
}

export function montarErratas({ reducido }) {
  const raiz = document.querySelector('[data-erratas]');
  if (!raiz) return;
  const base = raiz.dataset.base || '/';
  const rutas = JSON.parse(raiz.dataset.rutas);
  const proyectos = JSON.parse(raiz.dataset.proyectos);

  // Lo que escribiste: la dirección de verdad o, para probar, ?donde=/ruta
  const params = new URLSearchParams(location.search);
  let escrita = params.get('donde') || location.pathname;
  try { escrita = decodeURIComponent(escrita); } catch (e) { /* tal cual */ }
  if (escrita.startsWith(base)) escrita = `/${escrita.slice(base.length)}`;
  if (!escrita.startsWith('/')) escrita = `/${escrita}`;

  const t0 = performance.now();
  const c = corregir(escrita, rutas, proyectos, base);
  const ms = performance.now() - t0;

  const dice = raiz.querySelector('[data-err-dice]');
  const celda = dice.parentElement;
  const tachon = raiz.querySelector('[data-err-tachon]');
  const debe = raiz.querySelector('[data-err-debe]');
  const calculo = raiz.querySelector('[data-err-calculo]');
  debe.href = c.href;
  debe.setAttribute('aria-label', `${c.nombre}: ${c.texto}`);
  const explicar = () => {
    calculo.innerHTML = '';
    const etiqueta = document.createElement('span');
    etiqueta.className = 'insp';
    etiqueta.textContent = `Corregido en ${ms < 0.1 ? 'menos de 0,1' : ms.toFixed(1).replace('.', ',')} ms`;
    calculo.append(etiqueta, document.createTextNode(c.como));
  };

  if (reducido) {
    dice.textContent = escrita;
    celda.classList.add('es-tachada');
    tachon.style.setProperty('--tachon', '100%');
    debe.textContent = c.texto;
    explicar();
    return;
  }

  // A máquina: lo que dice, el tachón (de izquierda a derecha, a saltos de píxel) y lo que debe decir
  const escribir = (el, texto, cada) => new Promise((listo) => {
    let i = 0;
    el.textContent = '';
    const paso = () => {
      el.textContent = texto.slice(0, ++i);
      if (i % 2) sonido.tecla(0.5);
      if (i < texto.length) setTimeout(paso, cada); else listo();
    };
    paso();
  });
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    debe.textContent = '';
    await esperar(500);
    await escribir(dice, escrita, 38);
    await esperar(260);
    celda.classList.add('es-tachada');
    for (let p = 0; p <= 100; p += 12.5) { tachon.style.setProperty('--tachon', `${p}%`); await esperar(28); }
    sonido.glitch(0.4, 0.5);
    await esperar(320);
    debe.classList.add('es-escribiendo');
    await escribir(debe, c.texto, 55);
    debe.classList.remove('es-escribiendo');
    explicar();
  })();
}
