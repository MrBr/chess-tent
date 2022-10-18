import { services } from '@application';
import { Chess } from 'chess.js';
import {
  getPiece,
  createFenForward,
  createFenBackward,
  getTurnColor,
  setTurnColor,
  createNotableMove,
  shortenRole,
  createMoveShortObject,
  createPiece,
  createNotableMoveFromChessMove,
  isLegalMove,
  switchTurnColor,
  extendRole,
  uciToSan,
  getNextMoveIndex,
  getFenPosition,
  shortenColor,
  getFenEnPassant,
  getRank,
  getFile,
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
services.shortenColor = shortenColor;
services.uciToSan = uciToSan;
services.createMoveShortObject = createMoveShortObject;
services.createPiece = createPiece;
services.isLegalMove = isLegalMove;
services.createNotableMoveFromChessMove = createNotableMoveFromChessMove;
services.getNextMoveIndex = getNextMoveIndex;
services.getFenPosition = getFenPosition;
services.getFenEnPassant = getFenEnPassant;
services.getFenEnPassant = getFenEnPassant;
services.getSquareRank = getRank;
services.getSquareFile = getFile;
