import { MoveModule, MoveStep } from '@types';
import { createStep as coreCreateStep } from '@chess-tent/models';
import { stepType } from './model';

export const createStep: MoveModule['createStep'] = (id, initialState) =>
  coreCreateStep<MoveStep>(id, stepType, {
    shapes: [],
    steps: [],
    ...initialState,
  });
