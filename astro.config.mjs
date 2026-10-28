// Web de adsPartners (v5). Astro compila a docs/, que es lo que sirve GitHub Pages (main → /docs).
// Para la copia de prueba (preview.ads-partners.com/<carpeta>/): ADS_BASE=<carpeta> (sin barras: Git Bash las convierte en rutas de Windows)
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ads-partners.com',
  base: process.env.ADS_BASE ? `/${process.env.ADS_BASE.replace(/^[\/]+|[\/]+$/g, '')}/` : '/',
  outDir: './docs',
  trailingSlash: 'ignore',
  build: { format: 'directory', assets: '_ads' },
  devToolbar: { enabled: false },
});
