import { utils, state, socket } from '@application';
import { useCallback, useEffect } from 'react';
import {
  RecordValue,
  RequestFetch,
  RecordHook,
  RecordHookReturnNew,
  DataResponse,
} from '@types';
import { useDispatch, useSelector } from 'react-redux';
import { hooks } from '@application';
import { Entity } from '@chess-tent/models';
import { selectRecord } from './state/selectors';
import { deleteRecordAction, updateRecordAction } from './state/actions';
import { useApi } from '../api/hooks';
import { useDispatchBatched } from '../state/hooks';

const createRecordHook = <V>(prefix: string): RecordHook<V> => suffix => {
  const recordKey = `${prefix}${suffix}`;
  const dispatch = useDispatch();
  const record = useSelector(selectRecord<V>(recordKey));
  const value = record?.value;
  const meta = record?.meta || {
    recordKey,
  };

  const update = useCallback(
    (value, meta) => {
      dispatch(updateRecordAction(recordKey, value, meta));
    },
    [dispatch, recordKey],
  );

  const reset = useCallback(() => {
    // TODO - set meta to initial value
    dispatch(deleteRecordAction(recordKey));
  }, [recordKey, dispatch]);

  return {
    value,
    meta,
    update,
    reset,
    recordKey,
  };
};

const withRecordApiLoad = <K extends RecordValue>(useRecord: RecordHook<K>) => <
  A
>(
  request: RequestFetch<A, DataResponse<K>>,
): RecordHook<
  K,
  { load: (...args: Parameters<RequestFetch<A, DataResponse<K>>>) => void }
> => (suffix: string) => {
  const { fetch, response, loading } = useApi(request);
  const record = useRecord(suffix);

  useEffect(() => {
    if (loading) {
      record.update(record.value, { loading });
    }
  }, [loading]);

  useEffect(() => {
    if (response) {
      record.update(response.data, { loading: false });
    }
  }, [response]);

  return {
    ...record,
    load: fetch,
  };
};

const withRecordSocketLoad = <T extends RecordValue, S extends {}>(
  useRecord: RecordHook<T, S>,
) => (): typeof useRecord => (...args) => {
  const record = useRecord(...args);
  const load = useCallback(() => {
    // socket.sendAction - dispatch sync action
  }, [record.recordKey]);

  useEffect(() => {
    socket.subscribe(record.recordKey);

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      socket.unsubscribe(record.recordKey);
    };
  }, [record.recordKey]);

  return {
    ...record,
    load,
  };
};

// Record init allows custom implementation on recordInitialisation
const withRecordInit = <V extends RecordValue>(useRecord: RecordHook<V>) => (
  init: (record: RecordHookReturnNew<V>) => void,
): typeof useRecord => (...args) => {
  const record = useRecord(...args);

  useEffect(() => {
    init(record);
  }, []);

  return record;
};

const withRecordCollection = <V, K, S extends {}>(
  useRecord: RecordHook<V[], S>,
) => (): RecordHook<
  V[],
  S & {
    push: (item: V) => void;
    pop: () => void;
    concat: (items: V[]) => void;
  }
> => (...args) => {
  const record = useRecord(...args);

  const push = (item: V) => {};
  const pop = () => {
    // record.update();
  };
  const concat = (items: V[]) => {};

  return {
    ...record,
    push,
    pop,
    concat,
  };
};

const withRecordDenormalized = <V extends Entity | Entity[], S extends {}>(
  useRecord: RecordHook<V, S>,
  type: string,
) => (): RecordHook<V, S> => (...args) => {
  const dispatch = useDispatchBatched();
  const record = useRecord(...args);
  const value = hooks.useDenormalize<V>(
    (record.value as unknown) as V extends Entity[] ? string[] : string,
    type,
  );
  const update = useCallback(
    (value: V, meta: {}) => {
      const descriptor = Array.isArray(value)
        ? value.map(utils.getEntityId)
        : utils.getEntityId(value as Entity);
      dispatch(
        state.actions.updateEntities(value),
        state.actions.updateRecord(record.recordKey, descriptor, meta),
      );
    },
    [record.update, record.recordKey],
  );
  return {
    ...record,
    value,
    update,
  };
};
