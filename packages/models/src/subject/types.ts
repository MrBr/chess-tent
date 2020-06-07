export const TYPE_SUBJECT = "subjects";

export interface Subject {
  id: string;
  state: {};
  type: string;
}

export interface NormalizedSubject {
  id: Subject["id"];
  type: Subject["type"];
  state: Subject["state"];
}
