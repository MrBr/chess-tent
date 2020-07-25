import { useCallback, useState } from 'react';
import { Hooks, RequestFetch } from '@types';

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
    (data?: T) => {
      setApiRequestState({ ...apiRequestState, loading: true });
      request(data)
        .then(response => {
          setApiRequestState({ ...apiRequestState, loading: false, response });
        })
        .catch(error => {
          setApiRequestState({ ...apiRequestState, loading: false, error });
        });
    },
    [request, setApiRequestState, apiRequestState],
  );

  return { fetch, ...apiRequestState };
};
