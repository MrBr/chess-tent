import { state } from '@application';
import { TYPE_STEP } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(TYPE_STEP, reducer);
