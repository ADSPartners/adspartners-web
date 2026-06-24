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

## Conexión con n8n (formulario "Quedamos")

El formulario de la carta es el embudo: cuando el lead lo envía, manda **todos sus datos en un JSON** a un webhook de n8n.

### 1. Pegar la URL del webhook
En `components.jsx`, arriba del todo:

```js
const N8N_WEBHOOK_URL = ''; // ← pega aquí la "Production URL" del nodo Webhook de n8n
```

- **Vacío** → el formulario sigue funcionando por correo (`mailto`), así la web funciona aunque aún no esté conectado.
- **Con URL** → hace `POST` (JSON) al webhook. Si el POST falla, cae automáticamente al `mailto` para no perder el lead.

### 2. CORS en n8n
Para que el navegador pueda enviar directo desde la web, en el nodo **Webhook** de n8n → *Options* → **Allowed Origins (CORS)** pon `*` (o tu dominio). Si no, el envío usará el respaldo por correo.

### 3. Estructura del JSON que recibe n8n

```json
{
  "source": "adspartners.com/quedamos",
  "lang": "es",
  "submitted_at": "2026-06-25T10:00:00.000Z",
  "name": "...",
  "company": "...",
  "role": "...",
  "web": "...",
  "mode": "ONLINE o PRESENCIAL",
  "place": "...",
  "drink": "...",
  "email": "...",
  "phone": "...",
  "extra": "...",
  "signature": "...",
  "meeting": { "date": "2026-06-25", "time": "12:00", "label": "Jueves, 25 de junio · 12:00" }
}
```

En n8n los campos llegan bajo `{{ $json.body }}` (p.ej. `{{ $json.body.email }}`, `{{ $json.body.meeting.date }}`). Desde ahí conectas tu secuencia de emails y Outlook.

> El calendario (Lun–Sáb, 10:00–15:00, intervalos de 1h) solo rellena el campo *FECHA Y HORA*; no reserva nada por sí solo. La reserva real la gestionas tú en n8n/Outlook con `meeting.date` y `meeting.time`.
