import { RecordBase } from '@chess-tent/redux-record/dist/types';

export const isInitialized = <
  T,
  M extends { loaded?: boolean; loading?: boolean },
>(
  record: RecordBase<T, M>,
): boolean => {
  const { meta } = record.get();
  return !!(meta.loaded || meta.loading);
};
