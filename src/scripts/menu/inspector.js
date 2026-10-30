// Menú, versión «inspector»: cada página es una caja como las del inspector de la portada. Al abrir, las cajas se
// abren desde su línea del medio (como una persiana), una detrás de otra, y su etiqueta rosa se escribe a máquina.
// Cada caja dice lo que mide de verdad (su tamaño en píxeles, que se pone al día si cambia). Al pinchar, la caja crece
// hasta ocupar la pantalla y entra en la página; Brand, aún en obras, se niega con una sacudida.
import { gsap } from 'gsap';

export function crear(raiz, { datos, reducido, sonido, ir }) {
  const cajas = [...raiz.querySelectorAll('[data-mi-caja]')].map((el) => ({
    el,
    p: datos.find((d) => d.slug === el.dataset.slug),
    etq: el.querySelector('[data-mi-etq]'),
    medida: el.querySelector('[data-mi-medida]'),
    t: null,
  }));

  const escribir = (c, texto, demora = 0) => {
    clearTimeout(c.t);
    if (reducido) { c.etq.textContent = texto; return; }
    let n = 0;
    c.etq.textContent = '';
    const paso = () => { c.etq.textContent = texto.slice(0, ++n); if (n < texto.length) c.t = setTimeout(paso, 14); };
    c.t = setTimeout(paso, demora);
  };

  // Lo que mide cada caja, al día
  const medir = () => cajas.forEach((c) => {
    const r = c.el.getBoundingClientRect();
    c.medida.textContent = `${Math.round(r.width)} × ${Math.round(r.height)} px`;
  });
  const ro = new ResizeObserver(medir);
  cajas.forEach((c) => ro.observe(c.el));

  cajas.forEach((c, i) => {
    c.el.addEventListener('pointerenter', () => sonido.tic(0.6 + (i % 3) * 0.1));
    c.el.addEventListener('click', (e) => {
      e.preventDefault();
      if (!c.p.ruta) {
        escribir(c, 'en obras · llega pronto');
        if (!reducido) gsap.fromTo(c.el, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        return;
      }
      crecer(c);
    });
  });

  // La caja crece hasta ser la página: una copia fija que va de su sitio a toda la pantalla, y entonces se navega
  function crecer(c) {
    if (c.p.ruta.startsWith('#')) { ir(c.p); return; }
    const r = c.el.getBoundingClientRect();
    const capa = document.createElement('div');
    capa.className = 'mi__crece';
    capa.innerHTML = '<span class="insp"></span>';
    const etq = capa.firstChild;
    etq.textContent = `cargando /${c.p.ruta} …`;
    Object.assign(capa.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.append(capa);
    sonido.viaje(0.9, 1);
    if (reducido) { ir(c.p); return; }
    gsap.to(capa, {
      left: 0, top: 0, width: innerWidth, height: innerHeight, duration: 0.75, ease: 'power3.inOut',
      onComplete: () => ir(c.p),
    });
  }

  return {
    abrir() {
      medir();
      cajas.forEach((c, i) => {
        if (reducido) { escribir(c, c.etq.dataset.texto); return; }
        // Al acabar se quita el recorte: la etiqueta y la medida van por fuera de la caja
        gsap.fromTo(c.el, { clipPath: 'inset(50% 0% 50% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out', delay: 0.12 + i * 0.09, clearProps: 'clipPath',
          onStart: () => sonido.tic(0.5 + i * 0.1),
        });
        gsap.fromTo(c.el.querySelectorAll('.mi__nombre, .mi__frase, .mi__datos div'), { opacity: 0, y: 10 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, delay: 0.3 + i * 0.09,
        });
        escribir(c, c.etq.dataset.texto, 380 + i * 90);
      });
    },
    cerrar() {
      cajas.forEach((c) => { clearTimeout(c.t); c.etq.textContent = ''; });
    },
  };
}
