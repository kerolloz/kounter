import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError, z } from 'zod';
import { createCountBadge } from './badge';
import { counterDb } from './counter';

const app = fastify();
const githubRepo = 'https://github.com/kerolloz/kounter' as const;
const kounterRequestSchema = {
  params: z.object({ key: z.string() }),
  querystring: z.object({
    style: z
      .enum(['flat', 'plastic', 'flat-square', 'for-the-badge', 'social'])
      .default('flat'),
    label: z.string().optional(),
    labelColor: z.string().default(''),
    color: z.string().default(''),
    cntPrefix: z.string().default(''),
    cntSuffix: z.string().default(''),
    silent: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
  }),
} as const;

app.get('/', async (_, reply) => reply.redirect(githubRepo));
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/count/:key',
  schema: kounterRequestSchema,
  handler: async (request, reply) =>
    reply.send(await counterDb.getCount(request.params.key)),
});
app.withTypeProvider<ZodTypeProvider>().route({
  method: 'GET',
  url: '/badge/:key',
  schema: kounterRequestSchema,
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
      .code(200)
      .headers({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
      })
      .send(badge);
  },
});

app.setErrorHandler((error, _, reply) =>
  error instanceof ZodError
    ? reply.status(400).send({ message: 'Bad Request', error: error.issues })
    : reply.send(error),
);

app.listen({ port: +(process.env.PORT ?? 3000), host: '::' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
