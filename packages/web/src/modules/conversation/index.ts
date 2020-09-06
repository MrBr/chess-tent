import application from '@application';
import { conversationSchema, messageSchema } from './model';

import './requests';

application.model.conversationSchema = conversationSchema;
application.model.messageSchema = messageSchema;

application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer('conversations', module.reducer);
  },
);

application.register(
  () => import('./state/hooks'),
  module => {
    application.hooks.useConversationParticipant =
      module.useConversationParticipant;
  },
);
application.register(
  () => import('./components/conversations-sidebar'),
  module => {
    application.components.Conversations = module.default;
  },
);
