import React, { ComponentType } from 'react';
import { ExerciseSegmentKeys, ExerciseToolboxProps } from '@types';

import { SegmentProps } from './types';
import { useUpdateExerciseStepState } from './hooks';

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
  const updateStepState = useUpdateExerciseStepState(
    props.updateStep,
    props.step,
  );

  const sidebar = Object.keys(Segments).map(segmentKey => {
    const segment = props.step.state[segmentKey as ExerciseSegmentKeys];
    const updateSegment = (
      patch: T extends SegmentProps<infer T, infer K>
        ? Partial<T['state'][K]>
        : never,
    ) => updateStepState({ [segmentKey]: patch });
    const Segment = getSegment(Segments, segmentKey as ExerciseSegmentKeys);
    const segmentProps = {
      step: props.step,
      updateStep: props.updateStep,
      segment,
      updateSegment,
    } as T;
    return <Segment {...segmentProps} key={segmentKey} />;
  });

  return <>{sidebar}</>;
};
