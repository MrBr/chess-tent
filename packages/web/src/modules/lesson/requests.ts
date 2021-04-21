import { services, requests } from '@application';
import {
  LessonsRequest,
  LessonResponse,
  LessonsResponse,
  LessonUpdates,
  StatusResponse,
  MyLessonsRequest,
} from '@types';
import { Lesson, LessonDetails } from '@chess-tent/models';

const lesson = services.createRequest<[string], LessonResponse>(
  'GET',
  lessonId => ({ url: `/lesson/${lessonId}` }),
);

const lessonSave = services.createRequest<Lesson, LessonResponse>(
  'POST',
  '/lesson/save',
);

const lessonPublish = services.createRequest<
  [Lesson['id'], LessonDetails],
  StatusResponse
>('PUT', (id, body) => ({ url: `/lesson/${id}`, data: body }));

const lessonPatch = services.createRequest<
  [Lesson['id'], Partial<Lesson>],
  StatusResponse
>('PUT', (id, patch) => ({ url: `/lesson/${id}`, data: patch }));

const lessonUpdates = services.createRequest<
  [Lesson['id'], LessonUpdates],
  StatusResponse
>('PUT', (id, patch) => ({ url: `/lesson-update/${id}`, data: patch }));

const lessons = services.createRequest<LessonsRequest, LessonsResponse>(
  'POST',
  '/lessons',
);
const myLessons = services.createRequest<MyLessonsRequest, LessonsResponse>(
  'POST',
  '/my-lessons',
);

requests.lesson = lesson;
requests.lessonSave = lessonSave;
requests.lessonPublish = lessonPublish;
requests.lessons = lessons;
requests.myLessons = myLessons;
requests.lessonPatch = lessonPatch;
requests.lessonUpdates = lessonUpdates;
