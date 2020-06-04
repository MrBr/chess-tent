import { Subject } from "../subject";

export interface Activity {
  id: string;
  state: {};
  subject: Subject;
  type: string;
}

export interface NormalizedActivity {
  id: Activity["id"];
  type: Activity["type"];
  state: Activity["state"];
  subject: Subject["id"];
}
