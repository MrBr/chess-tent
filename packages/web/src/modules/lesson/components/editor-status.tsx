import { LessonStatus } from '@types';

const EditorStatus = ({ lessonStatus }: { lessonStatus: LessonStatus }) => {
  switch (lessonStatus) {
    case LessonStatus.DIRTY:
      return 'Have unsaved changes';
    case LessonStatus.ERROR:
      return 'Something went wrong, lesson not saved.';
    case LessonStatus.SAVED:
    case LessonStatus.INITIAL:
    default:
      return 'Lesson saved';
  }
};

export default EditorStatus;
