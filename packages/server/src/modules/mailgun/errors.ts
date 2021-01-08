export class FailedToSendMAil extends Error {
  status = 500;
  constructor() {
    super('Failed to send mail.');
  }
}
