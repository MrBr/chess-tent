import {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  ReactElement,
} from 'react';
import { Chapter, Step, StepRoot, StepType, User } from '@chess-tent/models';
import { Tags } from '@mliebelt/pgn-parser';
import {
  ActivityStepProps,
  ChessboardInterface,
  ChessboardProps,
  StepTag,
  EditorStepToolbox,
} from './components';
import { ClassComponent } from './_helpers';
import { Orientation, Shape } from './chess';
import { AppAnalysis } from './analysis';
import { ApiStatus } from './hooks';
import { Steps } from './steps';

export type AppStep<S extends {} = {}, T extends StepType = StepType> = Step<
  S & { orientation?: Orientation },
  T
>;

export type PgnGame = {
  tags?: Tags;
  variation: Steps;
  title: string;
};

export type StepSystemProps = {
  setActiveStep: (step: AppStep) => void;
  activeStep: AppStep;
  stepRoot: StepRoot;
};
export type StepBoardComponentProps = {
  Chessboard:
    | FunctionComponent<ChessboardProps>
    | ClassComponent<ChessboardInterface>;
  status?: ApiStatus;
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
      ComponentProps<EditorStepToolbox>,
      'comment' | 'remove' | 'exercise' | 'step' | 'active' | 'add'
    >,
  ) => ReactElement | null;
  renderStepTag: StepTag;
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
  className?: string;
};
export type ActivityComment = {
  userId: User['id'];
  text: string;
  id: string;
};

export type ActivityStepStateBase = {
  analysis: AppAnalysis;
  comments?: ActivityComment[];
  shapes?: Shape[];
  visited?: boolean;
  completed?: boolean;
};

export type ActivityExerciseStepState<T extends {}> = T &
  ActivityStepStateBase & { showHint?: boolean };
export type ActivityProps<ACTIVITY_STATE> = ActivityStepProps<ACTIVITY_STATE> &
  StepBoardComponentProps;

export type StepModule<
  STEP extends AppStep,
  STEP_TYPE extends StepType,
  REQUIRED_STATE extends {} = {},
  ACTIVITY_STATE extends ActivityStepStateBase = ActivityStepStateBase,
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
