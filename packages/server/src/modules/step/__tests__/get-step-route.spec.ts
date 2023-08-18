import request from 'supertest';

import application from '@application';

describe('GET /step/:stepId', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());
  it('should return forbidden status', function (done) {
    request(application.service.router)
      .get(process.env.API_BASE_PATH + '/step/812376819764')
      .set('Accept', 'application/json')
      .expect(401, done);
  });
});
