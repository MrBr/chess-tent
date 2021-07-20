import { useMemo } from 'react';
import { useStore, useSelector } from 'react-redux';
import {
  InferRecordValue,
  InitRecord,
  RecordBase,
  RecordHookInit,
  RecordHookReturn,
  RecordHookSafe,
  RecordMeta,
  RecordValue,
} from '../types';

const useRecordInit = <T extends RecordBase<any>>(
  initRecord: InitRecord<T>,
  suffix = '',
): RecordHookReturn<
  T,
  { value: RecordValue<InferRecordValue<T>>; meta: RecordMeta }
> => {
  useSelector(() => NaN);
  const store = useStore();
  const record = useMemo(() => initRecord(store, suffix), [
    store,
    initRecord,
    suffix,
  ]);
  const { value, meta } = record.get();
  return {
    ...record,
    value,
    meta,
  };
};

const useRecordSafe = <T extends RecordBase<any>, U = void>(
  ...args: [RecordHookInit<T>, U?]
): RecordHookSafe<T, U> => {
  const [record, fallback] = args;

  if (args.length === 1 && record.value === undefined) {
    throw new Error(
      `Record ${record.recordKey} expected truthy but got ${record.value}.`,
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
