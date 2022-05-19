import React from 'react';
import { LessonStatus } from '@types';
import { ui } from '@application';

const { Badge } = ui;

const getStatusText = (lessonStatus: LessonStatus) => {
  switch (lessonStatus) {
    case LessonStatus.DIRTY:
      return 'Have unsaved changes';
    case LessonStatus.ERROR:
      return 'Something went wrong, lesson not saved.';
    case LessonStatus.LOADING:
      return 'Initialising the lesson.';
    case LessonStatus.SAVED:
    case LessonStatus.INITIAL:
    default:
      return 'Lesson saved';
  }
};
const EditorStatus = ({ lessonStatus }: { lessonStatus: LessonStatus }) => (
  <Badge>{getStatusText(lessonStatus)}</Badge>
);

export default EditorStatus;
