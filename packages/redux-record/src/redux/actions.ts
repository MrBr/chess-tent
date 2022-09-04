import {
  CONCAT_RECORD,
  DELETE_RECORD,
  PUSH_RECORD,
  RecordConcatAction,
  RecordDeleteAction,
  RecordPushAction,
  RecordUpdateAction,
  RecordUpdateMetaAction,
  RecordValue,
  UPDATE_RECORD,
  UPDATE_RECORD_META,
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

export const concatRecordAction = <T extends RecordValue<unknown>>(
  key: string,
  entities: T[],
): RecordConcatAction<T> => ({
  type: CONCAT_RECORD,
  payload: {
    value: entities,
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

// TODO - Until types folder is consolidated export manually actions
export { UPDATE_RECORD_META, PUSH_RECORD, UPDATE_RECORD, DELETE_RECORD };
