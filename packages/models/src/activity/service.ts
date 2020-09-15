import { Subject } from "../subject";
import { User } from "../user";
import { Activity, TYPE_ACTIVITY } from "./types";
import { Step } from "../step";

export const isActivity = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_ACTIVITY;

export const createActivity = <T extends Subject, K extends {}>(
  id: string,
  subject: T,
  owner: User,
  state: K,
  users: User[] = []
): Activity<T, K> => ({
  id,
  type: TYPE_ACTIVITY,
  subject,
  owner,
  users,
  state,
  completed: false,
  completedSteps: []
});

export const isStepCompleted = (activity: Activity, step: Step) =>
  activity.completedSteps.some(stepId => stepId === step.id);

export const markStepCompleted = (
  activity: Activity,
  step: Step
): Activity["completedSteps"] => [...activity.completedSteps, step.id];

export const updateStepState = <T>(
  activity: T extends Activity ? T : never,
  stepId: Step["id"],
  state: {}
): T extends Activity ? T["state"] : never => ({
  ...(activity.state[stepId] || {}),
  ...state
});
