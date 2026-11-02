// La 404 (pages/404.astro): un 404 roto a glitchazos y la dirección que escribiste, que se repara delante de ti.
// La corrección se calcula de verdad:
//   1. las fichas de proyecto que se borraron (/proyectos/<slug>/) llevan al archivo, a su proyecto (/proyectos/#slug);
//   2. sinónimos (nosotros → About, servicios → Tech, contacto → la carta…), si esa página existe;
//   3. si no, la distancia de edición (Damerau-Levenshtein) contra las páginas que hay y los sinónimos;
//   4. si nada se parece lo bastante, la página principal.
// La reparación son los pasos de esa misma distancia de edición, de la dirección escrita a la buena: cada letra que
// sobra se desintegra, cada una que falta entra pixelada y cada cambio es un glitch (y suena). Cada paso queda apuntado
// en la capa de código del 404 (erratas-glitch.js).
import * as sonido from './sonido.js';
import { crearRoto } from './erratas-glitch.js';
import { montarGlitch } from './tech/glitch.js';

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

// Distancia de edición con transposiciones (Damerau-Levenshtein, la versión de cadena óptima): la tabla entera, para
// poder sacar después los pasos
function tabla(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + coste);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d;
}
const distancia = (a, b) => tabla(a, b)[a.length][b.length];

// Los pasos para pasar de a a b, en orden: igual, cambia (una letra por otra), sobra, falta y cruza (dos letras que se
// intercambian). Se recorre la tabla desde el final hacia atrás. Entre caminos igual de cortos se queda el que más
// cruza y más cambia (/tehc → /tech/ se entiende mejor como «cruza h y c, pon /» que como «pon c, cambia c por /»):
// por eso se prueba con dos órdenes de preferencia
export function pasos(a, b) {
  const d = tabla(a, b);
  const recorrer = (orden) => {
    const lista = [];
    let i = a.length, j = b.length;
    const vale = {
      igual: () => i > 0 && j > 0 && a[i - 1] === b[j - 1] && d[i][j] === d[i - 1][j - 1],
      cruza: () => i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && a[i - 1] !== a[i - 2] && d[i][j] === d[i - 2][j - 2] + 1,
      cambia: () => i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1,
      sobra: () => i > 0 && d[i][j] === d[i - 1][j] + 1,
      falta: () => j > 0 && d[i][j] === d[i][j - 1] + 1,
    };
    const hacer = {
      igual: () => { lista.push({ tipo: 'igual', a: a[i - 1], b: b[j - 1] }); i--; j--; },
      cruza: () => { lista.push({ tipo: 'cruza', a: a[i - 2] + a[i - 1], b: b[j - 2] + b[j - 1] }); i -= 2; j -= 2; },
      cambia: () => { lista.push({ tipo: 'cambia', a: a[i - 1], b: b[j - 1] }); i--; j--; },
      sobra: () => { lista.push({ tipo: 'sobra', a: a[i - 1], b: '' }); i--; },
      falta: () => { lista.push({ tipo: 'falta', a: '', b: b[j - 1] }); j--; },
    };
    while (i > 0 || j > 0) hacer[orden.find((t) => vale[t]())]();
    return lista.reverse();
  };
  const cuantas = (l, t) => l.filter((p) => p.tipo === t).length;
  return [
    recorrer(['igual', 'cruza', 'cambia', 'sobra', 'falta']),
    recorrer(['igual', 'cruza', 'falta', 'sobra', 'cambia']),
  ].sort((x, y) => cuantas(y, 'cruza') - cuantas(x, 'cruza') || cuantas(y, 'cambia') - cuantas(x, 'cambia'))[0];
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
      if (d) return { ...d, como: `«${objetivo}» se parece a «${m.palabra}»: distancia ${m.d}, parecido ${Math.round(m.parecido * 100)} %` };
    }
  }

  // 4. Nada se parece: la página principal
  return { ...destino(''), texto: '/', como: 'No sabemos qué buscabas: empieza por aquí' };
}


const GLIFOS = '#%&@$*+=<>/\\|01ΔΣ¶§░▒';
const glifo = () => GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const RELOJ = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'medium' });

export async function montarErratas({ reducido, conRaton }) {
  const raiz = document.querySelector('[data-erratas]');
  if (!raiz) return;
  const $ = (s) => raiz.querySelector(s);
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
  const lista = pasos(escrita, c.texto);
  const ms = performance.now() - t0;

  const dir = $('[data-err-dir]'), ruta = $('[data-err-ruta]'), ir = $('[data-err-ir]'), calculo = $('[data-err-calculo]');
  $('[data-err-host]').textContent = location.host || 'ads-partners.com';
  dir.href = ir.href = c.href;
  $('[data-err-ir-txt]').textContent = `Ir a ${c.nombre}`;

  // El resumen: cuántos pasos de cada tipo y por qué esa página
  const cuenta = { cambia: 0, sobra: 0, falta: 0, cruza: 0 };
  lista.forEach((p) => { if (p.tipo in cuenta) cuenta[p.tipo]++; });
  const total = cuenta.cambia + cuenta.sobra + cuenta.falta + cuenta.cruza;
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const partes = [
    cuenta.sobra && plural(cuenta.sobra, 'fuera', 'fuera'),
    cuenta.cambia && plural(cuenta.cambia, 'cambiada', 'cambiadas'),
    cuenta.falta && plural(cuenta.falta, 'nueva', 'nuevas'),
    cuenta.cruza && plural(cuenta.cruza, 'cruzada', 'cruzadas'),
  ].filter(Boolean);
  const resumir = () => {
    calculo.innerHTML = '';
    const etiqueta = document.createElement('span');
    etiqueta.className = 'insp';
    etiqueta.textContent = `Corregido en ${ms < 0.1 ? 'menos de 0,1' : ms.toFixed(1).replace('.', ',')} ms`;
    const que = total ? `${plural(total, 'cambio', 'cambios')} (${partes.join(', ')}) · ${c.como}` : c.como;
    calculo.append(etiqueta, document.createTextNode(que));
    $('[data-err-anuncio]').textContent = `Querías decir ${c.texto}: ${c.nombre}.`;
  };

  // --- El 404 roto (canvas). Las letras tienen que estar para pintarlo -----------------------------------------------
  await Promise.race([
    Promise.all(['300 100px "Apple Garamond"', '400 11px "Geist Mono"'].map((f) => document.fonts.load(f))),
    esperar(1500),
  ]).catch(() => {});
  let roto = null;
  try {
    roto = crearRoto({ lienzo: $('[data-err-lienzo]'), hueco: $('[data-err-404]'), zona: $('[data-err-zona]'), reducido, movil: !conRaton });
    raiz.classList.add('con-lienzo');
  } catch (e) { console.warn('404 sin lienzo:', e); }
  // Los textos, con el glitch de Tech: solo las letras de la zona por la que pasa el ratón
  if (conRaton && !reducido) montarGlitch(raiz);

  // La capa tech de detrás: la petición que ha fallado, la corrección y, según se repara, cada paso
  const peticion = [
    `GET ${escrita} HTTP/1.1`,
    `Host: ${location.host || 'ads-partners.com'}`,
    `Referer: ${document.referrer || '(has entrado directo)'}`,
    '',
    '← 404 Not Found',
    `Date: ${RELOJ.format(new Date())} (Madrid)`,
  ];
  const calculoCodigo = [`// corregir('${escrita}')`, `// ${c.como}`, `→ ${c.texto}`, ''];
  const registro = [];
  const ponerCodigo = () => {
    if (!roto) return;
    const { W, H } = roto.tamano();
    const estrecho = W < 760, lh = estrecho ? 15 : 17;
    const lineas = [];
    const x1 = estrecho ? 16 : Math.round(Math.max(24, W * 0.05)), y1 = estrecho ? 84 : Math.round(H * 0.17);
    const arriba = estrecho ? [...peticion, '', ...registro.slice(-4)] : peticion;
    arriba.forEach((t, i) => lineas.push({ t, x: x1, y: y1 + i * lh, a: 0.22, rosa: t.startsWith('←') }));
    if (!estrecho) {
      const x2 = Math.round(W - Math.min(400, W * 0.3)), y2 = Math.round(H * 0.56);
      [...calculoCodigo, ...registro.slice(-9)].forEach((t, i) => lineas.push({ t, x: x2, y: y2 + i * lh, a: 0.22, rosa: t.startsWith('→') }));
    }
    roto.codigo(lineas);
  };
  ponerCodigo();
  addEventListener('resize', () => { roto?.medir(); ponerCodigo(); });

  // Un clic en el 404 lo revienta (y la página tiembla un momento)
  const temblar = (dura) => {
    raiz.classList.remove('es-tormenta');
    void raiz.offsetWidth;
    raiz.classList.add('es-tormenta');
    setTimeout(() => raiz.classList.remove('es-tormenta'), dura);
  };
  $('[data-err-zona]').addEventListener('click', (e) => {
    if (e.target.closest('a, button') || reducido) return;
    roto?.golpe(1.3);
    sonido.glitch(1, e.clientX / innerWidth);
    temblar(320);
  });

  // --- La dirección: se escribe la tuya y se repara paso a paso -------------------------------------------------------
  ruta.textContent = '';
  const piezas = lista.map((p) => {
    const el = document.createElement('span');
    el.className = 'err__l';
    el.textContent = p.a;
    if (p.tipo === 'falta') el.classList.add('es-hueco');
    ruta.append(el);
    return { p, el };
  });
  if (reducido) {
    ruta.textContent = c.texto;
    dir.classList.add('es-arreglada');
    ir.classList.add('es-visible');
    resumir();
    return;
  }

  // Al llegar, la página se rompe entera (la tormenta) y luego empieza a arreglarse
  temblar(900);
  roto?.golpe(1.5);
  sonido.glitch(1, 0.5);
  await esperar(1100);

  const fallar = async (el, n, cada, largo) => {
    el.classList.add('es-fallo');
    for (let k = 0; k < n; k++) {
      el.textContent = Array.from({ length: largo || el.textContent.length || 1 }, glifo).join('');
      el.style.setProperty('--fx', `${(Math.random() * 2 - 1) * 5}px`);
      el.style.setProperty('--fy', `${(Math.random() * 2 - 1) * 3}px`);
      await esperar(cada);
    }
  };
  const apunte = {
    cambia: (p) => `cambia '${p.a}' por '${p.b}'`,
    sobra: (p) => `quita '${p.a}'`,
    falta: (p) => `pone '${p.b}'`,
    cruza: (p) => `cruza '${p.a}' → '${p.b}'`,
  };
  const cada = Math.max(28, Math.min(60, 900 / Math.max(1, total)));
  for (const { p, el } of piezas) {
    if (p.tipo === 'igual') continue;
    sonido.glitch(0.7, el.getBoundingClientRect().left / innerWidth);
    roto?.golpe(0.32);
    registro.push(apunte[p.tipo](p));
    ponerCodigo();
    if (p.tipo === 'sobra') {
      await fallar(el, 3, cada);
      el.classList.add('es-fuera');
      await esperar(cada * 2);
      el.remove();
      continue;
    }
    if (p.tipo === 'falta') el.classList.remove('es-hueco');
    await fallar(el, 3, cada, p.b.length);
    el.textContent = p.b;
    el.classList.remove('es-fallo');
    await esperar(cada);
  }
  ruta.textContent = c.texto;
  dir.classList.add('es-arreglada');
  roto?.golpe(0.6);
  sonido.glitch(0.9, 0.5);
  await esperar(240);
  ir.classList.add('es-visible');
  resumir();
}
