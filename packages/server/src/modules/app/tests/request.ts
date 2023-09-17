import supertest, { SuperTest, Test } from 'supertest';
import { immerable, produce } from 'immer';

import application from '@application';
import { TestRequest } from '@types';
import { User } from '@chess-tent/models';

const { generateApiToken } = application.service;

class Request implements TestRequest {
  [immerable] = true;

  request: SuperTest<Test>;
  method: 'get' | 'post';
  url: string;
  cookies: string[];
  data?: Object | null;

  constructor() {
    this.request = supertest(application.service.router);
    this.url = process.env.API_BASE_PATH || '';
    this.method = 'get';
    this.cookies = [];
  }

  get(url: string) {
    return produce(this, draft => {
      draft.method = 'get';
      draft.url = process.env.API_BASE_PATH + url;
      return draft;
    });
  }

  post(url: string) {
    return produce(this, draft => {
      draft.method = 'post';
      draft.url = process.env.API_BASE_PATH + url;
      return draft;
    });
  }

  setAuthorization(user: User) {
    return produce(this, draft => {
      draft.cookies.push(`token=${generateApiToken(user)}`);
      return draft;
    });
  }

  setCookies(cookies: string[]) {
    return produce(this, draft => {
      draft.cookies = [...this.cookies, ...cookies];
      return draft;
    });
  }

  setBody(newData: Object) {
    return produce(this, draft => {
      draft.data = newData;
      return draft;
    });
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
