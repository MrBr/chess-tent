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
export type UninitializedRecord = { value: undefined; meta: {} };
export type RecordValue<V> = V | null | undefined;

export type MF<
  F extends (...args: any[]) => any,
  R extends RecordBase = any,
> = (
  recordKey: string,
) => (store: MiddlewareAPI) => (record: InitedRecord<R>) => F;

export type InitRecord<T> = (recordKey: string) => (store: MiddlewareAPI) => T;

export type RecordWith<T extends RecordBase> = (
  recordKey: string,
) => (store: MiddlewareAPI) => InitedRecord<T>;

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

export type InitedRecord<T extends {}> = {
  [Property in keyof T]: InferFunction<T[Property]>;
};
export type MFInitedRecord<T extends {}, R extends {}> = {
  [Property in keyof T]: T[Property] extends (recordKey: string) => infer R1
    ? R1 extends (store: MiddlewareAPI) => infer R2
      ? R2 extends (record: any) => infer R3
        ? (
            recordKey: string,
          ) => (store: MiddlewareAPI) => (record: InitedRecord<R>) => R3
        : T[Property]
      : T[Property]
    : T[Property];
};

export interface RecordEntryType<V = any, M extends {} = {}> {
  // $entry is a placeholder property used to get a proper type inference in the methods
  // Objects aren't extended/inferred in a right way when encapsulated within method return
  $value: RecordValue<V>;
  $meta: Partial<M>;
  // Used to initialise record state
  initialMeta: Partial<M>;
  initialValue: RecordValue<V>;
}

export interface RecordBase<V = any, M extends {} = {}>
  extends RecordEntryType<V, M & { recordKey: string }> {
  get: MF<() => RecordEntry<V, this['$meta']>>;
  update: MF<(value: RecordValue<V>, meta?: this['$meta']) => void>;
  remove: MF<(value: V, meta?: this['$meta']) => void>;
  amend: MF<(meta: this['$meta']) => void>;
  reset: MF<() => void>;
  init: MF<() => void, RecordBase>;
}

type InferFunction<T extends MF<any> | any> = T extends MF<infer R> ? R : T;

export type CreateRecord = <R extends RecordBase<any, any>>(
  descriptor: MFInitedRecord<
    Required<Omit<R, keyof RecordBase>> & Partial<Pick<R, keyof RecordBase>>,
    R
  >,
) => RecordWith<R>;

export type RecordMeta<M extends {}> = Partial<
  {
    recordKey: string;
  } & M
>;
