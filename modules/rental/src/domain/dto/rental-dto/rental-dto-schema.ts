import { Type } from '@sinclair/typebox';
import { rentalStatusDtoSchema } from '../rental-status-dto/rental-status-dto-schema';

export const rentalDtoSchema = Type.Object({
  id: Type.String(),
  status: rentalStatusDtoSchema,
  filmId: Type.String(),
});
