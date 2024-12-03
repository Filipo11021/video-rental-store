import { FilmFacade } from '@modules/film/film-facade';
import { Knex } from 'knex';
import { createInMemoryRentalRepository } from './in-memory-rental-repository';
import { createRentalFacade } from './rental-facade';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createRentalController } from '../rental-controller';
import { createRentalRepository } from './rental-repository';

export function createRentalConfiguration({
  filmFacade,
  knex,
}: {
  knex?: Knex;
  filmFacade: FilmFacade;
}) {
  const rentalRepository = knex
    ? createRentalRepository({ knex })
    : createInMemoryRentalRepository();
  const rentalFacade = createRentalFacade({ rentalRepository, filmFacade });

  const rentalController: FastifyPluginAsyncTypebox = (fastify) =>
    createRentalController(fastify, { rentalFacade });

  return {
    rentalFacade,
    rentalController,
  };
}
