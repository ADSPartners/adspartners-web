// El código que pinta cada pieza de la mesa, en HTML: una línea por fila (el número lo pone el CSS), los comentarios
// más apagados y, si se está reescribiendo, el trozo marcado y el cursor. Lo usan la página (al compilar) y
// brand/dentro.js (en vivo), así que no toca el DOM.

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const esComentario = (s) => /^\s*(\/\/|\/\*|<!--)/.test(s);

// marca: [desde, hasta) dentro de la línea; cursor: se pinta al final de lo marcado
export function lineaHTML(texto, marca = null, cursor = false) {
  const clase = `cod__l${esComentario(texto) ? ' cod__c' : ''}`;
  if (!marca) return `<span class="${clase}">${escapar(texto) || ' '}</span>`;
  const [i, j] = marca;
  return `<span class="${clase}">${escapar(texto.slice(0, i))}<mark>${escapar(texto.slice(i, j))}</mark>${cursor ? '<i class="cod__cursor"></i>' : ''}${escapar(texto.slice(j))}</span>`;
}

export const codigoHTML = (lineas) => lineas.map((l) => lineaHTML(l)).join('');
