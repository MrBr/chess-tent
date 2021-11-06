import { RecordBase } from '@chess-tent/redux-record/dist/types';

export const isInitialized = <T>(record: RecordBase<T>): boolean =>
  !!(record.get().meta.loaded || record.get().meta.loading);
