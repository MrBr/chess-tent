import React from 'react';
import { ExerciseArrangePiecesStep } from '@types';
import { ui, components } from '@application';
import { SegmentSidebar } from '../segment';
import { withSegmentSidebars } from '../../hoc';
import { SegmentToolboxProps } from '../../types';

const { Container, Text } = ui;
const { PieceIcon } = components;

const TaskSidebar = (
  props: SegmentToolboxProps<ExerciseArrangePiecesStep, 'task'>,
) => {
  const { segment } = props;

  return (
    <SegmentSidebar {...props}>
      <Container>
        {segment.moves?.map(move => (
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
export default withSegmentSidebars<
  SegmentToolboxProps<ExerciseArrangePiecesStep, 'task'>
>({
  task: TaskSidebar,
  explanation: SegmentSidebar,
  hint: SegmentSidebar,
});
