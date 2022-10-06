import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ApiState,
  GetRequestFetchResponse,
  Hooks,
  ApiStatus,
  RequestFetch,
  RequestState,
} from '@types';
import { RecordValue } from '@chess-tent/redux-record/types';
import { Subject } from '@chess-tent/models';
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
    () =>
      withRequestHandler(request)((...args) => {
        setApiRequestState(...args);
      }),
    [request, setApiRequestState],
  );

  const reset = useCallback(() => {
    setApiRequestState({
      response: null,
      loading: false,
      error: null,
    });
  }, [setApiRequestState]);

  return { fetch, ...apiRequestState, reset };
};

export const useApiStatus = <T extends RequestFetch<any, any>>(
  subject: RecordValue<Subject>,
  apiState: ApiState<T>,
): [ApiStatus, (status: ApiStatus) => void] => {
  const { error, response, reset, loading } = apiState;
  const [status, setStatus] = useState<ApiStatus>(ApiStatus.LOADING);

  useEffect(() => {
    if (!subject) {
      return;
    }
    setStatus(oldStatus =>
      oldStatus === ApiStatus.LOADING ? ApiStatus.INITIAL : ApiStatus.DIRTY,
    );
  }, [subject]);

  useEffect(() => {
    if (error && status !== ApiStatus.ERROR) {
      setStatus(ApiStatus.ERROR);
    } else if (response && status !== ApiStatus.SAVED) {
      setStatus(ApiStatus.SAVED);
    } else if (loading && status !== ApiStatus.DIRTY) {
      setStatus(ApiStatus.SAVING);
    } else if (response || error) {
      // All saved, clear state for next change
      reset();
    }
  }, [status, error, reset, response, loading]);

  return [status, setStatus];
};
