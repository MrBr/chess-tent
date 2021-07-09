import { Store } from 'redux';

export type RecordValueNew<V> = V | null | undefined;

export type MF = (
  store: Store,
) => (record: { recordKey: string }) => { recordKey: string };

export type UseRecord = <V>(store: Store, recordKey: string) => RecordBase<V>;

export type InferRecordValue<T extends RecordBase<any>> = T extends RecordBase<
  infer V
>
  ? V extends (infer AV)[]
    ? AV
    : V
  : never;

export type RecordBase<V> = {
  get: () => RecordTypeNew<V>;
  update: (value: V | null | undefined, meta?: Partial<RecordMetaNew>) => void;
  reset: () => void;
  recordKey: string;
};

export type RecordTypeNew<T> = {
  value: RecordValueNew<T>;
  meta: RecordMetaNew;
};

export type RecordMetaNew = {
  type: string;
  loading?: boolean;
  loaded?: boolean;
  recordKey: string;
};

export type RecordHook<T, S extends {} = {}> = (
  suffix: string,
) => RecordHookReturnNew<T, S>;

export type RecordHookReturnNew<T, S extends {} = {}> = {
  value: T | null | undefined;
  update: (value: T | null | undefined, meta?: Partial<RecordMetaNew>) => void;
  reset: () => void;
  meta: RecordMetaNew;
  recordKey: string;
} & S;

function createRecord<T1, T2>(
  f1: (store: Store) => (x: T1) => T2,
): (store: Store, recordKey: string) => T2;
function createRecord<T1, T2, T3>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
): (store: Store, recordKey: string) => T3;
function createRecord<T1, T2, T3, T4>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
): (store: Store, recordKey: string) => T4;
function createRecord<T1, T2, T3, T4, T5>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
  f4: (store: Store) => (x: T4) => T5,
): (store: Store, recordKey: string) => T5;
function createRecord<T1, T2, T3, T4, T5, T6>(
  f1: (store: Store) => (x: T1) => T2,
  f2: (store: Store) => (x: T2) => T3,
  f3: (store: Store) => (x: T3) => T4,
  f4: (store: Store) => (x: T4) => T5,
  f5: (store: Store) => (x: T5) => T6,
): (store: Store, recordKey: string) => T6;
function createRecord(...fns: MF[]) {
  return (store: Store, recordKey: string) => {
    return fns.reduce((record, middleware) => middleware(store)(record), {
      recordKey,
    });
  };
}
export type CreateRecord = typeof createRecord;
