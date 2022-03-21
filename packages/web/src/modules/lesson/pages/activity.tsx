import React from 'react';
import { hooks, ui } from '@application';
import { isLesson, LessonActivity } from '@chess-tent/models';
import Activity from '../components/activity';

const { useParams, useActivity, useHistory } = hooks;
const { Absolute, Icon } = ui;

const PageActivity = () => {
  const history = useHistory();
  const { activityId } = useParams();
  const { value: activity, meta } = useActivity<LessonActivity>(activityId);
  const { loading, loaded } = meta;

  if (loaded && activity === null) {
    return <>Couldn't load activity</>;
  }

  if (loading || !activity) {
    // TODO - render loader
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

export default PageActivity;
