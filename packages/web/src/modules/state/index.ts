import application from '@application';
import {
  registerEntityReducer,
  getRootReducer,
  registerReducer,
} from './reducer';
import { useDispatchBatched } from './hooks';

application.state.getRootReducer = getRootReducer;
application.state.registerEntityReducer = registerEntityReducer;
application.state.registerReducer = registerReducer;
application.hooks.useDispatchBatched = useDispatchBatched;

application.register(
  () => import('./actions'),
  module => {
    application.state.actions.updateEntities = module.updateEntitiesAction;
  },
);
