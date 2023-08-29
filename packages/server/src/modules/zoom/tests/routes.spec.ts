import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

import application from '@application';
import { ZoomRole } from '@chess-tent/models';
import { TestRequest } from '@types';

beforeAll(() => application.test.start());

let request: TestRequest;

beforeAll(() => {
  request = application.test.request;
});

afterEach(() => request.reset());

describe('GET /zoom/authorize', () => {
  it('should return unauthorized status', async () => {
    const result = await request.get('/zoom/authorize').noSession().run();

    expect(result.statusCode).toBe(401);
  });

  it('should return zak token when user has an access token', async () => {
    // TODO implement with database
  });

  it('should return zak not found error', async () => {
    const request = application.test.request;

    const result = await request
      .get('/zoom/authorize')
      .send({ accessToken: 'test-token' })
      .run();

    expect(result.body.error).toBe('Zoom token not found.');
  });
});

describe('POST /zoom/authorize', () => {
  it('should return unauthorized status', async () => {
    const result = await request
      .post('/zoom/authorize')
      .noSession()
      .send({ code: 'test-code', redirectUri: 'test-uri' })
      .run();

    expect(result.statusCode).toBe(401);
  });

  it('should return zooom zak token', async () => {
    const testTokenValue = 'test-token';

    jest
      .spyOn(axios, 'postForm')
      .mockImplementation(() =>
        Promise.resolve({ data: { access_tokens: 'test-access_token' } }),
      );

    jest
      .spyOn(axios, 'get')
      .mockImplementation(() =>
        Promise.resolve({ data: { token: testTokenValue }, status: 200 }),
      );

    const result = await request
      .post('/zoom/authorize')
      .send({ code: 'test-code', redirectUri: 'test-uri' })
      .run();

    expect(result.statusCode).toBe(200);
    expect(result.body.data).toBe(testTokenValue);
  });
});

describe('POST /zoom/signature', () => {
  it('should return unauthorized status', async () => {
    const result = await request
      .post('/zoom/signature')
      .noSession()
      .send({ meetingNumber: '123456', role: ZoomRole.Guest })
      .run();

    expect(result.statusCode).toBe(401);
  });

  it('should return signature token', async () => {
    const result = await request
      .post('/zoom/signature')
      .send({ meetingNumber: '123456', role: ZoomRole.Guest })
      .run();

    expect(
      jsonwebtoken.verify(
        result.body.data,
        `${process.env.ZOOM_MEETING_SDK_SECRET_OR_CLIENT_SECRET}`,
      ),
    ).toMatchObject({
      sdkKey: process.env.ZOOM_MEETING_SDK_KEY_OR_CLIENT_ID,
    });
  });
});
