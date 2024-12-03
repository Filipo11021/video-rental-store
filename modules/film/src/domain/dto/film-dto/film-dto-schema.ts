import { Type } from '@sinclair/typebox';
import { filmTypeDtoSchema } from '../film-type-dto/film-type-dto-schema';

export const filmDtoSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  type: filmTypeDtoSchema,
});
