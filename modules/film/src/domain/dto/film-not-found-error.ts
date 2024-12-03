export class FilmNotFoundError extends Error {
  constructor(id: string) {
    super(`No film found: ${id}`);

    this.name = 'FilmNotFoundException';
  }
}
