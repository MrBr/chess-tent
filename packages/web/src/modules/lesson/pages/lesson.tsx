import React, { useEffect } from 'react';
import { components, hooks, state, requests } from '@application';

const { useParams, useDispatchBatched, useSelector, useApi } = hooks;
const { Editor } = components;
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

  return <Editor lesson={lesson} save={requests.lessonUpdates} />;
};
