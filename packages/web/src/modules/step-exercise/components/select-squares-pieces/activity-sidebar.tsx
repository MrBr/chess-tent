import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
} from '@types';
import { isLessonActivityStepCompleted } from '@chess-tent/models';
import { getCorrectSelectionsCount, isLastSelectionCorrect } from './utils';
import { SegmentActivitySidebar } from '../segment';

const { Text } = ui;

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivitySidebar']
  >
> = props => {
  const { step, stepActivityState, activity, activeBoard } = props;
  const { task } = step.state;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const shapes = task.shapes || [];
  const correctAction = isLastSelectionCorrect(shapes, selectedShapes);
  const correctSelectionsCount = getCorrectSelectionsCount(
    shapes,
    selectedShapes,
  );
  const completed = isLessonActivityStepCompleted(activity, activeBoard, step);
  return (
    <SegmentActivitySidebar title="Select the squares and pieces" {...props}>
      {!completed && (
        <Text>{`You have ${
          shapes.length - correctSelectionsCount
        } squares more to go.`}</Text>
      )}
      <Text>
        {correctAction === false
          ? 'Wrong selection'
          : correctAction === true
          ? 'Correct selection!'
          : ''}
      </Text>
    </SegmentActivitySidebar>
  );
};

export default Playground;
