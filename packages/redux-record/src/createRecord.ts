import {
  CreateRecord,
  InitedRecord,
  MF,
  MFInitedRecord,
  RecordBase,
  RecordEntry,
} from '../types';
import {
  deleteRecordAction,
  initRecordAction,
  removeRecordAction,
  selectRecord,
  uninitializedRecord,
  updateRecordAction,
  updateRecordMetaAction,
} from './redux';

const get: MF<() => RecordEntry<any, any> | undefined> =
  recordKey => store => () => () =>
    selectRecord(recordKey)(store.getState());
const update: MF<(item: any, meta?: {}) => void> =
  recordKey => store => () => (value, meta?: {}) => {
    store.dispatch(updateRecordAction(recordKey, value, meta));
  };
const amend: MF<(meta: {}) => void> = recordKey => store => () => meta => {
  store.dispatch(updateRecordMetaAction(recordKey, meta));
};
const reset: MF<() => void> = recordKey => store => () => () => {
  store.dispatch(deleteRecordAction(recordKey));
};
const remove: MF<(item: any, meta: {}) => void> =
  recordKey => store => () => (item, meta) => {
    store.dispatch(removeRecordAction(recordKey, item, meta));
  };
const init: MF<() => void, RecordBase> = recordKey => store => record => () => {
  const recordEntry = selectRecord(recordKey)(store.getState());
  if (recordEntry === uninitializedRecord) {
    store.dispatch(
      initRecordAction(recordKey, record.initialValue, {
        recordKey,
        ...record.initialMeta,
      }),
    );
  }
};

const recordBase = {
  get,
  update,
  amend,
  reset,
  init,
  remove,
  initialMeta: {},
};

const createRecord: CreateRecord = descriptor => recordKey => store => {
  return Object.entries({ ...recordBase, ...descriptor }).reduce(
    (res, [key, val]) => {
      res[key as keyof typeof res] =
        typeof val === 'function' ? val(recordKey)(store)(res) : val;
      return res;
    },
    {} as InitedRecord<
      typeof descriptor extends MFInitedRecord<any, infer U> ? U : never
    >,
  );
};

export default createRecord;
