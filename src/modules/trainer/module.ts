import { registerStep, registerReducer } from '../app';

import * as Description from './description-step';
import * as SelectSquares from './select-squares-step';
import * as SelectPieces from './select-pieces-step';
import * as AttackPieces from './attack-step';
import { reducer } from './redux';

registerStep(Description);
registerStep(SelectSquares);
registerStep(SelectPieces);
registerStep(AttackPieces);
registerReducer('trainer', reducer);
