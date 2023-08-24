import request from 'supertest';

import application from '@application';
import { generateApiToken, generateCoach } from '../../../application/tests';
import { Step, TYPE_STEP, User } from '@chess-tent/models';
import { v4 as uuid } from 'uuid';

describe('POST /step/save', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());

  it('should create new step', function (done) {
    const coach: User = generateCoach();
    const token: String = generateApiToken(coach);

    request(application.service.router)
      .post(process.env.API_BASE_PATH + '/step/save')
      .set('Cookie', [`token=${token}`])
      .expect(200, done);
  });
});

describe('Coach should be able to manage created step', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());

  let stepId: String;
  let coach: User;
  let token: String;

  it('should create new step', function (done) {
    coach = generateCoach();
    token = generateApiToken(coach);
    stepId = uuid();

    request(application.service.router)
      .post(process.env.API_BASE_PATH + '/step/save')
      .set('Cookie', [`token=${token}`])
      .set('Accept', 'application/json')
      .set({
        id: stepId,
        type: TYPE_STEP,
        state: {},
      } as Step)
      .expect(200)
      .end((err, response) => {
        if (err) {
          console.error('Error:', err);
          return done(err);
        }

        console.log('Response Body:', response.body);

        done();
      });
  });

  it('should be able to get step', function (done) {
    request(application.service.router)
      .get(process.env.API_BASE_PATH + `/step/${stepId}`)
      .set('Accept', 'application/json')
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
