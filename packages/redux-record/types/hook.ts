import { RecordBase, RecordEntry, RecordWith } from './record';

export type RecordHookReturn<T extends RecordWith<any>> = T extends RecordWith<
  infer B
>
  ? B extends RecordBase<infer V, infer M>
    ? B & RecordEntry<V, M>
    : never
  : never;

export type RecordHookSafe<
  T extends RecordWith<any>,
  FALLBACK = void,
> = T extends RecordWith<infer B>
  ? B extends RecordBase<infer V, infer M>
    ? FALLBACK extends void
      ? B & { value: V; meta: M }
      : B & RecordEntry<V, M>
    : never
  : never;
