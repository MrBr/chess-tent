import React from 'react';
import { DescriptionModule } from '@types';
import { components } from '@application';

const { LessonToolboxText, LessonPlaygroundContent } = components;

export const ActivityBoard: DescriptionModule['ActivityBoard'] = ({
  Chessboard,
  step,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} autoShapes={shapes} />;
};

export const ActivitySidebar: DescriptionModule['ActivitySidebar'] = ({
  step,
}) => {
  const {
    state: { description },
  } = step;

  return (
    <LessonPlaygroundContent empty={!description}>
      <LessonToolboxText
        text={description}
        placeholder="Comment should be here :o"
      />
    </LessonPlaygroundContent>
  );
};
