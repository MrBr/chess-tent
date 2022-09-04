import { MiddlewareAPI } from 'redux';

export type RecordValueNormalizedSingle = string;
export type RecordValueNormalizedList = string[];
export type RecordValueNormalized =
  | RecordValueNormalizedSingle
  | RecordValueNormalizedList;
export type GetRecordNormalizedValue<T extends RecordValue<any>> =
  T extends {}[]
    ? RecordValueNormalizedList
    : T extends {}
    ? RecordValueNormalizedSingle
    : RecordValueNormalized;

export type RecordValue<V> = V | null | undefined;

export type MF = (
  recordKey: string,
) => (store: MiddlewareAPI) => (record: {}) => {};

export type RecordRecipe<U, T> = (
  recordKey: string,
) => (store: MiddlewareAPI) => (record: U) => U & T;

export type RecordWith<T extends RecordBase> = (
  recordKey: string,
) => (store: MiddlewareAPI) => T;

export type RecordEntry<T, M extends {} = {}> = {
  value: RecordValue<T>;
  meta: RecordMeta<M>;
};

export type InferRecordValueType<T extends RecordBase> = T extends RecordBase<
  infer V
>
  ? V extends (infer AV)[]
    ? AV
    : V
  : never;

export type InferRecordValue<T extends RecordBase> = T extends RecordBase<
  infer V
>
  ? RecordValue<V>
  : never;

export type InferRecordMeta<T extends RecordBase> = T extends RecordBase<
  infer V,
  infer M
>
  ? M
  : never;

export type InferRecordValueSafe<T extends RecordBase> = T extends RecordBase<
  infer V
>
  ? V
  : never;

export type InferRecord<T extends RecordWith<any>> = T extends RecordWith<
  infer R
>
  ? R extends RecordBase<infer V, infer M>
    ? R
    : never
  : never;

export type InferRecordEntry<T extends RecordBase> = T extends RecordBase<
  infer V,
  infer M
>
  ? RecordEntry<V, M>
  : never;

export interface RecordBase<V = any, M extends {} = {}> {
  // $entry is a placeholder property used to get a proper type inference in the methods
  // Objects aren't extended/inferred in a right way when encapsulated within method return
  $entry: RecordEntry<V, M>;
  get: () => this['$entry'];
  update: (
    value: RecordValue<V>,
    meta?: Partial<this['$entry']['meta']>,
  ) => void;
  amend: (meta: Partial<this['$entry']['meta']>) => void;
  reset: () => void;
}

export type RecordMeta<M extends {}> = {
  recordKey: string;
} & M;

export declare function CreateRecord<T1, T2>(
  f1: (recordKey: string) => (store: MiddlewareAPI) => (record: T1) => T2,
): (recordKey: string) => (store: MiddlewareAPI) => T2;
export declare function CreateRecord<T1, T2, T3>(
  f1: (recordKey: string) => (store: MiddlewareAPI) => (record: T1) => T2,
  f2: (recordKey: string) => (store: MiddlewareAPI) => (record: T2) => T3,
): (recordKey: string) => (store: MiddlewareAPI) => T3;
export declare function CreateRecord<T1, T2, T3, T4>(
  f1: (recordKey: string) => (store: MiddlewareAPI) => (record: T1) => T2,
  f2: (recordKey: string) => (store: MiddlewareAPI) => (record: T2) => T3,
  f3: (recordKey: string) => (store: MiddlewareAPI) => (record: T3) => T4,
): (recordKey: string) => (store: MiddlewareAPI) => T4;
export declare function CreateRecord<T1, T2, T3, T4, T5>(
  f1: (recordKey: string) => (store: MiddlewareAPI) => (record: T1) => T2,
  f2: (recordKey: string) => (store: MiddlewareAPI) => (record: T2) => T3,
  f3: (recordKey: string) => (store: MiddlewareAPI) => (record: T3) => T4,
  f4: (recordKey: string) => (store: MiddlewareAPI) => (record: T4) => T5,
): (recordKey: string) => (store: MiddlewareAPI) => T5;
export declare function CreateRecord<T1, T2, T3, T4, T5, T6>(
  f1: (recordKey: string) => (store: MiddlewareAPI) => (record: T1) => T2,
  f2: (recordKey: string) => (store: MiddlewareAPI) => (record: T2) => T3,
  f3: (recordKey: string) => (store: MiddlewareAPI) => (record: T3) => T4,
  f4: (recordKey: string) => (store: MiddlewareAPI) => (record: T4) => T5,
  f5: (recordKey: string) => (store: MiddlewareAPI) => (record: T5) => T6,
): (recordKey: string) => (store: MiddlewareAPI) => T6;
