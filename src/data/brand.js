// Brand, «Desmontada» (02-nov; de las tres direcciones del prototipo, Álvaro eligió la B: «me mola la B, si le das un
// poco más de juego y algo más de movimiento al ratón, creo que la tenemos»). La marca de adsPartners, despiezada en
// cinco planchas. Las reglas salen del manual de marca (adsPartners_BrandGuide.pdf, de uso interno): aquí van solo las
// reglas y los claims. El copy lo retocará Álvaro más adelante.

export const PORTADA = {
  etiqueta: 'Brand · desmontada',
  // *cursiva*
  titulo: 'Una marca no es *un logo.*',
  texto: 'Son cinco capas que cuentan lo mismo, cada una con sus reglas. Baja y desmóntala.',
  // Al final, cuando se vuelve a montar
  final: 'Brand por fuera. *Tech por dentro.*',
  pista: 'Baja',
};

// Las cinco planchas, de arriba abajo: la marca terminada y lo que hay debajo. cota: lo que dice su etiqueta en la
// vista técnica; regla: lo que se cuenta cuando le toca; juego: qué se puede hacer con ella; cursor: lo que dice el
// cursor al pasar por encima
export const CAPAS = [
  { id: 'marca', n: '01', nombre: 'La marca', cota: 'Todo junto, en su sitio', regla: 'Lo que la gente ve: todo junto y en su sitio.', juego: 'Cógela y gírala', cursor: 'Cógela y gírala' },
  { id: 'forma', n: '02', nombre: 'Forma', cota: '2500 × 1036 · se escala, no se estira', regla: 'El isotipo se escala. Nunca se estira.', juego: 'Intenta estirarlo', cursor: 'Estíralo' },
  { id: 'color', n: '03', nombre: 'Color', cota: '5 colores · cada uno con su papel', regla: 'Cinco colores, y cada uno con su papel.', juego: 'Pasa por un color y mira la marca', cursor: 'Pasa por un color' },
  { id: 'letra', n: '04', nombre: 'Letra', cota: 'Garamond · Open Sauce · Quetine', regla: 'Garamond para la marca, Open Sauce para la interfaz y Quetine para el detalle.', juego: 'Cambia la letra del titular', cursor: 'Cambia la letra' },
  { id: 'voz', n: '05', nombre: 'Voz', cota: 'Menos adjetivos · más hechos', regla: 'Menos adjetivos. Más hechos.', juego: 'Pasa por la frase', cursor: 'Pasa por la frase' },
];

// La paleta del manual (p. 25). sobre: el color del isotipo cuando la marca lo toma (y el fondo, si es oscuro)
export const PALETA = [
  { nombre: 'Marrón', hex: '#34190A', papel: 'El fondo que da peso', oscuro: true },
  { nombre: 'Beige', hex: '#E7E2DA', papel: 'La calma', oscuro: false },
  { nombre: 'Rosa', hex: '#F5CBD7', papel: 'Lo que tiene que verse', oscuro: false },
  { nombre: 'Blanco', hex: '#F5F3F1', papel: 'El aire', oscuro: false },
  { nombre: 'Negro', hex: '#190900', papel: 'El texto', oscuro: true },
];

// Las letras (pp. 26-28)
export const LETRAS = [
  { nombre: 'Apple Garamond', papel: 'La marca', familia: 'var(--serif)', peso: 300 },
  { nombre: 'Open Sauce', papel: 'La interfaz', familia: 'var(--sans)', peso: 400 },
  { nombre: 'Quetine', papel: 'El detalle', familia: "'Quetine', cursive", peso: 400 },
];
export const TITULAR_LETRA = 'Brand por fuera.';

// La voz (pp. 19-23): una frase de agencia que se corrige sola. [antes, lo que sobra, lo nuestro, después, por qué]
export const VOZ = [
  ['Somos', 'una agencia', 'un equipo', 'pequeño.', 'No somos una agencia que hace campañas y ya está.'],
  ['Trabajamos como', 'proveedores', 'socios', '', 'No somos proveedores. Trabajamos como socios.'],
  ['Resultados', 'garantizados', 'medidos', '', 'No prometemos. Medimos.'],
  ['Te damos', 'soluciones integrales', 'un sistema', 'que se repite.', 'Nada de soluciones integrales: un sistema que se mide y se repite.'],
];

export const CIERRE = {
  antetitulo: 'Lo que hacemos con la tuya',
  titulo: 'Así trabajamos *la tuya.*',
  texto: 'Primero miramos cómo se ve tu marca y cómo debería verse. Después hacemos cada capa y la dejamos escrita en reglas. En la web, esas reglas son código, y se cumplen solas.',
  servicios: ['Identidad y logotipo', 'Webs con una idea propia', 'Dirección de arte', 'Contenido'],
  carta: 'Cuéntanos la tuya',
};
