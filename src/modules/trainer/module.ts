import { registerStep, registerReducer } from '../app';

import * as Description from './description-step';
import { reducer } from './redux';

registerStep(Description);
registerReducer('trainer', reducer);
