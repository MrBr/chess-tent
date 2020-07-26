import { MiddlewareFunction } from "@types";
import { Lesson } from "@chess-tent/models";
import { LessonNotFoundError, UnauthorizedLessonEditError } from "./errors";
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
      if (lesson && lesson.owner.id === res.locals.user.id) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};
