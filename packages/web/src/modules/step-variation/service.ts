import { constants } from '@application';
import { VariationModule, VariationStep } from '@types';
import { createStep as coreCreateStep } from '@chess-tent/models';
import { stepType } from './model';

export const createStep: VariationModule['createStep'] = (id, initialState) =>
  coreCreateStep<VariationStep>(id, stepType, {
    shapes: [],
    steps: [],
    moveIndex: 1,
    position: constants.START_FEN,
    ...(initialState || {}),
  });
