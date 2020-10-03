import { RecordValue } from '@chess-tent/types';
import { useRecord } from './state/hooks';

export const createRecordHook = <T extends RecordValue>(
  recordKey: string,
) => () => useRecord<T>(recordKey);
