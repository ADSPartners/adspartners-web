// Build de la web de adsPartners.
//
// Qué hace, en cristiano:
//   - Compila el JSX UNA vez aquí (en el build), en vez de en el navegador de
//     cada visitante. Así desaparecen los ~3,14 MB de @babel/standalone y la
//     compilación en caliente que congelaba la web.
//   - Sustituye React "de desarrollo" por React de PRODUCCIÓN, auto-alojado en
//     /vendor (sin depender de unpkg.com).
//   - Genera un /dist listo para publicar en GitHub Pages.
//
// Importante: los .jsx siguen siendo el código fuente editable (se pueden subir
// por la web de GitHub como hasta ahora). La GitHub Action ejecuta este build en
// cada push, así que el flujo de trabajo no cambia.
//
// La lista de scripts y su ORDEN se leen del propio HTML, no se hardcodean: si
// añades o quitas un <script src="algo.jsx"> en un .html, el build se adapta.

import { transform as esbuildMinify } from 'esbuild';
import babel from '@babel/core';
import { JSDOM, VirtualConsole } from 'jsdom';
import { createHash } from 'node:crypto';
import {
  cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = import.meta.dirname;
// Salida en /docs porque GitHub Pages (deploy clásico desde rama, sin Actions)
// solo puede publicar la raíz o la carpeta /docs. Aquí servimos /docs.
const DIST = join(ROOT, 'docs');

// Páginas HTML que el build debe transformar (las demás se copian tal cual).
const PAGES = ['index.html', 'aviso-legal.html', 'cookies.html', 'privacidad.html'];

// Ficheros/carpetas de raíz que NO se publican (código fuente o config).
const SKIP_ROOT = new Set([
  'node_modules', '.git', '.github', 'dist', 'docs', 'build.mjs', 'package.json',
  'package-lock.json', 'pnpm-lock.yaml', '.gitignore', 'README.md',
]);

// React de producción auto-alojado; reemplaza a las versiones dev de unpkg.
const VENDOR_SCRIPTS = [
  '<script src="vendor/react.production.min.js"></script>',
  '<script src="vendor/react-dom.production.min.js"></script>',
];

const sha8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);
const isLocalJsx = (s) => /\.jsx$/.test(s) && !/^https?:/.test(s);

// Cache: dos páginas con el mismo set de scripts comparten bundle (legales).
const bundleCache = new Map();

function compileFile(src) {
  // Cada fichero se transpila con Babel POR SEPARADO, reproduciendo EXACTAMENTE
  // lo que hacía Babel en el navegador, pero una sola vez en el build:
  //   - JSX → React.createElement (preset-react)
  //   - const/let → var  (transform-block-scoping). Es la clave: en el navegador
  //     todos los .jsx comparten scope global y varios declaran el mismo
  //     `const { useState } = React`; al bajar a `var` no chocan. Sin esto,
  //     concatenar daría "useState already declared".
  // Lo que comparten entre sí = lo que cada fichero cuelga de `window.*` y las
  // `function`/`var` de nivel superior, que quedan globales (idéntico a hoy).
  const code = readFileSync(join(ROOT, src), 'utf8');
  const out = babel.transformSync(code, {
    filename: src,
    babelrc: false,
    configFile: false,
    presets: [['@babel/preset-react', { runtime: 'classic' }]],
    plugins: ['@babel/plugin-transform-block-scoping'],
    compact: false,
    comments: false,
  });
  return out.code;
}

async function compileBundle(srcs, stem) {
  const key = srcs.join('|');
  if (bundleCache.has(key)) return bundleCache.get(key);

  // Transpila cada fichero y concatena en el MISMO orden que el HTML. Tras bajar
  // a `var`, los duplicados entre ficheros son legales, así que se minifica todo
  // junto de una pasada con esbuild (no renombra globales en un script clásico).
  const combined = srcs
    .map((s) => `/* ${s} */\n${compileFile(s)}`)
    .join('\n;\n');

  const min = await esbuildMinify(combined, {
    loader: 'js',
    minify: true,
    target: ['es2018'],
    legalComments: 'none',
    charset: 'utf8',
  });
  const code = min.code;

  const name = `bundle.${stem}.${sha8(code)}.js`;
  writeFileSync(join(DIST, name), code);
  bundleCache.set(key, name);
  console.log(`  · ${name}  (${(code.length / 1024).toFixed(1)} KB)  ← ${srcs.join(' + ')}`);
  return name;
}

function transformHtml(html, bundleName) {
  // 1) Fuera los 3 scripts de unpkg (react dev, react-dom dev, @babel/standalone).
  html = html.replace(/[ \t]*<script\b[^>]*\bsrc="https?:\/\/unpkg\.com[^"]*"[^>]*><\/script>\s*\n?/g, '');
  // 2) Comentario "<!-- React + Babel -->" ya sin sentido.
  html = html.replace(/[ \t]*<!--\s*React \+ Babel\s*-->\s*\n?/g, '');

  // 3) Reemplaza el PRIMER <script src="*.jsx"> por React-prod + el bundle, y
  //    elimina el resto de scripts .jsx.
  let injected = false;
  html = html.replace(/[ \t]*<script\b[^>]*\bsrc="([^"]+\.jsx)"[^>]*><\/script>\s*\n?/g, (m, src) => {
    if (isLocalJsx(src) === false) return m;
    if (!injected) {
      injected = true;
      const tags = [...VENDOR_SCRIPTS, `<script src="${bundleName}"></script>`];
      return `  ${tags.join('\n  ')}\n`;
    }
    return '';
  });
  return html;
}

function copyStatic() {
  for (const entry of readdirSync(ROOT)) {
    if (SKIP_ROOT.has(entry)) continue;
    if (PAGES.includes(entry)) continue;          // las HTML se escriben transformadas
    if (/\.jsx$/.test(entry)) continue;           // el .jsx se compila al bundle
    cpSync(join(ROOT, entry), join(DIST, entry), { recursive: true });
  }
  // GitHub Pages no debe procesar el sitio con Jekyll.
  writeFileSync(join(DIST, '.nojekyll'), '');
}

// Pre-render de la home: ejecuta la app React en un DOM headless (jsdom) UNA vez
// en el build y hornea el HTML resultante dentro de <div id="root">. Así los bots
// que NO ejecutan JavaScript (crawlers de IA: GPTBot, ClaudeBot, PerplexityBot…, y
// también el primer pase de Google) ven el contenido real en el HTML crudo, en vez
// de un <div id="root"> vacío. En el navegador, React vuelve a montar limpio encima
// (la app usa createRoot().render(), que reemplaza el contenido; no hay hidratación
// ni riesgo de mismatch). Es BEST-EFFORT: si algo falla, se avisa y se publica sin
// prerender (el resto de mejoras SEO se despliega igual).
async function prerenderIndex(bundleName) {
  const htmlFile = join(DIST, 'index.html');
  const html = readFileSync(htmlFile, 'utf8');
  try {
    const virtualConsole = new VirtualConsole(); // silencia el ruido de scripts inline
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',   // deja correr los inline (define window.IMG, etc.)
      pretendToBeVisual: true,     // aporta requestAnimationFrame
      url: 'https://ads-partners.com/',
      virtualConsole,
    });
    const { window } = dom;

    // Polyfills de APIs de navegador que los efectos de los componentes tocan.
    if (!window.matchMedia) {
      window.matchMedia = (q) => ({
        matches: false, media: q || '', onchange: null,
        addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {}, dispatchEvent() { return false; },
      });
    }
    // IO que "dispara" intersección al observar → useReveal marca el contenido como
    // visible (si no, quedaría con clases de pre-reveal; el texto igualmente estaría
    // en el DOM, pero así el snapshot queda limpio).
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { try { this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }], this); } catch (e) {} }
      unobserve() {} disconnect() {} takeRecords() { return []; }
    };
    window.ResizeObserver = window.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
    window.scrollTo = () => {};
    if (!window.requestAnimationFrame) window.requestAnimationFrame = (cb) => setTimeout(() => cb(0), 0);
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = (id) => clearTimeout(id);

    // React de producción (vendored) + bundle compilado, evaluados en el window.
    window.eval(readFileSync(join(DIST, 'vendor', 'react.production.min.js'), 'utf8'));
    window.eval(readFileSync(join(DIST, 'vendor', 'react-dom.production.min.js'), 'utf8'));
    if (!window.React || !window.ReactDOM) {
      console.warn('  ! Prerender omitido: React no quedó expuesto en window. Se publica sin prerender.');
      window.close();
      return false;
    }
    // Fuerza commit SÍNCRONO: createRoot().render() de React 18 es asíncrono y su
    // scheduler no asienta dentro de jsdom en el build. Envolvemos render en flushSync
    // (mismo createRoot real; solo cambia el timing del commit). El cliente NO se toca.
    const RD = window.ReactDOM;
    const origCreateRoot = RD.createRoot.bind(RD);
    RD.createRoot = (container) => {
      const root = origCreateRoot(container);
      const origRender = root.render.bind(root);
      root.render = (el) => { try { RD.flushSync(() => origRender(el)); } catch (e) { origRender(el); } };
      return root;
    };

    window.eval(readFileSync(join(DIST, bundleName), 'utf8')); // ReactDOM.createRoot(#root).render(<App/>)

    // Deja que los efectos (IO/reveal) asienten tras el commit síncrono.
    for (let i = 0; i < 15; i++) await new Promise((r) => setTimeout(r, 40));

    const root = window.document.getElementById('root');
    let inner = root ? root.innerHTML : '';

    // Guarda: el snapshot debe ser sustancial y contener copy esperado. Si no, no se
    // inyecta (mejor sin prerender que con un root a medias).
    const ok = inner.length > 4000 && /Growth|Founders|Manifiesto|Quedamos|adsPartners/i.test(inner);
    if (!ok) {
      console.warn(`  ! Prerender omitido: snapshot insuficiente (${inner.length} chars). Se publica sin prerender.`);
      window.close();
      return false;
    }

    // Quita las imágenes base64 (window.IMG) del snapshot: el HTML estático se queda
    // ligero y los crawlers leen igual el alt/texto. El navegador restaura las reales
    // al re-montar. `data:,` es un data-URI vacío válido (sin petición de red).
    inner = inner.replace(/data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/gi, 'data:,');

    const injected = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="1">${inner}</div>`);
    writeFileSync(htmlFile, injected);
    window.close();
    console.log(`  · Prerender OK: ${(inner.length / 1024).toFixed(1)} KB de HTML horneado en #root`);
    return true;
  } catch (e) {
    console.warn(`  ! Prerender falló (${e && e.message ? e.message : e}). Se publica sin prerender.`);
    return false;
  }
}

async function main() {
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  console.log('Compilando bundles…');
  let indexBundle = null;
  for (const page of PAGES) {
    const html = readFileSync(join(ROOT, page), 'utf8');
    // Scripts .jsx locales en orden de aparición.
    const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]
      .map((m) => m[1])
      .filter(isLocalJsx);
    if (srcs.length === 0) { console.warn(`  ! ${page}: sin scripts .jsx`); continue; }
    const stem = page === 'index.html' ? 'app' : 'legal';
    const bundleName = await compileBundle(srcs, stem);
    if (page === 'index.html') indexBundle = bundleName;
    writeFileSync(join(DIST, page), transformHtml(html, bundleName));
  }

  console.log('Copiando estáticos (css, loader, assets, vendor, CNAME)…');
  copyStatic();

  // Pre-render de la home (best-effort; necesita docs/vendor/ ya copiado).
  if (indexBundle) {
    console.log('Pre-renderizando la home para bots sin JS (crawlers de IA + Google)…');
    await prerenderIndex(indexBundle);
  }

  // Resumen de peso.
  const sizeOf = (p) => { try { return statSync(join(DIST, p)).size; } catch { return 0; } };
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log('\nListo. docs/ generado (lo que publica GitHub Pages).');
  console.log(`  vendor React prod: ${kb(sizeOf('vendor/react.production.min.js') + sizeOf('vendor/react-dom.production.min.js'))}`);
  console.log(`  (antes: ~4,3 MB de JS de terceros + compilación en el navegador)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
