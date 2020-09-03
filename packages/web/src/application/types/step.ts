import { ComponentType, FunctionComponent, ReactElement } from 'react';
import { Lesson, Step, StepType } from '@chess-tent/models';
import { FEN } from './chess';
import { ChessboardInterface, ChessboardProps } from './components';
import { ClassComponent } from './_helpers';

export type StepMap = Record<StepType, StepModule>;

export type StepSystemProps = {
  setActiveStep: (step: Step) => void;
  activeStep: Step;
  lesson: Lesson;
};
export type StepBoardComponentProps = {
  Chessboard:
    | FunctionComponent<ChessboardProps>
    | ClassComponent<ChessboardInterface>;
};
export type StepProps<S extends Step, P = {}> = {
  step: S;
} & StepSystemProps &
  P;

export type StepComponent<S extends Step, P extends {} = {}> = ComponentType<
  StepProps<S, P>
>;

export type StepModuleComponentKey =
  | 'Editor'
  | 'Playground'
  | 'StepperStep'
  | 'Exercise';

export type StepModule<
  T extends Step = any,
  K extends StepType = StepType,
  U extends {} = {}
> = {
  Editor: StepComponent<T, StepBoardComponentProps>;
  Playground: StepComponent<
    T,
    {
      setStepActivityState: (state: {}) => void;
      stepActivityState: U;
      nextStep: () => void;
      prevStep: () => void;
      footer: ReactElement;
    } & StepBoardComponentProps
  >;
  Exercise: StepComponent<T, StepBoardComponentProps>;
  StepperStep: StepComponent<T>;
  stepType: K;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T extends Step<infer S, K> ? S : never>,
  ) => T;
};
