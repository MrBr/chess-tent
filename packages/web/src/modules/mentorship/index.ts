import application from '@application';
import { TYPE_MENTORSHIP } from '@chess-tent/models';
import './requests';

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCoaches = module.useCoaches;
  },
);

application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer(TYPE_MENTORSHIP, module.reducer);
  },
);

application.register(
  () => import('./components/mentorship-button'),
  module => {
    application.components.MentorshipButton = module.default;
  },
);

application.register(
  () => import('./model'),
  module => {
    application.model.mentorshipSchema = module.mentorshipSchema;
  },
);
