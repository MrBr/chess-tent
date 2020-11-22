import { RecordValue } from '@chess-tent/types';
import { useRecord } from './hooks';

export const createRecordHook = <T extends RecordValue>(
  recordKey: string,
) => () => useRecord<T>(recordKey);
