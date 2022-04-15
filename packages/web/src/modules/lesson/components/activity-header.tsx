import React, { ComponentType } from 'react';
import { ui } from '@application';
import { ActivityRendererProps, ActivityStepMode, Steps } from '@types';

const { ToggleButton, Container, ButtonGroup } = ui;

interface ActivityHeaderProps {
  boards: ActivityRendererProps<Steps | undefined>['boards'];
  activeMode: ActivityStepMode;
  onChange?: (mode: ActivityStepMode) => void;
}

const ActivityHeader: ComponentType<ActivityHeaderProps> = ({
  boards,
  activeMode,
  onChange,
}) => (
  <>
    <Container className="mb-4 p-0">
      <ButtonGroup className="mb-2">
        {boards.map((Board, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="secondary"
            name="radio"
            value={Board.mode}
            checked={activeMode === Board.mode}
            onChange={() => onChange && onChange(Board.mode)}
          >
            {Board.mode}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Container>
  </>
);

export default ActivityHeader;
