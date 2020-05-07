import { ComponentType } from 'react';
import { StepModule, StepModuleComponentKey, StepType } from './types';

const Steps: StepModule[] = [];

const registerStep = (step: StepModule) => {
  Steps.push(step);
};

const getStep = (type: StepType): StepModule => {
  return Steps.find(step => step.type === type) as StepModule;
};

const getStepComponent = (
  step: StepModule,
  component: StepModuleComponentKey,
): ComponentType<any> => {
  return step[component];
};

export { registerStep, getStep, getStepComponent, Steps };
