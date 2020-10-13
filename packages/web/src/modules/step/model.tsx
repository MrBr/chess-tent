import React, { ComponentProps } from 'react';
import { Step, StepType } from '@chess-tent/models';
import {
  Components,
  MoveStep,
  NotableMove,
  Services,
  StepModule,
  StepModules,
  Steps,
  VariationStep,
} from '@types';
import { utils, stepModules } from '@application';
import { isEqual } from 'lodash';

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

export const isSameStepMove: Services['isSameStepMove'] = (
  step: VariationStep | MoveStep,
  move: NotableMove,
) => {
  return isEqual(step.state.move, move);
};

export const getSameMoveVariationStep: Services['getSameMoveVariationStep'] = (
  step: VariationStep | MoveStep,
  move: NotableMove,
) => {
  return (
    (step.state.steps.find(childStep => {
      if (childStep.stepType === 'variation') {
        return isSameStepMove(childStep as VariationStep, move);
      }
      return false;
    }) as VariationStep) || null
  );
};

export { createStepModuleStep, StepComponentRenderer, isStepType };
