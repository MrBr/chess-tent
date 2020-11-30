import { ComponentType, FunctionComponent, ReactElement } from 'react';
import {
  Activity,
  Analysis,
  Chapter,
  Lesson,
  Step,
  StepRoot,
  StepType,
} from '@chess-tent/models';
import { ChessboardInterface, ChessboardProps } from './components';
import { ClassComponent } from './_helpers';

export type StepSystemProps = {
  setActiveStep: (step: Step) => void;
  activeStep: Step;
  stepRoot: StepRoot;
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

export type StepModuleComponentKey =
  | 'EditorBoard'
  | 'EditorSidebar'
  | 'ActivityBoard'
  | 'ActivitySidebar';

export type ActivityFooterProps = {
  next: () => void;
  prev: () => void;
  stepsCount: number;
  currentStep: number;
  children?: ReactElement;
};

export type ActivityStepStateBase = {
  analysis: Analysis;
};

export type ActivityStepState<T extends {}> = T & ActivityStepStateBase;
export type ActivityProps<ACTIVITY_STATE> = {
  // TODO - update name to updateStepActivityState
  setStepActivityState: (state: {}) => void;
  stepActivityState: ACTIVITY_STATE;
  nextStep: () => void;
  prevStep: () => void;
  Footer: FunctionComponent<Partial<ActivityFooterProps>>;
  activity: Activity;
  completeStep: (step: Step) => void;
  lesson: Lesson;
  chapter: Chapter;
} & StepBoardComponentProps;

export type StepModule<
  STEP extends Step,
  STEP_TYPE extends StepType,
  REQUIRED_STATE extends {} = {},
  ACTIVITY_STATE extends ActivityStepStateBase = ActivityStepStateBase
> = {
  EditorBoard: StepComponent<STEP, EditorProps & StepBoardComponentProps>;
  EditorSidebar: StepComponent<STEP, EditorProps>;
  ActivityBoard: StepComponent<STEP, ActivityProps<ACTIVITY_STATE>>;
  ActivitySidebar: StepComponent<STEP, ActivityProps<ACTIVITY_STATE>>;
  stepType: STEP_TYPE;
  createStep: (
    id: string,
    initialState: Partial<STEP extends Step<infer S, infer ST> ? S : never> &
      REQUIRED_STATE,
  ) => STEP;
};
