import { state } from '@application';
import { TYPE_LESSON } from '@chess-tent/models';
import { reducer } from './state/reducer';

state.registerEntityReducer(TYPE_LESSON, reducer);
