import { state } from '@application';
import { TYPE_LESSON } from '@chess-tent/models';
import { reducer } from './state/reducer';
import { middleware } from './state/middleware';

state.registerEntityReducer(TYPE_LESSON, reducer);
state.registerMiddleware(middleware);
