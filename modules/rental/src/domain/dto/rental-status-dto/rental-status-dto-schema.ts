import { Type } from '@sinclair/typebox';

export const rentalStatusDtoSchema = Type.Union([
  Type.Literal('rented'),
  Type.Literal('returned'),
]);
