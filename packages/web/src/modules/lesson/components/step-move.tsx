import React from 'react';
import { StepMove } from '@types';
import styled from '@emotion/styled';

const StepMoveComponent: StepMove = styled(
  ({ className, move, prefix, suffix, blackIndexSign }) => (
    <span className={className}>
      {prefix}
      {move.index &&
        (move.piece?.color === 'black' ? blackIndexSign : `${move.index}.`)}
      {move.piece && (
        <span className={`piece ${move.piece.color} ${move.piece.role}`} />
      )}
      {move.captured && 'x'}
      {move.move[1]}
      {suffix}
    </span>
  ),
)({
  '.piece': {
    display: 'inline-block',
    width: 13,
    height: 13,
    backgroundSize: '100%',
  },
});
StepMoveComponent.defaultProps = {
  blackIndexSign: '..',
};
export default StepMoveComponent;
