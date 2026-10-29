// Los partners del túnel (transición entre «Qué somos» y «Proyectos").
// logo: fichero en public/assets/partners/. fondo: la tarjeta cuando se ve en «marca».
// tinta: si el logo es monocolor y hay que teñirlo (se usa como máscara); sin tinta, se ve la imagen tal cual.
// ancho: ancho relativo del logo en su tarjeta (los apaisados, más; los cuadrados, menos).
// De dónde sale cada logo (y cuáles son inventados), en src/data/partners-LEEME.md.
export const PARTNERS = [
  { id: 'klink', nombre: 'Klink', sector: 'marca · app', logo: 'klink.webp', fondo: '#0D1A1C', tinta: '#2BB8C2', ancho: 0.62 },
  { id: 'quironsalud', nombre: 'Quirónsalud', sector: 'salud', logo: 'quironsalud.webp', fondo: '#FFFFFF', ancho: 0.7 },
  { id: 'metele-voltaje', nombre: 'Métele Voltaje', sector: 'energía · web', logo: 'metele-voltaje.webp', fondo: '#0B1630', ancho: 0.66 },
  { id: 'tercero-b', nombre: 'Tercero B', sector: 'noche · marca y web', logo: 'tercero-b.svg', fondo: '#F6F5F1', ancho: 0.7 },
  { id: 'inversalia', nombre: 'Inversalia', sector: 'inversión · marca', logo: 'inversalia.webp', fondo: '#EDE7DC', tinta: '#1F2A3A', ancho: 0.74 },
  { id: 'ava-pasteleria', nombre: 'Ava Pastelería', sector: 'pastelería · web', logo: 'ava-pasteleria.webp', fondo: '#F7ECE6', ancho: 0.44 },
  { id: 'fundacion-jimenez-diaz', nombre: 'Fundación Jiménez Díaz', sector: 'investigación · software', logo: 'fundacion-jimenez-diaz.webp', fondo: '#FFFFFF', ancho: 0.8 },
  { id: 'la-potente', nombre: 'La Potente', sector: 'bar · gestión', logo: 'la-potente.svg', fondo: '#F1E6D2', ancho: 0.62 },
  { id: 'impulso-visual', nombre: 'Impulso Visual', sector: 'PLV · herramientas de IA', logo: 'impulso-visual.webp', fondo: '#FFFFFF', ancho: 0.72 },
  { id: 'butter-studio', nombre: 'Butter Studio', sector: 'cookies · web', logo: 'butter-studio.webp', fondo: '#F4E4BF', ancho: 0.26 },
  { id: 'racionjusta', nombre: 'RaciónJusta', sector: 'hostelería · app', logo: 'racionjusta.svg', fondo: '#F4F4F6', ancho: 0.72 },
  { id: 'jorge-cato', nombre: 'Dr. Jorge Cato', sector: 'cirugía vascular · captación', logo: 'jorge-cato.svg', fondo: '#FFFFFF', ancho: 0.8 },
];
