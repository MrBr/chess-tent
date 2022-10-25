import React from 'react';
import { ActivityComponent, Steps } from '@types';
import { hooks } from '@application';
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
import { ActivityRendererAnalysisBoard } from './activity-renderer-analysis';
import { importLessonActivityChapters, isLessonActivity } from '../service';
import { ActivityRendererAnalysisEngineCard } from './activity-renderer-engine';
import { ActivityRendererNavigationCard } from './activity-renderer-navigation';
import { ActivityRendererCommentsCard } from './activity-renderer-comments';
import { ActivityRendererStepper } from './activity-renderer-stepper';
import { ActivityRendererConference } from './activity-renderer-conference';

const { useDispatchService, useActiveUserRecord } = hooks;

const LESSON_MODULES = {
  boards: [ActivityRendererStepBoard, ActivityRendererAnalysisBoard],
  navigation: [ActivityRendererNavigationCard],
  actions: [ActivityRendererAnalysisEngineCard],
  cards: [ActivityRendererStepCard, ActivityRendererCommentsCard],
  sidebar: [ActivityRendererStepper, ActivityRendererConference],
};

const EMPTY_LESSON_MODULES = {
  boards: [ActivityRendererAnalysisBoard],
  navigation: [ActivityRendererNavigationCard],
  actions: [ActivityRendererAnalysisEngineCard],
  cards: [ActivityRendererCommentsCard],
  sidebar: [ActivityRendererStepper, ActivityRendererConference],
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
  const importChapters = (chapters: Chapter[]) =>
    dispatchService(importLessonActivityChapters)(activity, chapters);

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
        actions={EMPTY_LESSON_MODULES.actions}
        navigation={EMPTY_LESSON_MODULES.navigation}
        sidebar={EMPTY_LESSON_MODULES.sidebar}
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
      actions={LESSON_MODULES.actions}
      navigation={LESSON_MODULES.navigation}
      sidebar={LESSON_MODULES.sidebar}
      importChapters={isLessonActivity(activity) ? undefined : importChapters}
    />
  );
};

export default Activity;
