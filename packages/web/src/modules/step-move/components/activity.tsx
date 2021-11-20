import React from 'react';
import { MoveModule } from '@types';
import { components } from '@application';

const { StepMove, LessonToolboxText, LessonPlaygroundCard } = components;

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
    <LessonPlaygroundCard>
      {step.state.move && <StepMove move={step.state.move} />}
      <LessonToolboxText defaultText={step.state.description} />
    </LessonPlaygroundCard>
  );
};

export { ActivityBoard, ActivitySidebar };
