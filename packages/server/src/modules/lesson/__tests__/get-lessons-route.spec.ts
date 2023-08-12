import request from 'supertest';

import application from '@application';

describe('GET /lessons/:lessonId', () => {
  beforeAll(() => application.start());
  it('should return forbidden status', function (done) {
    request(application.service.router)
      .get(process.env.API_BASE_PATH + '/lesson/none-existing-lesson')
      .set('Accept', 'application/json')
      .expect(401, done);
  });
});
