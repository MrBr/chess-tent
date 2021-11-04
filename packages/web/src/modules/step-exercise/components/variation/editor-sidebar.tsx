import React, { useCallback } from 'react';
import { ExerciseSegmentKeys, ExerciseVariationStep } from '@types';
import { components, ui } from '@application';
import { SegmentToolboxProps } from '../../types';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';

const { Text, Row } = ui;
const { StepMove, StepTag } = components;

const TaskSidebar = (
  props: SegmentToolboxProps<ExerciseVariationStep, 'task'>,
) => {
  const { segment, updateSegment } = props;
  const { moves, activeMoveIndex } = segment;

  const handleUpdateActiveMove = useCallback(
    (activeMoveIndex: number, event: React.SyntheticEvent<Element, Event>) => {
      event.stopPropagation();
      updateSegment({ activeMoveIndex });
    },
    [updateSegment],
  );

  return (
    <SegmentSidebar {...props}>
      <Row noGutters>
        <Text fontSize="small">Moves:</Text>
        <Row className="align-items-center m-0">
          <StepTag
            active={activeMoveIndex === -1}
            collapse
            onClick={event => handleUpdateActiveMove(-1, event)}
          >
            <Text className="mb-0" fontSize="small" color="title">
              FEN
            </Text>
          </StepTag>
          {moves?.map((move, index) => (
            <StepTag
              active={activeMoveIndex === index}
              collapse
              onClick={event => handleUpdateActiveMove(index, event)}
              key={index}
            >
              <StepMove move={move} suffix=" " prefix=" " blackIndexSign=" " />
            </StepTag>
          ))}
        </Row>
      </Row>
    </SegmentSidebar>
  );
};

export default withSegmentSidebars<
  SegmentToolboxProps<ExerciseVariationStep, ExerciseSegmentKeys>
>({
  task: TaskSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
