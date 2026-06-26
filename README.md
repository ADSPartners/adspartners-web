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
app.jsx, components.jsx, team-section.jsx, i18n.jsx, cookie-consent.jsx, legal*.jsx
styles.css, loader.css, legal.css, cookie-consent.css, loader.js
assets/            imágenes, fuentes, logos
vendor/            React de producción (auto-alojado)
build.mjs          compilador del sitio
docs/              SALIDA compilada que sirve GitHub Pages  (generada por el build)
```

## Notas

- **Imágenes de clientes y equipo** van incrustadas (base64) en `index.html` como
  `window.IMG` para no depender de subir archivos sueltos. `components.jsx` y
  `team-section.jsx` las leen de ahí.
- **Formulario "Quedamos"**: pega la URL del webhook de n8n en `N8N_WEBHOOK_URL`
  (arriba de `components.jsx`). Vacío → cae a `mailto`.
