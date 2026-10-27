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

    // Franja fina: el titular y una flecha que señala el chat de FRESA. Las preguntas se le hacen a FRESA.
    preguntas: {
      titulo: 'Preguntad, {que para eso estamos.}',
      abrir: 'Abrir el chat con FRESA',
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
      titulo: 'Ask away, {that is what we are here for.}',
      abrir: 'Open the chat with FRESA',
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
