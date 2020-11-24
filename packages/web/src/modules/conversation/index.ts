import application from '@application';
import { conversationSchema, messageSchema } from './model';

import './requests';
import { sendMessage } from './state/actions';

application.model.conversationSchema = conversationSchema;
application.model.messageSchema = messageSchema;
application.state.actions.sendMessage = sendMessage;

application.register(
  () => import('./state/middleware'),
  module => {
    application.state.registerMiddleware(module.middleware);
  },
);
application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer('conversations', module.reducer);
  },
);

application.register(
  () => import('./state/actions'),
  module => {
    application.state.actions.sendMessage = module.sendMessage;
  },
);

application.register(
  () => import('./hooks'),
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
application.register(
  () => import('./components/message-button'),
  module => {
    application.components.MessageButton = module.default;
  },
);
