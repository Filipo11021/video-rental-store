import { createFilmFacade } from './film-facade';
import { createInMemoryFilmRepository } from './repository/in-memory-film-repository';
import { Knex } from 'knex';
import { createFilmController } from '../film-controller';
import { FastifyInstance } from 'fastify';
import { createFilmRepository } from './repository/film-repository';

export function createFilmConfiguration(config?: { knex: Knex }) {
  const filmRepository = config?.knex
    ? createFilmRepository({ knex: config.knex })
    : createInMemoryFilmRepository();

  const filmFacade = createFilmFacade({ filmRepository });

  return {
    filmFacade,
    filmController: (fastify: FastifyInstance) =>
      createFilmController(fastify, { filmFacade: filmFacade }),
  };
}
