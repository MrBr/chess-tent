import { utils, state, hof } from '@application';
import { RequestFetch, DataResponse } from '@types';
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

const withRecordApiLoad = <A, V, T extends RecordBase<V>>(
  request: RequestFetch<A, DataResponse<V>>,
) => () => (
  record: T,
): T & {
  load: (...args: Parameters<RequestFetch<A, DataResponse<V>>>) => void;
} => {
  const load = withRequestHandler(request)(({ loading, response }) => {
    if (loading) {
      record.amend({ loading });
      return;
    }
    if (response) {
      record.update(response.data, { loading: false });
      return;
    }
  });

  return {
    ...record,
    load,
  };
};

const withRecordDenormalized = <T extends RecordBase<any>>(
  type: string,
): RecordRecipe<
  InferRecordValueSafe<T> extends Entity ? T : never
> => store => record => {
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

const withRecordDenormalizedCollection = <
  T extends RecordBase<any[]> & RecipeCollection<any>
>(
  type: string,
): RecordRecipe<
  InferRecordValueType<T> extends Entity ? T : never
> => store => record => {
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
    const value = recordState.value?.map(id =>
      utils.denormalize(id, type, entities),
    ) as InferRecordValue<T>;
    return { ...recordState, value };
  };

  return {
    ...record,
    get,
    update,
    push,
  };
};

export {
  withRecordApiLoad,
  withRecordDenormalized,
  withRecordDenormalizedCollection,
};