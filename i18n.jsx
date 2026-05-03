/* global React */
// ============= I18N =============
const { useState: useStateI18n, useEffect: useEffectI18n, useContext, createContext, useCallback } = React;

const DICT = {
  es: {
    // NAV
    'nav.tag.creative': '(Creative)',
    'nav.tag.studio': 'Growth Studio',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copiado ✓',
    'nav.based': 'Madrid based / Av. Worldwide',
    'nav.cart.default': '¿Nos tomamos algo?',
    'nav.cart.hover': 'Te invitamos a la primera',
    'nav.lang.aria': 'Change language',

    // SIDE MENU
    'side.manifesto': 'Manifesto',
    'side.cases': 'Case of Studies',
    'side.team': 'The Team',
    'side.studio': 'Servicios',
    'side.work': 'Cómo trabajamos',
    'side.faqs': 'FAQs',
    'side.ecomm': '¿Una birra?',
    'side.aria': 'Navegación lateral',

    // HERO
    'hero.meta.location': 'Madrid',
    'hero.meta.brand': 'adsPartners® / Est. 2025',
    'hero.meta.studio': 'Growth / Brand Studio',
    'hero.title.line1': 'Not for',
    'hero.title.line2': 'everyone.',
    'hero.tagline.line1': 'Growth Studio para marcas de ecommerce donde dirección creativa, datos y ejecución funcionan como un solo sistema',
    'hero.tagline.part1': 'Growth Studio para marcas de ecommerce donde dirección creativa,',
    'hero.tagline.part2': 'datos y ejecución funcionan como un solo sistema',
    'hero.tagline.line2': '',
    'hero.stamp.creative': '(creative)',
    'hero.stamp.growth': 'Growth',
    'hero.stamp.studioword': 'Studio.',
    'hero.stamp.studio': 'Growth Studio',
    'hero.stamp.notforeveryone': 'No para todo el mundo.',
    'hero.stamp.available': 'Disponible en todo el mundo',
    'hero.scroll': 'Scroll',

    // MANIFIESTO
    'mani.label': 'Manifiesto',
    'mani.num': '(01)',
    'mani.text.html': 'adsPartners es un <em>Growth Studio</em> que trabaja con marcas de producto para que dejen de depender de la <span class="accent">improvisación</span> y empiecen a crecer con un sistema. <em>No entramos a hacer marketing.</em> Entramos a ordenar el caos y a construir algo que tenga sentido a largo plazo.',
    'mani.p1': 'adsPartners es un Growth Studio que trabaja con las marcas que de verdad están dispuestas a crecer para que dejen de depender de la improvisación y empiecen a crecer con un sistema. Entramos a ordenar el caos y a construir algo que tenga sentido a largo plazo.',
    'mani.p2': 'No entramos a hacer marketing. No solo ejecutamos, y nunca hacemos servicios aislados. Trabajamos captación, conversión y dirección de marca como un sistema conectado. Una forma de no solo llamar la atención, sino de crecer de verdad.',
    'mani.aside.h': '(creative) Growth Studio',
    'mani.aside.p1': 'Trabajamos como socios, no como proveedores. Eso significa que no estamos fuera mirando, estamos dentro pensando, proponiendo y ejecutando contigo.',
    'mani.aside.p2': 'Si el negocio crece, nosotros crecemos. Si no, no tiene sentido lo que estamos haciendo.',
    'mani.aside.p3': 'Cercanos en el trato. Serios en el trabajo.',
    'mani.poladroid.alt': 'Álvaro, Dani y Sebas',
    'mani.poladroid.cap': 'los socios · 2024',

    // SERVICES
    'srv.label': 'Servicios',
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
    'team.title.1.html': 'Los <em>personajes</em>',
    'team.title.2': 'detrás de todo esto',
    'team.lede': 'Los founder, sin equipo innecesario, sin fachada repelente, pero con ganas de comerse el p*uto mundo, ¡SIEMPRE!',
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
    'team.role.alvaro': 'Founder · Strategist',
    'team.role.daniel': 'Founder · Analista',
    'team.role.sebas': 'Founder · Director',
    'team.stat.coffees': 'cafés/día',
    'team.stat.sleep': 'horas sueño',
    'team.stat.ontime': 'Reuniones a tiempo',
    'team.stat.alvaro.note': 'Trabaja mejor con cerveza que con café',
    'team.stat.dani.financiacion': 'financiación a ads',
    'team.stat.dani.note': 'Las personas mienten, los números no. Por eso le hago caso a los números.',
    'team.stat.sebas.sleep': '2-10 (depende de la alergia)',
    'team.stat.sebas.pitis': 'pitis/branding',
    'team.stat.sebas.note': 'Poner 2 colores no es branding ni es nada. YO ASÍ NO TRABAJO!',

    // WORK MODEL — THE WIN-WIN METHOD
    'work.label': 'Cómo trabajamos',
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
    'work.pull.line2.html': 'Ese es el <em>puto</em> punto.',
    'work.foot.l': 'Alineación de intereses',
    'work.foot.c': 'Sin mensual disfrazado',
    'work.foot.r': 'Variable sobre resultados',

    // CLIENTS
    'cli.label': 'cases of study',
    'cli.num': '(05)',
    'cli.topbar': 'Casos de Estudio',
    'cli.topbar.hover': 'Ver todos',
    'cli.title.1': 'No trabajamos',
    'cli.title.2.html': 'con <em>cualquiera.</em>',
    'cli.intro': 'Filtrar también es posicionar. Trabajamos con marcas que de verdad quieren construir algo. Estas son algunas de las que ahora mismo confían en el sistema.',
    'clients.default.p1': 'Toda marca ya está en movimiento. Pedidos, campañas, contenido, decisiones, números, reuniones, problemas.',
    'clients.default.p2': 'Nuestro trabajo no es meter más mierda encima, es quitártela.',
    'clients.default.p3': 'Es entrar dentro, entender el negocio y detectar dónde se está bloqueando el crecimiento.',
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

    // FAQS
    'faqs.label': 'Lo que siempre nos preguntan',
    'faqs.num': '(07)',
    'faqs.title.1.html': 'Preguntas <em>frecuentes.</em>',
    'faqs.title.2.html': 'Respuestas <span class="accent">sin filtro.</span>',
    'faq.1.q': '¿600€ por hablar? ¿En serio?',
    'faq.1.a': 'No, 600€ por dejar de hablar. Por entrar, abrir el capó y ver dónde sangra el negocio. Si te parece caro, espera a ver lo que cuesta otro trimestre improvisando con la agencia que llama "estrategia" a un Google Doc de tres bullets. Bastante más que esos 600€, ¿no? Además, que con eso te invitamos a la birra hombre...',
    'faq.2.q': '¿Y eso del variable cómo funciona?',
    'faq.2.a': 'Cobramos un porcentaje sobre lo que generamos por encima de tu línea base. Tú creces, nosotros cobramos. Tú no creces, nosotros no facturamos y empezamos a sudar. Que es exactamente como queremos sudar: contigo, no contra ti. La mitad del sector cobra fijo y reza para que no le pidan resultados. Nosotros al revés.',
    'faq.3.q': '¿Trabajáis con cualquier marca?',
    'faq.3.a': 'No. Por eso pone "not for everyone" en el hero, no es decorado bonito. Si tu producto no se sostiene, tu margen no aguanta inversión o vienes buscando un milagro para tapar un agujero estructural, te decimos que no. Y te lo decimos ANTES de cobrarte. Sí, así, en mayúsculas. Cobrar primero y avisar después es de otros.',
    'faq.4.q': '¿En cuánto tiempo veré resultados?',
    'faq.4.a': 'Primeras señales en 2-3 semanas. Resultados sólidos entre 60 y 90 días. Si alguien te promete duplicar ventas en 7 días o "facturar 100k este mes con este simple truco", está vendiendo humo, está mintiendo, o las dos a la vez. Probablemente las dos. Y probablemente lleva un Lambo de renting.',
    'faq.5.q': '¿Por qué solo founders? ¿No tenéis equipo?',
    'faq.5.a': 'Tenemos a Álvaro, a Dani y a Sebas. Tres founders metidos hasta el cuello en cada cuenta. Sin junior recién llegado pilotando tu inversión mientras el "head of strategy" aparece sonriendo en la kickoff y desaparece hasta el QBR. Cuando hablas con nosotros, hablas con los que están haciendo el trabajo. Sin intermediarios, sin Slack ghosts.',
    'faq.6.q': '¿Qué diferencia hay entre Growth Studio y Brand Studio?',
    'faq.6.a': 'Growth Studio hace que la marca venda. Brand Studio (próximamente) hace que la marca MEREZCA venderse. Uno construye el sistema, el otro construye la razón por la que ese sistema tiene sentido. Sin uno, escalas un producto que nadie recuerda. Sin el otro, tienes una marca preciosa que no factura. Eligen uno, casi todos acaban en los dos.',
    'faq.7.q': '¿Y si ya tengo agencia?',
    'faq.7.a': 'Mira el dashboard. Si llevas 8 meses con "estamos optimizando" y los números planos, ya tienes la respuesta. Nosotros no entramos a hacer lo mismo en otro color ni a robarle el cliente a nadie: entramos a ordenar. Si tu agencia ejecuta bien y solo le falta dirección, lo decimos sin problema. Si te están vendiendo creatividad como excusa para no medir, también.',
    'faq.8.q': '¿Tenéis oficina? ¿Hay que ir hasta Madrid?',
    'faq.8.a': 'Estamos en Madrid pero curramos worldwide. La primera la preferimos tomando algo: cerveza, café, vermut, lo que pidas. Pero si tiene que ser en remoto no te preocupes, nos abrimos una birra mientras nos conectamos al Teams y listo. Después, todo en remoto con sesiones presenciales cuando convenga. Oficina con plantitas y mesa de ping pong para hacernos la foto, sobra. El trabajo se hace, no se decora.',
    'faq.9.q': '¿Y si después de los 90 días no funciona?',
    'faq.9.a': 'Lo hablamos antes de los 90 días, no al final. A las 3 semanas ya hay datos suficientes para saber si esto va o no va. Si va, escalamos. Si no, ajustamos. Y si está roto de raíz, te lo decimos a la cara y paramos. Ir a éxito mientras el barco se hunde no tiene mucho sentido. Eso de sajarte a cobros mensuales mientras las campañas que te montan no valen para una mierda es más de los que cobran fees fijos.',
    'faq.10.q': 'Vale, ¿por dónde empezamos?',
    'faq.10.a': 'Por una birra. En serio. Sin PowerPoint, sin pitch deck, sin sermón motivacional con "journey", "ecosistema" y "storytelling 360". Nos cuentas dónde estás y te decimos si podemos ayudarte. Si encajamos, al lío. Si no, te vas con una cerveza gratis y un par de ideas que no tenías al entrar. Mal trato no es.',

    // CONTACT (SHOP)
    'shop.k': '¿Nos conocemos? coño, claro!',
    'shop.cart': 'Carrito',
    'shop.add': 'Añadir al carrito',
    'shop.t1': 'Antes de trabajar juntos,',
    'shop.t2': 'tomémonos algo.',
    'shop.sub': 'Elige lo que te apetece y te vemos allí. Sin PowerPoints, sin chapa, sin venderte la moto.',
    'shop.note': 'No es un e-commerce de verdad. El encuentro sí.',
    'shop.p1.n': 'Una birra fría',
    'shop.p1.d': 'Como la que pediríamos nosotros. Para ir entrando en materia sin postureo.',
    'shop.p1.m1': '30 min',
    'shop.p1.m2': 'casual',
    'shop.p1.m3': 'en persona',
    'shop.p1.sku': 'birra-001',
    'shop.p1.title': 'Una birra fría 🍺',
    'shop.p2.n': 'Un café',
    'shop.p2.d': 'Directo, 20 minutos, donde tú digas. Al grano, sin rodeos.',
    'shop.p2.m1': '20 min',
    'shop.p2.m2': 'directo',
    'shop.p2.m3': 'presencial / call',
    'shop.p2.sku': 'cafe-002',
    'shop.p2.title': 'Un café ☕',
    'shop.p3.n': 'Tú eliges',
    'shop.p3.d': '¿Tienes una bebida favorita? Dinos cuál y la pedimos. Tú eliges sitio, tú eliges trago.',
    'shop.p3.m1': 'a tu ritmo',
    'shop.p3.m2': 'a tu gusto',
    'shop.p3.m3': 'en persona',
    'shop.p3.sku': 'tu-eliges-003',
    'shop.p3.title': 'Tú eliges 🥂',

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
    'foot.bot.center': 'MADRID · 2025 · PUES DONDE ESTÁS VAYA...',

    // LOCALE
    '_locale': 'es-ES',
  },
  en: {
    // NAV
    'nav.tag.creative': '(Creative)',
    'nav.tag.studio': 'Growth Studio',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copied ✓',
    'nav.based': 'Madrid based / Av. Worldwide',
    'nav.cart.default': 'Want to grab a drink?',
    'nav.cart.hover': 'First round\'s on us',
    'nav.lang.aria': 'Change language',

    // SIDE MENU
    'side.manifesto': 'Manifesto',
    'side.cases': 'Case Studies',
    'side.team': 'The Team',
    'side.studio': 'Services',
    'side.work': 'How we work',
    'side.faqs': 'FAQs',
    'side.ecomm': 'Wanna beer?',
    'side.aria': 'Side navigation',

    // HERO
    'hero.meta.location': 'Madrid',
    'hero.meta.brand': 'adsPartners® / Est. 2025',
    'hero.meta.studio': 'Growth / Brand Studio',
    'hero.title.line1': 'Not for',
    'hero.title.line2': 'everyone.',
    'hero.tagline.line1': 'Growth Studio for ecomm brands where creative direction, data and execution move as one system',
    'hero.tagline.part1': 'Growth Studio for ecomm brands where creative direction,',
    'hero.tagline.part2': 'data and execution move as one system',
    'hero.tagline.line2': '',
    'hero.stamp.creative': '(creative)',
    'hero.stamp.growth': 'Growth',
    'hero.stamp.studioword': 'Studio.',
    'hero.stamp.studio': 'Growth Studio',
    'hero.stamp.notforeveryone': 'Not for everyone.',
    'hero.stamp.available': 'Available worldwide',
    'hero.scroll': 'Scroll',

    // MANIFIESTO
    'mani.label': 'Manifesto',
    'mani.num': '(01)',
    'mani.text.html': 'adsPartners is a <em>Growth Studio</em> working with product brands so they stop depending on <span class="accent">improvisation</span> and start growing with a system. <em>We don\'t come in to do marketing.</em> We come in to fix the chaos and build something that makes sense long term.',
    'mani.p1': 'adsPartners is a Growth Studio working with brands that are genuinely ready to grow, so they stop depending on improvisation and start growing with a system. We come in to fix the chaos and build something that makes sense long term.',
    'mani.p2': 'We don\'t come in to do marketing. We don\'t just execute, and we never do isolated services. We work acquisition, conversion and brand direction as one connected system. A way to not only get attention, but to actually grow.',
    'mani.aside.h': '(creative) Growth Studio',
    'mani.aside.p1': 'We work as partners, not vendors. That means we\'re not on the outside watching — we\'re on the inside thinking, proposing, and executing with you.',
    'mani.aside.p2': 'If the business grows, we grow. If not, what we\'re doing makes no sense.',
    'mani.aside.p3': 'Easy to deal with. Serious about the work.',
    'mani.poladroid.alt': 'Álvaro, Dani and Sebas',
    'mani.poladroid.cap': 'the partners · 2024',

    // SERVICES
    'srv.label': 'Services',
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
    'team.title.1.html': 'The <em>characters</em>',
    'team.title.2': 'behind this all',
    'team.lede': 'The founders, no unnecessary team, no off-putting facade, but ready to take on the f*cking world, ALWAYS!',
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
    'team.role.alvaro': 'Founder · Strategist',
    'team.role.daniel': 'Founder · Analyst',
    'team.role.sebas': 'Founder · Director',
    'team.stat.coffees': 'coffees/day',
    'team.stat.sleep': 'hours of sleep',
    'team.stat.ontime': 'Meetings on time',
    'team.stat.alvaro.note': 'Works better with beer than with coffee',
    'team.stat.dani.financiacion': 'ads funding',
    'team.stat.dani.note': 'People lie, numbers don\'t. So I listen to the numbers.',
    'team.stat.sebas.sleep': '2-10 (depends on the allergies)',
    'team.stat.sebas.pitis': 'cigs/branding',
    'team.stat.sebas.note': 'Slapping 2 colors on it isn\'t branding. I DO NOT WORK LIKE THIS!',

    // WORK MODEL — THE WIN-WIN METHOD
    'work.label': 'How we work',
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
    'cli.label': 'cases of study',
    'cli.num': '(05)',
    'cli.topbar': 'Cases of Study',
    'cli.topbar.hover': 'View all',
    'cli.title.1': 'We don\'t work',
    'cli.title.2.html': 'with <em>just anyone.</em>',
    'cli.intro': 'Filtering is also positioning. We work with brands that genuinely want to build something. These are some of the ones currently trusting the system.',
    'clients.default.p1': 'Every brand is already in motion. Orders, campaigns, content, decisions, numbers, meetings, problems.',
    'clients.default.p2': 'Our job isn\'t to pile more shit on top, it\'s to take it off you.',
    'clients.default.p3': 'It\'s to step inside, understand the business and find where growth is getting stuck.',
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

    // FAQS
    'faqs.label': 'What we always get asked',
    'faqs.num': '(07)',
    'faqs.title.1.html': 'Frequent <em>questions.</em>',
    'faqs.title.2.html': 'Unfiltered <span class="accent">answers.</span>',
    'faq.1.q': 'A €600 fee just to talk? Seriously?',
    'faq.1.a': 'No, €600 to stop talking. To get under the hood and see where the business is bleeding. If that feels expensive, wait until you see what one more quarter of improvising costs you with the agency that calls "strategy" a Google Doc with three bullets. Quite a bit more than those €600, right? Besides, with that we\'re getting you a beer, come on...',
    'faq.2.q': 'How does the variable thing work?',
    'faq.2.a': 'We charge a percentage on what we generate above your baseline. You grow, we get paid. You don\'t grow, we don\'t bill and we start sweating. Which is exactly how we want to sweat: with you, not against you. Half the industry charges fixed and prays nobody asks for results. We do the opposite.',
    'faq.3.q': 'Do you work with any brand?',
    'faq.3.a': 'No. That\'s why "not for everyone" is in the hero — not pretty decoration. If your product doesn\'t hold up, your margin can\'t carry investment, or you want a miracle to patch a structural hole, we say no. And we say it BEFORE charging you. Yes, in caps. Charging first and warning later is somebody else\'s game.',
    'faq.4.q': 'How long until I see results?',
    'faq.4.a': 'First signals in 2-3 weeks. Solid results between 60 and 90 days. If anyone promises double sales in 7 days or "100k this month with this one simple trick", they\'re selling smoke, lying, or both. Probably both. And probably driving a leased Lambo.',
    'faq.5.q': 'Why only founders? You don\'t have a team?',
    'faq.5.a': 'We\'ve got Álvaro, Dani and Sebas. Three founders elbow-deep in every account. No fresh junior piloting your spend while the "head of strategy" smiles at the kickoff and vanishes until the QBR. When you talk to us, you\'re talking to the people doing the work. No middlemen, no Slack ghosts.',
    'faq.6.q': 'What\'s the difference between Growth Studio and Brand Studio?',
    'faq.6.a': 'Growth Studio makes the brand sell. Brand Studio (coming soon) makes the brand WORTH selling. One builds the system, the other builds the reason that system makes sense. Without one, you scale a product nobody remembers. Without the other, you have a beautiful brand that doesn\'t bill. Most pick one and end up with both.',
    'faq.7.q': 'What if I already have an agency?',
    'faq.7.a': 'Look at the dashboard. If you\'ve been hearing "we\'re optimising" for 8 months and the numbers are flat, you have your answer. We\'re not here to do the same in a different colour or to steal anyone\'s client: we come in to put things in order. If your current agency executes well and just lacks direction, we\'ll say so. If they\'re selling creative as an excuse not to measure, we\'ll say that too.',
    'faq.8.q': 'Do you have an office? Do I need to fly to Madrid?',
    'faq.8.a': 'We\'re in Madrid but we work worldwide. The first one we\'d rather have over a drink: beer, coffee, vermouth, whatever you order. But if it has to be remote, no stress — we crack a beer open while we hop on Teams and done. After that, everything remote with in-person sessions when it\'s useful. Office with plants and a ping-pong table for the photo, no thanks. Work gets done, not decorated.',
    'faq.9.q': 'And if it\'s not working after 90 days?',
    'faq.9.a': 'We talk before 90 days, not at the end. By week 3 there\'s enough data to know if this flies or not. If it does, we scale. If not, we adjust. And if it\'s broken at the root, we tell you to your face and we stop. Going for success while the boat sinks doesn\'t make much sense. Bleeding you with monthly fees while the campaigns they run for you aren\'t worth shit, that\'s more of a fixed-fee agency thing.',
    'faq.10.q': 'Alright, where do we start?',
    'faq.10.a': 'With a beer. Seriously. No PowerPoint, no pitch deck, no motivational sermon with "journey", "ecosystem" and "360 storytelling". You tell us where you are, we tell you if we can help. If we click, we get going. If not, you walk out with a free beer and a couple of ideas you didn\'t have. Not a bad deal.',

    // CONTACT (SHOP)
    'shop.k': 'Wanna meet? hell yeah!',
    'shop.cart': 'Cart',
    'shop.add': 'Add to cart',
    'shop.t1': 'Before working together,',
    'shop.t2': 'let\'s grab a drink.',
    'shop.sub': 'Pick what you feel like and we\'ll see you there. No PowerPoints, no pitch deck, no BS.',
    'shop.note': 'Not a real e-commerce. The hangout is.',
    'shop.p1.n': 'A cold beer',
    'shop.p1.d': 'The kind we\'d order ourselves. To get into it without pretense.',
    'shop.p1.m1': '30 min',
    'shop.p1.m2': 'casual',
    'shop.p1.m3': 'in person',
    'shop.p1.sku': 'beer-001',
    'shop.p1.title': 'A cold beer 🍺',
    'shop.p2.n': 'A coffee',
    'shop.p2.d': 'Direct, 20 minutes, wherever you say. Straight to the point, no fluff.',
    'shop.p2.m1': '20 min',
    'shop.p2.m2': 'direct',
    'shop.p2.m3': 'in person / call',
    'shop.p2.sku': 'coffee-002',
    'shop.p2.title': 'A coffee ☕',
    'shop.p3.n': 'You pick',
    'shop.p3.d': 'Got a favourite drink? Tell us and we\'ll order it. You pick the spot, you pick the drink.',
    'shop.p3.m1': 'your pace',
    'shop.p3.m2': 'your taste',
    'shop.p3.m3': 'in person',
    'shop.p3.sku': 'you-pick-003',
    'shop.p3.title': 'You pick 🥂',

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
    'foot.bot.center': 'MADRID · 2025 · WHEREVER YOU ARE...',

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
