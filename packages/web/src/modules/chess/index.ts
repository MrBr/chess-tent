import { services } from '@application';
import { createFen, Chess, getPiece } from './service';

services.Chess = Chess;
services.recreateFenWithMoves = createFen;
services.getPiece = getPiece;
