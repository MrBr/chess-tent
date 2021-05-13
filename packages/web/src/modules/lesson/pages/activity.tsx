import React, { useEffect } from 'react';
import { hooks, socket, ui } from '@application';
import { LessonActivity } from '@types';
import { isLesson, TYPE_ACTIVITY } from '@chess-tent/models';
import Activity from '../components/activity';

const { useParams, useRecord, useHistory } = hooks;
const { Absolute, Icon } = ui;

export default () => {
  const { activityId } = useParams();
  const [activity, , , meta] = useRecord<LessonActivity>(
    `${TYPE_ACTIVITY}-${activityId}`,
    TYPE_ACTIVITY,
    {
      type: TYPE_ACTIVITY,
      loaded: false,
      loading: true,
    },
  );
  const history = useHistory();

  const { loading, loaded } = meta;

  console.log('activity', activity);
  console.log('meta', meta);

  useEffect(() => {
    socket.subscribe(`activity-${activityId}`);

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      socket.unsubscribe(`activity-${activityId}`);
    };
  }, [activityId]);

  if (loaded && activity === null) {
    return <>Couldn't load activity</>;
  }

  if (loading || !activity) {
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
