import React from 'react';
import { Chapter } from '@chess-tent/models';
import { AppStep } from '@types';
import { hooks, ui, utils } from '@application';
import styled from '@chess-tent/styled-props';

import ChaptersImport from './chapters-import';
import ActivityStepperNav from './activity-stepper-nav';

const { Text, Icon } = ui;
const { usePrompt } = hooks;
const { noop } = utils;

interface ActivityStepperProps {
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  activeChapter: Chapter | undefined;
  chapters: Chapter[];
  onChapterImport?: (chapter: Chapter[]) => void;
}

const ActivityStepperEmpty = styled(
  ({
    onChapterImport,
    className,
  }: {
    onChapterImport: Required<ActivityStepperProps>['onChapterImport'];
    className?: string;
  }) => {
    const [chapterImportModal, promptChapterImport] = usePrompt(close => (
      <ChaptersImport
        close={close}
        // Should be called exclusively if the import function exists
        onImport={onChapterImport}
      />
    ));
    return (
      <>
        {chapterImportModal}
        <div className={className}>
          <Text fontSize="small">Chapters ?</Text>
          <div className="cta-add-chapters" onClick={promptChapterImport}>
            <Icon type="document" />
            <Text fontSize="extra-small" weight={400}>
              Add chapters
            </Text>
          </div>
        </div>
        <ActivityStepperNav prev={noop} next={noop} className="border-top" />
      </>
    );
  },
).css`
  padding: 16px;
  height: 100%;
  background-color: var(--bg-color);

  .cta-add-chapters {
    :hover {
      border-color: var(--black-color);
    }

    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 120px;
    border-radius: 8px;
    border: 2px dashed var(--grey-600-color);
    align-items: center;
    justify-content: center;
    background-color: var(--light-color);
  }
`;

export default ActivityStepperEmpty;
