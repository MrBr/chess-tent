import { AppState, RecordType, RecordValue } from '@types';

export const selectRecord = <T extends RecordValue>(recordKey: string) => (
  state: AppState,
): RecordType<T> => state.records[recordKey] as RecordType<T>;
