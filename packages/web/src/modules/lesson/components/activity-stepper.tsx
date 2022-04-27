import React from 'react';
import { Chapter } from '@chess-tent/models';
import { AppStep } from '@types';
import { components } from '@application';
import styled from '@chess-tent/styled-props';

import ActivityStepperEmpty from './activity-stepper-empty';
import ActivityStepperNav from './activity-stepper-nav';
import ActivityStepperSteps from './activity-stepper-steps';

const { LessonChapters } = components;

export interface ActivityStepperProps {
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  activeChapter: Chapter | undefined;
  chapters: Chapter[];
  onChapterImport?: (chapter: Chapter[]) => void;
  onChapterRemove?: (chapter: Chapter) => void;
  onChapterChange?: (chapter: Chapter) => void;
  next: () => void;
  prev: () => void;
}

const ActivityStepper = styled((props: ActivityStepperProps) => {
  const {
    step,
    className,
    onStepClick,
    activeChapter,
    chapters,
    onChapterImport,
    next,
    prev,
    onChapterChange,
    onChapterRemove,
  } = props;

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
      <div className={className}>
        <div className="border-bottom p-3">
          <LessonChapters
            editable={false}
            chapters={chapters}
            activeChapter={activeChapter}
            onChapterImport={onChapterImport}
            onChange={onChapterChange}
            onRemove={onChapterRemove}
          />
        </div>
        <div className="h-100 border-bottom p-3">
          <ActivityStepperSteps
            steps={steps}
            step={step}
            onStepClick={onStepClick}
          />
        </div>
        <ActivityStepperNav prev={prev} next={next} />
      </div>
    </>
  );
}).css`
  height: 100%;
  background-color: var(--light-color);

  & > & {
    margin-left: 10px;
  }
  
`;

export default ActivityStepper;
