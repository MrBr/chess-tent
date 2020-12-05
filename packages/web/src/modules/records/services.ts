import { RecordMeta, RecordValue } from '@chess-tent/types';
import { useRecord } from './hooks';

export const createRecordHook = <T extends RecordValue>(
  recordKey: string,
  type: RecordMeta['type'],
) => () => useRecord<T>(recordKey, type);
