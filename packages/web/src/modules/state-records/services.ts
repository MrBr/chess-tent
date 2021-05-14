import { RecordMeta, RecordType, RecordValue } from '@chess-tent/types';
import { RecordService } from '@types';
import { MiddlewareAPI } from 'redux';
import isNil from 'lodash/isNil';
import { useRecord } from './hooks';
import { updateRecordAction, updateRecordValueAction } from './state/actions';
import { selectRecord } from './state/selectors';

export const createRecordHook = <T extends RecordValue>(
  recordKey: string,
  type: RecordMeta['type'],
) => () => useRecord<T>(recordKey, type);

export const createRecordService = <T extends RecordValue>(
  recordKey: string,
  recordType: RecordMeta['type'],
) => (store: MiddlewareAPI): RecordService<T> => {
  const record = selectRecord<T>(recordKey)(store.getState());

  if (isNil(record)) {
    store.dispatch(updateRecordAction(recordKey, null, { type: recordType }));
  }

  const updateValue = (value: RecordType<T>['value']) =>
    store.dispatch(updateRecordValueAction(recordKey, value, recordType));

  const update = (entity: RecordValue, meta?: {}) =>
    store.dispatch(updateRecordAction(recordKey, entity, meta));

  return {
    record,
    update,
    updateValue,
  };
};
