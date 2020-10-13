import application from '@application';

import {
  createStepModuleStep,
  getSameMoveVariationStep,
  isSameStepMove,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';

application.model.stepSchema = stepSchema;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.services.isSameStepMove = isSameStepMove;
application.services.getSameMoveVariationStep = getSameMoveVariationStep;
application.components.StepRenderer = StepComponentRenderer;
application.components.StepRenderer = StepComponentRenderer;
