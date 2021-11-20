import {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  ReactElement,
} from 'react';
import {
  Activity,
  Chapter,
  Lesson,
  Step,
  StepRoot,
  StepType,
  User,
} from '@chess-tent/models';
import {
  ChessboardInterface,
  ChessboardProps,
  StepToolbox,
} from './components';
import { ClassComponent } from './_helpers';
import { PieceColor } from './chess';
import { AppAnalysis } from './analysis';

export type AppStep<S extends {} = {}, T extends StepType = StepType> = Step<
  S & { orientation?: PieceColor },
  T
>;

export type StepSystemProps = {
  setActiveStep: (step: AppStep) => void;
  activeStep: AppStep;
  stepRoot: StepRoot;
};
export type StepBoardComponentProps = {
  Chessboard:
    | FunctionComponent<ChessboardProps>
    | ClassComponent<ChessboardInterface>;
  status?: string;
};
export type StepProps<S extends AppStep, P = {}> = {
  step: S;
} & StepSystemProps &
  P;
export interface EditorProps {
  setActiveStep: StepSystemProps['setActiveStep'];
  updateStep: (step: AppStep) => void;
  updateChapter: (chapter: Chapter) => void;
  removeStep: (step: AppStep, adjacent?: boolean) => void;
}
export type EditorSidebarProps = {
  renderToolbox: (
    props: Pick<
      ComponentProps<StepToolbox>,
      | 'comment'
      | 'remove'
      | 'exercise'
      | 'step'
      | 'active'
      | 'text'
      | 'textChangeHandler'
      | 'add'
      | 'showInput'
    >,
  ) => ReactElement;
} & EditorProps;

export type StepComponent<S extends AppStep, P extends {} = {}> = ComponentType<
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
export type ActivityComment = {
  userId: User['id'];
  text: string;
  id: string;
};

export enum ActivityStepMode {
  ANALYSING = 'ANALYSING',
  SOLVING = 'SOLVING',
}
export type ActivityStepStateBase = {
  analysis: AppAnalysis;
  comments?: ActivityComment[];
  mode: ActivityStepMode;
};

export type ActivityStepState<T extends {}> = T & ActivityStepStateBase;
export type ActivityExerciseStepState<T extends {}> = T & ActivityStepStateBase;
export type ActivityProps<ACTIVITY_STATE> = {
  // TODO - update name to updateStepActivityState
  setStepActivityState: (state: {}) => void;
  stepActivityState: ACTIVITY_STATE;
  nextStep: () => void;
  prevStep: () => void;
  Footer: FunctionComponent<Partial<ActivityFooterProps>>;
  activity: Activity;
  completeStep: (step: AppStep) => void;
  lesson: Lesson;
  chapter: Chapter;
} & StepBoardComponentProps;

export type StepModule<
  STEP extends AppStep,
  STEP_TYPE extends StepType,
  REQUIRED_STATE extends {} = {},
  ACTIVITY_STATE extends ActivityStepStateBase = ActivityStepStateBase
> = {
  EditorBoard: StepComponent<STEP, EditorProps & StepBoardComponentProps>;
  EditorSidebar: StepComponent<STEP, EditorSidebarProps>;
  ActivityBoard: StepComponent<STEP, ActivityProps<ACTIVITY_STATE>>;
  ActivitySidebar: StepComponent<STEP, ActivityProps<ACTIVITY_STATE>>;
  stepType: STEP_TYPE;
  createStep: (
    id: string,
    initialState: Partial<STEP extends Step<infer S, infer ST> ? S : never> &
      REQUIRED_STATE,
  ) => STEP;
};
