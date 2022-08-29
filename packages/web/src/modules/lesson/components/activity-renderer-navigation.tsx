import React from 'react';
import {
  ActivityRendererModuleBoard,
  ActivityRendererModuleProps,
  ActivityStepMode,
  Steps,
} from '@types';
import { components, ui } from '@application';
import { updateActivityStepState } from '@chess-tent/models';

const { LessonPlaygroundCard } = components;
const { ToggleButton, ButtonGroup } = ui;

export class ActivityRendererNavigationCard<
  T extends Steps | undefined,
> extends React.Component<ActivityRendererModuleProps<T>> {
  onBoardChange = (mode: ActivityStepMode) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      mode,
    });
  };

  renderActiveBoardNavigation() {
    const { stepActivityState, boards } = this.props;
    const { Navigation } = boards.find(
      ({ mode }) => stepActivityState.mode === mode,
    ) as ActivityRendererModuleBoard<T>;

    return <Navigation {...this.props} />;
  }

  render() {
    const { boards, activityStepState } = this.props;
    return (
      <LessonPlaygroundCard stretch>
        <ButtonGroup className="mb-3">
          {boards.map((Board, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="tertiary"
              size="small"
              name="radio"
              value={Board.mode}
              checked={activityStepState.mode === Board.mode}
              onChange={() => this.onBoardChange(Board.mode)}
            >
              {Board.mode}
            </ToggleButton>
          ))}
        </ButtonGroup>
        {this.renderActiveBoardNavigation()}
      </LessonPlaygroundCard>
    );
  }
}
