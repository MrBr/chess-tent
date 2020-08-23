import React, { useEffect } from 'react';
import {
  components,
  constants,
  hooks,
  state,
  stepModules,
  utils,
  requests,
} from '@application';
import { createLesson, Lesson, Step, User } from '@chess-tent/models';

const {
  useParams,
  useDispatchBatched,
  useActiveUserRecord,
  useSelector,
  useHistory,
  useApi,
} = hooks;
const { Editor } = components;
const { createStep } = stepModules;
const { START_FEN } = constants;
const { generateIndex } = utils;
const {
  selectors: { lessonSelector },
  actions: { updateEntities },
} = state;

export default () => {
  const { lessonId } = useParams();
  const {
    fetch,
    response: lessonResponse,
    error: lessonResponseError,
  } = useApi(requests.lesson);
  const dispatch = useDispatchBatched();
  const [user] = useActiveUserRecord() as [User, unknown, unknown];
  const lesson = useSelector(lessonSelector(lessonId));
  const history = useHistory();

  useEffect(() => {
    // Load existing lesson
    if (!lessonId || lesson) {
      return;
    }
    fetch(lessonId);
  }, [fetch, lesson, lessonId]);

  useEffect(() => {
    if (lessonResponse) {
      dispatch(updateEntities(lessonResponse.data));
    }
  }, [lessonResponse, dispatch]);

  useEffect(() => {
    // Create new lesson
    if (lessonId) {
      return;
    }
    const defaultStep: Step = createStep('variation', START_FEN);
    const newLessonId = generateIndex();
    const defaultLesson: Lesson = createLesson(
      newLessonId,
      [defaultStep],
      defaultStep,
      user,
    );
    dispatch(updateEntities(defaultLesson));
    history.push(`/lesson/${newLessonId}`);
  }, [lessonId, user, dispatch, history]);

  if (lessonResponseError) {
    return <>Couldn't load lesson</>;
  }

  if (!lesson) {
    return null;
  }

  return <Editor lesson={lesson} />;
};
