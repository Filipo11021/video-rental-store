export class FilmIsNotAvailable extends Error {
  constructor(filmId: string) {
    super(filmId);
  }
}
