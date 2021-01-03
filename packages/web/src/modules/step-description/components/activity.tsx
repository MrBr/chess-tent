import React from 'react';
import { DescriptionModule } from '@types';
import { components, ui } from '@application';

const { Icon } = ui;
const { LessonToolboxText } = components;

export const ActivityBoard: DescriptionModule['ActivityBoard'] = ({
  Chessboard,
  step,
  Footer,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

export const ActivitySidebar: DescriptionModule['ActivitySidebar'] = ({
  step,
}) => {
  const {
    state: { description },
  } = step;
  return (
    <>
      <Icon type="comment" textual />
      <LessonToolboxText defaultText={description} placeholder="Type here.." />
    </>
  );
};
