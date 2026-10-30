// letra.css. Las tentaciones: Comic Sans, Papyrus, Impact o Arial (salen las cuatro primeras que tenga tu dispositivo:
// se mide). Al pulsar una, todos los titulares de la mesa cambian de letra, porque es la variable de verdad (--titular).
// Un momento después se abre el código de la letra, la familia rota se reescribe y la línea cruza la mesa dejándolo
// todo en Apple Garamond.
import * as sonido from '../sonido.js';
import { TENTACIONES, CODIGO } from '../../data/brand.js';

const GENERICAS = ['cursive', 'fantasy', 'serif', 'sans-serif', 'monospace'];
const familia = (f) => (GENERICAS.includes(f) ? f : `"${f}"`);

// Una letra está si, pedida delante de una de reserva, mide distinto que la reserva sola
function tiene(f) {
  const c = document.createElement('canvas').getContext('2d');
  const prueba = 'adsPartners mWil 0123';
  return ['monospace', 'serif'].some((reserva) => {
    c.font = `72px ${reserva}`;
    const base = c.measureText(prueba).width;
    c.font = `72px ${familia(f)}, ${reserva}`;
    return Math.abs(c.measureText(prueba).width - base) > 0.5;
  });
}

export function montarLetra(pz, ctx) {
  const { reducido, intento, romper, comentario, restaurar, raiz, mesa } = ctx;
  const dentro = ctx.dentro('letra');
  const caja = pz.querySelector('[data-letra-chips]');
  const elegidas = TENTACIONES.filter(tiene).slice(0, 4);
  let espera = null;

  const botones = elegidas.map((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'letra__chip';
    b.textContent = f;
    b.style.fontFamily = familia(f);
    b.addEventListener('click', () => probar(f, b));
    b.addEventListener('pointerenter', () => sonido.tic(0.5));
    caja.appendChild(b);
    return b;
  });

  function probar(f, b) {
    if (mesa.classList.contains('barriendo')) return;
    dentro.cancelar();
    clearTimeout(espera);
    botones.forEach((o) => o.classList.toggle('on', o === b));
    raiz.style.setProperty('--titular', `${familia(f)}, sans-serif`);
    romper('titular', true);
    intento();
    sonido.rompe();
    ctx.gesto();
    // Un momento para verlo (y reírse), y se defiende
    espera = setTimeout(() => defender(f), reducido ? 1200 : 1100);
  }

  async function defender(f) {
    const lineas = CODIGO.letra(familia(f));
    const s = lineas[1];
    const hecho = await dentro.porDentro({
      lineas,
      comentario: { en: 1, texto: `/* ${comentario('letra')} */` },
      cambios: [{ l: 1, i: s.indexOf(':') + 2, j: s.length - 1, por: "'Apple Garamond', serif" }],
      volver: false,
    });
    if (!hecho) return;
    await restaurar(['--titular']);
    romper('titular', false);
    botones.forEach((o) => o.classList.remove('on'));
  }
}
