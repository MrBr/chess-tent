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
  return (
    <Chessboard fen={position} autoShapes={shapes} lastMove={move?.move} />
  );
};

const ActivitySidebar: VariationModule['ActivitySidebar'] = ({ step }) => {
  return (
    <LessonPlaygroundContent empty={!step.state.description}>
      <LessonToolboxText text={step.state.description} />
    </LessonPlaygroundContent>
  );
};

export { ActivityBoard, ActivitySidebar };
