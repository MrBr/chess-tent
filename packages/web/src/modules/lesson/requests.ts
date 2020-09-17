import { services, requests } from '@application';
import {
  LessonResponse,
  LessonsResponse,
  LessonUpdates,
  StatusResponse,
} from '@types';
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
  StatusResponse
>('PUT', (id, patch) => ({ url: `/lesson/${id}`, data: patch }));

const lessonUpdates = services.createRequest<
  [Lesson['id'], LessonUpdates],
  StatusResponse
>('PUT', (id, patch) => ({ url: `/lesson-update/${id}`, data: patch }));

const lessons = services.createRequest<{ owner: User['id'] }, LessonsResponse>(
  'POST',
  '/lessons',
);

requests.lesson = lesson;
requests.lessonSave = lessonSave;
requests.lessons = lessons;
requests.lessonPatch = lessonPatch;
requests.lessonUpdates = lessonUpdates;
