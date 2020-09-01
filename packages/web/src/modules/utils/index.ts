import application from '@application';

application.register(() => import('./register'));
application.register(() => import('./requests'));
