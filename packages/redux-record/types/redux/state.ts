import { RecordEntry } from '../record';

export type RecordState = Record<string, Required<RecordEntry<any>>>;
export type RecordAppState = { records: RecordState };
