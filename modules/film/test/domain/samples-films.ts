import { CreateFilmDto } from '../../src/domain/dto/create-film-dto/create-film-dto';

export const sampleFilmsToCreate = {
  inception: { title: 'Inception', type: 'new' },
  matrix: { title: 'The Matrix', type: 'old' },
} satisfies Record<string, CreateFilmDto>;
