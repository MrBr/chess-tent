import {
  Evaluation,
  Move,
  MoveShort,
  NotableMove,
  PieceRoleShortPromotable,
} from '@types';
import { services } from '@application';

const {
  uciToSan,
  extendRole,
  createPiece,
  createNotableMove,
  Chess,
} = services;

export const getBestMove = ({ variation }: Evaluation): MoveShort =>
  uciToSan(variation[0]);
export const getPonderMove = ({ variation }: Evaluation): MoveShort =>
  uciToSan(variation[1]);

export const getEvaluationMoves = ({
  variation,
  position,
}: Evaluation): NotableMove[] => {
  const game = new Chess(position);
  try {
    return variation.slice(0, 5).map((uciMove, index) => {
      const shortMove = game.move(uciToSan(uciMove));
      if (!shortMove) {
        throw Error('Invalid evaluation variation move.');
      }
      const { captured, from, to, promotion, color } = shortMove;
      const newPosition = game.fen();
      const move = [from, to] as Move;
      const promoted = extendRole(promotion as PieceRoleShortPromotable);
      const piece = createPiece(
        extendRole(shortMove.piece),
        color === 'w' ? 'white' : 'black',
        !!promoted,
      );
      return createNotableMove(
        newPosition,
        move,
        Math.floor(index / 2) + 1, // TODO - show real move index (take it from position)
        piece,
        !!captured,
        promoted,
      );
    });
  } catch {
    return [];
  }
};
