import application from '@application';
import { registerEntityReducer, getRootReducer } from './reducer';
import { useDispatchBatched } from './hooks';

application.state.getRootReducer = getRootReducer;
application.state.registerEntityReducer = registerEntityReducer;
application.hooks.useDispatchBatched = useDispatchBatched;

application.register(
  () => import('./actions'),
  module => {
    application.state.actions.updateEntities = module.updateEntitiesAction;
  },
);
