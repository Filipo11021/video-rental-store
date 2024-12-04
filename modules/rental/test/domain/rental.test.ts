import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert';
import { createFilmConfiguration } from '@modules/film/film-configuration';
import { RentalFacade } from '../../src/domain/rental-facade';
import { createRentalConfiguration } from '../../src/domain/rental-configuration';
import { FilmFacade } from '@modules/film/film-facade';
import { sampleFilms } from './sample-films';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

describe('Rental facade', () => {
  let rentalFacade: RentalFacade;
  let filmFacade: FilmFacade;

  beforeEach(() => {
    filmFacade = createFilmConfiguration().filmFacade;
    rentalFacade = createRentalConfiguration({ filmFacade }).rentalFacade;
  });

  test('calculate rental price', async () => {
    // given: film is in the system
    const film = await filmFacade.add(sampleFilms.inception);

    // When: calculating rental price for 3 days
    const price = await rentalFacade.calculatePrice({
      durationInDays: 3,
      filmId: film.id,
    });

    // then: system return correct rental price
    const expectedRentalPrice = 30;
    assert.deepStrictEqual(price, { price: expectedRentalPrice });
  });

  test('rent available film', async () => {
    // given: film is in the system
    const film = await filmFacade.add(sampleFilms.inception);

    // When: a user rents the film
    const rental = await rentalFacade.rent(film.id);

    const schema = Type.Object(
      {
        id: Type.String(),
        status: Type.Literal('rented'),
        filmId: Type.Literal(film.id),
      },
      { additionalProperties: false },
    );
    // then: the film is rented
    assert.strictEqual(Value.Check(schema, rental), true);
  });

  test('try to rent not available film', async () => {
    // Given: a film is already rented
    const film = await filmFacade.add(sampleFilms.inception);
    await rentalFacade.rent(film.id);

    // When: user attempts to rent the same film
    const rentFilm = () => rentalFacade.rent(film.id);

    // Then: the rental is rejected
    assert.rejects(rentFilm);
  });

  test('return film', async () => {
    // given: film is rented
    const film = await filmFacade.add(sampleFilms.inception);
    const rental = await rentalFacade.rent(film.id);
    // When: the user returns the rented film
    const returned = await rentalFacade.return(rental.id);
    // then: the film is returned
    assert.strictEqual(
      Value.Check(
        Type.Object(
          {
            id: Type.String(),
            status: Type.Literal('returned'),
            filmId: Type.Literal(film.id),
          },
          { additionalProperties: false },
        ),
        returned,
      ),
      true,
    );
  });

  test('list of rented films', () => {
    // given:
    // when:
    // then:
  });
});
