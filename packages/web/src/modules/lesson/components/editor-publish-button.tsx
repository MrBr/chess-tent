import React, { useCallback } from 'react';
import { ui, hooks, requests } from '@application';
import { Lesson, LessonStateStatus, publishLesson } from '@chess-tent/models';

const { Button } = ui;
const { useApi, useDispatchService } = hooks;

export interface PublishButtonProps {
  lesson: Lesson;
}

export default ({ lesson }: PublishButtonProps) => {
  const dispatchService = useDispatchService();
  const { fetch: lessonPublish } = useApi(requests.lessonPublish);

  const handlePublish = useCallback(() => {
    lessonPublish(lesson.id, lesson);
    dispatchService(publishLesson)(lesson);
  }, [dispatchService, lesson, lessonPublish]);

  const isPublished = lesson.state.status === LessonStateStatus.PUBLISHED;
  return (
    <Button
      size="extra-small"
      className="mr-3"
      variant={!isPublished ? 'regular' : 'ghost'}
      onClick={handlePublish}
      disabled={isPublished}
    >
      Publish
    </Button>
  );
};
