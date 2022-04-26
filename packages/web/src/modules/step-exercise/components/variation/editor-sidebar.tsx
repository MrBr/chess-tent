import React, { useCallback } from 'react';
import { ExerciseVariationStep } from '@types';
import { components, ui } from '@application';

import { SegmentToolboxProps } from '../../types';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';
import { isFENSetup } from './utils';

const { Text } = ui;
const { StepMove, StepTag } = components;

const TaskSidebar = (
  props: SegmentToolboxProps<ExerciseVariationStep, 'task'>,
) => {
  const { segment, updateSegment } = props;
  const { moves, activeMoveIndex } = segment;

  const handleUpdateActiveMove = useCallback(
    (
      activeMoveIndex: number | undefined | null,
      event: React.SyntheticEvent<Element, Event>,
    ) => {
      event.stopPropagation();
      updateSegment({ activeMoveIndex });
    },
    [updateSegment],
  );

  return (
    <SegmentSidebar {...props}>
      <Text fontSize="extra-small" className="mt-2">
        Moves:
      </Text>
      <div>
        <StepTag
          active={isFENSetup(activeMoveIndex)}
          onClick={event => handleUpdateActiveMove(null, event)}
        >
          FEN
        </StepTag>
        {moves?.map((move, index) => (
          <StepTag
            active={activeMoveIndex === index}
            onClick={event => handleUpdateActiveMove(index, event)}
            key={index}
          >
            <StepMove move={move} suffix=" " prefix=" " blackIndexSign=" " />
          </StepTag>
        ))}
      </div>
    </SegmentSidebar>
  );
};

export default withSegmentSidebars<ExerciseVariationStep>({
  task: TaskSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
