import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivityBoard']
>> = ({ step, Footer, Chessboard }) => {
  const { position, shapes } = step.state;

  return (
    <Chessboard fen={position} shapes={shapes} animation footer={<Footer />} />
  );
};

export default Playground;
