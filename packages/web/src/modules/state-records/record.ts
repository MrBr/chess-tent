import { services, socket, requests } from '@application';
import { useCallback, useEffect, useMemo } from 'react';
import {
  RecordHookReturn,
  CollectionRecordHookReturn,
  RecordMeta,
  RecordValue,
  RequestFetch,
  RecordHook,
  StatusResponse,
  RecordHookReturnNew,
  WithRecordHook,
  DataResponse,
  ExtendRecordHook,
} from '@types';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import { hooks } from '@application';
import {
  Activity,
  Entity,
  TYPE_ACTIVITY,
  TYPE_LESSON,
} from '@chess-tent/models';
import { selectRecord } from './state/selectors';
import {
  deleteRecordAction,
  updateRecordAction,
  pushRecordAction,
} from './state/actions';
import { createRecordService } from './services';
import { useApi } from '../api/hooks';

// const createRecordSingle = (recordKey, initialValue) => {
//   // API
//   // load
//   // Lifecycle
//   // init
//   // Methods
//   // update
//   // reset
// };

// const createRecordCollection = (recordKey, initialValue) => {
//   // API
//   // load: promise
//   // loadNext: promise
//   // Lifecycle
//   // init: T | Promise<T>
//   // next: T | Promise<T>
//   // Methods
//   // push: T
//   // pop: T
//   // update: T
//   // concat: T
//   // reset: void
// };

const createRecordHook = <V extends RecordValue>(
  prefix: string,
  type: RecordMeta['type'],
): RecordHook<V> => suffix => {
  const recordKey = `${prefix}${suffix}`;
  const record = useSelector(selectRecord(recordKey));
  const identifier = record?.value;
  const meta = record?.meta || {
    type,
    recordKey,
  };

  // If ever needed make a composable denormalizeRecord plugin
  const value = hooks.useDenormalize<V>(identifier, meta.type);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNil(record) && isNil(identifier)) {
      // dispatch(updateRecordAction(recordKey, identifier, { ...meta, type }));
      dispatch(updateRecordAction(recordKey, identifier, { ...meta }));
    }
  }, [dispatch, meta, record, recordKey, type, identifier]);

  const update = useCallback(
    (entity, meta) => {
      dispatch(updateRecordAction(recordKey, entity, meta));
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

const withRecordApiLoad = <V extends RecordValue, A>(
  request: RequestFetch<A, DataResponse<V>>,
): ExtendRecordHook<
  V,
  {
    load: (...args: Parameters<RequestFetch<A, DataResponse<V>>>) => void;
  }
> => useRecord => suffix => {
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

// const useTestHook = createRecordHook<Activity<any>[]>('test', TYPE_LESSON);
// const enhancedHook = withRecordApiLoad(requests.activities)(useTestHook);

const withRecordSocketLoad = (): WithRecordHook => useRecord => (...args) => {
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

// const useTestHook = createRecordHook<Activity<any>[]>('test', TYPE_LESSON);
// const enhancedHook = withRecordSocketLoad()(useTestHook);

// Record init allows custom implementation on recordInitialisation
const withRecordInit = <V extends RecordValue>(
  init: (record: RecordHookReturnNew<V>) => void,
): ExtendRecordHook<V, {}> => useRecord => (...args) => {
  const record = useRecord(...args);

  useEffect(() => {
    init(record);
  }, []);

  return record;
};

// const useTestHook = createRecordHook<Activity<any>[]>('test', TYPE_LESSON);
// const enhancedHook = withRecordInit<Activity<any>[]>(() => {})(useTestHook);

// Record plugins example
// const userRecord = connect(recordSocketLoad(), recordInit())(recordBase)
// userRecord.useRecord();
// userRecord.initService(store);
