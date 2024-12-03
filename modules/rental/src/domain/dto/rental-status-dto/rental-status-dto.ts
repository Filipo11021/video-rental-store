import { Static } from '@sinclair/typebox';
import { rentalStatusDtoSchema } from './rental-status-dto-schema';

export type RentalStatusDto = Static<typeof rentalStatusDtoSchema>;
