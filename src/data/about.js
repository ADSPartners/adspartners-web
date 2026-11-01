// El About: los dos que hacemos ads, en cinco capítulos con una foto de vida de cada uno. Sebas va en la marca (sus
// fotos caen como copias en papel) y Álvaro en el tech (las suyas se montan a píxeles y el inspector las mide).
// Lo de Álvaro sale de lo que contó el 29-oct (en el vault, project_adspartners_web_about); el hilo lo eligió él el
// 1-nov: biomédica, su primer software para un hospital y el piano. OVB no se nombra y Dani tampoco.
// Lo de Sebas aún no ha llegado: texto: null deja el hueco marcado con su pregunta, y cuando: null, el de su foto.
// Nada inventado: cuando llegue lo suyo, se rellena aquí y la página no cambia.
// foto: el fichero de public/assets/about/ (900 px de ancho) y su alto; pie: lo que se ve; donde y cuando, si se sabe.

export const PERSONAS = {
  sebas: { nombre: 'Sebas', lado: 'Brand' },
  alvaro: { nombre: 'Álvaro', lado: 'Tech' },
};

export const CAPITULOS = [
  {
    titulo: 'Cómo empezamos',
    sebas: {
      pregunta: '¿Cuándo empezaste a hacer lo que haces hoy, y qué fue lo primero que hiciste?',
      texto: null,
      foto: { src: 'sebas1.webp', alto: 1357, pie: 'Una foto de carrete, en su cuarto.', donde: null, cuando: null },
    },
    alvaro: {
      texto: 'Empecé con esto hacia los 18 años, sabiendo una cosa: no quería un nueve a cinco toda la vida.',
      foto: { src: 'alvaro2.webp', alto: 1200, pie: 'Paseo al atardecer', donde: 'Santander', cuando: 'Verano de 2026' },
    },
  },
  {
    titulo: 'Qué estudiamos',
    sebas: {
      pregunta: '¿Qué estudiaste, y qué te llevaste de ahí que sigas usando?',
      texto: null,
      foto: { src: 'sebas2.webp', alto: 1200, pie: 'En un campo de lavanda.', donde: null, cuando: null },
    },
    alvaro: {
      texto: 'Ingeniería biomédica. La aborrecí, pero la acabé, y me dejó algo que uso cada día: puedo con lo que tenga delante si lo intento lo suficiente. Mi primer software fue para un hospital, la Fundación Jiménez Díaz: sin IA, sin equipo y sin saber si sabría hacerlo. Lo siguieron usando mucho tiempo después. Fue el inicio.',
      foto: { src: 'alvaro3.webp', alto: 1199, pie: 'Con el gato', donde: 'Madrid, en casa de un amigo', cuando: 'Verano de 2025' },
    },
  },
  {
    titulo: 'Antes de ads',
    sebas: {
      pregunta: '¿Dónde estuviste antes de ads, y qué aprendiste allí que no se enseña?',
      texto: null,
      foto: { src: 'sebas3.webp', alto: 1200, pie: 'Trabajando en un balcón.', donde: null, cuando: null },
    },
    alvaro: {
      texto: 'Pasé por una empresa de inversión: hablaba con gente de todo tipo y enseñaba a invertir a mi círculo. Ahí aprendí lo que vale conocer gente y atreverse con cosas nuevas. Después vinieron un proyecto de redes, en el que entrevistaba a gente por la calle para explicar la inversión, y programar por mi cuenta.',
      foto: { src: 'alvaro5.webp', alto: 1199, pie: 'Con el perro', donde: 'Madrid', cuando: 'Otoño de 2025', nota: 'Preparando el primer gran cambio de ads. Pasear me ayudaba a pensar' },
    },
  },
  {
    titulo: 'Cómo nos conocimos',
    sebas: {
      pregunta: '¿Cómo os conocisteis, y cuándo decidisteis montar ads?',
      texto: null,
      foto: { src: 'sebas4.webp', alto: 1600, pie: 'En el coche.', donde: null, cuando: null },
    },
    alvaro: {
      texto: 'En ese proyecto de redes, por un amigo común. Sebas es de los tíos más majos y buenos que he conocido nunca, y curra casi tanto como yo, que es difícil de encontrar.',
      foto: { src: 'alvaro4.webp', alto: 1200, pie: 'La Giralda', donde: 'Sevilla', cuando: 'Semana Santa de 2025', nota: 'Viaje de trabajo con Sebas' },
    },
  },
  {
    titulo: 'Fuera del trabajo',
    sebas: {
      pregunta: '¿Hay algo de tu vida fuera del trabajo que se note en cómo trabajas?',
      texto: null,
      foto: { src: 'sebas5.webp', alto: 1200, pie: 'Grabando en una cafetería.', donde: null, cuando: null },
    },
    alvaro: {
      texto: 'El deporte, porque el esfuerzo siempre tiene recompensa. Y el piano, porque junta lo técnico y matemático con lo artístico, que es lo mismo que hacemos en ads.',
      foto: { src: 'alvaro1.webp', alto: 1351, pie: 'Surf', donde: 'Llanes', cuando: 'Verano de 2026' },
    },
  },
];

// Al final, lo que hace cada uno
export const CIERRE = {
  sebas: { pregunta: '¿Qué haces tú que el otro no sabe hacer?', texto: null },
  alvaro: { texto: 'La IA, la informática, los servidores y todo lo que hay montado por dentro, para ads y para los clientes.' },
};
