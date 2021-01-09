export interface Subject {
  id: string;
  state: Record<string, any>;
  type: string;
}

export type SubjectPath = (string | number)[];
export type SerializedSubjectPath = string;
export type SubjectUpdates = { [key: string]: any };
export type SubjectPathUpdate = { path: SubjectPath; value: any };
