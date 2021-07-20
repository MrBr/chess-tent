import {
  DELETE_RECORD,
  PUSH_RECORD,
  RecordDeleteAction,
  RecordPushAction,
  RecordUpdateAction,
  UPDATE_RECORD,
  RecordValue,
  UPDATE_RECORD_META,
  RecordUpdateMetaAction,
} from '../../types';

export const updateRecordMetaAction = (
  key: string,
  meta: {},
): RecordUpdateMetaAction => ({
  type: UPDATE_RECORD_META,
  payload: meta,
  meta: {
    key,
  },
});

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

export const pushRecordAction = <T extends RecordValue<unknown>>(
  key: string,
  entity: T,
): RecordPushAction<T> => ({
  type: PUSH_RECORD,
  payload: {
    value: entity,
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
