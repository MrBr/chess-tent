import { useMemo } from 'react';
import { useStore, useSelector } from 'react-redux';
import { RecordHookReturn, RecordHookSafe, RecordWith } from '../types';

const useRecordInit = <T extends RecordWith<any>>(
  initRecord: T,
  suffix: string,
): RecordHookReturn<T> => {
  // TODO - use selector to select record entry
  useSelector(() => NaN);
  const store = useStore();
  const record = useMemo(
    () => initRecord(suffix)(store),
    [store, initRecord, suffix],
  );
  const { value, meta } = record.get();
  return {
    ...record,
    value,
    meta,
  } as RecordHookReturn<T>;
};

const useRecordSafe = <T extends RecordWith<any>, U = void>(
  ...args: [RecordHookReturn<T>, U?]
): RecordHookSafe<T, U> => {
  const [record, fallback] = args;

  if (args.length === 1 && record.value === undefined) {
    throw new Error(
      `Record ${record.meta.recordKey} expected truthy but got ${record.value}.`,
    );
  } else if (record.value === undefined) {
    return {
      ...record,
      value: fallback,
    } as RecordHookSafe<T, U>;
  }

  return record as RecordHookSafe<T, never>;
};

export { useRecordInit, useRecordSafe };
