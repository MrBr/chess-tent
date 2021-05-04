import {
  GetRecordNormalizedValue,
  RecordMeta,
  RecordValue,
} from '@chess-tent/types';
import { RecordService } from '@types';
import { MiddlewareAPI } from 'redux';
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

  const updateValue = (value: GetRecordNormalizedValue<T>) =>
    store.dispatch(updateRecordValueAction(recordKey, value, recordType));

  const update = (entity: RecordValue) =>
    store.dispatch(updateRecordAction(recordKey, entity));

  return {
    record,
    update,
    updateValue,
  };
};
