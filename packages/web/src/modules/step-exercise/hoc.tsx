import React, { ComponentType, ComponentProps } from 'react';
import {
  ExerciseSegmentKeys,
  ExerciseStep,
  ExerciseToolboxProps,
} from '@types';

import { SegmentBoardProps, SegmentProps } from './types';
import { useUpdateSegment } from './hooks';

// TODO - make more restrictive type, task should expect 'task' segment component
interface BoardSegments<T extends ExerciseStep<any, any>> {
  task: ComponentType<SegmentBoardProps<T, 'task'>>;
  explanation: ComponentType<SegmentBoardProps<T, 'explanation'>>;
  hint: ComponentType<SegmentBoardProps<T, 'hint'>>;
}

interface SidebarSegments<T extends ExerciseStep<any, any>> {
  task: ComponentType<SegmentProps<T, 'task'>>;
  explanation: ComponentType<SegmentProps<T, 'explanation'>>;
  hint: ComponentType<SegmentProps<T, 'hint'>>;
}

export const withSegmentBoards =
  <T extends ExerciseStep<any, any>>(Segments: BoardSegments<T>) =>
  (props: SegmentBoardProps<T, ExerciseSegmentKeys>) => {
    const { activeSegment } = props.step.state;
    const Segment = Segments[(activeSegment || 'task') as ExerciseSegmentKeys];
    return <Segment {...props} />;
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
      } as ComponentProps<typeof Segment>;

      return <Segment {...segmentProps} key={segmentKey} />;
    });

    return <>{sidebar}</>;
  };
