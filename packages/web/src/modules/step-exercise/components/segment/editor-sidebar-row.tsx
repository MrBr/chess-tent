import React from 'react';
import { components, ui } from '@application';
import { ExerciseSegments } from '@types';
import styled from '@emotion/styled';
import { useUpdateExerciseStateProp } from '../../hooks';
import { InferUpdateStep, SegmentsProps } from './types';

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

const EditorSidebarRow = <T extends SegmentsProps>({
  activeSegment,
  segment,
  updateStep,
  step,
  placeholder,
}: InferUpdateStep<
  T,
  {
    activeSegment: keyof ExerciseSegments;
    segment: keyof ExerciseSegments;
    placeholder: string;
  }
>) => {
  const text = step.state[segment]?.text;
  const updateActiveSegment = useUpdateExerciseStateProp(
    updateStep,
    step,
    'activeSegment',
  );
  const updateSegmentText = useUpdateExerciseStateProp(updateStep, step, [
    segment,
    'text',
  ]);

  return (
    <Row
      noGutters
      onClick={() => updateActiveSegment(segment)}
      className="position-relative"
    >
      {activeSegment === segment && <ActiveSegmentMark />}
      <LessonToolboxText
        defaultText={text}
        placeholder={placeholder}
        onChange={updateSegmentText}
      />
    </Row>
  );
};

export default EditorSidebarRow;
