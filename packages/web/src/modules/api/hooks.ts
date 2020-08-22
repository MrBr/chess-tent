import { useCallback, useState } from 'react';
import { GenericArguments, Hooks, RequestFetch } from '@types';

export const useApi: Hooks['useApi'] = <T, U>(request: RequestFetch<T, U>) => {
  const [apiRequestState, setApiRequestState] = useState<{
    loading: boolean;
    error: null | string | {};
    response: U | null;
  }>({
    loading: false,
    error: null,
    response: null,
  });

  const fetch = useCallback(
    (...args: GenericArguments<T>) => {
      setApiRequestState({ response: null, error: null, loading: true });
      request(...args)
        .then(response => {
          setApiRequestState({ error: null, loading: false, response });
        })
        .catch(error => {
          setApiRequestState({ response: null, loading: false, error });
        });
    },
    [request, setApiRequestState],
  );

  return { fetch, ...apiRequestState };
};
