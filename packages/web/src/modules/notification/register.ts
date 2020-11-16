import application from '@application';
import { TYPE_NOTIFICATION } from '@chess-tent/models';
import { reducer } from './state/reducer';

application.state.registerEntityReducer(TYPE_NOTIFICATION, reducer);
