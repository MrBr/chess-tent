import React, { ComponentProps, FunctionComponent } from 'react';
import { components, ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesState,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';
import { getCorrectSelectionsCount, isLastSelectionCorrect } from './utils';

const { Headline4, Text } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = ({ step, activity, stepActivityState }) => {
  const { shapes } = step.state;
  const { question, explanation } = step.state
    .exerciseState as ExerciseSelectSquaresAndPiecesState;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const completed = isStepCompleted(activity, step);
  const correctAction = isLastSelectionCorrect(shapes, selectedShapes);
  const correctSelectionsCount = getCorrectSelectionsCount(
    shapes,
    selectedShapes,
  );
  return (
    <>
      <Headline4>Select the squares and pieces</Headline4>
      <LessonToolboxText defaultText={question} />
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
      {completed && <LessonToolboxText defaultText={explanation} />}
    </>
  );
};

export default Playground;
