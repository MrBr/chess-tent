import { Subject } from "../subject";
import { User } from "../user";

export const TYPE_ACTIVITY = "activities";

export interface Activity<
  T extends Subject = Subject,
  S extends { [key: string]: any } = any
> {
  id: string;
  state: S;
  subject: T;
  type: typeof TYPE_ACTIVITY;
  owner: User;
  users: User[]; // Collaborators - write permissions
  completedSteps: string[];
  completed: boolean;
}

export interface NormalizedActivity<
  T extends Subject = Subject,
  S extends {} = {}
> {
  id: Activity<T>["id"];
  type: Activity<T>["type"];
  state: Activity<T, S>["state"];
  subject: Subject;
  owner: User["id"];
  users: User["id"][];
}
