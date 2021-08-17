import { MiddlewareAPI } from 'redux';
import {
  InferRecordValueType,
  RecipeCollection,
  RecordBase,
  RecordRecipe,
} from '../types';

import { selectRecord } from './redux/selectors';
import {
  deleteRecordAction,
  pushRecordAction,
  updateRecordAction,
  updateRecordMetaAction,
} from './redux/actions';

const withRecordCollection = <T extends RecordBase<any[]>>(): RecordRecipe<
  T,
  RecipeCollection<InferRecordValueType<T>>
> => store => record => {
  const push = (item: InferRecordValueType<T>) => {
    store.dispatch(pushRecordAction(record.recordKey, item));
  };
  const pop = () => {
    // record.update();
  };
  const concat = (items: InferRecordValueType<T>[]) => {};

  return {
    ...record,
    push,
    pop,
    concat,
  };
};

const withRecordBase = <V>(): RecordRecipe<RecordBase<V>> => (
  store: MiddlewareAPI,
) => ({ recordKey }) => {
  const get = () => {
    const value = selectRecord<V>(recordKey)(store.getState()) || {
      value: undefined,
      meta: { recordKey },
    };
    return value;
  };
  const update = (value: V | null | undefined, meta?: {}) => {
    store.dispatch(updateRecordAction(recordKey, value, meta));
  };
  const amend = (meta: {}) => {
    store.dispatch(updateRecordMetaAction(recordKey, meta));
  };
  const reset = () => {
    store.dispatch(deleteRecordAction(recordKey));
  };

  return {
    amend,
    get,
    update,
    reset,
    recordKey,
  };
};

const withRecordMethod = <
  A,
  V,
  T extends RecordBase<V>,
  M extends string,
  F extends (this: T, ...args: any[]) => void
>(
  method: M,
  func: F,
) => () => (
  record: T,
): T &
  {
    [prop in M]: F;
  } => {
  return {
    ...record,
    [method]: func.bind(record),
  } as T &
    {
      [prop in M]: F;
    };
};

export { withRecordBase, withRecordCollection, withRecordMethod };
