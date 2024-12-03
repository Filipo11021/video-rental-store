import fp from 'fastify-plugin';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUi from '@fastify/swagger-ui';

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(FastifySwagger, {
    openapi: {
      info: {
        title: 'demo fastify',
        version: '1',
      },
    },
  });

  await fastify.register(FastifySwaggerUi, {
    routePrefix: '/docs',
  });
});
