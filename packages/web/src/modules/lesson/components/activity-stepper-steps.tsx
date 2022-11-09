import React, { ReactNode } from 'react';
import { LessonActivityBoardState, Step } from '@chess-tent/models';
import { AppStep, Icons, NotableMove, Steps } from '@types';
import styled from '@chess-tent/styled-props';
import { ui, components } from '@application';

import ActivityStep from './activity-step';

interface ActivityStepperStepsProps {
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  steps: Step[];
  activeStepId?: string;
  boardState: LessonActivityBoardState;
  children?: (step: AppStep) => ReactNode;
  hideMoves?: boolean;
  onStartAnalysing: (step: Steps) => void;
}

const { Icon, OverlayTrigger, Tooltip } = ui;
const { StepMove, StepToolbox } = components;

function getStepIconType(step: AppStep): Icons {
  switch (step.stepType) {
    case 'variation':
      return 'board';
    case 'description':
      return 'comment';
    case 'exercise':
      return 'exercise';
    case 'move':
      return 'pawn';
    default:
      throw new Error('Unknown step type');
  }
}

function getStepMove(step: Steps): NotableMove | undefined | null {
  switch (step.stepType) {
    case 'variation':
      return step.state.move;
    case 'move':
      return step.state.move;
    default:
      return undefined;
  }
}

const ActivityStepperSteps = styled((props: ActivityStepperStepsProps) => {
  const {
    step,
    className,
    onStepClick,
    steps,
    activeStepId,
    boardState,
    children,
    hideMoves,
    onStartAnalysing,
  } = props;

  const activityStepState = step ? boardState[step.id] : null;
  const stepMove = step && getStepMove(step as Steps);
  const active = activeStepId === step?.id && !boardState.analysing;

  return (
    <>
      {step && (
        <>
          <ActivityStep
            onClick={() => onStepClick(step)}
            active={active}
            visited={activityStepState?.visited}
            completed={activityStepState?.completed}
          >
            <StepToolbox active={active} containerSelector=".layout-content">
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="copy-tooltip">Start analysing position</Tooltip>
                }
              >
                <Icon
                  size="extra-small"
                  type="analysis"
                  onClick={() => onStartAnalysing(step as Steps)}
                />
              </OverlayTrigger>
            </StepToolbox>
            {stepMove ? (
              <StepMove
                move={stepMove}
                hideMoves={!activityStepState?.visited && hideMoves}
              />
            ) : (
              <Icon type={getStepIconType(step)} size="extra-small" />
            )}
          </ActivityStep>
          {children && children(step)}
        </>
      )}
      {steps.map(child => {
        const childSteps = (
          <ActivityStepperSteps
            {...props}
            // Override current step
            steps={child.state.steps}
            step={child as AppStep}
            onStepClick={onStepClick}
            key={child.id}
          />
        );

        if (child.stepType !== 'variation') {
          return childSteps;
        }

        return (
          <div key={child.id} className={className}>
            {childSteps}
          </div>
        );
      })}
    </>
  );
}).css`
  & > & {
    margin: 10px 0 10px 20px;
  }
  & > * {
    flex: 0 0 auto;
  }
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export default ActivityStepperSteps;
