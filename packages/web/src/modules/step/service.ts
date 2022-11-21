import { constants } from '@application';
import {
  FEN,
  MoveStep,
  Orientation,
  PgnGame,
  PieceColor,
  Services,
  Steps,
  VariationStep,
} from '@types';
import {
  Chapter,
  createService,
  getParentStep,
  getRightStep,
  getStepIndex,
  isStep,
  replaceStep,
  StepRoot,
  updateStepState,
  createStep,
} from '@chess-tent/models';
import { parse, ParseTree } from '@mliebelt/pgn-parser';
import { transformNullMoves, transformPgnVariation } from './_helpers';
import { IllegalGameError, isIllegalMoveError } from './errors';

const { START_FEN } = constants;

export const transformVariationToMove = (
  variationStep: VariationStep,
  initialState?: Partial<MoveStep['state']>,
) => {
  if (!variationStep.state.move) {
    throw new Error('Cannot transform variation, missing move.');
  }
  // It's important to preserve ID because the step may be selected
  return createStep<MoveStep>(variationStep.id, 'move', {
    move: variationStep.state.move,
    shapes: variationStep.state.shapes,
    steps: variationStep.state.steps,
    ...initialState,
  });
};

export const transformMoveToVariation = (moveStep: MoveStep) => {
  // It's important to preserve ID because the step may be selected
  return createStep<VariationStep>(moveStep.id, 'variation', {
    shapes: moveStep.state.shapes,
    steps: moveStep.state.steps,
    position: moveStep.state.move.position,
    moveIndex: moveStep.state.move.index,
    move: moveStep.state.move,
  });
};

export const isEmptyChapter = (chapter: Chapter) => {
  const firstStep = chapter.state.steps[0];
  return (
    chapter.state.steps.length === 1 &&
    firstStep.stepType === 'variation' &&
    isEmptyVariation(firstStep as VariationStep)
  );
};

export const promoteVariation = createService(
  <T extends StepRoot>(draft: StepRoot, step: Steps): T => {
    if (step.stepType !== 'variation') {
      const variationStep = getParentStep(draft, step) as Steps;
      if (!variationStep) {
        throw new Error('Cannot promote root variation.');
      }
      return promoteVariation(draft, variationStep);
    }

    // Where line diverged
    const parentMoveStep = getParentStep(draft, step);

    if (!isStep(parentMoveStep)) {
      throw new Error('Cannot promote main variation');
    }

    if (!parentMoveStep) {
      throw new Error('Missing parent move variation!');
    }
    const parentVariationStep = getParentStep(draft, parentMoveStep as Steps);

    if (!parentVariationStep) {
      throw new Error('Missing variation!');
    }

    const mainLineStep = getRightStep(parentVariationStep, parentMoveStep);
    if (!mainLineStep) {
      throw new Error('Missing main line step!');
    }

    const mainLineStepIndex = getStepIndex(
      parentVariationStep,
      mainLineStep,
      false,
    );

    // Demote variation
    const mainLineSteps = parentVariationStep?.state.steps.slice(
      // Skip mainLineStep as it's going to become variation
      mainLineStepIndex + 1,
    );
    const demotedVariation = transformMoveToVariation(mainLineStep as MoveStep);
    // Append previously main variation steps to demoted variation
    demotedVariation.state.steps.splice(Infinity, 0, ...mainLineSteps);
    replaceStep(parentMoveStep, step, demotedVariation);

    // Promote variation
    parentVariationStep?.state.steps.splice(
      mainLineStepIndex,
      Infinity,
      transformVariationToMove(step, { steps: [] }),
      ...step.state.steps,
    );
    return draft as T;
  },
);

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
  return games.map((game, index) => {
    try {
      return {
        tags: game.tags,
        variation: transformPgnVariation(game.moves, {
          fen: game.tags?.FEN,
          orientation,
          comment: game.gameComment?.comment,
        }),
        title: getGameTitle(game.tags, isTournament, index),
      };
    } catch (e) {
      if (isIllegalMoveError(e)) {
        throw new IllegalGameError(
          `${game.tags?.Event} | ${game.tags?.Round || index} - ${
            game.tags?.White
          }:${game.tags?.Black}
          Error on move: ${e.moveNumber}`,
        );
      }
      throw e;
    }
  });
};
