import { createInMemoryRepository } from '@common/db/repository';
import { RentalRepository } from './rental-repository';
import { Rental } from './rental';

export function createInMemoryRentalRepository(): RentalRepository {
  const store = new Map<Rental['id'], Rental>();
  const repository = createInMemoryRepository({ store, idColumn: 'id' });

  return {
    isFilmRented() {
      return false;
    },
    ...repository,
  };
}