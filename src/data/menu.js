// Lo que sale en el menú: las páginas (sin «Inicio»: a la home se vuelve con el logo) y, al final, Hablemos. Los
// datos de cada una salen de sus propios ficheros, así que son de verdad y se ponen al día solos. Brand la monta otra
// rama: mientras no esté aquí, sale «en obras» y no enlaza.
import { PROYECTOS } from './proyectos.js';
import { TECH, LECTURA } from './tech.js';

// Las fotos de la caja de Proyectos: las del archivo (cinta), de las primeras
export const FOTOS_PROYECTOS = PROYECTOS.filter((p) => p.cinta).slice(0, 5).map((p) => ({ src: p.cinta.src, nombre: p.nombre }));

const anios = PROYECTOS.map((p) => Number(p.anio)).filter(Boolean);
const conRama = (r) => PROYECTOS.filter((p) => p.rama.includes(r)).length;
const segundos = (ms) => (ms / 1000).toFixed(1).replace('.', ',');

export const PAGINAS = [
  {
    slug: 'proyectos', nombre: 'Proyectos', ruta: 'proyectos/',
    frase: 'Todo lo que hemos hecho, uno detrás de otro.',
    datos: [
      ['proyectos', String(PROYECTOS.length)],
      ['años', `${Math.min(...anios)}–${Math.max(...anios)}`],
      ['con brand', String(conRama('Brand'))],
      ['con tech', String(conRama('Tech'))],
    ],
  },
  {
    slug: 'tech', nombre: 'Tech', ruta: 'tech/',
    frase: 'Lo que construimos, y una misión para probarlo.',
    datos: [
      ['servicios', String(TECH.length)],
      ['misiones', String(TECH.filter((t) => t.mision).length)],
      ...(LECTURA.grabada ? [['factura leída con IA', `${segundos(LECTURA.ms)} s`]] : []),
    ],
  },
  {
    slug: 'brand', nombre: 'Brand', ruta: null,
    frase: 'Cómo se hace una marca, con la nuestra.',
    datos: [
      ['nodos del logo', '266'],
      ['proporción', '6,87:1'],
      ['estado', 'en obras'],
    ],
  },
];

export const HABLEMOS = {
  slug: 'hablemos', nombre: 'Hablemos', ruta: '#contacto', etiqueta: 'escríbenos',
  frase: 'Cuéntanos qué necesitas y lo vemos.',
  datos: [['correo', 'adsgroup@'], ['desde', 'Madrid']],
};
