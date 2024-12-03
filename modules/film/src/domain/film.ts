import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film-dto/create-film-dto';
import { FilmDto } from './dto/film-dto/film-dto';
import { FilmTypeDto } from './dto/film-type-dto/film-type-dto';

export type Film = {
  id: string;
  title: string;
  type: FilmTypeDto;
  createdAt: string;
  updatedAt: string;
};

export function createFilm({ title, type }: CreateFilmDto): Film {
  return {
    id: randomUUID(),
    title,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function filmToDto({ title, type, id }: Film): FilmDto {
  return {
    id,
    title,
    type,
  };
}
