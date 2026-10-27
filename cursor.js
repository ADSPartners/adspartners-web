/* Cursor propio de adsPartners (antes iba en línea en index.html; ahora lo comparten
   la home y las páginas de proyecto). Solo con ratón: en táctil no arranca. */
(function () {
  // Solo en dispositivos con puntero fino (ratón). En táctil el cursor custom
  // no aporta nada y el bucle rAF + elementFromPoint por frame causaba jank
  // y retraso en móvil. Salimos sin arrancar nada.
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.body.classList.add('no-custom-cursor');
    return;
  }
  var ring = document.getElementById('cursorRing');
  var dot = document.getElementById('cursorDot');
  if (!ring || !dot) return;
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;
  var dx = mx, dy = my;
  // El bucle solo corre mientras el cursor se está moviendo; quieto, no gasta nada.
  var enMarcha = false;
  function pedir() { if (!enMarcha) { enMarcha = true; requestAnimationFrame(tick); } }
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; pedir(); });

  // Detect the background theme directly under the cursor so it can use
  // exact corporate colours (no blend-mode tricks).
  var lastTheme = null;
  function updateCursorTheme() {
    var el = document.elementFromPoint(mx, my);
    var theme = 'dark';
    if (el) {
      var themed = el.closest('[data-nav-theme]');
      if (themed) theme = themed.getAttribute('data-nav-theme') || 'dark';
    }
    if (theme !== lastTheme) {
      lastTheme = theme;
      document.body.classList.toggle('cursor-on-light', theme === 'light');
    }
  }

  // Throttle: la detección de tema bajo el cursor usa elementFromPoint, que
  // fuerza hit-testing. No hace falta cada frame; ~10 veces/seg sobra.
  var lastThemeCheck = 0;
  function tick(now) {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dx += (mx - dx) * 0.55;
    dy += (my - dy) * 0.55;
    // Ya ha llegado: se clava en su sitio y el bucle se para hasta el próximo movimiento.
    var llego = Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1 && Math.abs(mx - dx) < 0.1 && Math.abs(my - dy) < 0.1;
    if (llego) { rx = dx = mx; ry = dy = my; }
    ring.style.transform = 'translate(' + rx + 'px, ' + ry + 'px) translate(-50%, -50%)';
    dot.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) translate(-50%, -50%)';
    if (llego || now - lastThemeCheck > 100) { lastThemeCheck = now; updateCursorTheme(); }
    if (llego) { enMarcha = false; return; }
    requestAnimationFrame(tick);
  }
  pedir();
  // Al bajar con el ratón quieto cambia lo que hay debajo: se revisa el tema, como mucho cada 100 ms.
  var temaPendiente = 0;
  window.addEventListener('scroll', function () {
    if (!temaPendiente) temaPendiente = setTimeout(function () { temaPendiente = 0; updateCursorTheme(); }, 100);
  }, { passive: true });

  // Hover behavior - delegated
  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    document.body.classList.remove('cursor-hover', 'cursor-text-mode', 'cursor-cta', 'cursor-ver');
    var ver = t.closest('[data-cursor="ver"]');
    if (ver) {
      // "Ver caso" dentro del anillo (proyectos)
      ring.setAttribute('data-label', ver.getAttribute('data-cursor-label') || '');
      document.body.classList.add('cursor-ver');
    }
    else if (t.closest('[data-cursor="cta"]')) document.body.classList.add('cursor-cta');
    else if (t.closest('input, textarea, [data-cursor="text"]')) document.body.classList.add('cursor-text-mode');
    else if (t.closest('a, button, .day, .time-slot')) document.body.classList.add('cursor-hover');
  });
})();
