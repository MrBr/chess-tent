import React, { FunctionComponent } from 'react';
import { StepModuleComponentKey, StepModule, Steps, StepProps } from './types';
import { StepModuleType } from './modules';

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<
  K,
  V
>
  ? T
  : never;

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

export type StepMap = MapDiscriminatedUnion<StepModuleType, 'type'>;
const StepsMap = {} as StepMap;

const registerStep = <K, T extends keyof StepMap>(
  stepModule: K extends StepMap[T] ? K : never,
) => {
  StepsMap[stepModule.type as T] = stepModule;
};

const getStepModule = <T extends keyof StepMap>(
  type: T,
): StepModule<Steps, T> => {
  return StepsMap[type] as StepModule<Steps, T>;
};

const createStep = (
  stepType: keyof StepMap,
  ...args: Parameters<StepModule<Steps, typeof stepType>['createStep']>
): Steps => {
  return getStepModule(stepType)['createStep'](...args);
};

const getStepEndSetup = (step: Steps) => {
  return getStepModule(step.type)['getEndSetup'](step);
};

const StepComponentRenderer: FunctionComponent<StepProps<
  Steps,
  {
    component: StepModuleComponentKey;
  }
>> = ({ component, step, ...stepProps }) => {
  const Component = getStepModule(step.type)[component];
  return <Component key={step.id} step={step} {...stepProps} />;
};

export { registerStep, createStep, getStepEndSetup, StepComponentRenderer };
