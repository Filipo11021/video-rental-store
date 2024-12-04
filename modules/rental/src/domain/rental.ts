import { randomUUID } from 'crypto';
import { RentalDto } from './dto/rental-dto/rental-dto';
import { RentalStatusDto } from './dto/rental-status-dto/rental-status-dto';

export type Rental = {
  id: string;
  filmId: string;
  status: RentalStatusDto;
  createdAt: string;
  updatedAt: string;
};

export function createRental({ filmId }: { filmId: string }): Rental {
  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    filmId,
    status: 'rented',
  };
}

export function updateRental(data: Partial<Rental>): Partial<Rental> {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
  };
}

export function rentalToDto({ filmId, id, status }: Rental): RentalDto {
  return {
    filmId,
    status,
    id,
  };
}
