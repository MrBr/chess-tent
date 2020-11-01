import { DescriptionModule, DescriptionStep } from '@types';
import { createStep as coreCreateStep } from '@chess-tent/models';
import { stepType } from './model';

export const createStep: DescriptionModule['createStep'] = (id, initialState) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
    shapes: [],
    steps: [],
    ...(initialState || {}),
  });
