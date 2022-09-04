import { MiddlewareAPI } from 'redux';
import {
  RecipeCollection,
  RecipeMeta,
  RecordBase,
  RecordRecipe,
  RecordValue,
  InferRecordValueType,
  RecipeMethod,
} from '../types';

import { selectRecord } from './redux/selectors';
import {
  deleteRecordAction,
  pushRecordAction,
  updateRecordAction,
  updateRecordMetaAction,
} from './redux/actions';

const withRecordCollection =
  <T extends RecordBase>(): RecordRecipe<
    T,
    RecipeCollection<InferRecordValueType<T>>
  > =>
  recordKey =>
  store =>
  record => {
    const push = (item: InferRecordValueType<T>) => {
      store.dispatch(pushRecordAction(recordKey, item));
    };
    const pop = () => {
      // record.update();
      console.warn('Record collection pop not implemented');
    };
    const concat = (items: InferRecordValueType<T>[]) => {
      console.warn('Record collection concat not implemented');
    };

    return {
      ...record,
      push,
      pop,
      concat,
    };
  };

const withRecordBase =
  <V, M extends {}>(
    initialValue?: RecordValue<V>,
    initialMeta?: M,
  ): RecordRecipe<{}, RecordBase<V, M>> =>
  (recordKey: string) =>
  (store: MiddlewareAPI) =>
  () => {
    const get = () => {
      const value = selectRecord<RecordBase<V, M>>(recordKey)(
        store.getState(),
      ) || {
        value: initialValue,
        meta: { ...(initialMeta || {}), recordKey },
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
      get $entry() {
        return this.get();
      },
      get,
      amend,
      update,
      reset,
    };
  };

const withRecordMethod =
  <M extends {}>() =>
  <
    T extends RecordBase<any, any>,
    N extends string,
    F extends (...args: any[]) => void,
  >(
    method: N,
    func: (
      recordKey: string,
    ) => (store: MiddlewareAPI) => (record: T & RecipeMeta<M>) => F,
  ): RecordRecipe<T, RecipeMethod<N, F, M>> =>
  recordKey =>
  store =>
  record => {
    const test = {
      [method as N]: ((...args: Parameters<F>) =>
        func(recordKey)(store)(record)(...args)) as F,
    } as { [key in N]: F };
    return {
      ...record,
      ...test,
    };
  };

const withRecordMeta =
  <M extends {}>() =>
  <B extends RecordBase>(): RecordRecipe<B, RecipeMeta<Partial<M>>> =>
  () =>
  () =>
  record =>
    record;

export {
  withRecordBase,
  withRecordCollection,
  withRecordMethod,
  withRecordMeta,
};
