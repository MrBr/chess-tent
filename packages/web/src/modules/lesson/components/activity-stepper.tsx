import React, { useState } from 'react';
import { Chapter, LessonActivityBoardState } from '@chess-tent/models';
import { AppStep } from '@types';
import { components, hooks, ui } from '@application';
import styled from '@chess-tent/styled-props';
import { isMobile } from 'react-device-detect';

import ActivityStepperEmpty from './activity-stepper-empty';
import ActivityStepperSteps from './activity-stepper-steps';
import ChaptersImport from './chapters-import';

const { LessonChapters, MobilePortal, Layout, Header } = components;
const { Button, Col, Absolute } = ui;
const { usePrompt } = hooks;

export interface ActivityStepperProps {
  boardState: LessonActivityBoardState;
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  activeChapter: Chapter | undefined;
  chapters: Chapter[];
  onChapterImport?: (chapter: Chapter[]) => void;
  onChapterRemove?: (chapter: Chapter) => void;
  onChapterChange?: (chapter: Chapter) => void;
  onChapterMove?: (up?: boolean) => void;
}

const ActivityStepper = styled((props: ActivityStepperProps) => {
  const {
    step,
    className,
    onStepClick,
    activeChapter,
    chapters,
    onChapterImport,
    onChapterChange,
    onChapterRemove,
    onChapterMove,
    boardState,
  } = props;
  const { activeStepId } = boardState;
  const [showStepper, setShowStepper] = useState<boolean>(!isMobile);
  const [chapterImportModal, promptChapterImport] = usePrompt(close => (
    <ChaptersImport close={close} onImport={onChapterImport as () => void} />
  ));
  const stepClickHandler = (step: AppStep) => {
    onStepClick(step);
    isMobile && showStepper && setShowStepper(false);
  };

  if (!onChapterImport && !activeChapter) {
    // This is the case of an initial activity without chapters.
    // If there is no chapter and no way to add new chapters
    // Stepper is not needed at all
    return null;
  }

  if (!activeChapter) {
    return (
      <ActivityStepperEmpty
        onChapterImport={
          onChapterImport as Required<ActivityStepperProps>['onChapterImport']
        }
      />
    );
  }

  const steps = (step || activeChapter).state.steps;

  const content = (
    <>
      {chapterImportModal}
      <div className={className}>
        <div className="border-bottom p-3">
          <LessonChapters
            editable={false}
            chapters={chapters}
            activeChapter={activeChapter}
            onImport={onChapterImport && promptChapterImport}
            onChange={onChapterChange}
            onRemove={onChapterRemove}
            onMove={onChapterMove}
          />
        </div>
        <div className="h-100 border-bottom pt-3 overflow-y-auto">
          <ActivityStepperSteps
            boardState={boardState}
            activeStepId={activeStepId}
            steps={steps}
            step={step}
            onStepClick={stepClickHandler}
          />
        </div>
      </div>
    </>
  );

  if (isMobile) {
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
      <Absolute right={20} top={-10}>
        <Button
          size="extra-small"
          onClick={() => setShowStepper(true)}
          variant="text"
          className="mt-3 me-3"
        >
          Steps
        </Button>
      </Absolute>
    );
  }

  return content;
}).css`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--light-color);

  & > & {
    margin-left: 10px;
  }
  
`;

export default ActivityStepper;
