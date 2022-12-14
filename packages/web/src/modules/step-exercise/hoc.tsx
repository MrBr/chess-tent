import React, { ComponentType, ComponentProps } from 'react';
import {
  ExerciseSegmentKeys,
  ExerciseStep,
  ExerciseToolboxProps,
} from '@types';

import { SegmentBoardProps, SegmentSidebarProps } from './types';
import { useUpdateSegment } from './hooks';

// TODO - make more restrictive type, task should expect 'task' segment component
interface BoardSegments<T extends ExerciseStep<any, any>> {
  task: ComponentType<SegmentBoardProps<T, 'task'>>;
  explanation: ComponentType<SegmentBoardProps<T, 'explanation'>>;
  hint: ComponentType<SegmentBoardProps<T, 'hint'>>;
}

interface SidebarSegments<T extends ExerciseStep<any, any>> {
  task: ComponentType<SegmentSidebarProps<T, 'task'>>;
  explanation: ComponentType<SegmentSidebarProps<T, 'explanation'>>;
  hint: ComponentType<SegmentSidebarProps<T, 'hint'>>;
}

export const withSegmentBoards =
  <T extends ExerciseStep<any, any>>(Segments: BoardSegments<T>) =>
  (
    props: Omit<
      SegmentBoardProps<T, ExerciseSegmentKeys>,
      'segment' | 'updateSegment'
    >,
  ) => {
    const { activeSegment } = props.step.state;
    const Segment = Segments[(activeSegment || 'task') as ExerciseSegmentKeys];
    const updateSegment = useUpdateSegment(
      props.step,
      props.updateStep,
      activeSegment,
    );
    const segment = props.step.state[activeSegment];

    return (
      <Segment {...props} updateSegment={updateSegment} segment={segment} />
    );
  };

export const withSegmentSidebars =
  <T extends ExerciseStep<any, any>>(
    Segments: SidebarSegments<T>,
  ): ComponentType<ExerciseToolboxProps> =>
  props => {
    const sidebar = Object.keys(Segments).map(segmentKey => {
      const segment = props.step.state[segmentKey as ExerciseSegmentKeys];
      const updateSegment = useUpdateSegment(
        props.step,
        props.updateStep,
        segmentKey as ExerciseSegmentKeys,
      );
      const Segment = Segments[segmentKey as ExerciseSegmentKeys];
      const segmentProps = {
        step: props.step,
        updateStep: props.updateStep,
        segment,
        updateSegment,
        active: props.active,
      } as ComponentProps<typeof Segment>;

      return <Segment {...segmentProps} key={segmentKey} />;
    });

    return <>{sidebar}</>;
  };
