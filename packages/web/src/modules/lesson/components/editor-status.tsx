import React from 'react';
import { LessonStatus } from '@types';
import { ui } from '@application';

const { Badge } = ui;

const getStatusText = (lessonStatus: LessonStatus) => {
  switch (lessonStatus) {
    case LessonStatus.DIRTY:
      return 'Have unsaved changes';
    case LessonStatus.ERROR:
      return 'Something went wrong, template not saved';
    case LessonStatus.LOADING:
      return 'Initialising the template';
    case LessonStatus.INITIAL:
      return 'Template ready';
    case LessonStatus.SAVED:
    default:
      return 'Template saved';
  }
};
const EditorStatus = ({ lessonStatus }: { lessonStatus: LessonStatus }) => (
  <Badge>{getStatusText(lessonStatus)}</Badge>
);

export default EditorStatus;
