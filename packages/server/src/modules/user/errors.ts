export class PasswordEncryptionError extends Error {
  constructor() {
    super("Something went wrong with password encryption.");
  }
}

export class InvalidUserFiltersError extends Error {
  status = 400;
  constructor() {
    super("Invalid user filters.");
  }
}

export class UserNotFoundError extends Error {
  status = 400;
  constructor() {
    super("User not found.");
  }
}

export class LoginFailedError extends Error {
  status = 400;
  constructor() {
    super("Invalid user credentials.");
  }
}
