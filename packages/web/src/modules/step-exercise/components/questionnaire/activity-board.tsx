import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionnaireStep } from '@types';

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionnaireStep>['ActivityBoard']>
> = ({ step, Footer, Chessboard }) => {
  const { task } = step.state;

  return (
    <Chessboard
      fen={task.position}
      shapes={task.shapes}
      animation
      footer={<Footer />}
    />
  );
};

export default Playground;
