import { ComponentType, FunctionComponent } from 'react';
import { Section, Step, StepType } from '@chess-tent/models';
import { FEN, Shape } from './chess';

export type StepMap = Record<StepType, StepModule>;
export type StepEndSetup = { position: FEN; shapes: Shape[] };

export type StepSystemProps = {
  addSection: (children?: Section['children']) => void;
  addStep: () => void;
  prevPosition: FEN;
};
export type StepProps<S, P = {}> = {
  step: S;
} & StepSystemProps &
  P;

export type StepComponent<S> = ComponentType<StepProps<S>>;

export type StepModuleComponentKey =
  | 'Editor'
  | 'Picker'
  | 'Playground'
  | 'Actions'
  | 'Exercise';

export type StepModule<T = any, K extends StepType = StepType> = {
  Picker: FunctionComponent;
  Editor: StepComponent<T>;
  Playground: StepComponent<T>;
  Exercise: StepComponent<T>;
  Actions: StepComponent<T>;
  type: K;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T extends Step<infer S, K> ? S : never>,
  ) => T;
  getEndSetup: (step: T) => StepEndSetup;
};
