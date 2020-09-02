import application from '@application';

import './style.css';
import './themes/default.css';

application.register(
  () => import('./board'),
  module => {
    application.components.Chessboard = module.default;
  },
);
