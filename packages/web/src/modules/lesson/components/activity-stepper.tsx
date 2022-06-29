import React from 'react';
import { Chapter, LessonActivityBoardState } from '@chess-tent/models';
import { AppStep } from '@types';
import { components, hooks } from '@application';
import styled from '@chess-tent/styled-props';

import ActivityStepperEmpty from './activity-stepper-empty';
import ActivityStepperSteps from './activity-stepper-steps';
import ChaptersImport from './chapters-import';

const { LessonChapters } = components;
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
    boardState,
  } = props;
  const { activeStepId } = boardState;
  const [chapterImportModal, promptChapterImport] = usePrompt(close => (
    <ChaptersImport close={close} onImport={onChapterImport as () => void} />
  ));

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

  return (
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
          />
        </div>
        <div className="h-100 border-bottom pt-3 overflow-y-auto">
          <ActivityStepperSteps
            boardState={boardState}
            activeStepId={activeStepId}
            steps={steps}
            step={step}
            onStepClick={onStepClick}
          />
        </div>
      </div>
    </>
  );
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
