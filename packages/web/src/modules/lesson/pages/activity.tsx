import React, { useState, useEffect } from 'react';
import { hooks, state, requests, socket, ui } from '@application';
import {
  LessonActivity,
  SYNC_ACTIVITY_REQUEST_EVENT,
  SYNC_ACTIVITY_EVENT,
} from '@types';
import { isLesson } from '@chess-tent/models';
import Activity from '../components/activity';

const {
  useParams,
  useDispatchBatched,
  useSelector,
  useApi,
  useHistory,
} = hooks;
const { Absolute, Icon } = ui;
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
  const history = useHistory();
  const [shouldFetch, setShouldFetch] = useState(false);

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
    socket.registerEvent(
      SYNC_ACTIVITY_REQUEST_EVENT,
      (forwardToSocketId: string) => {
        if (!forwardToSocketId) {
          setShouldFetch(true);
          return;
        }
        console.log(SYNC_ACTIVITY_REQUEST_EVENT);
        socket.emitEvent(SYNC_ACTIVITY_EVENT, { activity, forwardToSocketId });
      },
    );
  }, [activity, dispatch]);

  useEffect(() => {
    socket.registerEvent(SYNC_ACTIVITY_EVENT, (newActivity: any) => {
      if (newActivity) {
        console.log(SYNC_ACTIVITY_EVENT);
        dispatch(updateEntities(newActivity));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Load existing activity
    if (!activityId || activity || !shouldFetch) {
      return;
    }
    fetch(activityId);
  }, [fetch, activity, activityId, shouldFetch]);

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

  return (
    <>
      <Activity activity={activity} />
      <Absolute left={25} top={25} onClick={() => history.goBack()}>
        <Icon type="close" size="large" />
      </Absolute>
    </>
  );
};
