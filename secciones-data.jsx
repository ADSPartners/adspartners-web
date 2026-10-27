/* Secciones de la home: portada, «sin letra pequeña», testimonios, preguntas y cierre.
   JavaScript plano (sin JSX), igual que proyectos-data.jsx. Los pinta secciones.jsx.
   Las tres ramas (la sección de la home y sus páginas) tienen sus textos en ramas-data.jsx.
   Los datos salen de la oferta de las tres ramas; la forma de contarlo es la de la web, no la del deck.
   Lo que va entre {llaves} se pinta en cursiva y en segundo tono. Todo lo que se dice tiene que ser verdad. */
window.SECCIONES = {
  es: {
    portada: {
      fijo: 'Ponemos en orden',
      rota: ['vuestros números.', 'vuestras horas.', 'vuestra marca.'],
      sub: 'Finanzas, tecnología y marca. Un solo equipo, dentro de vuestra empresa.',
      pie: 'Para empresas que han crecido más deprisa que sus cuentas, sus procesos y su marca.',
      ramas: 'Finance · Tech · Brand',
    },

    // «Sin letra pequeña»: cinco tarjetas, cada una con una pieza que se mueve una vez al entrar.
    // Todo sale de la oferta (precio cerrado por fase, Diagnóstico descontable, visita mensual) o de un trabajo
    // real (hostelería). El mensaje del chat es un ejemplo de cómo se habla, no un dato.
    porque: {
      etq: 'Sin letra pequeña',
      titulo: 'Lo que prometemos {y cómo se ve.}',
      lado: 'Precio cerrado, una persona al otro lado y nada que no podáis comprobar.',
      persona: {
        t: 'Una persona, no un ticket.',
        d: 'Escribís y os contesta Álvaro, que es quien lleva vuestra cuenta. Sin centralitas ni formularios.',
        quien: 'Álvaro', iniciales: 'ÁE', enLinea: 'en línea', escribiendo: 'escribiendo',
        msg: 'El flujo de facturas ya está funcionando. ¿Lo repasamos el jueves en la visita?',
        hora: '10:24', visto: 'Visto',
      },
      precio: {
        t: 'Precio cerrado antes de empezar.',
        d: 'Cada fase arranca con su alcance y su precio por escrito. Lo que se firma es lo que se paga.',
        doc: 'Propuesta · Fase 1', lineas: ['Alcance', 'Plazo', 'Precio'], sello: 'Cerrado',
      },
      visita: {
        t: 'Una visita al mes.',
        d: 'Una vez al mes vamos a vuestra empresa a repasarlo todo en persona. Estéis donde estéis.',
        evento: 'Visita adsPartners', dias: ['L', 'M', 'X', 'J', 'V', 'S', 'D'], locale: 'es-ES',
      },
      descuento: {
        t: 'El Diagnóstico se descuenta.',
        d: 'Si seguís, lo que costó se descuenta entero del plan. Y si no, el mapa que sale es vuestro.',
        lineas: ['Diagnóstico', 'Plan', 'Total'], marca: 'descontado',
      },
      solo: {
        t: 'Lo repetitivo, solo.',
        d: 'En un bar, una aplicación lee cada factura de proveedor a partir de una foto y saca el margen de cada plato. Nadie teclea.',
        n: 115, unidad: 'facturas leídas solas', extra: '157 platos con su semáforo de margen',
        ver: 'Ver el caso', caso: 'Gestión para hostelería.',
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

    porque: {
      etq: 'No small print',
      titulo: 'What we promise {and what it looks like.}',
      lado: 'A fixed price, one person on the other end and nothing you cannot check.',
      persona: {
        t: 'A person, not a ticket.',
        d: 'You write and Álvaro answers: he is the one running your account. No switchboards, no forms.',
        quien: 'Álvaro', iniciales: 'ÁE', enLinea: 'online', escribiendo: 'typing',
        msg: 'The invoice flow is up and running. Shall we go through it on Thursday at the visit?',
        hora: '10:24', visto: 'Seen',
      },
      precio: {
        t: 'A fixed price before we start.',
        d: 'Every phase starts with its scope and its price in writing. What you sign is what you pay.',
        doc: 'Proposal · Phase 1', lineas: ['Scope', 'Timing', 'Price'], sello: 'Fixed',
      },
      visita: {
        t: 'One visit a month.',
        d: 'Once a month we come to your company to go through everything in person. Wherever you are.',
        evento: 'adsPartners visit', dias: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], locale: 'en-GB',
      },
      descuento: {
        t: 'The Diagnosis is deducted.',
        d: 'If you go on, its cost is deducted in full from the plan. And if not, the map that comes out is yours.',
        lineas: ['Diagnosis', 'Plan', 'Total'], marca: 'deducted',
      },
      solo: {
        t: 'The repetitive work, on its own.',
        d: 'In a bar, an app reads every supplier invoice from a photo and works out the margin of every dish. Nobody types.',
        n: 115, unidad: 'invoices read on their own', extra: '157 dishes with their margin traffic light',
        ver: 'See the case', caso: 'Hospitality management app.',
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
