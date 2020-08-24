import React, { useEffect } from 'react';
import { hooks, state, requests } from '@application';
import { LessonActivity } from '@types';
import { isLesson } from '@chess-tent/models';
import LessonActivityPlayground from '../components/activity';

const { useParams, useDispatchBatched, useSelector, useApi } = hooks;
const {
  selectors: { activitySelector },
  actions: { updateEntities },
} = state;

export default () => {
  const { activityId } = useParams();
  const {
    fetch,
    response: activityResponse,
    error: activityResponseError,
  } = useApi(requests.activity);
  const dispatch = useDispatchBatched();
  const activity = useSelector(activitySelector(activityId)) as LessonActivity;

  useEffect(() => {
    // Load existing activity
    if (!activityId || activity) {
      return;
    }
    fetch(activityId);
  }, [fetch, activity, activityId]);

  useEffect(() => {
    if (activityResponse) {
      dispatch(updateEntities(activityResponse.data));
    }
  }, [activityResponse, dispatch]);

  if (activityResponseError) {
    return <>Couldn't load activity</>;
  }

  if (!activity) {
    return null;
  }

  if (!isLesson(activity.subject)) {
    return <>Error - playground subject miss match</>;
  }

  return <LessonActivityPlayground activity={activity} />;
};
