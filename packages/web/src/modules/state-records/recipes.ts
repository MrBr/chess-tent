import { utils, state, hof } from '@application';
import {
  RequestFetch,
  DataResponse,
  Records,
  GetRequestFetchArgs,
  GenericArguments,
  Endpoint,
} from '@types';
import { Entity } from '@chess-tent/models';
import {
  InferRecordValue,
  InferRecordValueSafe,
  InferRecordValueType,
  RecipeCollection,
  RecordBase,
  RecordRecipe,
} from '@chess-tent/redux-record/types';
import { batchActions } from 'redux-batched-actions';
import { formatEntityValue } from './_helpers';

const { withRequestHandler } = hof;

const withRecordApiLoad =
  <
    RESPONSE extends DataResponse<any>,
    E extends Endpoint<any, RESPONSE>,
    R extends RequestFetch<E, any>,
    T extends RecordBase<RESPONSE extends DataResponse<infer U> ? U : never>,
  >(
    request: R,
  ) =>
  () =>
  (
    record: T,
  ): T & {
    load: (...args: GenericArguments<GetRequestFetchArgs<R>>) => void;
  } => {
    const load = withRequestHandler(request)(({ loading, response }) => {
      if (loading) {
        record.amend({ loading });
        return;
      }
      if (response) {
        record.update(response.data, { loading: false, loaded: true });
        return;
      }
    });

    return {
      ...record,
      load,
    };
  };

const withRecordDenormalized =
  <T extends RecordBase<any>>(
    type: string,
  ): RecordRecipe<InferRecordValueSafe<T> extends Entity ? T : never> =>
  store =>
  record => {
    const update = (value: InferRecordValue<T>, meta: {}) => {
      const descriptor = formatEntityValue(value);
      store.dispatch(
        batchActions([
          state.actions.updateEntity(value),
          state.actions.updateRecord(record.recordKey, descriptor, meta),
        ]),
      );
    };

    const get = () => {
      const entities = store.getState().entities;
      const recordState = record.get();
      const value = utils.denormalize<InferRecordValue<T>>(
        recordState.value,
        type,
        entities,
      );
      return { ...recordState, value };
    };

    return {
      ...record,
      get,
      update,
    };
  };

const withRecordDenormalizedCollection: Records['withRecordDenormalizedCollection'] =

    <T extends RecordBase<any[]> & RecipeCollection<any>>(type: string) =>
    store =>
    record => {
      const updateRaw = (descriptor: string[], meta = {}) => {
        store.dispatch(
          batchActions([
            state.actions.updateRecord(record.recordKey, descriptor, meta),
          ]),
        );
      };
      const update = (value: InferRecordValueSafe<T>, meta: {}) => {
        const descriptor = formatEntityValue(value);
        store.dispatch(
          batchActions([
            state.actions.updateEntities(value),
            state.actions.updateRecord(record.recordKey, descriptor, meta),
          ]),
        );
      };
      const push = (value: InferRecordValueType<T>, meta: {}) => {
        const descriptor = formatEntityValue(value);
        store.dispatch(
          batchActions([
            state.actions.updateEntities(value),
            state.actions.pushRecord(record.recordKey, descriptor, meta),
          ]),
        );
      };

      const get = () => {
        const entities = store.getState().entities;
        const recordState = record.get();
        // TODO - memoize
        const value = recordState.value
          ?.map(id => utils.denormalize(id, type, entities))
          // TODO - handle better case when the entity has been deleted
          .filter(Boolean) as InferRecordValue<T>;
        return { ...recordState, value };
      };

      return {
        ...record,
        get,
        update,
        push,
        updateRaw,
      };
    };

export {
  withRecordApiLoad,
  withRecordDenormalized,
  withRecordDenormalizedCollection,
};
