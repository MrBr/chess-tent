import { SCHEMA_SECTION } from '@chess-tent/models';
import application, { model, state } from '@application';

import { reducer } from './state/reducer';
import {
  addSectionChildAction,
  removeSectionChildAction,
} from './state/actions';

application.register(
  () => [state.registerEntityReducer],
  () => {
    application.state.registerEntityReducer(SCHEMA_SECTION, reducer);
  },
);

application.register(() => {
  application.state.actions.addSectionChild = addSectionChildAction;
  application.state.actions.removeSectionChild = removeSectionChildAction;
});

application.register(
  () => [model.stepSchema],
  () => {
    application.model.sectionSchema = require('./model').sectionSchema;
  },
);
