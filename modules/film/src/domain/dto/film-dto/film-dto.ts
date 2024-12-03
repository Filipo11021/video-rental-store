import { Static } from '@sinclair/typebox';
import { filmDtoSchema } from './film-dto-schema';

export type FilmDto = Static<typeof filmDtoSchema>;
