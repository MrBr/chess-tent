import { FEN, Orientation, PieceColor, Services, Steps } from '@types';
import { updateStepState } from '@chess-tent/models';
import { parse, ParseTree } from '@mliebelt/pgn-parser';
import { transformNullMoves, transformPgnVariation } from './_helpers';

export const getStepPosition = (step: Steps): FEN => {
  if (step.stepType === 'variation') {
    return step.state.move?.position || (step.state.position as FEN);
  }
  if (step.stepType === 'move') {
    return step.state.move.position;
  }
  if (step.stepType === 'exercise') {
    return step.state.task.position;
  }
  return step.state.position;
};

export const getStepBoardOrientation = (step: Steps): PieceColor => {
  return step.state.orientation || 'white';
};

export const updateStepRotation = (
  step: Steps,
  orientation?: Orientation,
): Steps => {
  return updateStepState(step, { orientation });
};

export const parsePgn: Services['parsePgn'] = (pgn, { orientation }) => {
  const processedPgn = transformNullMoves(pgn);
  const games = parse(processedPgn, { startRule: 'games' }) as ParseTree[];
  return games.map(game => ({
    tags: game.tags,
    variation: transformPgnVariation(game.moves, {
      fen: game.tags?.FEN,
      orientation,
      comment: game.gameComment?.comment,
    }),
  }));
};
