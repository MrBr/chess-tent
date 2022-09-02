import { RecordBase, RecordEntry } from './record';

export type RecordHookReturn<T extends RecordBase<any, any>> =
  T extends RecordBase<infer V, infer M> ? T & RecordEntry<V, M> : never;

export type RecordHookSafe<
  T extends RecordBase,
  FALLBACK = void,
> = T extends RecordBase<infer V, infer M>
  ? FALLBACK extends void
    ? T & { value: V; meta: M }
    : T & RecordEntry<V, M>
  : never;
