import React, { FunctionComponent, ComponentType } from 'react';
import { StepType, Step, Section } from '@chess-tent/models';
import { schema } from 'normalizr';
import { FEN, Shape } from '../chess';

type StepMap = Record<StepType, StepModule>;
const StepsMap = {} as StepMap;

// Step
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
  getEndSetup: (step: T) => { position: FEN; shapes: Shape[] };
};

const registerStep = <K, T extends keyof StepMap>(
  stepModule: K extends StepMap[T] ? K : never,
) => {
  StepsMap[stepModule.type as T] = stepModule;
};

const getStepModule = <T extends keyof StepMap>(
  type: T,
): StepModule<Step, T> => {
  return StepsMap[type] as StepModule<Step, T>;
};

const createStepModuleStep = (
  stepType: keyof StepMap,
  ...args: Parameters<StepModule<Step, typeof stepType>['createStep']>
): Step => {
  return getStepModule(stepType)['createStep'](...args);
};

const getStepModuleStepEndSetup = (step: Step) => {
  return getStepModule(step.type)['getEndSetup'](step);
};

const StepComponentRenderer: FunctionComponent<StepProps<
  Step,
  {
    component: StepModuleComponentKey;
  }
>> = ({ component, step, ...stepProps }) => {
  const Component = getStepModule(step.type)[component];
  return <Component key={step.id} step={step} {...stepProps} />;
};

export const stepSchema = new schema.Entity('steps');

export {
  registerStep,
  createStepModuleStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
};
