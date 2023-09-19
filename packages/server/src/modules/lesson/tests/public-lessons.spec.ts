import application from '@application';
import { TestRequest } from '@types';

let request: TestRequest;

beforeAll(async () => {
  await application.test.start();
  request = application.test.request;
});

describe('GET /public-lessons', () => {
  it('should return a list of lessons that are flagged public', async () => {
    const { lessons } = application.test.fixtures;
    const { saveLesson } = application.service;

    await Promise.all(lessons.map(lesson => saveLesson(lesson)));

    const result = await request.get('/public-lessons').execute();

    expect(result.body.data.length).toBeGreaterThan(0);
    expect(result.body.data.length).toBeLessThan(lessons.length);
  });
});
