import React, { ComponentProps, FunctionComponent, useEffect } from 'react';
import { ui, components } from '@application';
import {
  ExerciseModule,
  Move,
  ExerciseActivityArrangePiecesState,
  ExerciseArrangePiecesStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { Text, Row, Col } = ui;
const { PieceIcon } = components;

const getPieceStatus = (
  activityMoves?: ExerciseActivityArrangePiecesState['moves'],
  destMove?: Move,
) => {
  const move = activityMoves?.find(({ move }) => move?.[0] === destMove?.[0]);
  if (!move) {
    return 'Move';
  }
  return move.move?.[1] === destMove?.[1] ? 'Correct' : 'Wrong';
};

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseArrangePiecesStep>['ActivitySidebar']>
> = props => {
  const { step, stepActivityState, completeStep } = props;
  const { moves: activityMoves, completed } =
    stepActivityState as ExerciseActivityArrangePiecesState;
  const { moves: exerciseMoves } = step.state.task;

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
      <Row>
        {exerciseMoves?.map(({ move, piece }) => (
          <Col className="col-auto" key={move.toString()}>
            <PieceIcon piece={piece} />
            <Text className="d-inline-block mb-0" fontSize="smallest">
              {move[0]} - {getPieceStatus(activityMoves, move)}
            </Text>
          </Col>
        ))}
      </Row>
    </SegmentActivitySidebar>
  );
};

export default Playground;
