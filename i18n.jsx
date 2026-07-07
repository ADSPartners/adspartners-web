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

    // SIDE MENU
    'side.manifesto': 'SOBRE ADSPARTNERS',
    'side.cases': 'NUESTROS SOCIOS',
    'side.team': 'FOUNDERS',
    'side.studio': 'LO QUE HACEMOS',
    'side.work': 'CÓMO LO HACEMOS',
    'side.winwin': 'WIN — WIN',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Navegación lateral',

    // HERO
    'hero.tagline.part1': 'Marca, creatividad y performance como una sola práctica.',
    'hero.tagline.part2': 'Diseñado para negocios que se toman el crecimiento en serio.',
    'hero.tagline.systems': 'No venimos a vender campañas sueltas. Vendemos un sistema.',
    'hero.tagline.sub': 'Not for everyone',
    'hero.stamp.notforeveryone': 'Acción. Disciplina. Sistema.',

    // MANIFIESTO
    'mani.p1': 'adsPartners es un Creative Growth Studio para negocios ambiciosos. Entramos a ordenar el caos y construir el sistema que lleve a las marcas del movimiento al crecimiento.',
    'mani.p2': 'Captación, conversión y dirección de marca como un sistema conectado. No solo ejecutamos, y nunca hacemos servicios aislados. Arreglamos lo que no funciona. Construimos el sistema que lo escala.',

    // SERVICES
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

    // TEAM
    'team.title.1.html': 'Founders',
    'team.founders.sub': 'Tres fundadores. Diferentes entre nosotros pero complementarios en cada proyecto. Creemos en que el esfuerzo, la constancia y búsqueda de la excelencia son las claves del éxito. Cuando hablas con nosotros, hablas con la gente que está encima del trabajo.',
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

    'team.bio.sebas.1': 'Cuando era pequeño jugaba a aprenderse los logos de las empresas. Siempre quería combinar los colores de su ropa. Y le gustaba llamar la atención.',
    'team.bio.sebas.2': 'Hoy en día, buscar llamar la atención de las personas creando marcas y poniéndolas en acción.',
    'team.bio.sebas.3': 'Es el encargado de que las marcas comuniquen correctamente lo que quieren representar a través de las nuevas tecnologías.',

    // WORK MODEL — THE WIN-WIN METHOD
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

    // CLIENTS
    'cli.eyebrow': 'No buscamos clientes. Buscamos socios.',
    'clients.default.p1': 'Toda marca ya está en movimiento. Equipos. Números. Problemas. Decisiones a medio tomar.',
    'clients.default.p2': 'El marketing como servicio mira el negocio desde fuera. Nosotros no. Entramos. Aprendemos el negocio. Vemos qué funciona, qué no y qué falta. Marca, creatividad y performance no son tres departamentos. Son una sola práctica. Tratarlos por separado es donde el crecimiento muere en silencio.',
    'clients.default.p3': 'Reforzamos el sistema. Mejoramos las decisiones. Hacemos el crecimiento replicable.',
    'clients.default.p4': 'Socios, no proveedores. Esa es toda la historia.',
    // INVERSALIA
    'cli.inversalia.name': 'Inversalia',
    'cli.inversalia.tags': 'Creación de Branding\nNarrativa de Branding\nDesarrollo Web\nIntegración con CRM\nEstructura SEO\nAutomatización de Copy con IA',
    'cli.inversalia.desc': 'Inversalia es una firma de inversión inmobiliaria enfocada en operaciones residenciales de alto valor, especialmente en Madrid. Su posicionamiento se basa en confianza, discreción y acompañamiento patrimonial, alejándose del enfoque inmobiliario tradicional centrado únicamente en enseñar y vender propiedades.\n\nDesde adsPartners trabajamos la identidad, la narrativa de marca, la estructura web, la integración con CRM y la automatización de publicación de inmuebles. También desarrollamos una arquitectura SEO y un sistema high-tech de generación asistida de textos para mejorar la presentación de cada propiedad.\n\nEl objetivo fue crear su presencia digital y convertirla en una herramienta real de marca, captación y gestión comercial. Una web elegante, sí, pero sobre todo ordenada, funcional y conectada con su operativa interna.',
    // SAPPHIRA
    'cli.sapphira.name': 'Sapphira Privé',
    'cli.sapphira.tags': 'Estrategia de Oferta\nEstrategia de Landing\nCreación de Funnel\nFunnel de Cualificación de Leads\nEstrategia de Meta Ads\nAutomatización de CRM\nModelado de Performance',
    'cli.sapphira.desc': 'Sapphira Privé es una clínica de medicina estética con tratamientos de ticket medio alto. Su reto era captar pacientes cualificados y evitar el típico problema de muchas campañas del sector: generar leads baratos, pero con poca intención real de compra.\n\nDesde adsPartners trabajamos la estrategia de oferta, la estructura de landing, el guion de VSL, la estrategia de Meta Ads y el sistema de cualificación conectado al CRM. También modelamos escenarios de rendimiento para entender qué CPL, tasa de cierre y ticket medio hacían viable la captación.\n\nEl objetivo fue construir un funnel más serio y filtrado. En una clínica así, el anuncio no puede limitarse a llamar la atención; tiene que preparar la decisión, cualificar al paciente y facilitar el cierre comercial.',
    // AQVA
    'cli.aqva.name': 'AQVA Swimwear',
    'cli.aqva.tags': 'Estrategia de Funnel\nArquitectura de Oferta\nEstrategia de Paid Media\nTesteo Creativo\nSelección de Producto\nEstrategia de Cross-Sell',
    'cli.aqva.desc': 'AQVA Swimwear es una marca de baño premium con enfoque eco-friendly, construida alrededor de producto, estética y sostenibilidad. Su reto era transformar una propuesta visual potente en un sistema comercial capaz de generar ventas medibles.\n\nTrabajamos la estructura inicial del funnel, la selección de productos estratégicos, la lógica de oferta y la estrategia de paid media. También analizamos oportunidades de cross-sell para aumentar el valor medio de pedido desde la primera compra.\n\nEl objetivo fue ordenar qué vender, cómo presentarlo y cómo validar la demanda mediante campañas. No se trataba solo de lanzar anuncios, sino de construir una estructura donde creatividad, producto y números trabajasen en la misma dirección.',

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

    // SIDE MENU
    'side.manifesto': 'ABOUT ADSPARTNERS',
    'side.cases': 'OUR PARTNERS',
    'side.team': 'FOUNDERS',
    'side.studio': 'WHAT WE DO',
    'side.work': 'HOW WE DO IT',
    'side.winwin': 'WIN — WIN',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Side navigation',

    // HERO
    'hero.tagline.part1': 'Brand, creative and performance as one practice.',
    'hero.tagline.part2': 'Built for brands serious about growth.',
    'hero.tagline.systems': 'We don\'t sell campaigns. We sell systems.',
    'hero.tagline.sub': 'Not for everyone',
    'hero.stamp.notforeveryone': 'Action. Discipline. System.',

    // MANIFIESTO
    'mani.p1': 'adsPartners is a Creative Growth Studio for ambitious brands. We come in to fix the chaos and build the system that takes brands from movement to growth.',
    'mani.p2': 'Acquisition, conversion and brand direction as one connected system. We don\'t just execute, and we never do isolated services. We fix what isn\'t working. We build the system that scales it.',

    // SERVICES
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

    // TEAM
    'team.title.1.html': 'Founders',
    'team.founders.sub': 'Three founders. Different from each other but complementary on every project. We believe effort, consistency and the pursuit of excellence are the keys to success. When you talk to us, you talk to the people on top of the work.',
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

    'team.bio.sebas.1': 'As a kid he played at memorizing company logos. He always wanted to match the colors of his clothes. And he liked to draw attention.',
    'team.bio.sebas.2': 'Today, he seeks to draw people\'s attention by creating brands and putting them into action.',
    'team.bio.sebas.3': 'He\'s the one who makes sure brands communicate correctly what they want to represent through new technologies.',

    // WORK MODEL — THE WIN-WIN METHOD
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

    // CLIENTS
    'cli.eyebrow': "We don't look for clients. We look for partners.",
    'clients.default.p1': 'Every brand is already in motion. Teams. Numbers. Problems. Decisions half-made.',
    'clients.default.p2': 'Marketing as a service watches the business from outside. We don\'t. We come inside. We learn the business. We see what\'s working, what isn\'t, and what\'s missing. Brand, creative and performance aren\'t three departments. They\'re one practice. Treating them apart is where growth quietly dies.',
    'clients.default.p3': 'We tighten the system. We sharpen the calls. We make growth repeatable.',
    'clients.default.p4': 'Partnership over service. That\'s the whole thing.',
    // INVERSALIA
    'cli.inversalia.name': 'Inversalia',
    'cli.inversalia.tags': 'Brand Creation\nBrand Narrative\nWebsite Building\nCRM Integration\nSEO Structure\nAI Copy Automation',
    'cli.inversalia.desc': 'Inversalia is a real estate investment firm focused on high-value residential operations, especially in Madrid. Its positioning is based on trust, discretion and patrimonial guidance, moving away from the traditional real estate approach centered solely on showing and selling properties.\n\nAt adsPartners we worked on the identity, brand narrative, website structure, CRM integration and automated property publishing. We also developed an SEO architecture and a high-tech assisted copy generation system to improve the presentation of each property.\n\nThe goal was to create their digital presence and turn it into a real tool for branding, acquisition and commercial management. An elegant website, yes, but above all organized, functional and connected to their internal operations.',
    // SAPPHIRA
    'cli.sapphira.name': 'Sapphira Privé',
    'cli.sapphira.tags': 'Offer Strategy\nLanding Page Strategy\nFunnel Creation\nLead Qualification Funnel\nMeta Ads Strategy\nCRM Automation\nPerformance Modelling',
    'cli.sapphira.desc': 'Sapphira Privé is an aesthetic medicine clinic with high-ticket treatments. Its challenge was to attract qualified patients and avoid the typical problem of many campaigns in the sector: generating cheap leads with little real intent to buy.\n\nAt adsPartners we worked on the offer strategy, landing page structure, VSL script, Meta Ads strategy and the qualification system connected to the CRM. We also modelled performance scenarios to understand which CPL, close rate and average ticket made acquisition viable.\n\nThe goal was to build a more serious and filtered funnel. In a clinic like this, the ad cannot just grab attention; it has to prepare the decision, qualify the patient and ease the commercial close.',
    // AQVA
    'cli.aqva.name': 'AQVA Swimwear',
    'cli.aqva.tags': 'Funnel Strategy\nOffer Architecture\nPaid Media Strategy\nCreative Testing\nProduct Selection\nCross-Sell Strategy',
    'cli.aqva.desc': 'AQVA Swimwear is a premium swimwear brand with an eco-friendly approach, built around product, aesthetics and sustainability. Its challenge was to transform a strong visual proposal into a commercial system capable of generating measurable sales.\n\nWe worked on the initial funnel structure, the selection of strategic products, the offer logic and the paid media strategy. We also analyzed cross-sell opportunities to increase the average order value from the first purchase.\n\nThe goal was to define what to sell, how to present it and how to validate demand through campaigns. It wasn\u2019t just about launching ads, but about building a structure where creative, product and numbers worked in the same direction.',

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

window.I18nProvider = I18nProvider;
window.I18nContext = I18nContext;
window.useT = useT;
