# adsPartners® · Web

Sitio estático (HTML + JSX in-browser con Babel) con pantalla de carga propia.

## Estructura

```
index.html        → entrada
styles.css        → estilos de la web
loader.css        → estilos del overlay de carga
loader.js         → lógica del overlay (mín. 2.5s, se quita en window.load)
app.jsx           → app React
components.jsx    → componentes
team-section.jsx  → sección equipo
contact.jsx       → sección contacto
i18n.jsx          → idiomas (ES/EN)
assets/
  fonts/          → Open Sauce, Apple Garamond, Quetine
  logos/          → isotipo / logotipo / imagotipo en variantes de color
  team/           → fotos del equipo
  clients/        → logos de clientes
  services/       → fondos de servicios
```

## Despliegue (Hostinger + GitHub auto-deploy)

1. **Crear repo en GitHub**: nuevo repo en `ADSPartners` (puede llamarse `web`), público o privado.
2. **Subir todo el contenido de esta carpeta `dist/`** a la raíz del repo (drag & drop en GitHub funciona, o `git push`).
3. **Hostinger → Auto Deploy**: hPanel → Sitios web → tu sitio → **Avanzado → GIT**. Conecta el repo (`ADSPartners/web`), rama `main`, ruta de despliegue `public_html` (o la pública de tu sitio).
4. Cada push a `main` despliega automáticamente.
5. **Dominio**: hPanel → Dominios → asigna tu dominio al sitio. Si ya está asignado, no hace falta tocar nada.

## Despliegue alternativo (sin GitHub)

Sube directamente todo el contenido de esta carpeta al **File Manager** de Hostinger en `public_html/`.

## Loader · API

```js
window.AdsLoader.done()        // marca como "carga real terminada"
window.AdsLoader.forceClose()  // cierra el overlay inmediatamente
window.AdsLoader.config        // { minSeconds, fakeProgressSeconds, ... }
```
