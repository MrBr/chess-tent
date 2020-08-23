import { Entity } from '@chess-tent/models';
import { useRecord } from './state/hooks';

export const createRecordHook = <T extends Entity>(recordKey: string) => () =>
  useRecord<T>(recordKey);
