import React from 'react';
import { components, ui } from '@application';
import { ExerciseSegmentKeys, ExerciseSteps } from '@types';
import styled from '@chess-tent/styled-props';
import { useUpdateExerciseActiveSegment } from '../../hooks';
import { SegmentToolboxProps } from '../../types';
import { getSegmentKey } from '../../service';

const { Row, Card, Col } = ui;
const { LessonToolboxText } = components;

const ActiveSegmentMark = styled.span.props.active.css<{ active: boolean }>`
  ${{ omitProps: ['active'] }}

  text-transform: capitalize;
  font-size: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  vertical-align: middle;

  :first-letter {
    font-size: 14px;
  }

  &.active {
    background: var(--tertiary-color);
    color: var(--light-color);
  }
`;

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
    <Card
      onClick={() => updateActiveSegment(currentSegmentKey)}
      className="rounded ps-3 pt-2 pb-2 pe-2 position-relative flex-column mb-2 "
      {...props}
    >
      <Row className="g-0 align-items-center">
        <Col className="col-auto me-2 align-self-baseline">
          <ActiveSegmentMark active={activeSegment === currentSegmentKey}>
            {currentSegmentKey}
          </ActiveSegmentMark>
        </Col>
        <Col>
          <LessonToolboxText
            text={text}
            placeholder={placeholder || Placeholders[currentSegmentKey]}
            onChange={updateText}
          />
        </Col>
      </Row>
      {children}
    </Card>
  );
};

export default EditorSidebar;
