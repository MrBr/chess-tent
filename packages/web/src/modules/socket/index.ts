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
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useSocketSubscribe = module.useSocketSubscribe;
    application.hooks.useSocketRoomUsers = module.useSocketRoomUsers;
    application.hooks.useSocketActionListener = module.useSocketActionListener;
  },
);
application.register(
  () => import('./hooks/useSocketMonitor'),
  module => {
    application.hooks.useSocketMonitor = module.default;
  },
);
