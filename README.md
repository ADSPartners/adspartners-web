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
src/pages/proyectos/index.astro   el archivo, «La cinta»: la maqueta de la home de huyml.co con lo nuestro. Los proyectos pasan en
                        diagonal, uno por gesto, y el ratón mueve la fila; lo de cada uno va en la esquina de la izquierda (cambia a
                        píxeles) y en el índice (no hay página por proyecto; scripts/cinta.js)
src/pages/tech/index.astro   Tech («Tech · adsPartners»): la maqueta del slider de innovaciones de orano.group con lo nuestro. Una
                        innovación por pantalla con su modelo en alambre; pasar a la siguiente es volar por un valle hasta ella (y de la
                        cuarta, otra vez a la primera). «Entrar» abre su artículo y [+] su misión (scripts/tech.js; textos y datos en
                        src/data/tech.js; lo grabado con la API, en src/data/lectura.json y src/data/preguntas.json; la cafetería
                        de ejemplo, en src/data/negocio.js)
src/layouts/Base.astro  <head>, metas, fuentes precargadas y el script que decide umbral, movimiento y ratón
src/components/
  Umbral.astro          carga con humor, barra de 1 px y entrar con o sin sonido (el final lo pinta portada.js)
  Cabecera.astro        logotipo, las barras del sonido (se pulsan para callarlo) y Hablemos
  Portada.astro         portada: canvas del pincel, título real en el DOM (lo repinta el WebGL), textos y etiquetas del inspector
  QueSomos.astro        qué somos y qué hacemos, editorial (palabras fantasma con lente, isotipo partido)
  Partners.astro        el túnel: el título te pasa por encima y después los 12 logos, sueltos (datos en src/data/partners.js)
  Proyectos.astro       el lienzo de proyectos, una foto cada uno, con el texto a máquina repartido encima (datos en src/data/proyectos.js)
  Transicion.astro      «se enciende la luz»: de la máquina al capítulo claro
  Contacto.astro        la carta con huecos, la posdata de privacidad, «Enviar la carta» y el cierre
  Fresa.astro           el globo de FRESA (abre una ventana de chat en plano técnico) y el chat del final, tras el muro
  Fondo.astro           el fondo tech de todas las páginas (rejilla quieta; con ratón, el canvas de gl/fondo.js)
  Cursor.astro, Marca.astro
src/data/               partners y proyectos (el archivo los enseña todos con su foto «cinta»; el lienzo de la home, los home: true con su «foto»); de dónde sale cada logo, en partners-LEEME.md
src/scripts/
  app.js                arranque: Lenis + ScrollTrigger, sonido, cursor, umbral, portada, fondo, textos vivos y secciones bajo demanda
  pagina.js             arranque de las subpáginas: lo mismo menos el umbral y la portada, más el montaje propio de cada una
  comun.js              lo compartido: los imanes y la barra que se esconde (y se pone en tinta sobre lo claro)
  menu.js               el menú (components/Menu.astro, datos en data/menu.js): abrir y cerrar
  menu/placa.js         el menú baja de la web a la placa que la ejecuta: una ola que sale del botón vuelve la página su
                        código y la cámara baja recta por sus capas (lo que ves, el código que lo pinta, los píxeles),
                        que se deshacen a bloques al atravesarlas, hasta la placa base, donde cada página es una pieza (Tech, el procesador; Proyectos, el SSD; Brand, la
                        gráfica; About, la BIOS). Apuntar enciende sus pistas; pinchar baja hasta ella. Escena 3D con OGL
  menu/bits.js          los bits que pasan entre capa y capa (ceros y unos que cambian, código, píxeles y paquetes), con
                        estela cuando la cámara va deprisa
  menu/codigo.js        las hojas: la página en pantalla pasada a su HTML (medido del DOM), el shader de la portada y este
                        menú (con ?raw), y la misma pantalla reducida a píxeles (el shader los pinta con sus tres luces)
  menu/circuito.js      la placa: dónde va cada pieza (en horizontal y en vertical), la textura de la placa, la de la
                        señal de los buses y las caras con dibujo de las piezas
  rastro.js             el rastro de la visita (tiempo y metros de ratón): lo que lleva encendida la placa del menú
  cinta.js              el archivo de proyectos
  tech.js               la página Tech: slider, artículo y misiones (las tres vistas y sus pasos)
  tech/escena.js        la escena en alambre con OGL: el viaje por el valle (montañas, camino, antenas y polvo, calculados en
                        los shaders), los modelos que se dibujan al llegar y la sala de las misiones
  tech/modelos.js       los modelos, hechos en código (portátil, tienda + Excel, escáner, microscopio), la peana, la antena y la sala
  tech/glitch.js        las letras de Tech notan el ratón, solo en su zona: saltan, se separan en rojo y azul, se pixelan y se rasgan
  tech/pregunta.js      misión de «Observa»: mantienes pulsado para preguntar y el asistente (grabado) consulta y contesta
  tech/conecta.js       misión «Conecta»: el cable de la tienda al Excel, y los pedidos que pasan solos
  tech/factura.js       misión «Automatiza»: el lector que lee la factura y apunta la línea en el Excel
  tech/tejido.js        misión «A medida» (Tysiu): Otsu + regiones medidas, de verdad, en el navegador
  vivo.js               los textos grandes notan el ratón, solo en su zona (rojo y azul que se separan); solo con ratón
  letras.js             el motor de los dos de arriba: parte el texto en letras y le da un muelle a cada una, y solo se
                        mueven las de la zona por la que pasa el ratón
  gl/portada.js         el shader de la portada y del final de la carga (uUmbral): pincel, linterna, inspector, mantener, salida al bajar
  gl/fondo.js           el fondo vivo (solo con ratón): los glifos se excitan donde pasa el ratón, sin tapar nada
  gl/fluido.js, gl/capas.js
  secciones/*.js        un módulo por sección (se carga cuando la sección se acerca)
  sonido.js             música generativa y efectos con Web Audio (no hay ficheros de audio)
  ajustes.js            solo el sonido (las barras)
src/styles/global.css   colores, tipos y curvas de la casa
public/assets/          fuentes, logos, partners, imagen de portada, fondo y material de los proyectos
```

Los `.jsx`, `.css` y `.html` sueltos de la raíz son la **web anterior** (React con el build
propio). Ya no se compilan; se quedan de consulta (textos, legales, datos de proyectos, cookies,
chat de FRESA) hasta que la v5 tenga esas piezas, y entonces se borran.

Las dos misiones con IA se graban una sola vez con la API de Claude (`ANTHROPIC_API_KEY` en el entorno; céntimos):
- `scripts/grabar-lectura.mjs`: lee `scripts/grabaciones/factura-ejemplo.png` y deja lo que contesta en `src/data/lectura.json`.
- `scripts/grabar-pregunta.mjs`: hace las tres preguntas al asistente (con la herramienta de `src/data/negocio.js`) y
  deja cada paso en `src/data/preguntas.json`.
La web nunca llama a la API: solo enseña lo grabado.

## Reglas de la casa

- Garamond = la marca, Open Sauce = la interfaz, Geist Mono = la máquina.
- Una sola cosa se mueve sola por pantalla (el inspector de la portada, cuando nadie toca nada). Lo demás responde al ratón, al scroll o al pulsar.
- Brand por fuera, tech por dentro. En la portada el ratón destapa el tech; en la carga, el fondo es tech y el ratón ilumina el brand; en el resto, el ratón solo mueve (el fondo y los textos grandes), no tapa nada.
- El fondo vivo y los efectos de ratón no existen en el móvil: allí, la rejilla quieta.
- Formulario: webhook de n8n `ads-contacto` (workflow «ADS Partners — Web v5 (contacto)»).
- FRESA está tras un muro: la página acaba en el contacto y hay que empujar varias veces (fresa.js). Sin Lenis no hay muro.
- La capa máquina enseña lo que construye lo que se ve: código real y valores medidos, no datos de proyectos.
- Sin WebGL, o con «movimiento reducido», la portada sigue funcionando: título en el DOM y foto de fondo.
