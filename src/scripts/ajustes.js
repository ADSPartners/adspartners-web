// Ajustes del visitante: sonido, movimiento y calidad. Se recuerdan en este navegador (si se puede).
const CLAVES = { sonido: 'ads-sonido', movimiento: 'ads-movimiento', calidad: 'ads-calidad' };
const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* modo privado */ } };

export const ajustes = {
  sonido: leer(CLAVES.sonido) || 'no',
  movimiento: document.documentElement.classList.contains('mov-reducido') ? 'reducido' : 'completo',
  calidad: leer(CLAVES.calidad) || 'auto',
};

const oyentes = new Set();
export const alCambiar = (fn) => oyentes.add(fn);

export function fijar(clave, valor) {
  ajustes[clave] = valor;
  guardar(CLAVES[clave], valor);
  sincronizar();
  oyentes.forEach((fn) => fn(clave, valor));
}

function sincronizar() {
  const panel = document.querySelector('[data-ajustes]');
  if (!panel) return;
  for (const [k, v] of Object.entries(ajustes)) {
    const r = panel.querySelector(`input[name="${k}"][value="${v}"]`);
    if (r) r.checked = true;
  }
}

export function montarPanel() {
  const btn = document.querySelector('[data-ajustes-btn]');
  const panel = document.querySelector('[data-ajustes]');
  if (!btn || !panel) return;
  sincronizar();
  const abrir = (si) => { panel.hidden = !si; btn.setAttribute('aria-expanded', String(si)); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); abrir(panel.hidden); });
  document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target)) abrir(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { abrir(false); btn.focus(); } });
  panel.addEventListener('change', (e) => { if (e.target.name) fijar(e.target.name, e.target.value); });
}
