import {
  ExerciseActivityState,
  ExerciseSteps,
  StepBoardComponentProps,
} from '@types';
import { Activity } from '@chess-tent/models';

export type SegmentsProps<T extends ExerciseSteps = ExerciseSteps> = {
  step: T;
};

export type SegmentActivityProps = SegmentsProps & {
  Chessboard: StepBoardComponentProps['Chessboard'];
  stepActivityState: ExerciseActivityState;
  activity: Activity;
  setStepActivityState: (state: {}) => void;
};

export type InferUpdateStep<
  T extends SegmentsProps,
  P extends {} = {}
> = T extends SegmentsProps<infer S>
  ? T & {
      updateStep: (step: S) => void;
    } & P
  : never;
