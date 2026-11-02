// Brand, «Desmontada»: el montaje. La pila de cinco planchas (pages/brand) y lo que la mueve:
// - El scroll: arriba, el ads terminado y de frente; al bajar, la pila se pone en vista técnica, se abre, se recorre
//   capa a capa (la que toca sale un poco hacia un lado, con su cota y su regla) y al final se vuelve a montar.
// - El ratón (Álvaro: «algo más de movimiento al movimiento del ratón»): la pila se ladea hacia él con un muelle que
//   rebota un poco, cada plancha se desplaza según su profundidad, la que tienes debajo se levanta, un brillo recorre
//   la marca y, quieto, todo flota un poco. Se puede coger la pila y girarla; al soltarla sigue por inercia y vuelve.
// - El juego de cada plancha («un poco más de juego»): la forma no se deja estirar, la marca toma el color por el que
//   pasas, el titular se pone la letra que eliges y la frase de agencia se corrige sola.
// Debajo, el cierre, que entra al verse.
import { gsap } from 'gsap';
import * as sonido from './sonido.js';
import { CAPAS, PALETA, LETRAS, VOZ, PORTADA } from '../data/brand.js';

const liso = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const cursiva = (s) => s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
// Un muelle: la velocidad tira hacia el objetivo (rigidez k) y se frena (c); con c bajo, rebota un poco
const muelle = (s, objetivo, dt, k = 70, c = 11) => { s.v += ((objetivo - s.x) * k - s.v * c) * dt; s.x += s.v * dt; return s.x; };
const nuevo = () => ({ x: 0, v: 0 });

export function montarBrand({ reducido, conRaton, cursor }) {
  const raiz = document.querySelector('[data-brand]');
  const viaje = raiz?.querySelector('[data-viaje]');
  if (!viaje) return;
  const escena = viaje.querySelector('[data-escena]'), giro = viaje.querySelector('[data-giro]');
  const capas = [...viaje.querySelectorAll('[data-capa]')], marca = capas[0];
  const cotas = [...viaje.querySelectorAll('.bd-cota')], lineas = [...viaje.querySelectorAll('.bd-cotas line')];
  const regla = viaje.querySelector('[data-regla]'), reglaN = viaje.querySelector('[data-regla-n]'), reglaT = viaje.querySelector('[data-regla-t]'), juego = viaje.querySelector('[data-regla-juego]');
  const titulo = viaje.querySelector('[data-titulo]'), pista = viaje.querySelector('[data-pista]');

  const hora = document.querySelector('[data-bd-hora]');
  const reloj = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
  const ponerHora = () => { if (hora) hora.textContent = reloj.format(new Date()); };
  ponerHora();
  setInterval(ponerHora, 20000);

  let activa = -1;
  // Lo que dice la línea del juego: el de la capa que toca o, mientras juegas, lo que acabas de tocar
  const decirJuego = (texto) => { juego.textContent = texto ?? (activa >= 0 ? CAPAS[activa].juego : ''); };

  // --- El ratón ----------------------------------------------------------------------------------------------------
  const raton = { x: 0, y: 0 };
  const inclina = { x: nuevo(), y: nuevo() };
  const libre = { z: 0, x: 0, vz: 0, vx: 0, cogida: false, px: 0, py: 0, t: 0 };
  const levanta = capas.map(nuevo), saca = capas.map(nuevo);
  let encima = -1, abre = 0;
  // El cursor de la web dice qué se puede hacer: con la pila de frente, cogerla; abierta, el juego de cada plancha
  const decir = (frase) => cursor?.decir?.(frase);

  const alMover = (e) => {
    if (e.pointerType !== 'mouse') return;
    raton.x = e.clientX / innerWidth - 0.5;
    raton.y = e.clientY / innerHeight - 0.5;
    if (libre.cogida) {
      const ahora = performance.now(), dtm = Math.max(8, ahora - libre.t) / 1000;
      const dz = (e.clientX - libre.px) * 0.3, dx = -(e.clientY - libre.py) * 0.2;
      libre.z += dz; libre.x = clamp(libre.x + dx, -30, 30);
      libre.vz = libre.vz * 0.5 + (dz / dtm) * 0.5; libre.vx = libre.vx * 0.5 + (dx / dtm) * 0.5;
      libre.px = e.clientX; libre.py = e.clientY; libre.t = ahora;
    }
    // el brillo de la marca, donde está el ratón
    const r = marca.getBoundingClientRect();
    marca.style.setProperty('--bx', `${clamp(((e.clientX - r.left) / r.width) * 100, -20, 120)}%`);
    marca.style.setProperty('--by', `${clamp(((e.clientY - r.top) / r.height) * 100, -20, 120)}%`);
  };
  addEventListener('pointermove', alMover, { passive: true });
  // Coger la pila y girarla (con ratón; en el móvil, arrastrar es bajar)
  escena.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || reducido || e.target.closest('button, a')) return;
    libre.cogida = true; libre.px = e.clientX; libre.py = e.clientY; libre.t = performance.now(); libre.vz = 0; libre.vx = 0;
    escena.setPointerCapture(e.pointerId);
    decir('Gírala');
  });
  const soltar = () => { if (!libre.cogida) return; libre.cogida = false; decir(encima >= 0 ? CAPAS[encima].cursor : ''); };
  escena.addEventListener('pointerup', soltar);
  escena.addEventListener('pointercancel', soltar);
  // La plancha que tienes debajo se levanta, y el cursor dice su juego (de frente, solo se ve la marca: cogerla)
  capas.forEach((c, i) => {
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || libre.cogida) return;
      decir(CAPAS[abre < 0.4 ? 0 : i].cursor);
      if (abre < 0.4) return;
      encima = i;
      c.classList.add('encima');
      sonido.tic(0.35);
    });
    c.addEventListener('pointerleave', () => {
      if (encima === i) encima = -1;
      c.classList.remove('encima');
      if (!libre.cogida) decir('');
    });
  });

  // --- Los juegos ----------------------------------------------------------------------------------------------------
  // 02 · Forma: cuanto más empujas hacia la derecha, más se estira... un poco, se resiste, y vuelve de golpe
  const forma = capas[1], formaIso = viaje.querySelector('[data-forma-iso]'), formaCota = viaje.querySelector('[data-forma-cota]');
  const estira = nuevo();
  let estiraObjetivo = 0, estiraba = false;
  forma.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || libre.cogida) return;
    const r = forma.getBoundingClientRect(), d = clamp(((e.clientX - r.left) / r.width - 0.2) / 0.8, 0, 1);
    estiraObjetivo = 0.24 * (1 - Math.exp(-2.6 * d));
  });
  forma.addEventListener('pointerleave', () => { estiraObjetivo = 0; });
  forma.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    estiraObjetivo = 0.22;
    setTimeout(() => { estiraObjetivo = 0; }, 450);
  });

  // 03 · Color: la marca, arriba, toma el color por el que pasas (si es oscuro, la plancha se aclara para que se vea)
  const colores = viaje.querySelector('.bd-colores');
  const ponerColor = (i) => {
    viaje.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('tocado', Number(b.dataset.color) === i));
    colores.classList.toggle('con-uno', i >= 0);
    if (i < 0) {
      marca.style.removeProperty('--iso'); marca.style.removeProperty('--logo'); marca.style.backgroundColor = '';
      decirJuego();
      return;
    }
    const c = PALETA[i];
    marca.style.setProperty('--iso', c.hex);
    marca.style.backgroundColor = c.oscuro ? '#E7E2DA' : '';
    if (c.oscuro) marca.style.setProperty('--logo', '#190900'); else marca.style.removeProperty('--logo');
    decirJuego(`${c.nombre} · ${c.hex} · ${c.papel}`);
    sonido.nota(i, 0.45);
  };
  viaje.querySelectorAll('[data-color]').forEach((b) => {
    const i = Number(b.dataset.color);
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ponerColor(i); });
    b.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') ponerColor(-1); });
    b.addEventListener('click', () => ponerColor(i));
  });

  // 04 · Letra: el titular se pone la letra que eliges, y vuelve a Garamond al irte
  const letraT = viaje.querySelector('[data-letra-t]');
  let letraPuesta = 0;
  const ponerLetra = (i) => {
    if (i === letraPuesta) return;
    letraPuesta = i;
    viaje.querySelectorAll('[data-letra]').forEach((b) => b.classList.toggle('tocado', Number(b.dataset.letra) === i && i > 0));
    letraT.style.opacity = '0';
    setTimeout(() => { letraT.style.fontFamily = LETRAS[i].familia; letraT.style.fontWeight = String(LETRAS[i].peso); letraT.style.opacity = ''; }, 140);
    decirJuego(i === 0 ? undefined : `${LETRAS[i].nombre} · ${LETRAS[i].papel.toLowerCase()}`);
    sonido.tecla(0.5);
  };
  viaje.querySelectorAll('[data-letra]').forEach((b) => {
    const i = Number(b.dataset.letra);
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ponerLetra(i); });
    b.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') ponerLetra(0); });
    b.addEventListener('click', () => ponerLetra(letraPuesta === i ? 0 : i));
  });

  // 05 · Voz: la frase de agencia se tacha y se escribe la nuestra, letra a letra; la siguiente vez, otra frase
  const vozCapa = viaje.querySelector('[data-voz-capa]'), voz = viaje.querySelector('[data-voz]'), vozNo = viaje.querySelector('[data-voz-no]');
  let iv = 0, escribiendo = false;
  const frase = () => VOZ[iv % VOZ.length];
  const sinCorregir = () => { const [a, mal, , b] = frase(); voz.innerHTML = `${a} ${mal}${b ? ` ${b}` : '.'}`; vozNo.textContent = ''; };
  const corregir = () => {
    if (escribiendo) return;
    escribiendo = true;
    const [a, mal, bien, b, no] = frase();
    voz.innerHTML = `${a} <s>${mal}</s> <b></b>${b ? ` ${b}` : '.'}`;
    const hueco = voz.querySelector('b');
    let k = 0;
    const letra = () => {
      hueco.textContent = bien.slice(0, ++k);
      if (!reducido) sonido.tecla(0.3);
      if (k < bien.length) setTimeout(letra, reducido ? 0 : 55);
      else {
        vozNo.textContent = no;
        setTimeout(() => { iv++; escribiendo = false; sinCorregir(); }, 2600);
      }
    };
    setTimeout(letra, reducido ? 0 : 320);
  };
  sinCorregir();
  vozCapa.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && abre > 0.4) corregir(); });
  vozCapa.addEventListener('click', corregir);

  // --- El recorrido, cada fotograma ----------------------------------------------------------------------------------
  const progreso = () => { const r = viaje.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  let h = capas[0].offsetHeight;
  addEventListener('resize', () => { h = capas[0].offsetHeight; });
  let p = progreso(), antes = performance.now(), visible = true, cierreAntes = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(viaje);

  gsap.ticker.add(() => {
    const ahora = performance.now(), dt = Math.min(0.05, (ahora - antes) / 1000), t = ahora / 1000;
    antes = ahora;
    if (!visible) return;
    p += (progreso() - p) * (reducido ? 1 : 1 - Math.exp(-dt * 7));
    pista.classList.toggle('fuera', p > 0.01);

    // De frente (0), vista técnica (0,04-0,2), se abre (0,1-0,32), capa a capa (0,33-0,87) y se vuelve a montar
    const vista = liso(0.04, 0.2, p) * (1 - liso(0.88, 0.98, p));
    abre = liso(0.1, 0.32, p) * (1 - liso(0.88, 0.98, p));
    const ahoraActiva = p > 0.33 && p < 0.87 ? Math.min(4, Math.floor((p - 0.33) / 0.108)) : -1;

    // El ratón: la inclinación con muelle (sin ratón, un vaivén lento) y el giro libre, con inercia y de vuelta
    const ix = reducido ? 0 : muelle(inclina.x, conRaton ? raton.x : Math.sin(t * 0.4) * 0.14, dt);
    const iy = reducido ? 0 : muelle(inclina.y, conRaton ? raton.y : Math.cos(t * 0.33) * 0.08, dt);
    if (!libre.cogida) {
      libre.z += libre.vz * dt; libre.x = clamp(libre.x + libre.vx * dt, -30, 30);
      libre.vz *= Math.exp(-dt * 3.2); libre.vx *= Math.exp(-dt * 3.2);
      libre.z -= libre.z * (1 - Math.exp(-dt * 0.8)); libre.x -= libre.x * (1 - Math.exp(-dt * 1.1));
    }
    giro.style.transform = `rotateX(${vista * 56 - iy * 18 + libre.x}deg) rotateY(${ix * 22 * (1 - vista)}deg) rotateZ(${vista * -34 + ix * 18 * vista + libre.z}deg)`;

    capas.forEach((c, i) => {
      const lev = muelle(levanta[i], i === encima && abre > 0.4 ? h * 0.14 : 0, dt, 120, 13);
      // (la que tiene su turno sale hacia un lado, lo bastante para que la de encima no la tape)
      const sal = muelle(saca[i], i === ahoraActiva ? h * 0.5 : 0, dt, 60, 11);
      const flota = reducido ? 0 : Math.sin(t * 0.9 + i * 1.3) * 5 * abre;
      const hondo = (2 - i) * abre;
      c.style.transform = `translate3d(${sal + ix * hondo * 18}px, ${iy * hondo * 14}px, ${(2 - i) * h * 0.46 * abre + (4 - i) * 0.6 + lev + flota}px)`;
      // (en el turno del color, la marca sigue encendida: es la que toma el color que pasas)
      c.classList.toggle('apagada', ahoraActiva >= 0 && i !== ahoraActiva && !(i === 0 && CAPAS[ahoraActiva].id === 'color'));
      c.classList.toggle('activa', i === ahoraActiva);
    });

    // La forma: el muelle del estirón (con temblor mientras se resiste) y su cota
    const s = muelle(estira, estiraObjetivo, dt, 140, 7);
    const tiembla = estiraObjetivo > 0.15 && !reducido ? Math.sin(t * 46) * 0.008 : 0;
    formaIso.style.transform = `scaleX(${1 + s + tiembla})`;
    formaCota.classList.toggle('on', s > 0.03);
    if (s > 0.03) formaCota.textContent = `+${Math.round(s * 100)} % · no se estira`;
    if (estiraObjetivo === 0 && estiraba && s < 0.01) sonido.tic(0.5);
    estiraba = estiraObjetivo > 0;

    // Las cotas, a la derecha de cada plancha
    cotas.forEach((cota, i) => {
      const b = capas[i].getBoundingClientRect(), y = Math.max(64, b.top + b.height / 2), x = Math.min(innerWidth - cota.offsetWidth - 24, b.right + 36);
      const se = abre > 0.5 ? 1 : 0;
      cota.style.opacity = se;
      cota.style.transform = `translate3d(${x}px, ${y - 7}px, 0)`;
      cota.classList.toggle('activa', i === ahoraActiva);
      const l = lineas[i];
      l.setAttribute('x1', b.right - b.width * 0.12); l.setAttribute('y1', y); l.setAttribute('x2', x - 8); l.setAttribute('y2', y);
      l.style.opacity = se;
    });

    // La regla de la capa que toca
    if (ahoraActiva !== activa) {
      activa = ahoraActiva;
      regla.classList.toggle('on', activa >= 0);
      if (activa >= 0) {
        reglaN.textContent = `${CAPAS[activa].n} — ${CAPAS[activa].nombre}`;
        reglaT.textContent = CAPAS[activa].regla;
        decirJuego();
        sonido.pasa(0.5);
        if (CAPAS[activa].id === 'voz') corregir();
      }
    }
    // Al final, montada otra vez: brand por fuera, tech por dentro
    const cierre = p > 0.9;
    if (cierre !== cierreAntes) { cierreAntes = cierre; titulo.innerHTML = cursiva(cierre ? PORTADA.final : PORTADA.titulo); }
  });

  // El cierre entra la primera vez que se ve bien
  const cierre = raiz.querySelector('[data-cierre]');
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { cierre.classList.add('on'); io.disconnect(); } }, { threshold: 0.25 }).observe(cierre);
}
