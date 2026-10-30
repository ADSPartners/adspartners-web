// Los textos grandes notan el ratón (como en Emotion), pero solo en la zona por la que pasa: si pasa deprisa cerca,
// esas letras se descomponen en rojo y azul y se van un poco hacia donde va, y vuelven a su sitio con un muelle. El
// resto del texto no se mueve. Quieto, no hay nada. Solo con ratón; el motor, letra a letra, está en letras.js.
// Se marcan con data-vivo; el aspecto está en global.css (html.con-raton [data-vivo] .vivo-on).
import { letrasQueNotan } from './letras.js';

export function montarVivo() {
  letrasQueNotan([...document.querySelectorAll('[data-vivo]')], {
    velMax: 2200,
    radio: (fs) => Math.min(170, Math.max(56, fs * 1.7)),   // px alrededor del ratón en los que aún se nota
    pintar(l, k) {
      if (!l.classList.contains('vivo-on')) l.classList.add('vivo-on');
      l.style.setProperty('--vivo', k.toFixed(3));
      // El rojo y el azul aparecen poco a poco (con la letra casi quieta se sumarían encima y brillaría de más)
      l.style.setProperty('--vivo-a', Math.min(1, Math.abs(k) * 3).toFixed(2));
    },
    apagar(l) {
      l.classList.remove('vivo-on');
      l.style.removeProperty('--vivo');
      l.style.removeProperty('--vivo-a');
    },
  });
}
