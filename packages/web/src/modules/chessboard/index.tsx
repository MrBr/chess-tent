import application, { ui, components, constants } from '@application';

import './style.css';
import './theme.css';

application.register(
  () => [ui, components.Evaluator, constants.START_FEN],
  () => {
    application.components.Chessboard = require('./board').default;
  },
);
