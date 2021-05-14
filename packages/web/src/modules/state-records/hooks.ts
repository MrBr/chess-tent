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
  const record = useSelector(selectRecord(recordKey));
  const value = record?.value;
  const meta = record?.meta || {
    ...initialMeta,
    type,
  };

  const recordValue = hooks.useDenormalize<T>(value, meta.type);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (record === null && value === null) {
  //     dispatch(updateRecordAction(recordKey, value, type, meta));
  //   }
  // }, [record, value]);

  const update = useCallback(
    (entity: T, meta?: {}) => {
      dispatch(updateRecordAction(recordKey, entity, type, meta));
    },
    [dispatch, recordKey, type],
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
