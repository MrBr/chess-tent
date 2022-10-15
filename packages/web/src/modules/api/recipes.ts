import { hof } from '@application';
import {
  RequestFetch,
  DataResponse,
  Records,
  Endpoint,
  GetRequestFetchResponse,
} from '@types';
import { MF, RecordBase } from '@chess-tent/redux-record/types';

const { withRequestHandler } = hof;

export const createApiRecipe: Records['createApiRecipe'] = <
  RESPONSE extends DataResponse<any>,
  E extends Endpoint<any, RESPONSE>,
  R extends RequestFetch<E, any>,
>(
  request: R,
) => {
  const requestInitiator = withRequestHandler(request);
  const load: MF<
    () => void,
    RecordBase<
      GetRequestFetchResponse<R> extends DataResponse<infer D> ? D : never,
      { loaded?: boolean; loading?: boolean; error?: string }
    >
  > = () => () => record =>
    requestInitiator(({ loading, response, error }) => {
      if (loading) {
        record.amend({ loading: true });
        return;
      }
      if (response && !error) {
        record.update(response.data, { loading: false, loaded: true });
        return;
      }
      if (error) {
        record.amend({ loading: false, error });
      }
    });

  return {
    load,
  };
};
