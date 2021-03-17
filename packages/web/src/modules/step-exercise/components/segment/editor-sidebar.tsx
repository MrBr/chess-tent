import React, { ReactNode } from 'react';
import { ui } from '@application';
import { useUpdateExerciseStateProp } from '../../hooks';
import { InferUpdateStep, SegmentsProps } from './types';
import EditorSidebarRow from './editor-sidebar-row';

const { Row } = ui;

const SegmentSidebar = <T extends SegmentsProps>({
  children,
  step,
  updateStep,
}: InferUpdateStep<T, { children?: ReactNode }>) => {
  const { activeSegment } = step.state;
  const updateActiveSegment = useUpdateExerciseStateProp(
    updateStep,
    step,
    'activeSegment',
  );

  return (
    <>
      <EditorSidebarRow
        updateStep={updateStep}
        step={step}
        segment="task"
        activeSegment={activeSegment}
        placeholder="Task description"
      />
      <Row noGutters onClick={() => updateActiveSegment('task')}>
        {children}
      </Row>
      <EditorSidebarRow
        updateStep={updateStep}
        step={step}
        segment="explanation"
        activeSegment={activeSegment}
        placeholder="Explanation"
      />
      <EditorSidebarRow
        updateStep={updateStep}
        step={step}
        segment="hint"
        activeSegment={activeSegment}
        placeholder="Hint"
      />
    </>
  );
};

export default SegmentSidebar;
