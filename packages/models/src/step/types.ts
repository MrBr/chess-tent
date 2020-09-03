export type StepType = "description" | "variation" | "move";

export const TYPE_STEP = "steps";

export interface Step<T extends {} = {}, K extends StepType = StepType> {
  id: string;
  type: typeof TYPE_STEP;
  stepType: K;
  state: T & { steps: Step[] };
}

export interface NormalizedStep {
  id: Step["id"];
  type: Step["type"];
  stepType: Step["stepType"];
  state: Step["state"] & {
    steps: Step["id"][];
  };
}
