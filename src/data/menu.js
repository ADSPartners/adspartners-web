// Lo que sale en el menú, un viaje hasta una aurora: los cuatro puntos de luz que te esperan dentro (sin «Inicio»: a
// la home se vuelve con el logo; Hablemos va siempre arriba). Cada uno tiñe la aurora con el color de una emisión real
// (lo que se dice de física es verdad: líneas de emisión del oxígeno y del nitrógeno, y a qué altura brillan). Los
// datos de cada página salen de sus propios ficheros. Brand la monta otra rama y About aún no existe: mientras no estén
// aquí, salen «en obras» y no enlazan.
import { PROYECTOS } from './proyectos.js';
import { TECH } from './tech.js';

const anios = PROYECTOS.map((p) => Number(p.anio)).filter(Boolean);

export const DESTINOS = [
  {
    slug: 'proyectos', nombre: 'Proyectos', ruta: 'proyectos/',
    frase: `${PROYECTOS.length} proyectos, de ${Math.min(...anios)} a ${Math.max(...anios)}`,
    color: '#ff5c5c', luz: 'oxígeno · 630,0 nm · por encima de 200 km',
  },
  {
    slug: 'tech', nombre: 'Tech', ruta: 'tech/',
    frase: `${TECH.length} servicios, una misión en cada uno`,
    color: '#5cff9d', luz: 'oxígeno · 557,7 nm · de 100 a 250 km',
  },
  {
    slug: 'brand', nombre: 'Brand', ruta: null,
    frase: 'en obras',
    color: '#ff8fc8', luz: 'nitrógeno · el borde rosa de abajo · unos 100 km',
  },
  {
    slug: 'about', nombre: 'About', ruta: null,
    frase: 'en obras',
    color: '#8f7dff', luz: 'nitrógeno ionizado · 427,8 nm',
  },
];
