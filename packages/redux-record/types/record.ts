import { MiddlewareAPI } from 'redux';

export type RecordValueNormalizedSingle = string;
export type RecordValueNormalizedList = string[];
export type RecordValueNormalized =
  | RecordValueNormalizedSingle
  | RecordValueNormalizedList;
export type GetRecordNormalizedValue<
  T extends RecordValue<any>
> = T extends {}[]
  ? RecordValueNormalizedList
  : T extends {}
  ? RecordValueNormalizedSingle
  : RecordValueNormalized;

export type RecordValue<V> = V | null | undefined;

export type MF = (
  store: MiddlewareAPI,
) => (record: { recordKey: string }) => { recordKey: string };

export type RecordRecipe<U extends RecordBase<any>, T extends {} = {}> = (
  store: MiddlewareAPI,
) => (record: U) => U & T;

export type InitRecord<T extends RecordBase<any>> = (
  store: MiddlewareAPI,
  recordKey: string,
) => T;

export type InferRecordValueType<
  T extends RecordBase<any>
> = T extends RecordBase<infer V> ? (V extends (infer AV)[] ? AV : V) : never;

export type InferRecordValue<T extends RecordBase<any>> = T extends RecordBase<
  infer V
>
  ? RecordValue<V>
  : never;

export type InferRecordValueSafe<
  T extends RecordBase<any>
> = T extends RecordBase<infer V> ? V : never;

export type InferInitRecord<T extends InitRecord<any>> = T extends InitRecord<
  infer V
>
  ? V
  : never;

export type RecordBase<V> = {
  get: () => RecordType<V>;
  update: (value: RecordValue<V>, meta?: Partial<RecordMeta>) => void;
  amend: (meta: Partial<RecordMeta>) => void;
  reset: () => void;
  recordKey: string;
};

export type RecordType<T> = {
  value: RecordValue<T>;
  meta: RecordMeta;
};

export type RecordMeta = {
  loading?: boolean;
  loaded?: boolean;
  recordKey: string;
};

export declare function CreateRecord<T1, T2>(
  f1: (store: MiddlewareAPI) => (x: T1) => T2,
): (store: MiddlewareAPI, recordKey: string) => T2;
export declare function CreateRecord<T1, T2, T3>(
  f1: (store: MiddlewareAPI) => (x: T1) => T2,
  f2: (store: MiddlewareAPI) => (x: T2) => T3,
): (store: MiddlewareAPI, recordKey: string) => T3;
export declare function CreateRecord<T1, T2, T3, T4>(
  f1: (store: MiddlewareAPI) => (x: T1) => T2,
  f2: (store: MiddlewareAPI) => (x: T2) => T3,
  f3: (store: MiddlewareAPI) => (x: T3) => T4,
): (store: MiddlewareAPI, recordKey: string) => T4;
export declare function CreateRecord<T1, T2, T3, T4, T5>(
  f1: (store: MiddlewareAPI) => (x: T1) => T2,
  f2: (store: MiddlewareAPI) => (x: T2) => T3,
  f3: (store: MiddlewareAPI) => (x: T3) => T4,
  f4: (store: MiddlewareAPI) => (x: T4) => T5,
): (store: MiddlewareAPI, recordKey: string) => T5;
export declare function CreateRecord<T1, T2, T3, T4, T5, T6>(
  f1: (store: MiddlewareAPI) => (x: T1) => T2,
  f2: (store: MiddlewareAPI) => (x: T2) => T3,
  f3: (store: MiddlewareAPI) => (x: T3) => T4,
  f4: (store: MiddlewareAPI) => (x: T4) => T5,
  f5: (store: MiddlewareAPI) => (x: T5) => T6,
): (store: MiddlewareAPI, recordKey: string) => T6;
