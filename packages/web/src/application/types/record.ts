export type RecordTypeNew<T> = {
  value: T | undefined | null;
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
