import application from '@application';

import {
  createStepModuleStep,
  getSameMoveVariationStep,
  isSameStepMove,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';
import {
  addStepNextToTheComments,
  getStepBoardOrientation,
  updateStepRotation,
  getStepPosition,
  createStepsFromNotableMoves,
} from './service';

application.model.stepSchema = stepSchema;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.services.isSameStepMove = isSameStepMove;
application.services.createStepsFromNotableMoves = createStepsFromNotableMoves;
application.services.getSameMoveVariationStep = getSameMoveVariationStep;
application.services.getStepPosition = getStepPosition;
application.services.getStepBoardOrientation = getStepBoardOrientation;
application.services.updateStepRotation = updateStepRotation;
application.services.addStepNextToTheComments = addStepNextToTheComments;
application.components.StepRenderer = StepComponentRenderer;

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCopyStep = module.useCopyStep;
  },
);
