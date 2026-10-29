// Los proyectos del lienzo de la home. Cada uno tiene sus piezas (fotos reales o su tarjeta de marca) que suben
// con el scroll; al pasar el ratón se escribe «linea» encima, y al abrirlo se ve el resto.
// provisional: la foto está a falta de una mejor (más colorida o más del proyecto).
export const PROYECTOS = [
  {
    slug: 'fundacion-jimenez-diaz',
    nombre: 'Fundación Jiménez Díaz',
    con: 'Grupo Quirónsalud',
    rama: 'Tech', anio: '2024', sector: 'Investigación biomédica',
    linea: 'Software que analiza tejido pulmonar, píxel a píxel',
    texto: 'Para el equipo de investigación de Neumomadrid de la FJD: el programa carga la imagen del tejido pulmonar, separa píxel a píxel lo que es tejido de lo que no y mide cada región.',
    datos: ['Carga y edita la imagen', 'Separa el tejido, píxel a píxel', 'Mide cada región y exporta'],
    piezas: [
      { foto: 'fundacion-jimenez-diaz/lienzo-tejido.webp', ancho: 1, alto: 1 },
      { foto: 'fundacion-jimenez-diaz/lienzo-programa.webp', ancho: 16, alto: 10 },
      { marca: 'fundacion-jimenez-diaz.webp', fondo: '#FFFFFF', logo: 0.78 },
    ],
  },
  {
    slug: 'tercero-b',
    nombre: 'Tercero B',
    con: 'La fiesta de los jueves',
    rama: 'Brand + Tech', anio: '2026', sector: 'Noche · Madrid',
    linea: 'La casa que abre los jueves: marca, web y llaves',
    texto: 'Una fiesta en una casa que solo abre los jueves. Hicimos la marca a mano, la web y la venta de llaves (las entradas), que abre sola cada semana.',
    datos: ['Marca dibujada a mano', 'Web con venta de llaves', 'Un telefonillo que contesta con IA'],
    piezas: [
      { foto: 'tercero-b/lienzo-cartel.webp', ancho: 4, alto: 5 },
      { marca: 'tercero-b.svg', fondo: '#F6F5F1', logo: 0.72 },
      { foto: 'tercero-b/lienzo-noche.webp', ancho: 4, alto: 5 },
    ],
  },
  {
    slug: 'gestion-hosteleria',
    nombre: 'RaciónJusta',
    con: 'Con Gabriel, de La Potente',
    rama: 'Tech', anio: '2026', sector: 'Hostelería',
    linea: 'Una foto de la factura y sabes cuánto te deja cada plato',
    texto: 'Una app para bares y restaurantes: lee las facturas de los proveedores y saca lo que cuesta y lo que deja cada plato de la carta. La estrenó La Potente, el bar de Gabriel, que es socio del proyecto.',
    datos: ['157 platos con su margen', '115 facturas leídas', 'Semáforo de qué plato pierde dinero'],
    piezas: [
      { foto: 'gestion-hosteleria/lienzo-carta.webp', ancho: 409, alto: 716 },
      { marca: 'racionjusta.svg', fondo: '#FF6B35', logo: 0.8 },
    ],
  },
  {
    slug: 'inversalia',
    nombre: 'Inversalia',
    rama: 'Brand', sector: 'Inversión',
    linea: 'Una marca creada desde cero',
    texto: 'Creamos la marca de Inversalia desde cero: el logotipo y cómo se presenta.',
    datos: ['Marca desde cero', 'Logotipo', 'Identidad visual'],
    piezas: [
      { marca: 'inversalia.webp', fondo: '#1F2A3A', tinta: '#EDE7DC', logo: 0.74 },
      { foto: 'inversalia/lienzo-reunion.webp', ancho: 16, alto: 9, provisional: true },
    ],
  },
  {
    slug: 'klink',
    nombre: 'Klink',
    rama: 'Brand', sector: 'App',
    linea: 'Una marca creada desde cero',
    texto: 'Creamos la marca de Klink desde cero: el logotipo y cómo se presenta.',
    datos: ['Marca desde cero', 'Logotipo', 'Identidad visual'],
    piezas: [
      { foto: 'klink/lienzo-app.webp', ancho: 16, alto: 9, provisional: true },
      { marca: 'klink.webp', fondo: '#0D1A1C', tinta: '#2BB8C2', logo: 0.6 },
    ],
  },
];
