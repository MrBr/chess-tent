import { AppState } from '@types';

export const selectMeta = (metaKey: string) => (state: AppState) =>
  state.meta[metaKey];
