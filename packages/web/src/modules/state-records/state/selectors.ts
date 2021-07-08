import { AppState, RecordTypeNew } from '@types';

export const selectRecord = <T>(recordKey: string) => (
  state: AppState,
): RecordTypeNew<T> => state.records[recordKey] as RecordTypeNew<T>;
