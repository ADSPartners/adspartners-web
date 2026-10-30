// Brand, «El manual que se defiende»: los textos de la página. Las reglas salen del manual de marca de adsPartners
// (adsPartners_BrandGuide.pdf, de uso interno): aquí van solo las reglas y los claims, nada del texto interno.

// Los folios son los del manual de verdad (el logotipo está en su p. 29)
export const FOLIOS = { portada: '01', indice: '04', logo: '29', cierre: '43' };

export const INDICE = [
  { n: 1, t: 'Logotipo', id: 'logotipo' },
  { n: 2, t: 'Paleta de colores', id: null },
  { n: 3, t: 'Tipografía', id: null },
  { n: 4, t: 'Voz', id: null },
  { n: 5, t: 'Lo que hacemos con la tuya', id: 'la-tuya' },
];

export const LOGO = {
  // Medida en el SVG oficial (2500 × 363,858)
  proporcion: 2500 / 363.858,
  regla: 'La firma de adsPartners. Va entera, en su proporción y en los colores de la paleta. No se estira, no se aplasta y no se gira.',
  // Lo que escribe el manual al margen, una por intento (después vuelve a empezar por la tercera)
  quejas: [
    'El logo no se estira. Se respeta.',
    'Tampoco un poquito.',
    'Que mole está bien. Que funcione, mejor.',
    'Una buena marca no decora. Coloca.',
    'Puedes seguir. Él también.',
    'Vale. Ya has visto que no se rompe.',
  ],
  // Si lo que más ha cambiado es el giro
  giro: 'Girarlo tampoco cuela.',
};

export const CIERRE = {
  titulo: 'Lo que hacemos con la tuya.',
  texto: [
    'Hay marcas que no tienen un problema de marketing: tienen un problema de base. No se entienden, no se reconocen o cada sitio cuenta una cosa distinta.',
    'Primero miramos cómo se ve la tuya y cómo debería verse. Después hacemos la identidad (el logotipo, el color, la letra y la forma de hablar) y la dejamos escrita en unas reglas claras. Y se aplica: en la web, en el contenido y en cada sitio donde alguien te vea.',
  ],
  servicios: ['Identidad y logotipo', 'Webs con una idea propia', 'Dirección de arte', 'Contenido'],
  quien: 'Lo lleva Sebas.',
};

// El remate del cierre, con los intentos de verdad
export const remate = (n) => (n === 0
  ? 'No has intentado romperla. Hay confianza.'
  : `Lo has intentado ${n} ${n === 1 ? 'vez' : 'veces'}. La marca sigue entera.`);
