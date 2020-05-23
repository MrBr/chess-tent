import application from '@application';

import {
  addSectionChildAction,
  removeSectionChildAction,
} from './state/actions';

application.register(() => import('./register'));

application.state.actions.addSectionChild = addSectionChildAction;
application.state.actions.removeSectionChild = removeSectionChildAction;

application.register(
  () => import('./model'),
  module => {
    application.model.sectionSchema = module.sectionSchema;
  },
);
