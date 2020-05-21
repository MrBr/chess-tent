import React, { FunctionComponent } from 'react';
import { Step } from '@chess-tent/models';
import { schema } from 'normalizr';
import {
  StepEndSetup,
  StepMap,
  StepModule,
  StepModuleComponentKey,
  StepProps,
} from '@types';

const StepsMap = {} as StepMap;

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

const getStepModuleStepEndSetup = (step: Step): StepEndSetup => {
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
