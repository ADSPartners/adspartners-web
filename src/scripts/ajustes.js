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

// Lo elegido en el umbral, recordado igual que lo de las barras (sin avisar: quien entra ya lo enciende o no)
export function recordarSonido(valor) {
  ajustes.sonido = valor;
  guardar(valor);
}

// Al cargar una página: si el sonido estaba encendido, sigue (se enciende cuando el navegador está libre; si no deja
// sin un gesto, sonido.js lo arranca con el primero y hasta entonces el botón dice «off»)
export function seguirSonido(encender) {
  if (ajustes.sonido !== 'si') return;
  (window.requestIdleCallback || ((f) => setTimeout(f, 300)))(() => encender(), { timeout: 1500 });
}

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
  if (txt) txt.textContent = si ? 'Sonido on' : 'Sonido off';
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
