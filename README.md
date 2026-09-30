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

> El build es manual: no hay ninguna GitHub Action. Actions funciona en la cuenta
> (el CI de hosteleros-mvp corre), así que se podría automatizar (build on push) y
> dejar de commitear `docs/`.

## Qué hace el build (`build.mjs`)

- Compila el JSX de cada página (Babel: JSX + `const`→`var`) a un bundle minificado.
- Usa **React de producción** auto-alojado en `/vendor` (sin unpkg, sin Babel en el navegador).
- Reescribe los HTML para cargar el bundle y copia estáticos (css, assets, CNAME, 404…) a `docs/`.
- Pre-renderiza la home con `jsdom` para que buscadores y crawlers de IA vean el contenido sin JS.
- Resultado: la home pasa de ~4,3 MB + compilar en el navegador a **~250 KB** ya compilados.

## Estructura

```
index.html, aviso-legal.html, cookies.html, privacidad.html, 404.html   ← fuente
app.jsx, components.jsx, i18n.jsx, cookie-consent.jsx, chat-globo.jsx, legal*.jsx
styles.css, loader.css, legal.css, cookie-consent.css, chat-globo.css, loader.js
assets/            imágenes, fuentes, logos
vendor/            React de producción (auto-alojado)
build.mjs          compilador del sitio
docs/              SALIDA compilada que sirve GitHub Pages  (generada por el build)
```

## Notas

- **Formulario "Quedamos" y newsletter**: envían a los webhooks de n8n
  (`N8N_WEBHOOK_URL` y `N8N_NEWSLETTER_URL`, arriba de `components.jsx`). Si el
  POST falla, la carta cae a `mailto`.
- **Chat de ventas (`chat-globo.jsx`)**: burbuja que habla con el backend
  `fresa-ventas` (Railway, fuera de este repo). Para que nadie use su API desde
  fuera de la web, lleva Cloudflare Turnstile:
  1. Cloudflare → Turnstile → crear widget en modo **Invisible** para
     `ads-partners.com`.
  2. La *sitekey* (pública) va en `CG_TURNSTILE_SITEKEY`, en `chat-globo.jsx`;
     recompila y sube.
  3. La *secret key* va como `TURNSTILE_SECRET` en las variables del backend en
     Railway. Con ella puesta, el backend debe rechazar cualquier petición sin
     token válido.
  Sin sitekey el chat no manda token (vale para desarrollo, no para producción).
