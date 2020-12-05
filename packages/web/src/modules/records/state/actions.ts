import {
  DELETE_RECORD,
  RecordDeleteAction,
  RecordMeta,
  RecordType,
  RecordUpdateAction,
  RecordUpdateValueAction,
  RecordValue,
  UPDATE_RECORD,
  UPDATE_RECORD_VALUE,
} from '@types';
import { getEntityType } from './_helpers';

export const updateRecordAction = <T extends RecordValue>(
  key: string,
  entity: T,
  meta = {},
): RecordUpdateAction => ({
  type: UPDATE_RECORD,
  payload: {
    value: entity,
    meta: {
      type: getEntityType(entity),
      ...meta,
    },
  },
  meta: {
    key,
  },
});

export const updateRecordValueAction = (
  key: string,
  payload: RecordType['value'],
  type: RecordMeta['type'],
): RecordUpdateValueAction => ({
  type: UPDATE_RECORD_VALUE,
  payload,
  meta: {
    type,
    key,
  },
});

export const deleteRecordAction = (key: string): RecordDeleteAction => ({
  type: DELETE_RECORD,
  payload: undefined,
  meta: { key },
});
