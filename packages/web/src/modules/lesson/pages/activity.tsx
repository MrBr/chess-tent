import React, { useEffect } from 'react';
import { hooks, state, socket, ui } from '@application';
import { LessonActivity } from '@types';
import { isLesson } from '@chess-tent/models';
import Activity from '../components/activity';

const { useParams, useSelector, useHistory } = hooks;
const { Absolute, Icon } = ui;
const {
  selectors: { activitySelector },
} = state;

export default () => {
  const { activityId } = useParams();
  const activity = useSelector(activitySelector(activityId)) as LessonActivity;
  const history = useHistory();

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

  // if (activityResponseError) {
  //   return <>Couldn't load activity</>;
  // }

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
