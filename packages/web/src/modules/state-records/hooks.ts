import { useCallback, useMemo } from 'react';
import { RecordHookReturn, RecordMeta, RecordValue } from '@types';
import { useDispatch, useSelector } from 'react-redux';
import { hooks } from '@application';
import { selectRecord } from './state/selectors';
import { deleteRecordAction, updateRecordAction } from './state/actions';

export const useRecord = <T extends RecordValue>(
  recordKey: string,
  type: RecordMeta['type'],
  initialMeta?: RecordMeta,
): RecordHookReturn<T> => {
  const record = useSelector(selectRecord(recordKey)) || {
    value: null,
    meta: {
      ...initialMeta,
      type,
    },
  };
  const recordValue = hooks.useDenormalize<T>(record.value, record.meta.type);
  const dispatch = useDispatch();
  const update = useCallback(
    (entity: T, meta?: {}) => {
      dispatch(updateRecordAction(recordKey, entity, type, meta));
    },
    [dispatch, recordKey, type],
  );
  const remove = useCallback(() => {
    dispatch(deleteRecordAction(recordKey));
  }, [recordKey, dispatch]);
  const meta = record.meta;

  return useMemo(() => [recordValue, update, remove, meta], [
    recordValue,
    update,
    remove,
    meta,
  ]);
};
