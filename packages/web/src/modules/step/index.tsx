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
  parsePgn,
  isEmptyChapter,
} from './service';

application.model.stepSchema = stepSchema;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.services.isSameStepMove = isSameStepMove;
application.services.parsePgn = parsePgn;
application.services.getSameMoveStep = getSameMoveStep;
application.services.getStepPosition = getStepPosition;
application.services.getStepBoardOrientation = getStepBoardOrientation;
application.services.updateStepRotation = updateStepRotation;
application.services.updateStepRotation = updateStepRotation;
application.services.isEmptyChapter = isEmptyChapter;
application.components.StepRenderer = StepComponentRenderer;

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCopyStep = module.useCopyStep;
  },
);
