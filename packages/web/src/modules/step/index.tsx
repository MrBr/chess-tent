import application from '@application';

import {
  createStepModuleStep,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';

application.model.stepSchema = stepSchema;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.components.StepRenderer = StepComponentRenderer;
application.components.StepRenderer = StepComponentRenderer;
