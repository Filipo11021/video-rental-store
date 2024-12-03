import { RentalRepository } from './rental-repository';
import {
  calculateNewReleasePrice,
  calculateOldFilmPrice,
  calculateRegularPrice,
} from './calculate-film-price';
import { FilmIsNotAvailable } from './film-is-not-available';
import { createRental, rentalToDto } from './rental';
import { FilmFacade } from '@modules/film/film-facade';
import { RentalDto } from './dto/rental-dto/rental-dto';

export type RentalFacade = {
  calculatePrice(params: {
    filmId: string;
    durationInDays: number;
  }): Promise<{ price: number }>;
  rent(filmId: string): Promise<RentalDto>;
  return(filmId: string): Promise<void>;
};

export function createRentalFacade({
  filmFacade,
  rentalRepository,
}: {
  filmFacade: FilmFacade;
  rentalRepository: RentalRepository;
}): RentalFacade {
  async function isFilmAvailable(filmId: string) {
    return rentalRepository.isFilmRented({ filmId });
  }

  return {
    async rent(filmId) {
      const isAvailable = isFilmAvailable(filmId);
      if (!isAvailable) throw new FilmIsNotAvailable(filmId);

      const newRental = createRental({ filmId });
      await rentalRepository.save(newRental);

      return rentalToDto(newRental);
    },
    async return() {},
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
