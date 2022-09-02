import { RecordEntry } from '../record';

export type RecordState = Record<string, RecordEntry<any>>;
export type AppState = { records: RecordState };
