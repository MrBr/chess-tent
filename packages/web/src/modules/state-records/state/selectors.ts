import { AppState } from '@types';

export const selectRecord = (recordKey: string) => (state: AppState) =>
  state.records[recordKey];
