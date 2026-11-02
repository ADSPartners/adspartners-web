// El aviso de consentimiento (components/Consentimiento.astro). Si ya elegiste (y no han pasado los meses de
// data/rastreo.js), se aplica lo que elegiste sin preguntar; si no, la nota sale cuando acaba la carga (en la home) o
// al poco de llegar (en las demás). Desde Cookies se vuelve a abrir (evento «ads:elegir») y, si allí se borra todo
// («ads:consentimiento-borrado»), se retira el permiso y se vuelve a preguntar.
import { cargarMedicion, cargarCampanas, retirar } from './rastreo.js';
import * as sonido from './sonido.js';

export function montarConsentimiento() {
  const el = document.querySelector('[data-consentimiento]');
  if (!el) return;
  const cfg = {
    ga4: el.dataset.ga4 || '', pixel: el.dataset.pixel || '', demo: el.dataset.demo === '1',
    medicion: el.dataset.medicion === '1', campanas: el.dataset.campanas === '1',
    clave: el.dataset.clave, version: Number(el.dataset.version), meses: Number(el.dataset.meses),
  };
  const casillas = el.querySelector('[data-cons-casillas]');
  const elegir = el.querySelector('[data-cons="elegir"]');

  const leer = () => {
    try {
      const c = JSON.parse(localStorage.getItem(cfg.clave));
      const caduca = c && c.t + cfg.meses * 30.44 * 864e5;
      return c && c.v === cfg.version && Date.now() < caduca ? c : null;
    } catch (e) { return null; }
  };

  function aplicar(c) {
    if (c.medicion) cargarMedicion(cfg.ga4, cfg.demo);
    if (c.campanas) cargarCampanas(cfg.pixel, cfg.demo);
    retirar({ ga4: cfg.ga4, medicion: c.medicion, campanas: c.campanas });
  }

  function guardar(medicion, campanas) {
    const c = { v: cfg.version, medicion: cfg.medicion && medicion, campanas: cfg.campanas && campanas, t: Date.now() };
    try { localStorage.setItem(cfg.clave, JSON.stringify(c)); } catch (e) { /* modo privado: vale para esta visita */ }
    aplicar(c);
    document.dispatchEvent(new CustomEvent('ads:consentimiento', { detail: c }));
    ocultar();
  }

  function mostrar({ detalle = false } = {}) {
    const c = leer();
    el.querySelectorAll('[data-cons-op]').forEach((i) => { i.checked = Boolean(c && c[i.dataset.consOp]); });
    abrirDetalle(detalle);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('es-visible'));
  }
  function ocultar() {
    el.classList.remove('es-visible');
    setTimeout(() => { if (!el.classList.contains('es-visible')) el.hidden = true; }, 500);
  }
  function abrirDetalle(si) {
    casillas.hidden = !si;
    elegir.setAttribute('aria-expanded', String(si));
    elegir.textContent = si ? 'Guardar' : 'Elegir';
  }

  el.querySelector('[data-cons="si"]').addEventListener('click', () => { sonido.ok(); guardar(true, true); });
  el.querySelector('[data-cons="no"]').addEventListener('click', () => { sonido.tic(0.8); guardar(false, false); });
  elegir.addEventListener('click', () => {
    if (casillas.hidden) { abrirDetalle(true); el.querySelector('[data-cons-op]')?.focus(); return; }
    const op = (id) => Boolean(el.querySelector(`[data-cons-op="${id}"]`)?.checked);
    guardar(op('medicion'), op('campanas'));
  });
  document.addEventListener('ads:elegir', () => mostrar({ detalle: true }));
  document.addEventListener('ads:consentimiento-borrado', () => {
    retirar({ ga4: cfg.ga4, medicion: false, campanas: false });
    mostrar();
  });

  const elegido = leer();
  if (elegido) { aplicar(elegido); return; }

  // Sin elegir: la nota sale cuando acaba la carga de la home (nunca encima del umbral) o al poco de llegar
  const html = document.documentElement;
  const despues = () => setTimeout(() => { if (!leer()) mostrar(); }, 1400);
  if (!html.classList.contains('en-umbral')) { despues(); return; }
  const obs = new MutationObserver(() => {
    if (!html.classList.contains('en-umbral')) { obs.disconnect(); despues(); }
  });
  obs.observe(html, { attributes: true, attributeFilter: ['class'] });
}
