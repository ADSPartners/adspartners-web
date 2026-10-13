/* Proyectos: los datos de la sección "Selected Work" de la home y de cada página /proyectos/<slug>/.
   JavaScript plano (sin JSX): build.mjs también lo lee para generar una página por proyecto.

   Una WEB = una entrada aquí + su carpeta assets/proyectos/<slug>/ con:
     escritorio.mp4/.jpg (recorrido 1280x800), movil.mp4/.jpg (392x852), momento-N.jpg (1280x800)
     y la foto de su pieza práctica (practico.foto).
   Un CASO DE SOFTWARE lleva sinVideo: true y solo escritorio.jpg (una captura, 1280x800). En cada idioma:
     etq (rama · sector), cifra { n, t } si tiene una cifra grande, frase, y datos [{ n, t }] (hasta tres).
   Con sinPagina: true el proyecto solo sale en la home (y con sinImagen: true, sin captura: panel [antes, después]).
   Un idioma puede traer su propio nombre si el del proyecto es una descripción.

   Todo lo que se dice tiene que ser verdad de ese trabajo: nada inventado. */
window.PROYECTOS = [
  {
    slug: 'gestion-hosteleria',
    nombre: 'Gestión para hostelería',
    anio: '2026',
    sinVideo: true,
    seo: {
      titulo: 'Gestión para hostelería: una foto de la factura, el margen de cada plato — adsPartners®',
      descripcion: 'Aplicación a medida para hostelería, en uso a diario en un bar: lee las facturas de proveedor a partir de una foto y pone a cada uno de los 157 platos de la carta su semáforo de margen.',
    },
    es: {
      etq: 'ads Tech · Hostelería',
      sector: 'Hostelería',
      corto: 'Aplicación · Hostelería',
      idea: 'Una foto de la factura. El margen de cada plato.',
      hicimos: 'Aplicación a medida: lectura de facturas y margen por plato.',
      cifra: { n: '157', t: 'platos en la carta, cada uno con su semáforo de margen' },
      frase: 'Gestión para hostelería, en uso a diario en un bar.',
      datos: [
        { n: '115', t: 'facturas de proveedor leídas por la aplicación' },
        { n: '3 semanas', t: 'aproximadamente, de cero a funcionando' },
        { n: 'A diario', t: 'en uso en un bar' },
      ],
      partida: 'Gestión para hostelería, en uso a diario en un bar.',
      ideaTexto: [
        'Se hace una foto a la factura del proveedor y la aplicación la lee sola.',
        'Con esos precios, cada plato de la carta lleva su semáforo de margen: cuáles tienen buen margen, cuáles van ajustados y cuáles pierden dinero.',
      ],
    },
    en: {
      nombre: 'Hospitality management app',
      etq: 'ads Tech · Hospitality',
      sector: 'Hospitality',
      corto: 'App · Hospitality',
      idea: 'A photo of the invoice. The margin of every dish.',
      hicimos: 'Custom app: invoice reading and margin per dish.',
      cifra: { n: '157', t: 'dishes on the menu, each with its margin traffic light' },
      frase: 'Management for hospitality, used every day in a bar.',
      datos: [
        { n: '115', t: 'supplier invoices read by the app' },
        { n: '3 weeks', t: 'roughly, from zero to running' },
        { n: 'Daily', t: 'in use in a bar' },
      ],
      partida: 'Management for hospitality, used every day in a bar.',
      ideaTexto: [
        'You take a photo of the supplier invoice and the app reads it on its own.',
        'With those prices, every dish on the menu gets its margin traffic light: which ones have a good margin, which are tight and which lose money.',
      ],
    },
  },
  {
    slug: 'butter-studio',
    nombre: 'Butter Studio',
    anio: '2026',
    instagram: { usuario: '@butterstudio21', url: 'https://www.instagram.com/butterstudio21/' },
    webs: [
      { url: 'https://preview.ads-partners.com/portfolio/butter-studio-3d/', es: 'Versión 3D', en: '3D version' },
      { url: 'https://preview.ads-partners.com/portfolio/butter-studio-chic/', es: 'Versión chic', en: 'Chic version' },
    ],
    momentos: ['momento-1', 'momento-2', 'momento-3', 'momento-4', 'momento-5', 'momento-6', 'momento-7'],
    practico: { foto: 'caja' },
    otra: { video: 'chic-escritorio', movil: 'chic-movil', fotos: ['chic-1', 'chic-2', 'chic-3', 'chic-4'] },
    seo: {
      titulo: 'Butter Studio, la mantequilla se tuesta mientras bajas — adsPartners®',
      descripcion: 'Web para Butter Studio, cookies hechas a mano en Madrid: escena 3D propia en la que la mantequilla se tuesta y se convierte en su cookie, y una segunda propuesta editorial.',
    },
    es: {
      sector: 'Cookies hechas a mano · Madrid',
      corto: 'Cookies · Madrid',
      idea: 'La mantequilla se tuesta mientras bajas.',
      hicimos: 'Concepto, diseño, 3D y desarrollo. Dos propuestas.',
      partida: 'Cuando empezamos, la marca tenía tres publicaciones en Instagram, ni web ni ficha de Google. Los pedidos llegaban por mensaje directo.',
      ideaTexto: [
        'Su seña es la mantequilla tostada. Lo cuenta ella misma en su Instagram: «el pequeño paso que cambia una cookie por completo».',
        'Así que el scroll es el fuego. La mantequilla se funde, se tuesta, suelta sus aromas y acaba convertida en su cookie.',
      ],
      momentos: [
        { t: 'Su cookie.', d: 'La portada es su brown butter, hecha en 3D a partir de su foto: la textura, la forma y el relieve salen de ella.' },
        { t: 'Cae la mantequilla.', d: 'La pastilla cae al cazo y se funde.' },
        { t: 'Se tuesta.', d: 'El charco pasa de amarillo a dorado y a avellana, y el papel del fondo se tuesta con él.' },
        { t: 'Suben los aromas.', d: 'Avellana, caramelo y tostado, escritos con letra de mano.' },
        { t: 'Se hace cookie.', d: 'La masa cae, se extiende y se dora del borde al centro.' },
        { t: 'Se parte.', d: 'La rellena se abre en dos y la crema se estira.' },
        { t: 'A su caja.', d: 'Las seis de la carta acaban en su caja blanca, con su pegatina.' },
      ],
      practico: { t: 'Arma tu caja.', d: 'Pack de 4, 6 o 12 y los sabores que quieras. El pedido se copia solo y se abre su chat de Instagram para mandárselo.' },
      movil: 'No es la de ordenador encogida: en vertical, la cámara mira desde arriba el cazo y la cookie, los aromas suben por el centro, la cookie se parte de arriba abajo y la carta pasa de una en una.',
      otra: {
        t: 'Y una segunda propuesta.',
        idea: 'Su marca, contada como una revista.',
        d: 'Menos movimiento y más papel: portada tipográfica con sus cookies flotando, la carta montada como un menú con los precios a máquina y los ingredientes de cada cookie alrededor. El mismo «Arma tu caja», pensado primero para el móvil.',
      },
    },
    en: {
      sector: 'Handmade cookies · Madrid',
      corto: 'Cookies · Madrid',
      idea: 'The butter browns as you scroll.',
      hicimos: 'Concept, design, 3D and development. Two proposals.',
      partida: 'When we started, the brand had three Instagram posts, no website and no Google listing. Orders came in by direct message.',
      ideaTexto: [
        'Her signature is brown butter. She says it herself on Instagram: «the small step that changes a cookie completely».',
        'So the scroll is the heat. The butter melts, browns, releases its aromas and ends up as her cookie.',
      ],
      momentos: [
        { t: 'Her cookie.', d: 'The cover is her brown butter cookie, built in 3D from her own photo: the texture, the shape and the relief all come from it.' },
        { t: 'The butter drops.', d: 'The block falls into the pan and melts.' },
        { t: 'It browns.', d: 'The pool goes from yellow to golden to hazelnut, and the paper behind it toasts along.' },
        { t: 'The aromas rise.', d: 'Hazelnut, caramel and toast, in handwritten letters.' },
        { t: 'It becomes a cookie.', d: 'The dough drops, spreads and turns golden from the edge in.' },
        { t: 'It breaks.', d: 'The filled one splits in two and the cream stretches.' },
        { t: 'Into her box.', d: 'The six from the menu end up in her white box, sticker included.' },
      ],
      practico: { t: 'Build your box.', d: 'A pack of 4, 6 or 12 and any flavours you like. The order is copied automatically and her Instagram chat opens so it can be sent.' },
      movil: 'Not the desktop version shrunk: in portrait the camera looks down on the pan and the cookie, the aromas rise through the middle, the cookie breaks top to bottom and the menu goes one cookie at a time.',
      otra: {
        t: 'And a second proposal.',
        idea: 'Her brand, told like a magazine.',
        d: 'Less motion, more paper: a typographic cover with her cookies floating, the menu set like a restaurant card with typewriter prices, and each cookie’s ingredients around it. The same «Build your box», designed for mobile first.',
      },
    },
  },
  {
    slug: 'fundacion-jimenez-diaz',
    nombre: 'Fundación Jiménez Díaz',
    anio: '2024',
    sinVideo: true,
    enlace: { url: 'https://www.linkedin.com/feed/update/urn:li:activity:7154090784978305024/', es: 'Ver el vídeo en LinkedIn', en: 'Watch the video on LinkedIn' },
    seo: {
      titulo: 'Fundación Jiménez Díaz: software de análisis de tejido pulmonar — adsPartners®',
      descripcion: 'Software de análisis de imagen para el equipo de investigación de Neumomadrid de la Fundación Jiménez Díaz: carga la imagen del tejido pulmonar, separa píxel a píxel el tejido de lo que no lo es y mide cada región.',
    },
    es: {
      etq: 'ads Tech · Investigación biomédica',
      sector: 'Investigación biomédica · Madrid',
      corto: 'Software · Investigación',
      idea: 'Cada píxel de tejido, clasificado y medido.',
      hicimos: 'Software de análisis de imagen de tejido pulmonar.',
      frase: 'Desarrollado por Álvaro para el equipo de investigación de Neumomadrid de la Fundación Jiménez Díaz.',
      datos: [
        { n: 'Carga', t: 'la imagen del tejido pulmonar y permite editarla' },
        { n: 'Separa', t: 'píxel a píxel, lo que es tejido de lo que no' },
        { n: 'Mide', t: 'cada región y exporta los datos' },
      ],
      partida: 'Desarrollado por Álvaro para el equipo de investigación de Neumomadrid de la Fundación Jiménez Díaz.',
      ideaTexto: [
        'Carga la imagen del tejido pulmonar y permite editarla.',
        'Separa, píxel a píxel, lo que es tejido de lo que no. Después mide cada región y exporta los datos.',
      ],
    },
    en: {
      etq: 'ads Tech · Biomedical research',
      sector: 'Biomedical research · Madrid',
      corto: 'Software · Research',
      idea: 'Every pixel of tissue, classified and measured.',
      hicimos: 'Image-analysis software for lung tissue.',
      frase: 'Built by Álvaro for the Neumomadrid research team at Fundación Jiménez Díaz.',
      datos: [
        { n: 'Loads', t: 'the lung tissue image and lets you edit it' },
        { n: 'Separates', t: 'pixel by pixel, tissue from non-tissue' },
        { n: 'Measures', t: 'each region and exports the data' },
      ],
      partida: 'Built by Álvaro for the Neumomadrid research team at Fundación Jiménez Díaz.',
      ideaTexto: [
        'It loads the lung tissue image and lets you edit it.',
        'It separates, pixel by pixel, what is tissue from what is not. Then it measures each region and exports the data.',
      ],
    },
  },
  {
    slug: 'metele-voltaje',
    nombre: 'Métele Voltaje',
    anio: '2026',
    webs: [
      { url: 'https://preview.ads-partners.com/portfolio/metele-voltaje/', es: 'Ver la web', en: 'See the site' },
    ],
    momentos: ['momento-1', 'momento-2', 'momento-3', 'momento-4', 'momento-5'],
    practico: { foto: 'servicios' },
    seo: {
      titulo: 'Métele Voltaje, tu factura auditada mientras bajas — adsPartners®',
      descripcion: 'Web para Métele Voltaje, asesoría energética independiente en Teruel: una factura en 3D que se escanea y se conecta con las 16 compañías con las que trabaja.',
    },
    es: {
      sector: 'Asesoría energética · Teruel',
      corto: 'Energía · Teruel',
      idea: 'Tu factura, auditada mientras bajas.',
      hicimos: 'Concepto, diseño, 3D y desarrollo.',
      partida: 'Asesoría energética independiente para particulares, empresas y comunidades. Pablo compara compañías sobre el consumo real de cada cliente y le gestiona el cambio.',
      ideaTexto: [
        'Su servicio empieza por una factura: «mándame tu última factura». Así que la web también empieza por ahí.',
        'La factura se escanea, se marca en rojo lo que se paga de más y se conecta con las 16 compañías con las que trabaja. Todo mientras bajas.',
      ],
      momentos: [
        { t: 'Su factura.', d: 'Una factura en 3D, arrugada, que se alisa al empezar a bajar.' },
        { t: 'El escáner.', d: 'Una corriente la recorre y marca en rojo lo que se paga de más.' },
        { t: 'Las 16 compañías.', d: 'De la factura salen cables a las compañías con las que trabaja, cada una con su logo.' },
        { t: 'Tres pasos.', d: 'Los tres pasos de su servicio caen sobre la factura como sellos.' },
        { t: 'La descarga.', d: 'El rayo de su logo descarga y la página pasa a blanco.' },
      ],
      practico: { t: 'Y luego, calma.', d: 'Sus servicios en una rejilla con ritmo, quién es, las reseñas, doce preguntas frecuentes y el contacto directo por WhatsApp, teléfono o correo.' },
      movil: 'La cámara encuadra cada momento en el hueco que deja el texto, la factura lleva la letra un 30 % más grande y los sellos caen sobre ella con una sacudida.',
    },
    en: {
      sector: 'Energy advisory · Teruel',
      corto: 'Energy · Teruel',
      idea: 'Your bill, audited as you scroll.',
      hicimos: 'Concept, design, 3D and development.',
      partida: 'Independent energy advice for homes, businesses and communities. Pablo compares suppliers against each client’s real consumption and handles the switch.',
      ideaTexto: [
        'His service starts with a bill: «send me your latest bill». So the website starts there too.',
        'The bill gets scanned, whatever is being overpaid turns red, and it connects to the 16 suppliers he works with. All while you scroll.',
      ],
      momentos: [
        { t: 'His bill.', d: 'A crumpled 3D bill that smooths out as you start scrolling.' },
        { t: 'The scan.', d: 'A current runs through it and marks in red what is being overpaid.' },
        { t: '16 suppliers.', d: 'Cables run from the bill to the suppliers he works with, each with its logo.' },
        { t: 'Three steps.', d: 'The three steps of his service land on the bill like stamps.' },
        { t: 'The discharge.', d: 'The lightning bolt from his logo discharges and the page turns white.' },
      ],
      practico: { t: 'Then, calm.', d: 'His services on a grid with rhythm, who he is, reviews, twelve FAQs and direct contact by WhatsApp, phone or email.' },
      movil: 'The camera frames each moment in the space the text leaves, the bill’s type is 30% larger and the stamps land on it with a shake.',
    },
  },
  {
    slug: 'ava-pasteleria',
    nombre: 'Ava Pastelería',
    anio: '2026',
    instagram: { usuario: '@ava_pasteleria', url: 'https://www.instagram.com/ava_pasteleria/' },
    webs: [
      { url: 'https://preview.ads-partners.com/portfolio/ava-pasteleria/', es: 'Ver la web', en: 'See the site' },
    ],
    momentos: ['momento-1', 'momento-2', 'momento-3', 'momento-4', 'momento-5', 'momento-6', 'momento-7'],
    practico: { foto: 'pedido' },
    seo: {
      titulo: 'Ava Pastelería, la tarta se hace mientras bajas — adsPartners®',
      descripcion: 'Web para Ava Pastelería, tartas por encargo en Madrid: la tarta se hace delante de quien la mira, del molde al horno y capa a capa.',
    },
    es: {
      sector: 'Tartas por encargo · Madrid',
      corto: 'Pastelería · Madrid',
      idea: 'La tarta se hace mientras bajas.',
      hicimos: 'Concepto, diseño, 3D y desarrollo.',
      partida: 'Tartas por encargo para eventos y personas concretas. Todo pasaba por Instagram: ni web ni ficha de Google.',
      ideaTexto: [
        'Una tarta por encargo se hace para alguien y a su medida. Así que la web la hace delante de quien la mira.',
        'Los ingredientes flotan y caen al molde, se enciende el horno, se hace de noche y la masa sube. Después se monta capa a capa, en el orden real de una pastelera.',
      ],
      momentos: [
        { t: 'Los ingredientes.', d: 'En la portada flotan arándanos, chocolate, frutos rojos y nata, que caen al molde al empezar a bajar.' },
        { t: 'Al molde.', d: 'La masa cae al molde.' },
        { t: 'El horno.', d: 'Se enciende, se hace de noche y la masa sube y se dora. Mientras, se presenta Ale.' },
        { t: 'Capa a capa.', d: 'Las capas se montan una encima de otra.' },
        { t: 'La crema.', d: 'La crema la cubre entera.' },
        { t: 'Y encima.', d: 'Los frutos caen y rebotan sobre la tarta.' },
        { t: 'Para tu fecha.', d: 'La tarta montada es el final: «¿Tienes una fecha especial a la vista?».' },
      ],
      practico: { t: 'Pide tu tarta.', d: 'Un formulario corto (qué celebras, para cuándo, cuántas personas, alergias) que abre WhatsApp con el encargo ya escrito. No se envía nada a ningún servidor.' },
      movil: 'En vertical, cada paso de la receta se encuadra arriba y el texto va debajo, sin taparlo nunca. Y el scroll frena donde hay algo que leer.',
    },
    en: {
      sector: 'Cakes to order · Madrid',
      corto: 'Pastry · Madrid',
      idea: 'The cake gets made as you scroll.',
      hicimos: 'Concept, design, 3D and development.',
      partida: 'Cakes to order for events and specific people. Everything went through Instagram: no website, no Google listing.',
      ideaTexto: [
        'A cake to order is made for someone, to their measure. So the website makes it in front of whoever is looking.',
        'The ingredients float and fall into the tin, the oven switches on, night falls and the batter rises. Then it is assembled layer by layer, in the real order a pastry chef would follow.',
      ],
      momentos: [
        { t: 'The ingredients.', d: 'On the cover, blueberries, chocolate, berries and cream float, and fall into the tin as you start scrolling.' },
        { t: 'Into the tin.', d: 'The batter pours into the tin.' },
        { t: 'The oven.', d: 'It switches on, night falls, the batter rises and browns. Meanwhile, Ale introduces herself.' },
        { t: 'Layer by layer.', d: 'The layers are stacked one on top of another.' },
        { t: 'The cream.', d: 'The cream covers it whole.' },
        { t: 'On top.', d: 'The fruit falls and bounces on the cake.' },
        { t: 'For your date.', d: 'The finished cake is the ending: «Got a special date coming up?».' },
      ],
      practico: { t: 'Order your cake.', d: 'A short form (what you are celebrating, when, how many people, allergies) that opens WhatsApp with the order already written. Nothing is sent to any server.' },
      movil: 'In portrait, each step of the recipe is framed at the top and the text sits below, never on top of it. And the scroll slows down wherever there is something to read.',
    },
  },
  {
    slug: 'impulso-visual',
    nombre: 'Impulso Visual',
    sinVideo: true,
    sinImagen: true,
    sinPagina: true,
    es: {
      etq: 'ads Tech · Artes finales y PLV',
      idea: 'De días a un clic.',
      panel: ['Días', 'Un clic'],
      frase: 'Herramientas de IA a medida para preparar artes finales y presentaciones a cliente.',
      datos: [
        { n: 'IA a medida', t: 'qué hicimos' },
        { n: 'Artes finales', t: 'y presentaciones a cliente' },
      ],
    },
    en: {
      etq: 'ads Tech · Final artwork and POS',
      idea: 'From days to one click.',
      panel: ['Days', 'One click'],
      frase: 'Custom AI tools to prepare final artwork and client presentations.',
      datos: [
        { n: 'Custom AI', t: 'what we did' },
        { n: 'Final artwork', t: 'and client presentations' },
      ],
    },
  },
];
