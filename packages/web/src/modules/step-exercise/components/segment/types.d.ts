import { ExerciseSteps } from '@types';

export type SegmentsProps<T extends ExerciseSteps = ExerciseSteps> = {
  step: T;
};
