import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { createCountBadge } from './badge';
import { counterDb } from './counter';
import { registerSwagger } from './swagger';
import { keyCountPair, kounterRequestSchema } from './types';

const app = fastify();

app.get('/', async (_, reply) =>
  reply.redirect('https://github.com/kerolloz/kounter'),
);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

registerSwagger(app);

app.setErrorHandler((error, _, reply) =>
  error instanceof ZodError
    ? reply.status(400).send({ message: 'Bad Request', error: error.issues })
    : reply.send(error),
);

app.after(() => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/count/:key',
    schema: {
      params: kounterRequestSchema.params,
      response: { 200: keyCountPair },
      summary: 'Get the count of a key (JSON format). No increment.',
      tags: ['count'],
    },
    handler: async (request, reply) =>
      reply.send(await counterDb.getCount(request.params.key)),
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/badge/:key',
    schema: {
      ...kounterRequestSchema,
      summary: 'Get the count of a key (SVG format). Increment by default.',
      tags: ['badge'],
    },
    handler: async (request, reply) => {
      const { key } = request.params;
      const {
        style,
        label = key,
        labelColor,
        color,
        cntPrefix,
        cntSuffix,
        silent,
      } = request.query;

      const { count } = await (silent
        ? counterDb.getCount(key)
        : counterDb.incrementCount(key));

      const badge = createCountBadge({
        style,
        label,
        labelColor,
        color,
        message: cntPrefix + count + cntSuffix,
      });

      return reply
        .headers({
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
        })
        .send(badge);
    },
  });
});

app.listen(
  { port: +(process.env.PORT ?? 3000), host: '::' },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
