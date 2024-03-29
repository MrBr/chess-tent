import { MiddlewareFunction } from '@types';
import { Lesson } from '@chess-tent/models';
import { LessonNotFoundError, UnauthorizedLessonEditError } from './errors';
import * as service from './service';

export const saveLesson: MiddlewareFunction = (req, res, next) => {
  service
    .saveLesson(res.locals.lesson as Lesson)
    .then(next)
    .catch(next);
};

export const publishLesson: MiddlewareFunction = (req, res, next) => {
  service.publishLesson(res.locals.lesson.id).then(next).catch(next);
};

export const unpublishLesson: MiddlewareFunction = (req, res, next) => {
  service.unpublishLesson(res.locals.lesson.id).then(next).catch(next);
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
    .getLesson(res.locals.lesson.id as Lesson['id'])
    .then(lesson => {
      if (!lesson) {
        throw new LessonNotFoundError();
      }
      res.locals.lesson = lesson;
      next();
    })
    .catch(next);
};

export const getLessonChapters: MiddlewareFunction = (req, res, next) => {
  service
    .getLessonChapters(
      res.locals.lesson.id as Lesson['id'],
      res.locals.chapterIds,
    )
    .then(chapters => {
      res.locals.chapters = chapters;
      next();
    })
    .catch(next);
};

export const deleteLesson: MiddlewareFunction = (req, res, next) => {
  service
    .deleteLesson(res.locals.lesson.id as Lesson['id'])
    .then(next)
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

export const getPublicLessons: MiddlewareFunction = (req, res, next) => {
  service
    .getPublicLessons()
    .then(lessons => {
      res.locals.lessons = lessons;
      next();
    })
    .catch(next);
};

export const canEditLesson: MiddlewareFunction = (req, res, next) => {
  service
    .canEditLesson(res.locals.lesson.id, res.locals.me.id)
    .then(canEdit => {
      if (canEdit) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};

export const canAccessLesson: MiddlewareFunction = (req, res, next) => {
  service
    .canAccessLesson(res.locals.lesson.id, res.locals.me.id)
    .then(canEdit => {
      if (canEdit) {
        next();
        return;
      }
      throw new UnauthorizedLessonEditError();
    })
    .catch(next);
};
