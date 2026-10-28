# adsPartners® · Web (ads-partners.com) — v5 «Marca por fuera. Máquina por dentro.»

Web estática hecha con **Astro**. Compila a **`docs/`**, que es lo que sirve **GitHub Pages**
(Settings → Pages → *Deploy from a branch* → `main` / `/docs`, sin Actions). Dominio en `CNAME`.

## Editar y publicar

```bash
npm install            # la primera vez
npm run dev            # http://localhost:4321 con recarga en caliente
npm run build          # compila la web real a docs/
npm run build:prueba          # idea «pincel» para preview.ads-partners.com/ads-v5/
npm run build:prueba-objeto   # idea «objeto» para /ads-1v5/
npm run build:prueba-fresa    # idea «FRESA» para /ads-2v5/
```

Cada `build:prueba*` deja en `docs/` esa idea con su ruta; se sube con
`python portfolio/staging_ads.py C:/Users/alvar/adspartners-web-proyectos <carpeta>` (desde `webs-negocios`).
Antes de subir `docs/` a `main`, **siempre** `npm run build` (sin `:prueba`), o la web real saldría con
la ruta de la copia de prueba. `ADS_CONCEPTO` elige la idea (por defecto, `pincel`).

## Qué fichero es qué

```
astro.config.mjs        salida a docs/ y ruta base (ADS_BASE=<carpeta> para la copia de prueba)
src/pages/index.astro   la home: orden de los bloques y qué idea de portada lleva (ADS_CONCEPTO)
src/layouts/Base.astro  <head>, metas, fuentes precargadas y el script que decide si sale el umbral
src/components/
  Umbral.astro          pantalla previa: carga con humor, barra de 1 px, entrar con o sin sonido
  Cabecera.astro        barra fija: logotipo, Ajustes (sonido, movimiento, calidad) y Hablemos
  Portada.astro         portada (la misma en las tres ideas; cambia lo que hay detrás)
  Idea.astro            la frase que se enciende palabra a palabra, con sus dos notas al margen
  Hacemos.astro         «Marca» (Garamond) y «máquina» (mono): los dos oficios y sus servicios
  PorQue.astro          capítulo claro: las cuatro razones
  ParaQuien.astro       «Te servimos si»: casillas que se marcan al bajar, y la llamada a hablar
  Pie.astro             pie del prototipo
  Cursor.astro          el cursor-mensaje (isotipo + anillo + frase), ideas «pincel» y «objeto»
  CursorFresa.astro     FRESA junto al ratón (idea «FRESA»); los mensajes salen de los data-fresa del HTML
  Marca.astro           isotipo y logotipo en línea, con el color del texto
src/scripts/
  app.js                arranque: Lenis, GSAP, ajustes, sonido, cursor, umbral, secciones y la portada de cada idea
  secciones.js          el movimiento de las secciones de texto
  gl/portada.js         idea «pincel»: el shader que mezcla marca y máquina, el piloto automático y «mantener»
  conceptos/objeto.js   idea «objeto»: el isotipo en cristal (three.js) que cambia en cada sección
  conceptos/fresa.js    idea «FRESA»: el orbe, el globo junto al ratón y la lectura en voz alta
  gl/fluido.js          la simulación de fluido en GPU (la máscara del pincel)
  gl/capas.js           lo que se pinta en 2D: foto, título, anatomía del tipo, el código que lo pinta y el degradado
  sonido.js             música generativa, agua del pincel y efectos, todo con Web Audio (no hay ficheros de audio)
  cursor.js, umbral.js, ajustes.js, titulo.js
src/styles/global.css   colores, tipos y curvas de la casa
public/assets/          fuentes, logos, imagen de portada y material de los proyectos
```

Los `.jsx`, `.css` y `.html` sueltos de la raíz son la **web anterior** (React con el build
propio). Ya no se compilan; se quedan de consulta (textos, legales, datos de proyectos, cookies,
chat de FRESA) hasta que la v5 tenga esas piezas, y entonces se borran.

## Reglas de la casa

- Garamond = la marca, Open Sauce = la interfaz, Geist Mono = la máquina.
- Una sola cosa se mueve sola por pantalla (el fluido). Lo demás responde al ratón, al scroll o al pulsar.
- La capa máquina enseña lo que construye lo que se ve: código real y valores medidos, no datos de proyectos.
- Sin WebGL, o con «movimiento reducido», la portada sigue funcionando: título en el DOM y foto de fondo.
