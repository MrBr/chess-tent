import { services, requests } from '@application';
import {
  LessonsRequest,
  LessonResponse,
  LessonsResponse,
  LessonUpdates,
  StatusResponse,
  MyLessonsRequest,
  ActivitiesResponse,
  ActivityFilters,
} from '@types';
import { Lesson, LessonActivity } from '@chess-tent/models';

const lesson = services.createRequest<[string], LessonResponse>(
  'GET',
  lessonId => ({ url: `/lesson/${lessonId}` }),
);

const lessonSave = services.createRequest<Lesson, LessonResponse>(
  'POST',
  '/lesson/save',
);

const lessonPublish = services.createRequest<Lesson['id'], StatusResponse>(
  'PUT',
  id => ({ url: `/lesson/publish/${id}` }),
);

const lessonUnpublish = services.createRequest<Lesson['id'], StatusResponse>(
  'PUT',
  id => ({ url: `/lesson/unpublish/${id}` }),
);

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

const trainings = services.createRequest<
  ActivityFilters,
  ActivitiesResponse<LessonActivity>
>('POST', data => ({
  url: '/activities',
  data,
}));

requests.trainings = trainings;
requests.lesson = lesson;
requests.lessonSave = lessonSave;
requests.lessonPublish = lessonPublish;
requests.lessonUnpublish = lessonUnpublish;
requests.lessons = lessons;
requests.myLessons = myLessons;
requests.lessonPatch = lessonPatch;
requests.lessonUpdates = lessonUpdates;
