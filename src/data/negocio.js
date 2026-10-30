// La cafetería de ejemplo de la misión «Pregunta»: dos meses de ventas (septiembre y octubre de 2026), inventadas y
// marcadas como ejemplo. Salen siempre iguales (azar con semilla), así que el script que graba al asistente
// (scripts/grabar-pregunta.mjs) y la web ven exactamente los mismos datos.
// consultarVentas es la herramienta que usa el asistente: la misma función en la grabación y aquí.

export const NEGOCIO = { nombre: 'Cafetería de Ejemplo', hoy: '2026-10-31' };

// Producto: precio y unidades de un día normal
const CARTA = [
  ['Café', 1.6, 140],
  ['Bollería', 1.8, 60],
  ['Tostadas', 2.9, 45],
  ['Bocadillos', 4.5, 38],
  ['Zumos', 3.2, 25],
  ['Tartas', 3.8, 18],
];
const DIA_SEMANA = [1.15, 0.92, 0.95, 0.97, 1.0, 1.12, 1.35];   // domingo… sábado

function azarCon(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const redondo = (n) => Math.round(n * 100) / 100;
const iso = (d) => d.toISOString().slice(0, 10);

let cache = null;
export function ventas() {
  if (cache) return cache;
  const azar = azarCon(2026);
  const filas = [];
  for (let d = new Date(Date.UTC(2026, 8, 1)); d <= new Date(Date.UTC(2026, 9, 31)); d.setUTCDate(d.getUTCDate() + 1)) {
    const octubre = d.getUTCMonth() === 9;
    for (const [producto, precio, base] of CARTA) {
      // Octubre algo mejor; las tostadas y los zumos bajan con el frío y las tartas suben
      const temporada = octubre ? ({ Tostadas: 0.96, Zumos: 0.82, Tartas: 1.22 }[producto] || 1.05) : 1;
      const unidades = Math.round(base * DIA_SEMANA[d.getUTCDay()] * temporada * (0.86 + azar() * 0.28));
      filas.push({ fecha: iso(d), producto, unidades, importe: redondo(unidades * precio) });
    }
  }
  cache = filas;
  return filas;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
// La semana se nombra por su lunes («semana del 6 oct»)
function lunes(fecha) {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return iso(d);
}
const GRUPOS = {
  dia: { sql: 'fecha', de: (f) => f.fecha },
  semana: { sql: "date_trunc('week', fecha)", de: (f) => lunes(f.fecha) },
  mes: { sql: "date_trunc('month', fecha)", de: (f) => f.fecha.slice(0, 7) },
  producto: { sql: 'producto', de: (f) => f.producto },
};
export const nombreGrupo = (agrupar, grupo) => {
  if (agrupar === 'mes') return MESES[Number(grupo.slice(5, 7)) - 1];
  if (agrupar === 'semana') return `sem. ${Number(grupo.slice(8, 10))} ${MESES[Number(grupo.slice(5, 7)) - 1].slice(0, 3)}`;
  if (agrupar === 'dia') return `${Number(grupo.slice(8, 10))}/${Number(grupo.slice(5, 7))}`;
  return grupo;
};

// La herramienta del asistente: ventas entre dos fechas (incluidas), agrupadas como se pida
export function consultarVentas({ desde, hasta, agrupar_por: agrupar = 'mes' }) {
  const g = GRUPOS[agrupar] || GRUPOS.mes;
  const suma = new Map();
  for (const f of ventas()) {
    if (f.fecha < desde || f.fecha > hasta) continue;
    const k = g.de(f);
    const s = suma.get(k) || { importe: 0, unidades: 0 };
    s.importe += f.importe;
    s.unidades += f.unidades;
    suma.set(k, s);
  }
  const filas = [...suma.entries()].map(([grupo, s]) => ({ grupo, importe: redondo(s.importe), unidades: s.unidades }));
  if (agrupar === 'producto') filas.sort((a, b) => b.importe - a.importe);
  else filas.sort((a, b) => (a.grupo < b.grupo ? -1 : 1));
  const total = { importe: redondo(filas.reduce((n, f) => n + f.importe, 0)), unidades: filas.reduce((n, f) => n + f.unidades, 0) };
  const consulta = `SELECT ${g.sql} AS grupo, SUM(importe), SUM(unidades) FROM ventas WHERE fecha BETWEEN '${desde}' AND '${hasta}' GROUP BY grupo`;
  return { consulta, filas, total };
}
