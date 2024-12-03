import { FilmDto } from './dto/film-dto/film-dto';
import { Page } from '../../../../common/pagination/src/page';
import { Pageable } from '../../../../common/pagination/src/pageable';
import { createFilm, filmToDto } from './film';
import { FilmRepository } from './repository/film-repository';
import { CreateFilmDto } from './dto/create-film-dto/create-film-dto';

export type FilmFacade = {
  add(dto: CreateFilmDto): Promise<FilmDto>;
  findByTitle(title: string): Promise<FilmDto>;
  findById(id: string): Promise<FilmDto>;
  findAll(pageable: Pageable): Promise<Page<FilmDto>>;
};

export function createFilmFacade({
  filmRepository,
}: {
  filmRepository: FilmRepository;
}): FilmFacade {
  return {
    async add(createFilmDto) {
      const film = createFilm(createFilmDto);
      const savedFilm = await filmRepository.save(film);
      return filmToDto(savedFilm);
    },
    async findById(id: string) {
      const film = await filmRepository.findById(id);
      return filmToDto(film);
    },
    async findByTitle(title: string) {
      const film = await filmRepository.findByTitle(title);
      return filmToDto(film);
    },
    async findAll(pageable: Pageable) {
      const page = await filmRepository.findAll(pageable);
      return {
        ...page,
        items: page.items.map((film) => filmToDto(film)),
      };
    },
  };
}
