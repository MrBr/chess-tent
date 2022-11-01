import {
  CONCAT_RECORD,
  DELETE_RECORD,
  PUSH_RECORD,
  RecordConcatAction,
  RecordDeleteAction,
  RecordPushAction,
  RecordUpdateAction,
  RecordUpdateMetaAction,
  UPDATE_RECORD,
  INIT_RECORD,
  UPDATE_RECORD_META,
  RecordInitAction,
  REMOVE_RECORD,
  RecordRemoveAction,
} from '../../types';

export const updateRecordMetaAction = <M extends {}>(
  key: string,
  meta: M,
): RecordUpdateMetaAction => ({
  type: UPDATE_RECORD_META,
  payload: meta,
  meta: {
    key,
  },
});

export const updateRecordAction = <T, M extends {}>(
  key: string,
  value: T,
  meta: Partial<M> = {},
): RecordUpdateAction<T, M> => ({
  type: UPDATE_RECORD,
  payload: {
    value,
    meta,
  },
  meta: {
    key,
  },
});

export const initRecordAction = <T, M extends {}>(
  key: string,
  value: T,
  meta: Partial<M> = {},
): RecordInitAction<T, M> => ({
  type: INIT_RECORD,
  payload: {
    value,
    meta,
  },
  meta: {
    key,
  },
});

export const removeRecordAction = <T, M extends {}>(
  key: string,
  value: T,
  meta: Partial<M> = {},
): RecordRemoveAction<T, M> => ({
  type: REMOVE_RECORD,
  payload: {
    value,
    meta,
  },
  meta: {
    key,
  },
});

export const pushRecordAction = <T, M extends {}>(
  key: string,
  entity: T,
  meta: Partial<M> = {},
): RecordPushAction<T, M> => ({
  type: PUSH_RECORD,
  payload: {
    value: entity,
    meta,
  },
  meta: {
    key,
  },
});

export const concatRecordAction = <T, M extends {}>(
  key: string,
  entities: T[],
  meta: Partial<M> = {},
): RecordConcatAction<T, M> => ({
  type: CONCAT_RECORD,
  payload: {
    value: entities,
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

// TODO - Until types folder is consolidated export manually actions
export { UPDATE_RECORD_META, PUSH_RECORD, UPDATE_RECORD, DELETE_RECORD };
