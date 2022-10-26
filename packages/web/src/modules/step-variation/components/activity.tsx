import React from 'react';
import { FEN, VariationModule } from '@types';
import { components } from '@application';

const { LessonToolboxText, LessonPlaygroundContent } = components;

const ActivityBoard: VariationModule['ActivityBoard'] = ({
  Chessboard,
  step,
}) => {
  const {
    state: { move, shapes },
  } = step;
  const position = move ? move.position : (step.state.position as FEN);
  return <Chessboard fen={position} autoShapes={shapes} />;
};

const ActivitySidebar: VariationModule['ActivitySidebar'] = ({ step }) => {
  return (
    <LessonPlaygroundContent>
      <LessonToolboxText text={step.state.description} />
    </LessonPlaygroundContent>
  );
};

export { ActivityBoard, ActivitySidebar };
