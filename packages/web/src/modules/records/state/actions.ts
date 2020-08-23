import {
  RECORD_DELETE_ACTION,
  RECORD_UPDATE_ACTION,
  RecordDeleteAction,
  RecordMeta,
  RecordUpdateAction,
  RecordValue,
} from '@types';

export const updateRecordAction = <T extends RecordValue>(
  recordKey: string,
  entity: RecordValue,
  meta: RecordMeta,
): RecordUpdateAction => ({
  type: RECORD_UPDATE_ACTION,
  payload: {
    value: entity,
    meta,
  },
  meta: {
    key: recordKey,
  },
});

export const deleteRecordAction = (recordKey: string): RecordDeleteAction => ({
  type: RECORD_DELETE_ACTION,
  payload: undefined,
  meta: { key: recordKey },
});
