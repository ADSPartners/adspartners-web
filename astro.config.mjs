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
  // Sin comprimir: comprimido, Astro se come el espacio entre un texto y la etiqueta de la línea siguiente
  // («nadie.Juntas», «me llamo[hueco]»)
  compressHTML: false,
  // Los avisos de licencia del código de terceros (/*! … */) se quedan en el JS compilado: al minificar, Vite los quita
  // (gl/fluido.js lleva el MIT de WebGL-Fluid-Simulation, que pide ir con cada copia)
  vite: { build: { rolldownOptions: { output: { comments: { legal: true } } } } },
});
