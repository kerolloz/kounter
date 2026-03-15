import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { createCountBadge } from './badge.ts';
import { counterDb } from './CounterDatabase.ts';
import { registerSwagger } from './swagger.ts';
import {
  badgeQuerySchema,
  envSchema,
  keyCountPairSchema,
  keyParamSchema,
} from './types.ts';

// Environment validation
const envResult = envSchema.safeParse(process.env);
if (!envResult.success) {
  console.error(
    '❌ Invalid environment variables:',
    envResult.error.flatten().fieldErrors,
  );
  process.exit(1);
}
const env = envResult.data;

const app = fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      details: error.issues,
    });
  }
  app.log.error(error);
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

await registerSwagger(app);

// Redirect root to the project repository
app.get('/', (_, reply) =>
  reply.redirect('https://github.com/kerolloz/kounter'),
);

const typed = app.withTypeProvider<ZodTypeProvider>();

// GET /count/:key — return current count without incrementing
typed.route({
  method: 'GET',
  url: '/count/:key',
  schema: {
    params: keyParamSchema,
    response: { 200: keyCountPairSchema },
    summary: 'Get the count of a key (JSON). Does not increment.',
    tags: ['count'],
  },
  handler: async (request, reply) => {
    const result = await counterDb.getCount(request.params.key);
    return reply.send(result);
  },
});

// GET /badge/:key — return SVG badge; increments by default
typed.route({
  method: 'GET',
  url: '/badge/:key',
  schema: {
    params: keyParamSchema,
    querystring: badgeQuerySchema,
    summary: 'Get the count of a key as an SVG badge. Increments by default.',
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
      message: `${cntPrefix}${count}${cntSuffix}`,
    });

    return reply
      .headers({
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
      })
      .send(badge);
  },
});

const start = async () => {
  try {
    await counterDb.initialize(env.DATABASE_URL);
    app.log.info('Connected to database');

    await app.listen({ host: '::', port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
const shutdown = async () => {
  app.log.info('Shutting down...');
  await app.close();
  await counterDb.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
