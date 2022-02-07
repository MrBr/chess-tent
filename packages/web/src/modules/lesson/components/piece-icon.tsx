import React from 'react';
import { PieceIcon } from '@types';
import styled from '@emotion/styled';

const PieceIconComponent = styled<PieceIcon>(({ className, piece }) => (
  <span className={`${className} piece ${piece.color} ${piece.role}`} />
))({
  display: 'inline-block',
  width: 13,
  height: 13,
  backgroundSize: '100%',
});

export default PieceIconComponent;
