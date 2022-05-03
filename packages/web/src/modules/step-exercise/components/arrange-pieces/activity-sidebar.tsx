import React, { ComponentProps, FunctionComponent, useEffect } from 'react';
import { ui, components } from '@application';
import {
  ExerciseModule,
  Move,
  ExerciseActivityArrangePiecesState,
  ExerciseArrangePiecesStep,
} from '@types';
import { isLessonActivityBoardStepCompleted } from '@chess-tent/models';
import { SegmentActivitySidebar } from '../segment';

const { Text } = ui;
const { PieceIcon } = components;

const getPieceStatus = (
  activityMoves?: ExerciseActivityArrangePiecesState['moves'],
  destMove?: Move,
) => {
  const move = activityMoves?.find(({ move }) => move?.[0] === destMove?.[0]);
  if (!move) {
    return 'Not moved';
  }
  return move.move?.[1] === destMove?.[1] ? 'Correct' : 'Wrong square';
};

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseArrangePiecesStep>['ActivitySidebar']>
> = props => {
  const { step, stepActivityState, completeStep, boardState } = props;
  const { moves: activityMoves } =
    stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state.task;
  const completed = isLessonActivityBoardStepCompleted(boardState, step);

  useEffect(() => {
    const allCorrect = exerciseMoves?.every(
      ({ move }) => getPieceStatus(activityMoves, move) === 'Correct',
    );
    if (allCorrect && !completed) {
      completeStep(step);
    }
  }, [activityMoves, completeStep, completed, exerciseMoves, step]);

  return (
    <SegmentActivitySidebar title="Arrange the pieces" {...props}>
      <div className="mt-3">
        {exerciseMoves?.map(({ move, piece }) => (
          <div className="mb-1">
            <PieceIcon piece={piece} />
            <Text
              className="d-inline-block mb-0"
              key={move[0]}
              fontSize="extra-small"
            >
              {move[0]} - {getPieceStatus(activityMoves, move)}
            </Text>
          </div>
        ))}
      </div>
    </SegmentActivitySidebar>
  );
};

export default Playground;
