import { RentalRepository } from './rental-repository';
import {
  calculateNewReleasePrice,
  calculateOldFilmPrice,
  calculateRegularPrice,
} from './calculate-film-price';
import { FilmIsNotAvailable } from './film-is-not-available';
import { createRental, rentalToDto, updateRental } from './rental';
import { FilmFacade } from '@modules/film/film-facade';
import { RentalDto } from './dto/rental-dto/rental-dto';

export type RentalFacade = {
  calculatePrice(params: {
    filmId: string;
    durationInDays: number;
  }): Promise<{ price: number }>;
  rent(filmId: string): Promise<RentalDto>;
  return(rentalId: string): Promise<RentalDto>;
};

export function createRentalFacade({
  filmFacade,
  rentalRepository,
}: {
  filmFacade: FilmFacade;
  rentalRepository: RentalRepository;
}): RentalFacade {
  async function isFilmAvailable(filmId: string) {
    const isFilmRented = await rentalRepository.isFilmRented({ filmId });
    return !isFilmRented;
  }

  return {
    async rent(filmId) {
      const isAvailable = await isFilmAvailable(filmId);
      if (!isAvailable) throw new FilmIsNotAvailable(filmId);

      const newRental = createRental({ filmId });
      await rentalRepository.save(newRental);

      return rentalToDto(newRental);
    },
    async return(rentalId) {
      const rental = await rentalRepository.findOneBy('id', rentalId);
      if (!rental || rental.status !== 'rented') throw new Error();

      const updatedRental = updateRental({ ...rental, status: 'returned' });

      await rentalRepository.update(rental.id, updatedRental);
      return rentalToDto({ ...rental, ...updatedRental });
    },
    async calculatePrice({ filmId, durationInDays }) {
      const film = await filmFacade.findById(filmId);

      switch (film.type) {
        case 'new':
          return { price: calculateNewReleasePrice(durationInDays) };
        case 'regular':
          return { price: calculateRegularPrice(durationInDays) };
        case 'old':
          return { price: calculateOldFilmPrice(durationInDays) };
        default:
          throw new Error(`Unknown film type: ${film.type}`);
      }
    },
  };
}
