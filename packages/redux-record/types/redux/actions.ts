import { RecordValue } from '../record';
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
export type RecordUpdateAction<T> = Action<
  typeof UPDATE_RECORD,
  { value: T; meta?: {} },
  { key: string }
>;

export type RecordPushAction<T> = Action<
  typeof PUSH_RECORD,
  { value: RecordValue<T> },
  { key: string }
>;

export type RecordDeleteAction = Action<
  typeof DELETE_RECORD,
  void,
  { key: string }
>;

export type RecordAction =
  | RecordUpdateAction<unknown>
  | RecordDeleteAction
  | RecordUpdateMetaAction
  | RecordPushAction<unknown>;
