import React, { ComponentProps, FunctionComponent } from 'react';
import { components, ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { getCorrectSelectionsCount, isLastSelectionCorrect } from './utils';

const { Headline4, Text } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivitySidebar']
  >
> = ({ step, activity, stepActivityState }) => {
  const { explanation, task } = step.state;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const shapes = task.shapes || [];
  const completed = isStepCompleted(activity, step);
  const correctAction = isLastSelectionCorrect(shapes, selectedShapes);
  const correctSelectionsCount = getCorrectSelectionsCount(
    shapes,
    selectedShapes,
  );
  return (
    <>
      <Headline4>Select the squares and pieces</Headline4>
      <LessonToolboxText defaultText={task.text} />
      <Text>{`You have ${
        shapes.length - correctSelectionsCount
      } squares more to go.`}</Text>
      <Text>
        {correctAction === false
          ? 'Wrong selection'
          : correctAction === true
          ? 'Correct selection!'
          : ''}
      </Text>
      {completed && <LessonToolboxText defaultText={explanation?.text} />}
    </>
  );
};

export default Playground;
