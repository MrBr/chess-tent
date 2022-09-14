import application from '@application';

application.register(
  () => import('./middleware'),
  module => {
    application.middleware.sendMail = module.sendMail;
  },
);
application.register(
  () => import('./service'),
  module => {
    application.service.sendMail = module.sendMail;
  },
);
