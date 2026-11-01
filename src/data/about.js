// El About: los dos que hacemos ads, en cinco capítulos con una foto de vida de cada uno. Sebas va en la marca (sus
// fotos caen como copias en papel) y Álvaro en el tech (las suyas se montan a píxeles y el inspector las mide).
// Lo de Álvaro sale de lo que contó el 29-oct (en el vault, project_adspartners_web_about); el hilo lo eligió él el
// 1-nov: biomédica, su primer software para un hospital y el piano. OVB no se nombra y Dani tampoco.
// ⚠️ provisional: true = INVENTADO por Claude el 1-nov-2026, a petición de Álvaro, para ver la página entera: todo lo
// de Sebas (textos, sitios, años y notas) y las notas de tres fotos de Álvaro (surf, campo y gato). Cada texto acaba en
// lo que gana quien trabaje con nosotros. Sebas lo revisa y lo cambia por lo suyo ANTES de publicar la web de verdad.
// Si un texto vuelve a null, sale el hueco marcado con su pregunta.
// foto: el fichero de public/assets/about/ (900 px de ancho) y su alto; pie: lo que se ve; donde, cuando y nota.

export const PERSONAS = {
  sebas: { nombre: 'Sebas', lado: 'Brand' },
  alvaro: { nombre: 'Álvaro', lado: 'Tech' },
};

export const CAPITULOS = [
  {
    titulo: 'Cómo empezamos',
    sebas: {
      provisional: true,
      pregunta: '¿Cuándo empezaste a hacer lo que haces hoy, y qué fue lo primero que hiciste?',
      texto: 'Empecé en 2020, en pleno confinamiento, haciendo logos y portadas para amigos que montaban algo. Lo primero fue la marca de uno que vendía ropa por Instagram, y ahí aprendí lo que sigo aplicando: una marca no es un logo bonito, es lo que hace que te elijan a ti y no al de al lado.',
      foto: { src: 'sebas1.webp', alto: 1357, pie: 'Una foto de carrete, en su cuarto.', donde: 'Madrid', cuando: 'Invierno de 2020', nota: 'El año en que empecé: logos para amigos y muchas horas mirando referencias.' },
    },
    alvaro: {
      texto: 'Empecé con esto hacia los 18 años, sabiendo una cosa: no quería un nueve a cinco toda la vida.',
      foto: { src: 'alvaro2.webp', alto: 1200, pie: 'Paseo al atardecer', donde: 'Santander', cuando: 'Verano de 2026', nota: 'Desconectar también es trabajo: las mejores ideas llegan lejos de la pantalla', provisional: true },
    },
  },
  {
    titulo: 'Qué estudiamos',
    sebas: {
      provisional: true,
      pregunta: '¿Qué estudiaste, y qué te llevaste de ahí que sigas usando?',
      texto: 'Estudié diseño gráfico, pero lo que más uso lo aprendí fuera de clase: escuchar antes de dibujar. Cuando entiendes de verdad qué quiere contar un negocio y a quién, el diseño casi sale solo. Por eso siempre empiezo preguntando, no enseñando bocetos.',
      foto: { src: 'sebas2.webp', alto: 1200, pie: 'En un campo de lavanda.', donde: 'Brihuega', cuando: 'Julio de 2022', nota: 'Fui a buscar color para una paleta. Lo que ves en persona no te lo da ningún banco de imágenes.' },
    },
    alvaro: {
      texto: 'Ingeniería biomédica. La aborrecí, pero la acabé, y me dejó algo que uso cada día: puedo con lo que tenga delante si lo intento lo suficiente. Mi primer software fue para un hospital, la Fundación Jiménez Díaz: sin IA, sin equipo y sin saber si sabría hacerlo. Lo siguieron usando mucho tiempo después. Fue el inicio.',
      foto: { src: 'alvaro3.webp', alto: 1199, pie: 'Con el gato', donde: 'Madrid, en casa de un amigo', cuando: 'Verano de 2025', nota: 'El verano de las primeras automatizaciones para clientes. Aprendí a explicarlas sin palabras técnicas', provisional: true },
    },
  },
  {
    titulo: 'Antes de ads',
    sebas: {
      provisional: true,
      pregunta: '¿Dónde estuviste antes de ads, y qué aprendiste allí que no se enseña?',
      texto: 'Trabajé por mi cuenta para marcas pequeñas y aprendí lo que no se enseña: el cliente no compra diseño, compra tranquilidad. Plazos claros, pocas sorpresas y alguien que te contesta cuando lo necesitas. Eso es lo que intento dar en cada proyecto.',
      foto: { src: 'sebas3.webp', alto: 1200, pie: 'Trabajando en un balcón.', donde: 'Gandía', cuando: 'Agosto de 2025', nota: 'Agosto también se entrega: el cliente no tiene por qué esperar a septiembre.' },
    },
    alvaro: {
      texto: 'Pasé por una empresa de inversión: hablaba con gente de todo tipo y enseñaba a invertir a mi círculo. Ahí aprendí lo que vale conocer gente y atreverse con cosas nuevas. Después vinieron un proyecto de redes, en el que entrevistaba a gente por la calle para explicar la inversión, y programar por mi cuenta.',
      foto: { src: 'alvaro5.webp', alto: 1199, pie: 'Con el perro', donde: 'Madrid', cuando: 'Otoño de 2025', nota: 'Preparando el primer gran cambio de ads. Pasear me ayudaba a pensar' },
    },
  },
  {
    titulo: 'Cómo nos conocimos',
    sebas: {
      provisional: true,
      pregunta: '¿Cómo os conocisteis, y cuándo decidisteis montar ads?',
      texto: 'En el proyecto de redes de Álvaro, por un amigo común. Él hacía que las cosas funcionaran y yo que se vieran bien, y enseguida vimos que lo uno sin lo otro se queda a medias. Montamos ads para que nadie tenga que buscar a dos equipos que no se hablan.',
      foto: { src: 'sebas4.webp', alto: 1600, pie: 'En el coche.', donde: 'Madrid', cuando: 'Otoño de 2024', nota: 'Saliendo de una reunión que fue bien. Escuchar primero y proponer después nunca falla.' },
    },
    alvaro: {
      texto: 'En ese proyecto de redes, por un amigo común. Sebas es de los tíos más majos y buenos que he conocido nunca, y curra casi tanto como yo, que es difícil de encontrar.',
      foto: { src: 'alvaro4.webp', alto: 1200, pie: 'La Giralda', donde: 'Sevilla', cuando: 'Semana Santa de 2025', nota: 'Viaje de trabajo con Sebas' },
    },
  },
  {
    titulo: 'Fuera del trabajo',
    sebas: {
      provisional: true,
      pregunta: '¿Hay algo de tu vida fuera del trabajo que se note en cómo trabajas?',
      texto: 'La fotografía, sobre todo en carrete: solo tienes 36 disparos, así que aprendes a mirar antes de apretar el botón. Y grabarlo todo: de ahí salen muchas de las ideas que acaban en las marcas de nuestros clientes.',
      foto: { src: 'sebas5.webp', alto: 1200, pie: 'Grabando en una cafetería.', donde: 'Alicante', cuando: 'Primavera de 2026', nota: 'Contenido para una marca: ahora lo que diseñamos también se mueve.' },
    },
    alvaro: {
      texto: 'El deporte, porque el esfuerzo siempre tiene recompensa. Y el piano, porque junta lo técnico y matemático con lo artístico, que es lo mismo que hacemos en ads.',
      foto: { src: 'alvaro1.webp', alto: 1351, pie: 'Surf', donde: 'Llanes', cuando: 'Verano de 2026', nota: 'Me caí más veces de las que me levanté. Con lo nuevo pasa igual: se aprende probando', provisional: true },
    },
  },
];

// Al final, lo que hace cada uno
export const CIERRE = {
  sebas: {
    provisional: true,
    pregunta: '¿Qué haces tú que el otro no sabe hacer?',
    texto: 'La marca de arriba abajo: el logo, los colores, cómo habla y cómo se ve en cada sitio. Y la dirección de arte de cada web, para que tu negocio no se parezca a ningún otro.',
  },
  alvaro: { texto: 'La IA, la informática, los servidores y todo lo que hay montado por dentro, para ads y para los clientes.' },
};
