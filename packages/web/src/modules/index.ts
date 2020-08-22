import application from '@application';

application.register(() => import('./app'));
application.register(() => import('./api'));
application.register(() => import('./auth'));
application.register(() => import('./chess'));
application.register(() => import('./chessboard'));
application.register(() => import('./evaluator'));
application.register(() => import('./lesson'));
application.register(() => import('./state'));
application.register(() => import('./step'));
application.register(() => import('./step-move'));
application.register(() => import('./step-description'));
application.register(() => import('./step-variation'));
application.register(() => import('./ui'));
application.register(() => import('./utils'));
application.register(() => import('./router'));
application.register(() => import('./user'));
