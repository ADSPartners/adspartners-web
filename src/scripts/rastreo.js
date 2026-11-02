// El cargador de la medición (Google Analytics 4) y de las campañas (píxel de Meta). Solo lo llama consentimiento.js
// y solo después de que digas que sí: hasta entonces no se pide nada a Google ni a Meta (sin el modo avanzado de
// Consent Mode, que manda avisos sin cookies antes de preguntar). Con la demo de la copia de prueba no carga nada.
// Los IDs viven en data/rastreo.js.

function script(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function cargarMedicion(id, demo) {
  if (!id && !demo) return;
  if (demo) { console.info('[rastreo · demo] aquí se cargaría Google Analytics'); return; }
  window[`ga-disable-${id}`] = false;
  if (window.__adsMedicion) return;
  window.__adsMedicion = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', id);
  script(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

export function cargarCampanas(id, demo) {
  if (!id && !demo) return;
  if (demo) { console.info('[rastreo · demo] aquí se cargaría el píxel de Meta'); return; }
  if (window.fbq) { window.fbq('consent', 'grant'); return; }
  // El cargador oficial del píxel, sin minificar
  const fbq = function fbq() { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
  fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
  window.fbq = window._fbq = fbq;
  script('https://connect.facebook.net/en_US/fbevents.js');
  fbq('consent', 'grant');
  fbq('init', id);
  fbq('track', 'PageView');
}

// Retirar el permiso: se apagan los dos (lo ya cargado deja de mandar) y se borran sus cookies
export function retirar({ ga4, medicion, campanas }) {
  if (!medicion && ga4) window[`ga-disable-${ga4}`] = true;
  if (!campanas && window.fbq) window.fbq('consent', 'revoke');
  const nombres = document.cookie.split(';').map((c) => c.trim().split('=')[0]);
  nombres.filter((n) => (!medicion && /^_ga(_|$)|^_gid$/.test(n)) || (!campanas && n === '_fbp')).forEach(borrarCookie);
}

// Una cookie se borra poniéndole una fecha pasada, en su ruta y en cada dominio posible (con y sin punto delante)
export function borrarCookie(nombre) {
  const partes = location.hostname.split('.');
  const dominios = [''];
  for (let i = 0; i < partes.length - 1; i++) dominios.push(`; domain=.${partes.slice(i).join('.')}`);
  dominios.forEach((d) => { document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`; });
}
