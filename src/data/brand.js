// Brand, «El manual vivo»: los textos, las reglas y el código de la mesa. Las reglas salen del manual de marca de
// adsPartners (adsPartners_BrandGuide.pdf, de uso interno): aquí van solo las reglas y los claims, nada del texto interno.

export const MESA = {
  antetitulo: 'Brand · adsPartners',
  titulo: 'Intenta romperla.',
  intro: 'Esta es nuestra marca entera: el logo, el color, la letra y la forma de hablar. No vive en un PDF: está escrita en código, y el código se cumple solo.',
  pista: 'Todo lo de esta mesa se puede romper',
  // La pista de abajo, según la pieza que tienes debajo
  pistas: {
    logo: 'logotipo.svg — tira de una esquina, o gíralo',
    paleta: 'paleta.css — arrastra un color hacia un lado',
    letra: 'letra.css — ponle otra letra',
    voz: 'voz.txt — escribe como una agencia',
    post: 'post.png — rompe un color o la letra, y mira',
    web: 'web/index.html — usa las mismas reglas que todo lo demás',
  },
};

// La paleta del manual (p. 25), con la variable que la pinta en la web. claro: si encima va texto oscuro
export const PALETA = [
  { id: 'marron', nombre: 'Marrón', hex: '#34190A', claro: false },
  { id: 'crema', nombre: 'Beige', hex: '#E7E2DA', claro: true },
  { id: 'rosa', nombre: 'Rosa', hex: '#F5CBD7', claro: true },
  { id: 'blanco', nombre: 'Blanco', hex: '#F5F3F1', claro: true },
  { id: 'tinta', nombre: 'Negro', hex: '#190900', claro: false },
];

// Las letras (pp. 26-28). La de los titulares es la que se rompe
export const TITULAR = "'Apple Garamond', Georgia, serif";
export const LETRAS = [
  { nombre: 'Open Sauce', papel: 'Principal', clase: 'letra__aa--sauce' },
  { nombre: 'Apple Garamond', papel: 'Secundaria', clase: 'letra__aa--garamond titular' },
  { nombre: 'Quetine', papel: 'Detalle', clase: 'letra__aa--quetine' },
];
// Las tentaciones, por orden: salen las cuatro primeras que tenga el dispositivo
export const TENTACIONES = ['Comic Sans MS', 'Papyrus', 'Impact', 'Arial', 'Courier New', 'Chalkboard SE', 'Marker Felt', 'Brush Script MT', 'Times New Roman', 'cursive', 'fantasy'];

export const LOGO = { proporcion: 2500 / 363.858 };

// Lo que se rompe y se cuenta en la barra de estado («Reglas en su sitio 12/12»)
export const REGLAS = ['logo-proporcion', 'logo-giro', 'marron', 'crema', 'rosa', 'blanco', 'tinta', 'titular', 'texto', 'detalle', 'nombre', 'vocabulario'];

// La regla entra en el código como comentario. Van rotando con cada intento; el sexto intento se lleva «fin»
export const COMENTARIOS = {
  logo: ['El logo no se estira. Se respeta.', 'Tampoco un poquito.', 'No va de verse diferente. Va de tener sentido.', 'Puedes seguir. Él también.'],
  giro: ['Girarlo tampoco cuela.'],
  color: ['Bonito, sí. Nuestro, no.', 'Lo estético sin estrategia se queda en disfraz.', 'Una marca viva se nota.'],
  letra: ['Que mole está bien. Que funcione, mejor.', 'Lo bonito por sí solo no aguanta nada.'],
  fin: 'Vale. Ya has visto que no se rompe.',
  demo: 'Así se defiende. Ahora prueba tú.',
};

// La voz (pp. 19-23). Lo que no somos, con las palabras del manual: cada palabra que rompe la marca dice por qué
const NO = {
  agencia: 'No somos una agencia que hace campañas y ya está.',
  consultora: 'No somos una consultora que mira desde fuera: trabajamos dentro, contigo.',
  proveedor: 'No somos proveedores. Trabajamos como socios.',
  departamento: 'No somos un departamento de 200 personas. Somos un equipo pequeño, y eso es un activo.',
  paquete: 'No vendemos paquetes 360: hacemos lo que tu negocio necesita.',
  sistema: 'Nada de soluciones integrales: un sistema que se mide y se repite.',
  orden: 'No vendemos transformación digital: ordenamos lo que hay.',
  vacio: 'Nada de lenguaje corporativo vacío.',
  sentido: 'No va de verse diferente. Va de tener sentido.',
  hechos: 'Menos adjetivos. Más hechos.',
  medir: 'No prometemos. Medimos.',
  ruido: 'No buscamos ruido. Si no se entiende, no se compra.',
  magia: 'No hay magia ni secretos: hay sistema.',
  colegueo: 'Cero «bro» y cero «crack» en la web.',
  nombre: 'El nombre siempre es adsPartners. ¿Así o más claro?',
};

// Una palabra entera, en cualquier caja. come: se lleva también el espacio (o la coma) de delante, para borrarla
const palabra = (s, come = false) => new RegExp(`${come ? ',?\\s*' : ''}(?<![\\p{L}\\d])(?:${s})(?![\\p{L}\\d])`, 'giu');
// Los nombres femeninos van con su artículo, que pasa a masculino: «una agencia» → «un equipo»
const ARTICULO = { una: 'un', unas: 'unos', la: 'el', las: 'los', tu: 'tu', tus: 'tus', nuestra: 'nuestro', nuestras: 'nuestros', esta: 'este', estas: 'estos', otra: 'otro', otras: 'otros' };
const femenina = (nombre) => palabra(`(?:(unas?|las?|tus?|nuestras?|estas?|otras?)\\s+)?${nombre}(s?)`);
const enMasculino = (por) => (m) => `${m[1] ? `${ARTICULO[m[1].toLowerCase()]} ` : ''}${por}${m[2] ? 's' : ''}`;
const plural = (uno, varios) => (m) => (/s$/i.test(m[0]) ? varios : uno);

// [qué se busca, por qué se cambia (o cómo, si tiene que concordar), lo que no somos]. Van en orden: la primera que
// encaja se queda con el trozo, así que las frases van antes que sus palabras sueltas
export const VOZ = {
  sugerencias: [
    'Somos una consultora 360 con soluciones integrales.',
    'Tu agencia de marketing: resultados garantizados.',
    'Sinergias, transformación digital y éxito garantizado.',
    'ADS PARTNERS: la fórmula mágica de un contenido viral.',
    'Llevamos tu marca al siguiente nivel, bro.',
    'Te contamos el secreto de nuestra metodología disruptiva.',
  ],
  fuera: [
    // Frases
    [palabra('soluciones\\s+integrales'), 'un sistema', NO.sistema],
    [palabra('metodolog[ií]a\\s+disruptiva'), 'rutina', NO.sentido],
    [palabra('transformaci[oó]n\\s+digital'), 'orden', NO.orden],
    [palabra('f[oó]rmula\\s+(?:m[aá]gica|del\\s+[eé]xito)'), 'ejecución', NO.magia],
    [palabra('el\\s+secreto'), 'los números', NO.magia],
    [palabra('(?:siguiente|pr[oó]ximo|otro)\\s+nivel'), 'largo plazo', NO.hechos],
    [palabra('l[ií]deres\\s+del?\\s+(?:sector|mercado)'), 'un equipo con criterio', NO.hechos],
    [palabra('l[ií]der\\s+del?\\s+(?:sector|mercado)', true), '', NO.hechos],
    [palabra('de\\s+innovaci[oó]n', true), '', NO.hechos],
    [palabra('con\\s+garant[ií]as?'), 'que se mide', NO.medir],
    [palabra('valor\\s+a[nñ]adido'), 'resultados', NO.vacio],
    [palabra('full[\\s-]?service|end[\\s-]?to[\\s-]?end|llave\\s+en\\s+mano'), 'a medida', NO.paquete],
    // Lo que no somos
    [femenina('agencia'), enMasculino('equipo'), NO.agencia],
    [femenina('consultor[ií]a'), enMasculino('equipo'), NO.consultora],
    [femenina('consultora'), enMasculino('equipo'), NO.consultora],
    [palabra('consultor(?:es)?'), plural('socio', 'socios'), NO.consultora],
    [palabra('proveedor(?:es)?'), plural('socio', 'socios'), NO.proveedor],
    [palabra('departamentos?'), plural('equipo', 'equipos'), NO.departamento],
    [palabra('360(?:\\s*(?:°|º|grados))?', true), '', NO.paquete],
    [palabra('integral(?:es)?', true), '', NO.sistema],
    [palabra('soluciones'), 'palancas', NO.sistema],
    [palabra('soluci[oó]n'), 'palanca', NO.sistema],
    // Lenguaje vacío y adjetivos de agencia
    [palabra('sinergias?'), 'coherencia', NO.vacio],
    [palabra('ecosistemas?'), plural('sistema', 'sistemas'), NO.vacio],
    [palabra('hol[ií]stic[oa]s?'), 'con foco', NO.vacio],
    [palabra('excelencia'), 'buen gusto', NO.vacio],
    [palabra('disruptiv[oa]s?|revolucionari[oa]s?'), 'con sentido', NO.sentido],
    [palabra('innovador(?:a|es|as)?'), 'con criterio', NO.hechos],
    [palabra('innovaci[oó]n'), 'criterio', NO.hechos],
    [palabra('exponencial(?:es)?'), 'con sistema', NO.hechos],
    [palabra('(?:n[uú]mero|n[º°]\\.?)\\s*1', true), '', NO.hechos],
    // Promesas
    [palabra('garantizamos'), 'medimos', NO.medir],
    [palabra('garantizad([oa]s?)'), (m) => `medid${m[1].toLowerCase()}`, NO.medir],
    [palabra('garant[ií]as?'), 'números', NO.medir],
    [palabra('viral(?:es)?'), 'con criterio', NO.ruido],
    [palabra('secretos?'), 'números', NO.magia],
    [palabra('magia'), 'sistema', NO.magia],
    [palabra('m[aá]gic[oa]s?'), 'con sistema', NO.magia],
    // El colegueo, fuera de la web (p. 23)
    [palabra('bro|cracks?', true), '', NO.colegueo],
  ],
  // El nombre mal escrito (no toca el dominio, ads-partners.com)
  nombre: /(?<![\p{L}\d])ads[\s-]?partners(?![\p{L}\d.])/giu,
  nombreNo: NO.nombre,
};

export const POST = { claim: 'Una buena marca no decora. Coloca.' };
export const WEB = { dominio: 'ads-partners.com', claim: 'Lo bonito por sí solo no aguanta nada.', boton: 'Hablemos' };

// El código de cada pieza, de verdad: los valores son los que la pintan (y los que has roto)
export const CODIGO = {
  logo: ({ transform = 'scale(1)', trazo = 'M0 0', trazados = 11, nodos = 0 } = {}) => [
    '<svg id="logotipo" viewBox="0 0 2500 363.858">',
    `  <g transform="${transform}">`,
    `    <path d="${trazo}…"/>`,
    `    <!-- y ${trazados - 1} trazados más: ${nodos} nodos -->`,
    '  </g>',
    '</svg>',
  ],
  paleta: (valores = {}) => [':root {', ...PALETA.map((c) => `  --${c.id}: ${valores[c.id] ?? c.hex};`), '}'],
  letra: (familia = "'Apple Garamond', serif") => [
    '.titular {',
    `  font-family: ${familia};`,
    '  font-weight: 300;',
    '}',
    "body { font-family: 'Open Sauce'; }",
    ".detalle { font-family: 'Quetine'; }",
  ],
  voz: (titular = null) => (titular === null
    ? ['// voz.js · lo que no somos', 'const fuera = {', "  'consultoría': 'equipo',", "  'agencia': 'equipo',", "  'proveedores': 'socios',", "  'garantizado': 'medido',", '};']
    : ['// voz.js', `const titular = "${titular}";`]),
  post: () => [
    '<article class="post">',
    '  <svg class="isotipo" fill="var(--rosa)"/>',
    `  <p class="titular">${POST.claim}</p>`,
    '</article>',
    '.post { background: var(--marron); }',
  ],
  web: () => [
    '<header><img src="logotipo.svg"></header>',
    `<h1 class="titular">${WEB.claim}</h1>`,
    `<a class="boton">${WEB.boton}</a>`,
    '.boton { background: var(--rosa); }',
  ],
};

export const CIERRE = {
  antetitulo: 'Lo que hacemos con la tuya',
  titulo: 'Que no se quede en un PDF.',
  texto: [
    'Hay marcas que no tienen un problema de marketing: tienen un problema de base. No se entienden, no se reconocen o cada sitio cuenta una cosa distinta.',
    'Primero miramos cómo se ve la tuya y cómo debería verse. Después hacemos la identidad (el logotipo, el color, la letra y la forma de hablar) y la dejamos escrita en reglas. En la web, esas reglas son código, y se cumplen solas.',
  ],
  servicios: ['Identidad y logotipo', 'Webs con una idea propia', 'Dirección de arte', 'Contenido'],
  quien: 'Lo lleva Sebas.',
};

// El remate del cierre, con los intentos de verdad
export const remate = (n) => (n === 0
  ? 'No has intentado romperla. Hay confianza.'
  : `Lo has intentado ${n} ${n === 1 ? 'vez' : 'veces'}. La marca sigue entera.`);
