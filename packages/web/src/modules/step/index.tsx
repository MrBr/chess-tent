import application from '@application';

import { updateStepStateAction, updateStepAction } from './state/actions';
import { stepSelector } from './state/selectors';
import {
  createStepModuleStep,
  isStepType,
  StepComponentRenderer,
  stepSchema,
} from './model';

application.register(() => import('./register'));
application.register(() => import('./hooks'));

application.state.actions.updateStep = updateStepAction;
application.model.stepSchema = stepSchema;
application.state.actions.updateStepState = updateStepStateAction;
application.state.selectors.stepSelector = stepSelector;
application.services.createStep = createStepModuleStep;
application.services.isStepType = isStepType;
application.components.StepRenderer = StepComponentRenderer;
application.components.StepRenderer = StepComponentRenderer;
