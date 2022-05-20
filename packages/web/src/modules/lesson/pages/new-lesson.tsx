import React, { useCallback, useEffect, useState } from 'react';
import { components, hooks, requests, state } from '@application';
import { Lesson, TYPE_LESSON } from '@chess-tent/models';
import { LessonStatus } from '@types';
import { createNewLesson } from '../service';
import EditorPageHeader from '../components/editor-page-header';
import { useLessonPartialUpdates } from '../hooks/lesson';

const {
  useDispatchBatched,
  useActiveUserRecord,
  useSelector,
  useHistory,
  useStore,
} = hooks;
const { Editor, Page } = components;
const {
  selectors: { lessonSelector },
  actions: { updateEntities },
} = state;

const NewLesson = () => {
  const dispatch = useDispatchBatched();
  const { value: user } = useActiveUserRecord();
  const [lessonId, setLessonId] = useState<Lesson['id'] | undefined>();
  const lesson = useSelector(lessonSelector(lessonId as string)) as Lesson;
  const history = useHistory();
  const store = useStore();

  useEffect(() => {
    if (lessonId) {
      return;
    }
    const newLesson = createNewLesson(user);
    setLessonId(newLesson.id);
    dispatch(updateEntities(newLesson));
  }, [dispatch, lessonId, user]);

  const saveLesson = useCallback(
    () =>
      requests.lessonSave(
        // TODO
        // Get the latest lesson - using lesson from scope above may update with obsolete lesson
        // Probably should use updates from argument
        store.getState().entities[TYPE_LESSON][lessonId as string],
      ),
    [lessonId, store],
  );

  const lessonStatus = useLessonPartialUpdates(lesson, saveLesson);

  useEffect(() => {
    if (lessonStatus !== LessonStatus.SAVED) {
      return;
    }
    const activeStep =
      new URLSearchParams(history.location.search).get('activeStep') ||
      lesson.state.chapters[0].state.steps[0].id;
    history.replace(`/lesson/${lesson.id}?activeStep=${activeStep}`);
  }, [lessonStatus, lesson, history]);

  if (!lesson) {
    return null;
  }

  return (
    <Page header={<EditorPageHeader lessonStatus={lessonStatus} />}>
      <Editor lesson={lesson} lessonStatus={lessonStatus} />
    </Page>
  );
};

export default NewLesson;
