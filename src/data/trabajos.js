// Los trabajos de la sección «Trabajo». «fuera» es lo que se ve (la web o la app terminada);
// «dentro» es un trozo de su código real, copiado tal cual de cada proyecto (con su ruta), o nada
// si no tenemos el código: entonces el «dentro» es solo el tratamiento de máquina de su imagen.
export const TRABAJOS = [
  {
    cliente: 'Ava Pastelería', rama: 'Brand', que: 'Web con escena 3D: la tarta se hace mientras bajas',
    imagen: 'assets/proyectos/ava-pasteleria/escritorio.jpg', video: 'assets/proyectos/ava-pasteleria/escritorio.mp4',
    enlace: 'https://preview.ads-partners.com/portfolio/ava-pasteleria/',
    fichero: 'ava-pasteleria/obrador.js',
    codigo: [
      '// Cobertura: se "pinta" de abajo arriba con un plano de corte',
      'const perfilCob = [new THREE.Vector2(0, -0.005),',
      '  new THREE.Vector2(1.055, -0.005), new THREE.Vector2(1.055, 0.75)];',
      'const cobertura = new THREE.Mesh(',
      '  new THREE.LatheGeometry(perfilCob, 72), mCobertura);',
      'tartaHecha.add(cobertura);',
    ],
  },
  {
    cliente: 'Butter Studio', rama: 'Brand', que: 'Web: la mantequilla se tuesta mientras bajas',
    imagen: 'assets/proyectos/butter-studio/escritorio.jpg', video: 'assets/proyectos/butter-studio/escritorio.mp4',
    enlace: 'https://preview.ads-partners.com/portfolio/butter-studio-3d/',
    fichero: 'butter-studio/mantequilla.js',
    codigo: [
      'const seg = (v, a, b) => cl((v - a) / (b - a));',
      'mat.userData.u = { uCoccion: { value: 1 },',
      "  uMasa: { value: new THREE.Color('#E6C88C') },",
      '  uLado: { value: lado } };',
      '// en el shader de la masa:',
      'diffuseColor.rgb = mix(uMasa, diffuseColor.rgb, cocido);',
    ],
  },
  {
    cliente: 'Métele Voltaje', rama: 'Brand', que: 'Web: tu factura de la luz, auditada mientras bajas',
    imagen: 'assets/proyectos/metele-voltaje/escritorio.jpg', video: 'assets/proyectos/metele-voltaje/escritorio.mp4',
    enlace: 'https://preview.ads-partners.com/portfolio/metele-voltaje/',
    fichero: 'metele-voltaje/voltaje.js',
    codigo: [
      '// La factura: 1024 × 1448 (proporción A4).',
      '// Cifras del caso real de Pablo (su imagen en Google).',
      "['Potencia facturada (P1 a P6)', '40 kW × 17 días', '147,43 €'],",
      "['Energía consumida', '3.710,89 kWh × 0,168 €/kWh', '623,43 €'],",
    ],
  },
  {
    cliente: 'Gestión para hostelería', rama: 'Tech', que: 'App: una foto de la factura y el margen de cada plato',
    imagen: 'assets/proyectos/gestion-hosteleria/escritorio.jpg',
    fichero: 'hosteleros-mvp/api/src/routes/recipes.ts',
    codigo: [
      'const zone = zonePriceStatus(rp.sale_price, costPer, vat, targetRatio);',
      '// Sin escandallo o con precios que faltan,',
      '// el margen no es de fiar: en gris.',
      "const marginStatus = cost == null || missingPrices.length",
      "  ? 'incomplete' as const : zone.marginStatus;",
    ],
  },
  {
    cliente: 'Fundación Jiménez Díaz', rama: 'Tech', que: 'Software que mide tejido pulmonar en imágenes',
    imagen: 'assets/proyectos/fundacion-jimenez-diaz/escritorio.jpg',
    fichero: null,
    codigo: null,
  },
];
