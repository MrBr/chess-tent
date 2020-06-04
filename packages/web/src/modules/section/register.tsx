import { state } from '@application';
import { TYPE_SECTION } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(TYPE_SECTION, reducer);
