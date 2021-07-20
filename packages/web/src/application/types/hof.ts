import { RequestFetch, RequestState, StatusResponse } from '@chess-tent/types';
import { GenericArguments } from './_helpers';

export type HOF = {
  withRequestHandler: <T, U extends StatusResponse>(
    request: RequestFetch<T, U>,
  ) => (
    change: (requestState: RequestState<U>) => void,
  ) => (...args: GenericArguments<T>) => void;
};
