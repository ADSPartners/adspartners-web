/* Secciones de la home: los textos de ads Finance + ads Tech + ads Brand.
   JavaScript plano (sin JSX), igual que proyectos-data.jsx. Los pinta secciones.jsx (y la portada, components.jsx).
   Los datos salen de la oferta de las tres ramas; la forma de contarlo es la de la web, no la del deck.
   Lo que va entre {llaves} se pinta en cursiva y en segundo tono.
   Todo lo que se dice tiene que ser verdad: los ejemplos (margen por línea, «olmo») van marcados como ejemplo. */
window.SECCIONES = {
  es: {
    portada: {
      fijo: 'Ponemos en orden',
      rota: ['vuestros números.', 'vuestras horas.', 'vuestra marca.'],
      sub: 'Finanzas, tecnología y marca. Un solo equipo, dentro de vuestra empresa.',
      pie: 'Para empresas que han crecido más deprisa que sus cuentas, sus procesos y su marca.',
      ramas: 'Finance · Tech · Brand',
    },

    diferencias: {
      etq: 'Cómo trabajamos',
      titulo: 'Cuatro cosas que no vais {a tener que pedirnos.}',
      lado: 'Vienen de serie, contratéis una rama o las tres.',
      celdas: [
        { id: 'dentro', t: 'Que vayamos.', d: 'El Diagnóstico se hace dentro de vuestra empresa. Después, una visita al mes, estéis donde estéis.' },
        { id: 'persona', t: 'Un solo teléfono.', d: 'Somos tres, pero habláis con una persona. Coordinarnos es cosa nuestra.' },
        { id: 'fases', t: 'El precio, antes.', d: 'Cada fase empieza con su alcance y su precio cerrados. Y si seguís tras el Diagnóstico, lo que costó se descuenta.' },
        { id: 'ritmo', t: 'A vuestro ritmo.', d: 'Se empieza por una rama y las otras llegan cuando toque. Cada cambio se explica, se prueba y se ajusta con vuestro equipo.' },
      ],
      piezas: {
        visita: 'Una visita al mes',
        vosotros: 'Vosotros',
        referencia: 'Vuestra persona',
        fase: 'Fase',
        alcance: 'Alcance',
        precio: 'Precio',
        ritmo: ['Se explica', 'Se prueba', 'Se ajusta'],
      },
    },

    ramas: {
      etq: 'Qué hacemos',
      titulo: 'Tres ramas. {Un solo equipo.}',
      lado: 'Empezad por la que más os duela.',
      lleva: 'Lo lleva',
      lista: [
        {
          id: 'finance', nombre: 'ads Finance',
          frase: 'Saber qué gana cada línea de negocio. Todos los meses.',
          chips: ['Diagnóstico financiero', 'Modelo de rentabilidad', 'Cuadro de mando', 'Control mensual'],
          persona: 'Daniel de Céspedes',
          nota: 'Cinco años llevando la contabilidad de fondos de inversión.',
        },
        {
          id: 'tech', nombre: 'ads Tech',
          frase: 'Que lo repetitivo se haga solo y vuestra gente, a lo suyo.',
          chips: ['Flujos automáticos', 'Asistentes de IA', 'Herramientas a medida'],
          persona: 'Álvaro Espinosa',
          nota: 'Software a medida e IA para hospitales, clínicas y hostelería.',
        },
        {
          id: 'brand', nombre: 'ads Brand',
          frase: 'Que todos vuestros negocios se vean de la misma casa.',
          chips: ['Arquitectura de marca', 'Identidad visual', 'Web'],
          persona: 'Sebastián Lorenzo',
          nota: 'Marcas creadas desde cero, de la estrategia a la web.',
        },
      ],
      finance: {
        cab: 'Margen por línea de negocio',
        ejemplo: 'Ejemplo',
        filas: [
          { n: 'Tienda', v: 14, nota: 'buen margen' },
          { n: 'Producción', v: 11, nota: 'buen margen' },
          { n: 'Distribución', v: 6, nota: 'ajustado' },
          { n: 'Tienda online', v: -3, nota: 'en pérdida' },
        ],
        frase: 'Vuestra gestoría registra. {Nosotros interpretamos.}',
      },
      tech: {
        cab: 'Una factura, sin tocarla',
        ejemplo: 'Ejemplo',
        pasos: ['Llega por correo', 'Se lee sola, línea a línea', 'Se registra sin teclear', 'Sale en el cuadro de mando'],
        extras: [
          { etq: 'Un asistente de IA', d: 'Un cliente pide por WhatsApp a las once de la noche y el pedido queda apuntado.' },
          { etq: 'Una herramienta a medida', d: 'Un portal donde cada cliente ve sus pedidos y facturas sin llamar a la oficina.' },
        ],
      },
      brand: {
        antes: 'Antes',
        despues: 'Después',
        ejemplo: 'Ejemplo',
        madre: 'Marca madre',
        sueltos: ['Fábrica', 'La Tienda', 'ALMACÉN', 'tienda-online.es'],
        negocios: ['fábrica', 'tienda', 'almacén', 'online'],
        pieAntes: 'Cuatro negocios, cuatro imágenes.',
        pieDespues: 'Cada negocio con su nombre. Todos de la misma casa.',
      },
    },

    metodo: {
      etq: 'Cómo se empieza',
      titulo: 'De la primera charla {a tenerlo funcionando.}',
      pasos: [
        { id: 'charla', etq: '45 minutos', t: 'Quedamos', d: 'Online o en persona. Vemos si tiene sentido seguir, sin compromiso.' },
        { id: 'semanas', etq: '3–4 semanas', t: 'El Diagnóstico', d: 'Varios días dentro de vuestra empresa mirando números, procesos y marca. Con precio cerrado.' },
        { id: 'mapa', etq: 'Lo que os queda', t: 'El mapa', d: 'Qué gana cada línea, qué se puede automatizar, cómo se ve cada marca y un plan con plazos y presupuesto. Vuestro, sigáis o no.' },
        { id: 'fases', etq: 'Por fases', t: 'Manos a la obra', d: 'Primer cierre en 30 días. Primer sistema en 4–6 semanas. Marca, en 4–12. Y el Diagnóstico se descuenta.' },
        { id: 'mes', etq: 'Cada mes', t: 'Seguimos ahí', d: 'Una visita al mes, estéis donde estéis, y la misma persona al teléfono.' },
      ],
      vis: {
        charla: { n: '45', u: 'min', pie: 'Online o en persona · Sin compromiso' },
        semanas: { cab: 'Semana', dias: ['L', 'M', 'X', 'J', 'V'], pie: 'Días dentro de vuestra empresa' },
        mapa: { cab: 'El mapa de vuestra empresa', filas: ['Qué gana cada línea de negocio', 'Qué procesos se pueden automatizar', 'Cómo se ve cada marca del grupo', 'Plan con plazos y presupuesto'], sello: 'Es vuestro' },
        fases: { filas: [{ n: 'ads Finance', v: '30 días', w: 0.34, d: 'hasta el primer cierre' }, { n: 'ads Tech', v: '4–6 semanas', w: 0.5, d: 'hasta el primer sistema' }, { n: 'ads Brand', v: '4–12 semanas', w: 1, d: 'según el proyecto' }] },
        mes: { visita: 'Una visita al mes' },
      },
    },

    testimonios: {
      etq: 'Lo dicen ellos',
      titulo: 'No lo decimos {nosotros.}',
      lista: [
        {
          q: 'Pasé de tirarme días haciendo artes finales y presentación para mis clientes a simplemente un clic. Por fin tengo tiempo para hacer mi trabajo bien y no presentaciones.',
          quien: 'Massimo Riccadonna', cargo: 'Fundador y CEO, Impulso Visual',
        },
        {
          q: 'Lo que antes eran 3 personas a sueldo completo ahora es un sistema que funciona solo, y tengo a esas 3 personas haciendo lo que de verdad se les da bien, y no teclear.',
          quien: 'Gabriel Ortiz', cargo: 'Cofundador y CEO, Intruder Gestión',
        },
        {
          q: 'De tener una idea a construir una verdadera marca que convence a nuestros clientes de nuestra profesionalidad en un mercado tan voraz como es el inmobiliario.',
          quien: 'Alejandro Bermejo', cargo: 'Fundador y CEO, Inversalia',
        },
      ],
    },

    // Si cambia una pregunta, se cambia también en el JSON-LD de index.html.
    preguntas: {
      etq: 'Antes de quedar',
      titulo: 'Preguntad, {que para eso estamos.}',
      chat: 'adsPartners',
      enLinea: 'en línea',
      hoy: 'Hoy',
      lista: [
        {
          p: '¿Hay que contratar las tres ramas?',
          r: 'No. Se puede empezar por una y sumar las otras cuando toque. Si nos preguntáis el orden: primero Finance, luego Tech y al final Brand. No tiene sentido automatizar lo que no se ha medido, ni contar fuera lo que dentro sigue desordenado.',
        },
        {
          p: '¿Y si después del Diagnóstico no seguimos?',
          r: 'No pasa nada. Os quedáis con el mapa: qué gana cada línea de negocio, qué procesos se comen las horas, cómo se ve cada marca y un plan con plazos y presupuesto. Es vuestro.',
        },
        {
          p: '¿Cuánto cuesta el Diagnóstico?',
          r: 'Tiene un precio cerrado y lo sabéis antes de empezar. Cubre finanzas, tecnología y marca a la vez. Si luego seguís, se descuenta entero del plan.',
        },
        {
          p: '¿Trabajáis fuera de Madrid?',
          r: 'Sí. El Diagnóstico se hace en vuestra empresa, con varios días allí, y después vamos una vez al mes. Estéis donde estéis.',
        },
        {
          p: '¿Sustituís a nuestra gestoría?',
          r: 'No. La gestoría registra y nosotros interpretamos. Fiscal, auditoría y contabilidad del día a día se quedan donde están.',
        },
        {
          p: '¿Cuánto se tarda en ver algo funcionando?',
          r: 'El Diagnóstico son 3 o 4 semanas. Después, 30 días hasta el primer cierre con Finance, de 4 a 6 semanas hasta el primer sistema con Tech y de 4 a 12 con Brand, según el proyecto.',
        },
      ],
    },

    cierre: {
      izq: ['Orden', 'por dentro'],
      der: ['Marca', 'por fuera'],
      etq: 'El siguiente paso',
      texto: '45 minutos para ver si encajamos. {Sin compromiso.}',
      btn: 'Proponed día y hora',
    },
  },

  en: {
    portada: {
      fijo: 'We bring order to',
      rota: ['your numbers.', 'your hours.', 'your brand.'],
      sub: 'Finance, technology and brand. One team, inside your company.',
      pie: 'For companies that have grown faster than their books, their processes and their brand.',
      ramas: 'Finance · Tech · Brand',
    },

    diferencias: {
      etq: 'How we work',
      titulo: 'Four things you will not {have to ask us for.}',
      lado: 'They come as standard, whether you hire one branch or all three.',
      celdas: [
        { id: 'dentro', t: 'That we show up.', d: 'The Diagnosis is done inside your company. After that, one visit a month, wherever you are.' },
        { id: 'persona', t: 'One phone number.', d: 'There are three of us, but you talk to one person. Coordinating is our job.' },
        { id: 'fases', t: 'The price, first.', d: 'Each phase starts with its scope and its price fixed. And if you go on after the Diagnosis, its cost is deducted.' },
        { id: 'ritmo', t: 'At your own pace.', d: 'You start with one branch and the others come when the time is right. Every change is explained, tested and adjusted with your team.' },
      ],
      piezas: {
        visita: 'One visit a month',
        vosotros: 'You',
        referencia: 'Your contact',
        fase: 'Phase',
        alcance: 'Scope',
        precio: 'Price',
        ritmo: ['Explained', 'Tested', 'Adjusted'],
      },
    },

    ramas: {
      etq: 'What we do',
      titulo: 'Three branches. {One team.}',
      lado: 'Start with the one that hurts most.',
      lleva: 'Run by',
      lista: [
        {
          id: 'finance', nombre: 'ads Finance',
          frase: 'Knowing what each business line earns. Every month.',
          chips: ['Financial diagnosis', 'Profitability model', 'Dashboard', 'Monthly control'],
          persona: 'Daniel de Céspedes',
          nota: 'Five years running the accounting of investment funds.',
        },
        {
          id: 'tech', nombre: 'ads Tech',
          frase: 'The repetitive work runs itself and your people get on with theirs.',
          chips: ['Automated flows', 'AI assistants', 'Custom tools'],
          persona: 'Álvaro Espinosa',
          nota: 'Custom software and AI for hospitals, clinics and hospitality.',
        },
        {
          id: 'brand', nombre: 'ads Brand',
          frase: 'All your businesses looking like they come from the same house.',
          chips: ['Brand architecture', 'Visual identity', 'Website'],
          persona: 'Sebastián Lorenzo',
          nota: 'Brands built from scratch, from strategy to website.',
        },
      ],
      finance: {
        cab: 'Margin by business line',
        ejemplo: 'Example',
        filas: [
          { n: 'Shop', v: 14, nota: 'good margin' },
          { n: 'Production', v: 11, nota: 'good margin' },
          { n: 'Distribution', v: 6, nota: 'tight' },
          { n: 'Online shop', v: -3, nota: 'at a loss' },
        ],
        frase: 'Your accountants record. {We interpret.}',
      },
      tech: {
        cab: 'An invoice, untouched',
        ejemplo: 'Example',
        pasos: ['Arrives by email', 'Reads itself, line by line', 'Is filed with no typing', 'Shows on the dashboard'],
        extras: [
          { etq: 'An AI assistant', d: 'A customer orders on WhatsApp at eleven at night and the order is logged.' },
          { etq: 'A custom tool', d: 'A portal where each customer sees their orders and invoices without calling the office.' },
        ],
      },
      brand: {
        antes: 'Before',
        despues: 'After',
        ejemplo: 'Example',
        madre: 'Parent brand',
        sueltos: ['Factory', 'The Shop', 'WAREHOUSE', 'online-shop.com'],
        negocios: ['factory', 'shop', 'warehouse', 'online'],
        pieAntes: 'Four businesses, four images.',
        pieDespues: 'Each business with its own name. All from the same house.',
      },
    },

    metodo: {
      etq: 'How it starts',
      titulo: 'From the first chat {to having it running.}',
      pasos: [
        { id: 'charla', etq: '45 minutes', t: 'We meet', d: 'Online or in person. We see whether it makes sense to go on, no strings attached.' },
        { id: 'semanas', etq: '3–4 weeks', t: 'The Diagnosis', d: 'Several days inside your company looking at numbers, processes and brand. At a fixed price.' },
        { id: 'mapa', etq: 'What you keep', t: 'The map', d: 'What each line earns, what can be automated, how each brand looks and a plan with timings and budget. Yours, whether you go on or not.' },
        { id: 'fases', etq: 'In phases', t: 'Getting to work', d: 'First monthly close in 30 days. First system in 4–6 weeks. Brand, in 4–12. And the Diagnosis is deducted.' },
        { id: 'mes', etq: 'Every month', t: 'We stay', d: 'One visit a month, wherever you are, and the same person on the phone.' },
      ],
      vis: {
        charla: { n: '45', u: 'min', pie: 'Online or in person · No strings attached' },
        semanas: { cab: 'Week', dias: ['M', 'T', 'W', 'T', 'F'], pie: 'Days inside your company' },
        mapa: { cab: 'The map of your company', filas: ['What each business line earns', 'Which processes can be automated', 'How each brand in the group looks', 'A plan with timings and budget'], sello: 'It is yours' },
        fases: { filas: [{ n: 'ads Finance', v: '30 days', w: 0.34, d: 'to the first monthly close' }, { n: 'ads Tech', v: '4–6 weeks', w: 0.5, d: 'to the first system' }, { n: 'ads Brand', v: '4–12 weeks', w: 1, d: 'depending on the project' }] },
        mes: { visita: 'One visit a month' },
      },
    },

    testimonios: {
      etq: 'In their words',
      titulo: 'Don’t take {our word for it.}',
      lista: [
        {
          q: 'I went from spending days on final artwork and presentations for my clients to a single click. I finally have time to do my job well, not presentations.',
          quien: 'Massimo Riccadonna', cargo: 'Founder & CEO, Impulso Visual',
        },
        {
          q: 'What used to be three people on full salary is now a system that runs on its own, and those three people are doing what they are really good at instead of typing.',
          quien: 'Gabriel Ortiz', cargo: 'Co-founder & CEO, Intruder Gestión',
        },
        {
          q: 'From having an idea to building a real brand that convinces our clients of our professionalism, in a market as fierce as real estate.',
          quien: 'Alejandro Bermejo', cargo: 'Founder & CEO, Inversalia',
        },
      ],
    },

    preguntas: {
      etq: 'Before we meet',
      titulo: 'Ask away, {that is what we are here for.}',
      chat: 'adsPartners',
      enLinea: 'online',
      hoy: 'Today',
      lista: [
        {
          p: 'Do we have to hire all three branches?',
          r: 'No. You can start with one and add the others when the time comes. If you ask us about the order: Finance first, then Tech, Brand last. There is no point automating what has not been measured, or telling the outside world what is still a mess inside.',
        },
        {
          p: 'What if we do not go on after the Diagnosis?',
          r: 'Nothing happens. You keep the map: what each business line earns, which processes eat the hours, how each brand looks and a plan with timings and budget. It is yours.',
        },
        {
          p: 'How much does the Diagnosis cost?',
          r: 'It has a fixed price and you know it before we start. It covers finance, technology and brand at once. If you go on, it is deducted in full from the plan.',
        },
        {
          p: 'Do you work outside Madrid?',
          r: 'Yes. The Diagnosis is done at your company, with several days there, and after that we come once a month. Wherever you are.',
        },
        {
          p: 'Do you replace our accountants?',
          r: 'No. Your accountants record and we interpret. Tax, auditing and day-to-day bookkeeping stay where they are.',
        },
        {
          p: 'How long until we see something working?',
          r: 'The Diagnosis takes 3 or 4 weeks. After that, 30 days to the first monthly close with Finance, 4 to 6 weeks to the first system with Tech and 4 to 12 with Brand, depending on the project.',
        },
      ],
    },

    cierre: {
      izq: ['Order', 'inside'],
      der: ['Brand', 'outside'],
      etq: 'The next step',
      texto: '45 minutes to see if we are a fit. {No strings attached.}',
      btn: 'Suggest a day and time',
    },
  },
};
