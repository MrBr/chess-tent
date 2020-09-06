import application, { model } from '@application';
import logger from 'redux-logger';
import { useDispatch, useSelector } from 'react-redux';
import { batchDispatchMiddleware } from 'redux-batched-actions';
import initService from '@chess-tent/normalization';
import {
  registerEntityReducer,
  getRootReducer,
  registerReducer,
} from './reducer';
import { useDenormalize, useDispatchBatched } from './hooks';
import { middleware, registerMiddleware } from './middleware';

application.state.getRootReducer = getRootReducer;
application.state.registerEntityReducer = registerEntityReducer;
application.state.registerReducer = registerReducer;
application.state.registerMiddleware = registerMiddleware;
application.state.middleware = middleware;
application.hooks.useDispatchBatched = useDispatchBatched;
application.hooks.useDispatch = useDispatch;
application.hooks.useSelector = useSelector;
application.hooks.useDenormalize = useDenormalize;
const { normalize, denormalize } = initService({
  users: model.userSchema,
  lessons: model.lessonSchema,
  activities: model.activitySchema,
  steps: model.stepSchema,
  conversations: model.conversationSchema,
  messages: model.messageSchema,
});
application.utils.normalize = normalize;
application.utils.denormalize = denormalize;
application.register(
  () => import('./actions'),
  module => {
    application.state.actions.updateEntities = module.updateEntitiesAction;
  },
);
application.register(() => import('./provider'));
registerMiddleware(logger);
registerMiddleware(batchDispatchMiddleware);
