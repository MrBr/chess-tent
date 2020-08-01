import React, { FunctionComponent } from 'react';
import { Step, TYPE_STEP } from '@chess-tent/models';
import { schema } from 'normalizr';
import {
  FEN,
  StepEndSetup,
  StepMap,
  StepModule,
  StepModuleComponentKey,
  StepProps,
} from '@types';
import { utils } from '@application';

const StepsMap = {} as StepMap;

const registerStep = <K, T extends keyof StepMap>(
  stepModule: K extends StepMap[T] ? K : never,
) => {
  StepsMap[stepModule.stepType as T] = stepModule;
};

export const getStepModule = <T extends keyof StepMap>(
  type: T,
): StepModule<Step, T> => {
  return StepsMap[type] as StepModule<Step, T>;
};

const createStepModuleStep = <T extends Step>(
  stepType: keyof StepMap,
  initialPosition: FEN,
  initialState?: T extends Step<infer U, infer K> ? U : never,
): Step => {
  return getStepModule(stepType)['createStep'](
    utils.generateIndex(),
    initialPosition,
    initialState,
  );
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
stepSchema.define({
  state: {
    steps: [stepSchema],
  },
});

export {
  registerStep,
  createStepModuleStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
};
