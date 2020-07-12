import { MiddlewareFunction } from "@types";
import { Lesson } from "@chess-tent/models";
import { UnauthorizedLessonEditError } from "./errors";
import * as service from "./service";

export const saveLesson: MiddlewareFunction = (req, res, next) => {
  service
    .saveLesson(req.body as Lesson)
    .then(lesson => {
      res.locals.lesson = lesson;
      next();
    })
    .catch(next);
};

export const canEditLesson: MiddlewareFunction = (req, res, next) => {
  service
    .getLesson(res.locals.lesson.id)
    .then(lesson => {
      if (lesson.owner.id === res.locals.user.id) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};

export const sendLesson: MiddlewareFunction = (req, res) => {
  res.send(res.locals.lesson);
};
