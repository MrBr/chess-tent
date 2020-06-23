export class UnauthorizedLessonEditError extends Error {
  constructor() {
    super("Insufficient permissions. Can't edit lesson.");
  }
}
