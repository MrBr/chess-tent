import application from '@application';

application.register(
  () => import('./middleware'),
  module => {
    application.middleware.sendMail = module.sendMail;
  },
);
