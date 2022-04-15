import { services, requests } from '@application';
import { Requests } from '@types';
import { TYPE_LESSON } from '@chess-tent/models';

const lesson = services.createRequest<Requests['lesson']>(
  'GET',
  lessonId => `/lesson/${lessonId}`,
);

const lessonSave = services.createRequest<Requests['lessonSave']>(
  'POST',
  '/lesson/save',
);

const lessonPublish = services.createRequest<Requests['lessonPublish']>(
  'PUT',
  id => `/lesson/publish/${id}`,
);

const lessonUnpublish = services.createRequest<Requests['lessonUnpublish']>(
  'PUT',
  id => `/lesson/unpublish/${id}`,
);

const lessonPatch = services.createRequest<Requests['lessonPatch']>(
  'PUT',
  id => `/lesson/${id}`,
  (id, patch) => patch,
);

const lessonUpdates = services.createRequest<Requests['lessonUpdates']>(
  'PUT',
  id => `/lesson-update/${id}`,
  (id, update) => update,
);

const lessons = services.createRequest<Requests['lessons']>('POST', '/lessons');
const myLessons = services.createRequest<Requests['myLessons']>(
  'POST',
  '/my-lessons',
);

const trainings = services.createRequest<Requests['trainings']>(
  'POST',
  '/activities',
  data => ({
    ...data,
    subjectType: TYPE_LESSON,
  }),
);

const scheduledTrainings = services.createRequest<
  Requests['scheduledTrainings']
>('POST', '/activities', data => ({
  ...data,
  subjectType: TYPE_LESSON,
}));

requests.trainings = trainings;
requests.scheduledTrainings = scheduledTrainings;
requests.lesson = lesson;
requests.lessonSave = lessonSave;
requests.lessonPublish = lessonPublish;
requests.lessonUnpublish = lessonUnpublish;
requests.lessons = lessons;
requests.myLessons = myLessons;
requests.lessonPatch = lessonPatch;
requests.lessonUpdates = lessonUpdates;
