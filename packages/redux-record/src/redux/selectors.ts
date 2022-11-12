import {
  RecordAppState,
  RecordBase,
  InferRecordEntry,
  UninitializedRecord,
} from '../../types';

export const uninitializedRecord: UninitializedRecord = {
  value: undefined,
  meta: {},
};
export const selectRecord =
  <T extends RecordBase<any, any>, S extends RecordAppState>(
    recordKey: string,
  ) =>
  (state: RecordAppState): InferRecordEntry<T> =>
    (state.records[recordKey] || uninitializedRecord) as InferRecordEntry<T>;
