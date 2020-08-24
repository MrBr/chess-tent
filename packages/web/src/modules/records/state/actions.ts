import {
  DELETE_RECORD,
  RecordDeleteAction,
  RecordMeta,
  RecordUpdateAction,
  RecordValue,
  UPDATE_RECORD,
} from '@types';

export const updateRecordAction = <T extends RecordValue>(
  recordKey: string,
  entity: RecordValue,
  meta: RecordMeta,
): RecordUpdateAction => ({
  type: UPDATE_RECORD,
  payload: {
    value: entity,
    meta,
  },
  meta: {
    key: recordKey,
  },
});

export const deleteRecordAction = (recordKey: string): RecordDeleteAction => ({
  type: DELETE_RECORD,
  payload: undefined,
  meta: { key: recordKey },
});
