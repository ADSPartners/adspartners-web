// Lo único que elige el visitante es el sonido: las barras de la cabecera lo encienden y lo callan.
// La calidad es automática (la mide la portada) y el movimiento lo decide el sistema (prefers-reduced-motion).
const CLAVE = 'ads-sonido';
const leer = () => { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } };
const guardar = (v) => { try { localStorage.setItem(CLAVE, v); } catch (e) { /* modo privado */ } };

export const ajustes = {
  sonido: leer() || 'no',
  movimiento: document.documentElement.classList.contains('mov-reducido') ? 'reducido' : 'completo',
};

const oyentes = new Set();
export const alCambiar = (fn) => oyentes.add(fn);

export function fijarSonido(valor) {
  ajustes.sonido = valor;
  guardar(valor);
  pintarBoton();
  oyentes.forEach((fn) => fn('sonido', valor));
}

function pintarBoton() {
  const btn = document.querySelector('[data-sonido-btn]');
  if (!btn) return;
  const si = document.documentElement.classList.contains('sonido-on');
  btn.setAttribute('aria-pressed', String(si));
  btn.setAttribute('aria-label', si ? 'Quitar el sonido' : 'Poner el sonido');
  const txt = btn.querySelector('[data-sonido-txt]');
  if (txt) txt.textContent = si ? 'Sonido sí' : 'Sonido no';
}

// Un clic en las barras: si suena, se calla; si no, suena. El estado real lo da la clase sonido-on.
export function montarBotonSonido() {
  const btn = document.querySelector('[data-sonido-btn]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const si = document.documentElement.classList.contains('sonido-on');
    fijarSonido(si ? 'no' : 'si');
  });
  // sonido.js pone y quita la clase; el botón se repinta cuando cambia
  new MutationObserver(pintarBoton).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  pintarBoton();
}
