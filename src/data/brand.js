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
  voz: ['Si no se entiende, no se compra.', 'No construimos marcas vacías.'],
  nombre: ['El nombre siempre es adsPartners. ¿Así o más claro?'],
  fin: 'Vale. Ya has visto que no se rompe.',
  demo: 'Así se defiende. Ahora prueba tú.',
};

// La voz (p. 22): las palabras que rompen la marca y por cuál de las suyas se cambian (o cómo, si tiene que concordar).
// Van en orden: la primera que encaja se queda con el trozo
const palabra = (s) => new RegExp(`(?<![\\p{L}\\d])(?:${s})(?![\\p{L}\\d])`, 'giu');
export const VOZ = {
  sugerencias: [
    'Consultoría 360 y soluciones integrales para tu marca.',
    'Sinergias, transformación digital y éxito garantizado.',
    'La fórmula mágica de un contenido viral.',
    'ADS PARTNERS: soluciones integrales con sinergias.',
    'Te contamos el secreto de nuestra metodología disruptiva.',
  ],
  fuera: [
    [palabra('consultor[ií]a\\s*360'), 'criterio'],
    [palabra('soluciones\\s+integrales'), 'un sistema'],
    [palabra('sinergias?'), 'socios'],
    [palabra('transformaci[oó]n\\s+digital'), 'orden'],
    [palabra('metodolog[ií]a\\s+disruptiva'), 'rutina'],
    [palabra('garantizad([oa]s?)'), (m) => `medid${m[1].toLowerCase()}`],
    [palabra('virales?'), 'con criterio'],
    [palabra('el\\s+secreto'), 'los números'],
    [palabra('secretos?'), 'números'],
    [palabra('f[oó]rmula\\s+m[aá]gica'), 'ejecución'],
  ],
  // El nombre mal escrito (no toca el dominio, ads-partners.com)
  nombre: /(?<![\p{L}\d])ads[\s-]?partners(?![\p{L}\d.])/giu,
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
    ? ['// voz.js · lo que no decimos', 'const fuera = {', "  'sinergias': 'socios',", "  'garantizado': 'medido',", "  'fórmula mágica': 'ejecución',", '};']
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
