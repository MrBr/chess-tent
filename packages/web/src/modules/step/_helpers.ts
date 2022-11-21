import { ChessInstance, FEN, Orientation, Steps } from '@types';
import { services } from '@application';
import { PgnMove } from '@mliebelt/pgn-parser';
import { createStepModuleStep } from './model';
import { IllegalMoveError } from './errors';

const { Chess, switchTurnColor, createNotableMoveFromChessMove } = services;

const NullMoveReplacement = 'Ke1';
const NullMoveReplacementComment = 'null-move';

const transformPgnMoveToStepMove = (
  chessGame: ChessInstance,
  move: PgnMove,
  orientation: Orientation | undefined,
) => {
  if (
    move.commentAfter === NullMoveReplacementComment &&
    move.notation.notation === NullMoveReplacement
  ) {
    // TODO - can null move have variations?
    chessGame.load(switchTurnColor(chessGame.fen()));
    return;
  }

  const prevPosition = chessGame.fen();
  const chessMove = chessGame.move(move.notation.notation);
  if (!chessMove) {
    throw new IllegalMoveError(move.moveNumber);
  }
  const position = chessGame.fen();
  const notableMove = createNotableMoveFromChessMove(
    position,
    chessMove,
    move.moveNumber,
  );

  const variations: Steps[] = move.variations.map(
    ([variationMove, ...variationMoves]) =>
      transformPgnVariation(variationMoves, {
        orientation,
        fen: prevPosition,
        variationMove,
      }),
  );

  return createStepModuleStep('move', {
    description: move.commentMove || move.commentAfter,
    move: notableMove,
    orientation,
    steps: variations,
  });
};

export const transformPgnVariation = (
  moves: PgnMove[],
  {
    fen,
    comment,
    orientation,
    variationMove,
  }: {
    variationMove?: PgnMove;
    fen: FEN | undefined;
    comment?: string | undefined;
    orientation: Orientation | undefined;
  },
) => {
  let chessGame = new Chess(fen);
  let variationFirstMove;
  if (variationMove) {
    // Variation move is inside variation step, not in move step
    // This is just used to parse first move variations
    variationFirstMove = transformPgnMoveToStepMove(
      chessGame,
      variationMove,
      orientation,
    );
  }
  const moveSteps: Steps[] = [];

  moves.forEach(move => {
    const moveStep = transformPgnMoveToStepMove(chessGame, move, orientation);

    moveStep && moveSteps.push(moveStep);
  });

  const move = variationFirstMove ? variationFirstMove.state.move : undefined;
  const steps = [...(variationFirstMove?.state.steps || []), ...moveSteps];

  return createStepModuleStep('variation', {
    move,
    steps,
    orientation,
    position: fen,
    moveIndex: variationMove?.moveNumber,
    description: comment,
  });
};

// PGN parser doesn't recognize null moves. This is a workaround
export const transformNullMoves = (pgn: string) =>
  pgn.replaceAll(
    /Z0|--/g,
    `${NullMoveReplacement} {${NullMoveReplacementComment}}`,
  );
