/* Secciones de la home: los textos de «Recuperar el control» (ads Finance + ads Tech + ads Brand).
   JavaScript plano (sin JSX), igual que proyectos-data.jsx. Los pinta secciones.jsx.
   Salen del deck comercial, casi literales y de vosotros. Lo que va entre {llaves} se pinta en cursiva.
   Todo lo que se dice tiene que ser verdad: los ejemplos (margen por línea, «olmo») van marcados como ejemplo. */
window.SECCIONES = {
  es: {
    partida: {
      etq: 'El punto de partida',
      titulo: 'Crecer es una buena noticia. {Hasta que deja de verse lo que pasa dentro.}',
      cols: [
        { etq: 'Finance', t: 'Los números', d: 'Las cuentas cuadran. Pero hay una sola cuenta de resultados: no dice qué línea deja margen.' },
        { etq: 'Tech', t: 'Las horas', d: 'El equipo saca el trabajo. Pero cada pedido y cada factura pasan por las mismas tres personas.' },
        { etq: 'Brand', t: 'La imagen', d: 'Cada negocio tiene su nombre. Pero desde fuera nadie ve que son de la misma casa.' },
      ],
      cierre: 'Estructuramos lo que hace falta para el siguiente tramo.',
    },

    ramas: {
      etq: 'Qué hacemos',
      titulo: 'Tres especialistas {que trabajan como uno solo.}',
      lista: [
        {
          id: 'finance', orden: 'Primero', nombre: 'ads Finance',
          titulo: 'Saber, cada mes, {dónde estáis.}',
          persona: 'Daniel de Céspedes',
          trayectoria: 'Cinco años al frente de la contabilidad de fondos de inversión.',
          entrega: ['Diagnóstico financiero', 'Modelo de rentabilidad', 'Cuadro de mando', 'Control mensual'],
        },
        {
          id: 'tech', orden: 'Después', nombre: 'ads Tech',
          titulo: 'Que la empresa {casi se lleve sola.}',
          persona: 'Álvaro Espinosa',
          trayectoria: 'Software a medida e IA para hospitales, clínicas y hostelería.',
          entrega: ['Flujos automáticos', 'Asistentes de IA', 'Herramientas a medida'],
        },
        {
          id: 'brand', orden: 'Al final', nombre: 'ads Brand',
          titulo: 'Un grupo, {una imagen.}',
          persona: 'Sebastián Lorenzo',
          trayectoria: 'Marcas creadas desde cero, de la estrategia a la web.',
          entrega: ['Arquitectura de marca', 'Identidad visual y manual', 'Web y presencia digital'],
        },
      ],
      finance: {
        cab: 'Margen por línea de negocio',
        ejemplo: 'Ejemplo ilustrativo',
        filas: [
          { n: 'Tienda', v: 14, nota: 'buen margen' },
          { n: 'Producción', v: 11, nota: 'buen margen' },
          { n: 'Distribución', v: 6, nota: 'ajustado' },
          { n: 'Tienda online', v: -3, nota: 'en pérdida' },
        ],
        frase: 'Vuestra gestoría registra. {Nosotros interpretamos.}',
      },
      tech: {
        cab: 'Un flujo automático',
        ejemplo: 'Por ejemplo',
        pasos: ['Llega una factura por correo', 'Se lee sola, línea a línea', 'Se registra sin teclear', 'Aparece en el cuadro de mando'],
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

    principio: {
      etq: 'Por qué en este orden',
      texto: 'No se automatiza lo que no se ha medido, {ni se cuenta hacia fuera lo que todavía no está ordenado por dentro.}',
    },

    diagnostico: {
      etq: 'La puerta de entrada · El Diagnóstico',
      titulo: 'Todo empieza {por mirar bien.}',
      cifras: [
        { etq: 'Cuánto dura', n: '3 – 4', u: 'semanas', d: 'Con varios días dentro de vuestra empresa.' },
        { etq: 'Cuánto cuesta', n: 'Precio', u: 'cerrado', d: 'Finanzas, tecnología y marca, a la vez.' },
        { etq: 'Si seguís', n: '100 %', u: 'se descuenta', d: 'Lo pagado se resta del plan si decidís seguir.' },
      ],
      mapa: {
        etq: 'Qué os lleváis del Diagnóstico',
        titulo: 'El mapa {de vuestra empresa.}',
        filas: [
          'Cuánto gana de verdad cada línea de negocio.',
          'Qué procesos se comen las horas y cuáles se pueden automatizar.',
          'Cómo se ve hoy cada marca del grupo y qué le falta para sumar.',
          'Un plan por orden de prioridad, con plazos y presupuesto.',
        ],
        cierre: 'Es vuestro, {y os sirve aunque decidáis no seguir con nosotros.}',
      },
    },

    recorrido: {
      etq: 'Cómo trabajamos',
      titulo: 'Un recorrido con orden. {Y a vuestro ritmo.}',
      pasos: [
        { etq: 'Las tres ramas', t: 'Diagnóstico', n: '3–4 semanas', d: 'dentro de vuestra empresa' },
        { etq: 'ads Finance', t: 'Orden', n: '30 días', d: 'hasta el primer cierre' },
        { etq: 'ads Tech', t: 'Sistemas', n: '4–6 semanas', d: 'hasta el primer sistema' },
        { etq: 'ads Brand', t: 'Imagen', n: '4–12 semanas', d: 'según el proyecto' },
        { etq: 'Las tres ramas', t: 'Acompañamiento', n: 'Cada mes', d: 'con visita, estéis donde estéis' },
      ],
      cierre: 'Podéis empezar por una sola rama {y sumar las demás después.}',
    },

    cerca: {
      etq: 'Cómo es trabajar con nosotros',
      titulo: 'Cerca, de verdad. {Estéis donde estéis.}',
      celdas: [
        { id: 'dentro', t: 'Dentro de vuestra empresa', d: 'El Diagnóstico se hace allí. Después vamos cada mes.' },
        { id: 'persona', t: 'Una persona de referencia', d: 'Un nombre y un teléfono. Coordinarnos es cosa nuestra.' },
        { id: 'fases', t: 'Por fases y sin sorpresas', d: 'Cada fase empieza con su alcance y su precio cerrados.' },
        { id: 'ritmo', t: 'A vuestro ritmo', d: 'Cada cambio se explica, se prueba y se ajusta con vuestro equipo.' },
      ],
      piezas: {
        visita: 'Visita',
        dias: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
        vosotros: 'Vosotros',
        referencia: 'Vuestra persona',
        fase: 'Fase',
        alcance: 'Alcance',
        precio: 'Precio',
        cerrado: 'cerrado',
        ritmo: ['Se explica', 'Se prueba', 'Se ajusta'],
      },
    },

    testimonios: {
      etq: 'Lo dice quien ya ha trabajado con nosotros',
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
      anterior: 'Anterior',
      siguiente: 'Siguiente',
    },

    preguntas: {
      etq: 'Preguntas frecuentes',
      titulo: 'Lo que se pregunta {antes de empezar.}',
      lista: [
        {
          p: '¿Hay que contratar las tres ramas?',
          r: 'No. Podéis empezar por una sola rama y sumar las demás después. El orden que recomendamos es Finance, Tech y Brand, porque no se automatiza lo que no se ha medido ni se cuenta hacia fuera lo que todavía no está ordenado por dentro.',
        },
        {
          p: '¿Qué pasa si después del Diagnóstico no seguimos?',
          r: 'Nada. El Diagnóstico termina con el mapa de vuestra empresa: cuánto gana cada línea de negocio, qué procesos se comen las horas, cómo se ve cada marca y un plan por orden de prioridad, con plazos y presupuesto. Es vuestro y os sirve aunque no sigáis con nosotros.',
        },
        {
          p: '¿Cuánto cuesta el Diagnóstico?',
          r: 'Tiene un precio cerrado, que conocéis antes de empezar, y cubre finanzas, tecnología y marca a la vez. Si decidís seguir, lo pagado se descuenta del plan.',
        },
        {
          p: '¿Trabajáis fuera de Madrid?',
          r: 'Sí. El Diagnóstico se hace dentro de vuestra empresa, con varios días allí, y después vamos cada mes, estéis donde estéis.',
        },
        {
          p: '¿Sustituís a nuestra gestoría?',
          r: 'No. Vuestra gestoría registra; nosotros interpretamos. ads Finance monta el modelo de rentabilidad, el cuadro de mando y el control mensual. La gestión fiscal, la auditoría y el registro contable diario siguen donde están.',
        },
        {
          p: '¿Cuánto se tarda en ver algo funcionando?',
          r: 'El Diagnóstico dura de 3 a 4 semanas. Después, 30 días hasta el primer cierre con ads Finance, de 4 a 6 semanas hasta el primer sistema con ads Tech y de 4 a 12 semanas con ads Brand, según el proyecto.',
        },
      ],
    },

    cierre: {
      izq: ['Primero', 'control'],
      der: ['Después', 'crecimiento'],
      etq: 'El siguiente paso',
      texto: '45 minutos para ver si el Diagnóstico tiene sentido en vuestro caso. {Sin compromiso.}',
      btn: 'Proponed día y hora',
    },
  },

  en: {
    partida: {
      etq: 'The starting point',
      titulo: 'Growing is good news. {Until you can no longer see what is happening inside.}',
      cols: [
        { etq: 'Finance', t: 'The numbers', d: 'The books balance. But there is a single P&L: it does not say which business line makes a margin.' },
        { etq: 'Tech', t: 'The hours', d: 'The team gets the work out. But every order and every invoice goes through the same three people.' },
        { etq: 'Brand', t: 'The image', d: 'Each business has its own name. But from the outside nobody sees they belong to the same house.' },
      ],
      cierre: 'We build the structure the next stretch needs.',
    },

    ramas: {
      etq: 'What we do',
      titulo: 'Three specialists {working as one.}',
      lista: [
        {
          id: 'finance', orden: 'First', nombre: 'ads Finance',
          titulo: 'Knowing, every month, {where you stand.}',
          persona: 'Daniel de Céspedes',
          trayectoria: 'Five years running the accounting of investment funds.',
          entrega: ['Financial diagnosis', 'Profitability model', 'Dashboard', 'Monthly control'],
        },
        {
          id: 'tech', orden: 'Then', nombre: 'ads Tech',
          titulo: 'A company {that almost runs itself.}',
          persona: 'Álvaro Espinosa',
          trayectoria: 'Custom software and AI for hospitals, clinics and hospitality.',
          entrega: ['Automated flows', 'AI assistants', 'Custom tools'],
        },
        {
          id: 'brand', orden: 'Last', nombre: 'ads Brand',
          titulo: 'One group, {one image.}',
          persona: 'Sebastián Lorenzo',
          trayectoria: 'Brands built from scratch, from strategy to website.',
          entrega: ['Brand architecture', 'Visual identity and guidelines', 'Website and digital presence'],
        },
      ],
      finance: {
        cab: 'Margin by business line',
        ejemplo: 'Illustrative example',
        filas: [
          { n: 'Shop', v: 14, nota: 'good margin' },
          { n: 'Production', v: 11, nota: 'good margin' },
          { n: 'Distribution', v: 6, nota: 'tight' },
          { n: 'Online shop', v: -3, nota: 'at a loss' },
        ],
        frase: 'Your accountants record. {We interpret.}',
      },
      tech: {
        cab: 'An automated flow',
        ejemplo: 'For example',
        pasos: ['An invoice arrives by email', 'It reads itself, line by line', 'It is filed with no typing', 'It shows up on the dashboard'],
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

    principio: {
      etq: 'Why in this order',
      texto: 'You cannot automate what has not been measured, {nor tell the outside world what is not yet in order on the inside.}',
    },

    diagnostico: {
      etq: 'The way in · The Diagnosis',
      titulo: 'It all starts {with a proper look.}',
      cifras: [
        { etq: 'How long', n: '3 – 4', u: 'weeks', d: 'With several days inside your company.' },
        { etq: 'How much', n: 'Fixed', u: 'price', d: 'Finance, technology and brand, all at once.' },
        { etq: 'If you go on', n: '100 %', u: 'is deducted', d: 'What you paid comes off the plan if you decide to continue.' },
      ],
      mapa: {
        etq: 'What you take from the Diagnosis',
        titulo: 'The map {of your company.}',
        filas: [
          'How much each business line really earns.',
          'Which processes eat the hours, and which can be automated.',
          'How each brand in the group looks today, and what it needs to add up.',
          'A plan in order of priority, with timings and budget.',
        ],
        cierre: 'It is yours, {and it is useful even if you decide not to go on with us.}',
      },
    },

    recorrido: {
      etq: 'How we work',
      titulo: 'A journey with an order. {At your own pace.}',
      pasos: [
        { etq: 'All three branches', t: 'Diagnosis', n: '3–4 weeks', d: 'inside your company' },
        { etq: 'ads Finance', t: 'Order', n: '30 days', d: 'to the first monthly close' },
        { etq: 'ads Tech', t: 'Systems', n: '4–6 weeks', d: 'to the first system' },
        { etq: 'ads Brand', t: 'Image', n: '4–12 weeks', d: 'depending on the project' },
        { etq: 'All three branches', t: 'Ongoing support', n: 'Every month', d: 'with a visit, wherever you are' },
      ],
      cierre: 'You can start with a single branch {and add the others later.}',
    },

    cerca: {
      etq: 'What working with us is like',
      titulo: 'Close, for real. {Wherever you are.}',
      celdas: [
        { id: 'dentro', t: 'Inside your company', d: 'The Diagnosis happens there. After that, we come every month.' },
        { id: 'persona', t: 'One point of contact', d: 'One name and one phone number. Coordinating among ourselves is our job.' },
        { id: 'fases', t: 'In phases, no surprises', d: 'Each phase starts with its scope and its price fixed.' },
        { id: 'ritmo', t: 'At your own pace', d: 'Every change is explained, tested and adjusted with your team.' },
      ],
      piezas: {
        visita: 'Visit',
        dias: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        vosotros: 'You',
        referencia: 'Your contact',
        fase: 'Phase',
        alcance: 'Scope',
        precio: 'Price',
        cerrado: 'fixed',
        ritmo: ['Explained', 'Tested', 'Adjusted'],
      },
    },

    testimonios: {
      etq: 'From those who have already worked with us',
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
      anterior: 'Previous',
      siguiente: 'Next',
    },

    preguntas: {
      etq: 'Frequently asked',
      titulo: 'What people ask {before starting.}',
      lista: [
        {
          p: 'Do we have to hire all three branches?',
          r: 'No. You can start with a single branch and add the others later. The order we recommend is Finance, Tech and Brand, because you cannot automate what has not been measured, nor tell the outside world what is not yet in order on the inside.',
        },
        {
          p: 'What if we do not continue after the Diagnosis?',
          r: 'Nothing. The Diagnosis ends with the map of your company: how much each business line earns, which processes eat the hours, how each brand looks and a plan in order of priority, with timings and budget. It is yours and it is useful even if you do not go on with us.',
        },
        {
          p: 'How much does the Diagnosis cost?',
          r: 'It has a fixed price, which you know before we start, and it covers finance, technology and brand at once. If you decide to continue, what you paid is deducted from the plan.',
        },
        {
          p: 'Do you work outside Madrid?',
          r: 'Yes. The Diagnosis is done inside your company, with several days there, and after that we come every month, wherever you are.',
        },
        {
          p: 'Do you replace our accountants?',
          r: 'No. Your accountants record; we interpret. ads Finance builds the profitability model, the dashboard and the monthly control. Tax filing, auditing and day-to-day bookkeeping stay where they are.',
        },
        {
          p: 'How long until we see something working?',
          r: 'The Diagnosis takes 3 to 4 weeks. After that, 30 days to the first monthly close with ads Finance, 4 to 6 weeks to the first system with ads Tech and 4 to 12 weeks with ads Brand, depending on the project.',
        },
      ],
    },

    cierre: {
      izq: ['Control', 'first'],
      der: ['Growth', 'after'],
      etq: 'The next step',
      texto: '45 minutes to see whether the Diagnosis makes sense in your case. {No strings attached.}',
      btn: 'Suggest a day and time',
    },
  },
};
