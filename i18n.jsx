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

    // CHAT GLOBO (FRESA ventas)
    'chat.bubble': '¿Hablamos?',
    'chat.title': 'FRESA',
    'chat.subtitle': 'El asistente de adsPartners',
    'chat.intro': '¡Hola! Soy FRESA, el asistente de adsPartners. Cuéntame en qué anda tu negocio y te explico cómo trabajamos. Si encaja, agendamos una llamada.',
    'chat.placeholder': 'Escribe tu mensaje…',
    'chat.send': 'Enviar',
    'chat.cta': '¿Quedamos?',
    'chat.whatsapp': 'WhatsApp',
    'chat.error': 'Uy, ahora mismo no puedo responder. Prueba de nuevo en un momento o escríbenos por WhatsApp.',
    'chat.limit': 'Mejor seguimos en una llamada, que cunde más. Pulsa «¿Quedamos?» y lo vemos.',

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

    // CHAT GLOBO (FRESA sales)
    'chat.bubble': 'Let\'s talk?',
    'chat.title': 'FRESA',
    'chat.subtitle': 'adsPartners assistant',
    'chat.intro': 'Hi! I\'m FRESA, the adsPartners assistant. Tell me about your business and I\'ll explain how we work. If it\'s a fit, we\'ll set up a call.',
    'chat.placeholder': 'Type your message…',
    'chat.send': 'Send',
    'chat.cta': 'Want to meet?',
    'chat.whatsapp': 'WhatsApp',
    'chat.error': 'Sorry, I can\'t reply right now. Try again in a moment or reach us on WhatsApp.',
    'chat.limit': 'Let\'s carry on over a call — it works better. Hit "Want to meet?" and we\'ll take it from there.',

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
