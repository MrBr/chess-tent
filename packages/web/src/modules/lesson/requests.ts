import { services, requests } from '@application';
import { LessonResponse } from '@types';
import { Lesson } from '@chess-tent/models';

const lesson = services.createRequest<[string], LessonResponse>(
  'GET',
  lessonId => ({ url: `/lesson/${lessonId}` }),
);

const lessonSave = services.createRequest<Lesson, LessonResponse>(
  'POST',
  '/lesson/save',
);

requests.lesson = lesson;
requests.lessonSave = lessonSave;
