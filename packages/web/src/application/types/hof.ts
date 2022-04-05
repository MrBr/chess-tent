import {
  GetRequestFetchResponse,
  RequestFetch,
  RequestState,
} from '@chess-tent/types';
import { GenericArguments } from './_helpers';

export type HOF = {
  withRequestHandler: <T extends RequestFetch<any, any>>(
    request: T,
  ) => (
    change: (requestState: RequestState<GetRequestFetchResponse<T>>) => void,
  ) => (...args: GenericArguments<T>) => void;
};
