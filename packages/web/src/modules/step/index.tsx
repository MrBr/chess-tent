import application from '@application';

import { updateStepStateAction, updateStepAction } from './state/actions';
import { stepSelector } from './state/selectors';
import {
  createStepModuleStep,
  registerStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
  stepSchema,
} from './model';

application.register(() => import('./register'));

application.state.actions.updateStep = updateStepAction;
application.model.stepSchema = stepSchema;
application.state.actions.updateStepState = updateStepStateAction;
application.state.selectors.stepSelector = stepSelector;
application.stepModules.registerStep = registerStep;
application.stepModules.getStepEndSetup = getStepModuleStepEndSetup;
application.stepModules.createStep = createStepModuleStep;
application.stepModules.registerStep = registerStep;
application.components.StepRenderer = StepComponentRenderer;
