export class UnauthorizedActivityEditError extends Error {
  status = 403;
  constructor() {
    super("Insufficient permissions. Can't edit activity.");
  }
}

export class ActivityNotFoundError extends Error {
  status = 400;
  constructor() {
    super("Activity not found.");
  }
}
