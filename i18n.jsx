/* global React */
// ============= I18N =============
const { useState: useStateI18n, useEffect: useEffectI18n, useContext, createContext, useCallback } = React;

const DICT = {
  es: {
    // NAV
    'nav.tag.1': 'Finance · Tech',
    'nav.tag.2': 'Brand',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copiado ✓',
    'nav.based': 'Not for everyone',
    'nav.cart.default': '¿Quedamos?',
    'nav.cart.hover': 'Te vamos a caer bien',

    // SIDE MENU
    'side.partida': 'PUNTO DE PARTIDA',
    'side.ramas': 'LAS TRES RAMAS',
    'side.diagnostico': 'EL DIAGNÓSTICO',
    'side.recorrido': 'EL RECORRIDO',
    'side.cerca': 'CÓMO TRABAJAMOS',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Navegación lateral',

    // HERO
    'hero.etq': 'Para la empresa que ha crecido',
    'hero.titulo': 'Recuperar el control.',
    'hero.sub': 'Finanzas, tecnología y marca de vuestra empresa, ordenadas.',
    'hero.pie.izq': 'Primero control. Después crecimiento.',
    'hero.pie.der': 'Finance · Tech · Brand',

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

    // PROYECTOS
    'side.proyectos': 'TRABAJO REAL',
    'proy.lead': 'Software, automatizaciones, marcas y webs.',
    'proy.body': 'Trabajo ya hecho, con sus cifras. Pinchad en un caso para verlo entero.',
    'proy.ver': 'Ver caso',
    'proy.dato.3d': 'Escena propia',
    'proy.dato.pantallas': 'Pantallas',
    'proy.dato.anio': 'Año',
    'proy.identidad': 'Identidad de marca',
    'proy.cta': '¿El siguiente es el vuestro?',
    'proy.cta.btn': 'HAZ CLICK AQUÍ',
    'caso.marca': 'Marca.',
    'caso.sector': 'Sector.',
    'caso.hicimos': 'Qué hicimos.',
    'caso.anio': 'Año.',
    'caso.partida': 'Punto de partida.',
    'caso.cifras': 'En cifras.',
    'caso.quehace': 'Qué hace.',
    'caso.proyecto': 'Proyecto.',
    'caso.pantallas': 'Pantalla a pantalla.',
    'caso.pantallas.sub': 'Lo que pasa mientras bajas.',
    'caso.movil': 'En el móvil, otra coreografía.',
    'caso.web': 'Ábrela en el móvil.',
    'caso.web.varias': 'Ábrelas en el móvil.',
    'caso.web.sub': 'Es donde la ven sus clientes.',
    'caso.siguiente': 'Siguiente proyecto',
    'side.caso.top': 'EL PROYECTO',
    'side.caso.idea': 'LA IDEA',
    'side.caso.pantallas': 'PANTALLA A PANTALLA',
    'side.caso.cifras': 'EN CIFRAS',
    'side.caso.quehace': 'QUÉ HACE',
    'side.caso.movil': 'EN EL MÓVIL',
    'side.caso.siguiente': 'SIGUIENTE',

    // LOCALE
    '_locale': 'es-ES',
  },
  en: {
    // NAV
    'nav.tag.1': 'Finance · Tech',
    'nav.tag.2': 'Brand',
    'nav.mail.copy': 'Click to copy',
    'nav.mail.copied': 'Copied ✓',
    'nav.based': 'Not for everyone',
    'nav.cart.default': 'Want to meet?',
    'nav.cart.hover': 'You\'re going to like us',

    // SIDE MENU
    'side.partida': 'STARTING POINT',
    'side.ramas': 'THE THREE BRANCHES',
    'side.diagnostico': 'THE DIAGNOSIS',
    'side.recorrido': 'THE JOURNEY',
    'side.cerca': 'HOW WE WORK',
    'side.ecomm': 'QUEDAMOS',
    'side.aria': 'Side navigation',

    // HERO
    'hero.etq': 'For the company that has grown',
    'hero.titulo': 'Take back control.',
    'hero.sub': 'Your company’s finance, technology and brand, in order.',
    'hero.pie.izq': 'Control first. Growth after.',
    'hero.pie.der': 'Finance · Tech · Brand',

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

    // PROYECTOS
    'side.proyectos': 'REAL WORK',
    'proy.lead': 'Software, automations, brands and websites.',
    'proy.body': 'Work already done, with its figures. Click a case to see it in full.',
    'proy.ver': 'View case',
    'proy.dato.3d': 'Own 3D scene',
    'proy.dato.pantallas': 'Screens',
    'proy.dato.anio': 'Year',
    'proy.identidad': 'Brand identity',
    'proy.cta': 'Is yours next?',
    'proy.cta.btn': 'CLICK HERE',
    'caso.marca': 'Brand.',
    'caso.sector': 'Sector.',
    'caso.hicimos': 'What we did.',
    'caso.anio': 'Year.',
    'caso.partida': 'Starting point.',
    'caso.cifras': 'In figures.',
    'caso.quehace': 'What it does.',
    'caso.proyecto': 'Project.',
    'caso.pantallas': 'Screen by screen.',
    'caso.pantallas.sub': 'What happens as you scroll.',
    'caso.movil': 'On mobile, its own choreography.',
    'caso.web': 'Open it on your phone.',
    'caso.web.varias': 'Open them on your phone.',
    'caso.web.sub': 'That is where their customers see it.',
    'caso.siguiente': 'Next project',
    'side.caso.top': 'THE PROJECT',
    'side.caso.idea': 'THE IDEA',
    'side.caso.pantallas': 'SCREEN BY SCREEN',
    'side.caso.cifras': 'IN FIGURES',
    'side.caso.quehace': 'WHAT IT DOES',
    'side.caso.movil': 'ON MOBILE',
    'side.caso.siguiente': 'NEXT',

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
