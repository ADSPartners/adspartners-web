// Lo que sale en el menú, «la aurora»: las páginas (sin «Inicio»: a la home se vuelve con el logo) y Hablemos. Cada una
// es una cortina de la aurora con el color de una emisión real (lo que se dice de física es verdad: líneas de emisión
// del oxígeno y del nitrógeno, y a qué altura brillan). Los datos de cada página salen de sus propios ficheros. Brand
// la monta otra rama: mientras no esté aquí, sale «en obras» y no enlaza.
import { PROYECTOS } from './proyectos.js';
import { TECH } from './tech.js';

const anios = PROYECTOS.map((p) => Number(p.anio)).filter(Boolean);

export const DESTINOS = [
  {
    slug: 'proyectos', nombre: 'Proyectos', ruta: 'proyectos/',
    frase: `${PROYECTOS.length} proyectos, de ${Math.min(...anios)} a ${Math.max(...anios)}`,
    color: '#ff6b6b', luz: 'oxígeno · 630,0 nm · por encima de 200 km',
  },
  {
    slug: 'tech', nombre: 'Tech', ruta: 'tech/',
    frase: `${TECH.length} servicios, una misión en cada uno`,
    color: '#7dffb0', luz: 'oxígeno · 557,7 nm · de 100 a 250 km',
  },
  {
    slug: 'brand', nombre: 'Brand', ruta: null,
    frase: 'en obras',
    color: '#ff9ccb', luz: 'nitrógeno · el borde rosa de abajo · unos 100 km',
  },
  {
    slug: 'hablemos', nombre: 'Hablemos', ruta: '#contacto',
    frase: 'escríbenos y lo vemos',
    color: '#9d8cff', luz: 'nitrógeno ionizado · 427,8 nm',
  },
];
