// Lo que sale en el menú, que baja de la web a la placa que la ejecuta: las cuatro piezas que te esperan abajo, una por
// página (sin «Inicio»: a la home se vuelve con el logo; Hablemos va siempre arriba). Cada página es la pieza que hace
// en una placa lo mismo que ella en ads: Tech, el procesador; Proyectos, el almacenamiento; Brand, la gráfica (lo que se
// ve), y About, la BIOS (lo primero que arranca, y la placa sabe quién es). El color es el de su LED. Los datos de cada
// página salen de sus propios ficheros. Brand la monta otra rama y About aún no existe: mientras no estén aquí, salen
// «en obras» y no enlazan.
import { PROYECTOS } from './proyectos.js';
import { TECH } from './tech.js';

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
    slug: 'about', nombre: 'About', ruta: null,
    frase: 'en obras',
    color: '#8f7dff', pieza: 'bios', ficha: 'BIOS · pila CR2032',
  },
];

// Las capas por las que baja el menú, de lo que ves a lo que lo ejecuta, con lo que es cada una dicho para alguien que
// no sabe de código. Salen al lado de cada hoja en la vista explotada y en el inspector de abajo
export const CAPAS = [
  { nombre: 'Lo que ves', frase: 'HTML y CSS: el texto, las fotos y dónde va cada cosa' },
  { nombre: 'El código que lo pinta', frase: 'JavaScript y shaders: las órdenes que dibujan cada fotograma' },
  { nombre: 'Los píxeles', frase: 'tu pantalla, punto a punto: cada uno, tres luces (roja, verde y azul)' },
  { nombre: 'La placa que lo ejecuta', frase: 'procesador, memoria y gráfica: donde pasa de verdad' },
];
