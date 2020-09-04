import application from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { reducer } from './state/reducer';
import { middleware } from './state/middleware';

application.state.registerEntityReducer(TYPE_ACTIVITY, reducer);
application.state.registerMiddleware(middleware);
