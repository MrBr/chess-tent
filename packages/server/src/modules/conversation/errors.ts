export class UnauthorizedConversationEditError extends Error {
  status = 403;
  constructor() {
    super("Insufficient permissions. Can't edit conversation.");
  }
}
