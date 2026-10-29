// La carta del contacto: los huecos crecen con lo que se escribe, una opción de «qué quieres», la posdata de
// privacidad y «Enviar la carta», que la manda al webhook de n8n (nos avisa por correo). Si falla, el correo directo.
import { gsap } from 'gsap';
import * as sonido from '../sonido.js';

const WEBHOOK = 'https://n8n.ads-partners.com/webhook/ads-contacto';
const QUE = { marca: 'mejorar mi marca', web: 'una web nueva', automatizar: 'automatizar algo', 'no-lo-se': 'aún no lo sé' };

export function montar(sec, { reducido }) {
  const form = sec.querySelector('[data-ct-form]');
  const estado = sec.querySelector('[data-ct-estado]');
  const sello = sec.querySelector('[data-ct-sello]');
  const ok = form.querySelector('.ct__enviar');
  const acepto = form.querySelector('[name="acepto"]');

  // Cada hueco mide lo que su texto (o su pista), medido con su propia letra
  const regla = document.createElement('canvas').getContext('2d');
  const crecer = (inp) => {
    const cs = getComputedStyle(inp);
    regla.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ancho = regla.measureText(inp.value || inp.placeholder).width;
    inp.style.width = `${Math.ceil(ancho + parseFloat(cs.fontSize) * 0.45)}px`;
  };
  const huecos = [...form.querySelectorAll('[data-ct-crece]')];
  // La cota de la casilla de la posdata dice su medida real en pantalla (el cuadrado es 28 de las 40 del dibujo)
  const caja = form.querySelector('.ct__pd-caja');
  const medida = form.querySelector('[data-ct-medida]');
  const medirTodos = () => {
    huecos.forEach(crecer);
    if (caja && medida) medida.textContent = String(Math.round((caja.getBoundingClientRect().width * 28) / 40));
  };
  huecos.forEach((inp) => inp.addEventListener('input', () => { crecer(inp); inp.removeAttribute('aria-invalid'); sonido.tecla(0.5); }));
  medirTodos();
  document.fonts.ready.then(medirTodos);
  addEventListener('resize', medirTodos);

  // «Os escribo porque quiero…»: una sola opción, que se puede quitar
  let interes = '';
  const ops = [...form.querySelectorAll('[data-ct-op]')];
  ops.forEach((b) => b.addEventListener('click', () => {
    interes = interes === b.dataset.ctOp ? '' : b.dataset.ctOp;
    ops.forEach((o) => o.setAttribute('aria-checked', String(o.dataset.ctOp === interes)));
    sonido.tic(0.8);
  }));

  acepto.addEventListener('change', () => { acepto.closest('label').classList.remove('invalido'); if (acepto.checked) sonido.tecla(1); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.classList.contains('enviada')) return;
    const f = new FormData(form);
    const datos = {
      name: String(f.get('name') || '').trim(),
      company: String(f.get('company') || '').trim(),
      interest: interes ? QUE[interes] : '',
      email: String(f.get('email') || '').trim(),
      phone: String(f.get('phone') || '').trim(),
      website: String(f.get('website') || ''),
      source: 'ads-partners.com/v5',
      page: location.href,
    };
    // Lo mínimo: nombre, un correo que parezca correo y la casilla
    const fallos = [];
    if (!datos.name) fallos.push(form.querySelector('[name="name"]'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email)) fallos.push(form.querySelector('[name="email"]'));
    fallos.forEach((inp) => inp.setAttribute('aria-invalid', 'true'));
    if (!acepto.checked) acepto.closest('label').classList.add('invalido');
    if (fallos.length || !acepto.checked) {
      estado.textContent = fallos.length ? 'Falta tu nombre o un correo para contestarte.' : 'Falta marcar la casilla de privacidad.';
      (fallos[0] || acepto).focus();
      return;
    }

    ok.disabled = true;
    estado.textContent = 'Enviando…';
    try {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.classList.add('enviada');
      sonido.ok();
      estado.textContent = `Gracias, ${datos.name.split(' ')[0]}. Te escribimos pronto.`;
      if (!reducido) gsap.fromTo(sello, { opacity: 0, scale: 2.2, rotate: -4 }, { opacity: 1, scale: 1, rotate: -12, duration: 0.45, ease: 'back.out(2)' });
      else gsap.set(sello, { opacity: 1, scale: 1 });
    } catch (err) {
      ok.disabled = false;
      const asunto = encodeURIComponent(`Hola, soy ${datos.name}`);
      const cuerpo = encodeURIComponent(`Me llamo ${datos.name}${datos.company ? ` y trabajo en ${datos.company}` : ''}. ${datos.interest ? `Quiero ${datos.interest}. ` : ''}Mi correo: ${datos.email}${datos.phone ? ` · Teléfono: ${datos.phone}` : ''}`);
      estado.innerHTML = `No ha salido. Mándanoslo por <a href="mailto:adsgroup@ads-partners.com?subject=${asunto}&body=${cuerpo}">correo</a> y lo vemos igual.`;
    }
  });
}
