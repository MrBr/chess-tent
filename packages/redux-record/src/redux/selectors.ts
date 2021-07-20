import { RecordType, AppState } from '../../types';

export const selectRecord = <T>(recordKey: string) => (
  state: AppState,
): RecordType<T> => state.records[recordKey] as RecordType<T>;
