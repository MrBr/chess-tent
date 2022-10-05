import { useMemo, useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import {
  RecordBase,
  RecordHookReturn,
  RecordHookSafe,
  RecordWith,
} from '../types';

const useRecordInit = <T extends RecordBase>(
  initRecord: RecordWith<T>,
  recordKey: string,
): RecordHookReturn<RecordWith<T>> => {
  // TODO - implement more specific didChange
  useSelector(() => NaN);
  const store = useStore();
  const record = useMemo(
    () => initRecord(recordKey)(store),
    [store, initRecord, recordKey],
  );
  useEffect(() => {
    record.init();
  }, [record]);
  // TODO - improve uninitialized record case
  const { value, meta } = record.get();
  return {
    ...record,
    value,
    meta,
  } as RecordHookReturn<RecordWith<T>>;
};

const useRecordSafe = <T extends RecordBase, U = void>(
  ...args: [RecordHookReturn<RecordWith<T>>, U?]
): RecordHookSafe<RecordWith<T>, U> => {
  const [record, fallback] = args;

  if (args.length === 1 && record.value === undefined) {
    throw new Error(
      `Record ${record.meta.recordKey} expected truthy but got ${record.value}.`,
    );
  } else if (record.value === undefined) {
    return {
      ...record,
      value: fallback,
    } as RecordHookSafe<RecordWith<T>, U>;
  }

  return record as RecordHookSafe<RecordWith<T>, never>;
};

export { useRecordInit, useRecordSafe };
