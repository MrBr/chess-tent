import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseArrangePiecesState,
  Move,
  ExerciseActivityArrangePiecesState,
} from '@types';

const { Text, Headline4 } = ui;

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

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivitySidebar']
>> = ({ step, stepActivityState }) => {
  const {
    moves: activityMoves,
    invalidPiece,
  } = stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state
    .exerciseState as ExerciseArrangePiecesState;
  return (
    <>
      <Headline4>Arrange the pieces</Headline4>
      {exerciseMoves?.map(({ move }) => (
        <Text key={move[0]}>
          {move[0]} - {getPieceStatus(activityMoves, move)}
        </Text>
      ))}
      {invalidPiece && (
        <Text fontSize="small">{invalidPiece} shouldn't be moved</Text>
      )}
    </>
  );
};

export default Playground;
