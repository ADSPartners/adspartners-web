/* Scroll suave de adsPartners (lo comparten la home y las páginas de proyecto).
   Con ratón, y si no se ha pedido «reducir movimiento», Lenis suaviza la rueda; en táctil y en el resto
   se queda el scroll del navegador. window.adsIr(y) lleva a una altura por el camino que toque. */
(function () {
  var quieto = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var tactil = !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  var lenis = null;

  if (window.Lenis && !quieto && !tactil) {
    try {
      lenis = new window.Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
        // Lo que tiene su propio scroll (chat, panel de cookies, modales) se mueve con el del navegador.
        prevent: function (nodo) {
          return !!(nodo && nodo.closest && nodo.closest('.cg-panel, .cc-panel, .qd-modal, [data-lenis-prevent]'));
        },
      });
      var paso = function (t) { lenis.raf(t); window.requestAnimationFrame(paso); };
      window.requestAnimationFrame(paso);
    } catch (e) { lenis = null; }
  }

  window.adsLenis = lenis;
  window.adsIr = function (y, inmediato) {
    y = Math.max(0, Math.round(y));
    if (lenis) lenis.scrollTo(y, { duration: inmediato ? 0 : 1.2, immediate: !!inmediato });
    else window.scrollTo({ top: y, behavior: (quieto || inmediato) ? 'auto' : 'smooth' });
  };
})();
