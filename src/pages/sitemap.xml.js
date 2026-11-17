// El sitemap, con el lastmod real: la fecha de la compilación (antes era un fichero fijo en public/).
const SITIO = 'https://ads-partners.com/';
const PAGINAS = [
  ['', 'monthly', '1.0'],
  ['proyectos/', 'monthly', '0.8'],
  ['tech/', 'monthly', '0.8'],
  ['brand/', 'monthly', '0.8'],
  ['about/', 'monthly', '0.7'],
  ['aviso-legal/', 'yearly', '0.3'],
  ['privacidad/', 'yearly', '0.3'],
  ['cookies/', 'yearly', '0.3'],
];

export function GET() {
  const hoy = new Date().toISOString().slice(0, 10);
  const urls = PAGINAS.map(([ruta, cambio, prioridad]) =>
    `  <url>\n    <loc>${SITIO}${ruta}</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>${cambio}</changefreq>\n    <priority>${prioridad}</priority>\n  </url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } });
}
