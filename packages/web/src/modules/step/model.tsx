import React, { FunctionComponent } from 'react';
import { Step, TYPE_STEP } from '@chess-tent/models';
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
  StepsMap[stepModule.stepType as T] = stepModule;
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
  return getStepModule(step.stepType)['getEndSetup'](step);
};

const StepComponentRenderer: FunctionComponent<StepProps<
  Step,
  {
    component: StepModuleComponentKey;
  }
>> = ({ component, step, ...stepProps }) => {
  const Component = getStepModule(step.stepType)[component];
  return <Component key={step.id} step={step} {...stepProps} />;
};

export const stepSchema = new schema.Entity(TYPE_STEP);

export {
  registerStep,
  createStepModuleStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
};