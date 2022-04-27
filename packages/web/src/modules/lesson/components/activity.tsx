import React from 'react';
import { ActivityComponent, Steps } from '@types';
import { hooks, requests } from '@application';
import {
  getChildStep,
  getLessonChapter,
  LessonActivity,
  getLessonActivityUserActiveBoardState,
  Chapter,
} from '@chess-tent/models';
import ActivityRenderer from './activity-renderer';
import {
  ActivityRendererStepCard,
  ActivityRendererStepBoard,
} from './activity-renderer-step';
import {
  ActivityRendererAnalysisBoard,
  ActivityRendererAnalysisCard,
} from './activity-renderer-analysis';
import { importLessonActivityChapters } from '../service';

const { useDiffUpdates, useApi, useDispatchService, useActiveUserRecord } =
  hooks;

const LESSON_MODULES = {
  boards: [ActivityRendererStepBoard, ActivityRendererAnalysisBoard],
  cards: [ActivityRendererStepCard, ActivityRendererAnalysisCard],
};

const EMPTY_LESSON_MODULES = {
  boards: [ActivityRendererAnalysisBoard],
  cards: [ActivityRendererAnalysisCard],
};

const Activity: ActivityComponent<LessonActivity> = props => {
  const { value: user } = useActiveUserRecord();
  const { activity } = props;
  const lesson = props.activity.subject;
  const activeBoardState = getLessonActivityUserActiveBoardState(
    activity,
    user.id,
  );
  const { activeChapterId, activeStepId } = activeBoardState;
  const activeChapter = activeChapterId
    ? getLessonChapter(lesson, activeChapterId)
    : null;
  const activeStep = activeChapter
    ? (getChildStep(activeChapter, activeStepId) as Steps)
    : null;
  const activeStepActivityState = activeBoardState[activeStepId];

  const dispatchService = useDispatchService();
  const { fetch: saveActivity } = useApi(requests.activityUpdate);
  const importChapters = (chapters: Chapter[]) =>
    dispatchService(importLessonActivityChapters)(activity, chapters);
  useDiffUpdates(
    props.activity,
    updates => {
      saveActivity(props.activity.id, updates);
    },
    2000,
  );

  const isEmptyLesson = !activeChapter || !activeStep;

  if (!activeStepActivityState) {
    throw new Error('Unknown active step activity state');
  }

  if (!activeBoardState) {
    throw new Error('Unknown active board state');
  }

  if (isEmptyLesson) {
    return (
      <ActivityRenderer
        activity={props.activity}
        lesson={lesson}
        analysis={activeStepActivityState.analysis}
        step={undefined}
        chapter={undefined}
        updateActivity={dispatchService}
        activityStepState={activeStepActivityState}
        boardState={activeBoardState}
        boards={EMPTY_LESSON_MODULES.boards}
        cards={EMPTY_LESSON_MODULES.cards}
        importChapters={importChapters}
      />
    );
  }

  return (
    <ActivityRenderer
      activity={props.activity}
      lesson={lesson}
      analysis={activeStepActivityState.analysis}
      step={activeStep}
      chapter={activeChapter}
      updateActivity={dispatchService}
      activityStepState={activeStepActivityState}
      boardState={activeBoardState}
      boards={LESSON_MODULES.boards}
      cards={LESSON_MODULES.cards}
    />
  );
};

export default Activity;
