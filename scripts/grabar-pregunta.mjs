// Graba al asistente de la misión de «Observa»: para cada pregunta, una ejecución real de Claude con dos herramientas,
// consultar_ventas (la de src/data/negocio.js, sobre los datos de la cafetería de ejemplo) y responder (la respuesta
// final: frase, cifra y gráfica). Se guarda todo lo que hizo (consultas, resultados, respuesta, tiempos y tokens) en
// src/data/preguntas.json, que es lo que la web reproduce (la web no llama a nadie).
// Se lanza una vez, con la clave en el entorno (ANTHROPIC_API_KEY):
//   node scripts/grabar-pregunta.mjs
// Cuesta unos céntimos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { NEGOCIO, consultarVentas } from '../src/data/negocio.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.join(aqui, '..', 'src', 'data', 'preguntas.json');
const MODELO = 'claude-opus-5-5';
const PREGUNTAS = [
  '¿Cuánto vendimos en octubre?',
  '¿Qué fue lo que más vendimos en octubre?',
  '¿Vamos mejor que en septiembre?',
];

const SISTEMA = `Eres el asistente de datos de ${NEGOCIO.nombre}, una cafetería. Hoy es 31 de octubre de 2026 y el día ya está cerrado; hay datos de ventas del 1 de septiembre al 31 de octubre de 2026.
No te sabes ninguna cifra: sácalas siempre con consultar_ventas. Cuando ya tengas los datos, llama a responder (en un turno aparte, una sola vez) con:
- una frase corta en español de España, de tú, con la cifra que importa (máximo 160 caracteres);
- la cifra principal, formateada como en España (p. ej. «26.843 €» o «+8 %»);
- una gráfica de barras pequeña que la explique (de 2 a 7 barras, etiquetas cortas).`;

const HERRAMIENTAS = [
  {
    name: 'consultar_ventas',
    description: 'Suma las ventas de la cafetería entre dos fechas (incluidas) y las agrupa por día, semana, mes o producto. Devuelve la consulta SQL que se ha hecho, las filas (grupo, importe en euros y unidades) y el total.',
    input_schema: {
      type: 'object',
      properties: {
        desde: { type: 'string', description: 'Primer día, AAAA-MM-DD' },
        hasta: { type: 'string', description: 'Último día, AAAA-MM-DD' },
        agrupar_por: { type: 'string', enum: ['dia', 'semana', 'mes', 'producto'] },
      },
      required: ['desde', 'hasta', 'agrupar_por'],
      additionalProperties: false,
    },
  },
  {
    name: 'responder',
    description: 'La respuesta final para la persona: la frase, la cifra principal y la gráfica.',
    input_schema: {
      type: 'object',
      properties: {
        texto: { type: 'string' },
        cifra: { type: 'string' },
        grafica: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            etiquetas: { type: 'array', items: { type: 'string' } },
            valores: { type: 'array', items: { type: 'number' } },
          },
          required: ['titulo', 'etiquetas', 'valores'],
          additionalProperties: false,
        },
      },
      required: ['texto', 'cifra', 'grafica'],
      additionalProperties: false,
    },
  },
];

const cliente = new Anthropic();

async function preguntar(pregunta) {
  const mensajes = [{ role: 'user', content: pregunta }];
  const pasos = [];
  const tokens = { entrada: 0, salida: 0 };
  const t0 = performance.now();
  for (let vuelta = 0; vuelta < 6; vuelta++) {
    const t1 = performance.now();
    const r = await cliente.messages.create({
      model: MODELO,
      max_tokens: 4000,
      system: SISTEMA,
      tools: HERRAMIENTAS,
      output_config: { effort: 'low' },
      messages: mensajes,
    });
    const ms = Math.round(performance.now() - t1);
    tokens.entrada += r.usage.input_tokens;
    tokens.salida += r.usage.output_tokens;
    const usos = r.content.filter((b) => b.type === 'tool_use');
    const final = usos.find((u) => u.name === 'responder');
    const consultas = usos.filter((u) => u.name === 'consultar_ventas');
    if (final && !consultas.length) {
      return { pregunta, ms: Math.round(performance.now() - t0), modelo: r.model, tokens, pasos, respuesta: final.input, msRespuesta: ms };
    }
    if (!usos.length) {
      mensajes.push({ role: 'assistant', content: r.content }, { role: 'user', content: 'Llama a responder con la respuesta.' });
      continue;
    }
    mensajes.push({ role: 'assistant', content: r.content });
    const resultados = usos.map((u) => {
      if (u.name !== 'consultar_ventas') return { type: 'tool_result', tool_use_id: u.id, content: 'Primero mira los datos; llama a responder después, en otro turno.' };
      const res = consultarVentas(u.input);
      pasos.push({ entrada: u.input, consulta: res.consulta, filas: res.filas.length, total: res.total.importe, ms });
      return { type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(res) };
    });
    mensajes.push({ role: 'user', content: resultados });
  }
  throw new Error(`«${pregunta}»: el asistente no llegó a responder`);
}

const grabadas = [];
let modelo = MODELO;
for (const p of PREGUNTAS) {
  const g = await preguntar(p);
  modelo = g.modelo;
  delete g.modelo;
  const { etiquetas, valores } = g.respuesta.grafica;
  if (etiquetas.length !== valores.length || !valores.length) throw new Error(`«${p}»: la gráfica no cuadra`);
  grabadas.push(g);
  console.log(`\n${p}  (${g.ms} ms, ${g.pasos.length} consulta${g.pasos.length === 1 ? '' : 's'})`);
  for (const s of g.pasos) console.log('  ·', JSON.stringify(s.entrada), '→', s.total, '€');
  console.log('  →', g.respuesta.texto, '|', g.respuesta.cifra, '|', JSON.stringify(g.respuesta.grafica));
}
fs.writeFileSync(SALIDA, `${JSON.stringify({ grabada: true, modelo, fecha: new Date().toISOString(), negocio: NEGOCIO.nombre, preguntas: grabadas }, null, 2)}\n`);
console.log(`\nGuardado en ${path.relative(process.cwd(), SALIDA)}`);
