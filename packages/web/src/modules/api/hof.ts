import {
  GetRequestFetchResponse,
  HOF,
  RequestFetch,
  RequestState,
} from '@types';

export const withRequestHandler: HOF['withRequestHandler'] =
  <T extends RequestFetch<any, any>>(request: T) =>
  (change: (requestState: RequestState<GetRequestFetchResponse<T>>) => void) =>
  (...args) => {
    change({ response: null, error: null, loading: true });
    request(...args)
      .then(response => {
        if (response.error) {
          change({
            response: null,
            loading: false,
            error: response.error,
          });
          return;
        }
        change({
          error: null,
          loading: false,
          response: response as GetRequestFetchResponse<T> | null,
        });
      })
      .catch(error => {
        change({ response: null, loading: false, error });
      });
  };
