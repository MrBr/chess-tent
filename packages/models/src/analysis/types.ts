import { Subject } from "../subject";
import { Step } from "../step";

export const TYPE_ANALYSIS = "analyses";

export interface Analysis extends Subject {
  id: string;
  type: typeof TYPE_ANALYSIS;
  state: {
    steps: Step[];
  };
}

export interface NormalizedAnalysis {
  id: Analysis["id"];
  type: Analysis["type"];
  state: {
    steps: Analysis["state"]["steps"];
  };
}
