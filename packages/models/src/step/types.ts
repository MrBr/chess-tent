export type StepType = "description" | "test";

export const SCHEMA_STEP = "steps";

export interface Step<T = any, K extends StepType = StepType> {
  id: string;
  type: typeof SCHEMA_STEP;
  stepType: K;
  state: T;
}

export interface NormalizedStep {
  id: Step["id"];
  type: Step["type"];
  stepType: Step["stepType"];
  state: Step["state"];
}
