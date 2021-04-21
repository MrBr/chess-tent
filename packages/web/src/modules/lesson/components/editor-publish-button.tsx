import React, { useCallback } from 'react';
import { ui, hooks, requests } from '@application';
import { Lesson, LessonDetailsStatus } from '@chess-tent/models';

const { Button } = ui;
const { useApi } = hooks;

export interface PublishButtonProps {
  lesson: Lesson;
}

export default ({ lesson }: PublishButtonProps) => {
  const {
    fetch: lessonPublish,
    // error: lessonPublishError,
    // response: lessonPublishResponse,
    // reset: lessonPublishReset,
  } = useApi(requests.lessonPublish);

  const handlePublish = useCallback(() => {
    // TODO
    //lessonPublish(lesson.id, lesson);
    //dispatch(updateLesson(publishLesson(lesson))) //servis iz modela, treba na FE-u osvježiti stvar
  }, []);

  const isPublished = lesson.state.status === LessonDetailsStatus.PUBLISHED;
  return (
    <Button
      size="extra-small"
      className="mr-3"
      variant={!isPublished ? 'regular' : 'ghost'}
      onClick={() => lessonPublish(lesson.id, lesson)}
      disabled={isPublished}
    >
      Publish
    </Button>
  );
};
