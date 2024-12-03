import { Film } from '../film';
import { Page } from '../../../../../common/pagination/src/page';
import { Pageable } from '../../../../../common/pagination/src/pageable';
import { FilmNotFoundError } from '../dto/film-not-found-error';
import { Knex } from 'knex';

export interface FilmRepository {
  save(film: Film): Promise<Film>;
  findById(id: string): Promise<Film>;
  findByTitle(title: string): Promise<Film>;
  findAll(pageable: Pageable): Promise<Page<Film>>;
}

export function createFilmRepository({ knex }: { knex: Knex }): FilmRepository {
  return {
    async save(film: Film): Promise<Film> {
      await knex('films').insert(film);
      return film;
    },

    async findById(id: string): Promise<Film> {
      const result = await knex<Film>('films')
        .select('*')
        .where({ id })
        .first()
        .timeout(5000);

      if (!result) {
        throw new FilmNotFoundError(id);
      }

      return result;
    },

    async findByTitle(title: string): Promise<Film> {
      const result = await knex<Film>('films')
        .select('*')
        .where({ title })
        .first()
        .timeout(5000);

      if (!result) {
        throw new FilmNotFoundError(title);
      }

      return result;
    },

    async findAll(pageable: Pageable): Promise<Page<Film>> {
      const offset = pageable.page * pageable.size;

      const [items, totalItems] = await Promise.all([
        knex<Film>('films').select('*').offset(offset).limit(pageable.size),
        knex('films')
          .count('* as count')
          .first()
          .then((result) => Number(result?.count || 0)),
      ]);

      return {
        items,
        totalItems,
        page: pageable.page,
        size: pageable.size,
      };
    },
  };
}
