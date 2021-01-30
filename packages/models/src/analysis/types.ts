import { Subject } from '../subject';
import { Step } from '../step';

export const TYPE_ANALYSIS = 'analyses';

export type InferAnalysis<T> = T extends Analysis<infer U> ? T : never;
export type InferAnalysisStep<T> = T extends Analysis<infer U> ? U : never;

export interface Analysis<T extends Step> extends Subject {
  id: string;
  type: typeof TYPE_ANALYSIS;
  state: {
    activeStepId?: Step['id'];
    steps: { 0: T } & Array<Step>;
  };
}

export interface NormalizedAnalysis<T extends Step> {
  id: Analysis<T>['id'];
  type: Analysis<T>['type'];
  state: {
    activeStepId?: Analysis<T>['state']['activeStepId'];
    steps: Analysis<T>['state']['steps'];
  };
}
