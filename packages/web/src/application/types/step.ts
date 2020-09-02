import { ComponentType, FunctionComponent, ReactElement } from 'react';
import { Lesson, Step, StepType } from '@chess-tent/models';
import { Action } from 'redux';
import { FEN, Move, Piece, Shape } from './chess';

export type StepMap = Record<StepType, StepModule>;
export type StepEndSetup = { position: FEN; shapes: Shape[] };

export type StepSystemProps = {
  setActiveStep: (step: Step) => void;
  activeStep: Step;
  lesson: Lesson;
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
  | 'Picker'
  | 'Playground'
  | 'StepperStep'
  | 'Exercise';

export type StepModule<
  T extends Step = any,
  K extends StepType = StepType,
  U extends {} = {}
> = {
  Picker: FunctionComponent;
  Editor: StepComponent<T>;
  Playground: StepComponent<
    T,
    {
      setStepActivityState: (state: {}) => void;
      stepActivityState: U;
      nextStep: () => void;
      prevStep: () => void;
      footer: ReactElement;
    }
  >;
  Exercise: StepComponent<T>;
  StepperStep: StepComponent<T>;
  stepType: K;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T extends Step<infer S, K> ? S : never>,
  ) => T;
  getEndSetup: (step: T) => StepEndSetup;
  changeReactor: (
    lesson: Lesson,
    step: T,
  ) => (newPosition: FEN, move?: Move, movedPiece?: Piece) => Action[];
  shapesReactor: (lesson: Lesson, step: T) => (shapes: Shape[]) => Action[];
};
