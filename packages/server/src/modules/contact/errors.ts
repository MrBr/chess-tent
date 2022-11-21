export class MissingContactDetailsError extends Error {
  status = 400;
  constructor() {
    super('Missing contact details.');
  }
}
