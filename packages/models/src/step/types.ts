export type StepType = "description" | "test";

export const SCHEMA_STEP = "steps";

export interface Step<T = any, K extends StepType = StepType> {
  schema: typeof SCHEMA_STEP;
  id: string;
  type: K;
  state: T;
}

export interface NormalizedStep {
  id: Step["id"];
  schema: Step["schema"];
  type: Step["type"];
  state: Step["state"];
}
