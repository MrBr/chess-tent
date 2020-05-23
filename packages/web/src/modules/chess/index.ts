import { services } from '@application';
import { createFen, Chess } from './service';

services.Chess = Chess;
services.recreateFenWithMoves = createFen;
