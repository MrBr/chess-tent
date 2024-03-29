import application, { middleware } from '@application';
import {
  canEditLesson,
  getLesson,
  saveLesson,
  publishLesson,
  findLessons,
  patchLesson,
  updateLesson,
  canAccessLesson,
  unpublishLesson,
  deleteLesson,
  getLessonChapters,
  getPublicLessons,
} from './middleware';

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  '/lesson/save',
  identify,
  toLocals('lesson', req => req.body),
  canEditLesson,
  saveLesson,
  sendStatusOk,
);

application.service.registerDeleteRoute(
  '/lesson/:lessonId',
  identify,
  toLocals('lesson.id', req => req.params.lessonId),
  canEditLesson,
  deleteLesson,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/lesson/publish/:lessonId',
  identify,
  toLocals('lesson.id', req => req.params.lessonId),
  canEditLesson,
  publishLesson,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/lesson/unpublish/:lessonId',
  identify,
  toLocals('lesson.id', req => req.params.lessonId),
  canEditLesson,
  unpublishLesson,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/lesson/:lessonId',
  identify,
  toLocals('lesson', req => req.body),
  toLocals('lesson.id', req => req.params.lessonId),
  canEditLesson,
  patchLesson,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/lesson-update/:lessonId',
  identify,
  toLocals('update', req => req.body),
  toLocals('lesson.id', req => req.params.lessonId),
  canEditLesson,
  updateLesson,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/lessons',
  identify,
  toLocals('filters', req => ({
    owner: req.body.owner,
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    hasDocId: true,
    published: true,
  })),
  findLessons,
  sendData('lessons'),
);

application.service.registerPostRoute(
  '/my-lessons',
  identify,
  toLocals('filters', (req, res) => ({
    owner: res.locals.me.id,
    users: [res.locals.me.id],
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    hasDocId: false,
    published: req.body.published,
  })),
  findLessons,
  sendData('lessons'),
);

application.service.registerGetRoute(
  '/lesson/:lessonId',
  identify,
  toLocals('lesson.id', req => req.params.lessonId),
  getLesson,
  canAccessLesson,
  sendData('lesson'),
);

application.service.registerPostRoute(
  '/lesson/:lessonId/chapters',
  identify,
  toLocals('lesson.id', req => req.params.lessonId),
  toLocals('chapterIds', req => req.body),
  getLessonChapters,
  canAccessLesson,
  sendData('chapters'),
);

application.service.registerGetRoute(
  '/public-lessons',
  getPublicLessons,
  sendData('lessons'),
);
