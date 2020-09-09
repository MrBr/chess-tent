import { services } from '@application';
import {
  Chess,
  getPiece,
  createFenForward,
  createFenBackward,
} from './service';

services.Chess = Chess;
services.createFenForward = createFenForward;
services.createFenBackward = createFenBackward;
services.getPiece = getPiece;
