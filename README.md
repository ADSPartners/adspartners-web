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
astro.config.mjs        salida a docs/ y ruta base (ADS_BASE=<carpeta> para la copia de prueba); HTML sin comprimir
src/pages/index.astro   la home: orden de los bloques y el fondo vivo
src/pages/proyectos/[slug].astro  esbozo de cada proyecto («en construcción»), hasta la Fase 3
src/layouts/Base.astro  <head>, metas, fuentes precargadas y el script que decide umbral, movimiento y ratón
src/components/
  Umbral.astro          carga con humor, barra de 1 px y entrar con o sin sonido (el final lo pinta portada.js)
  Cabecera.astro        logotipo, las barras del sonido (se pulsan para callarlo) y Hablemos
  Portada.astro         portada: canvas del pincel, título real en el DOM (lo repinta el WebGL) y textos
  QueSomos.astro        qué somos y qué hacemos, editorial (palabras fantasma con lente, isotipo partido)
  Partners.astro        el túnel de los 12 logos (datos en src/data/partners.js)
  Proyectos.astro       el lienzo de proyectos (datos en src/data/proyectos.js)
  Transicion.astro      «se enciende la luz»: de la máquina al capítulo claro
  Contacto.astro        la carta con huecos y el cierre
  Fresa.astro           el globo de FRESA y la sección del chat, escondida debajo del contacto
  Cursor.astro, Marca.astro
src/data/               partners y proyectos; de dónde sale cada logo, en partners-LEEME.md
src/scripts/
  app.js                arranque: Lenis + ScrollTrigger, sonido, cursor, umbral, portada, fondo y secciones bajo demanda
  gl/portada.js         el shader de la portada y del final de la carga (uUmbral): pincel, linterna, gotas, mantener
  gl/fondo.js           el fondo vivo (solo con ratón): glifos y la marca en mosaico donde pasa el ratón
  gl/fluido.js, gl/ondas.js, gl/capas.js
  secciones/*.js        un módulo por sección (se carga cuando la sección se acerca)
  sonido.js             música generativa y efectos con Web Audio (no hay ficheros de audio)
  ajustes.js            solo el sonido (las barras)
src/styles/global.css   colores, tipos y curvas de la casa
public/assets/          fuentes, logos, partners, imagen de portada, fondo y material de los proyectos
```

Los `.jsx`, `.css` y `.html` sueltos de la raíz son la **web anterior** (React con el build
propio). Ya no se compilan; se quedan de consulta (textos, legales, datos de proyectos, cookies,
chat de FRESA) hasta que la v5 tenga esas piezas, y entonces se borran.

## Reglas de la casa

- Garamond = la marca, Open Sauce = la interfaz, Geist Mono = la máquina.
- Una sola cosa se mueve sola por pantalla (las ondas, cuando nadie toca nada). Lo demás responde al ratón, al scroll o al pulsar.
- En la portada el ratón destapa la máquina; en el resto (carga incluida) el fondo es máquina y el ratón ilumina marca.
- El fondo vivo y los efectos de ratón no existen en el móvil: allí, la rejilla quieta.
- Formulario: webhook de n8n `ads-contacto` (workflow «ADS Partners — Web v5 (contacto)»).
- La capa máquina enseña lo que construye lo que se ve: código real y valores medidos, no datos de proyectos.
- Sin WebGL, o con «movimiento reducido», la portada sigue funcionando: título en el DOM y foto de fondo.
