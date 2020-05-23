import { state } from '@application';
import { SCHEMA_SECTION } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(SCHEMA_SECTION, reducer);
