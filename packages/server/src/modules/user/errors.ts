export class PasswordEncryptionError extends Error {
  constructor() {
    super("Something went wrong with password encryption.");
  }
}
