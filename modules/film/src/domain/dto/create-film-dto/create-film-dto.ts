import { Static } from '@sinclair/typebox';
import { createFilmDtoSchema } from './create-film-dto-schema';

export type CreateFilmDto = Static<typeof createFilmDtoSchema>;
