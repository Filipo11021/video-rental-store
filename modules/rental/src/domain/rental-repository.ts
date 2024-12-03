import { Rental } from './rental';
import {
  Repository,
  createRepository,
} from '@common/db/repository';
import { Knex } from 'knex';

export type RentalRepository = Pick<
  Repository<Rental, 'id'>,
  'save' | 'update' | 'findOneBy'
> & {
  isFilmRented(params: { filmId: string }): boolean;
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
    isFilmRented() {
      return true;
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
