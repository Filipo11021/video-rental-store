import { describe, test } from 'node:test';
import Fastify from 'fastify';
import assert from 'node:assert';
import { createFilmConfiguration } from '@modules/film/film-configuration';
import { createRentalConfiguration } from '../src/domain/rental-configuration';
import { Value } from '@sinclair/typebox/value';
import { Type } from '@sinclair/typebox';

describe('rental controller acceptance test', async () => {
  const fastify = Fastify();
  const { filmFacade } = createFilmConfiguration();
  const { rentalController } = createRentalConfiguration({
    filmFacade,
  });
  await fastify.register(rentalController);

  test('rental process', async () => {
    // given: film is in the system
    const [oldFilm] = await Promise.all([
      filmFacade.add({ title: 'halo', type: 'old' }),
    ]);

    // when: I request the rental price
    const getCalculatePriceResponse = await fastify.inject({
      method: 'POST',
      path: `/rental/price`,
      body: {
        filmId: oldFilm.id,
        durationInDays: 3,
      },
    });
    // then: I should see the price for the rental
    assert.strictEqual(getCalculatePriceResponse.statusCode, 200);
    assert.deepEqual(JSON.parse(getCalculatePriceResponse.body), { price: 30 });

    // when: I want to rent a film
    const postRentalResponse = await fastify.inject({
      method: 'POST',
      path: '/rental',
      body: {
        filmId: oldFilm.id,
      },
    });
    // then: the film should be rented
    assert.strictEqual(postRentalResponse.statusCode, 200);
    const rentalBody = JSON.parse(postRentalResponse.body);
    const parsedRentalBody = Value.Parse(
      Type.Object(
        {
          id: Type.String(),
          status: Type.Literal('rented'),
          filmId: Type.Literal(oldFilm.id),
        },
        { additionalProperties: false },
      ),
      rentalBody,
    );

    // when: I want to return the previously rented film
    const postReturnFilmResponse = await fastify.inject({
      method: 'POST',
      path: '/rental/return',
      body: {
        rentalId: parsedRentalBody.id,
      },
    });
    // then: the film should be successfully returned
    assert.strictEqual(postReturnFilmResponse.statusCode, 200);
  });
});
