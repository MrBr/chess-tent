import { useCallback, useEffect, useMemo } from 'react';
import {
  RecordHookReturn,
  CollectionRecordHookReturn,
  RecordMeta,
  RecordValue,
} from '@types';
import { useDispatch, useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import { hooks } from '@application';
import { Entity } from '@chess-tent/models';
import { selectRecord } from './state/selectors';
import {
  deleteRecordAction,
  updateRecordAction,
  pushRecordAction,
} from './state/actions';

export const useRecord = <T extends RecordValue>(
  recordKey: string,
  type: RecordMeta['type'],
  initialMeta?: RecordMeta,
): RecordHookReturn<T> => {
  const record = useSelector(selectRecord(recordKey));
  const value = record?.value;
  const meta = record?.meta || {
    ...initialMeta,
    type,
  };

  const recordValue = hooks.useDenormalize<T>(value, meta.type);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNil(record) && isNil(value)) {
      dispatch(updateRecordAction(recordKey, value, { ...meta, type }));
    }
  }, [dispatch, meta, record, recordKey, type, value]);

  const update = useCallback(
    (entity: T, meta?: Partial<RecordMeta>) => {
      dispatch(updateRecordAction(recordKey, entity, meta));
    },
    [dispatch, recordKey],
  );
  const remove = useCallback(() => {
    dispatch(deleteRecordAction(recordKey));
  }, [recordKey, dispatch]);

  return useMemo(() => [recordValue, update, remove, meta], [
    recordValue,
    update,
    remove,
    meta,
  ]);
};

export const useCollectionRecord = <T extends Entity>(
  recordKey: string,
  type: RecordMeta['type'],
  initialMeta?: RecordMeta,
): CollectionRecordHookReturn<T> => {
  const [recordValue, , remove, meta] = useRecord<T>(
    recordKey,
    type,
    initialMeta,
  );

  const recordValueArray = Array.isArray(recordValue)
    ? (recordValue as T[])
    : [];
  const dispatch = useDispatch();
  const updateArray = useCallback(
    (entity: T[], meta?: Partial<RecordMeta>) => {
      dispatch(updateRecordAction(recordKey, entity, meta));
    },
    [dispatch, recordKey],
  );
  const push = useCallback(
    (entity: T) => {
      dispatch(pushRecordAction(recordKey, entity));
    },
    [dispatch, recordKey],
  );

  return useMemo(() => [recordValueArray, updateArray, push, remove, meta], [
    recordValueArray,
    updateArray,
    push,
    remove,
    meta,
  ]);
};
