import application from '@application';

import './style.css';
import './theme.css';

application.register(
  () => import('./board'),
  module => {
    application.components.Chessboard = module.default;
  },
);
