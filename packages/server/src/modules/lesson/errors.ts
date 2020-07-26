export class UnauthorizedLessonEditError extends Error {
  status = 403;
  constructor() {
    super("Insufficient permissions. Can't edit lesson.");
  }
}

export class LessonNotFoundError extends Error {
  status = 400;
  constructor() {
    super("Lesson not found.");
  }
}
