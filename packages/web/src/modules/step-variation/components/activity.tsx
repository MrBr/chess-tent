import React from 'react';
import { FEN, VariationModule } from '@types';
import { components } from '@application';

const { StepMove, LessonToolboxText } = components;

const ActivityBoard: VariationModule['ActivityBoard'] = ({
  Chessboard,
  step,
  Footer,
}) => {
  const {
    state: { move, shapes },
  } = step;
  const position = move ? move.position : (step.state.position as FEN);
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const ActivitySidebar: VariationModule['ActivitySidebar'] = ({ step }) => {
  return (
    <>
      {step.state.move && <StepMove move={step.state.move} />}
      <LessonToolboxText defaultText={step.state.description} />
    </>
  );
};

export { ActivityBoard, ActivitySidebar };
