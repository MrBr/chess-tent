import React, { ComponentProps, FunctionComponent, useEffect } from 'react';
import { ui, components } from '@application';
import {
  ExerciseModule,
  Move,
  ExerciseActivityArrangePiecesState,
  ExerciseArrangePiecesStep,
} from '@types';
import { isLessonActivityStepCompleted } from '@chess-tent/models';
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
  const {
    activity,
    step,
    stepActivityState,
    completeStep,
    activeBoard,
  } = props;
  const {
    moves: activityMoves,
    invalidPiece,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state.task;
  const completed = isLessonActivityStepCompleted(activity, activeBoard, step);

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
      {exerciseMoves?.map(({ move, piece }) => (
        <div>
          <PieceIcon piece={piece} />
          <Text className="d-inline-block" key={move[0]}>
            {move[0]} - {getPieceStatus(activityMoves, move)}
          </Text>
        </div>
      ))}
      {invalidPiece && (
        <Text fontSize="small">{invalidPiece} shouldn't be moved</Text>
      )}
    </SegmentActivitySidebar>
  );
};

export default Playground;
