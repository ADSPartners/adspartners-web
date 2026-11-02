// Lo que sale en el menú, que baja de la web a la placa que la ejecuta: las cuatro piezas que te esperan abajo, una por
// página (sin «Inicio»: a la home se vuelve con el logo; Hablemos va siempre arriba). Cada página es la pieza que hace
// en una placa lo mismo que ella en ads: Tech, el procesador; Proyectos, el almacenamiento; Brand, la gráfica (lo que se
// ve), y About, la BIOS (lo primero que arranca, y la placa sabe quién es). El color es el de su LED. Los datos de cada
// página salen de sus propios ficheros. Brand la monta otra rama: mientras no esté aquí, sale «en obras» y no enlaza.
import { PROYECTOS } from './proyectos.js';
import { TECH } from './tech.js';
import { CAPITULOS } from './about.js';

const anios = PROYECTOS.map((p) => Number(p.anio)).filter(Boolean);

export const DESTINOS = [
  {
    slug: 'proyectos', nombre: 'Proyectos', ruta: 'proyectos/',
    frase: `${PROYECTOS.length} proyectos, de ${Math.min(...anios)} a ${Math.max(...anios)}`,
    color: '#ff5c5c', pieza: 'ssd', ficha: 'almacenamiento · M.2 2280',
  },
  {
    slug: 'tech', nombre: 'Tech', ruta: 'tech/',
    frase: `${TECH.length} servicios, una misión en cada uno`,
    color: '#5cff9d', pieza: 'cpu', ficha: 'procesador · zócalo U1',
  },
  {
    slug: 'brand', nombre: 'Brand', ruta: null,
    frase: 'en obras',
    color: '#ff8fc8', pieza: 'vga', ficha: 'gráfica · PCIe ×16',
  },
  {
    slug: 'about', nombre: 'About', ruta: 'about/',
    frase: `los dos, en ${CAPITULOS.length * 2} fotos`,
    color: '#8f7dff', pieza: 'bios', ficha: 'BIOS · pila CR2032',
  },
];

// Las capas por las que baja el menú, de lo que ves a lo que lo ejecuta. Salen en el inspector de abajo, con el zoom
export const CAPAS = ['Lo que ves', 'El código que lo pinta', 'Los píxeles', 'La placa que lo ejecuta'];
