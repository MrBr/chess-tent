import { ReactElement } from 'react';
import { AppStep, ExerciseSteps } from '@types';

export type SegmentsProps<T extends ExerciseSteps = ExerciseSteps> = {
  children: ReactElement | null;
  step: T;
};
