// Las legales de la v5, en un libro de tres capítulos (components/legal/Libro.astro). Cuentan la web tal como es: lo que
// sale de ella (la carta y el chat de FRESA), lo que guarda en tu navegador y, solo si hay IDs en data/rastreo.js (o se
// compila con ADS_RASTREO_DEMO=1), la medición de Google y las campañas de Meta.
// Cada bloque lleva su nota «en cristiano», que es lo que abre el inspector al pasar por el párrafo.
// Bloques: { p } párrafo (admite <b>, <i> y <a>) · { lista } · { datos: [[clave, valor]] } · { tabla: { cab, filas } } ·
// { camino: 'carta' | 'chat' } el recorrido real de los datos · { almacen } lo que tu navegador guarda ahora mismo ·
// { eleccion } el botón para cambiar el consentimiento. Con { si: false } el bloque no sale.
import { RASTREO, CONSENTIMIENTO } from './rastreo.js';

const R = RASTREO;
export const REVISION = '1 de noviembre de 2026';

export const TITULAR = {
  razon: 'ALDASE SOCIOS GP S.L.',
  marca: 'adsPartners',
  nif: 'B21757786',
  // Sin piso ni puerta, como en la web anterior. La dirección completa, en la nota de datos fiscales
  domicilio: 'Avenida del Infante Don Luis, 14, 28660 Boadilla del Monte (Madrid)',
  correo: 'adsgroup@ads-partners.com',
  registro: 'Registro Mercantil de Madrid, hoja M-849202, inscripción 1.ª',
  web: 'ads-partners.com',
};
const T = TITULAR;
const correo = `<a href="mailto:${T.correo}">${T.correo}</a>`;

// Lo que la web guarda en el navegador. Las claves son las del código: ajustes.js, umbral.js, menu.js, secciones/fresa.js
// y consentimiento.js. Si se añade una, va aquí (y sale sola en el capítulo III y en la tabla en vivo)
export const ALMACEN = [
  { clave: 'ads-sonido', donde: 'localStorage', para: 'Recordar si quieres la web con sonido o sin él.', dura: 'Hasta que lo borres' },
  { clave: 'ads-umbral', donde: 'sessionStorage', para: 'Saber que ya pasaste la pantalla de carga y si entraste con sonido.', dura: 'Hasta cerrar la pestaña' },
  { clave: 'ads-placa', donde: 'sessionStorage', para: 'Que el viaje largo del menú hasta la placa solo salga la primera vez.', dura: 'Hasta cerrar la pestaña' },
  { clave: 'ads_chat_history', donde: 'sessionStorage', para: 'No perder tu conversación con FRESA al cambiar de página (los 20 últimos mensajes).', dura: 'Hasta cerrar la pestaña' },
  ...(R.activo ? [{ clave: CONSENTIMIENTO.clave, donde: 'localStorage', para: 'Guardar lo que elegiste sobre medición y campañas.', dura: `${CONSENTIMIENTO.meses} meses` }] : []),
];
export const COOKIES = [
  ...(R.medicion ? [
    { clave: '_ga', donde: 'Cookie de Google', para: 'Distinguir a un visitante de otro en Google Analytics.', dura: '2 años' },
    { clave: '_ga_<ID>', donde: 'Cookie de Google', para: 'Mantener el estado de tu visita en Google Analytics.', dura: '2 años' },
  ] : []),
  ...(R.campanas ? [
    { clave: '_fbp', donde: 'Cookie de Meta', para: 'Medir las campañas y enseñar anuncios en Facebook e Instagram.', dura: '3 meses' },
  ] : []),
];

// El recorrido de verdad de la carta y del chat. Si cambia el webhook (secciones/contacto.js) o el servidor del chat
// (secciones/fresa.js), cambia aquí
export const CAMINOS = {
  carta: {
    titulo: 'El viaje de tu carta',
    pasos: [
      ['Tu navegador', 'la carta de la página principal'],
      ['n8n.ads-partners.com', 'nuestro n8n, en un servidor de DigitalOcean en Fráncfort'],
      ['Microsoft 365', 'nuestro correo'],
      [T.correo, 'nos llega como un correo'],
    ],
    codigo: [
      'POST https://n8n.ads-partners.com/webhook/ads-contacto',
      '{',
      '  "name":     "tu nombre",',
      '  "company":  "tu empresa",',
      '  "interest": "lo que quieres hacer",',
      '  "email":    "tu correo",',
      '  "phone":    "tu teléfono, si lo pones",',
      '  "website":  "",            // trampa para robots: si llega lleno, se tira',
      '  "source":   "ads-partners.com/v5",',
      '  "page":     "la página desde la que escribes"',
      '}',
    ],
    fuente: 'src/scripts/secciones/contacto.js',
  },
  chat: {
    titulo: 'El viaje de un mensaje a FRESA',
    pasos: [
      ['Tu navegador', 'el chat de FRESA'],
      ['Railway', 'nuestro servidor del chat'],
      ['Anthropic', 'Claude escribe la respuesta'],
      ['Tu navegador', 'la respuesta llega letra a letra'],
    ],
    codigo: [
      '// fresa-ventas/server.mjs: lo único que escribe el servidor',
      "console.error('[fresa-ventas] error en turno:', err?.message || err);",
    ],
    fuente: 'fresa-ventas/server.mjs',
  },
};

const limpiar = (bloques) => bloques.filter((b) => b && b.si !== false);

export const CAPITULOS = [
  // ======================================  I. AVISO LEGAL  ======================================
  {
    slug: 'aviso-legal',
    num: 'I',
    titulo: 'Aviso legal',
    entradilla: 'Quiénes somos en los papeles y las reglas de esta web.',
    descripcion: 'Aviso legal de adsPartners (ALDASE SOCIOS GP S.L.): quién está detrás de ads-partners.com y las condiciones de uso de la web.',
    apartados: [
      {
        titulo: 'Quién está detrás',
        bloques: [
          { p: 'En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular de esta web:', nota: 'La ley pide que digamos quiénes somos. Somos esto.' },
          { datos: [['Titular', `${T.razon} (marca comercial ${T.marca})`], ['NIF', T.nif], ['Domicilio', T.domicilio], ['Correo', correo], ['Registro', T.registro], ['Web', T.web]], nota: `En la calle somos ${T.marca}; en los papeles, Aldase Socios GP.` },
        ],
      },
      {
        titulo: 'Para qué sirve este aviso',
        bloques: [
          { p: `Este aviso regula el uso de ${T.web} (en adelante, «la web»), de la que es titular ${T.razon}. Navegar por la web te convierte en usuario e implica que aceptas lo que dice este aviso, la política de privacidad y la de cookies, que son los otros dos capítulos de este libro.`, nota: 'Si navegas por aquí, estas son las reglas del juego.' },
        ],
      },
      {
        titulo: 'Cómo usar la web',
        bloques: [
          { p: 'Te comprometes a usar la web y lo que ofrece de forma adecuada y a no utilizarla para actividades ilícitas o contrarias a la buena fe y al orden público; para difundir contenidos racistas, xenófobos o que atenten contra los derechos humanos; para dañar nuestros sistemas, los de nuestros proveedores o los de terceros, o para intentar acceder a cuentas o datos ajenos.', nota: 'Úsala para lo normal: leer, mirar, jugar con ella y escribirnos.' },
        ],
      },
      {
        titulo: 'Lo que ves es nuestro',
        bloques: [
          { p: `Los textos, las fotografías, el diseño, las animaciones, el sonido y el código de la web son de ${T.razon} o se usan con permiso de sus autores. Que puedas verlos no te da ningún derecho para copiarlos, distribuirlos o modificarlos más allá de lo necesario para usar la web.`, nota: 'Lo hemos hecho nosotros. Si quieres usar algo, pregúntanos.' },
          { p: `La marca ${T.marca} y su logotipo son de ${T.razon}. Los logotipos y los nombres de clientes y colaboradores que aparecen en la web pertenecen a sus titulares y se muestran solo para contar el trabajo que hemos hecho con ellos.`, nota: 'Los logos de los clientes son suyos; los enseñamos porque hemos trabajado juntos.' },
        ],
      },
      {
        titulo: 'Responsabilidad',
        bloques: [
          { p: `Cuidamos lo que publicamos, pero ${T.razon} no responde de los daños que puedan causar los errores u omisiones del contenido, que la web no esté disponible en algún momento o la presencia de programas maliciosos, a pesar de haber adoptado las medidas técnicas razonables para evitarlo.`, nota: 'Ponemos cuidado, pero alguna vez algo puede fallar.' },
          { p: 'Las respuestas de FRESA, el asistente de la web, las escribe una inteligencia artificial. Son orientativas: no son una oferta, un presupuesto ni un compromiso. Lo que vale es lo que acordemos contigo por escrito.', nota: 'Si FRESA se equivoca, lo que cuenta es lo que firmemos.' },
        ],
      },
      {
        titulo: 'Enlaces a otras webs',
        bloques: [
          { p: 'La web enlaza a sitios de terceros, como WhatsApp o las webs de los proyectos que enseñamos. No controlamos esos sitios ni respondemos de su contenido ni de cómo tratan tus datos: al entrar en ellos se aplican sus propias condiciones.', nota: 'Fuera de aquí, mandan las reglas de cada casa.' },
        ],
      },
      {
        titulo: 'Ley y juzgados',
        bloques: [
          { p: `La relación entre ${T.razon} y quien usa la web se rige por la ley española. Si surge un conflicto y eres consumidor, son competentes los juzgados y tribunales de tu domicilio.`, nota: 'Ley española y, si eres consumidor, tus juzgados.' },
        ],
      },
    ],
  },

  // =====================================  II. PRIVACIDAD  =====================================
  {
    slug: 'privacidad',
    num: 'II',
    titulo: 'Privacidad',
    entradilla: 'Qué hacemos con lo que nos cuentas: contestarte, y poco más.',
    descripcion: 'Política de privacidad de adsPartners: qué datos recoge ads-partners.com (la carta y el chat de FRESA), para qué, durante cuánto tiempo y cómo ejercer tus derechos.',
    apartados: [
      {
        titulo: 'Quién trata tus datos',
        bloques: [
          { datos: [['Responsable', `${T.razon} (${T.marca})`], ['NIF', T.nif], ['Domicilio', T.domicilio], ['Correo', correo]], nota: 'Nosotros. Para cualquier cosa de tus datos, a adsgroup@.' },
        ],
      },
      {
        titulo: 'Qué datos recogemos',
        bloques: [
          { p: '<b>La carta.</b> Si nos escribes desde la carta de la página principal, recogemos tu nombre, tu empresa (si la pones), lo que quieres hacer, tu correo, tu teléfono (si lo pones) y la dirección de la página desde la que escribes. Este es su recorrido, tal cual está programado:', nota: 'Solo lo que tú escribes en la carta, y nada más.' },
          { camino: 'carta', nota: 'Esto es lo que sale de verdad de tu navegador al pulsar «Enviar la carta».' },
          { p: '<b>El chat de FRESA.</b> No te pedimos ningún dato para usarlo. Lo que escribas en la conversación se manda a nuestro servidor y de ahí a Anthropic, que con su modelo Claude escribe la respuesta. Nuestro servidor no guarda la conversación. En tu navegador se guardan los últimos mensajes hasta que cierras la pestaña, para que no se pierdan al cambiar de página.', nota: 'Lo que le cuentas a FRESA no se queda en ningún sitio nuestro.' },
          { camino: 'chat', nota: 'El servidor solo apunta los errores; la conversación no pasa por ningún archivo.' },
          { p: '<b>Al navegar.</b> GitHub, que aloja la web, registra datos técnicos de cada visita, como la dirección IP o el navegador, para servir las páginas y por seguridad. Nosotros no los usamos para saber quién eres.', nota: 'Mirar la web no nos dice quién eres.' },
          { p: '<b>Medición.</b> Si nos das permiso, Google Analytics recoge cómo usas la web (páginas que ves, cuánto tiempo, desde qué tipo de dispositivo y de qué zona aproximada) con un identificador guardado en una cookie.', nota: 'Solo si dices que sí: qué páginas se leen y cuáles no.', si: R.medicion },
          { p: '<b>Campañas.</b> Si nos das permiso, el píxel de Meta registra tu visita para medir nuestras campañas en Facebook e Instagram y para enseñar anuncios a quien ya nos conoce.', nota: 'Solo si dices que sí: saber si un anuncio trae a alguien.', si: R.campanas },
          { p: '<b>Correo y WhatsApp.</b> Si nos escribes por correo o por WhatsApp, tratamos lo que nos mandes, igual que la carta.', nota: 'Por donde nos escribas, lo mismo.' },
        ],
      },
      {
        titulo: 'Para qué',
        bloques: [
          { lista: [
            'Contestar tu carta o tu mensaje y, si te interesa, preparar una propuesta.',
            'Responder a lo que preguntes en el chat.',
            'Si llegas a ser cliente, prestarte el servicio, facturar y cumplir con nuestras obligaciones legales.',
            'Mantener la web y sus servidores seguros.',
            ...(R.medicion ? ['Con tu permiso, saber qué páginas funcionan y cuáles no.'] : []),
            ...(R.campanas ? ['Con tu permiso, medir nuestras campañas y enseñar anuncios a quien ya ha visitado la web.'] : []),
          ], nota: 'Para contestarte. Nada de listas de correo ni de vender datos.' },
          { p: 'No te mandamos boletines ni publicidad por correo si no nos lo pides, no vendemos tus datos y no tomamos decisiones automatizadas que tengan efectos sobre ti.', nota: 'FRESA contesta, pero no decide nada sobre ti.' },
        ],
      },
      {
        titulo: 'Por qué podemos',
        bloques: [
          { lista: [
            '<b>La carta, los correos y los mensajes:</b> nos pides que te contestemos, un paso previo a un posible contrato (art. 6.1.b del RGPD). La casilla de la carta confirma que has leído esta política.',
            '<b>El chat:</b> nuestro interés legítimo en atender a quien nos pregunta (art. 6.1.f del RGPD).',
            '<b>Los clientes:</b> el contrato (art. 6.1.b) y las obligaciones legales, como las fiscales (art. 6.1.c).',
            '<b>La seguridad de la web:</b> nuestro interés legítimo en que funcione y no la ataquen (art. 6.1.f).',
            ...(R.activo ? ['<b>Medición y campañas:</b> tu consentimiento (art. 6.1.a), que puedes retirar cuando quieras.'] : []),
          ], nota: 'Cada uso tiene su porqué en la ley, y este es el de cada uno.' },
        ],
      },
      {
        titulo: 'Cuánto tiempo',
        bloques: [
          { lista: [
            '<b>Cartas y mensajes:</b> mientras dure la conversación. Si no llegamos a trabajar juntos, los borramos como mucho un año después del último contacto.',
            '<b>El chat:</b> nuestro servidor no lo guarda. Anthropic borra los mensajes de sus sistemas en un plazo de 30 días, salvo que sus filtros de seguridad detecten un abuso, y no los usa para entrenar sus modelos.',
            '<b>Clientes:</b> lo que dure el servicio y, después, los plazos que marca la ley (por ejemplo, seis años para la documentación contable).',
            '<b>Registros técnicos del alojamiento:</b> los que fija GitHub.',
            ...(R.medicion ? ['<b>Google Analytics:</b> como mucho 14 meses.'] : []),
            ...(R.campanas ? ['<b>Meta:</b> los plazos de Meta para los datos de su píxel.'] : []),
          ], nota: 'Lo justo, y luego se borra.' },
        ],
      },
      {
        titulo: 'Quién más los ve',
        bloques: [
          { p: 'No cedemos tus datos a nadie, salvo que una ley nos obligue. Para que la web funcione usamos proveedores que los procesan por encargo nuestro y solo para darnos su servicio:', nota: 'Las máquinas son de otros, pero los datos siguen siendo tuyos.' },
          { tabla: {
            cab: ['Proveedor', 'Para qué', 'Dónde'],
            filas: [
              ['GitHub (Microsoft)', 'Aloja la web', 'EE. UU.'],
              ['DigitalOcean', 'El servidor de n8n, que recibe la carta', 'Alemania (Fráncfort)'],
              ['Microsoft 365', 'Nuestro correo, donde llega la carta', 'Unión Europea'],
              ['Railway', 'El servidor del chat de FRESA', 'EE. UU.'],
              ['Anthropic', 'El modelo de IA (Claude) que escribe las respuestas de FRESA', 'EE. UU.'],
              ...(R.medicion ? [['Google', 'Google Analytics, con tu permiso', 'UE y EE. UU.']] : []),
              ...(R.campanas ? [['Meta', 'El píxel de Meta, con tu permiso', 'UE y EE. UU.']] : []),
            ],
          }, nota: 'Estos son todos. Si añadimos alguno, sale aquí.' },
          { p: 'Cuando un proveedor está en Estados Unidos, la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. si el proveedor está adherido o, si no, en las cláusulas contractuales tipo aprobadas por la Comisión Europea.', nota: 'Si los datos cruzan el charco, van con las garantías que pide Europa.' },
          { p: 'Con el píxel de Meta, Meta también usa los datos para sus propios fines; en la recogida somos corresponsables con ella. Lo que hace después lo explica su política de privacidad.', nota: 'Con Meta, Meta también mira. Por eso te lo preguntamos antes.', si: R.campanas },
        ],
      },
      {
        titulo: 'Tus derechos',
        bloques: [
          { p: `Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, limitar su uso, oponerte a que los tratemos o llevártelos a otro sitio${R.activo ? ', y retirar tu consentimiento cuando quieras' : ''}. Escríbenos a ${correo} contándonos qué quieres; solo te pediremos que acredites quién eres si tenemos dudas razonables.`, nota: 'Escríbenos y lo arreglamos. Sin formularios.' },
          { p: 'Si crees que no lo hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">aepd.es</a>), C/ Jorge Juan, 6, 28001 Madrid.', nota: 'Y si no te convence, está la AEPD.' },
        ],
      },
      {
        titulo: 'Seguridad',
        bloques: [
          { p: 'La web va siempre cifrada (HTTPS), pide solo los datos imprescindibles y no guarda contraseñas ni claves en su código. Aplicamos medidas técnicas y organizativas para evitar que tus datos se pierdan, se alteren o los vea quien no debe.', nota: 'Pedimos poco, y lo poco va cifrado.' },
        ],
      },
      {
        titulo: 'Menores y cambios',
        bloques: [
          { p: 'La web está pensada para empresas y profesionales. No recogemos a sabiendas datos de menores de 14 años.', nota: 'Esto es para negocios, no para niños.' },
          { p: `Si cambiamos esta política, lo verás aquí con su fecha. Última revisión: ${REVISION}.`, nota: 'Si cambia algo, cambia aquí.' },
        ],
      },
    ],
  },

  // ======================================  III. COOKIES  ======================================
  {
    slug: 'cookies',
    num: 'III',
    titulo: 'Cookies',
    entradilla: R.activo ? 'Las que hay, para qué sirven y cómo decir que no.' : 'Ninguna. Y lo poco que guardamos, a la vista.',
    descripcion: R.activo
      ? 'Política de cookies de adsPartners: qué guarda ads-partners.com en tu navegador, qué cookies de medición y campañas usa con tu permiso y cómo cambiar tu elección.'
      : 'Política de cookies de adsPartners: ads-partners.com no usa cookies. Lo poco que guarda en tu navegador, para qué sirve y cómo borrarlo.',
    apartados: [
      {
        titulo: 'Qué es una cookie',
        bloques: [
          { p: 'Una cookie es un archivo pequeño que una web guarda en tu navegador para recordar algo de tu visita. La ley (artículo 22.2 de la LSSI-CE) trata igual otras formas de guardar datos en el navegador, como el localStorage y el sessionStorage, así que aquí te contamos todo lo que guardamos, se llame como se llame.', nota: 'Cookie o no, si se guarda en tu navegador, te lo contamos.' },
        ],
      },
      {
        titulo: R.activo ? 'Qué usamos' : 'Esta web no usa cookies',
        bloques: [
          { p: 'Ni propias ni de terceros. No hay analítica ni píxeles de publicidad, así que no te sale ningún aviso de cookies. Si algún día medimos algo, te lo preguntaremos antes y lo contaremos aquí.', nota: 'Cero cookies. Por eso no te ha saltado ningún aviso.', si: !R.activo },
          { p: 'Lo que guardamos para que la web funcione no necesita tu permiso. Lo de medición y campañas, sí: no se carga nada de Google ni de Meta hasta que dices que sí.', nota: 'Sin tu sí, ni Google ni Meta se enteran de que has venido.', si: R.activo },
        ],
      },
      {
        titulo: 'Lo que guardamos en tu navegador',
        bloques: [
          { tabla: { cab: ['Nombre', 'Para qué', 'Cuánto dura'], filas: ALMACEN.map((a) => [`<code>${a.clave}</code><small>${a.donde}</small>`, a.para, a.dura]) }, nota: 'Recordar tu elección de sonido y no repetirte la carga. Eso es todo.' },
          { p: 'Son técnicas: sirven para que la web funcione como le has pedido o para recordar lo que has elegido, por eso la ley no exige pedirte permiso. No salen de tu navegador y no nos dicen quién eres.', nota: 'No salen de tu navegador. Nosotros no las vemos.' },
        ],
      },
      {
        titulo: 'Medición y campañas',
        si: R.activo,
        bloques: [
          { tabla: { cab: ['Nombre', 'Para qué', 'Cuánto dura'], filas: COOKIES.map((c) => [`<code>${c.clave}</code><small>${c.donde}</small>`, c.para, c.dura]) }, nota: 'Estas solo existen si has dicho que sí.' },
          { p: 'Meta puede poner además sus propias cookies en su dominio (por ejemplo, <code>fr</code>) si tienes abierta una sesión en Facebook o Instagram. Google y Meta pueden transferir datos a Estados Unidos; las garantías están en el capítulo de privacidad.', nota: 'Lo que hagan Google y Meta en su casa, en sus políticas.', si: R.campanas },
          { eleccion: true, nota: 'Cambia de idea cuando quieras: es un botón.' },
        ],
      },
      {
        titulo: 'Ahora mismo, en tu navegador',
        bloques: [
          { almacen: true, nota: 'Esto no es un ejemplo: es lo que tu navegador tiene guardado de esta web ahora mismo.' },
        ],
      },
      {
        titulo: 'Cómo borrarlo tú',
        bloques: [
          { p: 'Además del botón de arriba, puedes borrar lo que guardan las webs desde tu navegador:', nota: 'Y si no te fías del botón, desde el navegador.' },
          { lista: [
            '<b>Chrome:</b> Configuración › Privacidad y seguridad › Cookies y otros datos de sitios.',
            '<b>Safari:</b> Ajustes › Privacidad › Gestionar datos de sitios web.',
            '<b>Firefox:</b> Ajustes › Privacidad y seguridad › Cookies y datos del sitio.',
            '<b>Edge:</b> Configuración › Cookies y permisos del sitio.',
          ], nota: 'Cuatro navegadores, cuatro caminos.' },
          { p: `Última revisión: ${REVISION}.`, nota: 'Si cambia algo, cambia aquí.' },
        ],
      },
    ],
  },
].map((c) => ({ ...c, apartados: c.apartados.filter((a) => a.si !== false).map((a) => ({ ...a, bloques: limpiar(a.bloques) })) }));
