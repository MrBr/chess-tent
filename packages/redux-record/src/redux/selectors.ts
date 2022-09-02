import { AppState, RecordBase, InferRecordEntry } from '../../types';

export const selectRecord =
  <T extends RecordBase<any, any>>(recordKey: string) =>
  (state: AppState): InferRecordEntry<T> =>
    state.records[recordKey] as InferRecordEntry<T>;
