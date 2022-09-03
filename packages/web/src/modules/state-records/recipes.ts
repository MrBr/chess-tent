import { utils, state, hof } from '@application';
import {
  RequestFetch,
  DataResponse,
  Records,
  Endpoint,
  RecipeApiLoad,
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

const withRecordApiLoad: Records['withRecordApiLoad'] =
  <
    RESPONSE extends DataResponse<any>,
    E extends Endpoint<any, RESPONSE>,
    R extends RequestFetch<E, any>,
    T extends RecordBase<
      RESPONSE extends DataResponse<infer U> ? U : never,
      any
    >,
  >(
    request: R,
  ): RecordRecipe<T, RecipeApiLoad<R>> =>
  () =>
  () =>
  (record: T) => {
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

const withRecordDenormalized: Records['withRecordDenormalized'] =
  <T extends RecordBase>(
    type: string,
  ): RecordRecipe<InferRecordValueType<T> extends Entity ? T : never, {}> =>
  recordKey =>
  store =>
  record => {
    const update = (value: InferRecordValue<T>, meta: {}) => {
      const descriptor = formatEntityValue(value);
      store.dispatch(
        batchActions([
          state.actions.updateEntity(value),
          state.actions.updateRecord(recordKey, descriptor, meta),
        ]),
      );
    };

    const get = () => {
      const entities = store.getState().entities;
      const recordEntry = record.get();
      const value = utils.denormalize<InferRecordValue<T>>(
        recordEntry.value,
        type,
        entities,
      );
      return { ...recordEntry, value };
    };

    return {
      ...record,
      get,
      update,
    };
  };

const withRecordDenormalizedCollection: Records['withRecordDenormalizedCollection'] =

    <T extends RecordBase<any[]> & RecipeCollection<any>>(type: string) =>
    recordKey =>
    store =>
    record => {
      const updateRaw = (descriptor: string[], meta = {}) => {
        store.dispatch(
          batchActions([
            state.actions.updateRecord(recordKey, descriptor, meta),
          ]),
        );
      };
      const update = (value: InferRecordValueSafe<T>, meta: {}) => {
        const descriptor = formatEntityValue(value);
        store.dispatch(
          batchActions([
            state.actions.updateEntities(value),
            state.actions.updateRecord(recordKey, descriptor, meta),
          ]),
        );
      };
      const push = (value: InferRecordValueType<T>, meta: {}) => {
        const descriptor = formatEntityValue(value);
        store.dispatch(
          batchActions([
            state.actions.updateEntities(value),
            state.actions.pushRecord(recordKey, descriptor, meta),
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
