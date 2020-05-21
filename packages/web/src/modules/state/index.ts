import application, { utils } from '@application';
import { registerEntityReducer, getRootReducer } from './reducer';
import { useDispatchBatched } from './hooks';

application.register(() => {
  application.state.getRootReducer = getRootReducer;
  application.state.registerEntityReducer = registerEntityReducer;
  application.hooks.useDispatchBatched = useDispatchBatched;
});
application.register(
  () => [utils.getEntitySchema],
  () => {
    application.state.actions.updateEntities = require('./actions').updateEntitiesAction;
  },
);
