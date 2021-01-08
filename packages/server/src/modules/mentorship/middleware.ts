import { MiddlewareFunction } from '@types';
import * as service from './service';

export const requestMentorship: MiddlewareFunction = (req, res, next) => {
  service
    .requestMentorship(res.locals.studentId, res.locals.coachId)
    .then(mentorship => {
      res.locals.mentorship = mentorship;
      next();
    })
    .catch(next);
};

export const resolveMentorshipRequest: MiddlewareFunction = (
  req,
  res,
  next,
) => {
  service
    .resolveMentorshipRequest(
      res.locals.studentId,
      res.locals.coachId,
      res.locals.approved,
    )
    .then(next)
    .catch(next);
};

export const getStudents: MiddlewareFunction = (req, res, next) => {
  service
    .getStudents(res.locals.coachId)
    .then(students => {
      res.locals.students = students;
      next();
    })
    .catch(next);
};

export const getCoaches: MiddlewareFunction = (req, res, next) => {
  service
    .getCoaches(res.locals.studentId)
    .then(coaches => {
      res.locals.coaches = coaches;
      next();
    })
    .catch(next);
};
