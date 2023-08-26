import request from 'supertest';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

import application from '@application';
import { ZoomRole } from '@chess-tent/models';

beforeAll(() => application.test.start());

const tokenCookie =
  'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTgwYmQxMDItMjNiNC00MzkxLThhOTUtMzhkYjliN2QxYWJhIn0sImlhdCI6MTY5MTUwMTU2Nn0.UmmBVVMY0Ruxox61CaINh3rtSF73s2V9TD-0nWf2hpw';

describe('GET /zoom/authorize', () => {
  it('should return unauthorized status', async () => {
    const result = await request(application.service.router).get(
      process.env.API_BASE_PATH + '/zoom/authorize',
    );

    expect(result.statusCode).toBe(401);
  });

  it('should return zak token when user has an access token', async () => {
    // TODO implement with database
  });

  it('should return zak not found error', async () => {
    const result = await request(application.service.router)
      .get(process.env.API_BASE_PATH + '/zoom/authorize')
      .set('Cookie', [tokenCookie])
      .send({ accessToken: 'test-token' });

    expect(result.body.error).toBe('Zoom token not found.');
  });
});

describe('POST /zoom/authorize', () => {
  it('should return unauthorized status', async () => {
    const result = await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/zoom/authorize')
      .send({ code: 'test-code', redirectUri: 'test-uri' });

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

    const result = await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/zoom/authorize')
      .set('Cookie', [tokenCookie])
      .send({ code: 'test-code', redirectUri: 'test-uri' });

    expect(result.statusCode).toBe(200);
    expect(result.body.data).toBe(testTokenValue);
  });
});

describe('POST /zoom/signature', () => {
  it('should return unauthorized status', async () => {
    const result = await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/zoom/signature')
      .send({ meetingNumber: '123456', role: ZoomRole.Guest });

    expect(result.statusCode).toBe(401);
  });

  it('should return signature token', async () => {
    const result = await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/zoom/signature')
      .set('Cookie', [tokenCookie])
      .send({ meetingNumber: '123456', role: ZoomRole.Guest });

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
