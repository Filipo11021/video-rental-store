import { Static } from '@sinclair/typebox';
import { rentalDtoSchema } from './rental-dto-schema';

export type RentalDto = Static<typeof rentalDtoSchema>;
