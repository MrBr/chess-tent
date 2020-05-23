import { state } from '@application';
import { SCHEMA_EXERCISE } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(SCHEMA_EXERCISE, reducer);
