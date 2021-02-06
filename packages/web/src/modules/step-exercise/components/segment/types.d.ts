import { ExerciseSteps } from '@types';

export type SegmentsProps<T extends ExerciseSteps = ExerciseSteps> = {
  step: T;
};

export type InferUpdateStep<
  T extends SegmentsProps,
  P extends {} = {}
> = T extends SegmentsProps<infer S>
  ? T & {
      updateStep: (step: S) => void;
    } & P
  : never;
