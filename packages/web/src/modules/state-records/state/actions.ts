import {
  DELETE_RECORD,
  RecordDeleteAction,
  RecordMetaNew,
  RecordUpdateAction,
  UPDATE_RECORD,
} from '@types';

export const updateRecordAction = <T>(
  key: string,
  value: T,
  meta?: {},
): RecordUpdateAction<T> => ({
  type: UPDATE_RECORD,
  payload: {
    value,
    meta,
  },
  meta: {
    key,
  },
});

export const deleteRecordAction = (key: string): RecordDeleteAction => ({
  type: DELETE_RECORD,
  payload: undefined,
  meta: { key },
});
