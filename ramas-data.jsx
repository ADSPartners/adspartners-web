/* Las tres ramas: ads Finance, ads Tech y ads Brand.
   JavaScript plano (sin JSX), igual que proyectos-data.jsx. Lo pinta ramas.jsx en dos sitios:
     - la sección «Qué hacemos» de la home (tres columnas, una por rama), y
     - la página de cada rama: /finance/, /tech/ y /brand/ (build.mjs genera una por cada id de `orden`
       desde la plantilla rama.html, y saca de `seo` su título y su descripción).
   Lo que va entre {llaves} se pinta en cursiva y en segundo tono.
   Todo lo que se dice tiene que ser verdad: los plazos y lo que incluye cada rama salen de la oferta. */
window.RAMAS = {
  orden: ['finance', 'tech', 'brand'],

  es: {
    home: {
      etq: 'Qué hacemos',
      titulo: 'Tres ramas. {Un solo equipo.}',
      lado: 'Empezad por la que más os duela.',
      ver: 'Ver',
    },

    // Lo que comparten las tres páginas.
    pagina: {
      volver: 'adsPartners',
      lleva: 'Lo lleva',
      plazo: 'Primer resultado',
      contrato: 'Se contrata',
      sola: 'Sola o junto a las otras dos ramas.',
      incluye: 'Qué incluye',
      trabajo: { etq: 'Trabajo hecho', titulo: 'Esto ya está hecho {y funcionando.}' },
      empieza: { etq: 'Cómo se empieza', titulo: 'De la primera charla {a tenerlo funcionando.}' },
      pasos: [
        { etq: '45 minutos', t: 'Quedamos', d: 'Online o en persona. Vemos si tiene sentido seguir, sin compromiso.' },
        { etq: '3–4 semanas', t: 'El Diagnóstico', d: 'Varios días dentro de vuestra empresa mirando números, procesos y marca. Con precio cerrado, y el mapa que sale es vuestro, sigáis o no.' },
      ],
      nota: 'Después, una visita al mes y la misma persona al teléfono. Cada fase empieza con su alcance y su precio cerrados, y lo que costó el Diagnóstico se descuenta.',
      cierre: { etq: 'El siguiente paso', texto: '45 minutos para ver si encajamos. {Sin compromiso.}', btn: 'Proponed día y hora' },
      otras: 'Las otras dos ramas',
    },

    finance: {
      nombre: 'ads Finance',
      corto: 'Finance',
      frase: 'Saber qué gana cada línea de negocio. Todos los meses.',
      idea: 'Vuestra gestoría registra. {Nosotros interpretamos.}',
      persona: 'Álvaro Espinosa',
      nota: 'Vuestro contacto. Los números los analiza un financiero con cinco años llevando la contabilidad de fondos de inversión.',
      plazo: '30 días hasta el primer cierre.',
      incluye: [
        { t: 'Diagnóstico financiero', d: 'Dónde se gana y dónde se pierde dinero hoy, con vuestros propios números.' },
        { t: 'Modelo de rentabilidad', d: 'El margen de cada línea de negocio, calculado igual todos los meses.' },
        { t: 'Cuadro de mando', d: 'Lo importante en una pantalla, sin tener que pedirle un Excel a nadie.' },
        { t: 'Control mensual', d: 'Cierre cada mes, y lo repasamos con vosotros en la visita.' },
      ],
      apunte: 'No sustituimos a la gestoría: fiscal, auditoría y contabilidad del día a día se quedan donde están.',
      paso: { etq: '30 días', t: 'El primer cierre', d: 'El primer mes cerrado, con el margen de cada línea a la vista. A partir de ahí, todos los meses.' },
      seo: {
        titulo: 'ads Finance — saber qué gana cada línea de negocio · adsPartners®',
        descripcion: 'Diagnóstico financiero, modelo de rentabilidad, cuadro de mando y control mensual para empresas que han crecido. Vuestra gestoría registra; ads Finance interpreta.',
      },
    },

    tech: {
      nombre: 'ads Tech',
      corto: 'Tech',
      frase: 'Que lo repetitivo se haga solo y vuestra gente, a lo suyo.',
      idea: 'Lo repetitivo, solo. {Vuestra gente, a lo suyo.}',
      persona: 'Álvaro Espinosa',
      nota: 'Software a medida e IA para hospitales, clínicas y hostelería.',
      plazo: '4–6 semanas hasta el primer sistema.',
      incluye: [
        { t: 'Flujos automáticos', d: 'Una factura llega por correo, se lee sola, se registra sin teclear y sale en el cuadro de mando.' },
        { t: 'Asistentes de IA', d: 'Un cliente pide por WhatsApp a las once de la noche y el pedido queda apuntado.' },
        { t: 'Herramientas a medida', d: 'Un portal donde cada cliente ve sus pedidos y sus facturas sin llamar a la oficina.' },
      ],
      apunte: 'Son ejemplos. Qué se automatiza en vuestra empresa sale del Diagnóstico.',
      paso: { etq: '4–6 semanas', t: 'El primer sistema', d: 'El primer proceso funcionando solo: explicado, probado y ajustado con vuestro equipo.' },
      seo: {
        titulo: 'ads Tech — automatización, IA y software a medida · adsPartners®',
        descripcion: 'Flujos automáticos, asistentes de IA y herramientas a medida para empresas que han crecido. Que lo repetitivo se haga solo y vuestra gente, a lo suyo.',
      },
    },

    brand: {
      nombre: 'ads Brand',
      corto: 'Brand',
      frase: 'Que todos vuestros negocios se vean de la misma casa.',
      idea: 'Cada negocio con su nombre. {Todos de la misma casa.}',
      persona: 'Sebastián Lorenzo',
      nota: 'Marcas creadas desde cero, de la estrategia a la web.',
      plazo: '4–12 semanas, según el proyecto.',
      incluye: [
        { t: 'Arquitectura de marca', d: 'Qué marcas tenéis, cuál manda y cómo se relacionan entre ellas.' },
        { t: 'Identidad visual', d: 'Logotipo, colores y tipografías, con un manual para que todo el mundo los use igual.' },
        { t: 'Web', d: 'La web y la presencia digital, hechas con esa misma identidad.' },
      ],
      paso: { etq: '4–12 semanas', t: 'La marca', d: 'Según el proyecto: desde ordenar las marcas que ya tenéis hasta una identidad y una web nuevas.' },
      seo: {
        titulo: 'ads Brand — arquitectura de marca, identidad y web · adsPartners®',
        descripcion: 'Arquitectura de marca, identidad visual y web para empresas con varios negocios. Cada negocio con su nombre y todos de la misma casa.',
      },
    },
  },

  en: {
    home: {
      etq: 'What we do',
      titulo: 'Three branches. {One team.}',
      lado: 'Start with the one that hurts most.',
      ver: 'See',
    },

    pagina: {
      volver: 'adsPartners',
      lleva: 'Run by',
      plazo: 'First result',
      contrato: 'How to hire it',
      sola: 'On its own or with the other two branches.',
      incluye: 'What is included',
      trabajo: { etq: 'Work done', titulo: 'This is already built {and running.}' },
      empieza: { etq: 'How it starts', titulo: 'From the first chat {to having it running.}' },
      pasos: [
        { etq: '45 minutes', t: 'We meet', d: 'Online or in person. We see whether it makes sense to go on, no strings attached.' },
        { etq: '3–4 weeks', t: 'The Diagnosis', d: 'Several days inside your company looking at numbers, processes and brand. At a fixed price, and the map that comes out is yours, whether you go on or not.' },
      ],
      nota: 'After that, one visit a month and the same person on the phone. Each phase starts with its scope and its price fixed, and the cost of the Diagnosis is deducted.',
      cierre: { etq: 'The next step', texto: '45 minutes to see if we are a fit. {No strings attached.}', btn: 'Suggest a day and time' },
      otras: 'The other two branches',
    },

    finance: {
      nombre: 'ads Finance',
      corto: 'Finance',
      frase: 'Knowing what each business line earns. Every month.',
      idea: 'Your accountants record. {We interpret.}',
      persona: 'Álvaro Espinosa',
      nota: 'Your contact. The numbers are analysed by a finance specialist with five years running the accounting of investment funds.',
      plazo: '30 days to the first monthly close.',
      incluye: [
        { t: 'Financial diagnosis', d: 'Where money is made and lost today, with your own numbers.' },
        { t: 'Profitability model', d: 'The margin of each business line, calculated the same way every month.' },
        { t: 'Dashboard', d: 'What matters on one screen, without asking anyone for a spreadsheet.' },
        { t: 'Monthly control', d: 'A close every month, and we go through it with you on our visit.' },
      ],
      apunte: 'We do not replace your accountants: tax, auditing and day-to-day bookkeeping stay where they are.',
      paso: { etq: '30 days', t: 'The first close', d: 'The first month closed, with the margin of each line in plain sight. From then on, every month.' },
      seo: { titulo: 'ads Finance — adsPartners®', descripcion: 'Financial diagnosis, profitability model, dashboard and monthly control.' },
    },

    tech: {
      nombre: 'ads Tech',
      corto: 'Tech',
      frase: 'The repetitive work runs itself and your people get on with theirs.',
      idea: 'The repetitive work, on its own. {Your people, on theirs.}',
      persona: 'Álvaro Espinosa',
      nota: 'Custom software and AI for hospitals, clinics and hospitality.',
      plazo: '4–6 weeks to the first system.',
      incluye: [
        { t: 'Automated flows', d: 'An invoice arrives by email, reads itself, is filed with no typing and shows on the dashboard.' },
        { t: 'AI assistants', d: 'A customer orders on WhatsApp at eleven at night and the order is logged.' },
        { t: 'Custom tools', d: 'A portal where each customer sees their orders and invoices without calling the office.' },
      ],
      apunte: 'These are examples. What gets automated in your company comes out of the Diagnosis.',
      paso: { etq: '4–6 weeks', t: 'The first system', d: 'The first process running on its own: explained, tested and adjusted with your team.' },
      seo: { titulo: 'ads Tech — adsPartners®', descripcion: 'Automated flows, AI assistants and custom tools.' },
    },

    brand: {
      nombre: 'ads Brand',
      corto: 'Brand',
      frase: 'All your businesses looking like they come from the same house.',
      idea: 'Each business with its own name. {All from the same house.}',
      persona: 'Sebastián Lorenzo',
      nota: 'Brands built from scratch, from strategy to website.',
      plazo: '4–12 weeks, depending on the project.',
      incluye: [
        { t: 'Brand architecture', d: 'Which brands you have, which one leads and how they relate to each other.' },
        { t: 'Visual identity', d: 'Logo, colours and typefaces, with a manual so everyone uses them the same way.' },
        { t: 'Website', d: 'The website and digital presence, built with that same identity.' },
      ],
      paso: { etq: '4–12 weeks', t: 'The brand', d: 'Depending on the project: from sorting out the brands you already have to a new identity and website.' },
      seo: { titulo: 'ads Brand — adsPartners®', descripcion: 'Brand architecture, visual identity and website.' },
    },
  },
};
