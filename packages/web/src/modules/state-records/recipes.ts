import { utils, hof } from '@application';
import {
  RequestFetch,
  DataResponse,
  Records,
  Endpoint,
  GetRequestFetchResponse,
} from '@types';
import { MF, RecordBase, RecordEntry } from '@chess-tent/redux-record/types';
import { Entity } from '@chess-tent/models';
import { selectRecord } from '@chess-tent/redux-record';

const { withRequestHandler } = hof;

const createApiRecipe: Records['createApiRecipe'] = <
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
      { loaded?: boolean; loading?: boolean }
    >
  > = () => () => record =>
    requestInitiator(({ loading, response }) => {
      if (loading) {
        record.amend({ loading: true });
        return;
      }
      if (response) {
        record.update(response.data, { loading: false, loaded: true });
        return;
      }
    });

  return {
    load,
  };
};

const createDenormalizedRecipe: Records['createDenormalizedRecipe'] = <
  T extends Entity,
>(
  type: string,
) => {
  const get: MF<() => RecordEntry<T, any>> = recordKey => store => () => () => {
    const appState = store.getState();
    const recordEntry =
      selectRecord<RecordBase<string, any>>(recordKey)(appState);
    const entities = appState.entities;
    const value = recordEntry?.value
      ? utils.denormalize(recordEntry.value, type, entities)
      : undefined;
    return { ...recordEntry, value } as RecordEntry<T, any>;
  };

  const initialMeta = {
    normalized: true as true,
  };

  return {
    get,
    initialMeta,
  };
};

const createDenormalizedCollectionRecipe: Records['createDenormalizedCollectionRecipe'] =
  <T extends Entity[]>(type: string) => {
    const get: MF<() => RecordEntry<T[], any>> =
      recordKey => store => () => () => {
        const appState = store.getState();
        const recordEntry =
          selectRecord<RecordBase<string[], any>>(recordKey)(appState);
        const entities = appState.entities;
        const value = recordEntry?.value
          ?.map(id => utils.denormalize(id, type, entities))
          // TODO - handle better case when the entity has been deleted
          .filter(Boolean);
        return { ...recordEntry, value } as RecordEntry<T[], any>;
      };

    const initialMeta = {
      normalized: true as true,
    };

    return {
      get,
      initialMeta,
    };
  };

export {
  createApiRecipe,
  createDenormalizedCollectionRecipe,
  createDenormalizedRecipe,
};
