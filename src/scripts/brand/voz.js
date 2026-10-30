// voz.txt. Escribes como una agencia y la marca no lo deja pasar: las palabras que la rompen se subrayan mientras
// escribes y, en cuanto paras, se abre el código: tu frase entre comillas, lo que no somos como comentario (una frase
// del manual por cada cosa que has escrito) y cada palabra rota se borra y se cambia por una de las nuestras. Pilla las
// palabras sueltas y sus variantes («consultoría» sola también, no solo «consultoría 360»), y el artículo concuerda
// («una agencia» → «un equipo»). «ADS PARTNERS» y compañía pasan a «adsPartners». Después del arreglo, debajo queda
// escrito lo que no somos. Si no escribes nada, una sugerencia se escribe y se borra sola, como en FRESA.
import { VOZ, CODIGO } from '../../data/brand.js';

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mayuscula = (s) => s && s[0] !== s[0].toLowerCase();

// Lo que rompe la marca en un texto: [{ i, j, por, no, tipo }], sin solaparse y en orden
export function buscar(texto) {
  const hallados = [];
  const tomar = (re, por, no, tipo) => {
    for (const m of texto.matchAll(re)) {
      const i = m.index, j = i + m[0].length;
      if (tipo === 'nombre' && m[0] === 'adsPartners') continue;
      if (hallados.some((h) => i < h.j && j > h.i)) continue;
      const cambio = typeof por === 'function' ? por(m) : por;
      const bueno = tipo === 'fuera' && cambio && mayuscula(m[0].trimStart().replace(/^,\s*/, '')) ? cambio[0].toUpperCase() + cambio.slice(1) : cambio;
      hallados.push({ i, j, por: bueno, no, tipo });
    }
  };
  tomar(VOZ.nombre, 'adsPartners', VOZ.nombreNo, 'nombre');
  VOZ.fuera.forEach(([re, por, no]) => tomar(re, por, no, 'fuera'));
  return hallados.sort((a, b) => a.i - b.i);
}
// Lo que no somos, sin repetir y en el orden en que lo has escrito (el nombre, primero)
export const noSomos = (hallados) => [...new Set([...hallados]
  .sort((a, b) => (b.tipo === 'nombre') - (a.tipo === 'nombre') || a.i - b.i).map((h) => h.no))];
// La frase arreglada (si se ha borrado algo, sin dobles espacios ni espacio delante de la puntuación)
export const corregir = (texto, hallados) => {
  const t = hallados.reduceRight((s, h) => s.slice(0, h.i) + h.por + s.slice(h.j), texto)
    .replace(/\s{2,}/g, ' ').replace(/\s+([.,;:!?])/g, '$1').replace(/^[\s,]+/, '');
  // (el nombre no se toca: va siempre con la «a» minúscula)
  return mayuscula(texto.trimStart()) && t && !t.startsWith('adsPartners') ? t[0].toUpperCase() + t.slice(1) : t;
};

export function montarVoz(pz, ctx) {
  const { reducido, intento, romper } = ctx;
  const dentro = ctx.dentro('voz');
  const area = pz.querySelector('[data-voz-area]');
  const espejo = pz.querySelector('[data-voz-espejo]');
  const meta = pz.querySelector('[data-pz-meta]');
  const nota = pz.querySelector('[data-voz-nota]');
  let espera = null, tFantasma = null, tNota = null, nSugerencia = 0;

  // El espejo va debajo del campo, con la misma letra y el mismo ancho: pinta los subrayados (o la sugerencia)
  function pintar(texto, { fantasma = false, cursor = false } = {}) {
    const h = buscar(texto);
    let html = '', k = 0;
    h.forEach(({ i, j }) => { html += `${escapar(texto.slice(k, i))}<mark>${escapar(texto.slice(i, j))}</mark>`; k = j; });
    html += escapar(texto.slice(k)) + (cursor ? '<i class="voz__cursor"></i>' : '') + ' ';
    espejo.innerHTML = html;
    espejo.classList.toggle('fantasma', fantasma);
    return h;
  }
  function contar(h) {
    const n = h.length;
    meta.textContent = `${n} ${n === 1 ? 'palabra' : 'palabras'} fuera`;
    meta.classList.toggle('mal', n > 0);
    romper('vocabulario', h.some((x) => x.tipo === 'fuera'));
    romper('nombre', h.some((x) => x.tipo === 'nombre'));
  }

  // Lo que no somos, debajo del campo después del arreglo: se escribe línea a línea y se va en cuanto vuelves a escribir
  function escribirNota(frases) {
    clearTimeout(tNota);
    nota.innerHTML = frases.map(() => '<span class="voz__no"></span>').join('');
    const huecos = [...nota.children];
    let f = 0, k = 0;
    const paso = () => {
      if (f >= frases.length) return;
      huecos[f].textContent = frases[f].slice(0, ++k);
      if (k >= frases[f].length) { f++; k = 0; }
      tNota = setTimeout(paso, reducido ? 0 : 14);
    };
    paso();
  }
  function borrarNota() { clearTimeout(tNota); nota.innerHTML = ''; }

  // --- La sugerencia que se escribe y se borra sola ------------------------------------------------------------
  function pararFantasma() {
    clearTimeout(tFantasma);
    tFantasma = null;
    if (espejo.classList.contains('fantasma')) pintar(area.value);
  }
  function fantasma() {
    if (reducido) return;
    const s = VOZ.sugerencias[nSugerencia++ % VOZ.sugerencias.length];
    let k = 0;
    const libre = () => !area.value && document.activeElement !== area && !dentro.ocupado();
    const escribe = () => {
      if (!libre()) { pararFantasma(); return; }
      pintar(s.slice(0, ++k), { fantasma: true, cursor: true });
      tFantasma = setTimeout(k < s.length ? escribe : borra, k < s.length ? 42 + Math.random() * 40 : 2400);
    };
    const borra = () => {
      if (!libre()) { pararFantasma(); return; }
      pintar(s.slice(0, --k), { fantasma: true, cursor: true });
      tFantasma = setTimeout(k > 0 ? borra : fantasma, k > 0 ? 14 : 700);
    };
    escribe();
  }

  // --- Escribir y defenderse ----------------------------------------------------------------------------------
  area.addEventListener('focus', pararFantasma);
  area.addEventListener('blur', () => { if (!area.value && !tFantasma) tFantasma = setTimeout(fantasma, 1400); });
  area.addEventListener('input', () => {
    pararFantasma();
    borrarNota();
    // Sin saltos de línea: es un titular
    if (area.value.includes('\n')) area.value = area.value.replace(/\n/g, ' ');
    const h = pintar(area.value);
    contar(h);
    ctx.gesto();
    clearTimeout(espera);
    if (h.length) espera = setTimeout(defender, 1400);
  });
  area.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') return;
    ev.preventDefault();
    clearTimeout(espera);
    defender();
  });

  async function defender() {
    const texto = area.value;
    const h = buscar(texto);
    if (!h.length || dentro.ocupado()) return;
    intento();
    area.readOnly = true;
    const lineas = CODIGO.voz(texto);
    const pre = lineas[1].indexOf('"') + 1;
    const bien = corregir(texto, h);
    // Lo que no somos (dos como mucho, que se lean): en el código, como comentario, y después debajo del campo
    const no = noSomos(h).slice(0, 2);
    const hecho = await dentro.porDentro({
      lineas,
      comentario: { en: 1, texto: no.map((n) => `// ${n}`) },
      cambios: h.map((x) => ({ l: 1, i: pre + x.i, j: pre + x.j, por: x.por })),
      alVolver() {
        area.value = bien;
        contar(pintar(bien));
        escribirNota(no);
      },
    });
    area.readOnly = false;
    if (!hecho) contar(pintar(area.value));
  }

  return {
    empezar() { if (!area.value) tFantasma = setTimeout(fantasma, 600); },
  };
}
