// voz.txt. Escribes como una agencia y la marca no lo deja pasar: las palabras que la rompen (las del manual) se
// subrayan mientras escribes y, en cuanto paras, se abre el código: tu frase entre comillas, la regla como comentario,
// y cada palabra rota se borra y se cambia por una de las nuestras. «ADS PARTNERS» y compañía pasan a «adsPartners».
// Si no escribes nada, una sugerencia se escribe y se borra sola, como en FRESA.
import { VOZ, CODIGO } from '../../data/brand.js';

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mayuscula = (s) => s && s[0] !== s[0].toLowerCase();

// Lo que rompe la marca en un texto: [{ i, j, por, tipo }], sin solaparse y en orden
export function buscar(texto) {
  const hallados = [];
  const tomar = (re, por, tipo) => {
    for (const m of texto.matchAll(re)) {
      const i = m.index, j = i + m[0].length;
      if (tipo === 'nombre' && m[0] === 'adsPartners') continue;
      if (hallados.some((h) => i < h.j && j > h.i)) continue;
      const cambio = typeof por === 'function' ? por(m) : por;
      const bueno = tipo === 'fuera' && mayuscula(m[0]) ? cambio[0].toUpperCase() + cambio.slice(1) : cambio;
      hallados.push({ i, j, por: bueno, tipo });
    }
  };
  tomar(VOZ.nombre, 'adsPartners', 'nombre');
  VOZ.fuera.forEach(([re, por]) => tomar(re, por, 'fuera'));
  return hallados.sort((a, b) => a.i - b.i);
}
const corregir = (texto, hallados) => hallados.reduceRight((t, h) => t.slice(0, h.i) + h.por + t.slice(h.j), texto);

export function montarVoz(pz, ctx) {
  const { reducido, intento, romper, comentario } = ctx;
  const dentro = ctx.dentro('voz');
  const area = pz.querySelector('[data-voz-area]');
  const espejo = pz.querySelector('[data-voz-espejo]');
  const meta = pz.querySelector('[data-pz-meta]');
  let espera = null, tFantasma = null, nSugerencia = 0;

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
    const hecho = await dentro.porDentro({
      lineas,
      comentario: { en: 1, texto: `// ${comentario(h.some((x) => x.tipo === 'nombre') ? 'nombre' : 'voz')}` },
      cambios: h.map((x) => ({ l: 1, i: pre + x.i, j: pre + x.j, por: x.por })),
      alVolver() {
        area.value = bien;
        contar(pintar(bien));
      },
    });
    area.readOnly = false;
    if (!hecho) contar(pintar(area.value));
  }

  return {
    empezar() { if (!area.value) tFantasma = setTimeout(fantasma, 600); },
  };
}
