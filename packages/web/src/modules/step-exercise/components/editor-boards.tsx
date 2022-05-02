import React from 'react';
import { ui } from '@application';
import { ExerciseSegmentKeys, ExerciseSteps } from '@types';
import { useUpdateExerciseActiveSegment } from '../hooks';

const { ToggleButton, ButtonGroup } = ui;

const EditorBoards = ({
  activeSegment,
  updateStep,
  step,
}: {
  updateStep: (step: ExerciseSteps) => void;
  step: ExerciseSteps;
  activeSegment: ExerciseSegmentKeys;
}) => {
  const updateActiveSegment = useUpdateExerciseActiveSegment(updateStep, step);

  return (
    <ButtonGroup>
      <ToggleButton
        variant="tertiary"
        checked={activeSegment === 'task'}
        onClick={() => updateActiveSegment('task')}
        size="small"
      >
        Task
      </ToggleButton>
      <ToggleButton
        variant="tertiary"
        checked={activeSegment === 'explanation'}
        onClick={() => updateActiveSegment('explanation')}
        size="small"
      >
        Explanation
      </ToggleButton>
      <ToggleButton
        variant="tertiary"
        checked={activeSegment === 'hint'}
        onClick={() => updateActiveSegment('hint')}
        size="small"
      >
        Hint
      </ToggleButton>
    </ButtonGroup>
  );
};

export default EditorBoards;
