import { useCallback, useMemo, useState } from 'react';
import {
  GetRequestFetchResponse,
  Hooks,
  RequestFetch,
  RequestState,
} from '@types';
import { withRequestHandler } from './hof';

export const useApi: Hooks['useApi'] = <T extends RequestFetch<any, any>>(
  request: T,
) => {
  const [apiRequestState, setApiRequestState] = useState<
    RequestState<GetRequestFetchResponse<T>>
  >({
    loading: false,
    error: null,
    response: null,
  });

  const fetch = useMemo(
    () => withRequestHandler(request)(setApiRequestState),
    [request, setApiRequestState],
  );

  const reset = useCallback(() => {
    setApiRequestState({ response: null, loading: false, error: null });
  }, [setApiRequestState]);

  return { fetch, ...apiRequestState, reset };
};
