// El título de la portada ocupa el ancho disponible: en escritorio una línea, en móvil «ads» / «Partners».
// Lo usan las tres ideas (en la del pincel, además, el WebGL lo repinta encima).
export function ajustarTitulo(h1, movil = innerWidth <= 760) {
  if (!h1) return;
  h1.style.fontSize = '';
  const fs = parseFloat(getComputedStyle(h1).fontSize);
  const anchos = [...h1.querySelectorAll('[data-trozo]')].map((t) => {
    const r = document.createRange(); r.selectNodeContents(t.firstChild);
    return r.getBoundingClientRect().width;
  });
  const ancho = movil ? Math.max(...anchos) : anchos.reduce((a, b) => a + b, 0);
  if (ancho > 0) h1.style.fontSize = `${(fs * h1.clientWidth / ancho) * 0.985}px`;
}
