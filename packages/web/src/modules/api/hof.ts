import {
  GenericArguments,
  RequestFetch,
  RequestState,
  StatusResponse,
} from '@types';

export const withRequestHandler =
  <T, U extends StatusResponse>(request: RequestFetch<T, U>) =>
  (change: (requestState: RequestState<U>) => void) =>
  (...args: GenericArguments<T>) => {
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
        change({ error: null, loading: false, response });
      })
      .catch(error => {
        change({ response: null, loading: false, error });
      });
  };
