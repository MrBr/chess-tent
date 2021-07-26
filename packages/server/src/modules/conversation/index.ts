import application from '@application';
import './routes';

application.register(() => import('./socket'));
application.register(
  () => import('./middleware'),
  module => {
    application.middleware.saveConversation = module.saveConversation;
  },
);
