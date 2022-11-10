export class PasswordEncryptionError extends Error {
  constructor() {
    super('Something went wrong with password encryption.');
  }
}

export class InvalidUserFiltersError extends Error {
  status = 400;
  constructor() {
    super('Invalid user filters.');
  }
}

export class UserNotFoundError extends Error {
  status = 400;
  constructor() {
    super('User not found.');
  }
}

export class UserAlreadyExists extends Error {
  status = 400;
  constructor() {
    super('User already exists.');
  }
}

export class LoginFailedError extends Error {
  status = 400;
  constructor() {
    super('Invalid user credentials.');
  }
}
export class AccountNotActivatedError extends Error {
  status = 400;
  constructor() {
    super('Account not activated.');
  }
}
export class MissingContactDetailsError extends Error {
  status = 400;
  constructor() {
    super('Missing contact details.');
  }
}
