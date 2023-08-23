import request from 'supertest';

import application from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import { v4 as uuid } from 'uuid';
import { seedUser } from '../../../application/tests';

describe('POST /step/save', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());

  it('should create new step', function (done) {
    const user: User = {
      id: uuid(),
      nickname: 'coach1',
      name: 'Coachy McCoachFace',
      email: 'coach1@chesstent.com',
      type: TYPE_USER,
      active: true,
      coach: true,
      password: 'testpassword1',
    } as User;

    seedUser(user);
    const token = application.service.generateApiToken(user);

    request(application.service.router)
      .post(process.env.API_BASE_PATH + '/step/save')
      .set('Cookie', [`token=${token}`])
      .expect(200, done);
  });
});

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
