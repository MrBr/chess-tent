import React, { useEffect } from 'react';
import {
  components,
  constants,
  hooks,
  state,
  stepModules,
  utils,
  requests,
  ui,
} from '@application';
import {
  createLesson,
  Lesson,
  Step,
  User,
  createActivity,
} from '@chess-tent/models';

const {
  useParams,
  useDispatchBatched,
  useActiveUserRecord,
  useSelector,
  useHistory,
  useApi,
} = hooks;
const { Container, Button } = ui;
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
  const { fetch: saveActivity } = useApi(requests.activitySave);
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
    if (lessonResponse && !lessonResponseError) {
      dispatch(updateEntities(lessonResponse.data));
    }
  }, [lessonResponse, dispatch, lessonResponseError]);

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

  return (
    <>
      <Container>
        <Button
          onClick={() => {
            const activityId = generateIndex();
            const activity = createActivity(activityId, lesson, user, {});
            saveActivity(activity);
          }}
        >
          Assign to self
        </Button>
      </Container>
      <Editor lesson={lesson} />
    </>
  );
};
