import { EntitiesState, MetaState } from '@chess-tent/types';
import { RecordEntry } from '../record';

export type RecordState = Record<string, Required<RecordEntry<any>>>;
export type AppState = { records: RecordState } & EntitiesState & MetaState;
