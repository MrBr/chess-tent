import { Subject } from "../subject";
import { Step } from "../step";

export const TYPE_ANALYSIS = "analyses";

export interface Analysis extends Subject {
  id: string;
  type: typeof TYPE_ANALYSIS;
  state: {
    activeStepId?: Step["id"];
    steps: { 0: Step } & Array<Step>;
  };
}

export interface NormalizedAnalysis {
  id: Analysis["id"];
  type: Analysis["type"];
  state: {
    activeStepId?: Analysis["state"]["activeStepId"];
    steps: Analysis["state"]["steps"];
  };
}
