import { Type } from '@sinclair/typebox';

export const filmTypeDtoSchema = Type.Union([
  Type.Literal('old'),
  Type.Literal('new'),
  Type.Literal('regular'),
]);
