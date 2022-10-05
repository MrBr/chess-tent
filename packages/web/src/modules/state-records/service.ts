import { RecordBase } from '@chess-tent/redux-record/dist/types';
import { InitedRecord } from '@chess-tent/redux-record/types';

export const isInitialized = <
  T,
  M extends { loaded?: boolean; loading?: boolean },
>(
  record: InitedRecord<RecordBase<T, M>>,
): boolean => {
  const meta = record.get()?.meta;
  return meta && !!(meta?.loaded || meta?.loading);
};
