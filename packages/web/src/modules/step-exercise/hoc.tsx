import React, { ComponentType } from 'react';
import { ExerciseSegmentKeys, ExerciseToolboxProps } from '@types';
import { ui } from '@application';

import { SegmentProps } from './types';
import { useUpdateSegment } from './hooks';

const { Tooltip, OverlayTrigger } = ui;

// TODO - make more restrictive type, task should expect 'task' segment component
interface Segments<T extends SegmentProps> {
  task: ComponentType<T>;
  explanation: ComponentType<T>;
  hint: ComponentType<T>;
}
const getSegment = <T extends SegmentProps>(
  Segments: Segments<T>,
  activeSegment: ExerciseSegmentKeys,
) => Segments[activeSegment];

export const withSegments = <T extends SegmentProps>(Segments: Segments<T>) => (
  props: T,
) => {
  const { activeSegment } = props.step.state;
  const Segment = getSegment(Segments, activeSegment || 'task');
  return <Segment {...props} />;
};

export const withSegmentSidebars = <T extends SegmentProps>(
  Segments: Segments<T>,
): ComponentType<ExerciseToolboxProps> => props => {
  const sidebar = Object.keys(Segments).map(segmentKey => {
    const segment = props.step.state[segmentKey as ExerciseSegmentKeys];
    const updateSegment = useUpdateSegment(
      props.step,
      props.updateStep,
      segmentKey as ExerciseSegmentKeys,
    );
    const Segment = getSegment(Segments, segmentKey as ExerciseSegmentKeys);
    const segmentProps = {
      step: props.step,
      updateStep: props.updateStep,
      segment,
      updateSegment,
    } as T;

    return (
      <OverlayTrigger
        placement="left"
        trigger="focus"
        overlay={
          <Tooltip
            className="mr-3 text-capitalize"
            id={`${props.step.id}-${segmentKey}`}
          >
            {segmentKey}
          </Tooltip>
        }
        key={segmentKey}
      >
        <Segment {...segmentProps} />
      </OverlayTrigger>
    );
  });

  return <>{sidebar}</>;
};
