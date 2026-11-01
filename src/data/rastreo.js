// La medición y las campañas de la web: lo único que pide permiso. Es la única fuente: con los dos IDs vacíos no hay
// aviso de consentimiento, no se carga nada de Google ni de Meta y las legales dicen que no hay cookies. Al poner un
// ID, se encienden a la vez el aviso (components/Consentimiento.astro), el cargador (scripts/rastreo.js) y los textos
// (data/legal.js).
export const GA4 = '';     // Google Analytics 4, «G-XXXXXXXXXX»
export const PIXEL = '';   // píxel de Meta, solo cifras

// ADS_RASTREO_DEMO=1 (al compilar la copia de prueba): el aviso y los textos salen como si hubiera IDs, pero no se carga
// nada ni se hace ninguna petición. Solo se lee al compilar; en el navegador no existe process
const demo = typeof process !== 'undefined' && process.env.ADS_RASTREO_DEMO === '1';

export const RASTREO = {
  ga4: GA4,
  pixel: PIXEL,
  demo,
  medicion: Boolean(GA4) || demo,
  campanas: Boolean(PIXEL) || demo,
};
RASTREO.activo = RASTREO.medicion || RASTREO.campanas;

// Lo que se guarda la elección y cuánto vale (la AEPD pide volver a preguntar como mucho a los 24 meses; aquí, 12)
export const CONSENTIMIENTO = { clave: 'ads-consentimiento', version: 1, meses: 12 };
