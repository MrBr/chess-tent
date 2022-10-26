import React, { useState, PropsWithChildren, ReactElement } from 'react';
import { applyUpdates, Chapter, moveLessonChapter } from '@chess-tent/models';
import { ActivityRendererModuleProps, AppStep, Steps } from '@types';
import { components, hooks, ui } from '@application';
import { css } from '@chess-tent/styled-props';
import { isDesktop } from 'react-device-detect';

import ActivityStepperChaptersPlaceholder from './activity-stepper-chapters-placeholder';
import ActivityStepperSteps from './activity-stepper-steps';
import ChaptersImport from './chapters-import';
import {
  removeActivityChapter,
  updateActivityActiveChapter,
  updateActivityActiveStep,
} from '../service';
import ActivityStepperAnalysis from './activity-stepper-analysis';

const { LessonChapters, MobilePortal, Layout, Header } = components;
const { Button, Col } = ui;
const { usePrompt } = hooks;

const { className } = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--light-color);
  max-width: 100%;
  overflow: auto;

  & > & {
    margin-left: 10px;
  }
`;

export const ActivityRendererStepper = <
  T extends Steps | undefined,
  K extends Chapter | undefined = Chapter | undefined,
>(
  props: PropsWithChildren<ActivityRendererModuleProps<T, K>>,
): ReactElement<any, any> | null => {
  const {
    importChapters,
    lesson,
    chapter,
    boardState,
    updateActivity,
    activity,
  } = props;
  const areChaptersEditable = importChapters;
  const { activeStepId } = boardState;
  const [showStepper, setShowStepper] = useState<boolean>(false);
  const [chapterImportModal, promptChapterImport] = usePrompt(close => (
    <ChaptersImport close={close} onImport={importChapters as () => void} />
  ));
  const updateActiveStep = (step: AppStep) => {
    updateActivity(updateActivityActiveStep)(
      activity,
      boardState,
      step as Steps,
    );
  };

  const chapterChangeHandler = (chapter: Chapter) => {
    updateActivity(updateActivityActiveChapter)(activity, boardState, chapter);
  };

  const chapterMoveHandler = (up?: boolean) => {
    updateActivity(
      applyUpdates(activity)(draft => {
        moveLessonChapter(draft.subject, chapter as Chapter, up);
      }),
    )();
  };

  const removeChapterHandler = (chapter: Chapter) => {
    updateActivity(removeActivityChapter)(activity, boardState, chapter);
  };
  const stepClickHandler = (step: AppStep) => {
    updateActiveStep(step);
    isDesktop && showStepper && setShowStepper(false);
  };

  if (!areChaptersEditable && !chapter) {
    // This is the case of an initial activity without chapters.
    // If there is no chapter and no way to add new chapters
    // Stepper is not needed at all
    return null;
  }

  let content;
  if (!chapter) {
    const activityStepState = boardState[activeStepId];
    content = (
      <>
        {chapterImportModal}
        <ActivityStepperChaptersPlaceholder
          onChapterImport={promptChapterImport}
        />
        <div className="h-100 pt-4 overflow-y-auto px-3">
          <ActivityStepperAnalysis
            analysis={activityStepState.analysis}
            activity={activity}
            updateActivity={updateActivity}
            boardState={boardState}
            activityStepState={activityStepState}
            nextStep={props.nextStep}
            prevStep={props.prevStep}
          />
        </div>
      </>
    );
  } else {
    const steps = chapter.state.steps;

    content = (
      <>
        {chapterImportModal}
        <div className={className}>
          <div className="border-bottom p-3 pb-1">
            <LessonChapters
              editable={false}
              chapters={lesson.state.chapters}
              activeChapter={chapter}
              onImport={areChaptersEditable && promptChapterImport}
              onChange={chapterChangeHandler}
              onRemove={areChaptersEditable && removeChapterHandler}
              onMove={areChaptersEditable && chapterMoveHandler}
            />
          </div>
          <div className="h-100 pt-3 overflow-y-auto px-4">
            <ActivityStepperSteps
              boardState={boardState}
              activeStepId={activeStepId}
              steps={steps}
              onStepClick={stepClickHandler}
            >
              {stepperStep => {
                const activityStepState = boardState[stepperStep.id];
                const analysis = activityStepState?.analysis;

                if (!activityStepState || !analysis?.state.steps.length) {
                  return null;
                }
                return (
                  <div className="p-2 w-100">
                    <ActivityStepperAnalysis
                      analysis={analysis}
                      activity={activity}
                      updateActivity={updateActivity}
                      step={stepperStep as Steps}
                      boardState={boardState}
                      activityStepState={activityStepState}
                      nextStep={props.nextStep}
                      prevStep={props.prevStep}
                    />
                  </div>
                );
              }}
            </ActivityStepperSteps>
          </div>
        </div>
      </>
    );
  }

  if (!isDesktop) {
    return showStepper ? (
      <MobilePortal>
        <Layout
          header={
            <Header>
              <Col className="col-auto">
                <Button
                  size="extra-small"
                  onClick={() => setShowStepper(false)}
                  variant="tertiary"
                >
                  Close
                </Button>
              </Col>
            </Header>
          }
        >
          {content}
        </Layout>
      </MobilePortal>
    ) : (
      <Button
        size="extra-small"
        onClick={() => setShowStepper(true)}
        variant="text"
        className="mt-3 me-3"
      >
        Steps
      </Button>
    );
  }
  return content;
};
