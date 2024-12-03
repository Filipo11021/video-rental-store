import { Static } from '@sinclair/typebox';
import { filmTypeDtoSchema } from './film-type-dto-schema';

export type FilmTypeDto = Static<typeof filmTypeDtoSchema>;
