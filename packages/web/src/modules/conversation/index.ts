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
  () => import('./hooks/useOpenConversations'),
  module => {
    application.hooks.useOpenConversations = module.default;
  },
);
application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer('conversations', module.reducer);
  },
);
application.register(
  () => import('./records'),
  module => {
    application.records.conversationParticipant =
      module.conversationParticipant;
    application.records.activeUserConversations =
      module.activeUserConversations;
  },
);

application.register(
  () => import('./state/actions'),
  module => {
    application.state.actions.sendMessage = module.sendMessage;
  },
);

application.register(
  () => import('./components/stand'),
  module => {
    application.components.ConversationsStand = module.default;
  },
);

application.register(() => import('./routes'));
