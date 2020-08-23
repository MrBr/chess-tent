import { useCallback } from 'react';
import { RecordHookReturn, RecordValue } from '@types';
import { useDispatch, useSelector } from 'react-redux';
import { hooks } from '@application';
import { selectRecord } from './selectors';
import { deleteRecordAction, updateRecordAction } from './actions';

export const useRecord = <T extends RecordValue>(
  recordKey: string,
): RecordHookReturn<T> => {
  const record = useSelector(selectRecord(recordKey)) || {
    value: null,
    meta: {},
  };
  const recordValue = hooks.useDenormalize<T>(record.value, record.meta.type);
  const dispatch = useDispatch();
  const update = useCallback(
    (entity: T, meta?: {}) => {
      dispatch(updateRecordAction(recordKey, entity, meta || {}));
    },
    [recordKey, dispatch],
  );
  const remove = useCallback(() => {
    dispatch(deleteRecordAction(recordKey));
  }, [recordKey, dispatch]);

  return [recordValue, update, remove];
};
