import React from 'react';
import { components, hooks, ui } from '@application';
import { isLesson, LessonActivity, TYPE_ACTIVITY } from '@chess-tent/models';
import Activity from '../components/activity';
import ActivitySettings from '../components/activity-settings';
import TrainingComplete from '../components/training-complete';
import { isLessonActivity } from '../service';

const { useParams, useActivity, usePrompt } = hooks;
const { Breadcrumbs, Col, Button } = ui;
const { Page, Header, ConferencingProvider } = components;

const PageActivity = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const { value: activity, meta } = useActivity<LessonActivity>(activityId);

  const [activitySettingsModal, promptActivitySettings] = usePrompt(close => (
    <ActivitySettings close={close} activity={activity} />
  ));

  const [activityCompleteModal, promptComplete] = usePrompt(close => (
    <TrainingComplete
      close={close}
      allowNew={!isLessonActivity(activity as LessonActivity)}
      activity={activity as LessonActivity}
    />
  ));
  const { loading, loaded } = meta;

  if (loaded && activity === null) {
    return <>Couldn't load activity</>;
  }

  if (loading || !activity) {
    // TODO - render loader
    return null;
  }

  if (!isLesson(activity.subject)) {
    return <>Error - playground subject miss-match</>;
  }

  const pageHeader = (
    <Header className="border-bottom">
      <Col>
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Dashboard</Breadcrumbs.Item>
          <Breadcrumbs.Item>{activity.title || 'Untitled'}</Breadcrumbs.Item>
        </Breadcrumbs>
      </Col>
      <Col>
        <ConferencingProvider room={`${TYPE_ACTIVITY}-${activity.id}`} />
      </Col>
      <Col className="col-auto">
        <Button variant="ghost" size="small" onClick={promptActivitySettings}>
          Settings
        </Button>
      </Col>
      <Col className="col-auto">
        <Button variant="secondary" size="small" onClick={promptComplete}>
          Complete
        </Button>
      </Col>
    </Header>
  );
  return (
    <Page header={pageHeader}>
      {activityCompleteModal}
      {activitySettingsModal}
      <Activity activity={activity} />
    </Page>
  );
};

export default PageActivity;
