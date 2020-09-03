import application from '@application';

import { updateStepStateAction, updateStepAction } from './state/actions';
import { stepSelector } from './state/selectors';
import {
  createStepModuleStep,
  registerStep,
  StepComponentRenderer,
  stepSchema,
  getStepModule,
} from './model';

application.register(() => import('./register'));
application.register(() => import('./hooks'));

application.state.actions.updateStep = updateStepAction;
application.model.stepSchema = stepSchema;
application.state.actions.updateStepState = updateStepStateAction;
application.state.selectors.stepSelector = stepSelector;
application.stepModules.registerStep = registerStep;
application.stepModules.getStepModule = getStepModule;
application.stepModules.createStep = createStepModuleStep;
application.stepModules.registerStep = registerStep;
application.components.StepRenderer = StepComponentRenderer;
application.components.StepRenderer = StepComponentRenderer;
