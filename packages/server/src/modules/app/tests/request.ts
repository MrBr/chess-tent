import supertest, { SuperTest, Test } from 'supertest';

import application from '@application';
import { TestRequest } from '@types';
import { User } from '@chess-tent/models';

const { generateApiToken } = application.service;

class Request implements TestRequest {
  private request: SuperTest<Test>;
  private method: 'get' | 'post';
  private url: string;
  private cookies: string[];
  private data?: Object | null;

  constructor() {
    this.request = supertest(application.service.router);
    this.url = process.env.API_BASE_PATH || '';
    this.method = 'get';
    this.cookies = [];
  }

  init() {
    return new Request();
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

  setAuthorization(user: User) {
    this.cookies.push(`token=${generateApiToken(user)}`);

    return this;
  }

  setCookies(cookies: string[]) {
    this.cookies = [...this.cookies, ...cookies];
    return this;
  }

  setBody(newData: Object) {
    this.data = newData;
    return this;
  }

  async execute() {
    const req = this.request[this.method](this.url);

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
