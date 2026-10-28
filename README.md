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

Para la copia de prueba hay que compilar con `build:prueba` y subir `docs/` al VPS. Antes de
subir `docs/` a `main`, **siempre** `npm run build` (sin `:prueba`), o la web real saldría con
la ruta de la copia de prueba.

## Qué fichero es qué

```
astro.config.mjs        salida a docs/ y ruta base (ADS_BASE=<carpeta> para la copia de prueba)
src/pages/index.astro   la home: orden de los bloques
src/layouts/Base.astro  <head>, metas, fuentes precargadas y el script que decide si sale el umbral
src/components/
  Umbral.astro          pantalla previa: carga con humor, barra de 1 px, entrar con o sin sonido
  Cabecera.astro        barra fija: logotipo, Ajustes (sonido, movimiento, calidad), Hablemos y el cubo
  Portada.astro         portada: canvas del pincel, título real en el DOM (lo repinta el WebGL) y textos
  Manifiesto.astro      el párrafo de lo que hacemos (en la Fase 2, cada trabajo será un cue con su clip)
  Cursor.astro          el cursor-mensaje (isotipo + anillo + frase)
  Marca.astro           isotipo y logotipo en línea, con el color del texto
src/scripts/
  app.js                arranque: Lenis, GSAP, ajustes, sonido, cursor, portada, cubo, umbral
  gl/portada.js         el shader que mezcla marca y máquina, el pincel, el piloto automático y «mantener»
  gl/fluido.js          la simulación de fluido en GPU (la máscara del pincel)
  gl/capas.js           lo que se pinta en 2D: foto, título, anatomía del tipo, código con datos reales
  sonido.js             todo el sonido, generado con Web Audio (no hay ficheros de audio)
  cursor.js, cubo.js, umbral.js, ajustes.js
src/styles/global.css   colores, tipos y curvas de la casa
public/assets/          fuentes, logos, imagen de portada y material de los proyectos
```

Los `.jsx`, `.css` y `.html` sueltos de la raíz son la **web anterior** (React con el build
propio). Ya no se compilan; se quedan de consulta (textos, legales, datos de proyectos, cookies,
chat de FRESA) hasta que la v5 tenga esas piezas, y entonces se borran.

## Reglas de la casa

- Garamond = la marca, Open Sauce = la interfaz, Geist Mono = la máquina.
- Una sola cosa se mueve sola por pantalla (el fluido). Lo demás responde al ratón, al scroll o al pulsar.
- Todo lo que dice la capa máquina es verdad (datos de los proyectos).
- Sin WebGL, o con «movimiento reducido», la portada sigue funcionando: título en el DOM y foto de fondo.
