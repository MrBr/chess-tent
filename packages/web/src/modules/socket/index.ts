import application from '@application';

application.register(
  () => import('./provider'),
  module => {
    application.services.addProvider(module.SocketProvider);
    application.socket.sendAction = module.sendAction;
    application.socket.subscribe = module.subscribe;
    application.socket.unsubscribe = module.unsubscribe;
    application.hooks.useConferencing = module.useConferencing;
  },
);
application.register(
  () => import('./hook'),
  module => {
    application.hooks.useSocketSubscribe = module.useSocketSubscribe;
    application.hooks.useSocketRoomUsers = module.useSocketRoomUsers;
  },
);
application.register(
  () => import('./state/middleware'),
  module => {
    application.state.registerMiddleware(module.middleware);
  },
);
