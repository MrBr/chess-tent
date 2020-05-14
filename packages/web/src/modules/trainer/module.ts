import { registerStep, registerReducer } from '../app';

import Description from './description-step';
import Test from './test-step';
import { reducer } from './redux';

export type StepModuleType = typeof Description | typeof Test;

registerStep(Description);
registerReducer('trainer', reducer);
