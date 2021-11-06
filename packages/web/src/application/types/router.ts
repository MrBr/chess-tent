import { History as BaseHistory } from 'history';

export type LocationState =
  | { from?: string; search?: string }
  | undefined
  | null;

export type History = BaseHistory<LocationState | undefined | null>;
