import application from '@application';
import logger from 'redux-logger';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import {
  registerEntityReducer,
  getRootReducer,
  registerReducer,
} from './reducer';
import {
  useDenormalize,
  useDispatchBatched,
  useDispatchService,
} from './hooks';
import { middleware, registerMiddleware } from './middleware';
import { selectNormalizedEntities } from './selectors';

application.state.getRootReducer = getRootReducer;
application.state.registerEntityReducer = registerEntityReducer;
application.state.registerReducer = registerReducer;
application.state.registerMiddleware = registerMiddleware;
application.state.middleware = middleware;
application.state.selectors.selectNormalizedEntities = selectNormalizedEntities;
application.hooks.useDispatchBatched = useDispatchBatched;
application.hooks.useDispatch = useDispatch;
application.hooks.useSelector = useSelector;
application.hooks.useStore = useStore;
application.hooks.useDenormalize = useDenormalize;
application.hooks.useDispatchService = useDispatchService;
application.register(() => import('./register'));
application.register(
  () => import('./actions'),
  module => {
    application.state.actions.updateEntities = module.updateEntitiesAction;
    application.state.actions.updateEntity = module.updateEntityAction;
    application.state.actions.serviceAction = module.serviceAction;
    application.state.actions.sendPatchAction = module.sendPatchAction;
  },
);
application.register(() => import('./provider'));
registerMiddleware(logger);
registerMiddleware(batchDispatchMiddleware);
