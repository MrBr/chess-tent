import { ReactNode } from 'react';
import {
  EditorProps,
  ExerciseActivityState,
  ExerciseSegments,
  ExerciseSegmentKeys,
  ExerciseSteps,
  ExerciseToolboxProps,
  StepBoardComponentProps,
  AppStep,
} from '@types';
import { Activity } from '@chess-tent/models';

export type SegmentProps<
  T extends ExerciseSteps = ExerciseSteps,
  S extends keyof ExerciseSegments = keyof ExerciseSegments
> = {
  step: T;
  segment: T['state'][S];
  updateSegment: (segmentPatch: Partial<T['state'][S]>) => void;
  updateStep: (step: AppStep) => void;
};

export type SegmentBoardProps<
  T extends ExerciseSteps,
  S extends ExerciseSegmentKeys
> = SegmentProps<T, S> & StepBoardComponentProps & EditorProps;

export type SegmentToolboxProps<
  T extends ExerciseSteps = ExerciseSteps,
  S extends keyof ExerciseSegments
> = SegmentProps<T, S> &
  ExerciseToolboxProps & { children?: ReactNode; placeholder?: string };

export type SegmentActivityProps = {
  step: ExerciseSteps;
  Chessboard: StepBoardComponentProps['Chessboard'];
  stepActivityState: ExerciseActivityState;
  activity: Activity;
  setStepActivityState: (state: {}) => void;
};

export type InferUpdateStep<
  T extends SegmentProps,
  P extends {} = {}
> = T extends SegmentProps<infer S>
  ? T & {
      updateStep: (step: S) => void;
    } & P
  : never;
