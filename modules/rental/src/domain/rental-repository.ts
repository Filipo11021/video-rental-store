import { Rental } from './rental';
import { Repository, createRepository } from '@common/db/repository';
import { Knex } from 'knex';

export type RentalRepository = Pick<
  Repository<Rental, 'id'>,
  'save' | 'update' | 'findOneBy'
> & {
  isFilmRented(params: { filmId: string }): Promise<boolean>;
};

export function createRentalRepository({
  knex,
}: {
  knex: Knex;
}): RentalRepository {
  const repository = createRepository<Rental, 'id'>({
    knex,
    idColumn: 'id',
    tableName: 'rentals',
  });

  return {
    async isFilmRented({ filmId }) {
      const result = await knex('rentals')
        .where({ filmId, status: 'rented' })
        .first();

      return !!result;
    },
    ...repository,
  };
}

// export interface FilmRepository {
//   save(film: Film): Promise<Film>;
//   findById(title: string): Promise<Film | null>;
//   findAll(pageable: Pageable): Promise<Page<Film>>;
//   findOneOrThrow(title: string): Promise<Film>;
// }
