import { state } from '@application';
import { TYPE_USER } from '@chess-tent/models';
import entityReducer from './state/entity-reducer';
import { activeUserEntityMiddleware } from './state/middleware';

state.registerEntityReducer(TYPE_USER, entityReducer);
state.registerMiddleware(activeUserEntityMiddleware);
