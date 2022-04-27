import {
  InferRecordValue,
  InferRecordValueSafe,
  RecordBase,
  RecordMeta,
  RecordValue,
} from './record';

export type RecordHookReturn<T extends RecordBase<any>, U> = T & U;

export type RecordHookInit<T extends RecordBase<any>> = RecordHookReturn<
  T,
  { value: InferRecordValue<T>; meta: RecordMeta }
>;

export type RecordHookSafe<
  T extends RecordBase<any>,
  FALLBACK = void,
> = RecordHookReturn<
  T,
  {
    value: FALLBACK extends void
      ? InferRecordValueSafe<T>
      : InferRecordValueSafe<T> | FALLBACK;
    meta: RecordMeta;
  }
>;
