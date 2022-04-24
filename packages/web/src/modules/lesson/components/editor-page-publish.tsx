import React, { ComponentType, useCallback } from 'react';
import { hooks, state, requests } from '@application';
import {
  Lesson,
  LessonStateStatus,
  publishLesson,
  unpublishLesson,
} from '@chess-tent/models';
import EditorAction from './editor-action';

const {
  actions: { updateEntity },
} = state;
const { useDispatch } = hooks;

const EditorPagePublish: ComponentType<{ lesson: Lesson }> = ({ lesson }) => {
  const dispatch = useDispatch();

  const publish = useCallback(async () => {
    const updatedLesson = publishLesson(lesson);
    await requests.lessonPublish(updatedLesson.id);
    dispatch(updateEntity(updatedLesson));
  }, [dispatch, lesson]);

  const unpublish = useCallback(async () => {
    const updatedLesson = unpublishLesson(lesson);
    await requests.lessonUnpublish(updatedLesson.id);
    dispatch(updateEntity(updatedLesson));
  }, [dispatch, lesson]);

  if (lesson.published && lesson.state.status === LessonStateStatus.DRAFT) {
    console.warn('Make sure the lesson is actually saved on server');
    // TODO - make dropdown button for unpublish
    return (
      <EditorAction id="publish" tooltip="Publish changes" onClick={publish}>
        Update
      </EditorAction>
    );
  }

  if (lesson.published) {
    return (
      <EditorAction
        id="publish"
        tooltip="Remove lesson from marketplace"
        onClick={unpublish}
      >
        Unpublish
      </EditorAction>
    );
  }

  return (
    <EditorAction id="publish" tooltip="Make lesson public" onClick={publish}>
      Publish
    </EditorAction>
  );
};

export default EditorPagePublish;
