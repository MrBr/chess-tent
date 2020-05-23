import { state } from '@application';
import { SCHEMA_STEP } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(SCHEMA_STEP, reducer);
