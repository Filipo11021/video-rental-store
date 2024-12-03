import { beforeEach, describe, test } from 'node:test';
import { sampleFilmsToCreate } from './samples-films';
import assert from 'node:assert';
import { FilmNotFoundError } from '../../src/domain/dto/film-not-found-error';
import { FilmFacade } from '../../src/domain/film-facade';
import { createFilmConfiguration } from '../../src/domain/film-configuration';

describe('Film facade', () => {
  let filmFacade: FilmFacade;

  beforeEach(() => {
    filmFacade = createFilmConfiguration().filmFacade;
  });

  test('should find a film by title', async () => {
    // given: film is in the system
    const film = await filmFacade.add(sampleFilmsToCreate.inception);

    // expect: system return the film
    const result = await filmFacade.findByTitle(
      sampleFilmsToCreate.inception.title,
    );
    assert.deepStrictEqual(result, film);
  });

  test('should find a film by id', async () => {
    // given: film is in the system
    const film = await filmFacade.add(sampleFilmsToCreate.inception);

    // expect: system return the film
    const result = await filmFacade.findById(film.id);
    assert.deepStrictEqual(result, film);
  });

  test("should throw exception when asked for a film that's not in the system", async () => {
    await assert.rejects(async () => {
      // when: system is asked for a film that is not present
      await filmFacade.findByTitle("some title we don't have");
    }, FilmNotFoundError);
  });

  test('should list films', async () => {
    // given: we have two films in system
    const [inception, matrix] = await Promise.all([
      filmFacade.add(sampleFilmsToCreate.inception),
      filmFacade.add(sampleFilmsToCreate.matrix),
    ]);

    // when: "we ask for all films"
    const foundFilms = await filmFacade.findAll({ page: 0, size: 10 });

    // then: "system returns the films we have added"
    assert(foundFilms.items.some(({ title }) => title === inception.title));
    assert(foundFilms.items.some(({ title }) => title === matrix.title));
  });
});
