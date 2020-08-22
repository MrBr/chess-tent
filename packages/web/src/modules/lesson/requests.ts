import { services, requests } from '@application';
import { LessonResponse } from '@types';

const lesson = services.createRequest<[string], LessonResponse>(
  'GET',
  lessonId => ({ url: `/lesson/${lessonId}` }),
);

requests.lesson = lesson;
