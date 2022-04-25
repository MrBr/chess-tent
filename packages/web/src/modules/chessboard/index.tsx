import application from '@application';

import './style.css';
import './themes/default.css';

application.register(
  () => import('./components/board'),
  module => {
    application.components.Chessboard = module.default;
  },
);
application.register(
  () => import('./components/footer'),
  module => {
    application.components.ChessboardFooter = module.default;
  },
);
application.register(
  () => import('./service'),
  module => {
    application.services.createMoveShape = module.createMoveShape;
  },
);
application.register(
  () => import('./context'),
  module => {
    application.components.ChessboardContextProvider =
      module.ChessboardContextProvider;
  },
);

application.register(
  () => import('./hook'),
  module => {
    application.hooks.useChessboardContext = module.useChessboardContext;
  },
);
