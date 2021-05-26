import React, { useCallback } from 'react';
import { ExerciseToolboxProps, ExerciseVariationStep } from '@types';
import { components, ui } from '@application';
import { SegmentSidebar } from '../segment';
import { useUpdateExerciseStateProp } from '../../hooks';

const { Text, Row } = ui;
const { StepMove, StepTag } = components;

export default ({
  step,
  updateStep,
}: ExerciseToolboxProps<ExerciseVariationStep>) => {
  const {
    task: { moves, activeMoveIndex },
  } = step.state;
  const updateActiveMoveIndex = useUpdateExerciseStateProp(updateStep, step, [
    'task',
    'activeMoveIndex',
  ]);

  const handleUpdateActiveMove = useCallback(
    (index: number, event: React.SyntheticEvent<Element, Event>) => {
      event.stopPropagation();
      updateActiveMoveIndex(index);
    },
    [updateActiveMoveIndex],
  );

  return (
    <SegmentSidebar step={step} updateStep={updateStep}>
      <>
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
      </>
    </SegmentSidebar>
  );
};
