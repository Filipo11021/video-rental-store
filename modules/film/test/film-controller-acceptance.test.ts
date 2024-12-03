import { describe, test } from 'node:test';
import Fastify from 'fastify';
import assert from 'node:assert';
import { sampleFilmsToCreate } from './domain/samples-films';
import { createFilmConfiguration } from '../src/domain/film-configuration';

describe('film controller acceptance test', async () => {
  const fastify = Fastify();
  const { filmController, filmFacade } = createFilmConfiguration();
  await fastify.register(filmController);

  test('should get films', async () => {
    // given: we have two films in system
    const [filmA, filmB] = await Promise.all([
      filmFacade.add(sampleFilmsToCreate.inception),
      filmFacade.add(sampleFilmsToCreate.matrix),
    ]);

    // when: I go to /film/:title
    const getFilmResponse = await fastify.inject({
      method: 'GET',
      path: `/films/${filmA.title}`,
    });
    // then: I see details of that film
    assert(getFilmResponse.statusCode === 200);
    assert.deepEqual(JSON.parse(getFilmResponse.body), filmA);

    // when: I go to /films
    const getFilmsResponse = await fastify.inject({
      method: 'GET',
      path: '/films',
      query: {
        page: '0',
        size: '2',
      },
    });

    // then: I see all films
    const body = JSON.parse(getFilmsResponse.body).items;
    assert(getFilmsResponse.statusCode === 200);
    assert.deepEqual(body, [filmA, filmB]);
  });
});
