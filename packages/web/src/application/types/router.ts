import { History as BaseHistory } from 'history';

export type History = BaseHistory<
  { from?: string; search?: string } | undefined | null
>;
