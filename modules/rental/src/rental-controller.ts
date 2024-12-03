import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { RentalFacade } from './domain/rental-facade';
import { rentalDtoSchema } from './domain/dto/rental-dto/rental-dto-schema';

export const createRentalController: FastifyPluginAsyncTypebox<{
  rentalFacade: RentalFacade;
}> = async function (fastify, { rentalFacade }) {
  fastify.post(
    '/rental',
    {
      schema: {
        body: Type.Object({ filmId: Type.String() }),
        response: {
          200: rentalDtoSchema,
        },
      },
    },
    async (req) => {
      const { filmId } = req.body;
      return rentalFacade.rent(filmId);
    },
  );

  fastify.post('/rental/return', () => {
    return 'post:return';
  });

  fastify.post(
    '/rental/price',
    {
      schema: {
        body: Type.Object({
          filmId: Type.String(),
          durationInDays: Type.Integer(),
        }),
        response: {
          200: Type.Object({ price: Type.Integer() }),
        },
      },
    },
    (req) => {
      const { filmId, durationInDays } = req.body;
      return rentalFacade.calculatePrice({ filmId, durationInDays });
    },
  );

  fastify.get('/rental', () => {
    return 'get:rental-list';
  });
};
