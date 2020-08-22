import { services } from '@application';
import { ApiMethods, Request, API } from '@types';

export const createRequest = <T, K>(url: string, method: ApiMethods) => (
  data: T,
): Promise<K> => services.api.createRequest<T, K>({ url, method, data });

export class Api implements API {
  basePath: string;
  constructor(basePath: string) {
    if (!basePath) {
      throw Error('Api base path not defined while initializing API!');
    }
    this.basePath = basePath;
  }

  createRequest<T, K>(request: Request<T>) {
    const { url, data, method } = request;

    const headers: { [key: string]: string } = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    return fetch(this.basePath + url, {
      headers,
      credentials: 'include',
      method: method,
      body: data ? JSON.stringify(data) : undefined,
    }).then(response => {
      return response.json();
    }) as Promise<K>;
  }
}
