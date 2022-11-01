import { constants } from '@application';
import {
  FEN,
  Orientation,
  PgnGame,
  PieceColor,
  Services,
  Steps,
  VariationStep,
} from '@types';
import { Chapter, updateStepState } from '@chess-tent/models';
import { parse, ParseTree } from '@mliebelt/pgn-parser';
import { transformNullMoves, transformPgnVariation } from './_helpers';

const { START_FEN } = constants;

export const isEmptyChapter = (chapter: Chapter) => {
  const firstStep = chapter.state.steps[0];
  return (
    chapter.state.steps.length === 1 &&
    firstStep.stepType === 'variation' &&
    isEmptyVariation(firstStep as VariationStep)
  );
};

export const isEmptyVariation = (step: VariationStep) => {
  return step.state.steps.length === 0 && step.state.position === START_FEN;
};

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

const getGameTitle = (
  tags: PgnGame['tags'],
  isTournament: boolean,
  index: number,
) => {
  if (isTournament) {
    const white = tags?.White;
    const black = tags?.Black;
    return white && black ? `${white} - ${black}` : `Game ${index}`;
  }
  return tags?.Event || `Chapter ${index}`;
};

export const parsePgn: Services['parsePgn'] = (pgn, { orientation }) => {
  const processedPgn = transformNullMoves(pgn);
  const games = parse(processedPgn, { startRule: 'games' }) as ParseTree[];
  const eventName = games[0]?.tags?.Event;
  // Studies use Event for titles, real events use the same event name
  const isTournament = games.every(({ tags }) => tags?.Event === eventName);
  return games.map((game, index) => ({
    tags: game.tags,
    variation: transformPgnVariation(game.moves, {
      fen: game.tags?.FEN,
      orientation,
      comment: game.gameComment?.comment,
    }),
    title: getGameTitle(game.tags, isTournament, index),
  }));
};
