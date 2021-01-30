import React, { ReactNode } from 'react';
import { components, ui } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';
import { SegmentsProps } from './types';

const { Row } = ui;
const { LessonToolboxText } = components;

const SegmentSidebar = <T extends SegmentsProps>({
  children,
  step,
  updateStep,
}: T extends SegmentsProps<infer S>
  ? T & { updateStep: (step: S) => void; children?: ReactNode }
  : never) => {
  const { task, explanation, hint } = step.state;
  const updateTaskText = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'text',
  ]);
  const updateExplanationText = useUpdateExerciseStateProp(updateStep, step, [
    'explanation',
    'text',
  ]);
  const updateHintText = useUpdateExerciseStateProp(updateStep, step, [
    'hint',
    'text',
  ]);
  const updateActiveSegment = useUpdateExerciseStateProp(
    updateStep,
    step,
    'activeSegment',
  );

  return (
    <>
      <Row noGutters onClick={() => updateActiveSegment('task')}>
        <LessonToolboxText
          defaultText={task.text}
          placeholder="Task description"
          onChange={updateTaskText}
        />
      </Row>
      <Row noGutters onClick={() => updateActiveSegment('task')}>
        {children}
      </Row>
      <Row noGutters onClick={() => updateActiveSegment('explanation')}>
        <LessonToolboxText
          defaultText={explanation?.text}
          placeholder="Explanation"
          onChange={updateExplanationText}
        />
      </Row>
      <Row noGutters onClick={() => updateActiveSegment('hint')}>
        <LessonToolboxText
          defaultText={hint?.text}
          placeholder="Hint"
          onChange={updateHintText}
        />
      </Row>
    </>
  );
};

export default SegmentSidebar;
