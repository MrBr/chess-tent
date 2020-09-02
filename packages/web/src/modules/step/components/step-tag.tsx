import styled from '@emotion/styled';
import React from 'react';
import { StepTag } from '@types';

export default styled(({ children, className, step }) => (
  <span className={className}>{children}</span>
))(({ active }) => ({
  background: active
    ? 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)'
    : 'transparent',
  borderRadius: 6,
  padding: '4px 8px',
  color: active ? '#FFFFFF' : '#2F3849',
  display: 'inline-block',
})) as StepTag;
