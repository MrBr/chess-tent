import React, { useCallback, useState, useEffect } from 'react';
import { components, hooks, state, ui } from '@application';
import {
  Chapter,
  getChildStep,
  Lesson,
  Step,
  LessonActivity,
  getLessonChapter,
  updateActivityStepState,
  getLessonActivityUserActiveBoardState,
  applyPatches,
} from '@chess-tent/models';
import { Steps } from '@types';
import ActivityRenderer from './activity-renderer';
import { createActivityStepState, createLessonActivity } from '../service';
import { ActivityRendererStepCard } from './activity-renderer-step';
import { ActivityRendererAnalysisEngineCard } from './activity-renderer-engine';
import { ActivityRendererNavigationCard } from './activity-renderer-navigation';
import { ActivityRendererStepper } from './activity-renderer-stepper';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;
const { Modal, Breadcrumbs, Col, Button, Badge } = ui;
const { Layout, Header, Menu } = components;
const {
  actions: { serviceAction },
} = state;

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
        [step.id]: createActivityStepState(),
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
        createActivityStepState(),
      );
      updatePreviewActivity(updatedActivity);
    }
  }, [activityStepState, activity, activityBoardState]);

  const updateActivity = useCallback(
    service =>
      (...args: Parameters<typeof service>) => {
        const {
          meta: { patch },
        } = serviceAction(service)(...args);

        if (!patch?.next) {
          throw new Error('Updating without patch. That`s not an option. ');
        }

        updatePreviewActivity(latestActivity =>
          applyPatches(latestActivity, patch.next),
        );
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
      cards={[ActivityRendererStepCard]}
      navigation={[ActivityRendererNavigationCard]}
      actions={[ActivityRendererAnalysisEngineCard]}
      sidebar={[ActivityRendererStepper]}
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
          <Breadcrumbs.Item href="/" className="d-none d-sm-inline-block">
            Dashboard
          </Breadcrumbs.Item>
          <Breadcrumbs.Item
            onClick={close}
            className="d-none d-sm-inline-block"
          >
            Template
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="d-none d-sm-inline-block">
            Preview
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </Col>
      <Col className="text-center">
        <Badge>Previewing as a student</Badge>
      </Col>
      <Col className="col-auto ">
        <Button onClick={close} variant="tertiary" size="extra-small">
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
