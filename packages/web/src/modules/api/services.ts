import { services } from '@application';
import {
  API,
  GenericArguments,
  RequestFetch,
  GetRequestFetchEndpoint,
  GetEndpointResponse,
  GetRequestFetchData,
  GetRequestFetchMethod,
  GetEndpointRequest,
  Endpoint,
  GetRequestFetchUrl,
} from '@types';

export const createRequest =
  <T extends RequestFetch<any, any>, K = GetRequestFetchData<T>>(
    method: GetRequestFetchMethod<T>,
    urlOrCustomizer:
      | GetRequestFetchUrl<T>
      | ((...args: GenericArguments<K>) => GetRequestFetchUrl<T>),
    dataCustomizer: (...args: GenericArguments<K>) => GetRequestFetchData<T> = (
      ...args
    ) => args[0] as GetRequestFetchData<T>,
  ) =>
  (
    ...args: GenericArguments<K>
  ): Promise<GetEndpointResponse<GetRequestFetchEndpoint<T>>> => {
    const url =
      typeof urlOrCustomizer === 'function'
        ? // @ts-ignore - don't understand
          urlOrCustomizer(...args)
        : urlOrCustomizer;
    const data = dataCustomizer(...args);
    const request = {
      url,
      method,
      data,
    } as GetEndpointRequest<GetRequestFetchEndpoint<T>>;

    return services.api.makeRequest<GetRequestFetchEndpoint<T>>(request);
  };

export class Api implements API {
  basePath: string;
  constructor(basePath: string) {
    if (!basePath) {
      throw Error('Api base path not defined while initializing API!');
    }
    this.basePath = basePath;
  }

  makeRequest<T extends Endpoint<any, any>>(request: GetEndpointRequest<T>) {
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
    }) as Promise<GetEndpointResponse<T>>;
  }
}
