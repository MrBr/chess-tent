import React, { ComponentProps, FunctionComponent } from 'react';
import { components, ui } from '@application';
import { ExerciseModule, ExerciseSelectSquaresAndPiecesState } from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Headline4 } = ui;
const { LessonToolboxText } = components;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = ({ step, activity }) => {
  const { question, explanation } = step.state
    .exerciseState as ExerciseSelectSquaresAndPiecesState;
  const completed = isStepCompleted(activity, step);

  return (
    <>
      <Headline4>Select the squares and pieces</Headline4>
      <LessonToolboxText defaultText={question} />
      {completed && <LessonToolboxText defaultText={explanation} />}
    </>
  );
};

export default Playground;
