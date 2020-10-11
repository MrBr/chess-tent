import React, { ComponentProps } from 'react';
import { Step, StepType } from '@chess-tent/models';
import { Components, StepModule, StepModules, Steps } from '@types';
import { utils, stepModules } from '@application';

const createStepModuleStep = <T extends StepType>(
  stepType: T,
  initialState: Parameters<StepModules[T]['createStep']>[1],
): StepModules[T] extends StepModule<infer S, infer K> ? S : never =>
  stepModules[stepType]['createStep'](
    utils.generateIndex(),
    initialState as any,
  ) as any;

const isStepType = <T extends Steps>(
  step: Step,
  stepType: StepType,
): step is T => {
  return step.stepType === stepType;
};

const StepComponentRenderer: Components['StepRenderer'] = ({
  component,
  step,
  ...otherProps
}) => {
  const Component = stepModules[step.stepType][component];
  const stepProps = otherProps as ComponentProps<typeof Component>;
  return <Component key={step.id} step={step} {...(stepProps as any)} />;
};

export const stepSchema = {
  type: 'steps',
  relationships: {
    state: {
      steps: 'steps',
    },
  },
};

export { createStepModuleStep, StepComponentRenderer, isStepType };
