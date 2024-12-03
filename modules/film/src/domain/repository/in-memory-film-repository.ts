import { FilmNotFoundError } from '../dto/film-not-found-error';
import { Film } from '../film';
import { FilmRepository } from './film-repository';
import { Page } from '../../../../../common/pagination/src/page';
import { Pageable } from '../../../../../common/pagination/src/pageable';

export function createInMemoryFilmRepository(): FilmRepository {
  const films: Map<string, Film> = new Map();

  return {
    async save(film: Film): Promise<Film> {
      films.set(film.id, film);
      return film;
    },

    async findById(id) {
      const film = films.get(id);
      if (!film) throw new FilmNotFoundError(id);
      return film;
    },

    async findByTitle(title) {
      const film =
        Array.from(films.values()).find((film) => film.title === title) || null;
      if (!film) throw new FilmNotFoundError(title);
      return film;
    },

    async findAll(pageable: Pageable): Promise<Page<Film>> {
      const arrayOfFilms = Array.from(films.values());
      const start = pageable.page * pageable.size;
      const items = arrayOfFilms.slice(start, start + pageable.size);

      return {
        items,
        totalItems: arrayOfFilms.length,
        page: pageable.page,
        size: pageable.size,
      };
    },
  };
}
