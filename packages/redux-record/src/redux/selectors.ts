import {
  AppState,
  RecordBase,
  InferRecordEntry,
  UninitializedRecord,
} from '../../types';

export const uninitializedRecord: UninitializedRecord = {
  value: undefined,
  meta: {},
};
export const selectRecord =
  <T extends RecordBase<any, any>>(recordKey: string) =>
  (state: AppState): InferRecordEntry<T> =>
    (state.records[recordKey] || uninitializedRecord) as InferRecordEntry<T>;
