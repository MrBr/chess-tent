import { state } from '@application';
import { TYPE_USER } from '@chess-tent/models';
import entityReducer from './state/entity-reducer';

state.registerEntityReducer(TYPE_USER, entityReducer);
