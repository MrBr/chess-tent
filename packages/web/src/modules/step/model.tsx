import React, { ComponentType } from 'react';
import { Step } from '@chess-tent/models';
import { Components, FEN, Steps } from '@types';
import { utils, stepModules } from '@application';

const createStepModuleStep = <T extends Steps>(
  stepType: T extends Step<infer U, infer K> ? K : never,
  initialPosition: FEN,
  initialState?: Partial<T extends Step<infer U, infer K> ? U : never>,
): T => {
  return (stepModules[stepType]['createStep'](
    utils.generateIndex(),
    initialPosition,
    initialState,
  ) as unknown) as T;
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

export { createStepModuleStep, StepComponentRenderer };
