import { RecordType } from '../record';

export type RecordState = Record<string, RecordType<any>>;
export type AppState = { records: RecordState };
