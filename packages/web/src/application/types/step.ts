import { ComponentType, FunctionComponent } from 'react';
import { Activity, Chapter, Lesson, Step, StepType } from '@chess-tent/models';
import { FEN } from './chess';
import { ChessboardInterface, ChessboardProps } from './components';
import { ClassComponent } from './_helpers';

export type StepSystemProps = {
  setActiveStep: (step: Step) => void;
  activeStep: Step;
  lesson: Lesson;
  chapter: Chapter;
};
export type StepBoardComponentProps = {
  Chessboard:
    | FunctionComponent<ChessboardProps>
    | ClassComponent<ChessboardInterface>;
  status?: string;
};
export type StepProps<S extends Step, P = {}> = {
  step: S;
} & StepSystemProps &
  P;
export interface EditorProps {
  updateStep: (step: Step) => void;
  removeStep: (step: Step) => void;
}

export type StepComponent<S extends Step, P extends {} = {}> = ComponentType<
  StepProps<S, P>
>;

export type StepModuleComponentKey = 'Editor' | 'Playground' | 'StepperStep';

export type ActivityFooterProps = {
  next?: () => void;
  prev?: () => void;
  stepsCount?: number;
  currentStep?: number;
};
export type StepModule<
  T extends Step = any,
  K extends StepType = StepType,
  U extends {} = {}
> = {
  Editor: StepComponent<T, EditorProps & StepBoardComponentProps>;
  Playground: StepComponent<
    T,
    {
      setStepActivityState: (state: {}) => void;
      stepActivityState: U;
      nextStep: () => void;
      prevStep: () => void;
      Footer: FunctionComponent<ActivityFooterProps>;
      activity: Activity;
      completeStep: (step: Step) => void;
    } & StepBoardComponentProps
  >;
  StepperStep: StepComponent<T, EditorProps>;
  stepType: K;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T extends Step<infer S, K> ? S : never>,
  ) => T;
};
