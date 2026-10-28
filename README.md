# adsPartners® · Web (ads-partners.com) — v5 «Marca por fuera. Máquina por dentro.»

Web estática hecha con **Astro**. Compila a **`docs/`**, que es lo que sirve **GitHub Pages**
(Settings → Pages → *Deploy from a branch* → `main` / `/docs`, sin Actions). Dominio en `CNAME`.

## Editar y publicar

```bash
npm install            # la primera vez
npm run dev            # http://localhost:4321 con recarga en caliente
npm run build          # compila la web real a docs/
npm run build:prueba   # compila para la copia de prueba (preview.ads-partners.com/ads-v5/)
```

`build:prueba` deja en `docs/` la web con la ruta de la copia de prueba; se sube con
`python portfolio/staging_ads.py C:/Users/alvar/adspartners-web-proyectos <carpeta>` (desde `webs-negocios`).
Antes de subir `docs/` a `main`, **siempre** `npm run build` (sin `:prueba`), o la web real saldría con
la ruta de la copia de prueba.

## Qué fichero es qué

```
astro.config.mjs        salida a docs/ y ruta base (ADS_BASE=<carpeta> para la copia de prueba)
src/pages/index.astro   la home: orden de los bloques
src/layouts/Base.astro  <head>, metas, fuentes precargadas y el script que decide si sale el umbral
src/components/
  Umbral.astro          pantalla previa: carga con humor, barra de 1 px, entrar con o sin sonido
  Cabecera.astro        barra fija: logotipo, Ajustes (sonido, movimiento, calidad) y Hablemos
  Portada.astro         portada: canvas del pincel, título real en el DOM (lo repinta el WebGL) y textos
  Cursor.astro          el cursor-mensaje (isotipo + anillo + frase)
  Marca.astro           isotipo y logotipo en línea, con el color del texto
src/scripts/
  app.js                arranque: Lenis, GSAP, ajustes, sonido, cursor, umbral, imán del botón y la portada
  gl/portada.js         el shader que mezcla marca y máquina, el pincel, las gotas y «mantener»
  gl/fluido.js          la simulación de fluido en GPU (la máscara del pincel)
  gl/ondas.js           las ondas de agua en GPU (las gotas que caen cuando el ratón está quieto)
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
- Una sola cosa se mueve sola por pantalla (las ondas, cuando nadie toca nada). Lo demás responde al ratón, al scroll o al pulsar.
- La capa máquina enseña lo que construye lo que se ve: código real y valores medidos, no datos de proyectos.
- Sin WebGL, o con «movimiento reducido», la portada sigue funcionando: título en el DOM y foto de fondo.
