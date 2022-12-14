/**
 * Records are used to store a single entity
 * or a collection which have a domain meaning.
 * Records represent abstract data model which holds
 * both data and metadata about the record.
 */

export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  // push property indicates that actions is pushed from the server
  meta: M & { push?: boolean };
};

export const UPDATE_RECORD_META = 'UPDATE_RECORD_META';
export const INIT_RECORD = 'INIT_RECORD';
export const REMOVE_RECORD = 'REMOVE_RECORD';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const PUSH_RECORD = 'PUSH_RECORD';
export const CONCAT_RECORD = 'CONCAT_RECORD';
export const POP_RECORD = 'POP_RECORD';
export const DELETE_RECORD = 'DELETE_RECORD';

/**
 * Records
 */
export type RecordUpdateMetaAction = Action<
  typeof UPDATE_RECORD_META,
  {},
  { key: string }
>;
export type RecordUpdateAction<T, M extends {}> = Action<
  typeof UPDATE_RECORD,
  { value: T; meta?: Partial<M> },
  { key: string }
>;
export type RecordInitAction<T, M extends {}> = Action<
  typeof INIT_RECORD,
  { value: T; meta?: Partial<M> },
  { key: string }
>;
export type RecordRemoveAction<T, M extends {}> = Action<
  typeof REMOVE_RECORD,
  { value: T; meta?: Partial<M> },
  { key: string }
>;

export type RecordPushAction<T, M extends {}> = Action<
  typeof PUSH_RECORD,
  { value: T; meta?: Partial<M> },
  { key: string }
>;

export type RecordConcatAction<T, M extends {}> = Action<
  typeof CONCAT_RECORD,
  { value: T[]; meta?: Partial<M> },
  { key: string }
>;

export type RecordDeleteAction = Action<
  typeof DELETE_RECORD,
  void,
  { key: string }
>;

export type RecordAction =
  | RecordUpdateAction<unknown, {}>
  | RecordDeleteAction
  | RecordUpdateMetaAction
  | RecordPushAction<unknown, {}>
  | RecordConcatAction<unknown, {}>
  | RecordRemoveAction<unknown, {}>
  | RecordInitAction<unknown, {}>;
