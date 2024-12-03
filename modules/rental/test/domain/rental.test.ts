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

    // when: calculating rental price for 3 days
    const price = await rentalFacade.calculatePrice({
      durationInDays: 3,
      filmId: film.id,
    });

    // then: system return correct rental price
    const expectedRentalPrice = 30;
    assert.deepStrictEqual(price, { price: expectedRentalPrice });
  });

  test('rent film', async () => {
    // given:  film is in the system
    const film = await filmFacade.add(sampleFilms.inception);

    // when: user rental film
    const rental = await rentalFacade.rent(film.id);

    const schema = Type.Object(
      {
        id: Type.String(),
        status: Type.Literal('rented'),
        filmId: Type.Literal(film.id),
      },
      { additionalProperties: false },
    );
    // then: film is rented
    assert.strictEqual(Value.Check(schema, rental), true);
  });

  test('return film', () => {
    // given:
    // when:
    // then:
  });

  test('list of rented films', () => {
    // given:
    // when:
    // then:
  });
});
