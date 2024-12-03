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
    // given: we film with new type in system
    const [oldFilm] = await Promise.all([
      filmFacade.add({ title: 'halo', type: 'old' }),
    ]);

    // when: I go to /rental/calculate-price
    const getCalculatePriceResponse = await fastify.inject({
      method: 'POST',
      path: `/rental/price`,
      body: {
        filmId: oldFilm.id,
        durationInDays: 3,
      },
    });
    // then: I see price for the film
    assert.strictEqual(getCalculatePriceResponse.statusCode, 200);
    assert.deepEqual(JSON.parse(getCalculatePriceResponse.body), { price: 30 });

    // when: user want rent film
    const postRentalResponse = await fastify.inject({
      method: 'POST',
      path: '/rental',
      body: {
        filmId: oldFilm.id,
      },
    });
    assert.strictEqual(postRentalResponse.statusCode, 200);
    assert.strictEqual(
      Value.Check(
        Type.Object({
          id: Type.String(),
          status: Type.Literal('rented'),
          filmId: Type.Literal(oldFilm.id),
        }),
        JSON.parse(postRentalResponse.body),
      ),
      true,
    );
  });
});
