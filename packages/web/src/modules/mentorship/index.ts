import application from '@application';
import { TYPE_MENTORSHIP } from '@chess-tent/models';
import './requests';

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useCoaches = module.useCoaches;
    application.hooks.useStudents = module.useStudents;
    application.hooks.useMentorship = module.useMentorship;
  },
);

application.register(() => import('./state/reducer'));

application.register(
  () => import('./components/button/mentorship'),
  module => {
    application.components.MentorshipButton = module.default;
  },
);
application.register(
  () => import('./components/button/action'),
  module => {
    application.components.MentorshipAction = module.default;
  },
);
application.register(
  () => import('./components/notification'),
  module => {
    application.services.registerNotificationRenderer(TYPE_MENTORSHIP, {
      Toast: module.Toast,
      DropdownItem: module.DropdownItem,
    });
  },
);

application.register(
  () => import('./model'),
  module => {
    application.model.mentorshipSchema = module.mentorshipSchema;
  },
);
application.register(
  () => import('./service'),
  module => {
    application.services.isMentorship = module.isMentorship;
  },
);
application.register(() => import('./routes'));
