import { useMemo } from 'react';
import { UseRecord } from '@types';
import { useStore } from 'react-redux';

export const useRecord = <V>(resolveRecord: UseRecord, suffix: string) => {
  const store = useStore();
  const record = useMemo(() => resolveRecord<V>(store, suffix), [
    store,
    suffix,
  ]);
  const { value, meta } = record.get();
  return {
    ...record,
    value,
    meta,
  };
};
