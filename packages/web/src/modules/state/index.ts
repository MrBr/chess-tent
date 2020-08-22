import application from '@application';
import logger from 'redux-logger';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import {
  registerEntityReducer,
  getRootReducer,
  registerReducer,
} from './reducer';
import { useDispatchBatched } from './hooks';
import { middleware, registerMiddleware } from './middleware';

application.state.getRootReducer = getRootReducer;
application.state.registerEntityReducer = registerEntityReducer;
application.state.registerReducer = registerReducer;
application.state.registerMiddleware = registerMiddleware;
application.state.middleware = middleware;
application.hooks.useDispatchBatched = useDispatchBatched;

application.register(
  () => import('./actions'),
  module => {
    application.state.actions.updateEntities = module.updateEntitiesAction;
  },
);
application.register(() => import('./provider'));
registerMiddleware(logger);
registerMiddleware(batchDispatchMiddleware);
