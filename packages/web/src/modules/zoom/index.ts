import application from '@application';

application.register(() => import('./requests'));
application.register(
  () => import('./components/zoom-activity-view'),
  module => {
    application.components.ZoomActivityView = module.default;
  },
);
application.register(
  () => import('./components/controls/host-control'),
  module => {
    application.components.ZoomHostControl = module.default;
  },
);
application.register(
  () => import('./components/controls/guest-control'),
  module => {
    application.components.ZoomGuestControl = module.default;
  },
);
application.register(
  () => import('./providers/zoom-provider'),
  module => {
    application.components.ZoomProvider = module.default;
  },
);
application.register(
  () => import('./context'),
  module => {
    application.context.zoomContext = module.ZoomContext;
  },
);
