import React from 'react';
import { MoveModule } from '@types';
import { components, ui } from '@application';

const { Text } = ui;
const { StepMove } = components;

const ActivityBoard: MoveModule['ActivityBoard'] = ({
  Chessboard,
  step,
  Footer,
}) => {
  const {
    state: {
      move: { position },
      shapes,
    },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const ActivitySidebar: MoveModule['ActivitySidebar'] = ({ step }) => {
  return (
    <>
      {step.state.move && <StepMove move={step.state.move} />}
      <Text>{step.state.description}</Text>
    </>
  );
};

export { ActivityBoard, ActivitySidebar };
