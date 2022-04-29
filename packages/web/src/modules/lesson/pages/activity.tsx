import React from 'react';
import { components, hooks, ui } from '@application';
import { isLesson, LessonActivity, TYPE_ACTIVITY } from '@chess-tent/models';
import Activity from '../components/activity';

const { useParams, useActivity } = hooks;
const { Breadcrumbs, Col } = ui;
const { Page, Header, ConferencingProvider } = components;

const PageActivity = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const { value: activity, meta } = useActivity<LessonActivity>(
    activityId as string,
  );
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
    </Header>
  );
  return (
    <Page header={pageHeader}>
      <Activity activity={activity} />
    </Page>
  );
};

export default PageActivity;
