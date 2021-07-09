import { utils, state } from '@application';
import {
  RequestFetch,
  DataResponse,
  RecordBase,
  InferRecordValue,
  MF,
  CreateRecord,
} from '@types';
import { Store } from 'redux';
import { Entity } from '@chess-tent/models';
import { batchActions } from 'redux-batched-actions';
import { selectRecord } from './state/selectors';
import { deleteRecordAction, updateRecordAction } from './state/actions';
import { withRequestHandler } from '../api/hof';

const createRecord: CreateRecord = function createRecord(...fns: MF[]) {
  return (store: Store, recordKey: string) => {
    return fns.reduce((record, middleware) => middleware(store)(record), {
      recordKey,
    });
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
