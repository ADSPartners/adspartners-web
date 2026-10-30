// Brand, «El manual vivo»: el montaje de la mesa.
// - La hora de Madrid y la barra de estado: intentos, conseguidos (que no se mueve nunca) y las reglas en su sitio, en
//   vivo (bajan mientras algo está roto).
// - La entrada: la mesa empieza por dentro, todo código, y una línea la pasa a marca (en el móvil, pieza a pieza).
// - Con el ratón, la mesa se mueve un poco, cada pieza a su profundidad; quieto, el inspector abre cajas.
// - La primera vez, si no tocas nada, una mano fantasma tira del logo y se ven los tres tiempos.
// - Cada pieza se rompe a su manera (brand/logo, color, letra y voz); lo que es de toda la marca (un color, la letra)
//   lo arregla una línea que cruza la mesa entera.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { REGLAS, COMENTARIOS, MESA, remate } from '../data/brand.js';
import { crearDentro, barridoMesa } from './brand/dentro.js';

const dos = (n) => String(n).padStart(2, '0');

export function montarBrand({ reducido, conRaton, cursor }) {
  const raiz = document.querySelector('[data-brand]');
  const mesa = raiz?.querySelector('[data-mesa]');
  if (!mesa) return;
  const movil = matchMedia('(max-width: 760px)');

  const hora = document.querySelector('[data-bm-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const ponerHora = () => { if (hora) hora.textContent = reloj.format(new Date()); };
  ponerHora();
  setInterval(ponerHora, 20000);

  // --- La barra de estado ------------------------------------------------------------------------------------------
  const estado = mesa.querySelector('[data-estado]');
  const cifra = estado.querySelector('[data-intentos]');
  const reglas = estado.querySelector('[data-reglas]');
  const pista = estado.querySelector('[data-pista]');
  const remateEl = raiz.querySelector('[data-bm-remate]');
  const rotas = new Set();
  let intentos = 0, finDicho = false;
  const vistos = {};
  const salta = (el) => { el.classList.remove('salta'); void el.offsetWidth; el.classList.add('salta'); };

  function romper(regla, si) {
    const antes = rotas.size;
    if (si) rotas.add(regla); else rotas.delete(regla);
    if (rotas.size === antes) return;
    reglas.textContent = `${REGLAS.length - rotas.size}/${REGLAS.length}`;
    reglas.classList.toggle('mal', rotas.size > 0);
    salta(reglas);
  }
  function intento() {
    intentos++;
    cifra.textContent = dos(intentos);
    salta(cifra);
    sonido.tecla(0.8);
    if (remateEl) remateEl.textContent = remate(intentos);
  }
  // La regla que entra como comentario: rotan por tipo, y el sexto intento se lleva la de «ya has visto que no se rompe»
  function comentario(tipo) {
    if (intentos >= 6 && !finDicho) { finDicho = true; return COMENTARIOS.fin; }
    const lista = COMENTARIOS[tipo];
    vistos[tipo] = (vistos[tipo] ?? -1) + 1;
    return lista[vistos[tipo] % lista.length];
  }

  // --- Las piezas ---------------------------------------------------------------------------------------------------
  const dentros = {};
  mesa.querySelectorAll('[data-pz]').forEach((pz) => { dentros[pz.dataset.pz] = crearDentro(pz, { reducido }); });
  const objetivos = (extra = {}) => [...mesa.querySelectorAll('[data-mesa-pieza]')].map((el) => ({ el, dentro: dentros[el.dataset.pz], ...extra }));

  // Lo que es de toda la marca (variables en main.bm) se arregla con la línea que cruza la mesa. Cada pieza se queda
  // con el valor roto hasta que la línea llega a ella; el fondo roto (el beige) se va quedando detrás
  async function restaurar(vars) {
    const malos = {};
    vars.forEach((v) => { malos[v] = raiz.style.getPropertyValue(v); raiz.style.removeProperty(v); });
    const lista = objetivos({ alPasar: (el) => vars.forEach((v) => el.style.removeProperty(v)) });
    lista.forEach(({ el }) => vars.forEach((v) => { if (malos[v]) el.style.setProperty(v, malos[v]); }));
    sonido.ok();
    mesa.classList.add('barriendo');
    await barridoMesa(mesa, { objetivos: lista, eje: movil.matches ? 'y' : 'x', velo: malos['--crema'] || null, duracion: 1.15, reducido });
    mesa.classList.remove('barriendo');
  }

  // Si estás haciendo algo, el inspector espera y la mesa no se mueve bajo el dedo
  // (ultimo: cualquier cosa, también mover el ratón; gesto: pulsar, tocar, escribir o la rueda)
  const ocupado = { tirando: false, ultimo: performance.now(), gesto: 0 };
  const actividad = () => { ocupado.ultimo = performance.now(); };
  const gesto = () => { ocupado.ultimo = ocupado.gesto = performance.now(); };
  const ctx = {
    reducido, conRaton, cursor, mesa, raiz, movil, intento, romper, comentario, restaurar, actividad, gesto,
    quieto: () => performance.now() - ocupado.ultimo,
    dentro: (id) => dentros[id],
    tirando(si) { ocupado.tirando = si; gesto(); },
    ocupado: () => ocupado.tirando || Object.values(dentros).some((d) => d.ocupado()) || mesa.classList.contains('barriendo'),
  };

  // La pista de abajo y la frase del cursor cambian con la pieza que tienes debajo
  mesa.querySelectorAll('[data-pz]').forEach((pz) => {
    pz.addEventListener('pointerenter', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      pista.textContent = MESA.pistas[pz.dataset.pz] || MESA.pista;
      if (!ocupado.tirando && pz.dataset.pzCursor) cursor.decir(pz.dataset.pzCursor);
    });
    pz.addEventListener('pointerleave', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      pista.textContent = MESA.pista;
      if (!ocupado.tirando) cursor.decir('');
    });
  });

  // En el móvil, la barra de estado va fija abajo solo mientras se ve la mesa
  new IntersectionObserver(([e]) => estado.classList.toggle('on', e.isIntersecting), { threshold: 0.05 }).observe(mesa);

  // --- Paralaje: cada pieza a su profundidad, solo con ratón y nunca mientras tiras de algo ------------------------
  if (conRaton && !reducido) {
    const capas = [...mesa.querySelectorAll('[data-prof]')].map((el) => ({
      k: Number(el.dataset.prof) || 1,
      x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }),
    }));
    addEventListener('pointermove', (ev) => {
      if (ev.pointerType !== 'mouse' || movil.matches) return;
      actividad();
      if (ocupado.tirando) return;
      const nx = ev.clientX / innerWidth - 0.5, ny = ev.clientY / innerHeight - 0.5;
      capas.forEach((c) => { c.x(-nx * 18 * c.k); c.y(-ny * 10 * c.k); });
    }, { passive: true });
  }
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, gesto, { passive: true }));

  // --- La entrada: de código a marca --------------------------------------------------------------------------------
  async function entrada() {
    if (reducido) { mesa.classList.add('lista'); return; }
    await Promise.race([document.fonts?.ready, new Promise((ok) => setTimeout(ok, 1200))]);
    // Toma el control de lo que hacía el CSS: cada pieza, todo código; la cabecera y la barra, tapadas
    Object.values(dentros).forEach((d) => d.poner(0, false));
    const revela = [...mesa.querySelectorAll('[data-mesa-revela]')];
    revela.forEach((el) => { el.style.clipPath = movil.matches ? '' : 'inset(-20px 100% -20px -20px)'; });
    mesa.classList.add('lista');
    if (movil.matches) {
      // Pieza a pieza, cuando se ve: la línea la cruza y queda la marca
      Object.values(dentros).forEach((d) => {
        const io = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const st = { p: 0 };
          gsap.to(st, { p: 1, duration: 0.9, delay: 0.15, ease: 'power1.inOut', onUpdate: () => d.poner(st.p, false) });
        }, { threshold: 0.45 });
        io.observe(d.pz);
      });
      await new Promise((ok) => setTimeout(ok, 1100));
      return;
    }
    mesa.classList.add('barriendo');
    await new Promise((ok) => setTimeout(ok, 450));
    sonido.pasa(0.5);
    await barridoMesa(mesa, { objetivos: objetivos().map((o) => ({ ...o, revela: o.el.hasAttribute('data-mesa-revela') })), duracion: 1.6, reducido });
    mesa.classList.remove('barriendo');
  }

  // --- Cada pieza, y lo que la mantiene viva -------------------------------------------------------------------------
  const piezas = {};
  const cargas = [
    ['logo', () => import('./brand/logo.js').then((m) => m.montarLogo(mesa.querySelector('[data-bl]'), ctx))],
    ['color', () => import('./brand/color.js').then((m) => m.montarColor(mesa.querySelector('[data-pz="paleta"]'), ctx))],
    ['letra', () => import('./brand/letra.js').then((m) => m.montarLetra(mesa.querySelector('[data-pz="letra"]'), ctx))],
    ['voz', () => import('./brand/voz.js').then((m) => m.montarVoz(mesa.querySelector('[data-pz="voz"]'), ctx))],
  ];
  const listas = Promise.all(cargas.map(async ([id, cargar]) => {
    try { piezas[id] = await cargar(); } catch (err) { console.warn(`Pieza sin efectos (${id}):`, err); }
  }));

  (async () => {
    await entrada();
    await listas;
    Object.values(piezas).forEach((p) => p?.empezar?.());
    // La primera vez, si en un rato no has tocado nada, la mano fantasma tira del logo
    if (!reducido && piezas.logo?.demo) {
      const mirar = () => {
        if (intentos > 0) return;   // ya has roto algo tú: no hace falta enseñártelo
        if (performance.now() - ocupado.gesto > 1500 && !ctx.ocupado() && piezas.logo.demo()) return;
        setTimeout(mirar, 500);
      };
      setTimeout(mirar, 900);
    }
    try {
      const { montarInspector } = await import('./brand/inspector.js');
      montarInspector(mesa, ctx);
    } catch (err) { console.warn('Inspector sin efectos:', err); }
  })();
}
