import React from 'react';
import { DescriptionModule } from '@types';
import { components, ui } from '@application';

const { Icon } = ui;
const { LessonToolboxText, LessonPlaygroundCard } = components;

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
    <LessonPlaygroundCard>
      <Icon type="comment" textual />
      <LessonToolboxText
        text={description}
        placeholder="Comment should be here :o"
      />
    </LessonPlaygroundCard>
  );
};
