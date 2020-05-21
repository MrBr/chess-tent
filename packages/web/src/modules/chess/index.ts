import application, { services } from '@application';
import { createFen, Chess } from './service';

application.register(() => {
  services.Chess = Chess;
  services.recreateFenWithMoves = createFen;
});
