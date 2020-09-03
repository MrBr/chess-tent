import styled from '@emotion/styled';
import React from 'react';
import { StepTag } from '@types';

export default styled(({ children, className, moveIndex, movedPiece }) => (
  <span className={className}>
    {moveIndex && movedPiece?.color === 'white' && moveIndex}
    <span>
      {moveIndex && movedPiece?.color === 'black' && '..'}
      {movedPiece && (
        <span className={`piece ${movedPiece.color} ${movedPiece.role}`} />
      )}
      {children}
    </span>
  </span>
))(({ active }) => ({
  '& > span': {
    background: active
      ? 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)'
      : 'transparent',
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
  },
  '.piece': {
    display: 'inline-block',
    width: 13,
    height: 13,
    backgroundSize: '100%',
  },
  color: '#2F3849',
  display: 'inline-block',
  width: 58,
  overflow: 'hidden',
  fontSize: 11 / 16 + 'em',
  fontWeight: 700,
})) as StepTag;
