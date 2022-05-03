import React, { useCallback, useState, useEffect } from 'react';
import { components, hooks, services, ui } from '@application';
import {
  Chapter,
  getChildStep,
  Lesson,
  Step,
  LessonActivity,
  getLessonChapter,
  updateActivityStepState,
  getLessonActivityUserActiveBoardState,
} from '@chess-tent/models';
import { Steps } from '@types';
import ActivityRenderer from './activity-renderer';
import { createLessonActivity } from '../service';
import {
  ActivityRendererStepBoard,
  ActivityRendererStepCard,
} from './activity-renderer-step';
import { ActivityRendererAnalysisEngineCard } from './activity-renderer-engine';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;
const { Modal, Breadcrumbs, Col, Button, Tag } = ui;
const { Layout, Header, Menu } = components;

const Preview = ({ lesson, chapter, step }: PreviewProps) => {
  const { value: user } = useActiveUserRecord();
  const [activity, updatePreviewActivity] = useState<LessonActivity>(
    createLessonActivity(
      lesson,
      user,
      {},
      {
        activeStepId: step.id,
        activeChapterId: chapter.id,
        [step.id]: services.createActivityStepState(),
      },
    ),
  );
  const activityBoardState = getLessonActivityUserActiveBoardState(
    activity,
    user.id,
  );

  const activeChapter = getLessonChapter(
    lesson,
    activityBoardState.activeChapterId as string,
  ) as Chapter;
  const activeStep = getChildStep(
    activeChapter,
    activityBoardState.activeStepId as string,
  ) as Steps;
  const activityStepState = activityBoardState[activeStep.id];

  useEffect(() => {
    if (!activityStepState) {
      const updatedActivity = updateActivityStepState(
        activity,
        activityBoardState,
        services.createActivityStepState(),
      );
      updatePreviewActivity(updatedActivity);
    }
  }, [activityStepState, activity, activityBoardState]);

  const updateActivity = useCallback(
    service =>
      (...args: Parameters<typeof service>) => {
        updatePreviewActivity(service(...args));
      },
    [updatePreviewActivity],
  );

  if (!activityStepState) {
    return null;
  }

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={activityStepState.analysis}
      step={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      activityStepState={activityStepState}
      boardState={activityBoardState}
      cards={[ActivityRendererAnalysisEngineCard, ActivityRendererStepCard]}
      boards={[ActivityRendererStepBoard]}
    />
  );
};

const PreviewModal = ({
  close,
  ...props
}: PreviewProps & { close: () => void }) => {
  const { mounted } = useComponentState();
  const header = (
    <Header className="border-bottom">
      <Col className="col-auto">
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Dashboard</Breadcrumbs.Item>
          <Breadcrumbs.Item onClick={close}>Template</Breadcrumbs.Item>
          <Breadcrumbs.Item>Preview</Breadcrumbs.Item>
        </Breadcrumbs>
      </Col>
      <Col className="text-center">
        <Tag>You're now previewing as a student</Tag>
      </Col>
      <Col className="col-auto">
        <Button onClick={close} variant="tertiary" size="small">
          Close
        </Button>
      </Col>
    </Header>
  );
  return (
    <Modal show close={close} fullScreen>
      <Layout header={header} menu={<Menu />}>
        {mounted && <Preview {...props} />}
      </Layout>
    </Modal>
  );
};

export { Preview as default, PreviewModal };
