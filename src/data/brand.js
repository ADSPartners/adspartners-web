// Brand, «Desmontada» (02-nov; de las tres direcciones del prototipo, Álvaro eligió la B: «me mola la B, si le das un
// poco más de juego y algo más de movimiento al ratón, creo que la tenemos»; y después: «dale más importancia a cada
// capa, ponle algo más de detalle, investiga bien qué es el brand y qué efectos puede tener uno bien hecho, y explica
// más en cada capa»). La marca de adsPartners, despiezada en seis planchas, de la que se ve a la que lo sostiene todo.
// Las reglas salen del manual de marca (adsPartners_BrandGuide.pdf, de uso interno): aquí van solo las reglas y los
// claims. Los datos de cada capa son de estudios publicados y van con su fuente (comprobados el 02-nov); donde un dato
// es una correlación, una revisión o un experimento informal, se dice. El copy lo retocará Álvaro más adelante.

export const PORTADA = {
  etiqueta: 'Brand · desmontada',
  // *cursiva*
  titulo: 'Una marca no es *un logo.*',
  texto: 'Son seis capas que cuentan lo mismo, de la que ve todo el mundo a la que lo sostiene todo. Baja y desmóntala.',
  // Al final, cuando se vuelve a montar
  final: 'Brand por fuera. *Tech por dentro.*',
  pista: 'Baja',
};

// Las seis planchas, de arriba abajo. Cada una es un capítulo:
// - cota: su etiqueta en la vista técnica; titular, que (qué es) e importa (qué efecto tiene en una empresa);
// - dato: la cifra grande, lo que significa y de dónde sale (cuenta: si la cifra sube contando al entrar);
// - juego: qué se puede hacer con ella; cursor: lo que dice el cursor al pasar por encima.
export const CAPAS = [
  {
    id: 'marca', n: '01', nombre: 'La marca', cota: 'Lo que la gente ve y recuerda',
    titular: 'Lo que la gente *recuerda* de ti.',
    que: 'Una marca no es un logo: es la idea que se hace la gente de tu empresa. Marty Neumeier la define como «la sensación visceral de una persona sobre un producto, un servicio o una empresa». No la decides tú, la decide quien te mira. Pero se puede trabajar, capa a capa.',
    importa: 'Esa sensación es la que inclina la balanza cuando alguien duda entre tú y otro. Y se basa, sobre todo, en si se fía de ti.',
    dato: { cifra: '81 %', cuenta: 81, sufijo: ' %', texto: 'de la gente dice que, para comprar, tiene que poder confiar en que la marca hará lo correcto.', fuente: 'Edelman Trust Barometer, informe especial «In Brands We Trust?», 2019 · 16.000 personas en 8 países' },
    juego: 'Cógela y gírala', cursor: 'Cógela y gírala',
  },
  {
    id: 'forma', n: '02', nombre: 'Forma', cota: '2500 × 1036 · se escala, no se estira',
    titular: 'La firma, *siempre igual.*',
    que: 'El logotipo y el isotipo son la firma de la empresa: lo primero que se reconoce. Se dibujan una vez y se usan siempre igual: se escalan, nunca se estiran, y siempre llevan aire alrededor para que respiren.',
    importa: 'Lo que se repite igual se convierte en un atajo de memoria. Los estudios del Ehrenberg-Bass Institute lo resumen en dos condiciones: que mucha gente lo reconozca y que solo sea tuyo. Y el juicio llega antes de leer nada.',
    dato: { cifra: '50 ms', cuenta: 50, sufijo: ' ms', texto: 'tarda alguien en formarse una opinión del aspecto de una web, y se parece mucho a la que tendrá después de mirarla con calma.', fuente: 'Lindgaard, Fernandes, Dudek y Brown, Behaviour & Information Technology, 2006' },
    juego: 'Intenta estirarlo', cursor: 'Estíralo',
  },
  {
    id: 'color', n: '03', nombre: 'Color', cota: '5 colores · cada uno con su papel',
    titular: 'Se ve *antes* de leer.',
    que: 'El color es lo primero que llega, antes que el nombre. Cinco colores, y cada uno con su papel: el marrón da peso, el beige calma, el rosa marca lo que tiene que verse, el blanco deja aire y el negro es el texto.',
    importa: 'Usado siempre igual, el color hace reconocible la marca de lejos y sin leer nada. Usado cada vez distinto, no hace nada.',
    dato: { cifra: '62–90 %', texto: 'de la primera impresión que nos llevamos de un producto se basa solo en el color.', fuente: 'Satyendra Singh, «Impact of color on marketing», Management Decision, 2006 (revisión de estudios)' },
    juego: 'Pasa por un color y mira la marca', cursor: 'Pasa por un color',
  },
  {
    id: 'letra', n: '04', nombre: 'Letra', cota: 'Garamond · Open Sauce · Quetine',
    titular: 'La voz, *escrita.*',
    que: 'La letra es cómo suena la marca por escrito. Garamond para la marca, Open Sauce para la interfaz y Quetine para el detalle: cada una tiene su papel y no se cambian de sitio.',
    importa: 'La misma frase no se recibe igual en cualquier letra. La letra pone el tono antes de que se lea la primera palabra.',
    dato: { cifra: '40.000', cuenta: 40000, sufijo: '', texto: 'lectores del New York Times leyeron la misma frase en seis letras distintas: en Baskerville resultó algo más creíble. Poco, pero se notó.', fuente: 'Errol Morris, The New York Times, 2012 (experimento abierto, sin laboratorio)' },
    juego: 'Cambia la letra del titular', cursor: 'Cambia la letra',
  },
  {
    id: 'voz', n: '05', nombre: 'Voz', cota: 'Menos adjetivos · más hechos',
    titular: 'Cómo hablas *también* es marca.',
    que: 'La voz es cómo suena la marca cuando habla: en la web, en un correo o en una propuesta. La nuestra es cercana y clara, sin lenguaje de agencia. Menos adjetivos, más hechos.',
    importa: 'El mismo mensaje, con otro tono, cambia cuánto se fían de ti. En un estudio de Nielsen Norman Group, el tono cambió cómo de cercana, de fiable y de recomendable parecía la misma empresa. Y lo que más pesaba era la confianza.',
    dato: { cifra: '52 %', cuenta: 52, sufijo: ' %', texto: 'de las diferencias en las ganas de recomendar una empresa se explica por lo fiable que suena.', fuente: 'Nielsen Norman Group, «The Impact of Tone of Voice on Users’ Brand Perception», Kate Moran, 2016' },
    juego: 'Pasa por la frase', cursor: 'Pasa por la frase',
  },
  {
    id: 'idea', n: '06', nombre: 'Idea', cota: 'Qué eres · para quién · por qué tú',
    titular: 'Debajo de todo, *la idea.*',
    que: 'La capa que no se ve y lo sostiene todo: qué eres, para quién y por qué tú. Si está clara, el logo, el color, la letra y la voz cuentan lo mismo. Si no, cada capa va a su aire.',
    importa: 'Una marca se construye a largo plazo, y es lo que más hace crecer a largo plazo. Lo que solo busca vender ya da subidas cortas.',
    dato: { cifra: '60/40', texto: 'es el reparto que mejor funcionó, de media, entre construir marca y vender a corto plazo.', fuente: 'Les Binet y Peter Field, «The Long and the Short of It», IPA, 2013 · 996 campañas' },
    juego: 'Pasa por ella y quítala', cursor: 'Quítala',
  },
];

// La idea de adsPartners, como está en la web: qué somos, para quién y por qué nosotros
export const IDEA = [
  ['Qué', 'Un estudio de marca y tecnología.'],
  ['Para quién', 'Empresas que quieren verse como lo que valen.'],
  ['Por qué', 'El mismo equipo, de la primera idea al último detalle.'],
];

// La paleta del manual (p. 25). oscuro: si la marca lo toma, la plancha se aclara para que se vea
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

// Lo que hace una marca bien hecha en una empresa: tres efectos medidos, con su fuente y su pega
export const EFECTOS = {
  antetitulo: 'Lo que hace una marca bien hecha',
  titulo: 'No es decoración. *Se nota en las cuentas.*',
  lista: [
    { cifra: '+32', cuenta: 32, sufijo: '', unidad: 'puntos', titulo: 'Crece más', texto: 'Las empresas que mejor trabajan el diseño crecieron 32 puntos más en ingresos que el resto de su sector en cinco años, y 56 más en rentabilidad para el accionista.', fuente: 'McKinsey, «The Business Value of Design», 2018 · 300 empresas · es una correlación, no prueba la causa' },
    { cifra: '94 %', cuenta: 94, sufijo: ' %', unidad: '', titulo: 'Defiende su precio', texto: 'de lo que permite a una marca cobrar más que la media se explica porque la gente la ve útil y distinta a las demás.', fuente: 'Kantar, modelo «Meaningfully Different» · datos de la propia Kantar' },
    { cifra: '−50 %', cuenta: 50, sufijo: ' %', unidad: '', menos: true, titulo: 'Atrae a la gente', texto: 'Una buena marca como empleador puede reducir a la mitad el coste de cada contratación y un 28 % la rotación.', fuente: 'LinkedIn Talent Solutions · datos de la propia LinkedIn' },
  ],
};

export const CIERRE = {
  antetitulo: 'Lo que hacemos con la tuya',
  titulo: 'Así trabajamos *la tuya.*',
  texto: 'Primero miramos cómo se ve tu marca y cómo debería verse, empezando por la idea. Después hacemos cada capa y la dejamos escrita en reglas. En la web, esas reglas son código, y se cumplen solas.',
  servicios: ['Identidad y logotipo', 'Webs con una idea propia', 'Dirección de arte', 'Contenido'],
  carta: 'Cuéntanos la tuya',
};
