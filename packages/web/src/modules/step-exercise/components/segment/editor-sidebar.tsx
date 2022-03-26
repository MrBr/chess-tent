import React from 'react';
import { components, ui } from '@application';
import { ExerciseSegmentKeys, ExerciseSteps } from '@types';
import styled from '@emotion/styled';
import { useUpdateExerciseActiveSegment } from '../../hooks';
import { SegmentToolboxProps } from '../../types';
import { getSegmentKey } from '../../service';

const { Row } = ui;
const { LessonToolboxText } = components;

const ActiveSegmentMark = styled.span({
  borderRadius: '50%',
  background: '#F44D24',
  display: 'inline-block',
  position: 'absolute',
  top: 7,
  left: -15,
  width: 7,
  height: 7,
});

const Placeholders: Record<ExerciseSegmentKeys, string> = {
  task: 'Write task...',
  explanation: 'Write explanation...',
  hint: 'Write hint...',
};

const EditorSidebar = <T extends ExerciseSteps, K extends ExerciseSegmentKeys>({
  segment,
  updateSegment,
  step,
  placeholder,
  children,
  updateStep,
  ...props
}: SegmentToolboxProps<T, K>) => {
  const { activeSegment } = step.state;
  const currentSegmentKey = getSegmentKey(step, segment);
  const text = segment.text;
  const updateActiveSegment = useUpdateExerciseActiveSegment(updateStep, step);
  const updateText = (text: string) =>
    updateSegment({ text } as Partial<T['state'][K]>);

  // NOTE! Passing props for the OverlayTrigger (so that it can trigger tooltip)
  return (
    <Row
      noGutters
      onClick={() => updateActiveSegment(currentSegmentKey)}
      className="position-relative flex-column"
      {...props}
    >
      {activeSegment === currentSegmentKey && <ActiveSegmentMark />}
      <LessonToolboxText
        text={text}
        placeholder={placeholder || Placeholders[currentSegmentKey]}
        onChange={updateText}
      />
      {children}
    </Row>
  );
};

export default EditorSidebar;
