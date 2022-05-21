import React from 'react';
import { LessonActivityBoardState, Step } from '@chess-tent/models';
import { AppStep, Icons } from '@types';
import styled from '@chess-tent/styled-props';
import { ui } from '@application';

import ActivityStep from './activity-step';

interface ActivityStepperStepsProps {
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  steps: Step[];
  activeStepId?: string;
  boardState: LessonActivityBoardState;
}

const { Icon } = ui;

function getStepIcon(step: AppStep): Icons {
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

const ActivityStepperSteps = styled((props: ActivityStepperStepsProps) => {
  const { step, className, onStepClick, steps, activeStepId, boardState } =
    props;

  const activityStepState = step ? boardState[step.id] : null;
  return (
    <>
      <div className={className}>
        {step && (
          <ActivityStep
            onClick={() => onStepClick(step)}
            active={activeStepId === step.id}
            visited={activityStepState?.visited}
            completed={activityStepState?.completed}
          >
            <Icon type={getStepIcon(step)} size="extra-small" />
            {activityStepState?.analysis?.state.steps.length > 0 && (
              <Icon type="analysis" size="extra-small" />
            )}
          </ActivityStep>
        )}
        {steps.map(child => {
          return (
            <div key={child.id} className={className}>
              <ActivityStepperSteps
                {...props}
                // Override current step
                steps={child.state.steps}
                step={child as AppStep}
                onStepClick={onStepClick}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}).css`
  & > & {
    margin-left: 10px;
  }
`;

export default ActivityStepperSteps;
