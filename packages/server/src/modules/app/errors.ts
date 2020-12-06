export class BadRequest extends Error {
  status = 400;
  constructor() {
    super("Bad request");
  }
}
