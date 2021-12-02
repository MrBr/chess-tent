import { services } from '@application';
import {
  Chess,
  getPiece,
  createFenForward,
  createFenBackward,
  getTurnColor,
  setTurnColor,
  createNotableMove,
  shortenRole,
  createMoveShortObject,
  createPiece,
  createNotableMovesFromGame,
  isLegalMove,
  getComment,
  switchTurnColor,
  extendRole,
  uciToSan,
} from './service';

services.Chess = Chess;
services.createFenForward = createFenForward;
services.createFenBackward = createFenBackward;
services.getPiece = getPiece;
services.getTurnColor = getTurnColor;
services.setTurnColor = setTurnColor;
services.createNotableMove = createNotableMove;
services.switchTurnColor = switchTurnColor;
services.extendRole = extendRole;
services.shortenRole = shortenRole;
services.uciToSan = uciToSan;
services.createMoveShortObject = createMoveShortObject;
services.createPiece = createPiece;
services.isLegalMove = isLegalMove;
services.createNotableMovesFromGame = createNotableMovesFromGame;
services.getComment = getComment;
