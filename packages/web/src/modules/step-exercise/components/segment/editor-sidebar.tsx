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
}: SegmentToolboxProps<T, K>) => {
  const { activeSegment } = step.state;
  const currentSegmentKey = getSegmentKey(step, segment);
  const text = segment.text;
  const updateActiveSegment = useUpdateExerciseActiveSegment(updateStep, step);
  const updateText = (text: string) =>
    updateSegment({ text } as Partial<T['state'][K]>);

  return (
    <>
      <Row
        noGutters
        onClick={() => updateActiveSegment(currentSegmentKey)}
        className="position-relative flex-column"
      >
        {activeSegment === currentSegmentKey && <ActiveSegmentMark />}
        <LessonToolboxText
          defaultText={text}
          placeholder={placeholder || Placeholders[currentSegmentKey]}
          onChange={updateText}
        />
        {children}
      </Row>
    </>
  );
};

export default EditorSidebar;
