# adsPartners® · Web (ads-partners.com)

Single-page en **React**. El JSX se compila **en el build** (no en el navegador) y
se publica en **GitHub Pages** con dominio `ads-partners.com` (fichero `CNAME`).

## Cómo editar (flujo normal)

Edita los `.jsx` / `.css` / `.html` y haz **push a `main`** (incluso subiendo los
ficheros por la web de GitHub, como hasta ahora). La **GitHub Action** compila y
despliega sola en cada push. No hay que compilar a mano.

> Requisito único, ya configurado: Settings → Pages → Source = **GitHub Actions**.

## Build en local (opcional)

```bash
npm install
npm run build      # genera /dist (lo que se publica)
# sirve /dist con cualquier estático, p.ej.:  npx serve dist
```

## Qué hace el build (`build.mjs`)

- Compila el JSX de cada página (Babel: JSX + `const`→`var`) a un bundle minificado.
- Usa **React de producción** auto-alojado en `/vendor` (sin unpkg, sin Babel en el navegador).
- Reescribe los HTML para cargar el bundle y copia estáticos (css, assets, CNAME…) a `/dist`.
- Antes la home descargaba ~4,3 MB de terceros y compilaba en el navegador (se quedaba pillada); ahora son ~250 KB ya compilados.

## Estructura

```
index.html, aviso-legal.html, cookies.html, privacidad.html, 404.html
app.jsx, components.jsx, team-section.jsx, i18n.jsx, cookie-consent.jsx, legal*.jsx
styles.css, loader.css, legal.css, cookie-consent.css, loader.js
assets/            imágenes, fuentes, logos
vendor/            React de producción (auto-alojado)
build.mjs          compilador del sitio
.github/workflows/ deploy.yml (build + deploy a Pages)
```

## Notas

- **Imágenes de clientes y equipo** van incrustadas (base64) en `index.html` como
  `window.IMG` para no depender de subir archivos sueltos. `components.jsx` y
  `team-section.jsx` las leen de ahí.
- **Formulario "Quedamos"**: pega la URL del webhook de n8n en `N8N_WEBHOOK_URL`
  (arriba de `components.jsx`). Vacío → cae a `mailto`.
