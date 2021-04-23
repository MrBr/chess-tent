import React, { useCallback } from 'react';
import { ui, hooks, requests, state } from '@application';
import { Lesson, LessonStateStatus } from '@chess-tent/models';

const { Button } = ui;
const { useApi, useDispatchBatched } = hooks;
const {
  actions: { updateLessonStatus },
} = state;

export interface PublishButtonProps {
  lesson: Lesson;
}

export default ({ lesson }: PublishButtonProps) => {
  const dispatch = useDispatchBatched();
  const {
    fetch: lessonPublish,
    // error: lessonPublishError,
    // response: lessonPublishResponse,
    // reset: lessonPublishReset,
  } = useApi(requests.lessonPublish);

  const handlePublish = useCallback(() => {
    lessonPublish(lesson.id, lesson);
    const updateStatusAction = updateLessonStatus(
      lesson,
      LessonStateStatus.PUBLISHED,
    );
    dispatch(updateStatusAction);
  }, [dispatch, lesson, lessonPublish]);

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
