import requests, { utils, state } from '@application';
import { useMemo } from 'react';
import { RequestFetch, DataResponse, RecordBase } from '@types';
import { useStore } from 'react-redux';
import { Store } from 'redux';
import { Entity, Lesson, TYPE_LESSON } from '@chess-tent/models';
import { batchActions } from 'redux-batched-actions';
import { selectRecord } from './state/selectors';
import { deleteRecordAction, updateRecordAction } from './state/actions';
import { withRequestHandler } from '../api/hof';

type MF = (
  store: Store,
) => (record: { recordKey: string }) => { recordKey: string };

type UseRecord = <V>(store: Store, recordKey: string) => RecordBase<V>;

type InferRecordValue<T extends RecordBase<any>> = T extends RecordBase<infer V>
  ? V extends (infer AV)[]
    ? AV
    : V
  : never;

function createRecord<T1, T2>(
  f1: (store: Store) => (x: T1) => T2,
): (store: Store, recordKey: string) => T2;
function createRecord<T1, T2, T3>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
): (store: Store, recordKey: string) => T3;
function createRecord<T1, T2, T3, T4>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
): (store: Store, recordKey: string) => T4;
function createRecord<T1, T2, T3, T4, T5>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
  f4: (store: Store) => (x: T4) => T5,
): (store: Store, recordKey: string) => T5;
function createRecord<T1, T2, T3, T4, T5, T6>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
  f4: (store: Store) => (x: T4) => T5,
  f5: (store: Store) => (x: T5) => T6,
): (store: Store, recordKey: string) => T6;
function createRecord<V>(...fns: MF[]) {
  return (store: Store, recordKey: string) => {
    return fns.reduce((record, middleware) => middleware(store)(record), {
      recordKey,
    });
  };
}

const useRecordHook = <V>(resolveRecord: UseRecord, suffix: string) => {
  const store = useStore();
  const record = useMemo(() => resolveRecord<V>(store, suffix), [
    store,
    suffix,
  ]);
  const { value, meta } = record.get();
  return {
    ...record,
    value,
    meta,
  };
};

const withRecordApiLoad = <A, V, T extends RecordBase<V>>(
  request: RequestFetch<A, DataResponse<V>>,
) => () => (
  record: T,
): T & {
  load: (...args: Parameters<RequestFetch<A, DataResponse<V>>>) => void;
} => {
  const load = withRequestHandler(request)(({ loading, response }) => {
    if (loading) {
      const { value } = record.get();
      record.update(value, { loading });
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

const withRecordSocketLoad = <T extends RecordBase<any>>() => () => (
  record: T,
): T & { socketLoad: () => void } => {
  const socketLoad = () => {
    //socket.sendAction()
  };

  return {
    ...record,
    socketLoad,
  };
};

const withRecordCollection = <T extends RecordBase<any[]>>() => (
  store: Store,
) => (
  record: T,
): T & {
  push: (item: InferRecordValue<T>) => void;
  pop: () => void;
  concat: (items: InferRecordValue<T>[]) => void;
} => {
  const push = (item: InferRecordValue<T>) => {};
  const pop = () => {
    // record.update();
  };
  const concat = (items: InferRecordValue<T>[]) => {};

  return {
    ...record,
    push,
    pop,
    concat,
  };
};

const withRecordDenormalized = <T extends RecordBase<any>>(type: string) => (
  store: Store,
) => (record: InferRecordValue<T> extends Entity ? T : never): T => {
  const update = (value: InferRecordValue<T>, meta: {}) => {
    const descriptor = Array.isArray(value)
      ? value.map(utils.getEntityId)
      : utils.getEntityId(value as Entity);
    store.dispatch(
      batchActions([
        state.actions.updateEntities(value),
        state.actions.updateRecord(record.recordKey, descriptor, meta),
      ]),
    );
  };

  const get = () => {
    const entities = store.getState().entities;
    const { value: id, meta } = record.get();
    // TODO - denormalize collection
    return utils.denormalize<InferRecordValue<T>>(id, meta.type, entities);
  };

  return {
    ...record,
    get,
    update,
  };
};

export const withRecordBase = <V>() => (store: Store) => ({
  recordKey,
}: RecordBase<V>) => {
  const get = () => selectRecord<V>(recordKey)(store.getState());
  const update = (value: V | null | undefined, meta?: {}) => {
    store.dispatch(updateRecordAction(recordKey, value, meta));
  };
  const reset = () => {
    store.dispatch(deleteRecordAction(recordKey));
  };

  return {
    get,
    update,
    reset,
    recordKey,
  };
};

const record = createRecord(
  withRecordBase<Lesson[]>(),
  withRecordDenormalized(TYPE_LESSON),
  withRecordCollection(),
  withRecordApiLoad(requests.requests.lessons),
)({} as Store, '');
