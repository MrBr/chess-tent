import { MiddlewareFunction } from "@types";
import { Lesson } from "@chess-tent/models";
import { LessonNotFoundError, UnauthorizedLessonEditError } from "./errors";
import * as service from "./service";

export const saveLesson: MiddlewareFunction = (req, res, next) => {
  service
    .saveLesson(res.locals.lesson as Lesson)
    .then(next)
    .catch(next);
};

export const patchLesson: MiddlewareFunction = (req, res, next) => {
  service
    .patchLesson(res.locals.lesson.id, res.locals.lesson)
    .then(next)
    .catch(next);
};

export const updateLesson: MiddlewareFunction = (req, res, next) => {
  service
    .updateLessonSteps(res.locals.lesson.id, res.locals.update)
    .then(next)
    .catch(next);
};

export const getLesson: MiddlewareFunction = (req, res, next) => {
  service
    .getLesson(res.locals.lesson.id as Lesson["id"])
    .then(lesson => {
      if (!lesson) {
        throw new LessonNotFoundError();
      }
      res.locals.lesson = lesson;
      next();
    })
    .catch(next);
};

export const findLessons: MiddlewareFunction = (req, res, next) => {
  service
    .findLessons(res.locals.filters)
    .then(lessons => {
      if (!lessons) {
        throw new LessonNotFoundError();
      }
      res.locals.lessons = lessons;
      next();
    })
    .catch(next);
};

export const canEditLesson: MiddlewareFunction = (req, res, next) => {
  service
    .getLesson(res.locals.lesson.id)
    .then(lesson => {
      if (!lesson || lesson.owner.id === res.locals.user.id) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};
