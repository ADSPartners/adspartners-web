// Los datos estructurados (schema.org, JSON-LD) de la web. Base.astro monta el grafo de cada página: la organización
// y el sitio, la página con sus migas y lo propio de cada una (los servicios, las personas o los proyectos). Salen de
// la auditoría SEO del 03-nov (seo/datos/2026-11-03/.../schema-propuestas, validadas 8/8) y todo lo que dicen está
// publicado en la web: el aviso legal, «Qué somos», Tech, Brand, About y Proyectos.
// Los @id son siempre de https://ads-partners.com, también en las copias de prueba: el grafo bueno es el de producción.
// Lo que falta y no se pone hasta que esté publicado: teléfono de llamadas, fecha de fundación, apellidos y perfiles
// de los socios, zona de servicio y ficha de Google (si hay ficha, pasar a ["Organization", "LocalBusiness"]).
import { TECH } from './tech.js';
import { PROYECTOS } from './proyectos.js';
import { CIERRE as BRAND_CIERRE } from './brand.js';

export const SITIO = 'https://ads-partners.com/';
export const ORG_ID = `${SITIO}#organizacion`;
export const WEB_ID = `${SITIO}#website`;
const org = { '@id': ORG_ID };

// Los perfiles de adsPartners que enlaza el pie (Organization.sameAs). Si se cambia uno, cambiarlo en los dos sitios
export const PERFILES = [
  { nombre: 'LinkedIn', url: 'https://www.linkedin.com/company/ads-partners-co/' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/adspartners.co/' },
];

// Las dos listas de «Qué somos» (components/QueSomos.astro), en el mismo orden
const BRAND = ['Identidad y logotipo', 'Webs con una idea propia', 'Dirección de arte', 'Contenido'];
const TECH_SERVICIOS = ['Automatizaciones', 'Asistentes de IA', 'Software a medida', 'Integraciones'];

export const ORGANIZACION = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'adsPartners',
  legalName: 'ALDASE SOCIOS GP S.L.',
  url: SITIO,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITIO}#logo`,
    url: `${SITIO}assets/logos/apple-touch-icon.png`,
    contentUrl: `${SITIO}assets/logos/apple-touch-icon.png`,
    width: 180,
    height: 180,
    caption: 'adsPartners',
  },
  image: `${SITIO}assets/og-adspartners.png`,
  description: 'Estudio de branding y tecnología en Madrid: identidad de marca, webs con una idea propia, automatizaciones, asistentes de IA y software a medida. El mismo equipo, de principio a fin.',
  slogan: 'Brand por fuera. Tech por dentro.',
  email: 'adsgroup@ads-partners.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'adsgroup@ads-partners.com',
    url: 'https://wa.me/34633565840',
    availableLanguage: 'es',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida del Infante Don Luis, 14',
    postalCode: '28660',
    addressLocality: 'Boadilla del Monte',
    addressRegion: 'Madrid',
    addressCountry: 'ES',
  },
  taxID: 'B21757786',
  identifier: { '@type': 'PropertyValue', propertyID: 'Registro Mercantil de Madrid', value: 'Hoja M-849202' },
  knowsAbout: [...BRAND, ...TECH_SERVICIOS],
  sameAs: PERFILES.map((p) => p.url),
};

export const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEB_ID,
  url: SITIO,
  name: 'adsPartners',
  inLanguage: 'es-ES',
  publisher: org,
};

// Las migas de dos niveles: la página principal y esta
export const migas = (url, nombre) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Página principal', item: SITIO },
    { '@type': 'ListItem', position: 2, name: nombre, item: url },
  ],
});

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Tech: un Service por servicio, con el texto que se ve al entrar (o el del slider). Van por el nombre del servicio, no
// por el de la misión (Observa, Conecta…), que ya ha cambiado alguna vez
export const SERVICIOS_TECH = TECH.map((t) => ({
  '@type': 'Service',
  '@id': `${SITIO}tech/#${slug(t.servicio)}`,
  name: t.servicio,
  serviceType: t.servicio,
  description: t.entradilla ?? t.texto,
  url: `${SITIO}tech/`,
  provider: org,
}));

// Brand: un Service con su catálogo, la lista de «Así trabajamos la tuya»
export const SERVICIO_BRAND = {
  '@type': 'Service',
  '@id': `${SITIO}brand/#brand`,
  name: 'Brand',
  serviceType: 'Branding e identidad de marca',
  description: 'La identidad de tu marca: el logotipo, el color, la letra y la forma de hablar, escrita en reglas y aplicada en la web y en el contenido.',
  url: `${SITIO}brand/`,
  provider: org,
  audience: { '@type': 'BusinessAudience', audienceType: 'Empresas que quieren verse como lo que valen.' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Así trabajamos la tuya',
    itemListElement: BRAND_CIERRE.servicios.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, provider: org } })),
  },
};

// About: los dos socios. De Sebas solo lo que dice «Qué somos» (lo de About está pendiente de que lo revise él)
export const PERSONAS = [
  {
    '@type': 'Person',
    '@id': `${SITIO}about/#sebas`,
    name: 'Sebas',
    jobTitle: 'Brand',
    description: 'Diseña cómo se ve tu empresa.',
    url: `${SITIO}about/`,
    worksFor: org,
    knowsAbout: BRAND,
  },
  {
    '@type': 'Person',
    '@id': `${SITIO}about/#alvaro`,
    name: 'Álvaro',
    jobTitle: 'Tech',
    description: 'Construye lo que hace funcionar tu empresa por dentro: la IA, la informática y los servidores.',
    url: `${SITIO}about/`,
    worksFor: org,
    knowsAbout: [...TECH_SERVICIOS, 'Inteligencia artificial', 'Servidores'],
  },
];

// Proyectos: la lista de obras. Solo llevan url las que enlazan a la obra misma (su web), no a un vídeo o un Instagram
export const LISTA_ID = `${SITIO}proyectos/#lista`;
export const LISTA_PROYECTOS = {
  '@type': 'ItemList',
  '@id': LISTA_ID,
  name: 'Proyectos de adsPartners',
  numberOfItems: PROYECTOS.length,
  itemListElement: PROYECTOS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CreativeWork',
      '@id': `${SITIO}proyectos/#${p.slug}`,
      name: p.nombre,
      description: p.resumen,
      ...(p.anio ? { datePublished: String(p.anio) } : {}),
      ...(p.enlace?.t === 'Ver la web' ? { url: p.enlace.url } : {}),
      creator: org,
    },
  })),
};
