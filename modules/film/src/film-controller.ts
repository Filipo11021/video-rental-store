import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { filmDtoSchema } from './domain/dto/film-dto/film-dto-schema';
import { pageSchema } from '../../../common/pagination/src/page';
import { pageableSchema } from '../../../common/pagination/src/pageable';
import { FilmFacade } from './domain/film-facade';

export const createFilmController: FastifyPluginAsyncTypebox<{
  filmFacade: FilmFacade;
}> = async function (fastify, { filmFacade }) {
  fastify.get(
    '/films',
    {
      schema: {
        querystring: pageableSchema,
        response: {
          200: pageSchema(filmDtoSchema),
        },
      },
    },
    function (req) {
      const { page, size } = req.query;

      return filmFacade.findAll({
        page,
        size,
      });
    },
  );

  fastify.get(
    '/films/:title',
    {
      schema: {
        params: Type.Object({ title: Type.String() }),
        response: { 200: filmDtoSchema },
      },
    },
    function (req) {
      const { title } = req.params;
      return filmFacade.findByTitle(title);
    },
  );
};
