import application from '@application';
import { TestRequest } from '@types';

let request: TestRequest;

beforeAll(async () => {
  await application.test.start();
  request = application.test.request;
});

describe('GET /public-coaches', () => {
  it('should return a list of coaches and coach count greater than coach list length', async () => {
    const { coaches } = application.test.fixtures;
    const { addUser } = application.service;

    await Promise.all(coaches.map(coach => addUser(coach)));

    const result = await request.get('/public-coaches').execute();

    expect(result.body.data.coaches.length).toBeGreaterThan(0);
    expect(result.body.data.coachCount).toBeGreaterThan(
      result.body.data.coaches.length,
    );
  });
});
