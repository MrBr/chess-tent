import { services } from '@application';
import {
  Chess,
  getPiece,
  createFenForward,
  createFenBackward,
  getTurnColor,
  setTurnColor,
  createNotableMove,
} from './service';

services.Chess = Chess;
services.createFenForward = createFenForward;
services.createFenBackward = createFenBackward;
services.getPiece = getPiece;
services.getTurnColor = getTurnColor;
services.setTurnColor = setTurnColor;
services.createNotableMove = createNotableMove;
