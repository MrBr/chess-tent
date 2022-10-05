import { InitedRecord, RecordBase, RecordEntry, RecordWith } from './record';

export type RecordHookReturn<T extends RecordWith<RecordBase>> =
  T extends RecordWith<infer B>
    ? B extends RecordBase<infer V, infer M>
      ? InitedRecord<B & RecordEntry<V, M>>
      : never
    : never;

export type RecordHookSafe<
  T extends RecordWith<any>,
  FALLBACK = void,
> = T extends RecordWith<infer B>
  ? B extends RecordBase<infer V, infer M>
    ? FALLBACK extends void
      ? InitedRecord<B & { value: V; meta: M }>
      : InitedRecord<B & RecordEntry<V, M>>
    : never
  : never;
