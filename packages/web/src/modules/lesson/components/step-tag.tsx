import styled from '@emotion/styled';
import React from 'react';
import { StepTag } from '@types';

export default styled<StepTag>(({ children, className, onClick }) => (
  <span className={className} onClick={onClick}>
    <span>{children}</span>
  </span>
))(({ active, collapse }) => ({
  '& > span': {
    background: active
      ? 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)'
      : 'transparent',
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
  },
  color: '#2F3849',
  display: 'inline-block',
  width: collapse ? undefined : 58,
  overflow: 'hidden',
  fontSize: 11 / 16 + 'em',
  fontWeight: 700,
}));
