import React, { useCallback, useEffect, useState } from 'react';
import {
  components,
  hooks,
  state,
  utils,
  requests,
  services,
  constants,
} from '@application';
import {
  createChapter,
  createLesson,
  Lesson,
  Step,
  User,
} from '@chess-tent/models';

const {
  useDispatchBatched,
  useActiveUserRecord,
  useSelector,
  useHistory,
} = hooks;
const { Editor } = components;
const { createStep } = services;
const { generateIndex } = utils;
const { START_FEN } = constants;
const {
  selectors: { lessonSelector },
  actions: { updateEntities },
} = state;

const createNewLesson = (user: User) => {
  const defaultStep: Step = createStep('variation', {
    position: START_FEN,
  });
  const newLessonId = generateIndex();
  const defaultChapter = createChapter(generateIndex(), 'Chapter', [
    defaultStep,
  ]);
  return createLesson(newLessonId, [defaultChapter], user);
};

export default () => {
  const dispatch = useDispatchBatched();
  const [user] = useActiveUserRecord() as [User, unknown, unknown];
  const [lessonId, setLessonId] = useState<Lesson['id'] | undefined>();
  const lesson = useSelector(
    lessonSelector((lessonId as unknown) as string),
  ) as Lesson;
  const history = useHistory();

  useEffect(() => {
    if (lessonId) {
      return;
    }
    const newLesson = createNewLesson(user);
    setLessonId(newLesson.id);
    dispatch(updateEntities(newLesson));
  }, [dispatch, lessonId, user]);

  const saveLesson = useCallback(() => {
    const saveLessonPromise = requests.lessonSave(lesson);
    saveLessonPromise.then(() => {
      const activeStep =
        new URLSearchParams(history.location.search).get('activeStep') ||
        lesson.state.chapters[0].state.steps[0].id;
      history.replace(`/lesson/${lesson.id}?activeStep=${activeStep}`);
    });
    return saveLessonPromise;
  }, [history, lesson]);

  if (!lesson) {
    return null;
  }

  return <Editor lesson={lesson} save={saveLesson} />;
};
