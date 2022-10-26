import React from 'react';
import { MoveModule } from '@types';
import { components } from '@application';

const { LessonToolboxText, LessonPlaygroundContent } = components;

const ActivityBoard: MoveModule['ActivityBoard'] = ({ Chessboard, step }) => {
  const {
    state: {
      move: { position },
      shapes,
    },
  } = step;
  return <Chessboard fen={position} autoShapes={shapes} />;
};

const ActivitySidebar: MoveModule['ActivitySidebar'] = ({ step }) => {
  return (
    <LessonPlaygroundContent empty={!step.state.description}>
      <LessonToolboxText text={step.state.description} />
    </LessonPlaygroundContent>
  );
};

export { ActivityBoard, ActivitySidebar };
