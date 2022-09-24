import React from 'react';
import { components, hooks, requests, ui } from '@application';
import { ApiStatus } from '@types';
import { isLesson, LessonActivity, TYPE_ACTIVITY } from '@chess-tent/models';
import { isMobile } from 'react-device-detect';
import Activity from '../components/activity';
import ActivitySettingsCoach from '../components/activity-settings-coach';
import ActivitySettingsStudent from '../components/activity-settings-student';
import TrainingComplete from '../components/training-complete';
import { isCoach, isLessonActivity, isOwner, isStudent } from '../service';

const {
  useDiffUpdates,
  useApi,
  useParams,
  useActivity,
  usePrompt,
  useActiveUserRecord,
  useApiStatus,
} = hooks;

const { Breadcrumbs, Col, Button } = ui;
const { Page, Header, ConferencingProvider } = components;

const PageActivity = () => {
  const { value: user } = useActiveUserRecord();
  const { activityId } = useParams<{ activityId: string }>();
  const {
    value: activity,
    meta,
    applyPatch,
  } = useActivity<LessonActivity>(activityId);
  const activityUpdateApiState = useApi(requests.activityUpdate);
  const [activityStatus, setActivityStatus] = useApiStatus(
    activity,
    activityUpdateApiState,
  );

  useDiffUpdates(
    activity,
    updates => {
      if (updates.length === 0) {
        setActivityStatus(ApiStatus.SAVED);
        return;
      }
      activityUpdateApiState.fetch((activity as LessonActivity).id, updates);
    },
    2000,
  );

  const [activitySettingsModal, promptActivitySettings] = usePrompt(close =>
    isStudent(activity as LessonActivity, user) ? (
      <ActivitySettingsStudent
        close={close}
        activity={activity}
        status={activityStatus}
      />
    ) : (
      <ActivitySettingsCoach
        close={close}
        activity={activity}
        status={activityStatus}
        save={patch => {
          applyPatch(draft => {
            if (!draft) {
              return;
            }
            Object.assign(draft, patch);
          });
        }}
      />
    ),
  );

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

  const canComplete = isCoach(activity, user) || isOwner(activity, user);

  const pageHeader = (
    <Header className="border-bottom">
      <Col>
        <Breadcrumbs>
          {isMobile ? (
            <Breadcrumbs.Item href="/">Back</Breadcrumbs.Item>
          ) : (
            <Breadcrumbs.Item>{activity.title || 'Untitled'}</Breadcrumbs.Item>
          )}
        </Breadcrumbs>
      </Col>
      <Col>
        <ConferencingProvider room={`${TYPE_ACTIVITY}-${activity.id}`} />
      </Col>
      <Col className="col-auto">
        <Button
          variant="ghost"
          size="extra-small"
          onClick={promptActivitySettings}
        >
          Settings
        </Button>
      </Col>
      {canComplete && (
        <Col className="col-auto">
          <Button
            variant="secondary"
            size="extra-small"
            onClick={promptComplete}
          >
            Complete
          </Button>
        </Col>
      )}
    </Header>
  );
  return (
    <Page header={pageHeader} tabbar={<></>}>
      {activityCompleteModal}
      {activitySettingsModal}
      <Activity activity={activity} />
    </Page>
  );
};

export default PageActivity;
