import supertest, { SuperTest, Test } from 'supertest';

import application from '@application';
import { TestRequest } from '@types';

const tokenCookie =
  'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTgwYmQxMDItMjNiNC00MzkxLThhOTUtMzhkYjliN2QxYWJhIn0sImlhdCI6MTY5MTUwMTU2Nn0.UmmBVVMY0Ruxox61CaINh3rtSF73s2V9TD-0nWf2hpw';

class Request implements TestRequest {
  private request: SuperTest<Test>;
  private method: 'get' | 'post';
  private url: string;
  private cookies: string[];
  private hasSession: boolean;
  private data?: Object | null;

  constructor() {
    this.request = supertest(application.service.router);
    this.url = process.env.API_BASE_PATH || '';
    this.method = 'get';
    this.cookies = [];
    this.hasSession = true;
  }

  reset() {
    this.url = process.env.API_BASE_PATH || '';
    this.cookies = [];
    this.hasSession = true;
    this.data = null;
  }

  get(url: string) {
    this.method = 'get';
    this.url += url;
    return this;
  }

  post(url: string) {
    this.method = 'post';
    this.url += url;
    return this;
  }

  setCookies() {
    this.cookies.push(tokenCookie);
    return this;
  }

  noSession() {
    this.hasSession = false;
    return this;
  }

  send(newData: Object) {
    this.data = newData;
    return this;
  }

  async run() {
    const req = this.request[this.method](this.url);

    if (this.hasSession) {
      this.cookies.push(tokenCookie);
    }

    if (this.cookies.length > 0) {
      req.set('Cookie', this.cookies);
    }

    if (this.data) {
      req.send(this.data);
    }

    return req;
  }
}

export default Request;
