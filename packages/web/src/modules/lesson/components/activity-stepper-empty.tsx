import React from 'react';
import { Chapter } from '@chess-tent/models';
import { AppStep } from '@types';
import { hooks, ui, utils } from '@application';
import styled from '@chess-tent/styled-props';

import ChaptersImport from './chapters-import';

const { Text, Icon } = ui;
const { usePrompt } = hooks;

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
        <div className="d-flex flex-column h-100">
          <div className={className}>
            <div className="cta-add-chapters" onClick={promptChapterImport}>
              <Icon type="document" />
              <Text fontSize="extra-small" weight={400}>
                Add chapters
              </Text>
            </div>
            <Text fontSize="extra-small" align="center" className="mt-3">
              Use chapters from templates to bootstrap the training
            </Text>
          </div>
        </div>
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
