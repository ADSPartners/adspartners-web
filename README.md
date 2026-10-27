# adsPartners® · Web (ads-partners.com)

Single-page en **React**. El JSX se compila **en el build** (no en el navegador,
que es lo que la colgaba) y se publica en **GitHub Pages** con dominio
`ads-partners.com` (fichero `CNAME`).

## Cómo funciona el despliegue

- **El código fuente** vive en la raíz (`.jsx`, `.css`, los `.html`, `assets/`…).
- **El build** (`npm run build`) compila todo a la carpeta **`docs/`**.
- **GitHub Pages sirve `docs/`** (Settings → Pages → *Deploy from a branch* →
  `main` / `/docs`). Pages es **gratis** y no usa GitHub Actions.

> Pages solo SIRVE ficheros, no compila. Por eso el sitio publicado es `docs/`
> (ya compilado), y la raíz es el código editable.

## Editar la web (flujo actual)

1. Edita los `.jsx` / `.css` / `.html` de la raíz.
2. Recompila:
   ```bash
   npm install      # solo la primera vez
   npm run build    # regenera docs/
   ```
3. Sube los cambios (raíz **y** `docs/`) a `main`. En ~1 min está live.

> Mientras GitHub Actions esté bloqueado por billing, este paso de recompilar es
> manual. Si se desbloquea, se puede automatizar con una Action (build on push) y
> dejar de commitear `docs/`.

## Qué hace el build (`build.mjs`)

- Compila el JSX de cada página (Babel: JSX + `const`→`var`) a un bundle minificado.
- Usa **React de producción** auto-alojado en `/vendor` (sin unpkg, sin Babel en el navegador).
- Reescribe los HTML para cargar el bundle y copia estáticos (css, assets, CNAME, 404…) a `docs/`.
- Resultado: la home pasa de ~4,3 MB + compilar en el navegador a **~250 KB** ya compilados.

## Estructura

```
index.html, aviso-legal.html, cookies.html, privacidad.html, 404.html   ← fuente
proyecto.html      plantilla de las páginas /proyectos/<slug>/ (el build genera una por proyecto)
rama.html          plantilla de las páginas /finance/, /tech/ y /brand/ (el build genera una por rama)
app.jsx            orden de los bloques de la home
components.jsx     barra, menú lateral, carta «Quedamos» y pie
secciones.jsx      portada, testimonios, preguntas y cierre de la home
secciones-data.jsx TEXTOS de esos bloques, en español e inglés
ramas.jsx          la sección «Qué hacemos» de la home, la página de cada rama y el cielo de nubes
ramas-data.jsx     TEXTOS de las tres ramas (sección de la home y sus páginas), en español e inglés
proyectos.jsx      lista «Selected Work» y páginas de proyecto
proyectos-data.jsx TEXTOS y datos de cada proyecto, y la lista de trabajos de la home
i18n.jsx           textos cortos (barra, menú, portada) y cambio de idioma
cookie-consent.jsx, chat-globo.jsx, legal*.jsx
styles.css, secciones.css, ramas.css, proyectos.css, loader.css, legal.css, cookie-consent.css, chat-globo.css
cursor.js          cursor propio (compartido por la home y los proyectos)
scroll.js          scroll suave con Lenis (solo con ratón) y window.adsIr
assets/            imágenes, vídeos, fuentes, logos
vendor/            React de producción y Lenis (auto-alojados)
build.mjs          compilador del sitio
docs/              SALIDA compilada que sirve GitHub Pages  (generada por el build)
```

## Notas

- **Para cambiar un texto de la home**: casi todos están en `secciones-data.jsx`
  (lo que va entre `{llaves}` sale en cursiva). Los de las tres ramas y sus páginas,
  en `ramas-data.jsx`; los de los proyectos, en `proyectos-data.jsx`. Las preguntas frecuentes ya no se pintan en la
  página: la franja «Preguntad» señala el chat de FRESA, que es quien las contesta.
- **Añadir un trabajo a la lista de la home**: una línea en `window.TRABAJOS`, al final
  de `proyectos-data.jsx`. Si además va a tener página propia: una entrada en
  `window.PROYECTOS` y su carpeta en `assets/proyectos/<slug>/` (lo explica la cabecera).
- **Pantalla de carga**: solo CSS (`loader.css`); sale una vez por sesión.
- **Estilos y caché**: el build junta los `.css` de cada página en uno solo, minificado y con huella en
  el nombre (`estilos.<huella>.css`). Al cambiar un `.css` ya no hace falta tocar el `?v=` de los enlaces.
- **Fuentes**: se sirven en `.woff2` (los `.ttf` se quedan de reserva en el `@font-face`). Una fuente
  nueva se convierte con fontTools: `TTFont('x.ttf')`, `flavor = 'woff2'`, `save('x.woff2')`.
- **Rendimiento**: la portada y la cabecera de proyecto pausan sus fondos animados fuera de pantalla
  (`useReveal` en `components.jsx`, clase `.is-fuera`), y el cursor propio solo corre mientras se mueve.
- **Formulario "Quedamos"**: pega la URL del webhook de n8n en `N8N_WEBHOOK_URL`
  (arriba de `components.jsx`). Vacío → cae a `mailto`.
