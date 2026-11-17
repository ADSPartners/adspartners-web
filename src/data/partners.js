// Los partners del túnel (transición entre «Qué somos» y «Proyectos»). Van sueltos, sin tarjeta, sobre noche.
// logo: fichero en public/assets/partners/ (las versiones «-noche» tienen el texto oscuro pasado a crema).
// tinta: si el logo es oscuro o de un color que no se ve sobre noche, se usa como máscara y se pinta de este color.
// ancho: ancho relativo del logo en su caja (los apaisados, más; los cuadrados, menos).
// De dónde sale cada logo, en src/data/partners-LEEME.md.
export const PARTNERS = [
  { id: 'klink', nombre: 'Klink', sector: 'marca · app', logo: 'klink.webp', tinta: '#2BB8C2', ancho: 0.62 },
  { id: 'quironsalud', nombre: 'Quirónsalud', sector: 'salud', logo: 'quironsalud-noche.webp', ancho: 0.74 },
  { id: 'metele-voltaje', nombre: 'Métele Voltaje', sector: 'energía · web', logo: 'metele-voltaje.webp', ancho: 0.62 },
  { id: 'tercero-b', nombre: 'Tercero B', sector: 'noche · marca y web', logo: 'tercero-b.svg', ancho: 0.62 },
  { id: 'inversalia', nombre: 'Inversalia', sector: 'inversión · marca', logo: 'inversalia.webp', tinta: '#E9E1D2', ancho: 0.82 },
  { id: 'ava-pasteleria', nombre: 'Ava Pastelería', sector: 'pastelería · web', logo: 'ava-pasteleria.webp', tinta: '#E58C9D', ancho: 0.46 },
  { id: 'fundacion-jimenez-diaz', nombre: 'Fundación Jiménez Díaz', sector: 'investigación · software', logo: 'fundacion-jimenez-diaz-noche.webp', ancho: 0.84 },
  { id: 'la-potente', nombre: 'La Potente', sector: 'bar · gestión', logo: 'la-potente.webp', tinta: '#E7E2DA', ancho: 0.78 },
  { id: 'impulso-visual', nombre: 'Impulso Visual', sector: 'PLV · herramientas de IA', logo: 'impulso-visual.webp', tinta: '#9AA4F0', ancho: 0.76 },
  { id: 'butter-studio', nombre: 'Butter Studio', sector: 'cookies · web', logo: 'butter-studio.webp', tinta: '#E9C48C', ancho: 0.3 },
  { id: 'racionjusta', nombre: 'RaciónJusta', sector: 'hostelería · app', logo: 'racionjusta-noche.svg', ancho: 0.74 },
  { id: 'jorge-cato', nombre: 'Dr. Jorge Cato', sector: 'cirugía vascular · captación', logo: 'jorge-cato-noche.svg', ancho: 0.84 },
];
