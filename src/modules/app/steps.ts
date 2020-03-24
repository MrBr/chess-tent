import {StepModule, StepModuleComponentKey, StepType} from "./types";
import {ComponentType} from "react";

const Steps: StepModule[] = [];

const registerStep = (step: StepModule) => {
  Steps.push(step);
};

const getStep = (type: StepType): StepModule| undefined => {
  return Steps.find(step => step.type === type);
};

const getStepComponent = (step: StepModule, component: StepModuleComponentKey): ComponentType<any>  => {
  return step[component];
};

export {
  registerStep,
  getStep,
  getStepComponent,
  Steps
};
