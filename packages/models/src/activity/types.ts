import { Subject } from "../subject";

export const TYPE_ACTIVITY = "activities";

export interface Activity {
  id: string;
  state: {};
  subject: Subject;
  type: typeof TYPE_ACTIVITY;
}

export interface NormalizedActivity {
  id: Activity["id"];
  type: Activity["type"];
  state: Activity["state"];
  subject: Subject["id"];
}
