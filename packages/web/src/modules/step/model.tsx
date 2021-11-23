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
  // JSON.stringify unifies undefined as the same value (or not defined at all).
  // That behaviour is correct in this case.
) => JSON.stringify(step.state.move) === JSON.stringify(move);

export const getSameMoveStep: Services['getSameMoveStep'] = (
  step: VariationStep | MoveStep,
  move: NotableMove,
) => {
  return (
    (step.state.steps.find(childStep => {
      if (childStep.stepType === 'variation' || childStep.stepType === 'move') {
        return isSameStepMove(childStep as VariationStep | MoveStep, move);
      }
      return false;
    }) as MoveStep | VariationStep) || null
  );
};

export { createStepModuleStep, StepComponentRenderer, isStepType };
