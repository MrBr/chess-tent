export class UnauthorizedStepEditError extends Error {
  status = 403;
  constructor() {
    super("Insufficient permissions. Can't edit step.");
  }
}

export class StepNotFoundError extends Error {
  status = 400;
  constructor() {
    super('Step not found.');
  }
}
