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
  private hasSession: boolean;
  private data?: Object | null;
  private user?: User | null;

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
    this.user = null;
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

  authorize(user: User) {
    this.user = user;
    this.cookies.push(`token=${generateApiToken(user)}`);

    return this;
  }

  setCookies(cookies: string[]) {
    this.cookies = [...this.cookies, ...cookies];
    return this;
  }

  send(newData: Object) {
    this.data = newData;
    return this;
  }

  async run() {
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
