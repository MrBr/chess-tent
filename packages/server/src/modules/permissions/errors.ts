import { HttpStatusCode } from 'axios';

export class ForbiddenError extends Error {
  status = HttpStatusCode.Forbidden;

  constructor(
    userId: string,
    action: string,
    subjectType: string,
    subjectId: string,
  ) {
    super(
      `User ${userId} has no ${action} permissions over ${subjectType} ${subjectId}`,
    );
  }
}
