import { hooks, records } from '@application';
import { useEffect } from 'react';
import { tags } from './record';

const { useRecordInit } = hooks;
const { isInitialized } = records;

export const useTags = () => {
  const record = useRecordInit(tags, 'tags');
  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load();
    // eslint-disable-next-line
  }, []);
  return record.value || [];
};
