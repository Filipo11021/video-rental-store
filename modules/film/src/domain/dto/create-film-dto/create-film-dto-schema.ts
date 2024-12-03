import { Type } from '@sinclair/typebox';
import { filmTypeDtoSchema } from '../film-type-dto/film-type-dto-schema';

export const createFilmDtoSchema = Type.Object({
  title: Type.String(),
  type: filmTypeDtoSchema,
});
