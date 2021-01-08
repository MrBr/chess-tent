export class UnauthorizedError extends Error {
  status = 401;
  constructor() {
    super('Unauthorized request');
  }
}
