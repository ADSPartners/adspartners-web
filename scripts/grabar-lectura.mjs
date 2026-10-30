// Graba la lectura de la factura de la misión «Automatiza»: una llamada real a la API de Claude con la imagen de la
// factura de ejemplo (scripts/grabaciones/factura-ejemplo.png, la misma que se ve en la misión). Lo que contesta, lo
// que tarda y el modelo se guardan en src/data/lectura.json, que es lo que enseña la web (la web no llama a nadie).
// Se lanza una vez, con la clave en el entorno (ANTHROPIC_API_KEY):
//   node scripts/grabar-lectura.mjs
// Cuesta céntimos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const IMAGEN = path.join(aqui, 'grabaciones', 'factura-ejemplo.png');
const SALIDA = path.join(aqui, '..', 'src', 'data', 'lectura.json');
const MODELO = 'claude-opus-5-5';

const ESQUEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['proveedor', 'nif', 'numero', 'fecha', 'base', 'iva', 'total'],
  properties: {
    proveedor: { type: 'string', description: 'Razón social de quien emite la factura' },
    nif: { type: 'string' },
    numero: { type: 'string', description: 'Número de la factura' },
    fecha: { type: 'string', description: 'Fecha de la factura, AAAA-MM-DD' },
    base: { type: 'number', description: 'Base imponible, en euros' },
    iva: { type: 'number', description: 'Cuota de IVA, en euros' },
    total: { type: 'number', description: 'Total de la factura, en euros' },
  },
};

const cliente = new Anthropic();
const imagen = fs.readFileSync(IMAGEN).toString('base64');
const t0 = performance.now();
const r = await cliente.messages.create({
  model: MODELO,
  max_tokens: 4000,
  output_config: { effort: 'low', format: { type: 'json_schema', schema: ESQUEMA } },
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: imagen } },
      { type: 'text', text: 'Saca los datos de esta factura para apuntarla en la contabilidad.' },
    ],
  }],
});
const ms = Math.round(performance.now() - t0);
if (r.stop_reason !== 'end_turn') throw new Error(`La lectura no terminó bien (${r.stop_reason})`);
const leido = JSON.parse(r.content.find((b) => b.type === 'text').text);

const lectura = {
  grabada: true,
  ms,
  modelo: r.model,
  fecha: new Date().toISOString(),
  tokens: { entrada: r.usage.input_tokens, salida: r.usage.output_tokens },
  campos: { proveedor: leido.proveedor, fecha: leido.fecha, base: leido.base, iva: leido.iva, total: leido.total },
  extra: { nif: leido.nif, numero: leido.numero },
};
fs.writeFileSync(SALIDA, `${JSON.stringify(lectura, null, 2)}\n`);
console.log(`Leída en ${ms} ms con ${r.model}`, lectura.campos, lectura.tokens);
