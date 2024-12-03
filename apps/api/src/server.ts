import Fastify from 'fastify';
import { env } from './env';
import { swaggerPlugin } from './plugins/swagger-plugin';
import { createFilmConfiguration } from '@modules/film/film-configuration';
import { createRentalConfiguration } from '@modules/rental/rental-configuration';

main();
async function main() {
  const fastify = Fastify({ logger: true });

  fastify.get('/', () => {
    return 'hello';
  });

  await fastify.register(swaggerPlugin);

  const { filmController, filmFacade } = createFilmConfiguration();
  await fastify.register(filmController);

  const { rentalController } = createRentalConfiguration({ filmFacade });
  await fastify.register(rentalController);

  fastify.listen({
    port: Number(env.PORT),
  });
}
