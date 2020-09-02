import application from '@application';

import { updateStepStateAction, updateStepAction } from './state/actions';
import { stepSelector } from './state/selectors';
import {
  createStepModuleStep,
  registerStep,
  getStepModuleStepEndSetup,
  StepComponentRenderer,
  stepSchema,
  getStepModule,
} from './model';
import StepTag from './components/step-tag';
import StepToolbox from './components/step-toolbox';

application.register(() => import('./register'));
application.register(() => import('./hooks'));

application.state.actions.updateStep = updateStepAction;
application.model.stepSchema = stepSchema;
application.state.actions.updateStepState = updateStepStateAction;
application.state.selectors.stepSelector = stepSelector;
application.stepModules.registerStep = registerStep;
application.stepModules.getStepModule = getStepModule;
application.stepModules.getStepEndSetup = getStepModuleStepEndSetup;
application.stepModules.createStep = createStepModuleStep;
application.stepModules.registerStep = registerStep;
application.components.StepRenderer = StepComponentRenderer;
application.components.StepTag = StepTag;
application.components.StepToolbox = StepToolbox;
application.components.StepRenderer = StepComponentRenderer;
