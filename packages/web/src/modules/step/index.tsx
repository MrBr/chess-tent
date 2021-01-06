import application from '@application';

import {
  createStepModuleStep,
  getSameMoveVariationStep,
  isSameStepMove,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';
import { getStepPosition } from './service';

application.model.stepSchema = stepSchema;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.services.isSameStepMove = isSameStepMove;
application.services.getSameMoveVariationStep = getSameMoveVariationStep;
application.services.getStepPosition = getStepPosition;
application.components.StepRenderer = StepComponentRenderer;

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCopyStep = module.useCopyStep;
  },
);
