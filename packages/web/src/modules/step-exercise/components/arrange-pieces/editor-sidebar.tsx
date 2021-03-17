import React from 'react';
import { ExerciseArrangePiecesStep, ExerciseToolboxProps } from '@types';
import { ui } from '@application';
import { SegmentSidebar } from '../segment';

const { Container, Text } = ui;

export default ({
  step,
  updateStep,
}: ExerciseToolboxProps<ExerciseArrangePiecesStep>) => {
  const state = step.state.task;

  return (
    <SegmentSidebar step={step} updateStep={updateStep}>
      <Container>
        {state.moves?.map(move => (
          <Text key={move.move?.[0]}>
            {move.move?.[0]} {move.move?.[1]}
          </Text>
        ))}
      </Container>
    </SegmentSidebar>
  );
};
