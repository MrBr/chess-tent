import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
} from '@types';
import { isLessonActivityBoardStepCompleted } from '@chess-tent/models';
import { getCorrectSelectionsCount, isLastSelectionCorrect } from './utils';
import { SegmentActivitySidebar } from '../segment';

const { Text } = ui;

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivitySidebar']
  >
> = props => {
  const { step, stepActivityState, boardState } = props;
  const { task } = step.state;
  const { selectedShapes } =
    stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const shapes = task.shapes || [];
  const correctAction = isLastSelectionCorrect(shapes, selectedShapes);
  const correctSelectionsCount = getCorrectSelectionsCount(
    shapes,
    selectedShapes,
  );
  const completed = isLessonActivityBoardStepCompleted(boardState, step);
  return (
    <SegmentActivitySidebar title="Select the squares and pieces" {...props}>
      {!completed && (
        <Text fontSize="extra-small" weight={400}>
          {`You have ${
            shapes.length - correctSelectionsCount
          } selections more to go.`}
        </Text>
      )}
      <Text fontSize="extra-small" weight={400}>
        {!correctAction
          ? 'Wrong selection'
          : !!correctAction
          ? 'Correct selection!'
          : ''}
      </Text>
    </SegmentActivitySidebar>
  );
};

export default Playground;
