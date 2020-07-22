import { state } from '@application';
import { TYPE_USER } from '@chess-tent/models';
import activeUserReducer from './state/active-user-reducer';
import entityReducer from './state/entity-reducer';

state.registerEntityReducer(TYPE_USER, entityReducer);
state.registerReducer('activeUser', activeUserReducer);
