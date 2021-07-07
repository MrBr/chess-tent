import { RecordType, RecordValue } from '@chess-tent/types';
import { Entity } from '@chess-tent/models';

export type RecordHook<T extends RecordValue, S extends {} = {}> = (
  suffix: string,
) => RecordHookReturnNew<T, S>;

export type RecordHookReturnNew<T extends RecordValue, S extends {} = {}> = {
  value: T | null;
  update: (value: T | null, meta?: Partial<{}>) => void;
  reset: () => void;
  meta: RecordType['meta'];
  recordKey: string;
} & S;

export type NonNullableRecordReturn<
  T extends RecordValue,
  R extends RecordHookReturn<any> = RecordHookReturn<T>
> = [T, R[1], R[2], R[3]];

export type RecordHookReturn<T extends RecordValue> = [
  T | null,
  (value: T, meta?: Partial<{}>) => void,
  () => void,
  RecordType['meta'],
];

export type CollectionRecordHookReturn<T extends Entity> = [
  T[] | null,
  (value: T[], meta?: Partial<{}>) => void,
  (value: T) => void,
  () => void,
  RecordType['meta'],
];

export type WithRecordHook = <K extends RecordValue, S extends {}>(
  useRecord: RecordHook<K, S>,
) => RecordHook<K, S>;

export type ExtendRecordHook<K extends RecordValue, T extends {}> = (
  useRecord: RecordHook<K>,
) => RecordHook<K, T>;
