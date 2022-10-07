import application from '@application';

import {
  createStepModuleStep,
  getSameMoveStep,
  isSameStepMove,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';
import {
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
application.services.getSameMoveStep = getSameMoveStep;
application.services.getStepPosition = getStepPosition;
application.services.getStepBoardOrientation = getStepBoardOrientation;
application.services.updateStepRotation = updateStepRotation;
application.components.StepRenderer = StepComponentRenderer;

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCopyStep = module.useCopyStep;
  },
);
