import React, { useEffect } from 'react';
import { components, hooks, state, requests } from '@application';
import { canEditLesson, isLessonPublicDocument } from '@chess-tent/models';

const {
  useParams,
  useDispatchBatched,
  useSelector,
  useApi,
  useActiveUserRecord,
} = hooks;
const { Editor, Redirect } = components;
const {
  selectors: { lessonSelector },
  actions: { updateEntities },
} = state;

export default () => {
  const { value: user } = useActiveUserRecord();
  const { lessonId } = useParams();
  const {
    fetch,
    response: lessonResponse,
    error: lessonResponseError,
  } = useApi(requests.lesson);
  const dispatch = useDispatchBatched();
  const lesson = useSelector(lessonSelector(lessonId));

  useEffect(() => {
    // Load existing lesson
    if (lesson) {
      return;
    }
    fetch(lessonId);
  }, [fetch, lesson, lessonId]);

  useEffect(() => {
    if (lessonResponse && !lessonResponseError) {
      dispatch(updateEntities(lessonResponse.data));
    }
  }, [lessonResponse, dispatch, lessonResponseError]);

  if (lessonResponseError) {
    return <>Couldn't load lesson</>;
  }

  if (!lesson) {
    return null;
  }

  if (isLessonPublicDocument(lesson) || !canEditLesson(lesson, user.id)) {
    return <Redirect to="/" />;
  }

  return <Editor lesson={lesson} save={requests.lessonUpdates} />;
};
