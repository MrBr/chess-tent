import { MiddlewareFunction } from "@types";
import { Lesson } from "@chess-tent/models";
import { service } from "@application";
import { UnauthorizedLessonEditError } from "./errors";

export const saveLesson: MiddlewareFunction = (req, res, next) => {
  service
    .saveSubject(req.body as Lesson)
    .then(subject => {
      res.locals.subject = subject;
      next();
    })
    .catch(next);
};

export const canEditLesson: MiddlewareFunction = (req, res, next) => {
  service
    .getSubject<Lesson>(res.locals.lesson.id)
    .then(subject => {
      if (subject.state.owner.id === res.locals.user.id) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};

export const sendLesson: MiddlewareFunction = (req, res) => {
  res.send(res.locals.subject);
};
