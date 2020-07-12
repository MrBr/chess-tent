import { Subject } from "../subject";

export const TYPE_ACTIVITY = "activities";

export interface Activity<T extends Subject> {
  id: string;
  state: {};
  subject: T;
  type: typeof TYPE_ACTIVITY;
}

export interface NormalizedActivity<T extends Subject> {
  id: Activity<T>["id"];
  type: Activity<T>["type"];
  state: Activity<T>["state"];
  subject: Subject["id"];
}
