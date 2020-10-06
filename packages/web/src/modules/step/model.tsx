import React, { ComponentType } from 'react';
import { Step, StepType } from '@chess-tent/models';
import { Components, FEN, Steps } from '@types';
import { utils, stepModules, constants } from '@application';

const { START_FEN } = constants;

const createStepModuleStep = <T extends Steps>(
  stepType: T extends Step<infer U, infer K> ? K : never,
  initialPosition: FEN = START_FEN,
  initialState?: Partial<T extends Step<infer U, infer K> ? U : never>,
): T => {
  return (stepModules[stepType]['createStep'](
    utils.generateIndex(),
    initialPosition,
    initialState,
  ) as unknown) as T;
};

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
  const stepProps = otherProps as typeof Component extends ComponentType<
    infer P
  >
    ? P
    : never;
  return <Component key={step.id} step={step} {...stepProps} />;
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
