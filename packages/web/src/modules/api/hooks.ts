import { useCallback, useMemo, useState } from 'react';
import { Hooks, RequestFetch, RequestState, StatusResponse } from '@types';
import { withRequestHandler } from './hof';

export const useApi: Hooks['useApi'] = <T, U extends StatusResponse>(
  request: RequestFetch<T, U>,
) => {
  const [apiRequestState, setApiRequestState] = useState<RequestState<U>>({
    loading: false,
    error: null,
    response: null,
  });

  const fetch = useMemo(() => withRequestHandler(request)(setApiRequestState), [
    request,
    setApiRequestState,
  ]);

  const reset = useCallback(() => {
    setApiRequestState({ response: null, loading: false, error: null });
  }, [setApiRequestState]);

  return { fetch, ...apiRequestState, reset };
};
