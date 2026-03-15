import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const registerSwagger = async (app: FastifyInstance): Promise<void> => {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Kounter',
        description:
          'Kounter is a simple counter service for profile views, repo visits, and anything else you want to count.',
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

  await app.register(fastifySwaggerUI, { routePrefix: '/swagger' });
};
