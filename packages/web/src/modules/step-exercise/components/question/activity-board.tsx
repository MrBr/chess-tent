import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionStep } from '@types';

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivityBoard']>
> = ({ step, Footer, Chessboard }) => {
  const {
    task: { position, shapes },
  } = step.state;

  return (
    <Chessboard fen={position} shapes={shapes} animation footer={<Footer />} />
  );
};

export default Playground;
