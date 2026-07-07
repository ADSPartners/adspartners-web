/* global React */
// ============= I18N =============
const { useState: useStateI18n, useEffect: useEffectI18n, useContext, createContext, useCallback } = React;

const DICT = {
  es: {
    // NAV
    'nav.tag.creative': 'Creative',
    'nav.tag.studio': 'Growth Studio',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copiado ✓',
    'nav.based': 'Not for everyone',
    'nav.cart.default': '¿Quedamos?',
    'nav.cart.hover': 'Te vamos a caer bien',
    'nav.lang.aria': 'Change language',

    // SIDE MENU
    'side.manifesto': 'SOBRE ADSPARTNERS',
    'side.cases': 'NUESTROS SOCIOS',
    'side.team': 'FOUNDERS',
    'side.studio': 'LO QUE HACEMOS',
    'side.work': 'CÓMO LO HACEMOS',
    'side.winwin': 'WIN — WIN',
    'side.faqs': 'FAQs',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Navegación lateral',

    // HERO
    'hero.meta.location': 'Madrid',
    'hero.meta.brand': 'adsPartners® / Est. 2025',
    'hero.meta.studio': 'BASED IN MADRID / AVAILABLE WORLDWIDE',
    'hero.title.line1': 'Not for',
    'hero.title.line2': 'everyone.',
    'hero.tagline.line1': 'Marca, creatividad y performance como una sola práctica. Para marcas que se toman el crecimiento en serio.',
    'hero.tagline.part1': 'Marca, creatividad y performance como una sola práctica.',
    'hero.tagline.part2': 'Diseñado para negocios que se toman el crecimiento en serio.',
    'hero.eyebrow': 'BASED IN MADRID / AVAILABLE WORLDWIDE.',
    'hero.tagline.systems': 'No venimos a vender campañas sueltas. Vendemos un sistema.',
    'hero.tagline.line2': '',
    'hero.tagline.sub': 'Not for everyone',
    'hero.stamp.creative': '(creative)',
    'hero.stamp.growth': 'Growth',
    'hero.stamp.studioword': 'Studio',
    'hero.stamp.studio': 'Growth Studio',
    'hero.stamp.notforeveryone': 'Acción. Disciplina. Sistema.',
    'hero.stamp.available': 'Disponible en todo el mundo',
    'hero.scroll': 'Scroll',

    // MANIFIESTO
    'mani.label': 'SOBRE ADSPARTNERS',
    'mani.num': '(01)',
    'mani.text.html': 'adsPartners es un <em>Growth Studio</em> que trabaja con marcas de producto para que dejen de depender de la <span class="accent">improvisación</span> y empiecen a crecer con un sistema. <em>No entramos a hacer marketing.</em> Entramos a ordenar el caos y a construir algo que tenga sentido a largo plazo.',
    'mani.p1': 'adsPartners es un Creative Growth Studio para negocios ambiciosos. Entramos a ordenar el caos y construir el sistema que lleve a las marcas del movimiento al crecimiento.',
    'mani.p2': 'Captación, conversión y dirección de marca como un sistema conectado. No solo ejecutamos, y nunca hacemos servicios aislados. Arreglamos lo que no funciona. Construimos el sistema que lo escala.',
    'mani.aside.h': '(creative) Growth Studio',
    'mani.aside.p1': 'Trabajamos como socios, no como proveedores. Eso significa que no estamos fuera mirando, estamos dentro pensando, proponiendo y ejecutando contigo.',
    'mani.aside.p2': 'Si el negocio crece, nosotros crecemos. Si no, no tiene sentido lo que estamos haciendo.',
    'mani.aside.p3': 'Cercanos en el trato. Serios en el trabajo.',
    'mani.poladroid.alt': 'Álvaro, Dani y Sebas',
    'mani.poladroid.cap': 'los socios · 2024',

    // SERVICES
    'srv.label': 'LO QUE HACEMOS',
    'srv.eyebrow': 'Diseñamos y lanzamos sistemas de crecimiento para marcas ambiciosas.',
    'srv.rot.1.title': 'El crecimiento es orden.',
    'srv.rot.1.body': 'La mayoría de marcas no fallan al crecer. Fallan al gestionar lo que ya tienen. Entramos a ordenar lo que hay antes de añadir nada nuevo.',
    'srv.rot.2.title': 'La marca es un sistema.',
    'srv.rot.2.body': 'Una marca no es cómo se ve. Es cómo cada parte del negocio concuerda con las demás. Cuando el sistema aguanta, la marca camina sola.',
    'srv.rot.3.title': 'Socios antes que proveedores.',
    'srv.rot.3.body': 'Las agencias venden horas. Los proveedores venden entregables. Nosotros vendemos un sitio dentro del negocio; no el de las reuniones, el sitio donde se toman las decisiones de verdad.',
    'srv.item.1': 'Análisis de mercado',
    'srv.item.2': 'Estrategia de Embudo de Venta',
    'srv.item.3': 'Diseño Web',
    'srv.item.4': 'Lanzamiento de Campañas',
    'srv.item.5': 'Captación de leads',
    'srv.item.6': 'Automatización con IA',
    'srv.num': '(02)',
    'srv.title.line1': 'Dos',
    'srv.title.line2.html': '<em>servicios.</em>',
    'srv.kicker': 'Uno construye el crecimiento. El otro construye la marca capaz de sostenerlo.',
    'srv.intro': 'Trabajamos en dos frentes. Uno construye el sistema que hace crecer la marca. El otro construye la marca que hace que ese crecimiento tenga sentido.',

    // Growth Studio panel
    'srv.gs.code': 'GS',
    'srv.gs.name': 'Growth Studio',
    'srv.gs.line': 'Diseñado para captar, convertir y hacer que el crecimiento se repita.',
    'srv.gs.tagline': 'Sistemas de captación, conversión y fidelización.',
    'srv.gs.1.name': 'Estrategia de Funnel',
    'srv.gs.1.desc': 'Diseñamos la estructura completa del sistema para que captación, conversión y recurrencia trabajen en la misma dirección.',
    'srv.gs.1.line': 'Orden antes que escala.',
    'srv.gs.2.name': 'Captación de Clientes',
    'srv.gs.2.desc': 'Activamos demanda a través de campañas, testeo creativo y sistemas de adquisición orientados a resultados.',
    'srv.gs.2.line': 'La demanda necesita un sistema, no solo anuncios.',
    'srv.gs.3.name': 'Sistema de Conversión',
    'srv.gs.3.desc': 'Optimizamos páginas, ofertas y recorridos para convertir tráfico en ventas con más claridad y menos fricción.',
    'srv.gs.3.line': 'El tráfico no sirve si la página no cierra.',
    'srv.gs.4.name': 'Retención y Fidelización',
    'srv.gs.4.desc': 'Construimos flujos y mecanismos para aumentar recurrencia, LTV y relación con el cliente.',
    'srv.gs.4.line': 'Crecer se encarece cuando los clientes no vuelven.',

    // Brand Studio panel
    'srv.bs.code': 'BS',
    'srv.bs.name': 'Brand Studio',
    'srv.bs.line': 'Diseñado para construir marcas más claras, más sólidas y más difíciles de ignorar.',
    'srv.bs.tagline': 'Sistemas de claridad, posicionamiento y presencia digital.',
    'srv.bs.1.name': 'Auditoría de Branding',
    'srv.bs.1.desc': 'Analizamos la marca, el negocio y su contexto para detectar incoherencias, oportunidades y puntos de mejora.',
    'srv.bs.1.line': 'Antes de cambiar la marca, entender la esencia.',
    'srv.bs.2.name': 'Estrategia y Posicionamiento',
    'srv.bs.2.desc': 'Definimos el lugar que la marca quiere ocupar y la forma en la que debe comunicarse para diferenciarse.',
    'srv.bs.2.line': 'Si pareces como los demás, compites como los demás.',
    'srv.bs.3.name': 'Sistema de Identidad Visual',
    'srv.bs.3.desc': 'Construimos un sistema visual coherente, reconocible y preparado para aplicarse con consistencia.',
    'srv.bs.3.line': 'Una marca debe sentirse coherente antes que bonita.',
    'srv.bs.4.name': 'Esenciales de Branding Digital',
    'srv.bs.4.desc': 'Desarrollamos las piezas digitales esenciales para que la marca se vea y funcione bien en entorno online.',
    'srv.bs.4.line': 'La presencia digital es parte del producto.',

    // TEAM
    'team.topbar.l': '(03) — equipo · expediente',
    'team.topbar.r': 'adsPartners · 03 founders · MMXXVI',
    'team.kicker': '· staff list · roll call',
    'team.kicker.right1': 'file no. AE / DD / SL',
    'team.kicker.right2': 'archivado · 04·2026',
    'team.title.1.html': 'Founders',
    'team.title.2': '',
    'team.founders.sub': 'Tres fundadores. Diferentes entre nosotros pero complementarios en cada proyecto. Creemos en que el esfuerzo, la constancia y búsqueda de la excelencia son las claves del éxito. Cuando hablas con nosotros, hablas con la gente que está encima del trabajo.',
    'team.lede': 'Los founder, sin equipo innecesario, sin fachada repelente, pero con ganas de comerse el mundo, ¡SIEMPRE!',
    'team.foot.archivo.k': 'archivo',
    'team.foot.archivo.v': 'adsP · 03 · team · v3',
    'team.foot.cargo.k': 'cargo',
    'team.foot.cargo.v': 'Founders · sin escala',
    'team.foot.contacto.k': 'contacto',
    'team.foot.seal.top': 'FOUNDERS\nADVISORY',
    'team.foot.seal.bot': 'EXPLICIT · NO HAY JUNIOR · NO HAY SENIOR',
    'team.expediente': 'expediente',
    'team.archivado': 'archivado · 04·2026',
    'team.adsp.founder': 'adsP · founder',
    'team.role.alvaro': 'Strategy & Sales',
    'team.role.daniel': 'Performance & Finance',
    'team.role.sebas': 'Brand & Creative',

    // bios — back of polaroid
    'team.bio.alvaro.1': 'Cuando era niño, se preguntaba para todo "¿y esto para qué sirve?".',
    'team.bio.alvaro.2': 'Hoy en día, sigue siendo igual, y no para hasta que la respuesta es clara o automatizada.',
    'team.bio.alvaro.3': 'Es el estratega que está detrás de cada venta y el encargado de que los flujos se puedan automatizar con Inteligencia Artificial.',
    'team.bio.alvaro.4': 'Está constantemente investigando y buscando soluciones o mejoras a todo negocio que no esté sacando su máximo potencial.',

    'team.bio.daniel.1': 'De pequeño ya preguntaba cuánto costaba algo antes de comprarlo. Y después, se preguntaba si era inteligente gastar ese dinero.',
    'team.bio.daniel.2': 'Hoy en día, no gasta nada que no pueda llevarle hasta un punto positivo.',
    'team.bio.daniel.3': 'Es el encargado de que tus campañas se optimicen y sean beneficiosas. Convierte datos en decisiones. Decisiones en resultados. Y resultados en rentabilidad.',
    'team.bio.daniel.4': '',

    'team.bio.sebas.1': 'Cuando era pequeño jugaba a aprenderse los logos de las empresas. Siempre quería combinar los colores de su ropa. Y le gustaba llamar la atención.',
    'team.bio.sebas.2': 'Hoy en día, buscar llamar la atención de las personas creando marcas y poniéndolas en acción.',
    'team.bio.sebas.3': 'Es el encargado de que las marcas comuniquen correctamente lo que quieren representar a través de las nuevas tecnologías.',

    // WORK MODEL — THE WIN-WIN METHOD
    'work.label': 'CÓMO LO HACEMOS',
    'work.intro.title': 'PARTNERS WORKFLOW',
    'work.intro.sub': 'No trabajamos para ti. Trabajamos contigo.',
    'work.wf.1.title': 'Descubrimiento.',
    'work.wf.1.desc': 'Aprendemos el negocio antes de tocar el marketing. Sector, cliente, ticket, márgenes, proceso de venta actual. Encontramos qué está vendiendo, qué no, y dónde se está atascando el crecimiento.',
    'work.wf.2.title': 'Estrategia.',
    'work.wf.2.desc': 'Definimos la arquitectura. Público, ángulo de captación, oferta de entrada, embudo, canales, presupuesto, KPIs. El recorrido desde el primer impacto hasta el cierre, planificado antes de gastar algo de dinero.',
    'work.wf.3.title': 'Embudo de venta.',
    'work.wf.3.desc': 'Montamos lo que la estrategia necesita para funcionar. Landing page, formularios, guion y edición del VSL, dirección creativa para anuncios, captación de leads, medición. El sistema completo, testado antes de lanzar.',
    'work.wf.4.title': 'Campaña de lanzamiento.',
    'work.wf.4.desc': 'Las campañas se lanzan. Primeras señales en 2-3 semanas. Señal sólida entre 60 y 90 días. A partir de ahí, optimizamos.',
    'win.left.html': 'NOSOTROS<br>GANAMOS',
    'win.right.html': 'SOLO SI<br>TU CRECES',
    'win.col.l': 'Fee inicial para construir el sistema.',
    'win.col.r': 'Variable para hacerlo crecer.',
    'win.note': 'El fee inicial (sin IVA incluido)* cubre la construcción completa antes del lanzamiento. <br> Dos semanas desde el kickoff hasta campañas en vivo. <br><br> Después del lanzamiento, pasamos a un modelo variable. Un porcentaje del crecimiento que consigas. <br> Hablado contigo, no impuesto.',
    'win.manifesto.p1': 'La lógica es simple: si tú creces, nosotros cobramos. Si no creces, no cobramos. Mismo lado de la mesa.',
    'win.manifesto.p2': 'La mitad del sector cobra fijo y reza para que nadie le pida resultados. Nosotros hacemos lo contrario.',
    'work.num': '(04)',
    'work.kicker': 'El método',
    'work.title': 'THE WIN-WIN METHOD',
    'work.lede.html': '600€ <span class="alt">para construir el sistema.</span> Variable <span class="alt">para hacerlo crecer.</span>',
    'work.lede.disclaimer': 'Calma. No es un fijo mensual disfrazado. Es el punto de partida para pensar, ordenar y construir bien antes de mover un euro en serio.',
    'work.topbar.r': 'adsPartners® · win/win method',

    // Bloque 01 — STARTING POINT
    'work.b1.num': '01',
    'work.b1.title': 'EL PUNTO DE PARTIDA',
    'work.b1.figure': '600€',
    'work.b1.figure.label': 'Fee de estrategia',
    'work.b1.body': 'Solo para arrancar. Tranqui, tranqui… luego olvídate de costes fijos. Con esto montamos el sistema y nos ponemos en marcha juntos.\n\nCon esto nos da para la cerveza a la que te invitamos, sí.',
    'work.b1.tag.1': 'Funnel Strategy',
    'work.b1.tag.2': 'Acquisition Plan',
    'work.b1.tag.3': 'Landing / Web Direction',
    'work.b1.tag.4': 'Conversion Structure',
    'work.b1.tag.5': 'Tracking & Measurement',
    'work.b1.tag.6': 'Creative Angles',
    'work.b1.tag.7': 'Offer Architecture',
    'work.b1.note': 'Los 600€ no son por «empezar a hablar». Son por entrar a ordenar la máquina.',

    // Bloque 02 — VARIABLE GAME
    'work.b2.num': '02',
    'work.b2.title': 'EL JUEGO DEL VARIABLE',
    'work.b2.figure.k': 'VARIABLE',
    'work.b2.figure.v': 'ah?? %',
    'work.b2.figure.label': 'Se negocia, no se impone.',
    'work.b2.body': 'Negociamos porcentajes según tu caso. Lo importante es que los incentivos estén alineados y que la cosa vaya bien para los dos.\n\nQue aquí la gracia es currar juntos mucho tiempo.',
    'work.b2.factor.1': 'Margen',
    'work.b2.factor.2': 'Operación',
    'work.b2.factor.3': 'Ticket medio',
    'work.b2.factor.4': 'Inversión',
    'work.b2.factor.5': 'Capacidad de servir',
    'work.b2.factor.6': 'Tipo de proyecto',
    'work.b2.note': 'Si el negocio no puede sostener el crecimiento, no nos calentamos.',

    // Cierre
    'work.pull.line1': 'No ganamos antes que tú.',
    'work.pull.line2.html': 'Ese es el <em>punto</em>.',
    'work.foot.l': 'Alineación de intereses',
    'work.foot.c': 'Sin mensual disfrazado',
    'work.foot.r': 'Variable sobre resultados',

    // CLIENTS
    'cli.label': 'NUESTROS SOCIOS',
    'cli.eyebrow': 'No buscamos clientes. Buscamos socios.',
    'cli.num': '(05)',
    'cli.topbar': 'Casos de Estudio',
    'cli.topbar.hover': '↓',
    'cli.title.2.html': 'con <em>cualquiera.</em>',
    'cli.intro': 'Filtrar también es posicionar. Trabajamos con marcas que de verdad quieren construir algo. Estas son algunas de las que ahora mismo confían en el sistema.',
    'clients.default.p1': 'Toda marca ya está en movimiento. Equipos. Números. Problemas. Decisiones a medio tomar.',
    'clients.default.p2': 'El marketing como servicio mira el negocio desde fuera. Nosotros no. Entramos. Aprendemos el negocio. Vemos qué funciona, qué no y qué falta. Marca, creatividad y performance no son tres departamentos. Son una sola práctica. Tratarlos por separado es donde el crecimiento muere en silencio.',
    'clients.default.p3': 'Reforzamos el sistema. Mejoramos las decisiones. Hacemos el crecimiento replicable.',
    'clients.default.p4': 'Socios, no proveedores. Esa es toda la historia.',
    'cli.est': 'Est. 2025©',
    'cli.active': 'Activo',
    // INVERSALIA
    'cli.inversalia.name': 'Inversalia',
    'cli.inversalia.tags': 'Creación de Branding\nNarrativa de Branding\nDesarrollo Web\nIntegración con CRM\nEstructura SEO\nAutomatización de Copy con IA',
    'cli.inversalia.desc': 'Inversalia es una firma de inversión inmobiliaria enfocada en operaciones residenciales de alto valor, especialmente en Madrid. Su posicionamiento se basa en confianza, discreción y acompañamiento patrimonial, alejándose del enfoque inmobiliario tradicional centrado únicamente en enseñar y vender propiedades.\n\nDesde adsPartners trabajamos la identidad, la narrativa de marca, la estructura web, la integración con CRM y la automatización de publicación de inmuebles. También desarrollamos una arquitectura SEO y un sistema high-tech de generación asistida de textos para mejorar la presentación de cada propiedad.\n\nEl objetivo fue crear su presencia digital y convertirla en una herramienta real de marca, captación y gestión comercial. Una web elegante, sí, pero sobre todo ordenada, funcional y conectada con su operativa interna.',
    // SAPPHIRA
    'cli.sapphira.name': 'Sapphira Privé',
    'cli.sapphira.tags': 'Estrategia de Oferta\nEstrategia de Landing\nCreación de Funnel\nFunnel de Cualificación de Leads\nEstrategia de Meta Ads\nAutomatización de CRM\nModelado de Performance',
    'cli.sapphira.desc': 'Sapphira Privé es una clínica de medicina estética con tratamientos de ticket medio alto. Su reto era captar pacientes cualificados y evitar el típico problema de muchas campañas del sector: generar leads baratos, pero con poca intención real de compra.\n\nDesde adsPartners trabajamos la estrategia de oferta, la estructura de landing, el guion de VSL, la estrategia de Meta Ads y el sistema de cualificación conectado al CRM. También modelamos escenarios de rendimiento para entender qué CPL, tasa de cierre y ticket medio hacían viable la captación.\n\nEl objetivo fue construir un funnel más serio y filtrado. En una clínica así, el anuncio no puede limitarse a llamar la atención; tiene que preparar la decisión, cualificar al paciente y facilitar el cierre comercial.',
    // KLINK
    'cli.klink.name': 'Klink',
    'cli.klink.tags': 'Estrategia de Branding\nGuía de Branding\nArquitectura de Producto\nEstrategia de Lanzamiento\nEstrategia de Comunicación\nDirección Creativa',
    'cli.klink.desc': 'Klink es una aplicación europea de mensajería que combina privacidad, inteligencia artificial, traducción instantánea y funcionalidades sociales. Su reto era ordenar una propuesta tecnológica amplia y convertirla en una marca clara, atractiva y fácil de entender para usuarios, inversores y futuros partners.\n\nDesde adsPartners trabajamos la base estratégica de marca, la arquitectura de producto, la narrativa comercial y la estrategia de lanzamiento. Desarrollamos una guía de marca funcional para unificar su comunicación visual y verbal.\n\nEl objetivo fue convertir una idea compleja en un sistema de comunicación más accionable. No solo se trataba de explicar qué hace Klink, sino de construir una percepción de marca coherente, diferenciada y preparada para salir al mercado.',
    // AQVA
    'cli.aqva.name': 'AQVA Swimwear',
    'cli.aqva.tags': 'Estrategia de Funnel\nArquitectura de Oferta\nEstrategia de Paid Media\nTesteo Creativo\nSelección de Producto\nEstrategia de Cross-Sell',
    'cli.aqva.desc': 'AQVA Swimwear es una marca de baño premium con enfoque eco-friendly, construida alrededor de producto, estética y sostenibilidad. Su reto era transformar una propuesta visual potente en un sistema comercial capaz de generar ventas medibles.\n\nTrabajamos la estructura inicial del funnel, la selección de productos estratégicos, la lógica de oferta y la estrategia de paid media. También analizamos oportunidades de cross-sell para aumentar el valor medio de pedido desde la primera compra.\n\nEl objetivo fue ordenar qué vender, cómo presentarlo y cómo validar la demanda mediante campañas. No se trataba solo de lanzar anuncios, sino de construir una estructura donde creatividad, producto y números trabajasen en la misma dirección.',
    // INVERSTONE
    'cli.inverstone.name': 'Inverstone',
    'cli.inverstone.tags': 'Posicionamiento de Branding\nDirección Visual\nConcepto Web\nDesarrollo Web\nCopywriting Estratégico\nComunicación con Inversores',
    'cli.inverstone.desc': 'Inverstone es una firma vinculada a inversión inmobiliaria de oportunidad y operaciones patrimoniales, con un enfoque basado en privacidad, discreción y criterio financiero. Su comunicación necesitaba alejarse del lenguaje inmobiliario tradicional y construir una percepción más seria, sobria y confidencial.\n\nDesde adsPartners trabajamos el posicionamiento, la dirección visual, la narrativa de marca y la estructura conceptual y desarollo web. La prioridad fue trasladar confianza y solidez sin caer en una comunicación excesivamente comercial o explicativa.\n\nEl trabajo se centró en construir una presencia más precisa y elegante. Inverstone no necesitaba parecer más grande ni más ruidosa, sino transmitir control, criterio y privacidad desde el primer impacto.',



    // CHECKOUT MODAL
    'mod.kicker': 'Finalizar pedido',
    'mod.sub': 'Te escribimos en menos de 24h para cuadrar día y sitio.',
    'mod.f.drink': '¿Qué te apetece beber? <span class="mod-drink-hint">(beber eh, beber)</span>',
    'mod.f.drink.ph': 'Un mojito, un vermut, agua con gas…',
    'mod.f.name': 'Tu nombre',
    'mod.f.email': 'Email',
    'mod.f.phone': 'WhatsApp',
    'mod.f.city': 'Ciudad',
    'mod.f.city.ph': 'Madrid, Marbella…',
    'mod.f.when': '¿Cuándo?',
    'mod.f.w1': 'Esta semana',
    'mod.f.w2': 'La semana que viene',
    'mod.f.w3': 'Sin prisa',
    'mod.f.msg': 'Cuéntanos algo anda, así nos vamos conociendo <span class="mod-drink-hint">(ni opcional ni ostias, no me seas vago!)</span>',
    'mod.submit': 'Finalizar pedido →',
    'mod.ok.hand': '¡hecho!',
    'mod.ok.t': 'Te escribimos antes de 24h.',
    'mod.ok.d': 'Prepara sed — nosotros llevamos las ganas.',

    // FOOTER
    'foot.tag.k': 'La firma',
    'foot.tag.d': 'Un Growth Studio para marcas que no quieren ser una más.',
    'foot.nav': 'Navegación',
    'foot.contact': 'Contacto',
    'foot.social': 'Síguenos',
    'foot.col4.cta': '¿Nos tomamos algo? →',
    'foot.bot.left': '© 2026 adsPartners · Growth Studio',
    'foot.bot.center': 'MADRID · 2025 · AVAILABLE WORLDWIDE',

    // LOCALE
    '_locale': 'es-ES',
  },
  en: {
    // NAV
    'nav.tag.creative': 'Creative',
    'nav.tag.studio': 'Growth Studio',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copied ✓',
    'nav.based': 'Not for everyone',
    'nav.cart.default': 'Want to meet?',
    'nav.cart.hover': 'You\'re going to like us',
    'nav.lang.aria': 'Change language',

    // SIDE MENU
    'side.manifesto': 'ABOUT ADSPARTNERS',
    'side.cases': 'OUR PARTNERS',
    'side.team': 'FOUNDERS',
    'side.studio': 'WHAT WE DO',
    'side.work': 'HOW WE DO IT',
    'side.winwin': 'WIN — WIN',
    'side.faqs': 'FAQs',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Side navigation',

    // HERO
    'hero.meta.location': 'Madrid',
    'hero.meta.brand': 'adsPartners® / Est. 2025',
    'hero.meta.studio': 'BASED IN MADRID / AVAILABLE WORLDWIDE',
    'hero.title.line1': 'Not for',
    'hero.title.line2': 'everyone.',
    'hero.tagline.line1': 'Brand, creative and performance as one practice. Built for brands serious about growth.',
    'hero.tagline.part1': 'Brand, creative and performance as one practice.',
    'hero.tagline.part2': 'Built for brands serious about growth.',
    'hero.eyebrow': 'BASED IN MADRID / AVAILABLE WORLDWIDE.',
    'hero.tagline.systems': 'We don\'t sell campaigns. We sell systems.',
    'hero.tagline.line2': '',
    'hero.tagline.sub': 'Not for everyone',
    'hero.stamp.creative': '(creative)',
    'hero.stamp.growth': 'Growth',
    'hero.stamp.studioword': 'Studio',
    'hero.stamp.studio': 'Growth Studio',
    'hero.stamp.notforeveryone': 'Action. Discipline. System.',
    'hero.stamp.available': 'Available worldwide',
    'hero.scroll': 'Scroll',

    // MANIFIESTO
    'mani.label': 'ABOUT ADSPARTNERS',
    'mani.num': '(01)',
    'mani.text.html': 'adsPartners is a <em>Growth Studio</em> working with product brands so they stop depending on <span class="accent">improvisation</span> and start growing with a system. <em>We don\'t come in to do marketing.</em> We come in to fix the chaos and build something that makes sense long term.',
    'mani.p1': 'adsPartners is a Creative Growth Studio for ambitious brands. We come in to fix the chaos and build the system that takes brands from movement to growth.',
    'mani.p2': 'Acquisition, conversion and brand direction as one connected system. We don\'t just execute, and we never do isolated services. We fix what isn\'t working. We build the system that scales it.',
    'mani.aside.h': '(creative) Growth Studio',
    'mani.aside.p1': 'We work as partners, not vendors. That means we\'re not on the outside watching — we\'re on the inside thinking, proposing, and executing with you.',
    'mani.aside.p2': 'If the business grows, we grow. If not, what we\'re doing makes no sense.',
    'mani.aside.p3': 'Easy to deal with. Serious about the work.',
    'mani.poladroid.alt': 'Álvaro, Dani and Sebas',
    'mani.poladroid.cap': 'the partners · 2024',

    // SERVICES
    'srv.label': 'WHAT WE DO',
    'srv.eyebrow': 'We design and ship growth systems for ambitious brands.',
    'srv.rot.1.title': 'Growth is order.',
    'srv.rot.1.body': "Most brands don't fail at growth. They fail at managing what they already have. We come in to organize what's there before adding anything new.",
    'srv.rot.2.title': 'Brand is system.',
    'srv.rot.2.body': "A brand isn't how it looks. It's how every part of the business agrees with every other part. When the system holds, the brand walks on its own.",
    'srv.rot.3.title': 'Partnership over service.',
    'srv.rot.3.body': 'Agencies sell hours. Service providers sell deliverables. We sell a seat inside the business, not the meeting kind, the kind where decisions actually get made.',
    'srv.item.1': 'Market Research',
    'srv.item.2': 'Funnel Strategy',
    'srv.item.3': 'Web Design',
    'srv.item.4': 'Campaign Launch',
    'srv.item.5': 'Lead Acquisition',
    'srv.item.6': 'AI Automation',
    'srv.num': '(02)',
    'srv.title.line1': 'Two',
    'srv.title.line2.html': '<em>services.</em>',
    'srv.kicker': 'One builds growth. The other builds the brand that can hold it.',
    'srv.intro': 'We work across two fronts. One builds the engine behind growth. The other builds the brand people remember, trust and buy from.',

    // Growth Studio panel
    'srv.gs.code': 'GS',
    'srv.gs.name': 'Growth Studio',
    'srv.gs.line': 'Built to generate, convert and retain demand.',
    'srv.gs.tagline': 'Systems for acquisition, conversion and retention.',
    'srv.gs.1.name': 'Funnel Strategy',
    'srv.gs.1.desc': 'We design the full architecture of the system so acquisition, conversion and recurrence pull in the same direction.',
    'srv.gs.1.line': 'Order before scale.',
    'srv.gs.2.name': 'Client Acquisition',
    'srv.gs.2.desc': 'We generate demand through paid media, creative testing and acquisition systems built for results.',
    'srv.gs.2.line': 'Demand needs a system, not just ads.',
    'srv.gs.3.name': 'Conversion System',
    'srv.gs.3.desc': 'We optimise pages, offers and journeys to turn traffic into sales with more clarity and less friction.',
    'srv.gs.3.line': 'Traffic is useless if the page can\u2019t close.',
    'srv.gs.4.name': 'Retention & Loyalty',
    'srv.gs.4.desc': 'We build flows and mechanisms to grow recurrence, LTV and the long-term relationship with the customer.',
    'srv.gs.4.line': 'Growth gets expensive when customers don\u2019t come back.',

    // Brand Studio panel
    'srv.bs.code': 'BS',
    'srv.bs.name': 'Brand Studio',
    'srv.bs.line': 'Built to make the brand feel sharper, clearer and more ownable.',
    'srv.bs.tagline': 'Systems for clarity, positioning and digital presence.',
    'srv.bs.1.name': 'Brand Audit',
    'srv.bs.1.desc': 'We analyse the brand, the business and its context to surface inconsistencies, opportunities and areas to improve.',
    'srv.bs.1.line': 'Before changing the brand, understand the essence.',
    'srv.bs.2.name': 'Strategy & Positioning',
    'srv.bs.2.desc': 'We define where the brand wants to stand and how it should communicate to set itself apart.',
    'srv.bs.2.line': 'If you look like everyone else, you compete like everyone else.',
    'srv.bs.3.name': 'Visual Identity System',
    'srv.bs.3.desc': 'We build a coherent, recognisable visual system, ready to be applied consistently across every touchpoint.',
    'srv.bs.3.line': 'A brand should feel consistent before it feels pretty.',
    'srv.bs.4.name': 'Digital Brand Essentials',
    'srv.bs.4.desc': 'We develop the essential digital pieces so the brand looks and works the way it should online.',
    'srv.bs.4.line': 'Digital presence is part of the product.',

    // TEAM
    'team.topbar.l': '(03) — team · case file',
    'team.topbar.r': 'adsPartners · 03 founders · MMXXVI',
    'team.kicker': '· staff list · roll call',
    'team.kicker.right1': 'file no. AE / DD / SL',
    'team.kicker.right2': 'filed · 04·2026',
    'team.title.1.html': 'Founders',
    'team.title.2': '',
    'team.founders.sub': 'Three founders. Different from each other but complementary on every project. We believe effort, consistency and the pursuit of excellence are the keys to success. When you talk to us, you talk to the people on top of the work.',
    'team.lede': 'The founders, no unnecessary team, no off-putting facade, but ready to take on the world, ALWAYS!',
    'team.foot.archivo.k': 'archive',
    'team.foot.archivo.v': 'adsP · 03 · team · v3',
    'team.foot.cargo.k': 'role',
    'team.foot.cargo.v': 'Founders · no hierarchy',
    'team.foot.contacto.k': 'contact',
    'team.foot.seal.top': 'FOUNDERS\nADVISORY',
    'team.foot.seal.bot': 'EXPLICIT · NO JUNIOR · NO SENIOR',
    'team.expediente': 'case file',
    'team.archivado': 'filed · 04·2026',
    'team.adsp.founder': 'adsP · founder',
    'team.role.alvaro': 'Strategy & Sales',
    'team.role.daniel': 'Performance & Finance',
    'team.role.sebas': 'Brand & Creative',

    // bios — back of polaroid
    'team.bio.alvaro.1': 'As a kid he asked about everything: "and what is this for?".',
    'team.bio.alvaro.2': 'Today he\'s still the same, and he doesn\'t stop until the answer is clear or automated.',
    'team.bio.alvaro.3': 'He\'s the strategist behind every sale and the one making sure flows can be automated with Artificial Intelligence.',
    'team.bio.alvaro.4': "He's constantly researching and looking for solutions or improvements for any business that isn't reaching its full potential.",

    'team.bio.daniel.1': 'As a kid he already asked how much something cost before buying it. And then he wondered whether it was smart to spend that money.',
    'team.bio.daniel.2': 'Today, he doesn\'t spend anything that can\'t take him to a positive outcome.',
    'team.bio.daniel.3': 'He\'s the one who makes your campaigns optimized and profitable. He turns data into decisions. Decisions into results. And results into profitability.',
    'team.bio.daniel.4': '',

    'team.bio.sebas.1': 'As a kid he played at memorizing company logos. He always wanted to match the colors of his clothes. And he liked to draw attention.',
    'team.bio.sebas.2': 'Today, he seeks to draw people\'s attention by creating brands and putting them into action.',
    'team.bio.sebas.3': 'He\'s the one who makes sure brands communicate correctly what they want to represent through new technologies.',

    // WORK MODEL — THE WIN-WIN METHOD
    'work.label': 'HOW WE DO IT',
    'work.intro.title': 'PARTNERS WORKFLOW',
    'work.intro.sub': "We don't work for you. We work with you.",
    'work.wf.1.title': 'Discovery.',
    'work.wf.1.desc': "We learn the business before we touch the marketing. Sector, customer, ticket, margins, current sales process. We find what's selling, what isn't, and where growth is getting stuck.",
    'work.wf.2.title': 'Strategy.',
    'work.wf.2.desc': 'We define the architecture. Audience, acquisition angle, offer of entry, funnel, channels, budget, KPIs. The path from first impression to closed sale, planned before spending any money.',
    'work.wf.3.title': 'Funnel Setup.',
    'work.wf.3.desc': 'We build what the strategy needs to run. Landing page, forms, VSL script and edit, creative direction for ads, lead capture, measurement. The full system, tested before launch.',
    'work.wf.4.title': 'Campaign Launch.',
    'work.wf.4.desc': 'Campaigns go live. First signals in 2–3 weeks. Solid signal between 60 and 90 days. From there, we optimize.',
    'win.left.html': 'WE<br>WIN',
    'win.right.html': 'ONLY IF<br>YOU GROW',
    'win.col.l': 'Initial fee to build the system.',
    'win.col.r': 'Variable to grow it.',
    'win.note': 'The initial fee (VAT not included)* covers the full build before launch. <br> Two weeks from kickoff to live campaigns. <br><br> After launch, we move to a variable model. A percentage of the growth you achieve. <br>Talked through with you, not imposed.',
    'win.manifesto.p1': 'The logic is simple: if you grow, we get paid. If you don\'t, we don\'t. Same side of the table.',
    'win.manifesto.p2': 'Most agencies charge fixed and pray nobody asks for results. We do the opposite.',
    'work.num': '(04)',
    'work.kicker': 'The method',
    'work.title': 'THE WIN-WIN METHOD',
    'work.lede.html': '€600 <span class="alt">to build the system.</span> Variable <span class="alt">to grow it.</span>',
    'work.lede.disclaimer': 'Easy. Not a monthly retainer in disguise. It\'s the starting point to think, order and build properly before moving a serious euro.',
    'work.topbar.r': 'adsPartners® · win/win method',

    // Block 01 — STARTING POINT
    'work.b1.num': '01',
    'work.b1.title': 'THE STARTING POINT',
    'work.b1.figure': '€600',
    'work.b1.figure.label': 'Strategy fee',
    'work.b1.body': 'Just to get started. Easy, easy… then forget about fixed costs. With this we build the system and get moving together.\n\nThis covers the beer we\'re buying you, yes.',
    'work.b1.tag.1': 'Funnel Strategy',
    'work.b1.tag.2': 'Acquisition Plan',
    'work.b1.tag.3': 'Landing / Web Direction',
    'work.b1.tag.4': 'Conversion Structure',
    'work.b1.tag.5': 'Tracking & Measurement',
    'work.b1.tag.6': 'Creative Angles',
    'work.b1.tag.7': 'Offer Architecture',
    'work.b1.note': 'The €600 isn\'t for «starting the conversation». It\'s for stepping in to order the machine.',

    // Block 02 — VARIABLE GAME
    'work.b2.num': '02',
    'work.b2.title': 'THE VARIABLE GAME',
    'work.b2.figure.k': 'VARIABLE',
    'work.b2.figure.v': 'ah?? %',
    'work.b2.figure.label': 'Talked through, not imposed.',
    'work.b2.body': 'We agree percentages based on your case. What matters is that the incentives are aligned and the whole thing works for both of us.\n\nBecause here the point is to work together for a long time.',
    'work.b2.factor.1': 'Margin',
    'work.b2.factor.2': 'Operation',
    'work.b2.factor.3': 'Avg. ticket',
    'work.b2.factor.4': 'Spend',
    'work.b2.factor.5': 'Capacity to serve',
    'work.b2.factor.6': 'Type of project',
    'work.b2.note': 'If the business can\'t sustain growth, we don\'t fire it up.',

    // Closing pull
    'work.pull.line1': 'We don\'t win before you do.',
    'work.pull.line2.html': 'That\'s the whole <em>fucking</em> point.',
    'work.foot.l': 'Aligned interests',
    'work.foot.c': 'No retainer in disguise',
    'work.foot.r': 'Variable on results',

    // CLIENTS
    'cli.label': 'OUR PARTNERS',
    'cli.eyebrow': "We don't look for clients. We look for partners.",
    'cli.num': '(05)',
    'cli.topbar': 'Cases of Study',
    'cli.topbar.hover': '↓',
    'cli.title.2.html': 'with <em>just anyone.</em>',
    'cli.intro': 'Filtering is also positioning. We work with brands that genuinely want to build something. These are some of the ones currently trusting the system.',
    'clients.default.p1': 'Every brand is already in motion. Teams. Numbers. Problems. Decisions half-made.',
    'clients.default.p2': 'Marketing as a service watches the business from outside. We don\'t. We come inside. We learn the business. We see what\'s working, what isn\'t, and what\'s missing. Brand, creative and performance aren\'t three departments. They\'re one practice. Treating them apart is where growth quietly dies.',
    'clients.default.p3': 'We tighten the system. We sharpen the calls. We make growth repeatable.',
    'clients.default.p4': 'Partnership over service. That\'s the whole thing.',
    'cli.est': 'Est. 2025©',
    'cli.active': 'Active',
    // INVERSALIA
    'cli.inversalia.name': 'Inversalia',
    'cli.inversalia.tags': 'Brand Creation\nBrand Narrative\nWebsite Building\nCRM Integration\nSEO Structure\nAI Copy Automation',
    'cli.inversalia.desc': 'Inversalia is a real estate investment firm focused on high-value residential operations, especially in Madrid. Its positioning is based on trust, discretion and patrimonial guidance, moving away from the traditional real estate approach centered solely on showing and selling properties.\n\nAt adsPartners we worked on the identity, brand narrative, website structure, CRM integration and automated property publishing. We also developed an SEO architecture and a high-tech assisted copy generation system to improve the presentation of each property.\n\nThe goal was to create their digital presence and turn it into a real tool for branding, acquisition and commercial management. An elegant website, yes, but above all organized, functional and connected to their internal operations.',
    // SAPPHIRA
    'cli.sapphira.name': 'Sapphira Privé',
    'cli.sapphira.tags': 'Offer Strategy\nLanding Page Strategy\nFunnel Creation\nLead Qualification Funnel\nMeta Ads Strategy\nCRM Automation\nPerformance Modelling',
    'cli.sapphira.desc': 'Sapphira Privé is an aesthetic medicine clinic with high-ticket treatments. Its challenge was to attract qualified patients and avoid the typical problem of many campaigns in the sector: generating cheap leads with little real intent to buy.\n\nAt adsPartners we worked on the offer strategy, landing page structure, VSL script, Meta Ads strategy and the qualification system connected to the CRM. We also modelled performance scenarios to understand which CPL, close rate and average ticket made acquisition viable.\n\nThe goal was to build a more serious and filtered funnel. In a clinic like this, the ad cannot just grab attention; it has to prepare the decision, qualify the patient and ease the commercial close.',
    // KLINK
    'cli.klink.name': 'Klink',
    'cli.klink.tags': 'Brand Strategy\nBrand Guide\nProduct Architecture\nLaunch Strategy\nCommunication Strategy\nCreative Direction',
    'cli.klink.desc': 'Klink is a European messaging app combining privacy, artificial intelligence, instant translation and social features. Its challenge was to organize a broad technological proposal and turn it into a clear, attractive and easy-to-understand brand for users, investors and future partners.\n\nAt adsPartners we worked on the strategic brand foundation, product architecture, commercial narrative and launch strategy. We developed a functional brand guide to unify their visual and verbal communication.\n\nThe goal was to turn a complex idea into a more actionable communication system. It wasn\u2019t just about explaining what Klink does, but about building a coherent, differentiated brand perception ready to enter the market.',
    // AQVA
    'cli.aqva.name': 'AQVA Swimwear',
    'cli.aqva.tags': 'Funnel Strategy\nOffer Architecture\nPaid Media Strategy\nCreative Testing\nProduct Selection\nCross-Sell Strategy',
    'cli.aqva.desc': 'AQVA Swimwear is a premium swimwear brand with an eco-friendly approach, built around product, aesthetics and sustainability. Its challenge was to transform a strong visual proposal into a commercial system capable of generating measurable sales.\n\nWe worked on the initial funnel structure, the selection of strategic products, the offer logic and the paid media strategy. We also analyzed cross-sell opportunities to increase the average order value from the first purchase.\n\nThe goal was to define what to sell, how to present it and how to validate demand through campaigns. It wasn\u2019t just about launching ads, but about building a structure where creative, product and numbers worked in the same direction.',
    // INVERSTONE
    'cli.inverstone.name': 'Inverstone',
    'cli.inverstone.tags': 'Brand Positioning\nVisual Direction\nWebsite Concept\nWebsite Building\nStrategic Copywriting\nInvestor Communication',
    'cli.inverstone.desc': 'Inverstone is a firm linked to opportunistic real estate investment and patrimonial operations, with an approach based on privacy, discretion and financial judgment. Its communication needed to move away from traditional real estate language and build a more serious, sober and confidential perception.\n\nAt adsPartners we worked on the positioning, visual direction, brand narrative and conceptual structure and web development. The priority was to convey trust and solidity without falling into overly commercial or explanatory communication.\n\nThe work focused on building a more precise and elegant presence. Inverstone didn\u2019t need to look bigger or louder, but to convey control, judgment and privacy from the first impact.',



    // CHECKOUT MODAL
    'mod.kicker': 'Finalise order',
    'mod.sub': 'We\'ll be in touch within 24h to nail down day and place.',
    'mod.f.drink': 'What do you feel like drinking? <span class="mod-drink-hint">(drinking, drinking)</span>',
    'mod.f.drink.ph': 'A mojito, a vermouth, sparkling water…',
    'mod.f.name': 'Your name',
    'mod.f.email': 'Email',
    'mod.f.phone': 'WhatsApp',
    'mod.f.city': 'City',
    'mod.f.city.ph': 'Madrid, London, NYC…',
    'mod.f.when': 'When?',
    'mod.f.w1': 'This week',
    'mod.f.w2': 'Next week',
    'mod.f.w3': 'No rush',
    'mod.f.msg': 'Tell us something, so we get to know each other <span class="mod-drink-hint">(neither optional nor anything, don\'t be lazy!)</span>',
    'mod.submit': 'Finalise order →',
    'mod.ok.hand': 'done!',
    'mod.ok.t': 'We\'ll write within 24h.',
    'mod.ok.d': 'Bring the thirst — we\'ll bring the energy.',

    // FOOTER
    'foot.tag.k': 'The signature',
    'foot.tag.d': 'A Growth Studio for brands that don\'t want to be just another one.',
    'foot.nav': 'Navigation',
    'foot.contact': 'Contact',
    'foot.social': 'Follow',
    'foot.col4.cta': 'Want to grab a drink? →',
    'foot.bot.left': '© 2026 adsPartners · Growth Studio',
    'foot.bot.center': 'MADRID · 2025 · AVAILABLE WORLDWIDE',

    // LOCALE
    '_locale': 'en-GB',
  },
};

const I18nContext = createContext({ lang: 'es', t: (k) => k, setLang: () => {}, transitioning: false });

function I18nProvider({ children }) {
  const [lang, setLangState] = useStateI18n(() => {
    try { return localStorage.getItem('ads_lang') || 'es'; } catch (e) { return 'es'; }
  });
  const [transitioning, setTransitioning] = useStateI18n(false);

  useEffectI18n(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (next === lang) return;
    setTransitioning(true);
    const num = document.getElementById('langMarkNum');
    const word = document.getElementById('langMarkWord');
    if (num) num.textContent = next === 'en' ? '/ EN' : '/ ES';
    if (word) word.textContent = next === 'en' ? 'English.' : 'Español.';

    document.body.classList.add('lang-switching');
    setTimeout(() => {
      setLangState(next);
      try { localStorage.setItem('ads_lang', next); } catch (e) {}
      setTimeout(() => {
        document.body.classList.remove('lang-switching');
        document.body.classList.add('lang-switched-in');
        setTimeout(() => {
          document.body.classList.remove('lang-switched-in');
          setTransitioning(false);
        }, 850);
      }, 550);
    }, 700);
  }, [lang]);

  const t = useCallback((key, vars) => {
    const dict = DICT[lang] || DICT.es;
    let v = dict[key];
    if (v === undefined) v = (DICT.es[key] !== undefined ? DICT.es[key] : key);
    if (vars && typeof v === 'string') {
      Object.keys(vars).forEach((k) => { v = v.replace(new RegExp('{' + k + '}', 'g'), vars[k]); });
    }
    return v;
  }, [lang]);

  return React.createElement(I18nContext.Provider, { value: { lang, t, setLang, transitioning } }, children);
}

function useT() {
  return useContext(I18nContext);
}

// Helper for HTML strings (manifesto text, titles with <em>, etc)
function THtml({ k, as = 'span', className, style }) {
  const { t } = useT();
  const html = t(k);
  return React.createElement(as, { className, style, dangerouslySetInnerHTML: { __html: html } });
}

window.I18nProvider = I18nProvider;
window.I18nContext = I18nContext;
window.useT = useT;
window.THtml = THtml;
