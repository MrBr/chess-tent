import React from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';

const { Text, Icon } = ui;

const ActivityStepperChaptersPlaceholder = styled(
  ({
    onChapterImport,
    className,
  }: {
    onChapterImport: () => void;
    className?: string;
  }) => {
    return (
      <div className="d-flex flex-column">
        <div className={className}>
          <div className="cta-add-chapters" onClick={onChapterImport}>
            <Icon type="document" />
            <Text fontSize="extra-small" weight={400}>
              Add chapters
            </Text>
          </div>
        </div>
      </div>
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

export default ActivityStepperChaptersPlaceholder;
