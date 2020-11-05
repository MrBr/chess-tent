import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import { ExerciseModule, ExerciseSelectSquaresAndPiecesState } from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Headline4, Text } = ui;

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivitySidebar']
>> = ({ step, activity }) => {
  const { question, explanation } = step.state
    .exerciseState as ExerciseSelectSquaresAndPiecesState;
  const completed = isStepCompleted(activity, step);

  return (
    <>
      <Headline4>Select the squares and pieces</Headline4>
      <Text>{question}</Text>
      {completed && <Text>{explanation}</Text>}
    </>
  );
};

export default Playground;
