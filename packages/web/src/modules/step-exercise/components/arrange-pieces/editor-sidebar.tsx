import React from 'react';
import { ExerciseArrangePiecesStep, ExerciseToolboxProps } from '@types';
import { ui, components } from '@application';
import { SegmentSidebar } from '../segment';

const { Container, Text } = ui;
const { PieceIcon } = components;

export default ({
  step,
  updateStep,
}: ExerciseToolboxProps<ExerciseArrangePiecesStep>) => {
  const state = step.state.task;

  return (
    <SegmentSidebar step={step} updateStep={updateStep}>
      <Container>
        {state.moves?.map(move => (
          <div>
            <PieceIcon piece={move.piece} />
            <Text key={move.move?.[0]} className="d-inline-block">
              {move.move?.[0]} {move.move?.[1]}
            </Text>
          </div>
        ))}
      </Container>
    </SegmentSidebar>
  );
};
