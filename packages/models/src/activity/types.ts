import { Subject } from "../subject";
import { User } from "../user";

export const TYPE_ACTIVITY = "activities";

export interface Activity<T extends Subject> {
  id: string;
  state: {};
  subject: T;
  type: typeof TYPE_ACTIVITY;
  owner: User;
  users: User[]; // Collaborators - write permissions
}

export interface NormalizedActivity<T extends Subject> {
  id: Activity<T>["id"];
  type: Activity<T>["type"];
  state: Activity<T>["state"];
  subject: Subject["id"];
  owner: User["id"];
  users: User["id"][];
}
