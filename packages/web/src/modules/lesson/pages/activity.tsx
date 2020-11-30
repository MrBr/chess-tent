import React, { useEffect } from 'react';
import { hooks, state, requests, socket } from '@application';
import { LessonActivity } from '@types';
import { isLesson } from '@chess-tent/models';
import Activity from '../components/activity';

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
    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      socket.unsubscribe(`activity-${activityId}`);
    };
  }, [activityId]);
  useEffect(() => {
    socket.subscribe(`activity-${activityId}`);
  }, [activityId]);

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

  return <Activity activity={activity} />;
};
