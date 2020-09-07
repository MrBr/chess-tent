import application from '@application';

application.register(
  () => import('./provider'),
  module => {
    application.services.addProvider(module.SocketProvider);
    application.socket.sendAction = module.sendAction;
    application.socket.subscribe = module.subscribe;
    application.socket.unsubscribe = module.unsubscribe;
  },
);
