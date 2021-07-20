import { hooks } from '@application';
import { useEffect } from 'react';
import { tags } from './record';

const { useRecordInit } = hooks;

export const useTags = () => {
  const record = useRecordInit(tags, 'tags');
  useEffect(() => {
    if (record.value) {
      return;
    }
    record.load();
    // eslint-disable-next-line
  }, []);
  return record.value || [];
};
