/* Textos de la home (inicio.jsx), en español e inglés. JavaScript plano, sin JSX.
   Lo que va entre {llaves} se pinta en el segundo tono (gris), como los titulares de dos tonos.
   Todo lo que se dice tiene que ser verdad: los datos salen de la oferta de las tres ramas
   (ramas-data.jsx) y de los trabajos reales (proyectos-data.jsx). Los avisos de la tarjeta
   «Un equipo que se implica» son un ejemplo de cómo se trabaja, no datos. */
window.INICIO = {
  es: {
    nav: {
      servicios: 'Servicios', metodo: 'Método', proyectos: 'Proyectos', preguntas: 'Preguntas',
      cta: 'Hablemos', menu: 'Menú', explora: 'Explora',
    },

    portada: {
      insignia: ['Finance', 'Tech', 'Brand'],
      oculto: 'adsPartners: finanzas, tecnología y marca',
      lema: 'Orden por dentro. {Marca por fuera.}',
      clientesEtq: 'Han trabajado con nosotros',
      clientes: ['Fundación Jiménez Díaz', 'Inversalia', 'Impulso Visual', 'Intruder Gestión', 'Klink', 'Butter Studio', 'Métele Voltaje', 'Ava Pastelería'],
      pie: 'Finanzas, tecnología y marca para empresas que han crecido. {Un solo equipo, dentro de vuestra empresa.}',
    },

    persona: { nombre: 'Álvaro Espinosa', rol: 'Contacto y ads Tech', donde: 'en adsPartners', btn: 'Hablemos', iniciales: 'ÁE' },

    diferencia: {
      etq: 'Lo que nos diferencia',
      titulo: 'Nuestro foco es simple: {ordenar vuestra empresa.}',
      lado: 'Sin humo: números claros, procesos que funcionan solos y una marca que se entiende.',
      ladoFuerte: 'Y alguien que da la cara.',
      grande: {
        t: 'Orden por dentro. {Marca por fuera.}',
        d: 'Finanzas, tecnología y marca bajo un mismo plan, con las mismas personas de principio a fin.',
        chip: 'adsPartners', btn: 'Empezar',
      },
      precio: {
        t: 'Precio cerrado.', chip: 'Por fases',
        d: 'Cada fase arranca con su alcance y su precio por escrito. Lo que se firma es lo que se paga.',
        hojas: ['Fase 1 · Alcance', 'Fase 2 · Plazo', 'Precio · Cerrado'],
      },
      equipo: {
        t: 'Un equipo que se implica.',
        d: 'Detrás de cada empresa hay una persona que revisa los números, los procesos y los avances.',
        chip: 'Empresa en marcha',
        avisos: [
          { de: 'Correo', t: 'Cierre del mes, listo para revisar', cuando: 'ahora', ic: 'correo' },
          { de: 'adsPartners', t: 'El flujo de facturas ya funciona solo', cuando: 'hoy', ic: 'ads' },
          { de: 'Calendario', t: 'Visita mensual · jueves 10:00', cuando: '11:30', ic: 'cal' },
        ],
      },
      persona: { t: 'Nos tienes al otro lado.', d: 'Escribís y os contesta quien lleva vuestra cuenta. Sin tickets ni intermediarios.', chip: 'En línea' },
      solo: { t: 'Lo repetitivo, solo.', n: 115, u: 'facturas de proveedor leídas solas en un bar' },
      tecno: { t: 'Tecnología a medida.', d: 'Las herramientas que ya usáis, conectadas.' },
    },

    servicios: {
      etq: 'Servicios',
      titulo: 'Servicios.',
      lado: 'Tres ramas, un solo objetivo: {que vuestra empresa funcione sola.}',
      lista: [
        {
          nombre: 'Diagnóstico', corto: 'El mapa de vuestra empresa',
          d: 'Tres o cuatro semanas dentro de vuestra empresa mirando números, procesos y marca.',
          chips: ['Precio cerrado', 'Se descuenta', 'El mapa es vuestro'], href: '#metodo', signo: 'diag',
        },
        {
          nombre: 'Finanzas y rentabilidad', corto: 'Qué gana cada línea de negocio',
          d: 'El margen de cada línea de negocio, calculado igual todos los meses y en una sola pantalla.',
          chips: ['Modelo de rentabilidad', 'Cuadro de mando', 'Cierre mensual'], href: 'finance/', signo: 'fin',
        },
        {
          nombre: 'Automatización e IA', corto: 'Que lo repetitivo se haga solo',
          d: 'Una factura llega por correo, se lee sola y aparece en el cuadro de mando. Sin teclear.',
          chips: ['Flujos automáticos', 'Asistentes de IA', 'Integraciones'], href: 'tech/', img: 'assets/proyectos/gestion-hosteleria/escritorio.jpg',
        },
        {
          nombre: 'Software a medida', corto: 'Herramientas hechas para vosotros',
          d: 'Aplicaciones y portales hechos para vuestra forma de trabajar, no al revés.',
          chips: ['Portales de cliente', 'Apps internas', 'Análisis de datos'], href: 'tech/', img: 'assets/proyectos/fundacion-jimenez-diaz/escritorio.jpg',
        },
        {
          nombre: 'Marca e identidad', corto: 'Todos vuestros negocios, de la misma casa',
          d: 'Qué marcas tenéis, cuál manda y cómo se ven, con un manual para que todo el mundo las use igual.',
          chips: ['Arquitectura de marca', 'Identidad visual', 'Manual'], href: 'brand/', img: 'assets/proyectos/butter-studio/chic-escritorio.jpg',
        },
        {
          nombre: 'Diseño y desarrollo web', corto: 'Webs con una idea propia',
          d: 'Webs con un concepto propio de vuestro negocio, hechas con la misma identidad.',
          chips: ['Concepto propio', 'Escena 3D', 'Pensada para el móvil'], href: 'brand/', img: 'assets/proyectos/ava-pasteleria/escritorio.jpg',
        },
      ],
    },

    metodo: {
      etq: 'Cómo trabajamos',
      titulo: 'Método. {Paso a paso.}',
      lado: 'Cuatro fases, un método.', ladoFuerte: 'Sin humo.',
      lugar: 'Madrid · Vamos donde estéis',
      fases: [
        { etq: 'Fase 01 · Primera charla', t: 'Quedamos', dura: '45 min', d: 'Online o en persona, para ver si tiene sentido seguir. Sin compromiso.' },
        { etq: 'Fase 02 · Diagnóstico', t: 'El mapa', dura: '3–4 semanas', d: 'Varios días dentro de vuestra empresa mirando números, procesos y marca. Con precio cerrado, y el mapa es vuestro sigáis o no.' },
        { etq: 'Fase 03 · Puesta en marcha', t: 'Primer resultado', dura: '30 días – 12 semanas', d: 'El primer cierre con Finance en 30 días, el primer sistema con Tech en 4–6 semanas y la marca en 4–12, según el proyecto.' },
        { etq: 'Fase 04 · Acompañamiento', t: 'Cada mes', dura: 'Mensual', d: 'Una visita al mes y la misma persona al teléfono. Cada fase nueva, con su alcance y su precio cerrados.' },
      ],
    },

    proyectos: {
      etq: 'Proyectos',
      titulo: 'Proyectos. {Los números, encima de la mesa.}',
      ver: 'Ver el caso',
      casos: [
        {
          slug: 'gestion-hosteleria', cliente: 'Gestión para hostelería', img: 'assets/proyectos/gestion-hosteleria/escritorio.jpg',
          chip: 'ads Tech · Hostelería', kicker: 'Aplicación a medida',
          grande: '157', unidad: 'Platos con su margen',
          d: 'Una foto de la factura del proveedor y la aplicación saca el margen de cada plato de la carta.',
          datos: [['115', 'Facturas leídas'], ['3 semanas', 'De cero a funcionando'], ['A diario', 'En uso en un bar']],
        },
        {
          slug: 'fundacion-jimenez-diaz', cliente: 'Fundación Jiménez Díaz', img: 'assets/proyectos/fundacion-jimenez-diaz/escritorio.jpg',
          chip: 'ads Tech · Investigación', kicker: 'Software de análisis de imagen',
          grande: 'Píxel a píxel', unidad: 'Tejido pulmonar',
          d: 'Software para el equipo de investigación de Neumomadrid: clasifica y mide cada región de la imagen.',
          datos: [['Carga', 'La imagen y la edita'], ['Separa', 'Lo que es tejido'], ['Mide', 'Y exporta los datos']],
        },
        {
          slug: 'butter-studio', cliente: 'Butter Studio', img: 'assets/proyectos/butter-studio/escritorio.jpg',
          chip: 'ads Brand · Cookies en Madrid', kicker: 'Web con escena 3D propia',
          grande: '3D', unidad: 'La mantequilla se tuesta al bajar',
          d: 'Concepto, diseño, 3D y desarrollo, con dos propuestas, y la caja de cookies se pide por Instagram.',
          datos: [['Concepto', 'Propio del negocio'], ['2', 'Propuestas'], ['Móvil', 'Coreografía propia']],
        },
      ],
      mas: 'Más trabajo',
      otros: [
        { n: 'Métele Voltaje', slug: 'metele-voltaje' }, { n: 'Ava Pastelería', slug: 'ava-pasteleria' },
        { n: 'Impulso Visual' }, { n: 'Inversalia' }, { n: 'Klink' },
      ],
    },

    cita: { t: 'Ambición con orden. {Y un mapa que es vuestro, sigáis o no.}' },

    opiniones: {
      etq: 'Lo que dicen',
      titulo: 'Opiniones reales. {De proyectos reales.}',
      d: 'Cada opinión es de un cliente con nombre y apellidos.',
      lista: [
        { q: 'Pasé de tirarme días haciendo artes finales y presentación para mis clientes a simplemente un clic. Por fin tengo tiempo para hacer mi trabajo bien y no presentaciones.', quien: 'Massimo Riccadonna', cargo: 'Fundador y CEO', empresa: 'Impulso Visual', sector: 'Diseño' },
        { q: 'Lo que antes eran 3 personas a sueldo completo ahora es un sistema que funciona solo, y tengo a esas 3 personas haciendo lo que de verdad se les da bien, y no teclear.', quien: 'Gabriel Ortiz', cargo: 'Cofundador y CEO', empresa: 'Intruder Gestión', sector: 'Gestión' },
        { q: 'De tener una idea a construir una verdadera marca que convence a nuestros clientes de nuestra profesionalidad en un mercado tan voraz como es el inmobiliario.', quien: 'Alejandro Bermejo', cargo: 'Fundador y CEO', empresa: 'Inversalia', sector: 'Inmobiliario' },
      ],
    },

    marca: {
      izq: 'ads', der: 'Partners',
      etq: 'adsPartners® · 2026',
      t: 'No trabajamos para empresas. {Trabajamos dentro de ellas.}',
      btn: 'Conócenos',
    },

    preguntas: {
      etq: 'Preguntas frecuentes',
      titulo: 'Lo que todos preguntan {antes de empezar.}',
      fresa: '¿Más dudas? Pregúntale a FRESA',
      lista: [
        { p: '¿Hay que contratar las tres ramas?', r: 'No. Se puede empezar por una y sumar las otras cuando toque. Si nos preguntáis el orden: primero Finance, luego Tech y al final Brand. No tiene sentido automatizar lo que no se ha medido, ni contar fuera lo que dentro sigue desordenado.' },
        { p: '¿Y si después del Diagnóstico no seguimos?', r: 'No pasa nada. Os quedáis con el mapa: qué gana cada línea de negocio, qué procesos se comen las horas, cómo se ve cada marca y un plan con plazos y presupuesto. Es vuestro.' },
        { p: '¿Cuánto cuesta el Diagnóstico?', r: 'Tiene un precio cerrado y lo sabéis antes de empezar. Cubre finanzas, tecnología y marca a la vez. Si luego seguís, se descuenta entero del plan.' },
        { p: '¿Trabajáis fuera de Madrid?', r: 'Sí. El Diagnóstico se hace en vuestra empresa, con varios días allí, y después vamos una vez al mes. Estéis donde estéis.' },
        { p: '¿Sustituís a nuestra gestoría?', r: 'No. La gestoría registra y nosotros interpretamos. Fiscal, auditoría y contabilidad del día a día se quedan donde están.' },
        { p: '¿Cuánto se tarda en ver algo funcionando?', r: 'El Diagnóstico son 3 o 4 semanas. Después, 30 días hasta el primer cierre con Finance, de 4 a 6 semanas hasta el primer sistema con Tech y de 4 a 12 con Brand, según el proyecto.' },
      ],
    },

    contacto: {
      titulo: 'Hablemos de {vuestra empresa.}',
      d: 'Si no podemos ayudaros, os lo diremos en la primera llamada. Y si podemos, os diremos exactamente cómo.',
      promesas: [
        { t: '45 minutos, sin compromiso', d: 'Online o en persona, en Madrid o donde estéis.', ic: 'reloj' },
        { t: 'Precio cerrado', d: 'Cada fase, con su alcance y su precio por escrito.', ic: 'doc' },
        { t: 'El Diagnóstico se descuenta', d: 'Si seguís, se descuenta entero del plan.', ic: 'estrella' },
      ],
      form: {
        t: '¿Ordenamos {vuestra empresa?}',
        nombre: 'Tu nombre', empresa: 'Empresa', email: 'Email', telefono: 'Teléfono', mensaje: 'Cuéntanos',
        phNombre: 'Nombre', phEmpresa: 'Empresa', phEmail: 'hola@tuempresa.com', phTel: '+34 600 000 000',
        phMensaje: 'Qué os pasa, desde cuándo y qué querríais conseguir',
        enviar: 'Enviar mensaje', enviando: 'Enviando…',
        wa: '¿No eres de correos? Escríbenos por WhatsApp', waBtn: 'Enviar por WhatsApp',
        privacidad: 'Al enviar, aceptas nuestra', privacidadLink: 'política de privacidad',
        ok: '¡Recibido! Os escribimos muy pronto.', otro: 'Enviar otro',
        error: 'Faltan los campos con asterisco o el email no es válido.',
      },
    },

    pie: {
      lema: 'Finanzas, tecnología y marca para empresas que han crecido.',
      servicios: 'Servicios', empresa: 'adsPartners', contacto: 'Contacto', legal: 'Legal',
      enlaces: [['Método', 'metodo'], ['Proyectos', 'proyectos'], ['Opiniones', 'opiniones'], ['Preguntas', 'preguntas'], ['Contacto', 'contacto']],
      legales: [['Aviso legal', 'aviso-legal.html'], ['Privacidad', 'privacidad.html'], ['Cookies', 'cookies.html']],
      configurar: 'Configurar cookies',
      news: { t: 'Únete a nuestro grupo de terapia.', d: 'No te preocupes. No hacemos emails aburridos.', ph: 'Tu email', btn: 'Únete', ok: '¡Dentro! Nos vemos en tu bandeja.' },
      derechos: 'Todos los derechos reservados',
    },

    disponible: 'Disponibles para nuevos proyectos',
  },

  en: {
    nav: {
      servicios: 'Services', metodo: 'Method', proyectos: 'Work', preguntas: 'FAQ',
      cta: 'Let’s talk', menu: 'Menu', explora: 'Explore',
    },

    portada: {
      insignia: ['Finance', 'Tech', 'Brand'],
      oculto: 'adsPartners: finance, technology and brand',
      lema: 'Order inside. {Brand outside.}',
      clientesEtq: 'They have worked with us',
      clientes: ['Fundación Jiménez Díaz', 'Inversalia', 'Impulso Visual', 'Intruder Gestión', 'Klink', 'Butter Studio', 'Métele Voltaje', 'Ava Pastelería'],
      pie: 'Finance, technology and brand for companies that have grown. {One team, inside your company.}',
    },

    persona: { nombre: 'Álvaro Espinosa', rol: 'Contact and ads Tech', donde: 'at adsPartners', btn: 'Let’s talk', iniciales: 'ÁE' },

    diferencia: {
      etq: 'What sets us apart',
      titulo: 'Our focus is simple: {putting your company in order.}',
      lado: 'No smoke: clear numbers, processes that run on their own and a brand people understand.',
      ladoFuerte: 'And someone who shows up.',
      grande: {
        t: 'Order inside. {Brand outside.}',
        d: 'Finance, technology and brand under one plan, with the same people from start to finish.',
        chip: 'adsPartners', btn: 'Get started',
      },
      precio: {
        t: 'A fixed price.', chip: 'By phases',
        d: 'Every phase starts with its scope and its price in writing. What you sign is what you pay.',
        hojas: ['Phase 1 · Scope', 'Phase 2 · Timing', 'Price · Fixed'],
      },
      equipo: {
        t: 'A team that gets involved.',
        d: 'Behind every company there is a person reviewing the numbers, the processes and the progress.',
        chip: 'Company in motion',
        avisos: [
          { de: 'Email', t: 'Monthly close, ready to review', cuando: 'now', ic: 'correo' },
          { de: 'adsPartners', t: 'The invoice flow now runs on its own', cuando: 'today', ic: 'ads' },
          { de: 'Calendar', t: 'Monthly visit · Thursday 10:00', cuando: '11:30', ic: 'cal' },
        ],
      },
      persona: { t: 'We are on the other end.', d: 'You write and the person running your account answers. No tickets, no middlemen.', chip: 'Online' },
      solo: { t: 'The repetitive work, on its own.', n: 115, u: 'supplier invoices read on their own in a bar' },
      tecno: { t: 'Custom technology.', d: 'The tools you already use, connected.' },
    },

    servicios: {
      etq: 'Services',
      titulo: 'Services.',
      lado: 'Three branches, one goal: {a company that runs on its own.}',
      lista: [
        {
          nombre: 'Diagnosis', corto: 'The map of your company',
          d: 'Three or four weeks inside your company looking at numbers, processes and brand.',
          chips: ['Fixed price', 'Deducted later', 'The map is yours'], href: '#metodo', signo: 'diag',
        },
        {
          nombre: 'Finance and profitability', corto: 'What each business line earns',
          d: 'The margin of each business line, calculated the same way every month, on a single screen.',
          chips: ['Profitability model', 'Dashboard', 'Monthly close'], href: 'finance/', signo: 'fin',
        },
        {
          nombre: 'Automation and AI', corto: 'The repetitive work, on its own',
          d: 'An invoice arrives by email, reads itself and shows up on the dashboard. No typing.',
          chips: ['Automated flows', 'AI assistants', 'Integrations'], href: 'tech/', img: 'assets/proyectos/gestion-hosteleria/escritorio.jpg',
        },
        {
          nombre: 'Custom software', corto: 'Tools built for you',
          d: 'Apps and portals built around the way you work, not the other way round.',
          chips: ['Customer portals', 'Internal apps', 'Data analysis'], href: 'tech/', img: 'assets/proyectos/fundacion-jimenez-diaz/escritorio.jpg',
        },
        {
          nombre: 'Brand and identity', corto: 'All your businesses, from the same house',
          d: 'Which brands you have, which one leads and how they look, with a manual so everyone uses them the same way.',
          chips: ['Brand architecture', 'Visual identity', 'Manual'], href: 'brand/', img: 'assets/proyectos/butter-studio/chic-escritorio.jpg',
        },
        {
          nombre: 'Web design and build', corto: 'Websites with an idea of their own',
          d: 'Websites with a concept of their own for your business, built with the same identity.',
          chips: ['Own concept', '3D scene', 'Built for mobile'], href: 'brand/', img: 'assets/proyectos/ava-pasteleria/escritorio.jpg',
        },
      ],
    },

    metodo: {
      etq: 'How we work',
      titulo: 'Method. {Step by step.}',
      lado: 'Four phases, one method.', ladoFuerte: 'No smoke.',
      lugar: 'Madrid · We come to you',
      fases: [
        { etq: 'Phase 01 · First chat', t: 'We meet', dura: '45 min', d: 'Online or in person, to see whether it makes sense to go on. No strings attached.' },
        { etq: 'Phase 02 · Diagnosis', t: 'The map', dura: '3–4 weeks', d: 'Several days inside your company looking at numbers, processes and brand. At a fixed price, and the map is yours whether you go on or not.' },
        { etq: 'Phase 03 · Getting it running', t: 'First result', dura: '30 days – 12 weeks', d: 'The first close with Finance in 30 days, the first system with Tech in 4–6 weeks and the brand in 4–12, depending on the project.' },
        { etq: 'Phase 04 · Ongoing', t: 'Every month', dura: 'Monthly', d: 'One visit a month and the same person on the phone. Every new phase with its scope and its price fixed.' },
      ],
    },

    proyectos: {
      etq: 'Work',
      titulo: 'Work. {The numbers, on the table.}',
      ver: 'See the case',
      casos: [
        {
          slug: 'gestion-hosteleria', cliente: 'Hospitality management', img: 'assets/proyectos/gestion-hosteleria/escritorio.jpg',
          chip: 'ads Tech · Hospitality', kicker: 'Custom app',
          grande: '157', unidad: 'Dishes with their margin',
          d: 'A photo of the supplier invoice and the app works out the margin of every dish on the menu.',
          datos: [['115', 'Invoices read'], ['3 weeks', 'From zero to running'], ['Daily', 'In use in a bar']],
        },
        {
          slug: 'fundacion-jimenez-diaz', cliente: 'Fundación Jiménez Díaz', img: 'assets/proyectos/fundacion-jimenez-diaz/escritorio.jpg',
          chip: 'ads Tech · Research', kicker: 'Image analysis software',
          grande: 'Pixel by pixel', unidad: 'Lung tissue',
          d: 'Software for the Neumomadrid research team: it classifies and measures every region of the image.',
          datos: [['Loads', 'The image and edits it'], ['Separates', 'What is tissue'], ['Measures', 'And exports the data']],
        },
        {
          slug: 'butter-studio', cliente: 'Butter Studio', img: 'assets/proyectos/butter-studio/escritorio.jpg',
          chip: 'ads Brand · Cookies in Madrid', kicker: 'Website with its own 3D scene',
          grande: '3D', unidad: 'The butter browns as you scroll',
          d: 'Concept, design, 3D and build, with two proposals, and the cookie box is ordered through Instagram.',
          datos: [['Concept', 'Of the business itself'], ['2', 'Proposals'], ['Mobile', 'Its own choreography']],
        },
      ],
      mas: 'More work',
      otros: [
        { n: 'Métele Voltaje', slug: 'metele-voltaje' }, { n: 'Ava Pastelería', slug: 'ava-pasteleria' },
        { n: 'Impulso Visual' }, { n: 'Inversalia' }, { n: 'Klink' },
      ],
    },

    cita: { t: 'Ambition with order. {And a map that is yours, whether you go on or not.}' },

    opiniones: {
      etq: 'What they say',
      titulo: 'Real reviews. {From real projects.}',
      d: 'Every review comes from a client with a name and a surname.',
      lista: [
        { q: 'I went from spending days on final artwork and presentations for my clients to a single click. I finally have time to do my job well, not presentations.', quien: 'Massimo Riccadonna', cargo: 'Founder & CEO', empresa: 'Impulso Visual', sector: 'Design' },
        { q: 'What used to be three people on full salary is now a system that runs on its own, and those three people are doing what they are really good at instead of typing.', quien: 'Gabriel Ortiz', cargo: 'Co-founder & CEO', empresa: 'Intruder Gestión', sector: 'Management' },
        { q: 'From having an idea to building a real brand that convinces our clients of our professionalism, in a market as fierce as real estate.', quien: 'Alejandro Bermejo', cargo: 'Founder & CEO', empresa: 'Inversalia', sector: 'Real estate' },
      ],
    },

    marca: {
      izq: 'ads', der: 'Partners',
      etq: 'adsPartners® · 2026',
      t: 'We don’t work for companies. {We work inside them.}',
      btn: 'Meet us',
    },

    preguntas: {
      etq: 'FAQ',
      titulo: 'What everyone asks {before we start.}',
      fresa: 'More questions? Ask FRESA',
      lista: [
        { p: 'Do we have to hire all three branches?', r: 'No. You can start with one and add the others when the time comes. If you ask us about the order: Finance first, then Tech, Brand last. There is no point automating what has not been measured, or telling the outside world what is still a mess inside.' },
        { p: 'What if we do not go on after the Diagnosis?', r: 'Nothing happens. You keep the map: what each business line earns, which processes eat the hours, how each brand looks and a plan with timings and budget. It is yours.' },
        { p: 'How much does the Diagnosis cost?', r: 'It has a fixed price and you know it before we start. It covers finance, technology and brand at once. If you go on, it is deducted in full from the plan.' },
        { p: 'Do you work outside Madrid?', r: 'Yes. The Diagnosis is done at your company, with several days there, and after that we come once a month. Wherever you are.' },
        { p: 'Do you replace our accountants?', r: 'No. Your accountants record and we interpret. Tax, auditing and day-to-day bookkeeping stay where they are.' },
        { p: 'How long until we see something working?', r: 'The Diagnosis takes 3 or 4 weeks. After that, 30 days to the first monthly close with Finance, 4 to 6 weeks to the first system with Tech and 4 to 12 with Brand, depending on the project.' },
      ],
    },

    contacto: {
      titulo: 'Let’s talk about {your company.}',
      d: 'If we cannot help you, we will tell you on the first call. And if we can, we will tell you exactly how.',
      promesas: [
        { t: '45 minutes, no strings attached', d: 'Online or in person, in Madrid or wherever you are.', ic: 'reloj' },
        { t: 'A fixed price', d: 'Every phase with its scope and its price in writing.', ic: 'doc' },
        { t: 'The Diagnosis is deducted', d: 'If you go on, it is deducted in full from the plan.', ic: 'estrella' },
      ],
      form: {
        t: 'Shall we put {your company in order?}',
        nombre: 'Your name', empresa: 'Company', email: 'Email', telefono: 'Phone', mensaje: 'Tell us',
        phNombre: 'Name', phEmpresa: 'Company', phEmail: 'hello@yourcompany.com', phTel: '+34 600 000 000',
        phMensaje: 'What is going on, since when and what you would like to achieve',
        enviar: 'Send message', enviando: 'Sending…',
        wa: 'Not into email? Message us on WhatsApp', waBtn: 'Send on WhatsApp',
        privacidad: 'By sending, you accept our', privacidadLink: 'privacy policy',
        ok: 'Got it! We will write to you very soon.', otro: 'Send another',
        error: 'Some required fields are missing or the email is not valid.',
      },
    },

    pie: {
      lema: 'Finance, technology and brand for companies that have grown.',
      servicios: 'Services', empresa: 'adsPartners', contacto: 'Contact', legal: 'Legal',
      enlaces: [['Method', 'metodo'], ['Work', 'proyectos'], ['Reviews', 'opiniones'], ['FAQ', 'preguntas'], ['Contact', 'contacto']],
      legales: [['Legal notice', 'aviso-legal.html'], ['Privacy', 'privacidad.html'], ['Cookies', 'cookies.html']],
      configurar: 'Cookie settings',
      news: { t: 'Join our therapy group.', d: 'Don’t worry. We don’t send boring emails.', ph: 'Your email', btn: 'Join', ok: 'You’re in! See you in your inbox.' },
      derechos: 'All rights reserved',
    },

    disponible: 'Available for new projects',
  },
};
