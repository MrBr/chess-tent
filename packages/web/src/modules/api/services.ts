import { services } from '@application';
import { ApiMethods, Request, API, GenericArguments } from '@types';

export const createRequest = <T, K>(
  method: ApiMethods,
  urlOrCustomizer:
    | string
    | ((...args: GenericArguments<T>) => { url: string; data?: any }),
) => (...args: GenericArguments<T>): Promise<K> => {
  let url;
  let data;
  if (typeof urlOrCustomizer === 'function') {
    const params = urlOrCustomizer(...args);
    url = params.url;
    data = params.data;
  } else {
    url = urlOrCustomizer;
    data = args.length > 0 ? args[0] : undefined;
  }

  return services.api.makeRequest<T, K>({ url, method, data });
};

export class Api implements API {
  basePath: string;
  constructor(basePath: string) {
    if (!basePath) {
      throw Error('Api base path not defined while initializing API!');
    }
    this.basePath = basePath;
  }

  makeRequest<T, K>(request: Request<T>) {
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
