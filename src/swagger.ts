import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const registerSwagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Kounter',
        description:
          'Kounter is a simple counter service that can be used in a variety of ways.',
        contact: {
          name: 'Kerollos Magdy',
          url: 'https://kounter.kerolloz.dev',
          email: 'kerolloz@yahoo.com',
        },
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUI, { routePrefix: '/swagger' });
};
