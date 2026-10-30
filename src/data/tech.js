// La página Tech, «La sala de máquinas»: el slider de innovaciones de orano.group (la referencia que eligió Álvaro
// el 30-oct), con lo nuestro. Una innovación por cada servicio de Tech de «Qué somos»; cada una tiene su modelo en
// alambre (scripts/tech/modelos.js), su artículo al entrar y su misión, que se hace con el ratón o el dedo.
// Todo lo que se dice tiene que ser verdad: las cifras salen de los proyectos (src/data/proyectos.js) o se miden en
// la propia misión. Nada inventado.
// mision.modulo: el fichero de scripts/tech/ que la monta; sin él, todavía no tiene misión (no sale el botón).
// El orden es el que pidió Álvaro el 30-oct: Pregunta, Conecta, Automatiza y A medida (y de la cuarta, otra vez a la
// primera: el slider da la vuelta).
import lectura from './lectura.json';

// Lo que devolvió la lectura de la factura de la misión «Automatiza»: la llamada real a la API de Claude, grabada una
// vez con scripts/grabar-lectura.mjs. Mientras no esté grabada (grabada: false), son los datos de la propia factura y
// no se enseña ni el tiempo ni ninguna cifra.
export const LECTURA = lectura;
const segundos = (ms) => (ms / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 });

export const TECH = [
  {
    slug: 'pregunta',
    servicio: 'Asistentes de IA',
    titulo: 'Pregunta',
    texto: 'Tu negocio, en una conversación. Le preguntas como a alguien de tu equipo y el asistente busca en tus datos y te contesta con la cifra y la gráfica.',
    puntos: [
      { p: [0.0, 0.95, -0.42], t: 'Respuesta · gráfica' },
      { p: [0.55, 0.0, 0.35], t: 'Tus datos' },
    ],
    articulo: {
      intro: [
        'Los datos de una empresa están repartidos: las ventas en un sitio, los gastos en otro y los clientes en un tercero. Para saber cómo va el mes hay que pedírselo a alguien y esperar.',
        'Un asistente de IA conectado a esos datos contesta al momento, en lenguaje normal. Y no se inventa nada: cada respuesta sale de una consulta a tus datos, que puedes ver.',
      ],
      permite: [
        'Preguntar por ventas, gastos o clientes como se lo preguntarías a una persona',
        'Ver la respuesta con su cifra y su gráfica, no un párrafo',
        'Saber de dónde sale cada número: la consulta queda a la vista',
        'Usarlo desde el ordenador, el móvil o el WhatsApp del equipo',
      ],
      cifras: [],
      frase: 'Pregunta como hablas. Contesta con tus datos',
      ficha: [
        ['Modelo', 'Claude, de Anthropic'],
        ['Datos', 'Excel, base de datos, ERP o CRM'],
        ['Acceso', 'Solo lectura: no toca nada'],
        ['Respuesta', 'Cifra, gráfica y la consulta que la saca'],
        ['Dónde', 'Web, móvil o WhatsApp'],
        ['Privacidad', 'Tus datos no entrenan ningún modelo'],
      ],
      beneficios: [
        ['Rapidez', 'La respuesta en segundos, no en un informe a final de mes'],
        ['Para todos', 'No hace falta saber de Excel ni de bases de datos'],
        ['Confianza', 'Cada cifra con su origen'],
        ['Siempre', 'A cualquier hora, sin esperar a nadie'],
      ],
    },
    mision: null,
  },
  {
    slug: 'conecta',
    servicio: 'Integraciones',
    titulo: 'Conecta',
    texto: 'Tus herramientas no se hablan: la tienda vende, el Excel no se entera y alguien copia los pedidos. Las conectamos para que los datos pasen solos.',
    puntos: [
      { p: [0.0, 0.32, 0.0], t: 'Conexión' },
      { p: [-1.25, 0.95, 0.1], t: 'Tienda' },
    ],
    articulo: {
      intro: [
        'Casi todas las empresas trabajan con cinco o seis herramientas que no se conocen entre sí: la tienda, el TPV, el Excel, el correo, el banco. Entre medias, alguien copia y pega.',
        'Las conectamos para que lo que pasa en una llegue a las demás en el momento. Sin cambiar de herramientas: las tuyas, hablando entre ellas.',
      ],
      permite: [
        'Que cada pedido de la tienda llegue solo a tu Excel o tu ERP',
        'Que el stock se actualice en todas partes a la vez',
        'Que los cobros del banco se crucen con las facturas',
        'Que nadie tenga que copiar y pegar entre programas',
      ],
      cifras: [],
      frase: 'Tus herramientas, hablando entre ellas',
      ficha: [
        ['Conecta', 'Tiendas, TPV, Excel, ERP, CRM, correo y bancos'],
        ['Cómo', 'APIs y webhooks, en tiempo real'],
        ['Dónde corre', 'n8n en nuestro servidor, o en el tuyo'],
        ['Fallos', 'Si algo no pasa, se reintenta y te avisa'],
        ['Registro', 'Cada dato que pasa queda apuntado'],
        ['Cambios', 'Ninguno en tus herramientas'],
      ],
      beneficios: [
        ['Un solo dato', 'La misma cifra en todas partes'],
        ['Al momento', 'Sin esperar a que alguien lo pase'],
        ['Sin errores', 'Nada de copiar y pegar'],
        ['Tranquilidad', 'Si algo falla, te enteras'],
      ],
    },
    mision: null,
  },
  {
    slug: 'automatiza',
    servicio: 'Automatizaciones',
    titulo: 'Automatiza',
    texto: 'Lo que alguien hace a mano cada semana, una máquina lo hace sola: leer documentos, pasar datos de un programa a otro, avisar a quien toca. En segundos y sin errores de dedo.',
    // Los círculos sobre el modelo, al entrar: dónde (en el modelo) y qué dicen (con la etiqueta del inspector)
    puntos: [
      { p: [0.42, 0.58, 0.12], t: 'Total · leído' },
      { p: [-0.62, -0.62, 0.55], t: 'Lector' },
    ],
    articulo: {
      intro: [
        'Cada empresa tiene tareas que alguien repite a mano todas las semanas: pasar facturas a un Excel, copiar pedidos de un programa a otro, rellenar el mismo informe o avisar a quien toca cuando algo cambia.',
        'Las automatizamos de principio a fin. La máquina lee el documento o el correo, saca los datos, comprueba que cuadran y los deja donde se usan. Lo que tiene dudas se marca para que lo mire una persona.',
        'Ya lo hacemos con las facturas de proveedores en hostelería, y el mismo método vale para pedidos, partes de trabajo, contratos o cualquier papel que hoy se teclea.',
      ],
      permite: [
        'Leer facturas, albaranes, pedidos o contratos en PDF, foto o correo',
        'Comprobar que los datos cuadran antes de apuntar nada',
        'Dejar cada dato en tu Excel, tu ERP o tu app, sin copiar a mano',
        'Avisar por correo o WhatsApp a quien le toca, cuando le toca',
      ],
      // Las cifras salen de la lectura grabada de la factura de la misión; sin grabar, no hay cifras
      cifras: LECTURA.grabada ? [
        { n: `${segundos(LECTURA.ms)} s`, t: 'tardó la IA en leer la factura de la misión' },
        { n: String(Object.keys(LECTURA.campos).length), t: 'datos sacados y comprobados, sin plantilla' },
      ] : [],
      frase: 'Lo que hoy se teclea, mañana se apunta solo',
      ficha: [
        ['Entrada', 'PDF, foto, correo o formulario'],
        ['Lectura', 'Un modelo de IA con visión, sin plantillas por documento'],
        ['Comprobación', 'Las cuentas se rehacen: si no cuadran, no se apunta'],
        ['Salida', 'Excel, ERP, base de datos o tu app'],
        ['Avisos', 'Correo o WhatsApp'],
        ['Hecho en', 'n8n o código propio, según el caso'],
      ],
      beneficios: [
        ['Tiempo', 'Las horas de copiar a mano vuelven a lo que importa'],
        ['Errores', 'Nada de cifras mal tecleadas'],
        ['Control', 'Sabes lo que entra el mismo día, no a final de mes'],
        ['Escala', 'Diez documentos o mil, el mismo trabajo'],
      ],
    },
    mision: {
      modulo: 'factura',
      orden: 'Pasa el lector por la factura para sacar sus datos',
      gesto: 'Arrastra el lector para leer la factura',
      curso: 'Leyendo la factura…',
      veredicto: 'Factura leída · cuadra',
      explica: 'Cada dato se reconoce donde esté, sin plantillas: proveedor, fecha, base, IVA y total. Se rehacen las cuentas y, si cuadran, la línea se apunta sola en tu Excel.',
    },
  },
  {
    slug: 'a-medida',
    servicio: 'Software a medida',
    titulo: 'A medida',
    texto: 'Cuando la herramienta no existe, la hacemos. Para el equipo de Neumomadrid de la FJD, un programa que separa el tejido pulmonar píxel a píxel y mide cada región.',
    puntos: [
      { p: [0.0, -0.08, 0.05], t: 'Muestra' },
      { p: [0.28, 1.22, -0.32], t: 'Óptica' },
    ],
    articulo: {
      intro: [
        'Hay trabajos que ninguna aplicación del mercado resuelve, porque son solo tuyos. Ahí hace falta software a medida: pensado para tu proceso, no al revés.',
        'Tysiu fue el primero, para el equipo de investigación de Neumomadrid de la Fundación Jiménez Díaz. El programa carga la imagen del tejido pulmonar, separa píxel a píxel lo que es tejido de lo que no y mide cada región.',
      ],
      permite: [
        'Cargar y editar la imagen de cada muestra',
        'Separar el tejido del aire, píxel a píxel',
        'Medir cada región, una a una',
        'Exportar los resultados para el estudio',
      ],
      cifras: [
        { n: '2024', t: 'nuestro primer software a medida' },
      ],
      frase: 'Software que analiza tejido pulmonar, píxel a píxel',
      ficha: [
        ['Para', 'Neumomadrid · Fundación Jiménez Díaz'],
        ['Año', '2024'],
        ['Entrada', 'La imagen de la muestra'],
        ['Proceso', 'Separa el tejido y mide cada región'],
        ['Salida', 'Las medidas, exportadas'],
        ['Equipo', 'Álvaro'],
      ],
      beneficios: [
        ['Hecho a su medida', 'Su proceso, tal cual lo trabajaban'],
        ['Precisión', 'Cada píxel cuenta, no una estimación a ojo'],
        ['Repetible', 'El mismo criterio en cada imagen'],
        ['Suyo', 'Lo usaron mucho tiempo después'],
      ],
    },
    mision: {
      modulo: 'tejido',
      orden: 'Analiza la muestra para separar el tejido del aire',
      gesto: 'Clic para analizar',
      gestoDedo: 'Toca para analizar',
      curso: 'Análisis en curso…',
      veredicto: 'Tejido segmentado',
      explica: 'El tejido se separa del aire píxel a píxel y cada región se mide: los colores cálidos son las más grandes. Lo que ves lo está calculando ahora tu navegador.',
    },
  },
];

// La factura de ejemplo de la misión «Automatiza». Inventada y marcada como ejemplo: no es de ningún proveedor real.
export const FACTURA = {
  proveedor: 'Huerta de Ejemplo, S.L.',
  nif: 'B00000000',
  numero: 'F-2026/0417',
  fecha: '27/10/2026',
  lineas: [
    ['Tomate pera', '12 kg', '1,85', '22,20'],
    ['Burrata 125 g', '20 ud', '1,40', '28,00'],
    ['Aceite de oliva virgen extra', '2 × 5 l', '31,50', '63,00'],
  ],
  base: '113,20',
  ivaTipo: '10 %',
  iva: '11,32',
  total: '124,52',
};
