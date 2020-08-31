import { services, requests } from '@application';
import { LessonResponse, LessonsResponse } from '@types';
import { Lesson, User } from '@chess-tent/models';

const lesson = services.createRequest<[string], LessonResponse>(
  'GET',
  lessonId => ({ url: `/lesson/${lessonId}` }),
);

const lessonSave = services.createRequest<Lesson, LessonResponse>(
  'POST',
  '/lesson/save',
);

const lessonPatch = services.createRequest<
  [Lesson['id'], Partial<Lesson>],
  LessonResponse
>('PUT', (id, patch) => ({ url: `/lesson/${id}`, data: patch }));

const lessons = services.createRequest<{ owner: User['id'] }, LessonsResponse>(
  'POST',
  '/lessons',
);

requests.lesson = lesson;
requests.lessonSave = lessonSave;
requests.lessons = lessons;
