import React from 'react';
import { StepMove } from '@types';
import styled from '@emotion/styled';

const StepMoveComponent: StepMove = styled(
  ({
    className,
    move,
    moveIndex,
    movedPiece,
    captured,
    prefix,
    suffix,
    blackIndexSign,
  }) => (
    <span className={className}>
      {prefix}
      {moveIndex &&
        (movedPiece?.color === 'black' ? blackIndexSign : `${moveIndex}.`)}
      {movedPiece && (
        <span className={`piece ${movedPiece.color} ${movedPiece.role}`} />
      )}
      {captured && 'x'}
      {move?.[1]}
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
