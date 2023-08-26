export class ZoomTokenNotFoundError extends Error {
  status = 404;
  constructor() {
    super('Zoom token not found.');
  }
}
